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
    
    @Select("SELECT eventType, COUNT(*) as count FROM user_behavior " +
            "WHERE createTime >= #{startTime} GROUP BY eventType ORDER BY count DESC")
    List<Map<String, Object>> getEventStats(@Param("startTime") LocalDateTime startTime);
    
    @Select("SELECT eventName, COUNT(*) as count FROM user_behavior " +
            "WHERE createTime >= #{startTime} AND eventType = #{eventType} " +
            "GROUP BY eventName ORDER BY count DESC LIMIT 10")
    List<Map<String, Object>> getTopEvents(@Param("startTime") LocalDateTime startTime, 
                                          @Param("eventType") String eventType);
    
    @Select("SELECT HOUR(createTime) as hour, COUNT(*) as count FROM user_behavior " +
            "WHERE createTime >= #{startTime} GROUP BY HOUR(createTime) ORDER BY hour")
    List<Map<String, Object>> getHourlyStats(@Param("startTime") LocalDateTime startTime);
    
    @Select("SELECT COUNT(*) FROM user_behavior WHERE createTime >= #{startTime} AND success = false")
    Integer getErrorCount(@Param("startTime") LocalDateTime startTime);
    
    @Select("SELECT eventType, eventName, createTime, ip, deviceType " +
            "FROM user_behavior WHERE createTime >= #{startTime} " +
            "ORDER BY createTime DESC LIMIT 20")
    List<Map<String, Object>> getRecentActivities(@Param("startTime") LocalDateTime startTime);
}
