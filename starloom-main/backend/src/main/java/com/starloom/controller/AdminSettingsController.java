package com.starloom.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.starloom.common.Result;
import com.starloom.entity.SysConfig;
import com.starloom.mapper.SysConfigMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sysAdm/settings")
@RequiredArgsConstructor
public class AdminSettingsController {

    private final SysConfigMapper sysConfigMapper;

    @GetMapping
    public Result<List<SysConfig>> getAll() {
        QueryWrapper<SysConfig> wrapper = new QueryWrapper<>();
        wrapper.eq("status", 1);
        wrapper.orderByAsc("sort_order");
        List<SysConfig> list = sysConfigMapper.selectList(wrapper);
        return Result.success(list);
    }

    @GetMapping("/{key}")
    public Result<SysConfig> get(@PathVariable String key) {
        QueryWrapper<SysConfig> wrapper = new QueryWrapper<>();
        wrapper.eq("config_key", key);
        wrapper.eq("status", 1);
        SysConfig config = sysConfigMapper.selectOne(wrapper);
        if (config == null) {
            return Result.error(404, "配置不存在");
        }
        return Result.success(config);
    }

    @PutMapping("/{key}")
    public Result<?> update(@PathVariable String key, @RequestBody Map<String, Object> body) {
        QueryWrapper<SysConfig> wrapper = new QueryWrapper<>();
        wrapper.eq("config_key", key);
        SysConfig config = sysConfigMapper.selectOne(wrapper);
        if (config == null) {
            return Result.error(404, "配置不存在");
        }

        if (body.containsKey("configValue")) {
            Object v = body.get("configValue");
            config.setConfigValue(v == null ? null : v.toString());
        }
        if (body.containsKey("description")) {
            Object v = body.get("description");
            config.setDescription(v == null ? null : v.toString());
        }
        if (body.containsKey("status")) {
            Object v = body.get("status");
            config.setStatus(v == null ? null : Integer.valueOf(v.toString()));
        }

        sysConfigMapper.updateById(config);
        return Result.success();
    }

    @PostMapping("/batch")
    public Result<?> batchUpdate(@RequestBody Map<String, Object> body) {
        for (Map.Entry<String, Object> entry : body.entrySet()) {
            String key = entry.getKey();
            Object valueObj = entry.getValue();

            QueryWrapper<SysConfig> wrapper = new QueryWrapper<>();
            wrapper.eq("config_key", key);
            SysConfig config = sysConfigMapper.selectOne(wrapper);
            if (config != null) {
                config.setConfigValue(valueObj == null ? null : valueObj.toString());
                sysConfigMapper.updateById(config);
            }
        }
        return Result.success();
    }
}
