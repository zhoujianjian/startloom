package com.starloom.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.starloom.entity.PageView;
import com.starloom.mapper.PageViewMapper;
import com.starloom.service.PageViewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class PageViewServiceImpl extends ServiceImpl<PageViewMapper, PageView> implements PageViewService {
    
    private final PageViewMapper pageViewMapper;
    private final RedisTemplate<String, Object> redisTemplate;
    
    @Override
    public void recordPageView(PageView pageView) {
        pageView.setCreateTime(LocalDateTime.now());
        save(pageView);
        
        // 更新实时统计缓存
        String today = LocalDateTime.now().toLocalDate().toString();
        String cacheKey = "stats:pageview:" + today;
        redisTemplate.opsForHash().increment(cacheKey, "total", 1);
        if (pageView.getSessionId() != null) {
            redisTemplate.opsForSet().add("stats:visitors:" + today, pageView.getSessionId());
        }
        redisTemplate.expire(cacheKey, 7, TimeUnit.DAYS);
        redisTemplate.expire("stats:visitors:" + today, 7, TimeUnit.DAYS);
    }
    
    @Override
    public List<Map<String, Object>> getDailyStats(LocalDateTime startTime, LocalDateTime endTime) {
        return pageViewMapper.getDailyStats(startTime, endTime);
    }
    
    @Override
    public List<Map<String, Object>> getTopPages(LocalDateTime startTime) {
        return pageViewMapper.getTopPages(startTime);
    }
    
    @Override
    public List<Map<String, Object>> getDeviceStats(LocalDateTime startTime) {
        return pageViewMapper.getDeviceStats(startTime);
    }
    
    @Override
    public Map<String, Object> getTodayStats() {
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        Map<String, Object> stats = new HashMap<>();
        stats.put("pageViews", pageViewMapper.getTodayViews(todayStart));
        stats.put("uniqueVisitors", pageViewMapper.getTodayVisitors(todayStart));
        return stats;
    }
    
    @Override
    public List<Map<String, Object>> getRealTimeStats() {
        List<Map<String, Object>> realTimeStats = new ArrayList<>();
        
        // 获取最近1小时的数据
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        Map<String, Object> hourlyData = new HashMap<>();
        hourlyData.put("pageViews", pageViewMapper.getTodayViews(oneHourAgo));
        hourlyData.put("uniqueVisitors", pageViewMapper.getTodayVisitors(oneHourAgo));
        realTimeStats.add(hourlyData);
        
        return realTimeStats;
    }
}
