package com.starloom.controller;

import com.starloom.common.Result;
import com.starloom.service.LlmStreamService;
import com.starloom.service.XingzuoService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.PrintWriter;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/xingzuo")
@RequiredArgsConstructor
public class XingzuoController {

    private final XingzuoService xingzuoService;
    private final LlmStreamService llmStreamService;

    private static final String SYSTEM_PROMPT = "你是一位专业的占星师和命理师，精通中西方玄学。请根据用户的问题，给出专业、详细、有温度的解答。";

    // ============ 流式接口 ============

    @PostMapping("/stream/yunshi")
    public void yunshiStream(@RequestBody Map<String, String> params, HttpServletResponse response) throws Exception {
        String constellation = params.get("constellation");
        if (constellation == null) constellation = params.get("xingzuo");
        String type = params.getOrDefault("type", "today");
        String typeText = getTypeText(type);
        String prompt = String.format("请为%s星座提供%s运势分析，包括整体运势、爱情、事业、财运、健康等方面。", constellation, typeText);
        streamResponse(prompt, response);
    }

    @PostMapping("/stream/shengrihua")
    public void shengrihuaStream(@RequestBody Map<String, String> params, HttpServletResponse response) throws Exception {
        String month = params.get("month");
        String day = params.get("day");
        String prompt = String.format("请告诉我%s月%s日的生日花是什么，以及它的花语、象征意义和相关传说。", month, day);
        streamResponse(prompt, response);
    }

    @PostMapping("/stream/shengrimima")
    public void shengrimimaStream(@RequestBody Map<String, String> params, HttpServletResponse response) throws Exception {
        String month = params.get("month");
        String day = params.get("day");
        String prompt = String.format("请解读%s月%s日出生的人的生日密码，包括性格特点、优缺点、适合的职业、爱情观等。", month, day);
        streamResponse(prompt, response);
    }

    @PostMapping("/stream/shengrishu")
    public void shengrishuStream(@RequestBody Map<String, String> params, HttpServletResponse response) throws Exception {
        String month = params.get("month");
        String day = params.get("day");
        String prompt = String.format("请为%s月%s日出生的人写一份生日书，包括这一天的特殊意义、名人生日、幸运数字、幸运颜色等。", month, day);
        streamResponse(prompt, response);
    }

    @PostMapping("/stream/chaxun")
    public void chaxunStream(@RequestBody Map<String, String> params, HttpServletResponse response) throws Exception {
        String xingzuo = params.get("xingzuo");
        if (xingzuo == null) xingzuo = params.get("constellation");
        String prompt = String.format("请详细介绍%s的特点、性格、优缺点、与其他星座的配对指数等。", xingzuo);
        streamResponse(prompt, response);
    }

    @PostMapping("/stream/shengxiao")
    public void shengxiaoStream(@RequestBody Map<String, String> params, HttpServletResponse response) throws Exception {
        String shengxiao = params.get("shengxiao");
        String prompt = String.format("请为生肖%s提供详细的运势分析，包括整体运势、事业、财运、感情、健康等方面的预测和建议。", shengxiao);
        streamResponse(prompt, response);
    }

    @PostMapping("/stream/lottery")
    public void lotteryStream(@RequestBody Map<String, String> params, HttpServletResponse response) throws Exception {
        String type = params.getOrDefault("type", "guanyin");
        String typeName = switch (type) {
            case "yuelao" -> "月老灵签";
            case "caishen" -> "财神灵签";
            default -> "观音灵签";
        };
        String prompt = String.format("请为我抽一支%s，告诉我签号、签文内容，并详细解签，给出吉凶判断和建议。", typeName);
        streamResponse(prompt, response);
    }

    @PostMapping("/stream/paipan")
    public void paipanStream(@RequestBody Map<String, String> params, HttpServletResponse response) throws Exception {
        String name = params.getOrDefault("name", "");
        String gender = params.getOrDefault("gender", "男");
        String calendar = params.getOrDefault("calendar", "公历");
        String birthDate = params.getOrDefault("birthDate", "");
        String birthHour = params.getOrDefault("birthHour", "未知");
        String birthPlace = params.getOrDefault("birthPlace", "未知");
        String prompt = String.format("请为以下信息进行八字排盘分析：姓名：%s，性别：%s，历法：%s，出生日期：%s，出生时辰：%s，出生地点：%s。请详细分析四柱八字、五行分析、十神分析、格局判断、大运流年、综合建议。", 
            name, gender, calendar, birthDate, birthHour, birthPlace);
        streamResponse(prompt, response);
    }

    @PostMapping("/stream/hepan")
    public void hepanStream(@RequestBody Map<String, String> params, HttpServletResponse response) throws Exception {
        String maleName = params.getOrDefault("maleName", "");
        String maleBirthDate = params.getOrDefault("maleBirthDate", "");
        String maleBirthHour = params.getOrDefault("maleBirthHour", "未知");
        String femaleName = params.getOrDefault("femaleName", "");
        String femaleBirthDate = params.getOrDefault("femaleBirthDate", "");
        String femaleBirthHour = params.getOrDefault("femaleBirthHour", "未知");
        String prompt = String.format("请进行八字合盘分析：男方：%s，出生日期：%s，时辰：%s。女方：%s，出生日期：%s，时辰：%s。请分析双方八字、五行互补、日柱配对、婚姻宫分析、综合评分与建议。",
            maleName, maleBirthDate, maleBirthHour, femaleName, femaleBirthDate, femaleBirthHour);
        streamResponse(prompt, response);
    }

    private void streamResponse(String prompt, HttpServletResponse response) throws Exception {
        response.setContentType("text/event-stream");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Connection", "keep-alive");
        response.setHeader("X-Accel-Buffering", "no");
        
        PrintWriter writer = response.getWriter();
        String msgId = UUID.randomUUID().toString();
        
        llmStreamService.chatStream(SYSTEM_PROMPT, prompt, writer, msgId, null);
        
        writer.flush();
        writer.close();
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

    // ============ 原有非流式接口（保留兼容） ============

    @PostMapping("/yunshi")
    public Result<?> yunshi(@RequestBody Map<String, String> params) {
        String constellation = params.get("constellation");
        if (constellation == null) constellation = params.get("xingzuo");
        String type = params.getOrDefault("type", "today");
        return xingzuoService.yunshi(constellation, type);
    }

    @PostMapping("/shengrihua")
    public Result<?> shengrihua(@RequestBody Map<String, String> params) {
        String month = params.get("month");
        String day = params.get("day");
        return xingzuoService.shengrihua(month, day);
    }

    @PostMapping("/shengrimima")
    public Result<?> shengrimima(@RequestBody Map<String, String> params) {
        String month = params.get("month");
        String day = params.get("day");
        return xingzuoService.shengrimima(month, day);
    }

    @PostMapping("/shengrishu")
    public Result<?> shengrishu(@RequestBody Map<String, String> params) {
        String month = params.get("month");
        String day = params.get("day");
        return xingzuoService.shengrishu(month, day);
    }

    @PostMapping("/chaxun")
    public Result<?> chaxun(@RequestBody Map<String, String> params) {
        String month = params.get("month");
        String day = params.get("day");
        return xingzuoService.chaxun(month, day);
    }

    @PostMapping("/48")
    public Result<?> xingqu48(@RequestBody Map<String, String> params) {
        String month = params.get("month");
        String day = params.get("day");
        return xingzuoService.xingqu48(month, day);
    }

    @PostMapping("/xiajiang")
    public Result<?> xiajiang(@RequestBody Map<String, String> params) {
        String constellation = params.get("constellation");
        return xingzuoService.xiajiang(constellation);
    }

    @PostMapping("/yueliang")
    public Result<?> yueliang(@RequestBody Map<String, String> params) {
        String birthDate = params.get("birthDate");
        String birthTime = params.get("birthTime");
        String birthPlace = params.get("birthPlace");
        return xingzuoService.yueliang(birthDate, birthTime, birthPlace);
    }

    @PostMapping("/xuexing")
    public Result<?> xuexing(@RequestBody Map<String, String> params) {
        String constellation = params.get("constellation");
        String bloodType = params.get("bloodType");
        return xingzuoService.xuexing(constellation, bloodType);
    }

    @PostMapping("/chugui")
    public Result<?> chugui(@RequestBody Map<String, String> params) {
        String constellation = params.get("constellation");
        return xingzuoService.chugui(constellation);
    }

    @PostMapping("/ranking")
    public Result<?> ranking(@RequestBody Map<String, String> params) {
        return Result.success();
    }

    @PostMapping("/ranking/get")
    public Result<?> rankingGet(@RequestBody Map<String, String> params) {
        return Result.success();
    }

    @PostMapping("/ranking/question")
    public Result<?> rankingQuestion(@RequestBody Map<String, String> params) {
        return Result.success();
    }
}
