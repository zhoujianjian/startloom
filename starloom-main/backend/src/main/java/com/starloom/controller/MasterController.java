package com.starloom.controller;

import com.starloom.common.Result;
import com.starloom.entity.Order;
import com.starloom.entity.Product;
import com.starloom.entity.User;
import com.starloom.service.ProductService;
import com.starloom.service.SysConfigService;
import com.starloom.service.EmailService;
import com.starloom.mapper.OrderMapper;
import com.starloom.mapper.UserMapper;
import com.starloom.mapper.PaymentConfigMapper;
import com.starloom.entity.PaymentConfig;
import com.starloom.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/master")
@RequiredArgsConstructor
public class MasterController {

    private final ProductService productService;
    private final SysConfigService sysConfigService;
    private final OrderMapper orderMapper;
    private final UserMapper userMapper;
    private final PaymentConfigMapper paymentConfigMapper;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    /**
     * 获取大师服务配置（服务列表 + 系统配置）
     */
    @GetMapping("/config")
    public Result<?> getMasterServiceConfig() {
        Map<String, Object> data = new HashMap<>();
        
        // 获取大师服务商品列表
        List<Product> products = productService.getMasterServices();
        data.put("products", products);
        
        // 获取大师服务相关配置
        Map<String, String> config = sysConfigService.getConfigMapByGroup("master");
        data.put("config", config);
        
        return Result.success(data);
    }
    
    /**
     * 获取指定商品详情
     */
    @GetMapping("/product/{id}")
    public Result<?> getProductDetail(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product == null) {
            return Result.error(404, "商品不存在");
        }
        return Result.success(product);
    }
    
    /**
     * 创建大师服务订单
     */
    @PostMapping("/order/create")
    public Result<?> createMasterOrder(@RequestHeader(value = "Authorization", required = false) String token,
                                        @RequestBody Map<String, Object> params) {
        Long userId = null;
        if (token != null && jwtUtil.validateToken(token)) {
            userId = jwtUtil.getUserId(token);
        }
        
        Long productId = params.get("productId") != null ? Long.valueOf(params.get("productId").toString()) : null;
        String productName = (String) params.get("productName");
        Object priceObj = params.get("price");
        BigDecimal price = priceObj != null ? new BigDecimal(priceObj.toString()) : BigDecimal.ZERO;
        String orderType = (String) params.getOrDefault("orderType", "consult"); // pay 或 consult
        
        // 生成订单号: MS + 时间戳 + 随机数
        String orderNo = "MS" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) 
                        + String.format("%04d", new Random().nextInt(10000));
        
        // 创建订单
        Order order = new Order();
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setPlanId(productId);
        order.setPlanName(productName);
        order.setAmount(price);
        order.setStatus(0); // 待支付/待咨询
        order.setRemark("大师服务-" + ("pay".equals(orderType) ? "付费预约" : "免费咨询"));
        order.setCreateTime(LocalDateTime.now());
        order.setDeleted(0);
        
        orderMapper.insert(order);
        
        // 发送通知
        sendOrderNotification(order, userId, orderType);
        
        Map<String, Object> data = new HashMap<>();
        data.put("orderNo", orderNo);
        data.put("amount", price);
        data.put("productName", productName);
        data.put("orderType", orderType);
        
        return Result.success(data);
    }
    
    /**
     * 发送订单通知（邮件+QQ）
     */
    private void sendOrderNotification(Order order, Long userId, String orderType) {
        Map<String, String> configs = getAllPaymentConfigs();
        
        if (!"true".equals(configs.get("notify_enabled"))) {
            return;
        }
        
        // 获取用户信息
        String userInfo = "游客";
        if (userId != null) {
            User user = userMapper.selectById(userId);
            if (user != null) {
                userInfo = user.getPhone() != null ? user.getPhone() : 
                          user.getEmail() != null ? user.getEmail() : 
                          user.getWechat() != null ? user.getWechat() : "用户" + userId;
            }
        }
        
        String typeText = "pay".equals(orderType) ? "付费预约" : "免费咨询";
        String subject = "【天机命理】新大师服务订单 - " + typeText;
        String content = String.format(
            "收到新的大师服务订单：\n\n" +
            "订单类型：%s\n" +
            "订单号：%s\n" +
            "用户：%s\n" +
            "服务：%s\n" +
            "金额：%.2f元\n" +
            "下单时间：%s\n\n" +
            "请及时添加用户微信跟进！",
            typeText,
            order.getOrderNo(),
            userInfo,
            order.getPlanName(),
            order.getAmount(),
            order.getCreateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        );
        
        // 发送邮件通知
        String notifyEmail = configs.get("notify_email");
        if (notifyEmail != null && !notifyEmail.isEmpty()) {
            try {
                emailService.sendSimpleMail(notifyEmail, subject, content);
                log.info("大师服务订单通知邮件已发送: {}", order.getOrderNo());
            } catch (Exception e) {
                log.error("发送订单通知邮件失败", e);
            }
        }
        
        // 发送QQ邮箱通知
        String notifyQQ = configs.get("notify_qq");
        if (notifyQQ != null && !notifyQQ.isEmpty()) {
            try {
                emailService.sendSimpleMail(notifyQQ + "@qq.com", subject, content);
                log.info("大师服务订单通知已发送到QQ邮箱: {}", notifyQQ);
            } catch (Exception e) {
                log.error("发送QQ邮箱通知失败", e);
            }
        }
    }
    
    /**
     * 获取支付配置
     */
    private Map<String, String> getAllPaymentConfigs() {
        List<PaymentConfig> configs = paymentConfigMapper.selectList(null);
        return configs.stream().collect(
            Collectors.toMap(PaymentConfig::getConfigKey, 
                c -> c.getConfigValue() != null ? c.getConfigValue() : "")
        );
    }
}
