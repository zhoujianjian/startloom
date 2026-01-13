package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("category")
public class Category {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long parentId;
    
    private String parentName;
    
    private String name;
    
    private String fullName;
    
    private String slug;
    
    private String icon;
    
    private String description;
    
    private Integer level;
    
    private Integer sortOrder;
    
    private Integer articleCount;
    
    private Integer status;
    
    private String createBy;
    
    private String updateBy;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
