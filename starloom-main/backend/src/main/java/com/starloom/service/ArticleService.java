package com.starloom.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.starloom.entity.Article;
import com.starloom.mapper.ArticleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ArticleService extends ServiceImpl<ArticleMapper, Article> {

    /**
     * 分页查询文章列表
     */
    public Map<String, Object> getArticleList(Integer page, Integer size, Long categoryId, 
                                               Long parentCategoryId, String tag, String keyword) {
        Page<Article> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        
        // 只查询已发布的文章
        wrapper.eq(Article::getStatus, 1);
        
        // 分类筛选
        if (categoryId != null && categoryId > 0) {
            wrapper.eq(Article::getCategoryId, categoryId);
        }
        if (parentCategoryId != null && parentCategoryId > 0) {
            wrapper.eq(Article::getParentCategoryId, parentCategoryId);
        }
        
        // 标签筛选
        if (StringUtils.hasText(tag)) {
            wrapper.like(Article::getTags, tag);
        }
        
        // 关键词搜索
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Article::getTitle, keyword)
                    .or().like(Article::getSummary, keyword));
        }
        
        // 排序：置顶优先，然后按发布时间倒序
        wrapper.orderByDesc(Article::getIsTop)
               .orderByDesc(Article::getPublishTime);
        
        IPage<Article> result = page(pageParam, wrapper);
        
        Map<String, Object> data = new HashMap<>();
        data.put("list", result.getRecords());
        data.put("total", result.getTotal());
        data.put("pages", result.getPages());
        data.put("current", result.getCurrent());
        return data;
    }

    /**
     * 获取文章详情
     */
    public Article getArticleDetail(Long id) {
        Article article = getById(id);
        if (article != null && article.getStatus() == 1) {
            // 增加浏览量
            article.setViewCount(article.getViewCount() + 1);
            updateById(article);
            return article;
        }
        return null;
    }

    /**
     * 获取推荐文章
     */
    public List<Article> getRecommendArticles(int limit) {
        return list(new LambdaQueryWrapper<Article>()
                .eq(Article::getStatus, 1)
                .eq(Article::getIsRecommend, 1)
                .orderByDesc(Article::getPublishTime)
                .last("LIMIT " + limit));
    }

    /**
     * 获取热门文章（按浏览量）
     */
    public List<Article> getHotArticles(int limit) {
        return list(new LambdaQueryWrapper<Article>()
                .eq(Article::getStatus, 1)
                .orderByDesc(Article::getViewCount)
                .last("LIMIT " + limit));
    }

    /**
     * 获取最新文章
     */
    public List<Article> getLatestArticles(int limit) {
        return list(new LambdaQueryWrapper<Article>()
                .eq(Article::getStatus, 1)
                .orderByDesc(Article::getPublishTime)
                .last("LIMIT " + limit));
    }

    /**
     * 获取相关文章（同分类）
     */
    public List<Article> getRelatedArticles(Long articleId, Long categoryId, int limit) {
        return list(new LambdaQueryWrapper<Article>()
                .eq(Article::getStatus, 1)
                .eq(Article::getCategoryId, categoryId)
                .ne(Article::getId, articleId)
                .orderByDesc(Article::getPublishTime)
                .last("LIMIT " + limit));
    }

    /**
     * 获取上一篇/下一篇文章
     */
    public Map<String, Object> getArticleNav(Long id, Long categoryId) {
        Map<String, Object> nav = new HashMap<>();
        
        LambdaQueryWrapper<Article> prevWrapper = new LambdaQueryWrapper<>();
        prevWrapper.eq(Article::getStatus, 1)
                   .lt(Article::getId, id)
                   .orderByDesc(Article::getId)
                   .select(Article::getId, Article::getTitle)
                   .last("LIMIT 1");
        if (categoryId != null && categoryId > 0) {
            prevWrapper.eq(Article::getCategoryId, categoryId);
        }
        Article prev = getOne(prevWrapper);
        
        LambdaQueryWrapper<Article> nextWrapper = new LambdaQueryWrapper<>();
        nextWrapper.eq(Article::getStatus, 1)
                   .gt(Article::getId, id)
                   .orderByAsc(Article::getId)
                   .select(Article::getId, Article::getTitle)
                   .last("LIMIT 1");
        if (categoryId != null && categoryId > 0) {
            nextWrapper.eq(Article::getCategoryId, categoryId);
        }
        Article next = getOne(nextWrapper);
        
        nav.put("prev", prev);
        nav.put("next", next);
        return nav;
    }
}
