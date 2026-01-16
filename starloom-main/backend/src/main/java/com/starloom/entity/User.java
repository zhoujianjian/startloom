package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_user")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String email;
    
    private String phone;
    
    private String wechat;
    
    private String password;
    
    private String walletAddress;
    
    private String nickname;
    
    private String avatar;
    
    private Integer vipLevel;
    
    private LocalDateTime vipExpireTime;
    
    // 用户角色: user-普通用户, admin-管理员
    private String role;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    private Integer deleted;
    
    // 判断是否是管理员
    public boolean isAdmin() {
        return "admin".equals(this.role);
    }
}
