package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user_behavior")
public class UserBehavior {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String userId;
    private String sessionId;
    private String eventType;     // login, logout, click, view, purchase, search
    private String eventName;     // 具体事件名称
    private String pageUrl;
    private String targetUrl;     // 目标页面或元素
    private String properties;    // JSON格式存储额外属性
    private String ip;
    private String deviceType;
    private String userAgent;
    private Long duration;        // 事件持续时间(毫秒)
    private Boolean success;     // 事件是否成功
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableLogic
    private Integer deleted;
}
