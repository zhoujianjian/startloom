package com.starloom.service;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.starloom.config.LlmProperties;
import com.starloom.config.LlmProperties.ProviderConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LlmService {

    private final LlmProperties llmProperties;
    
    private final Map<String, OkHttpClient> clientPool = new HashMap<>();
    private List<String> enabledProviders = new ArrayList<>();
    private final AtomicInteger roundRobinIndex = new AtomicInteger(0);
    
    @PostConstruct
    public void init() {
        if (llmProperties.getProviders() == null) {
            log.warn("No LLM providers configured");
            return;
        }
        
        // 初始化启用的提供商列表，按优先级排序
        enabledProviders = llmProperties.getProviders().entrySet().stream()
                .filter(e -> e.getValue().isEnabled())
                .sorted(Comparator.comparingInt(e -> e.getValue().getPriority()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
        
        // 为每个提供商创建独立的 OkHttpClient
        llmProperties.getProviders().forEach((name, config) -> {
            if (config.isEnabled()) {
                OkHttpClient client = new OkHttpClient.Builder()
                        .connectTimeout(30, TimeUnit.SECONDS)
                        .readTimeout(config.getTimeout(), TimeUnit.SECONDS)
                        .writeTimeout(30, TimeUnit.SECONDS)
                        .build();
                clientPool.put(name, client);
                log.info("Initialized LLM provider: {} (model: {}, priority: {})", 
                        name, config.getModel(), config.getPriority());
            }
        });
        
        log.info("LLM Service initialized with {} providers: {}", 
                enabledProviders.size(), enabledProviders);
    }

    /**
     * 使用默认提供商进行对话
     */
    public String chat(String systemPrompt, String userMessage) {
        return chat(systemPrompt, userMessage, null);
    }
    
    /**
     * 使用指定提供商进行对话
     */
    public String chat(String systemPrompt, String userMessage, String providerName) {
        if (enabledProviders.isEmpty()) {
            log.error("No LLM providers available");
            return "抱歉，AI服务暂时不可用，请稍后再试。";
        }
        
        String targetProvider = selectProvider(providerName);
        List<String> triedProviders = new ArrayList<>();
        
        while (targetProvider != null && !triedProviders.contains(targetProvider)) {
            triedProviders.add(targetProvider);
            
            try {
                String result = doChat(targetProvider, systemPrompt, userMessage);
                if (result != null && !result.startsWith("抱歉")) {
                    return result;
                }
            } catch (Exception e) {
                log.warn("Provider {} failed: {}", targetProvider, e.getMessage());
            }
            
            // 如果启用了故障转移，尝试下一个提供商
            if (llmProperties.isFallbackEnabled()) {
                targetProvider = getNextFallbackProvider(triedProviders);
                if (targetProvider != null) {
                    log.info("Falling back to provider: {}", targetProvider);
                }
            } else {
                break;
            }
        }
        
        return "抱歉，AI服务暂时不可用，请稍后再试。";
    }
    
    /**
     * 选择提供商
     */
    private String selectProvider(String requested) {
        if (requested != null && enabledProviders.contains(requested)) {
            return requested;
        }
        
        if (llmProperties.isLoadBalance()) {
            // 轮询负载均衡
            int index = roundRobinIndex.getAndIncrement() % enabledProviders.size();
            return enabledProviders.get(index);
        }
        
        // 使用默认提供商
        String defaultProvider = llmProperties.getDefaultProvider();
        if (enabledProviders.contains(defaultProvider)) {
            return defaultProvider;
        }
        
        // 返回第一个可用的
        return enabledProviders.isEmpty() ? null : enabledProviders.get(0);
    }
    
    /**
     * 获取下一个备用提供商
     */
    private String getNextFallbackProvider(List<String> triedProviders) {
        return enabledProviders.stream()
                .filter(p -> !triedProviders.contains(p))
                .findFirst()
                .orElse(null);
    }
    
    /**
     * 执行实际的 API 调用
     */
    private String doChat(String providerName, String systemPrompt, String userMessage) {
        ProviderConfig config = llmProperties.getProviders().get(providerName);
        OkHttpClient client = clientPool.get(providerName);
        
        if (config == null || client == null) {
            log.error("Provider {} not configured properly", providerName);
            return null;
        }
        
        JSONObject requestBody = new JSONObject();
        requestBody.set("model", config.getModel());
        
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
        requestBody.set("temperature", 0.7);
        
        log.debug("Calling {} with model {}", providerName, config.getModel());
        
        Request request = new Request.Builder()
                .url(config.getUrl())
                .addHeader("Authorization", "Bearer " + config.getApiKey())
                .addHeader("Content-Type", "application/json")
                .post(RequestBody.create(requestBody.toString(), MediaType.parse("application/json")))
                .build();
        
        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                String responseBody = response.body().string();
                JSONObject json = JSONUtil.parseObj(responseBody);
                String content = json.getJSONArray("choices")
                        .getJSONObject(0)
                        .getJSONObject("message")
                        .getStr("content");
                log.debug("Provider {} responded successfully", providerName);
                return content;
            } else {
                String errorBody = response.body() != null ? response.body().string() : "无响应";
                log.error("Provider {} API call failed: {}, response: {}", 
                        providerName, response.code(), errorBody);
                return null;
            }
        } catch (IOException e) {
            log.error("Provider {} API call exception: {}", providerName, e.getMessage());
            return null;
        }
    }
    
    /**
     * 获取所有启用的提供商列表
     */
    public List<String> getEnabledProviders() {
        return new ArrayList<>(enabledProviders);
    }
    
    /**
     * 检查指定提供商是否可用
     */
    public boolean isProviderAvailable(String providerName) {
        return enabledProviders.contains(providerName);
    }
}
