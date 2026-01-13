package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("tag")
public class Tag {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String name;
    
    private Integer articleCount;
    
    private Integer sortOrder;
    
    private Integer status;
    
    private String createBy;
    
    private String updateBy;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
