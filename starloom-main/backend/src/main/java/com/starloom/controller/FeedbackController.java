package com.starloom.controller;

import com.starloom.common.Result;
import com.starloom.service.FeedbackService;
import com.starloom.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final JwtUtil jwtUtil;

    /**
     * 提交留言（支持匿名）
     */
    @PostMapping("/submit")
    public Result<?> submitFeedback(@RequestHeader(value = "Authorization", required = false) String token,
                                     @RequestBody Map<String, String> params) {
        Long userId = null;
        if (token != null && jwtUtil.validateToken(token)) {
            userId = jwtUtil.getUserId(token);
        }
        
        String nickname = params.get("nickname");
        String contact = params.get("contact");
        String content = params.get("content");
        String images = params.get("images");
        String type = params.get("type");
        
        return feedbackService.submitFeedback(userId, nickname, contact, content, images, type);
    }

    /**
     * 获取用户留言列表
     */
    @GetMapping("/list")
    public Result<?> getUserFeedbacks(@RequestHeader("Authorization") String token,
                                       @RequestParam(defaultValue = "1") Integer page,
                                       @RequestParam(defaultValue = "10") Integer size) {
        if (!jwtUtil.validateToken(token)) {
            return Result.error("请先登录");
        }
        Long userId = jwtUtil.getUserId(token);
        return feedbackService.getUserFeedbacks(userId, page, size);
    }

    /**
     * 删除留言
     */
    @PostMapping("/delete")
    public Result<?> deleteFeedback(@RequestHeader("Authorization") String token,
                                     @RequestBody Map<String, Long> params) {
        if (!jwtUtil.validateToken(token)) {
            return Result.error("请先登录");
        }
        Long userId = jwtUtil.getUserId(token);
        Long feedbackId = params.get("id");
        return feedbackService.deleteFeedback(userId, feedbackId);
    }
}
