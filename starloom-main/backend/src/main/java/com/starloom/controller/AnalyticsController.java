package com.starloom.controller;

import com.starloom.common.Result;
import com.starloom.entity.EventLog;
import com.starloom.entity.User;
import com.starloom.service.AnalyticsService;
import com.starloom.service.UserService;
import com.starloom.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    
    private final AnalyticsService analyticsService;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    /**
     * 上报埋点事件（异步处理，快速返回）
     */
    @PostMapping("/track")
    public Result<?> track(@RequestBody TrackRequest request, HttpServletRequest httpRequest) {
        // 先获取IP（需要在主线程获取）
        String ip = getClientIp(httpRequest);
        
        // 异步处理埋点
        EventLog event = new EventLog();
        event.setEventType(request.getEventType());
        event.setToolId(request.getToolId());
        event.setSessionId(request.getSessionId());
        event.setIp(ip);
        event.setDeviceType(request.getDeviceType());
        
        analyticsService.trackEvent(event);
        
        // 异步更新在线状态
        if (request.getSessionId() != null) {
            analyticsService.updateOnlineStatus(request.getSessionId());
        }
        
        // 立即返回，不等待异步任务完成
        return Result.success();
    }
    
    /**
     * 心跳接口
     */
    @PostMapping("/heartbeat")
    public Result<?> heartbeat(@RequestBody HeartbeatRequest request) {
        if (request.getSessionId() != null) {
            analyticsService.updateOnlineStatus(request.getSessionId());
        }
        return Result.success();
    }
    
    /**
     * 获取实时统计数据（用户看到的，含基数+波动）
     */
    @GetMapping("/realtime")
    public Result<?> getRealTimeStats() {
        Map<String, Object> data = new HashMap<>();
        data.putAll(analyticsService.getRealTimeStats());
        data.put("toolRanking", analyticsService.getToolRanking(5));
        return Result.success(data);
    }
    
    /**
     * 获取工具统计
     */
    @GetMapping("/tool-stats")
    public Result<?> getToolStats() {
        return Result.success(analyticsService.getAllToolStats());
    }
    
    /**
     * 管理员接口：获取真实统计数据（通过token验证）
     */
    @GetMapping("/admin/real-stats")
    public Result<?> getAdminRealStats(@RequestHeader(value = "Authorization", required = false) String token) {
        if (!isAdmin(token)) {
            return Result.error("无权访问");
        }
        return Result.success(analyticsService.getRealStats());
    }
    
    /**
     * 管理员接口：获取工具真实统计（通过token验证）
     */
    @GetMapping("/admin/tool-stats")
    public Result<?> getAdminToolStats(@RequestHeader(value = "Authorization", required = false) String token) {
        if (!isAdmin(token)) {
            return Result.error("无权访问");
        }
        return Result.success(analyticsService.getAllToolStatsWithReal());
    }
    
    /**
     * 验证是否是管理员
     */
    private boolean isAdmin(String token) {
        if (token == null || token.isEmpty()) {
            return false;
        }
        try {
            if (!jwtUtil.validateToken(token)) {
                return false;
            }
            Long userId = jwtUtil.getUserId(token);
            User user = userService.getById(userId);
            return user != null && user.isAdmin();
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * 生成会话ID
     */
    @GetMapping("/session")
    public Result<?> getSession() {
        Map<String, String> data = new HashMap<>();
        data.put("sessionId", UUID.randomUUID().toString().replace("-", ""));
        return Result.success(data);
    }
    
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
    
    @Data
    public static class TrackRequest {
        private String eventType;
        private String toolId;
        private String sessionId;
        private String deviceType;
    }
    
    @Data
    public static class HeartbeatRequest {
        private String sessionId;
    }
}
