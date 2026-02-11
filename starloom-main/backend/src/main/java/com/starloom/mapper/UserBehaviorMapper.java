package com.starloom.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.starloom.entity.UserBehavior;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper
public interface UserBehaviorMapper extends BaseMapper<UserBehavior> {
    
    @Select("SELECT event_type AS eventType, COUNT(*) AS count FROM user_behavior " +
            "WHERE create_time >= #{startTime} GROUP BY event_type ORDER BY count DESC")
    List<Map<String, Object>> getEventStats(@Param("startTime") LocalDateTime startTime);
    
    @Select("SELECT event_name AS eventName, COUNT(*) AS count FROM user_behavior " +
            "WHERE create_time >= #{startTime} AND event_type = #{eventType} " +
            "GROUP BY event_name ORDER BY count DESC LIMIT 10")
    List<Map<String, Object>> getTopEvents(@Param("startTime") LocalDateTime startTime, 
                                          @Param("eventType") String eventType);
    
    @Select("SELECT HOUR(create_time) AS hour, COUNT(*) AS count FROM user_behavior " +
            "WHERE create_time >= #{startTime} GROUP BY HOUR(create_time) ORDER BY hour")
    List<Map<String, Object>> getHourlyStats(@Param("startTime") LocalDateTime startTime);
    
    @Select("SELECT COUNT(*) FROM user_behavior WHERE create_time >= #{startTime} AND success = false")
    Integer getErrorCount(@Param("startTime") LocalDateTime startTime);
    
    @Select("SELECT event_type AS eventType, event_name AS eventName, create_time AS createTime, ip, device_type AS deviceType " +
            "FROM user_behavior WHERE create_time >= #{startTime} " +
            "ORDER BY create_time DESC LIMIT 20")
    List<Map<String, Object>> getRecentActivities(@Param("startTime") LocalDateTime startTime);
}
