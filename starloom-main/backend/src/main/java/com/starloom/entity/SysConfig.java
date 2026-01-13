package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("sys_config")
public class SysConfig {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String configGroup;
    private String configKey;
    private String configValue;
    private String configType;
    private String configName;
    private String description;
    private String defaultValue;
    private String options;
    private Integer sortOrder;
    private Integer isPublic;
    private Integer isSystem;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
