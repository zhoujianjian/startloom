package com.starloom.controller;

import com.starloom.common.Result;
import com.starloom.config.LlmProperties;
import com.starloom.service.LlmService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * LLM 管理接口
 */
@RestController
@RequestMapping("/api/llm")
@RequiredArgsConstructor
public class LlmController {

    private final LlmService llmService;
    private final LlmProperties llmProperties;

    /**
     * 获取 LLM 配置信息
     */
    @GetMapping("/info")
    public Result<?> getInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("defaultProvider", llmProperties.getDefaultProvider());
        info.put("loadBalance", llmProperties.isLoadBalance());
        info.put("fallbackEnabled", llmProperties.isFallbackEnabled());
        info.put("enabledProviders", llmService.getEnabledProviders());
        
        // 提供商详情（隐藏 API Key）
        Map<String, Object> providers = new HashMap<>();
        if (llmProperties.getProviders() != null) {
            llmProperties.getProviders().forEach((name, config) -> {
                Map<String, Object> providerInfo = new HashMap<>();
                providerInfo.put("enabled", config.isEnabled());
                providerInfo.put("model", config.getModel());
                providerInfo.put("timeout", config.getTimeout());
                providerInfo.put("priority", config.getPriority());
                providers.put(name, providerInfo);
            });
        }
        info.put("providers", providers);
        
        return Result.success(info);
    }

    /**
     * 测试指定提供商
     */
    @PostMapping("/test")
    public Result<?> testProvider(@RequestParam(required = false) String provider) {
        long startTime = System.currentTimeMillis();
        String response = llmService.chat("你是一个测试助手", "请回复：测试成功", provider);
        long duration = System.currentTimeMillis() - startTime;
        
        Map<String, Object> result = new HashMap<>();
        result.put("provider", provider != null ? provider : llmProperties.getDefaultProvider());
        result.put("response", response);
        result.put("duration", duration + "ms");
        result.put("success", !response.startsWith("抱歉"));
        
        return Result.success(result);
    }
}
