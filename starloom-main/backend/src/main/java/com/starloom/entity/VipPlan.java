package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("t_vip_plan")
public class VipPlan {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String name;
    private String code;
    private Integer durationDays;
    private BigDecimal originalPrice;
    private BigDecimal currentPrice;
    private String discount;
    private String badge;
    private Integer vipLevel;
    private Integer sortOrder;
    private Integer status;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    private Integer deleted;
}
