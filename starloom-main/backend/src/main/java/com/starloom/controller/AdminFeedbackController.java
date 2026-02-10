package com.starloom.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.starloom.common.Result;
import com.starloom.entity.Feedback;
import com.starloom.mapper.FeedbackMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/sysAdm/feedback")
@RequiredArgsConstructor
public class AdminFeedbackController {

    private final FeedbackMapper feedbackMapper;

    @GetMapping
    public Result<Page<Feedback>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword
    ) {
        Page<Feedback> pageParam = new Page<>(page, size);
        QueryWrapper<Feedback> wrapper = new QueryWrapper<>();

        if (type != null && !type.trim().isEmpty()) {
            wrapper.eq("type", type.trim());
        }
        if (status != null) {
            wrapper.eq("status", status);
        }
        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.trim();
            wrapper.and(w -> w.like("nickname", kw)
                    .or().like("contact", kw)
                    .or().like("content", kw));
        }

        wrapper.orderByDesc("create_time");
        Page<Feedback> result = feedbackMapper.selectPage(pageParam, wrapper);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Feedback> detail(@PathVariable Long id) {
        Feedback feedback = feedbackMapper.selectById(id);
        if (feedback == null) {
            return Result.error(404, "反馈不存在");
        }
        return Result.success(feedback);
    }

    @PostMapping("/{id}/reply")
    public Result<?> reply(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Feedback feedback = feedbackMapper.selectById(id);
        if (feedback == null) {
            return Result.error(404, "反馈不存在");
        }

        Object replyContent = body.get("reply");
        if (replyContent == null || replyContent.toString().trim().isEmpty()) {
            return Result.error(400, "回复内容不能为空");
        }

        Object statusObj = body.get("status");
        Integer nextStatus = null;
        if (statusObj != null) {
            try {
                nextStatus = Integer.valueOf(statusObj.toString());
            } catch (Exception ignored) {
                return Result.error(400, "status参数不合法");
            }
        }

        feedback.setReply(replyContent.toString());
        feedback.setReplyTime(LocalDateTime.now());
        // 允许前端指定状态：1处理中/2已解决/3已关闭；未传则默认已回复(2)
        feedback.setStatus(nextStatus != null ? nextStatus : 2);
        feedbackMapper.updateById(feedback);
        return Result.success();
    }

    @PutMapping("/{id}/status")
    public Result<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Feedback feedback = feedbackMapper.selectById(id);
        if (feedback == null) {
            return Result.error(404, "反馈不存在");
        }

        Object statusObj = body.get("status");
        if (statusObj == null) {
            return Result.error(400, "status不能为空");
        }

        Integer status = Integer.valueOf(statusObj.toString());
        feedback.setStatus(status);
        feedbackMapper.updateById(feedback);
        return Result.success();
    }
    
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        Feedback feedback = feedbackMapper.selectById(id);
        if (feedback == null) {
            return Result.error(404, "反馈不存在");
        }
        
        feedbackMapper.deleteById(id);
        return Result.success();
    }
    
    @GetMapping("/export")
    public Result<?> exportFeedback(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "xlsx") String format) {
        
        // 这里应该实现导出逻辑，返回文件下载链接或文件内容
        // 暂时返回成功响应
        return Result.success("导出功能待实现");
    }
}
