package com.starloom.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.starloom.common.Result;
import com.starloom.entity.Article;
import com.starloom.mapper.ArticleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/sysAdm/articles")
@RequiredArgsConstructor
public class AdminArticleController {

    private final ArticleMapper articleMapper;

    @GetMapping
    public Result<Page<Article>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Integer status
    ) {
        Page<Article> pageParam = new Page<>(page, size);
        QueryWrapper<Article> wrapper = new QueryWrapper<>();

        if (title != null && !title.trim().isEmpty()) {
            wrapper.like("title", title.trim());
        }
        if (categoryId != null) {
            wrapper.eq("category_id", categoryId);
        }
        if (status != null) {
            wrapper.eq("status", status);
        }

        wrapper.orderByDesc("updated_at").orderByDesc("id");
        Page<Article> result = articleMapper.selectPage(pageParam, wrapper);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Article> detail(@PathVariable Long id) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            return Result.error(404, "文章不存在");
        }
        return Result.success(article);
    }

    @PostMapping
    public Result<?> create(@RequestBody Article body) {
        body.setId(null);
        if (body.getStatus() == null) {
            body.setStatus(0);
        }
        if (body.getCreatedAt() == null) {
            body.setCreatedAt(LocalDateTime.now());
        }
        body.setUpdatedAt(LocalDateTime.now());
        articleMapper.insert(body);
        return Result.success(body);
    }

    @PutMapping("/{id}")
    public Result<?> update(@PathVariable Long id, @RequestBody Article body) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            return Result.error(404, "文章不存在");
        }
        body.setId(id);
        body.setUpdatedAt(LocalDateTime.now());
        articleMapper.updateById(body);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            return Result.error(404, "文章不存在");
        }
        articleMapper.deleteById(id);
        return Result.success();
    }
}
