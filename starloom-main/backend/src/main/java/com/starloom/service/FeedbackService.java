package com.starloom.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.starloom.common.Result;
import com.starloom.entity.Feedback;
import com.starloom.mapper.FeedbackMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackMapper feedbackMapper;

    /**
     * 提交留言
     */
    public Result<?> submitFeedback(Long userId, String nickname, String contact, 
                                     String content, String images, String type) {
        if (content == null || content.trim().isEmpty()) {
            return Result.error("留言内容不能为空");
        }
        
        Feedback feedback = new Feedback();
        feedback.setUserId(userId);
        feedback.setNickname(nickname);
        feedback.setContact(contact);
        feedback.setContent(content.trim());
        feedback.setImages(images);
        feedback.setType(type != null ? type : "feedback");
        feedback.setStatus(0);
        
        feedbackMapper.insert(feedback);
        
        return Result.success("留言提交成功");
    }

    /**
     * 获取用户的留言列表
     */
    public Result<?> getUserFeedbacks(Long userId, Integer page, Integer size) {
        if (page == null || page < 1) page = 1;
        if (size == null || size < 1) size = 10;
        
        Page<Feedback> pageParam = new Page<>(page, size);
        Page<Feedback> result = feedbackMapper.selectPage(pageParam,
            new LambdaQueryWrapper<Feedback>()
                .eq(Feedback::getUserId, userId)
                .eq(Feedback::getDeleted, 0)
                .orderByDesc(Feedback::getCreateTime)
        );
        
        Map<String, Object> data = new HashMap<>();
        data.put("list", result.getRecords());
        data.put("total", result.getTotal());
        data.put("page", page);
        data.put("size", size);
        
        return Result.success(data);
    }

    /**
     * 删除留言
     */
    public Result<?> deleteFeedback(Long userId, Long feedbackId) {
        Feedback feedback = feedbackMapper.selectById(feedbackId);
        if (feedback == null || !feedback.getUserId().equals(userId)) {
            return Result.error("留言不存在");
        }
        
        feedback.setDeleted(1);
        feedbackMapper.updateById(feedback);
        
        return Result.success("删除成功");
    }
}
