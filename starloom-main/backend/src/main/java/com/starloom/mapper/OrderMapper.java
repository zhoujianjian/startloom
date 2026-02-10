package com.starloom.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.starloom.entity.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper
public interface OrderMapper extends BaseMapper<Order> {
    
    @Select("SELECT COUNT(*) FROM t_order WHERE createTime >= #{startTime}")
    Integer getTodayOrders(@Param("startTime") LocalDateTime startTime);
    
    @Select("SELECT COALESCE(SUM(amount), 0) FROM t_order WHERE status = 1 AND createTime >= #{startTime}")
    java.math.BigDecimal getTodayRevenue(@Param("startTime") LocalDateTime startTime);
    
    @Select("SELECT COUNT(*) FROM t_order WHERE status = 1")
    Long getPaidOrderCount();
    
    @Select("SELECT COUNT(*) FROM t_order WHERE status = 10")
    Long getPendingOrderCount();
    
    @Select("SELECT COALESCE(SUM(amount), 0) FROM t_order WHERE status = 1")
    java.math.BigDecimal getTotalRevenue();
    
    @Select("SELECT DATE(createTime) as date, COUNT(*) as orders, COALESCE(SUM(amount), 0) as revenue " +
            "FROM t_order WHERE createTime >= #{startTime} AND createTime <= #{endTime} " +
            "GROUP BY DATE(createTime) ORDER BY date DESC")
    List<Map<String, Object>> getOrderTrendStats(@Param("startTime") LocalDateTime startTime, 
                                                 @Param("endTime") LocalDateTime endTime);
}
