package com.starloom.controller;

import com.starloom.common.Result;
import com.starloom.service.UserService;
import com.starloom.service.AdminStatsService;
import com.starloom.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sysAdm")
@RequiredArgsConstructor
public class AdminController {
    
    private final UserService userService;
    private final AdminStatsService adminStatsService;
    
    /**
     * 管理员登录
     */
    @PostMapping("/login")
    public Result<?> login(@RequestBody Map<String, String> params, @RequestHeader("X-Real-IP") String ip) {
        String username = params.get("username");
        String password = params.get("password");
        return userService.adminLogin(username, password, ip);
    }
    
    /**
     * 仪表板数据
     */
    @GetMapping("/dashboard")
    public Result<Map<String, Object>> getDashboard() {
        Map<String, Object> dashboard = adminStatsService.getDashboardStats();
        return Result.success(dashboard);
    }
    
    /**
     * 访问统计
     */
    @GetMapping("/stats/pageviews")
    public Result<List<Map<String, Object>>> getPageViewStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LocalDateTime startTime = startDate != null ? 
            LocalDateTime.parse(startDate + "T00:00:00") : LocalDateTime.now().minusDays(30);
        LocalDateTime endTime = endDate != null ? 
            LocalDateTime.parse(endDate + "T23:59:59") : LocalDateTime.now();
        
        List<Map<String, Object>> stats = adminStatsService.getPageViewStats(startTime, endTime);
        return Result.success(stats);
    }
    
    @GetMapping("/stats/top-pages")
    public Result<List<Map<String, Object>>> getTopPagesStats(
            @RequestParam(required = false) String startDate) {
        
        LocalDateTime startTime = startDate != null ? 
            LocalDateTime.parse(startDate + "T00:00:00") : LocalDateTime.now().minusDays(7);
        
        List<Map<String, Object>> stats = adminStatsService.getTopPagesStats(startTime);
        return Result.success(stats);
    }
    
    @GetMapping("/stats/devices")
    public Result<List<Map<String, Object>>> getDeviceStats(
            @RequestParam(required = false) String startDate) {
        
        LocalDateTime startTime = startDate != null ? 
            LocalDateTime.parse(startDate + "T00:00:00") : LocalDateTime.now().minusDays(7);
        
        List<Map<String, Object>> stats = adminStatsService.getDeviceStats(startTime);
        return Result.success(stats);
    }
    
    /**
     * 用户统计
     */
    @GetMapping("/stats/users")
    public Result<Map<String, Object>> getUserStats() {
        Map<String, Object> stats = adminStatsService.getUserStats();
        return Result.success(stats);
    }
    
    @GetMapping("/stats/user-growth")
    public Result<List<Map<String, Object>>> getUserGrowthStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LocalDateTime startTime = startDate != null ? 
            LocalDateTime.parse(startDate + "T00:00:00") : LocalDateTime.now().minusDays(30);
        LocalDateTime endTime = endDate != null ? 
            LocalDateTime.parse(endDate + "T23:59:59") : LocalDateTime.now();
        
        List<Map<String, Object>> stats = adminStatsService.getUserGrowthStats(startTime, endTime);
        return Result.success(stats);
    }
    
    /**
     * 订单统计
     */
    @GetMapping("/stats/orders")
    public Result<Map<String, Object>> getOrderStats() {
        Map<String, Object> stats = adminStatsService.getOrderStats();
        return Result.success(stats);
    }
    
    @GetMapping("/stats/order-trend")
    public Result<List<Map<String, Object>>> getOrderTrendStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LocalDateTime startTime = startDate != null ? 
            LocalDateTime.parse(startDate + "T00:00:00") : LocalDateTime.now().minusDays(30);
        LocalDateTime endTime = endDate != null ? 
            LocalDateTime.parse(endDate + "T23:59:59") : LocalDateTime.now();
        
        List<Map<String, Object>> stats = adminStatsService.getOrderTrendStats(startTime, endTime);
        return Result.success(stats);
    }
    
    /**
     * 在线用户
     */
    @GetMapping("/online-users")
    public Result<List<Map<String, Object>>> getOnlineUsers() {
        List<Map<String, Object>> users = adminStatsService.getOnlineUsers();
        return Result.success(users);
    }
    
    @GetMapping("/online-users/count")
    public Result<Integer> getOnlineUserCount() {
        Integer count = adminStatsService.getOnlineUserCount();
        return Result.success(count);
    }
    
    /**
     * 行为分析
     */
    @GetMapping("/stats/behaviors")
    public Result<List<Map<String, Object>>> getBehaviorStats(
            @RequestParam(required = false) String startDate) {
        
        LocalDateTime startTime = startDate != null ? 
            LocalDateTime.parse(startDate + "T00:00:00") : LocalDateTime.now().minusDays(7);
        
        List<Map<String, Object>> stats = adminStatsService.getBehaviorStats(startTime);
        return Result.success(stats);
    }
    
    @GetMapping("/stats/hourly-activity")
    public Result<List<Map<String, Object>>> getHourlyActivityStats(
            @RequestParam(required = false) String startDate) {
        
        LocalDateTime startTime = startDate != null ? 
            LocalDateTime.parse(startDate + "T00:00:00") : LocalDateTime.now().minusDays(1);
        
        List<Map<String, Object>> stats = adminStatsService.getHourlyActivityStats(startTime);
        return Result.success(stats);
    }
    
    /**
     * 实时监控
     */
    @GetMapping("/realtime/metrics")
    public Result<Map<String, Object>> getRealTimeMetrics() {
        Map<String, Object> metrics = adminStatsService.getRealTimeMetrics();
        return Result.success(metrics);
    }
    
    @GetMapping("/realtime/activities")
    public Result<List<Map<String, Object>>> getRecentActivities() {
        List<Map<String, Object>> activities = adminStatsService.getRecentActivities();
        return Result.success(activities);
    }
}
