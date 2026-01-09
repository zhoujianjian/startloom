package com.starloom.controller;

import com.starloom.common.Result;
import com.starloom.service.ShengxiaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/shengxiao")
@RequiredArgsConstructor
public class ShengxiaoController {

    private final ShengxiaoService shengxiaoService;

    @PostMapping("/query")
    public Result<?> query(@RequestBody Map<String, Integer> params) {
        Integer year = params.get("year");
        return shengxiaoService.query(year);
    }

    @PostMapping("/yunshi")
    public Result<?> yunshi(@RequestBody Map<String, String> params) {
        String shengxiao = params.get("shengxiao");
        String type = params.getOrDefault("type", "today");
        return shengxiaoService.yunshi(shengxiao, type);
    }
}
