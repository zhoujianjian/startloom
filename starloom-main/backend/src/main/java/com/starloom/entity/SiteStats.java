package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("site_stats")
public class SiteStats {
    @TableId(type = IdType.INPUT)
    private Integer id;
    
    // 基数配置
    private Long baseTotalCount;
    private Integer baseTodayCount;
    private Integer baseOnlineCount;
    
    // 真实数据
    private Long realTotalCount;
    private Integer realTodayCount;
    private Integer realOnlineCount;
    
    private LocalDate todayDate;
    private LocalDateTime updatedAt;
}
