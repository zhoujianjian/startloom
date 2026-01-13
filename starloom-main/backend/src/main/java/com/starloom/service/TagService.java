package com.starloom.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.starloom.entity.Tag;
import com.starloom.mapper.TagMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService extends ServiceImpl<TagMapper, Tag> {

    /**
     * 获取所有启用的标签
     */
    public List<Tag> getAllTags() {
        return list(new LambdaQueryWrapper<Tag>()
                .eq(Tag::getStatus, 1)
                .orderByDesc(Tag::getArticleCount)
                .orderByAsc(Tag::getSortOrder));
    }

    /**
     * 获取热门标签
     */
    public List<Tag> getHotTags(int limit) {
        return list(new LambdaQueryWrapper<Tag>()
                .eq(Tag::getStatus, 1)
                .orderByDesc(Tag::getArticleCount)
                .last("LIMIT " + limit));
    }

    /**
     * 根据名称获取标签
     */
    public Tag getByName(String name) {
        return getOne(new LambdaQueryWrapper<Tag>()
                .eq(Tag::getName, name)
                .eq(Tag::getStatus, 1));
    }
}
