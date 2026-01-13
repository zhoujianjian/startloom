package com.starloom.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("article")
public class Article {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long categoryId;
    
    private String categoryName;
    
    private Long parentCategoryId;
    
    private String parentCategoryName;
    
    private String fullCategory;
    
    private String title;
    
    private String summary;
    
    private String content;
    
    private String contentHtml;
    
    private String author;
    
    private String tags;
    
    private String source;
    
    private String sourceUrl;
    
    private String coverImage;
    
    private String images;
    
    private Integer wordCount;
    
    private LocalDateTime publishTime;
    
    private Integer viewCount;
    
    private Integer likeCount;
    
    private Integer collectCount;
    
    private Integer commentCount;
    
    private Integer isTop;
    
    private Integer isRecommend;
    
    private Integer status;
    
    private LocalDateTime crawlTime;
    
    private String createBy;
    
    private String updateBy;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
