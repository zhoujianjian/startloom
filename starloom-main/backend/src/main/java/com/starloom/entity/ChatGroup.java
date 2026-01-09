package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_chat_group")
public class ChatGroup {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private String title;

    private String type;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;

    // 前端需要的字段名是 msggroup
    @JsonProperty("msggroup")
    public String getMsggroup() {
        return id != null ? id.toString() : null;
    }

    // 前端需要的字段名是 content (显示标题)
    @JsonProperty("content")
    public String getContentAlias() {
        return title;
    }
}
