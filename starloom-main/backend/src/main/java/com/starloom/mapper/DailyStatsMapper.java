package com.starloom.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.starloom.entity.DailyStats;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Mapper
public interface DailyStatsMapper extends BaseMapper<DailyStats> {
    
    @Select("SELECT * FROM daily_stats WHERE statsDate >= #{startDate} AND statsDate <= #{endDate} " +
            "ORDER BY statsDate DESC")
    List<DailyStats> getStatsByDateRange(@Param("startDate") LocalDate startDate, 
                                        @Param("endDate") LocalDate endDate);
    
    @Select("SELECT SUM(pageViews) as totalViews, SUM(uniqueVisitors) as totalVisitors, " +
            "SUM(totalRevenue) as totalRevenue FROM daily_stats WHERE statsDate >= #{startDate} " +
            "AND statsDate <= #{endDate}")
    Map<String, Object> getSummaryStats(@Param("startDate") LocalDate startDate, 
                                       @Param("endDate") LocalDate endDate);
}
