package com.starloom.controller;

import com.starloom.common.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HealthController {

    @GetMapping("/health")
    public Result<?> health() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("timestamp", LocalDateTime.now());
        healthInfo.put("service", "starloom-backend");
        healthInfo.put("version", "1.0.0");
        
        return Result.success(healthInfo);
    }

    @GetMapping("/health/simple")
    public Map<String, String> simpleHealth() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now().toString());
        return response;
    }
}
