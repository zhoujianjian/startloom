package com.starloom.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface AdminStatsService {
    
    // 仪表板统计
    Map<String, Object> getDashboardStats();
    
    // 访问统计
    List<Map<String, Object>> getPageViewStats(LocalDateTime startTime, LocalDateTime endTime);
    List<Map<String, Object>> getTopPagesStats(LocalDateTime startTime);
    List<Map<String, Object>> getDeviceStats(LocalDateTime startTime);
    
    // 用户统计
    Map<String, Object> getUserStats();
    List<Map<String, Object>> getUserGrowthStats(LocalDateTime startTime, LocalDateTime endTime);
    
    // 订单统计
    Map<String, Object> getOrderStats();
    List<Map<String, Object>> getOrderTrendStats(LocalDateTime startTime, LocalDateTime endTime);
    
    // 在线用户
    List<Map<String, Object>> getOnlineUsers();
    Integer getOnlineUserCount();
    
    // 行为分析
    List<Map<String, Object>> getBehaviorStats(LocalDateTime startTime);
    List<Map<String, Object>> getHourlyActivityStats(LocalDateTime startTime);
    
    // 实时监控
    Map<String, Object> getRealTimeMetrics();
    List<Map<String, Object>> getRecentActivities();
}
