package com.starloom.service;

import com.starloom.common.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class XingzuoService {

    private final OpenAiService openAiService;

    private static final String SYSTEM_PROMPT = "你是一位专业的占星师和命理师，精通中西方玄学。请根据用户的问题，给出专业、详细、有温度的解答。";

    // 星座运势
    public Result<?> yunshi(String constellation, String type) {
        String prompt = String.format("请为%s星座提供%s运势分析，包括整体运势、爱情、事业、财运、健康等方面。", 
                constellation, getTypeText(type));
        String response = openAiService.chat(SYSTEM_PROMPT, prompt);
        Map<String, Object> data = new HashMap<>();
        data.put("content", response);
        data.put("constellation", constellation);
        data.put("type", type);
        return Result.success(data);
    }

    // 生日花
    public Result<?> shengrihua(String month, String day) {
        String prompt = String.format("请告诉我%s月%s日的生日花是什么，以及它的花语、象征意义和相关传说。", month, day);
        String response = openAiService.chat(SYSTEM_PROMPT, prompt);
        Map<String, Object> data = new HashMap<>();
        data.put("content", response);
        return Result.success(data);
    }

    // 生日密码
    public Result<?> shengrimima(String month, String day) {
        String prompt = String.format("请解读%s月%s日出生的人的生日密码，包括性格特点、优缺点、适合的职业、爱情观等。", month, day);
        String response = openAiService.chat(SYSTEM_PROMPT, prompt);
        Map<String, Object> data = new HashMap<>();
        data.put("content", response);
        return Result.success(data);
    }

    // 生日书
    public Result<?> shengrishu(String month, String day) {
        String prompt = String.format("请为%s月%s日出生的人写一份生日书，包括这一天的特殊意义、名人生日、幸运数字、幸运颜色等。", month, day);
        String response = openAiService.chat(SYSTEM_PROMPT, prompt);
        Map<String, Object> data = new HashMap<>();
        data.put("content", response);
        return Result.success(data);
    }

    // 星座查询
    public Result<?> chaxun(String month, String day) {
        String prompt = String.format("请告诉我%s月%s日是什么星座，并详细介绍这个星座的特点、性格、优缺点、与其他星座的配对指数等。", month, day);
        String response = openAiService.chat(SYSTEM_PROMPT, prompt);
        Map<String, Object> data = new HashMap<>();
        data.put("content", response);
        return Result.success(data);
    }

    // 48星区
    public Result<?> xingqu48(String month, String day) {
        String prompt = String.format("请告诉我%s月%s日属于48星区中的哪个星区，并详细介绍这个星区的特点。", month, day);
        String response = openAiService.chat(SYSTEM_PROMPT, prompt);
        Map<String, Object> data = new HashMap<>();
        data.put("content", response);
        return Result.success(data);
    }

    // 下降星座
    public Result<?> xiajiang(String constellation) {
        String prompt = String.format("请告诉我%s星座的下降星座是什么，以及下降星座对感情和婚姻的影响。", constellation);
        String response = openAiService.chat(SYSTEM_PROMPT, prompt);
        Map<String, Object> data = new HashMap<>();
        data.put("content", response);
        return Result.success(data);
    }

    // 月亮星座
    public Result<?> yueliang(String birthDate, String birthTime, String birthPlace) {
        String prompt = String.format("请根据出生日期%s，出生时间%s，出生地点%s，计算月亮星座，并解读月亮星座对性格和情感的影响。", 
                birthDate, birthTime, birthPlace);
        String response = openAiService.chat(SYSTEM_PROMPT, prompt);
        Map<String, Object> data = new HashMap<>();
        data.put("content", response);
        return Result.success(data);
    }

    // 星座血型性格
    public Result<?> xuexing(String constellation, String bloodType) {
        String prompt = String.format("请分析%s星座%s血型的人的性格特点、优缺点、适合的职业和爱情观。", constellation, bloodType);
        String response = openAiService.chat(SYSTEM_PROMPT, prompt);
        Map<String, Object> data = new HashMap<>();
        data.put("content", response);
        return Result.success(data);
    }

    // 出轨测试
    public Result<?> chugui(String constellation) {
        String prompt = String.format("请分析%s星座在感情中的忠诚度，以及可能出轨的原因和表现（仅供娱乐参考）。", constellation);
        String response = openAiService.chat(SYSTEM_PROMPT, prompt);
        Map<String, Object> data = new HashMap<>();
        data.put("content", response);
        return Result.success(data);
    }

    private String getTypeText(String type) {
        return switch (type) {
            case "today" -> "今日";
            case "tomorrow" -> "明日";
            case "week" -> "本周";
            case "month" -> "本月";
            case "year" -> "本年";
            default -> "今日";
        };
    }
}
