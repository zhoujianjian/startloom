package com.starloom.service;

import com.starloom.common.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ShengxiaoService {

    private final OpenAiService openAiService;

    private static final String SYSTEM_PROMPT = "你是一位专业的命理师，精通中国传统生肖文化。请根据用户的问题，给出专业、详细、有温度的解答。";

    // 生肖查询
    public Result<?> query(Integer year) {
        String prompt = String.format("请告诉我%d年出生的人属什么生肖，并详细介绍这个生肖的特点、性格、优缺点、与其他生肖的配对指数等。", year);
        String response = openAiService.chat(SYSTEM_PROMPT, prompt);
        Map<String, Object> data = new HashMap<>();
        data.put("content", response);
        data.put("year", year);
        return Result.success(data);
    }

    // 生肖运势
    public Result<?> yunshi(String shengxiao, String type) {
        String typeText = switch (type) {
            case "today" -> "今日";
            case "tomorrow" -> "明日";
            case "week" -> "本周";
            case "month" -> "本月";
            case "year" -> "本年";
            default -> "今日";
        };
        String prompt = String.format("请为属%s的人提供%s运势分析，包括整体运势、爱情、事业、财运、健康等方面。", shengxiao, typeText);
        String response = openAiService.chat(SYSTEM_PROMPT, prompt);
        Map<String, Object> data = new HashMap<>();
        data.put("content", response);
        data.put("shengxiao", shengxiao);
        data.put("type", type);
        return Result.success(data);
    }
}
