package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_feedback")
public class Feedback {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    private String nickname;
    private String contact;
    private String content;
    private String images;
    private String type; // feedback/suggestion/bug
    private Integer status; // 0待处理/1已处理/2已回复
    private String reply;
    private LocalDateTime replyTime;
    private Long replyBy;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    private Integer deleted;
}
