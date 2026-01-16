package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("online_session")
public class OnlineSession {
    @TableId(type = IdType.INPUT)
    private String sessionId;
    private LocalDateTime lastActive;
}
