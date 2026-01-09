package com.starloom.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * OpenAI 服务 - 向后兼容层
 * 实际调用委托给 LlmService，支持多厂商切换
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OpenAiService {

    private final LlmService llmService;

    /**
     * 使用默认提供商进行对话
     */
    public String chat(String systemPrompt, String userMessage) {
        return llmService.chat(systemPrompt, userMessage);
    }
    
    /**
     * 使用指定提供商进行对话
     * @param providerName 提供商名称: qwen, qwen-vl, deepseek, gpt
     */
    public String chat(String systemPrompt, String userMessage, String providerName) {
        return llmService.chat(systemPrompt, userMessage, providerName);
    }
}
