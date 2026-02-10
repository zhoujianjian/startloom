package com.starloom.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.starloom.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    
    @Select("SELECT COUNT(*) FROM t_user WHERE vipLevel > 0")
    Long getVipUserCount();
    
    @Select("SELECT COUNT(*) FROM t_user WHERE createTime >= #{startTime}")
    Integer getTodayNewUsers(@Param("startTime") LocalDateTime startTime);
    
    @Select("SELECT COUNT(*) FROM t_user WHERE lastLoginTime >= #{startTime}")
    Integer getActiveUserCount(@Param("startTime") LocalDateTime startTime);
    
    @Select("SELECT DATE(createTime) as date, COUNT(*) as users " +
            "FROM t_user WHERE createTime >= #{startTime} AND createTime <= #{endTime} " +
            "GROUP BY DATE(createTime) ORDER BY date DESC")
    List<Map<String, Object>> getUserGrowthStats(@Param("startTime") LocalDateTime startTime, 
                                                 @Param("endTime") LocalDateTime endTime);
}
