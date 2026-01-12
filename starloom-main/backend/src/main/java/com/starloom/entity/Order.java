package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("t_order")
public class Order {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String orderNo;
    private Long userId;
    private Long planId;
    private String planName;
    private BigDecimal amount;
    private String payMethod;
    private String payType;      // 支付类型(wechat/alipay)
    private String payMode;      // 支付模式(qrcode/official)
    private String tradeNo;      // 第三方交易号
    private LocalDateTime payTime;
    private LocalDateTime confirmTime;  // 确认时间
    private String confirmBy;    // 确认人(admin/system)
    private Integer status;      // 0待支付/1已支付/2已取消/3已退款/10待确认
    private String remark;
    private String userRemark;   // 用户备注(如转账备注)
    private String adminRemark;  // 管理员备注
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    private Integer deleted;
}
