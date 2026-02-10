package com.starloom.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.starloom.common.Result;
import com.starloom.entity.Order;
import com.starloom.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/sysAdm/orders")
@RequiredArgsConstructor
public class AdminOrderController {
    
    private final OrderMapper orderMapper;
    
    /**
     * 订单列表
     */
    @GetMapping("/list")
    public Result<Page<Order>> getOrderList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String keyword) {
        
        Page<Order> pageParam = new Page<>(page, size);
        QueryWrapper<Order> wrapper = new QueryWrapper<>();
        
        if (status != null) {
            wrapper.eq("status", status);
        }
        
        if (startDate != null) {
            LocalDateTime start = LocalDateTime.parse(startDate + "T00:00:00");
            wrapper.ge("create_time", start);
        }
        
        if (endDate != null) {
            LocalDateTime end = LocalDateTime.parse(endDate + "T23:59:59");
            wrapper.le("create_time", end);
        }
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            // 支持多个关键词用逗号分隔
            String[] keywords = keyword.split(",");
            for (String kw : keywords) {
                String trimmedKw = kw.trim();
                if (!trimmedKw.isEmpty()) {
                    wrapper.and(w -> w.like("order_no", trimmedKw)
                            .or().like("plan_name", trimmedKw)
                            .or().like("user_remark", trimmedKw));
                }
            }
        }
        
        wrapper.orderByDesc("create_time");
        Page<Order> result = orderMapper.selectPage(pageParam, wrapper);
        
        return Result.success(result);
    }
    
    /**
     * 订单详情
     */
    @GetMapping("/{id}")
    public Result<Order> getOrderDetail(@PathVariable Long id) {
        Order order = orderMapper.selectById(id);
        if (order == null) {
            return Result.error("订单不存在");
        }
        return Result.success(order);
    }
    
    /**
     * 确认订单
     */
    @PostMapping("/{id}/confirm")
    public Result<?> confirmOrder(@PathVariable Long id, @RequestBody Map<String, String> params) {
        Order order = orderMapper.selectById(id);
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        if (order.getStatus() != 10) {
            return Result.error("订单状态不正确");
        }
        
        String adminRemark = params.get("adminRemark");
        String confirmBy = params.get("confirmBy");
        
        order.setStatus(1); // 已支付
        order.setConfirmTime(LocalDateTime.now());
        order.setConfirmBy(confirmBy);
        order.setAdminRemark(adminRemark);
        order.setPayTime(LocalDateTime.now());
        
        orderMapper.updateById(order);
        return Result.success();
    }
    
    /**
     * 取消订单
     */
    @PostMapping("/{id}/cancel")
    public Result<?> cancelOrder(@PathVariable Long id, @RequestBody Map<String, String> params) {
        Order order = orderMapper.selectById(id);
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        if (order.getStatus() == 2 || order.getStatus() == 3) {
            return Result.error("订单已取消或退款");
        }
        
        String adminRemark = params.get("adminRemark");
        
        order.setStatus(2); // 已取消
        order.setAdminRemark(adminRemark);
        
        orderMapper.updateById(order);
        return Result.success();
    }
    
    /**
     * 退款订单
     */
    @PostMapping("/{id}/refund")
    public Result<?> refundOrder(@PathVariable Long id, @RequestBody Map<String, String> params) {
        Order order = orderMapper.selectById(id);
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        if (order.getStatus() != 1) {
            return Result.error("只能退款已支付的订单");
        }
        
        String adminRemark = params.get("adminRemark");
        
        order.setStatus(3); // 已退款
        order.setAdminRemark(adminRemark);
        
        orderMapper.updateById(order);
        return Result.success();
    }
    
    /**
     * 完成订单
     */
    @PostMapping("/{id}/complete")
    public Result<?> completeOrder(@PathVariable Long id) {
        Order order = orderMapper.selectById(id);
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        if (order.getStatus() != 1) {
            return Result.error("只能完成已支付的订单");
        }
        
        order.setStatus(4); // 已完成
        order.setCompleteTime(LocalDateTime.now());
        
        orderMapper.updateById(order);
        return Result.success();
    }
    
    /**
     * 导出订单
     */
    @GetMapping("/export")
    public Result<?> exportOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "xlsx") String format) {
        
        // 这里应该实现导出逻辑，返回文件下载链接或文件内容
        // 暂时返回成功响应
        return Result.success("导出功能待实现");
    }
}
