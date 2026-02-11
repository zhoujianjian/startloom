package com.starloom.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.starloom.entity.PageView;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper
public interface PageViewMapper extends BaseMapper<PageView> {
    
    @Select("SELECT DATE(create_time) as date, COUNT(*) as views, COUNT(DISTINCT session_id) as visitors " +
            "FROM page_view WHERE create_time >= #{startTime} AND create_time <= #{endTime} " +
            "GROUP BY DATE(create_time) ORDER BY date DESC")
    List<Map<String, Object>> getDailyStats(@Param("startTime") LocalDateTime startTime, 
                                            @Param("endTime") LocalDateTime endTime);
    
    @Select("SELECT page_url AS pageUrl, COUNT(*) as views FROM page_view " +
            "WHERE create_time >= #{startTime} GROUP BY page_url ORDER BY views DESC LIMIT 10")
    List<Map<String, Object>> getTopPages(@Param("startTime") LocalDateTime startTime);
    
    @Select("SELECT device_type AS deviceType, COUNT(*) as count FROM page_view " +
            "WHERE create_time >= #{startTime} GROUP BY device_type ORDER BY count DESC")
    List<Map<String, Object>> getDeviceStats(@Param("startTime") LocalDateTime startTime);
    
    @Select("SELECT COUNT(*) FROM page_view WHERE create_time >= #{startTime}")
    Integer getTodayViews(@Param("startTime") LocalDateTime startTime);
    
    @Select("SELECT COUNT(DISTINCT session_id) FROM page_view WHERE create_time >= #{startTime}")
    Integer getTodayVisitors(@Param("startTime") LocalDateTime startTime);
}
