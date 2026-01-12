package com.starloom.controller;

import com.starloom.common.Result;
import com.starloom.service.PaymentService;
import com.starloom.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final JwtUtil jwtUtil;

    /**
     * 获取支付选项（前端展示用）
     */
    @GetMapping("/options")
    public Result<?> getPaymentOptions() {
        return paymentService.getPaymentOptions();
    }

    /**
     * 创建支付订单
     */
    @PostMapping("/create")
    public Result<?> createPayOrder(@RequestHeader("Authorization") String token,
                                     @RequestBody Map<String, String> params) {
        if (!jwtUtil.validateToken(token)) {
            return Result.error("请先登录");
        }
        Long userId = jwtUtil.getUserId(token);
        String orderNo = params.get("orderNo");
        String payType = params.get("payType"); // wechat / alipay
        return paymentService.createPayOrder(userId, orderNo, payType);
    }

    /**
     * 用户确认已支付（个人收款码模式）
     */
    @PostMapping("/confirm")
    public Result<?> confirmPaid(@RequestHeader("Authorization") String token,
                                  @RequestBody Map<String, String> params) {
        if (!jwtUtil.validateToken(token)) {
            return Result.error("请先登录");
        }
        Long userId = jwtUtil.getUserId(token);
        String orderNo = params.get("orderNo");
        String userRemark = params.get("remark"); // 用户填写的转账备注
        return paymentService.confirmPaid(userId, orderNo, userRemark);
    }

    // ============ 管理员接口 ============

    /**
     * 获取待确认订单
     */
    @GetMapping("/admin/pending")
    public Result<?> getPendingOrders(@RequestHeader("Authorization") String token) {
        // TODO: 添加管理员权限验证
        if (!jwtUtil.validateToken(token)) {
            return Result.error("请先登录");
        }
        return paymentService.getPendingOrders();
    }

    /**
     * 管理员确认订单
     */
    @PostMapping("/admin/confirm")
    public Result<?> adminConfirmOrder(@RequestHeader("Authorization") String token,
                                        @RequestBody Map<String, Object> params) {
        // TODO: 添加管理员权限验证
        if (!jwtUtil.validateToken(token)) {
            return Result.error("请先登录");
        }
        String orderNo = (String) params.get("orderNo");
        Boolean approved = (Boolean) params.get("approved");
        String adminRemark = (String) params.get("remark");
        return paymentService.adminConfirmOrder(orderNo, approved != null && approved, adminRemark);
    }

    /**
     * 获取支付配置（管理员）
     */
    @GetMapping("/admin/config")
    public Result<?> getPaymentConfig(@RequestHeader("Authorization") String token) {
        // TODO: 添加管理员权限验证
        if (!jwtUtil.validateToken(token)) {
            return Result.error("请先登录");
        }
        return paymentService.getAllConfigsForAdmin();
    }

    /**
     * 更新支付配置（管理员）
     */
    @PostMapping("/admin/config")
    public Result<?> updatePaymentConfig(@RequestHeader("Authorization") String token,
                                          @RequestBody Map<String, String> configs) {
        // TODO: 添加管理员权限验证
        if (!jwtUtil.validateToken(token)) {
            return Result.error("请先登录");
        }
        return paymentService.updateConfigs(configs);
    }
}
