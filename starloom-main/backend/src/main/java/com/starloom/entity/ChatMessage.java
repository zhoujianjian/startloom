package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_chat_message")
public class ChatMessage {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long groupId;
    
    private Long userId;
    
    private String role;  // user / assistant
    
    private String content;
    
    private String type;  // user / text / gpt / tem
    
    private String subModule;  // 子模块类型，如 a-5, k-1
    
    private Integer base64Type;  // 0-普通文本, 1-图片, 2-语音
    
    private String base64Content;  // base64内容
    
    private String genByGpt;  // 语音转文字后的内容
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableLogic
    private Integer deleted;
}
