package com.starloom.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.starloom.entity.EventLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper
public interface EventLogMapper extends BaseMapper<EventLog> {

    @Select("SELECT COUNT(*) FROM event_log WHERE event_type = 'pv' AND created_at >= #{startTime} AND created_at <= #{endTime}")
    Long countPv(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    @Select("SELECT COUNT(DISTINCT session_id) FROM event_log WHERE event_type = 'pv' AND created_at >= #{startTime} AND created_at <= #{endTime}")
    Long countUniqueVisitors(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    @Select("SELECT DATE(created_at) AS date, COUNT(*) AS views, COUNT(DISTINCT session_id) AS visitors " +
            "FROM event_log " +
            "WHERE event_type = 'pv' AND created_at >= #{startTime} AND created_at <= #{endTime} " +
            "GROUP BY DATE(created_at) ORDER BY date DESC")
    List<Map<String, Object>> getDailyPvStats(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    @Select("SELECT device_type AS type, COUNT(*) AS count " +
            "FROM event_log " +
            "WHERE created_at >= #{startTime} AND created_at <= #{endTime} " +
            "GROUP BY device_type ORDER BY count DESC")
    List<Map<String, Object>> getDeviceStats(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    @Select("SELECT event_type AS type, COUNT(*) AS count " +
            "FROM event_log " +
            "WHERE created_at >= #{startTime} AND created_at <= #{endTime} " +
            "GROUP BY event_type ORDER BY count DESC")
    List<Map<String, Object>> getBehaviorStats(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    @Select("SELECT HOUR(created_at) AS hour, COUNT(*) AS count " +
            "FROM event_log " +
            "WHERE created_at >= #{startTime} AND created_at <= #{endTime} " +
            "GROUP BY HOUR(created_at) ORDER BY hour")
    List<Map<String, Object>> getHourlyStats(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    @Select("SELECT tool_id AS toolId, COUNT(*) AS views " +
            "FROM event_log " +
            "WHERE event_type IN ('tool_open','tool_use') AND created_at >= #{startTime} AND created_at <= #{endTime} " +
            "GROUP BY tool_id ORDER BY views DESC LIMIT #{limit}")
    List<Map<String, Object>> getTopTools(@Param("startTime") LocalDateTime startTime,
                                         @Param("endTime") LocalDateTime endTime,
                                         @Param("limit") Integer limit);

    @Select("SELECT event_type AS eventType, tool_id AS toolId, session_id AS sessionId, ip, device_type AS deviceType, created_at AS createdAt " +
            "FROM event_log " +
            "WHERE created_at >= #{startTime} AND created_at <= #{endTime} " +
            "ORDER BY created_at DESC LIMIT 50")
    List<Map<String, Object>> getRecentEvents(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
}
