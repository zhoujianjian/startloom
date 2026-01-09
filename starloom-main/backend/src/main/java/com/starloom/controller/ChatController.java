package com.starloom.controller;

import com.starloom.common.Result;
import com.starloom.entity.ChatGroup;
import com.starloom.service.ChatService;
import com.starloom.service.OpenAiService;
import com.starloom.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final OpenAiService openAiService;
    private final JwtUtil jwtUtil;

    @GetMapping("/api/chat/getMsgGroupList")
    public Result<?> getMsgGroupList(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtil.getUserId(token);
        return chatService.getMsgGroupList(userId);
    }

    @GetMapping("/api/chat/getMessageList")
    public Result<?> getMessageList(@RequestHeader("Authorization") String token,
                                    @RequestParam Long groupId) {
        Long userId = jwtUtil.getUserId(token);
        return chatService.getMessageList(groupId, userId);
    }

    @PostMapping("/api/chat/delMsgGroupList")
    public Result<?> delMsgGroupList(@RequestHeader("Authorization") String token,
                                     @RequestBody Map<String, Long> params) {
        Long userId = jwtUtil.getUserId(token);
        Long groupId = params.get("groupId");
        return chatService.delMsgGroupList(groupId, userId);
    }

    @PostMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public void chat(@RequestHeader(value = "Authorization", required = false) String token,
                     @RequestBody Map<String, Object> params,
                     HttpServletResponse response) throws IOException {
        response.setContentType("text/event-stream");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Connection", "keep-alive");
        
        PrintWriter writer = response.getWriter();
        
        // 从 messages 数组中提取用户消息
        String message = extractMessage(params);
        if (message == null || message.trim().isEmpty()) {
            sendSSEMessage(writer, "消息内容不能为空", true, String.valueOf(System.currentTimeMillis()));
            sendSSEDone(writer);
            return;
        }
        
        String module = (String) params.getOrDefault("module", "general");
        String msggroup = params.get("msggroup") != null ? params.get("msggroup").toString() : null;

        String systemPrompt = getSystemPrompt(module);
        String responseContent = openAiService.chat(systemPrompt, message);

        // 生成消息ID
        String msgId = String.valueOf(System.currentTimeMillis());
        
        // 模拟流式输出
        boolean isFirst = true;
        for (int i = 0; i < responseContent.length(); i += 5) {
            int end = Math.min(i + 5, responseContent.length());
            String chunk = responseContent.substring(i, end);
            sendSSEMessage(writer, chunk, isFirst, msgId);
            isFirst = false;
            writer.flush();
            try {
                Thread.sleep(20);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        // 发送结束标记
        sendSSEDone(writer);
        writer.flush();
        writer.close();

        // 保存聊天记录
        if (token != null && jwtUtil.validateToken(token)) {
            try {
                Long userId = jwtUtil.getUserId(token);
                Long groupId = msggroup != null ? Long.valueOf(msggroup) : null;
                if (groupId == null) {
                    ChatGroup group = chatService.createGroup(userId, message.substring(0, Math.min(20, message.length())), module);
                    groupId = group.getId();
                }
                chatService.saveMessage(groupId, userId, "user", message);
                chatService.saveMessage(groupId, userId, "assistant", responseContent);
            } catch (Exception e) {
                log.error("保存聊天记录失败", e);
            }
        }
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
            for (Object msg : messages) {
                if (msg instanceof Map) {
                    Map<?, ?> msgMap = (Map<?, ?>) msg;
                    if ("user".equals(msgMap.get("type"))) {
                        return (String) msgMap.get("content");
                    }
                }
            }
        }
        // 兼容其他参数名
        if (params.get("message") != null) {
            return (String) params.get("message");
        }
        if (params.get("content") != null) {
            return (String) params.get("content");
        }
        return null;
    }

    private void sendSSEMessage(PrintWriter writer, String content, boolean isFirst, String msgId) {
        // 构建前端期望的JSON格式，type 用 gpt 才能流式显示
        String json = String.format("{\"type\":\"gpt\",\"content\":\"%s\",\"modelType\":\"f\",\"msg_answer_id\":\"%s\",\"islike\":false}", 
                escapeJson(content), msgId);
        writer.write("data: " + json + "\n\n");
    }

    private void sendSSEDone(PrintWriter writer) {
        writer.write("data: [DONE]\n\n");
    }
    
    private String escapeJson(String text) {
        if (text == null) return "";
        return text.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
    }

    private String getSystemPrompt(String type) {
        return switch (type) {
            case "xingzuo", "m" -> "你是一位专业的占星师，精通西方占星学。请根据用户的问题，给出专业、详细的星座分析。";
            case "shengxiao" -> "你是一位专业的命理师，精通中国传统生肖文化。请根据用户的问题，给出专业、详细的生肖分析。";
            case "tarot" -> "你是一位专业的塔罗牌占卜师。请根据用户的问题，进行塔罗牌占卜并给出详细解读。";
            case "dream" -> "你是一位专业的解梦师。请根据用户描述的梦境，给出专业、详细的解梦分析。";
            default -> "你是StarLoom AI助手，一位专业的占星师和命理师，精通中西方玄学。请根据用户的问题，给出专业、详细、有温度的解答。";
        };
    }
}
