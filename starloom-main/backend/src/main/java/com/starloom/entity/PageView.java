package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("page_view")
public class PageView {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String sessionId;
    private String userId;
    private String pageUrl;
    private String pageTitle;
    private String referrer;
    private String userAgent;
    private String ip;
    private String deviceType;
    private String browser;
    private String os;
    private Long stayTime;      // 停留时间(秒)
    private LocalDateTime visitTime;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableLogic
    private Integer deleted;
}
