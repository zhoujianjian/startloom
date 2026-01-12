package com.starloom.controller;

import com.starloom.common.Result;
import com.starloom.entity.ChatGroup;
import com.starloom.service.ChatService;
import com.starloom.service.LlmStreamService;
import com.starloom.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final LlmStreamService llmStreamService;
    private final JwtUtil jwtUtil;

    @GetMapping("/api/chat/getMsgGroupList")
    public Result<?> getMsgGroupList(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtil.getUserId(token);
        return chatService.getMsgGroupList(userId);
    }

    @GetMapping("/api/chat/getMessageList")
    public Result<?> getMessageList(@RequestHeader("Authorization") String token,
                                    @RequestParam(required = false) Long groupId,
                                    @RequestParam(required = false) String msggroup) {
        Long userId = jwtUtil.getUserId(token);
        // 兼容两种参数名
        Long gid = groupId != null ? groupId : (msggroup != null ? Long.valueOf(msggroup) : null);
        if (gid == null) {
            return Result.error("groupId 不能为空");
        }
        return chatService.getMessageList(gid, userId);
    }

    @PostMapping("/api/chat/delMsgGroupList")
    public Result<?> delMsgGroupList(@RequestHeader("Authorization") String token,
                                     @RequestBody Map<String, Object> params) {
        Long userId = jwtUtil.getUserId(token);
        // 前端传的是 msggroup 数组
        Object msggroupObj = params.get("msggroup");
        if (msggroupObj instanceof List) {
            @SuppressWarnings("unchecked")
            List<String> msggroups = (List<String>) msggroupObj;
            return chatService.delMsgGroupList(msggroups, userId);
        }
        return Result.error("参数错误");
    }

    @PostMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public void chat(@RequestHeader(value = "Authorization", required = false) String token,
                     @RequestBody Map<String, Object> params,
                     HttpServletResponse response) throws IOException {
        response.setContentType("text/event-stream");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Connection", "keep-alive");
        response.setHeader("X-Accel-Buffering", "no");
        
        PrintWriter writer = response.getWriter();
        
        String message = extractMessage(params);
        if (message == null || message.trim().isEmpty()) {
            sendError(writer, "消息内容不能为空");
            return;
        }
        
        String module = (String) params.getOrDefault("module", "0");
        String msggroup = params.get("msggroup") != null ? params.get("msggroup").toString() : null;
        String systemPrompt = getSystemPrompt(module);
        String msgId = String.valueOf(System.currentTimeMillis());
        
        AtomicReference<String> fullResponse = new AtomicReference<>("");
        final String finalMessage = message;
        final String finalMsggroup = msggroup;
        final String finalModule = module;
        
        llmStreamService.chatStream(systemPrompt, message, writer, msgId, (responseContent) -> {
            fullResponse.set(responseContent);
            
            // 保存聊天记录
            if (token != null && jwtUtil.validateToken(token)) {
                try {
                    Long userId = jwtUtil.getUserId(token);
                    // 获取或创建聊天组
                    ChatGroup group = chatService.getOrCreateGroup(userId, finalMsggroup, 
                            finalMessage.substring(0, Math.min(20, finalMessage.length())), finalModule);
                    Long groupId = group.getId();
                    
                    // 保存用户消息和AI回复
                    chatService.saveMessage(groupId, userId, "user", finalMessage, "user", null, 0);
                    chatService.saveMessage(groupId, userId, "assistant", responseContent, "gpt", null, 0);
                    
                    log.info("聊天记录已保存, groupId: {}, userId: {}", groupId, userId);
                } catch (Exception e) {
                    log.error("保存聊天记录失败", e);
                }
            }
        });
        
        writer.close();
    }

    @PostMapping(value = "/v1/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public void v1Chat(@RequestHeader(value = "Authorization", required = false) String token,
                       @RequestBody Map<String, Object> params,
                       HttpServletResponse response) throws IOException {
        chat(token, params, response);
    }

    private String extractMessage(Map<String, Object> params) {
        Object messagesObj = params.get("messages");
        if (messagesObj instanceof List) {
            List<?> messages = (List<?>) messagesObj;
            String lastUserMessage = null;
            for (Object msg : messages) {
                if (msg instanceof Map) {
                    Map<?, ?> msgMap = (Map<?, ?>) msg;
                    if ("user".equals(msgMap.get("type"))) {
                        lastUserMessage = (String) msgMap.get("content");
                    }
                }
            }
            if (lastUserMessage != null) {
                return lastUserMessage;
            }
        }
        if (params.get("message") != null) {
            return (String) params.get("message");
        }
        if (params.get("content") != null) {
            return (String) params.get("content");
        }
        return null;
    }

    private void sendError(PrintWriter writer, String error) {
        String msgId = String.valueOf(System.currentTimeMillis());
        String json = String.format("{\"type\":\"gpt\",\"content\":\"%s\",\"modelType\":\"f\",\"msg_answer_id\":\"%s\",\"islike\":false}", 
                error, msgId);
        writer.write("data: " + json + "\n\n");
        writer.write("data: {\"type\":\"[DONE]\"}\n\n");
        writer.flush();
    }

    private String getSystemPrompt(String type) {
        return switch (type) {
            case "xingzuo", "m" -> "你是一位专业的占星师，精通西方占星学。请根据用户的问题，给出专业、详细的星座分析。";
            case "shengxiao" -> "你是一位专业的命理师，精通中国传统生肖文化。请根据用户的问题，给出专业、详细的生肖分析。";
            case "tarot" -> "你是一位专业的塔罗牌占卜师。请根据用户的问题，进行塔罗牌占卜并给出详细解读。";
            case "dream" -> "你是一位专业的解梦师。请根据用户描述的梦境，给出专业、详细的解梦分析。";
            default -> "你是天机喵 AI助手，一位专业的占星师和命理师，精通中西方玄学。请根据用户的问题，给出专业、详细、有温度的解答。";
        };
    }
}
