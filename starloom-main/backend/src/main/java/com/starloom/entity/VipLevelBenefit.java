package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_vip_level_benefit")
public class VipLevelBenefit {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Integer vipLevel;
    private Long benefitId;
    private String benefitValue;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
