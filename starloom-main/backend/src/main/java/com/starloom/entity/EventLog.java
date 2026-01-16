package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("event_log")
public class EventLog {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String eventType;
    private String toolId;
    private String sessionId;
    private String ip;
    private String deviceType;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
