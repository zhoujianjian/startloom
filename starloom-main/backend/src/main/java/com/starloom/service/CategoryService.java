package com.starloom.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.starloom.entity.Category;
import com.starloom.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService extends ServiceImpl<CategoryMapper, Category> {

    /**
     * 获取所有启用的分类（树形结构）
     */
    public List<Map<String, Object>> getCategoryTree() {
        List<Category> allCategories = list(new LambdaQueryWrapper<Category>()
                .eq(Category::getStatus, 1)
                .orderByAsc(Category::getSortOrder));
        
        // 获取顶级分类
        List<Category> topCategories = allCategories.stream()
                .filter(c -> c.getParentId() == null || c.getParentId() == 0)
                .collect(Collectors.toList());
        
        // 构建树形结构
        List<Map<String, Object>> result = new ArrayList<>();
        for (Category top : topCategories) {
            Map<String, Object> node = categoryToMap(top);
            List<Map<String, Object>> children = allCategories.stream()
                    .filter(c -> top.getId().equals(c.getParentId()))
                    .map(this::categoryToMap)
                    .collect(Collectors.toList());
            node.put("children", children);
            result.add(node);
        }
        return result;
    }

    /**
     * 获取所有启用的分类（平铺列表）
     */
    public List<Category> getAllCategories() {
        return list(new LambdaQueryWrapper<Category>()
                .eq(Category::getStatus, 1)
                .orderByAsc(Category::getLevel)
                .orderByAsc(Category::getSortOrder));
    }

    /**
     * 根据父分类ID获取子分类
     */
    public List<Category> getChildCategories(Long parentId) {
        return list(new LambdaQueryWrapper<Category>()
                .eq(Category::getParentId, parentId)
                .eq(Category::getStatus, 1)
                .orderByAsc(Category::getSortOrder));
    }

    /**
     * 根据slug获取分类
     */
    public Category getBySlug(String slug) {
        return getOne(new LambdaQueryWrapper<Category>()
                .eq(Category::getSlug, slug)
                .eq(Category::getStatus, 1));
    }

    private Map<String, Object> categoryToMap(Category category) {
        Map<String, Object> map = new java.util.HashMap<>();
        map.put("id", category.getId());
        map.put("parentId", category.getParentId());
        map.put("name", category.getName());
        map.put("fullName", category.getFullName());
        map.put("slug", category.getSlug());
        map.put("icon", category.getIcon());
        map.put("description", category.getDescription());
        map.put("level", category.getLevel());
        map.put("articleCount", category.getArticleCount());
        return map;
    }
}
