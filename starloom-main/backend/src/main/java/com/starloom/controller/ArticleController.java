package com.starloom.controller;

import com.starloom.common.Result;
import com.starloom.entity.Article;
import com.starloom.entity.Category;
import com.starloom.entity.Tag;
import com.starloom.service.ArticleService;
import com.starloom.service.CategoryService;
import com.starloom.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/article")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;
    private final CategoryService categoryService;
    private final TagService tagService;

    /**
     * 获取文章列表（分页）
     */
    @GetMapping("/list")
    public Result<?> getArticleList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long parentCategoryId,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String keyword) {
        Map<String, Object> data = articleService.getArticleList(page, size, categoryId, parentCategoryId, tag, keyword);
        return Result.success(data);
    }

    /**
     * 获取文章详情
     */
    @GetMapping("/detail/{id}")
    public Result<?> getArticleDetail(@PathVariable Long id) {
        Article article = articleService.getArticleDetail(id);
        if (article == null) {
            return Result.error(404, "文章不存在");
        }
        return Result.success(article);
    }

    /**
     * 获取上一篇/下一篇文章
     */
    @GetMapping("/nav/{id}")
    public Result<?> getArticleNav(@PathVariable Long id, @RequestParam(required = false) Long categoryId) {
        Map<String, Object> nav = articleService.getArticleNav(id, categoryId);
        return Result.success(nav);
    }

    /**
     * 获取推荐文章
     */
    @GetMapping("/recommend")
    public Result<?> getRecommendArticles(@RequestParam(defaultValue = "6") Integer limit) {
        List<Article> list = articleService.getRecommendArticles(limit);
        return Result.success(list);
    }

    /**
     * 获取热门文章
     */
    @GetMapping("/hot")
    public Result<?> getHotArticles(@RequestParam(defaultValue = "10") Integer limit) {
        List<Article> list = articleService.getHotArticles(limit);
        return Result.success(list);
    }

    /**
     * 获取最新文章
     */
    @GetMapping("/latest")
    public Result<?> getLatestArticles(@RequestParam(defaultValue = "10") Integer limit) {
        List<Article> list = articleService.getLatestArticles(limit);
        return Result.success(list);
    }

    /**
     * 获取相关文章
     */
    @GetMapping("/related/{id}")
    public Result<?> getRelatedArticles(
            @PathVariable Long id,
            @RequestParam Long categoryId,
            @RequestParam(defaultValue = "5") Integer limit) {
        List<Article> list = articleService.getRelatedArticles(id, categoryId, limit);
        return Result.success(list);
    }

    /**
     * 获取分类树
     */
    @GetMapping("/categories/tree")
    public Result<?> getCategoryTree() {
        List<Map<String, Object>> tree = categoryService.getCategoryTree();
        return Result.success(tree);
    }

    /**
     * 获取所有分类
     */
    @GetMapping("/categories")
    public Result<?> getAllCategories() {
        List<Category> list = categoryService.getAllCategories();
        return Result.success(list);
    }

    /**
     * 获取子分类
     */
    @GetMapping("/categories/{parentId}/children")
    public Result<?> getChildCategories(@PathVariable Long parentId) {
        List<Category> list = categoryService.getChildCategories(parentId);
        return Result.success(list);
    }

    /**
     * 获取所有标签
     */
    @GetMapping("/tags")
    public Result<?> getAllTags() {
        List<Tag> list = tagService.getAllTags();
        return Result.success(list);
    }

    /**
     * 获取热门标签
     */
    @GetMapping("/tags/hot")
    public Result<?> getHotTags(@RequestParam(defaultValue = "20") Integer limit) {
        List<Tag> list = tagService.getHotTags(limit);
        return Result.success(list);
    }

    /**
     * 首页数据聚合接口
     */
    @GetMapping("/home")
    public Result<?> getHomeData() {
        Map<String, Object> data = new HashMap<>();
        data.put("categories", categoryService.getCategoryTree());
        data.put("hotTags", tagService.getHotTags(10));
        data.put("recommendArticles", articleService.getRecommendArticles(6));
        data.put("hotArticles", articleService.getHotArticles(10));
        data.put("latestArticles", articleService.getLatestArticles(10));
        return Result.success(data);
    }
}
