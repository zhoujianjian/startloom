package com.starloom.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.starloom.common.Result;
import com.starloom.entity.Order;
import com.starloom.entity.PaymentConfig;
import com.starloom.entity.User;
import com.starloom.entity.VipPlan;
import com.starloom.mapper.OrderMapper;
import com.starloom.mapper.PaymentConfigMapper;
import com.starloom.mapper.UserMapper;
import com.starloom.mapper.VipPlanMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentConfigMapper configMapper;
    private final OrderMapper orderMapper;
    private final UserMapper userMapper;
    private final VipPlanMapper vipPlanMapper;
    private final EmailService emailService;

    /**
     * 获取支付配置（前端用）
     */
    public Result<?> getPaymentOptions() {
        Map<String, String> configs = getAllConfigs();
        String mode = configs.getOrDefault("payment_mode", "qrcode");
        
        Map<String, Object> data = new HashMap<>();
        data.put("mode", mode);
        
        if ("qrcode".equals(mode)) {
            // 个人收款码模式
            Map<String, Object> qrcode = new HashMap<>();
            if ("true".equals(configs.get("qrcode_enabled_wechat"))) {
                qrcode.put("wechat", configs.get("qrcode_wechat"));
            }
            if ("true".equals(configs.get("qrcode_enabled_alipay"))) {
                qrcode.put("alipay", configs.get("qrcode_alipay"));
            }
            data.put("qrcode", qrcode);
        } else {
            // 正式商户模式
            Map<String, Boolean> official = new HashMap<>();
            official.put("wechat", "true".equals(configs.get("wxpay_enabled")));
            official.put("alipay", "true".equals(configs.get("alipay_enabled")));
            data.put("official", official);
        }
        
        return Result.success(data);
    }

    /**
     * 创建支付订单
     */
    @Transactional
    public Result<?> createPayOrder(Long userId, String orderNo, String payType) {
        Order order = orderMapper.selectOne(
            new LambdaQueryWrapper<Order>()
                .eq(Order::getOrderNo, orderNo)
                .eq(Order::getUserId, userId)
                .eq(Order::getDeleted, 0)
        );
        
        if (order == null) {
            return Result.error("订单不存在");
        }
        if (order.getStatus() != 0) {
            return Result.error("订单状态异常");
        }
        
        Map<String, String> configs = getAllConfigs();
        String mode = configs.getOrDefault("payment_mode", "qrcode");
        
        order.setPayType(payType);
        order.setPayMode(mode);
        orderMapper.updateById(order);
        
        Map<String, Object> data = new HashMap<>();
        data.put("orderNo", orderNo);
        data.put("amount", order.getAmount());
        data.put("payType", payType);
        data.put("mode", mode);
        
        if ("qrcode".equals(mode)) {
            // 返回收款码
            String qrcodeKey = "wechat".equals(payType) ? "qrcode_wechat" : "qrcode_alipay";
            data.put("qrcodeUrl", configs.get(qrcodeKey));
            data.put("remark", "VIP" + orderNo.substring(orderNo.length() - 6)); // 转账备注
        } else {
            // TODO: 调用正式支付接口，返回支付链接
            // 这里预留接口，后续可以集成 IJPay 等支付SDK
            data.put("payUrl", ""); // 支付链接
        }
        
        return Result.success(data);
    }

    /**
     * 用户确认已支付（个人收款码模式）
     */
    @Transactional
    public Result<?> confirmPaid(Long userId, String orderNo, String userRemark) {
        Order order = orderMapper.selectOne(
            new LambdaQueryWrapper<Order>()
                .eq(Order::getOrderNo, orderNo)
                .eq(Order::getUserId, userId)
                .eq(Order::getDeleted, 0)
        );
        
        if (order == null) {
            return Result.error("订单不存在");
        }
        if (order.getStatus() != 0) {
            return Result.error("订单状态异常");
        }
        
        // 更新订单状态为待确认
        order.setStatus(10); // 10=待管理员确认
        order.setUserRemark(userRemark);
        orderMapper.updateById(order);
        
        // 发送通知
        sendOrderNotification(order, userId);
        
        return Result.success("已提交，请等待确认");
    }

    /**
     * 管理员确认订单
     */
    @Transactional
    public Result<?> adminConfirmOrder(String orderNo, boolean approved, String adminRemark) {
        Order order = orderMapper.selectOne(
            new LambdaQueryWrapper<Order>()
                .eq(Order::getOrderNo, orderNo)
                .eq(Order::getDeleted, 0)
        );
        
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        if (approved) {
            // 确认支付成功
            order.setStatus(1); // 已支付
            order.setPayTime(LocalDateTime.now());
            order.setConfirmTime(LocalDateTime.now());
            order.setConfirmBy("admin");
            order.setAdminRemark(adminRemark);
            orderMapper.updateById(order);
            
            // 开通会员
            activateVip(order);
            
            return Result.success("订单已确认");
        } else {
            // 拒绝
            order.setStatus(2); // 已取消
            order.setAdminRemark(adminRemark);
            orderMapper.updateById(order);
            
            return Result.success("订单已拒绝");
        }
    }

    /**
     * 获取待确认订单列表（管理员用）
     */
    public Result<?> getPendingOrders() {
        List<Order> orders = orderMapper.selectList(
            new LambdaQueryWrapper<Order>()
                .eq(Order::getStatus, 10) // 待确认
                .eq(Order::getDeleted, 0)
                .orderByDesc(Order::getCreateTime)
        );
        return Result.success(orders);
    }

    /**
     * 发送订单通知
     */
    private void sendOrderNotification(Order order, Long userId) {
        Map<String, String> configs = getAllConfigs();
        
        if (!"true".equals(configs.get("notify_enabled"))) {
            return;
        }
        
        User user = userMapper.selectById(userId);
        String userInfo = user != null ? 
            (user.getPhone() != null ? user.getPhone() : 
             user.getEmail() != null ? user.getEmail() : 
             user.getWechat() != null ? user.getWechat() : "用户" + userId) : "用户" + userId;
        
        String subject = "【天机命理】新订单待确认";
        String content = String.format(
            "收到新的VIP订单，请及时确认：\n\n" +
            "订单号：%s\n" +
            "用户：%s\n" +
            "套餐：%s\n" +
            "金额：%.2f元\n" +
            "支付方式：%s\n" +
            "用户备注：%s\n" +
            "下单时间：%s\n\n" +
            "请登录后台确认订单。",
            order.getOrderNo(),
            userInfo,
            order.getPlanName(),
            order.getAmount(),
            "wechat".equals(order.getPayType()) ? "微信" : "支付宝",
            order.getUserRemark() != null ? order.getUserRemark() : "无",
            order.getCreateTime()
        );
        
        // 发送邮件通知
        String notifyEmail = configs.get("notify_email");
        if (notifyEmail != null && !notifyEmail.isEmpty()) {
            try {
                emailService.sendSimpleMail(notifyEmail, subject, content);
                log.info("订单通知邮件已发送: {}", order.getOrderNo());
            } catch (Exception e) {
                log.error("发送订单通知邮件失败", e);
            }
        }
        
        // TODO: QQ通知可以通过QQ邮箱或第三方服务实现
        String notifyQQ = configs.get("notify_qq");
        if (notifyQQ != null && !notifyQQ.isEmpty()) {
            // 发送到QQ邮箱
            try {
                emailService.sendSimpleMail(notifyQQ + "@qq.com", subject, content);
                log.info("订单通知已发送到QQ邮箱: {}", notifyQQ);
            } catch (Exception e) {
                log.error("发送QQ邮箱通知失败", e);
            }
        }
    }

    /**
     * 开通VIP
     */
    private void activateVip(Order order) {
        VipPlan plan = vipPlanMapper.selectById(order.getPlanId());
        User user = userMapper.selectById(order.getUserId());
        
        if (plan == null || user == null) return;
        
        LocalDateTime expireTime = user.getVipExpireTime();
        if (expireTime == null || expireTime.isBefore(LocalDateTime.now())) {
            expireTime = LocalDateTime.now();
        }
        expireTime = expireTime.plusDays(plan.getDurationDays());
        
        user.setVipLevel(plan.getVipLevel());
        user.setVipExpireTime(expireTime);
        userMapper.updateById(user);
        
        log.info("用户 {} VIP已开通，等级：{}，到期时间：{}", user.getId(), plan.getVipLevel(), expireTime);
    }

    /**
     * 获取所有配置
     */
    private Map<String, String> getAllConfigs() {
        List<PaymentConfig> configs = configMapper.selectList(null);
        return configs.stream().collect(
            Collectors.toMap(PaymentConfig::getConfigKey, 
                c -> c.getConfigValue() != null ? c.getConfigValue() : "")
        );
    }

    /**
     * 更新配置
     */
    public Result<?> updateConfig(String key, String value) {
        PaymentConfig config = configMapper.selectOne(
            new LambdaQueryWrapper<PaymentConfig>().eq(PaymentConfig::getConfigKey, key)
        );
        if (config == null) {
            config = new PaymentConfig();
            config.setConfigKey(key);
            config.setConfigValue(value);
            configMapper.insert(config);
        } else {
            config.setConfigValue(value);
            configMapper.updateById(config);
        }
        return Result.success();
    }

    /**
     * 批量更新配置
     */
    public Result<?> updateConfigs(Map<String, String> configs) {
        for (Map.Entry<String, String> entry : configs.entrySet()) {
            updateConfig(entry.getKey(), entry.getValue());
        }
        return Result.success();
    }

    /**
     * 获取所有配置（管理员用）
     */
    public Result<?> getAllConfigsForAdmin() {
        return Result.success(getAllConfigs());
    }
}
