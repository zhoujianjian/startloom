package com.starloom.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.starloom.entity.SiteStats;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface SiteStatsMapper extends BaseMapper<SiteStats> {
    
    // 增加真实计数（同时检查日期重置）
    @Update("UPDATE site_stats SET " +
            "real_total_count = real_total_count + 1, " +
            "real_today_count = IF(today_date = CURDATE(), real_today_count + 1, 1), " +
            "today_date = CURDATE() " +
            "WHERE id = 1")
    int incrementCount();
    
    // 更新在线人数
    @Update("UPDATE site_stats SET real_online_count = #{count} WHERE id = 1")
    int updateOnlineCount(int count);
}
