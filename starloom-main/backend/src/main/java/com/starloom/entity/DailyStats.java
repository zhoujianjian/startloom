package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@TableName("daily_stats")
public class DailyStats {
    @TableId(type = IdType.INPUT)
    private LocalDate statsDate;
    
    // 页面访问统计
    private Integer pageViews;
    private Integer uniqueVisitors;
    private Integer newUsers;
    private Integer bounceRate;
    
    // 用户统计
    private Integer totalUsers;
    private Integer activeUsers;
    private Integer vipUsers;
    private Integer newVipUsers;
    
    // 订单统计
    private Integer totalOrders;
    private Integer paidOrders;
    private Integer cancelledOrders;
    private java.math.BigDecimal totalRevenue;
    private java.math.BigDecimal vipRevenue;
    
    // 系统统计
    private Integer avgOnlineTime;
    private Integer peakOnlineCount;
    private Integer errorCount;
    private Integer apiCalls;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private java.time.LocalDateTime updateTime;
}
