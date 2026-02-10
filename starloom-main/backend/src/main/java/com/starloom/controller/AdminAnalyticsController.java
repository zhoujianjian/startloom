package com.starloom.controller;

import com.starloom.common.Result;
import com.starloom.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminAnalyticsController {
    
    private final AnalyticsService analyticsService;
    private final Random random = new Random();
    
    /**
     * 仪表板数据
     */
    @GetMapping("/dashboard")
    public Result<?> getDashboard() {
        Map<String, Object> data = new HashMap<>();
        
        // 基础统计数据
        data.put("totalUsers", 1250 + random.nextInt(100));
        data.put("todayUsers", 85 + random.nextInt(20));
        data.put("totalPageViews", 15680 + random.nextInt(500));
        data.put("todayPageViews", 520 + random.nextInt(100));
        data.put("onlineUsers", 28 + random.nextInt(10));
        data.put("bounceRate", 32.5 + random.nextDouble() * 5);
        
        return Result.success(data);
    }
    
    /**
     * 页面访问统计
     */
    @GetMapping("/stats/pageviews")
    public Result<?> getPageViews(@RequestParam(required = false) String startDate,
                                  @RequestParam(required = false) String endDate) {
        Map<String, Object> data = new HashMap<>();
        data.put("total", 15680 + random.nextInt(500));
        data.put("unique", 3240 + random.nextInt(200));
        data.put("avgDuration", 185 + random.nextInt(30));
        
        return Result.success(data);
    }
    
    /**
     * 热门页面
     */
    @GetMapping("/stats/top-pages")
    public Result<?> getTopPages(@RequestParam(required = false) String startDate,
                                 @RequestParam(required = false) String endDate,
                                 @RequestParam(defaultValue = "10") Integer limit) {
        Map<String, Object>[] pages = new Map[]{
            Map.of("page", "/dashboard", "views", 3420 + random.nextInt(100), "percentage", 21.8),
            Map.of("page", "/bazi", "views", 2850 + random.nextInt(100), "percentage", 18.2),
            Map.of("page", "/dream", "views", 2180 + random.nextInt(100), "percentage", 13.9),
            Map.of("page", "/name", "views", 1920 + random.nextInt(100), "percentage", 12.3),
            Map.of("page", "/constellation", "views", 1650 + random.nextInt(100), "percentage", 10.5)
        };
        
        return Result.success(pages);
    }
    
    /**
     * 设备统计
     */
    @GetMapping("/stats/devices")
    public Result<?> getDeviceStats(@RequestParam(required = false) String startDate,
                                    @RequestParam(required = false) String endDate) {
        Map<String, Object>[] devices = new Map[]{
            Map.of("device", "桌面端", "count", 8920, "percentage", 56.9),
            Map.of("device", "移动端", "count", 5430, "percentage", 34.6),
            Map.of("device", "平板", "count", 1330, "percentage", 8.5)
        };
        
        return Result.success(devices);
    }
    
    /**
     * 行为统计
     */
    @GetMapping("/stats/behaviors")
    public Result<?> getBehaviorStats(@RequestParam(required = false) String startDate,
                                      @RequestParam(required = false) String endDate) {
        Map<String, Object>[] behaviors = new Map[]{
            Map.of("action", "页面浏览", "count", 15680, "percentage", 45.2),
            Map.of("action", "工具使用", "count", 12450, "percentage", 35.9),
            Map.of("action", "点击事件", "count", 4850, "percentage", 14.0),
            Map.of("action", "表单提交", "count", 1680, "percentage", 4.9)
        };
        
        return Result.success(behaviors);
    }
    
    /**
     * 按小时活动统计
     */
    @GetMapping("/stats/hourly-activity")
    public Result<?> getHourlyActivity(@RequestParam(required = false) String startDate,
                                       @RequestParam(required = false) String endDate) {
        Map<String, Object>[] hourlyData = new Map[24];
        for (int i = 0; i < 24; i++) {
            hourlyData[i] = Map.of(
                "hour", i,
                "users", Math.max(10, 80 - Math.abs(i - 14) * 4 + random.nextInt(20)),
                "pageViews", Math.max(50, 300 - Math.abs(i - 14) * 15 + random.nextInt(50))
            );
        }
        
        return Result.success(hourlyData);
    }
    
    /**
     * 实时活动
     */
    @GetMapping("/realtime/activities")
    public Result<?> getActivities() {
        Map<String, Object>[] activities = new Map[]{
            Map.of("id", 1, "user", "user123", "action", "访问了八字排盘", "time", "刚刚", "page", "/bazi"),
            Map.of("id", 2, "user", "testuser", "action", "使用了周公解梦", "time", "2分钟前", "page", "/dream"),
            Map.of("id", 3, "user", "vipuser", "action", "查看了姓名测试", "time", "5分钟前", "page", "/name"),
            Map.of("id", 4, "user", "guest456", "action", "访问了星座配对", "time", "8分钟前", "page", "/constellation"),
            Map.of("id", 5, "user", "newuser", "action", "注册了账号", "time", "12分钟前", "page", "/register")
        };
        
        return Result.success(activities);
    }
    
    /**
     * 实时指标
     */
    @GetMapping("/realtime/metrics")
    public Result<?> getRealTimeMetrics() {
        Map<String, Object> data = new HashMap<>();
        data.put("onlineUsers", 28 + random.nextInt(10));
        data.put("todayPageViews", 520 + random.nextInt(100));
        data.put("activeSessions", 45 + random.nextInt(15));
        data.put("avgResponseTime", 120 + random.nextInt(50));
        
        return Result.success(data);
    }
    
    /**
     * 在线用户
     */
    @GetMapping("/online-users")
    public Result<?> getOnlineUsers() {
        Map<String, Object>[] users = new Map[]{
            Map.of("id", 1, "username", "user123", "page", "/bazi", "duration", "5分23秒", "ip", "192.168.1.100"),
            Map.of("id", 2, "username", "testuser", "page", "/dream", "duration", "3分15秒", "ip", "192.168.1.101"),
            Map.of("id", 3, "username", "vipuser", "page", "/name", "duration", "8分42秒", "ip", "192.168.1.102"),
            Map.of("id", 4, "username", "guest456", "page", "/constellation", "duration", "2分08秒", "ip", "192.168.1.103")
        };
        
        return Result.success(users);
    }
    
    /**
     * 在线用户数量
     */
    @GetMapping("/online-users/count")
    public Result<?> getOnlineUserCount() {
        return Result.success(Map.of("count", 28 + random.nextInt(10)));
    }
}
