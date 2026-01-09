package com.starloom.service;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.starloom.config.LlmProperties;
import com.starloom.config.LlmProperties.ProviderConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import okio.BufferedSource;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

/**
 * LLM 流式输出服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LlmStreamService {

    private final LlmProperties llmProperties;
    private final Map<String, OkHttpClient> clientPool = new HashMap<>();
    private List<String> enabledProviders = new ArrayList<>();

    @PostConstruct
    public void init() {
        if (llmProperties.getProviders() == null) return;
        
        enabledProviders = llmProperties.getProviders().entrySet().stream()
                .filter(e -> e.getValue().isEnabled())
                .sorted(Comparator.comparingInt(e -> e.getValue().getPriority()))
                .map(Map.Entry::getKey)
                .toList();
        
        llmProperties.getProviders().forEach((name, config) -> {
            if (config.isEnabled()) {
                OkHttpClient client = new OkHttpClient.Builder()
                        .connectTimeout(30, TimeUnit.SECONDS)
                        .readTimeout(config.getTimeout(), TimeUnit.SECONDS)
                        .writeTimeout(30, TimeUnit.SECONDS)
                        .build();
                clientPool.put(name, client);
            }
        });
    }

    /**
     * 流式聊天 - 真正的 SSE 流式输出
     */
    public void chatStream(String systemPrompt, String userMessage, PrintWriter writer, 
                           String msgId, Consumer<String> onComplete) {
        chatStream(systemPrompt, userMessage, null, writer, msgId, onComplete);
    }

    public void chatStream(String systemPrompt, String userMessage, String providerName,
                           PrintWriter writer, String msgId, Consumer<String> onComplete) {
        String targetProvider = selectProvider(providerName);
        List<String> triedProviders = new ArrayList<>();
        
        while (targetProvider != null && !triedProviders.contains(targetProvider)) {
            triedProviders.add(targetProvider);
            
            try {
                boolean success = doStreamChat(targetProvider, systemPrompt, userMessage, writer, msgId, onComplete);
                if (success) return;
            } catch (Exception e) {
                log.warn("Stream provider {} failed: {}", targetProvider, e.getMessage());
            }
            
            if (llmProperties.isFallbackEnabled()) {
                targetProvider = getNextFallbackProvider(triedProviders);
                if (targetProvider != null) {
                    log.info("Stream falling back to: {}", targetProvider);
                }
            } else {
                break;
            }
        }
        
        // 所有提供商都失败
        sendSSEMessage(writer, "抱歉，AI服务暂时不可用，请稍后再试。", msgId);
        sendSSEDone(writer);
        if (onComplete != null) onComplete.accept("抱歉，AI服务暂时不可用，请稍后再试。");
    }

    private boolean doStreamChat(String providerName, String systemPrompt, String userMessage,
                                  PrintWriter writer, String msgId, Consumer<String> onComplete) {
        ProviderConfig config = llmProperties.getProviders().get(providerName);
        OkHttpClient client = clientPool.get(providerName);
        
        if (config == null || client == null) return false;
        
        JSONObject requestBody = new JSONObject();
        requestBody.set("model", config.getModel());
        requestBody.set("stream", true);  // 关键：启用流式
        requestBody.set("temperature", 0.7);
        
        JSONArray messages = new JSONArray();
        if (systemPrompt != null && !systemPrompt.isEmpty()) {
            JSONObject systemMsg = new JSONObject();
            systemMsg.set("role", "system");
            systemMsg.set("content", systemPrompt);
            messages.add(systemMsg);
        }
        
        JSONObject userMsg = new JSONObject();
        userMsg.set("role", "user");
        userMsg.set("content", userMessage);
        messages.add(userMsg);
        requestBody.set("messages", messages);
        
        log.debug("Stream calling {} with model {}", providerName, config.getModel());
        
        Request request = new Request.Builder()
                .url(config.getUrl())
                .addHeader("Authorization", "Bearer " + config.getApiKey())
                .addHeader("Content-Type", "application/json")
                .addHeader("Accept", "text/event-stream")
                .post(RequestBody.create(requestBody.toString(), MediaType.parse("application/json")))
                .build();
        
        StringBuilder fullContent = new StringBuilder();
        
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful() || response.body() == null) {
                String errorBody = response.body() != null ? response.body().string() : "无响应";
                log.error("Stream {} failed: {}, response: {}", providerName, response.code(), errorBody);
                return false;
            }
            
            BufferedSource source = response.body().source();
            
            while (!source.exhausted()) {
                String line = source.readUtf8Line();
                if (line == null || line.isEmpty()) continue;
                
                if (line.startsWith("data: ")) {
                    String data = line.substring(6).trim();
                    
                    if ("[DONE]".equals(data)) {
                        break;
                    }
                    
                    try {
                        JSONObject json = JSONUtil.parseObj(data);
                        JSONArray choices = json.getJSONArray("choices");
                        if (choices != null && !choices.isEmpty()) {
                            JSONObject delta = choices.getJSONObject(0).getJSONObject("delta");
                            if (delta != null) {
                                String content = delta.getStr("content");
                                if (content != null && !content.isEmpty()) {
                                    fullContent.append(content);
                                    sendSSEMessage(writer, content, msgId);
                                    writer.flush();
                                }
                            }
                        }
                    } catch (Exception e) {
                        // 忽略解析错误，继续处理下一行
                    }
                }
            }
            
            sendSSEDone(writer);
            writer.flush();
            
            if (onComplete != null) {
                onComplete.accept(fullContent.toString());
            }
            
            log.debug("Stream {} completed, total length: {}", providerName, fullContent.length());
            return true;
            
        } catch (IOException e) {
            log.error("Stream {} exception: {}", providerName, e.getMessage());
            return false;
        }
    }
    
    private String selectProvider(String requested) {
        if (requested != null && enabledProviders.contains(requested)) {
            return requested;
        }
        String defaultProvider = llmProperties.getDefaultProvider();
        if (enabledProviders.contains(defaultProvider)) {
            return defaultProvider;
        }
        return enabledProviders.isEmpty() ? null : enabledProviders.get(0);
    }
    
    private String getNextFallbackProvider(List<String> triedProviders) {
        return enabledProviders.stream()
                .filter(p -> !triedProviders.contains(p))
                .findFirst()
                .orElse(null);
    }
    
    private void sendSSEMessage(PrintWriter writer, String content, String msgId) {
        String json = String.format("{\"type\":\"gpt\",\"content\":\"%s\",\"modelType\":\"f\",\"msg_answer_id\":\"%s\",\"islike\":false}", 
                escapeJson(content), msgId);
        writer.write("data: " + json + "\n\n");
    }
    
    private void sendSSEDone(PrintWriter writer) {
        writer.write("data: {\"type\":\"[DONE]\"}\n\n");
    }
    
    private String escapeJson(String text) {
        if (text == null) return "";
        return text.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
    }
}
