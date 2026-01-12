package com.starloom.controller;

import com.starloom.common.Result;
import com.starloom.service.VipService;
import com.starloom.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/vip")
@RequiredArgsConstructor
public class VipController {

    private final VipService vipService;
    private final JwtUtil jwtUtil;

    /**
     * 获取会员套餐列表
     */
    @GetMapping("/plans")
    public Result<?> getPlans() {
        return vipService.getVipPlans();
    }

    /**
     * 获取会员权益对比表
     */
    @GetMapping("/benefits")
    public Result<?> getBenefits() {
        return vipService.getBenefitsComparison();
    }

    /**
     * 获取用户会员信息
     */
    @GetMapping("/info")
    public Result<?> getUserVipInfo(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || !jwtUtil.validateToken(token)) {
            return Result.error("请先登录");
        }
        Long userId = jwtUtil.getUserId(token);
        return vipService.getUserVipInfo(userId);
    }

    /**
     * 创建订单
     */
    @PostMapping("/order/create")
    public Result<?> createOrder(@RequestHeader("Authorization") String token,
                                  @RequestBody Map<String, String> params) {
        if (!jwtUtil.validateToken(token)) {
            return Result.error("请先登录");
        }
        Long userId = jwtUtil.getUserId(token);
        String planCode = params.get("planCode");
        return vipService.createOrder(userId, planCode);
    }

    /**
     * 支付订单（模拟）
     */
    @PostMapping("/order/pay")
    public Result<?> payOrder(@RequestHeader("Authorization") String token,
                               @RequestBody Map<String, String> params) {
        if (!jwtUtil.validateToken(token)) {
            return Result.error("请先登录");
        }
        Long userId = jwtUtil.getUserId(token);
        String orderNo = params.get("orderNo");
        return vipService.payOrder(userId, orderNo);
    }

    /**
     * 获取用户订单列表
     */
    @GetMapping("/orders")
    public Result<?> getUserOrders(@RequestHeader("Authorization") String token) {
        if (!jwtUtil.validateToken(token)) {
            return Result.error("请先登录");
        }
        Long userId = jwtUtil.getUserId(token);
        return vipService.getUserOrders(userId);
    }
}
