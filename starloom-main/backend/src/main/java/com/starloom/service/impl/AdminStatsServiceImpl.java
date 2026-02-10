package com.starloom.service.impl;

import com.starloom.service.AdminStatsService;
import com.starloom.mapper.*;
import com.starloom.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminStatsServiceImpl implements AdminStatsService {
    
    private final PageViewMapper pageViewMapper;
    private final UserBehaviorMapper userBehaviorMapper;
    private final DailyStatsMapper dailyStatsMapper;
    private final OrderMapper orderMapper;
    private final UserMapper userMapper;
    
    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;
    
    @Override
    public Map<String, Object> getDashboardStats() {
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime yesterdayStart = todayStart.minusDays(1);
        
        Map<String, Object> dashboard = new HashMap<>();
        
        // 今日访问
        Integer todayViews = pageViewMapper.getTodayViews(todayStart);
        Integer yesterdayViews = pageViewMapper.getTodayViews(yesterdayStart);
        dashboard.put("todayViews", todayViews);
        dashboard.put("viewsGrowth", calculateGrowth(todayViews, yesterdayViews));
        
        // 今日访客
        Integer todayVisitors = pageViewMapper.getTodayVisitors(todayStart);
        Integer yesterdayVisitors = pageViewMapper.getTodayVisitors(yesterdayStart);
        dashboard.put("todayVisitors", todayVisitors);
        dashboard.put("visitorsGrowth", calculateGrowth(todayVisitors, yesterdayVisitors));
        
        // 总用户数
        Long totalUsers = userMapper.selectCount(null);
        dashboard.put("totalUsers", totalUsers);
        
        // 在线用户数
        Integer onlineUsers = getOnlineUserCount();
        dashboard.put("onlineUsers", onlineUsers);
        
        // 今日订单
        Integer todayOrders = orderMapper.getTodayOrders(todayStart);
        Integer yesterdayOrders = orderMapper.getTodayOrders(yesterdayStart);
        dashboard.put("todayOrders", todayOrders);
        dashboard.put("ordersGrowth", calculateGrowth(todayOrders, yesterdayOrders));
        
        // 今日收入
        java.math.BigDecimal todayRevenue = orderMapper.getTodayRevenue(todayStart);
        java.math.BigDecimal yesterdayRevenue = orderMapper.getTodayRevenue(yesterdayStart);
        dashboard.put("todayRevenue", todayRevenue);
        dashboard.put("revenueGrowth", calculateRevenueGrowth(todayRevenue, yesterdayRevenue));
        
        return dashboard;
    }
    
    @Override
    public List<Map<String, Object>> getPageViewStats(LocalDateTime startTime, LocalDateTime endTime) {
        return pageViewMapper.getDailyStats(startTime, endTime);
    }
    
    @Override
    public List<Map<String, Object>> getTopPagesStats(LocalDateTime startTime) {
        return pageViewMapper.getTopPages(startTime);
    }
    
    @Override
    public List<Map<String, Object>> getDeviceStats(LocalDateTime startTime) {
        return pageViewMapper.getDeviceStats(startTime);
    }
    
    @Override
    public Map<String, Object> getUserStats() {
        Map<String, Object> userStats = new HashMap<>();
        
        // 总用户数
        Long totalUsers = userMapper.selectCount(null);
        userStats.put("totalUsers", totalUsers);
        
        // VIP用户数
        Long vipUsers = userMapper.getVipUserCount();
        userStats.put("vipUsers", vipUsers);
        
        // 今日新增用户
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        Integer todayNewUsers = userMapper.getTodayNewUsers(todayStart);
        userStats.put("todayNewUsers", todayNewUsers);
        
        // 活跃用户数（最近7天）
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        Integer activeUsers = userMapper.getActiveUserCount(sevenDaysAgo);
        userStats.put("activeUsers", activeUsers);
        
        return userStats;
    }
    
    @Override
    public List<Map<String, Object>> getUserGrowthStats(LocalDateTime startTime, LocalDateTime endTime) {
        return userMapper.getUserGrowthStats(startTime, endTime);
    }
    
    @Override
    public Map<String, Object> getOrderStats() {
        Map<String, Object> orderStats = new HashMap<>();
        
        // 总订单数
        Long totalOrders = orderMapper.selectCount(null);
        orderStats.put("totalOrders", totalOrders);
        
        // 已支付订单数
        Long paidOrders = orderMapper.getPaidOrderCount();
        orderStats.put("paidOrders", paidOrders);
        
        // 待确认订单数
        Long pendingOrders = orderMapper.getPendingOrderCount();
        orderStats.put("pendingOrders", pendingOrders);
        
        // 总收入
        java.math.BigDecimal totalRevenue = orderMapper.getTotalRevenue();
        orderStats.put("totalRevenue", totalRevenue);
        
        return orderStats;
    }
    
    @Override
    public List<Map<String, Object>> getOrderTrendStats(LocalDateTime startTime, LocalDateTime endTime) {
        return orderMapper.getOrderTrendStats(startTime, endTime);
    }
    
    @Override
    public List<Map<String, Object>> getOnlineUsers() {
        if (redisTemplate == null) {
            return new ArrayList<>();
        }
        
        Set<String> onlineSessions = redisTemplate.keys("online_session:*");
        List<Map<String, Object>> onlineUsers = new ArrayList<>();
        
        for (String sessionKey : onlineSessions) {
            Map<String, Object> userInfo = (Map<String, Object>) redisTemplate.opsForValue().get(sessionKey);
            if (userInfo != null) {
                onlineUsers.add(userInfo);
            }
        }
        
        return onlineUsers.stream()
                .sorted((a, b) -> ((LocalDateTime) b.get("lastActive")).compareTo((LocalDateTime) a.get("lastActive")))
                .limit(50)
                .collect(Collectors.toList());
    }
    
    @Override
    public Integer getOnlineUserCount() {
        if (redisTemplate == null) {
            return 0;
        }
        
        Set<String> onlineSessions = redisTemplate.keys("online_session:*");
        return onlineSessions.size();
    }
    
    @Override
    public List<Map<String, Object>> getBehaviorStats(LocalDateTime startTime) {
        return userBehaviorMapper.getEventStats(startTime);
    }
    
    @Override
    public List<Map<String, Object>> getHourlyActivityStats(LocalDateTime startTime) {
        return userBehaviorMapper.getHourlyStats(startTime);
    }
    
    @Override
    public Map<String, Object> getRealTimeMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneHourAgo = now.minusHours(1);
        
        // 最近1小时访问量
        metrics.put("hourlyViews", pageViewMapper.getTodayViews(oneHourAgo));
        
        // 当前在线数
        metrics.put("currentOnline", getOnlineUserCount());
        
        // 最近1小时错误数
        metrics.put("hourlyErrors", userBehaviorMapper.getErrorCount(oneHourAgo));
        
        // 系统负载（简化版）
        metrics.put("systemLoad", "normal");
        
        return metrics;
    }
    
    @Override
    public List<Map<String, Object>> getRecentActivities() {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        return userBehaviorMapper.getRecentActivities(oneHourAgo);
    }
    
    private Double calculateGrowth(Integer current, Integer previous) {
        if (previous == 0) return current > 0 ? 100.0 : 0.0;
        return ((double) (current - previous) / previous) * 100;
    }
    
    private Double calculateRevenueGrowth(java.math.BigDecimal current, java.math.BigDecimal previous) {
        if (previous.compareTo(java.math.BigDecimal.ZERO) == 0) {
            return current.compareTo(java.math.BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        return current.subtract(previous).divide(previous, 2, java.math.BigDecimal.ROUND_HALF_UP)
                .multiply(java.math.BigDecimal.valueOf(100)).doubleValue();
    }
}
