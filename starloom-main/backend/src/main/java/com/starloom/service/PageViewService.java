package com.starloom.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.starloom.entity.PageView;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface PageViewService extends IService<PageView> {
    
    void recordPageView(PageView pageView);
    
    List<Map<String, Object>> getDailyStats(LocalDateTime startTime, LocalDateTime endTime);
    
    List<Map<String, Object>> getTopPages(LocalDateTime startTime);
    
    List<Map<String, Object>> getDeviceStats(LocalDateTime startTime);
    
    Map<String, Object> getTodayStats();
    
    List<Map<String, Object>> getRealTimeStats();
}
