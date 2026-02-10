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
    
    @Select("SELECT DATE(createTime) as date, COUNT(*) as views, COUNT(DISTINCT sessionId) as visitors " +
            "FROM page_view WHERE createTime >= #{startTime} AND createTime <= #{endTime} " +
            "GROUP BY DATE(createTime) ORDER BY date DESC")
    List<Map<String, Object>> getDailyStats(@Param("startTime") LocalDateTime startTime, 
                                            @Param("endTime") LocalDateTime endTime);
    
    @Select("SELECT pageUrl, COUNT(*) as views FROM page_view " +
            "WHERE createTime >= #{startTime} GROUP BY pageUrl ORDER BY views DESC LIMIT 10")
    List<Map<String, Object>> getTopPages(@Param("startTime") LocalDateTime startTime);
    
    @Select("SELECT deviceType, COUNT(*) as count FROM page_view " +
            "WHERE createTime >= #{startTime} GROUP BY deviceType ORDER BY count DESC")
    List<Map<String, Object>> getDeviceStats(@Param("startTime") LocalDateTime startTime);
    
    @Select("SELECT COUNT(*) FROM page_view WHERE createTime >= #{startTime}")
    Integer getTodayViews(@Param("startTime") LocalDateTime startTime);
    
    @Select("SELECT COUNT(DISTINCT sessionId) FROM page_view WHERE createTime >= #{startTime}")
    Integer getTodayVisitors(@Param("startTime") LocalDateTime startTime);
}
