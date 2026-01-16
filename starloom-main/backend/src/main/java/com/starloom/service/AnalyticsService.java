package com.starloom.service;

import com.starloom.entity.EventLog;
import com.starloom.entity.OnlineSession;
import com.starloom.entity.SiteStats;
import com.starloom.mapper.EventLogMapper;
import com.starloom.mapper.OnlineSessionMapper;
import com.starloom.mapper.SiteStatsMapper;
import com.starloom.mapper.ToolStatsMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsService {
    
    private final EventLogMapper eventLogMapper;
    private final ToolStatsMapper toolStatsMapper;
    private final OnlineSessionMapper onlineSessionMapper;
    private final SiteStatsMapper siteStatsMapper;
    
    private final Random random = new Random();
    
    /**
     * 异步记录事件
     */
    @Async
    public void trackEvent(EventLog event) {
        try {
            // 记录日志
            eventLogMapper.insert(event);
            
            // 如果是工具使用事件，更新统计
            if ("tool_use".equals(event.getEventType()) && event.getToolId() != null) {
                toolStatsMapper.incrementCount(event.getToolId());
                siteStatsMapper.incrementCount();
            }
        } catch (Exception e) {
            log.error("埋点记录失败: {}", e.getMessage());
        }
    }
    
    /**
     * 更新在线状态
     */
    @Async
    public void updateOnlineStatus(String sessionId) {
        try {
            OnlineSession session = new OnlineSession();
            session.setSessionId(sessionId);
            session.setLastActive(LocalDateTime.now());
            
            // upsert
            OnlineSession existing = onlineSessionMapper.selectById(sessionId);
            if (existing != null) {
                onlineSessionMapper.updateById(session);
            } else {
                onlineSessionMapper.insert(session);
            }
            
            // 更新站点在线人数
            int onlineCount = onlineSessionMapper.getOnlineCount();
            siteStatsMapper.updateOnlineCount(onlineCount);
            
        } catch (Exception e) {
            log.error("更新在线状态失败: {}", e.getMessage());
        }
    }
    
    /**
     * 获取实时统计数据（基数 + 真实数据 + 随机波动）
     */
    public Map<String, Object> getRealTimeStats() {
        Map<String, Object> stats = new HashMap<>();
        
        SiteStats siteStats = siteStatsMapper.selectById(1);
        if (siteStats == null) {
            // 返回默认值
            stats.put("totalCount", 128650);
            stats.put("todayCount", 1280 + random.nextInt(50));
            stats.put("onlineCount", 38 + random.nextInt(15));
            return stats;
        }
        
        // 检查是否需要重置今日数据
        boolean isToday = LocalDate.now().equals(siteStats.getTodayDate());
        
        // 总测算次数 = 基数 + 真实数据
        long totalCount = siteStats.getBaseTotalCount() + siteStats.getRealTotalCount();
        
        // 今日测算次数 = 基数 + 真实数据 + 随机波动(0-20)
        int todayReal = isToday ? siteStats.getRealTodayCount() : 0;
        int todayCount = siteStats.getBaseTodayCount() + todayReal + random.nextInt(20);
        
        // 在线人数 = 基数 + 真实数据 + 随机波动(0-10)
        int onlineCount = siteStats.getBaseOnlineCount() + siteStats.getRealOnlineCount() + random.nextInt(10);
        
        stats.put("totalCount", totalCount);
        stats.put("todayCount", todayCount);
        stats.put("onlineCount", onlineCount);
        
        return stats;
    }
    
    /**
     * 获取真实统计数据（管理员用）
     */
    public Map<String, Object> getRealStats() {
        Map<String, Object> stats = new HashMap<>();
        
        SiteStats siteStats = siteStatsMapper.selectById(1);
        if (siteStats == null) {
            stats.put("baseTotalCount", 0);
            stats.put("baseTodayCount", 0);
            stats.put("baseOnlineCount", 0);
            stats.put("realTotalCount", 0);
            stats.put("realTodayCount", 0);
            stats.put("realOnlineCount", 0);
            return stats;
        }
        
        stats.put("baseTotalCount", siteStats.getBaseTotalCount());
        stats.put("baseTodayCount", siteStats.getBaseTodayCount());
        stats.put("baseOnlineCount", siteStats.getBaseOnlineCount());
        stats.put("realTotalCount", siteStats.getRealTotalCount());
        stats.put("realTodayCount", siteStats.getRealTodayCount());
        stats.put("realOnlineCount", siteStats.getRealOnlineCount());
        
        return stats;
    }
    
    /**
     * 获取工具排行
     */
    public List<Map<String, Object>> getToolRanking(int limit) {
        return toolStatsMapper.getHotTools(limit);
    }
    
    /**
     * 获取所有工具统计
     */
    public List<Map<String, Object>> getAllToolStats() {
        return toolStatsMapper.getAllStats();
    }
    
    /**
     * 获取所有工具统计（含真实数据，管理员用）
     */
    public List<Map<String, Object>> getAllToolStatsWithReal() {
        return toolStatsMapper.getAllStatsWithReal();
    }
}
