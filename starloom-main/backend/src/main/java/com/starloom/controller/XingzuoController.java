package com.starloom.controller;

import com.starloom.common.Result;
import com.starloom.service.XingzuoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/xingzuo")
@RequiredArgsConstructor
public class XingzuoController {

    private final XingzuoService xingzuoService;

    @PostMapping("/yunshi")
    public Result<?> yunshi(@RequestBody Map<String, String> params) {
        String constellation = params.get("constellation");
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
        // 返回星座排行文章列表（可扩展）
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
