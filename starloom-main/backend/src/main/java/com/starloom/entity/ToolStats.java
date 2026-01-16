package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("tool_stats")
public class ToolStats {
    @TableId(type = IdType.INPUT)
    private String toolId;
    private String toolName;
    private String toolIcon;
    private String category;
    
    // 基数
    private Integer baseTotal;
    private Integer baseToday;
    
    // 真实数据
    private Long realTotal;
    private Integer realToday;
    
    private LocalDate todayDate;
    private Integer sortOrder;
    private LocalDateTime updatedAt;
    
    // 计算属性：显示数据 = 基数 + 真实数据
    public Long getDisplayTotal() {
        return (baseTotal != null ? baseTotal : 0) + (realTotal != null ? realTotal : 0);
    }
    
    public Integer getDisplayToday() {
        return (baseToday != null ? baseToday : 0) + (realToday != null ? realToday : 0);
    }
}
