package com.starloom.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Map;

@Data
@Component
@ConfigurationProperties(prefix = "llm")
public class LlmProperties {
    
    private String defaultProvider = "deepseek";
    private boolean loadBalance = false;
    private boolean fallbackEnabled = true;
    private Map<String, ProviderConfig> providers;
    
    @Data
    public static class ProviderConfig {
        private boolean enabled = true;
        private String url;
        private String apiKey;
        private String model;
        private int timeout = 60;
        private int priority = 10;
    }
}
