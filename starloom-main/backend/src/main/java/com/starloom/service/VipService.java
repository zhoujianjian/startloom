package com.starloom.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.starloom.common.Result;
import com.starloom.entity.Order;
import com.starloom.entity.User;
import com.starloom.entity.VipPlan;
import com.starloom.mapper.OrderMapper;
import com.starloom.mapper.UserMapper;
import com.starloom.mapper.VipBenefitMapper;
import com.starloom.mapper.VipPlanMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class VipService {

    private final VipPlanMapper vipPlanMapper;
    private final VipBenefitMapper vipBenefitMapper;
    private final OrderMapper orderMapper;
    private final UserMapper userMapper;

    /**
     * 获取所有会员套餐
     */
    public Result<?> getVipPlans() {
        List<VipPlan> plans = vipPlanMapper.selectList(
            new LambdaQueryWrapper<VipPlan>()
                .eq(VipPlan::getStatus, 1)
                .eq(VipPlan::getDeleted, 0)
                .orderByAsc(VipPlan::getSortOrder)
        );
        return Result.success(plans);
    }

    /**
     * 获取会员权益对比表
     */
    public Result<?> getBenefitsComparison() {
        List<Map<String, Object>> benefits = vipBenefitMapper.getAllBenefitsComparison();
        return Result.success(benefits);
    }

    /**
     * 获取用户会员信息
     */
    public Result<?> getUserVipInfo(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        Map<String, Object> data = new HashMap<>();
        data.put("vipLevel", user.getVipLevel() != null ? user.getVipLevel() : 0);
        data.put("vipExpireTime", user.getVipExpireTime());
        data.put("isVip", user.getVipLevel() != null && user.getVipLevel() > 0 
                && user.getVipExpireTime() != null && user.getVipExpireTime().isAfter(LocalDateTime.now()));
        
        // 获取用户拥有的权益
        Integer vipLevel = user.getVipLevel() != null ? user.getVipLevel() : 0;
        List<Map<String, Object>> benefits = vipBenefitMapper.getBenefitsByLevel(vipLevel);
        data.put("benefits", benefits);
        
        return Result.success(data);
    }

    /**
     * 创建订单
     */
    @Transactional
    public Result<?> createOrder(Long userId, String planCode) {
        VipPlan plan = vipPlanMapper.selectOne(
            new LambdaQueryWrapper<VipPlan>()
                .eq(VipPlan::getCode, planCode)
                .eq(VipPlan::getStatus, 1)
                .eq(VipPlan::getDeleted, 0)
        );
        
        if (plan == null) {
            return Result.error("套餐不存在");
        }
        
        Order order = new Order();
        order.setOrderNo(generateOrderNo());
        order.setUserId(userId);
        order.setPlanId(plan.getId());
        order.setPlanName(plan.getName());
        order.setAmount(plan.getCurrentPrice());
        order.setStatus(0); // 待支付
        
        orderMapper.insert(order);
        
        Map<String, Object> data = new HashMap<>();
        data.put("orderNo", order.getOrderNo());
        data.put("amount", order.getAmount());
        data.put("planName", order.getPlanName());
        
        return Result.success(data);
    }

    /**
     * 模拟支付成功（实际项目中应该对接支付回调）
     */
    @Transactional
    public Result<?> payOrder(Long userId, String orderNo) {
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
        
        // 更新订单状态
        order.setStatus(1);
        order.setPayTime(LocalDateTime.now());
        order.setPayMethod("wechat");
        orderMapper.updateById(order);
        
        // 更新用户会员信息
        VipPlan plan = vipPlanMapper.selectById(order.getPlanId());
        User user = userMapper.selectById(userId);
        
        LocalDateTime expireTime = user.getVipExpireTime();
        if (expireTime == null || expireTime.isBefore(LocalDateTime.now())) {
            expireTime = LocalDateTime.now();
        }
        expireTime = expireTime.plusDays(plan.getDurationDays());
        
        user.setVipLevel(plan.getVipLevel());
        user.setVipExpireTime(expireTime);
        userMapper.updateById(user);
        
        Map<String, Object> data = new HashMap<>();
        data.put("vipLevel", plan.getVipLevel());
        data.put("vipExpireTime", expireTime);
        
        return Result.success(data);
    }

    /**
     * 获取用户订单列表
     */
    public Result<?> getUserOrders(Long userId) {
        List<Order> orders = orderMapper.selectList(
            new LambdaQueryWrapper<Order>()
                .eq(Order::getUserId, userId)
                .eq(Order::getDeleted, 0)
                .orderByDesc(Order::getCreateTime)
        );
        return Result.success(orders);
    }

    private String generateOrderNo() {
        return "VIP" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}
