package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("product")
public class Product {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String productType;
    private String productCode;
    private String name;
    private String subtitle;
    private String description;
    private String icon;
    private String coverImage;
    private String images;
    
    private BigDecimal price;
    private BigDecimal originalPrice;
    private BigDecimal costPrice;
    private String currency;
    
    private Integer stock;
    private Integer salesCount;
    private Integer limitPerUser;
    
    private Integer validDays;
    private LocalDateTime validStart;
    private LocalDateTime validEnd;
    
    private String tag;
    private String groupCode;
    private Long categoryId;
    private String extra;
    
    private Integer sortOrder;
    private Integer isRecommend;
    private Integer status;
    
    private String createBy;
    private String updateBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
