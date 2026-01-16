package com.starloom.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.starloom.entity.ToolStats;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

@Mapper
public interface ToolStatsMapper extends BaseMapper<ToolStats> {
    
    // 增加工具使用计数
    @Update("UPDATE tool_stats SET " +
            "real_total = real_total + 1, " +
            "real_today = IF(today_date = CURDATE(), real_today + 1, 1), " +
            "today_date = CURDATE() " +
            "WHERE tool_id = #{toolId}")
    int incrementCount(String toolId);
    
    // 获取热门工具排行（按今日使用量）
    @Select("SELECT tool_id, tool_name, tool_icon, category, " +
            "(base_total + real_total) as display_total, " +
            "(base_today + IF(today_date = CURDATE(), real_today, 0)) as display_today " +
            "FROM tool_stats ORDER BY display_today DESC LIMIT #{limit}")
    List<Map<String, Object>> getHotTools(int limit);
    
    // 获取所有工具统计
    @Select("SELECT tool_id, tool_name, tool_icon, category, " +
            "(base_total + real_total) as display_total, " +
            "(base_today + IF(today_date = CURDATE(), real_today, 0)) as display_today " +
            "FROM tool_stats ORDER BY sort_order")
    List<Map<String, Object>> getAllStats();
    
    // 获取所有工具统计（含真实数据，管理员用）
    @Select("SELECT tool_id as toolId, tool_name as toolName, tool_icon as toolIcon, category, " +
            "base_total as baseTotal, base_today as baseToday, " +
            "real_total as realTotal, " +
            "IF(today_date = CURDATE(), real_today, 0) as realToday " +
            "FROM tool_stats ORDER BY sort_order")
    List<Map<String, Object>> getAllStatsWithReal();
}
