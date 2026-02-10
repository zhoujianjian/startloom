package com.starloom.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.starloom.common.Result;
import com.starloom.entity.SysConfig;
import com.starloom.mapper.SysConfigMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/sysAdm/config")
@RequiredArgsConstructor
public class AdminSysConfigController {

    private final SysConfigMapper sysConfigMapper;

    @GetMapping("/list")
    public Result<Page<SysConfig>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String group,
            @RequestParam(required = false) String key,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status
    ) {
        Page<SysConfig> pageParam = new Page<>(page, size);
        QueryWrapper<SysConfig> wrapper = new QueryWrapper<>();

        if (group != null && !group.trim().isEmpty()) {
            wrapper.eq("config_group", group.trim());
        }
        if (key != null && !key.trim().isEmpty()) {
            wrapper.like("config_key", key.trim());
        }
        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.trim();
            wrapper.and(w -> w.like("config_key", kw)
                    .or().like("config_name", kw)
                    .or().like("description", kw));
        }
        if (status != null) {
            wrapper.eq("status", status);
        }

        wrapper.orderByAsc("sort_order").orderByDesc("id");
        Page<SysConfig> result = sysConfigMapper.selectPage(pageParam, wrapper);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<SysConfig> detail(@PathVariable Long id) {
        SysConfig config = sysConfigMapper.selectById(id);
        if (config == null) {
            return Result.error(404, "配置不存在");
        }
        return Result.success(config);
    }

    @PostMapping
    public Result<?> create(@RequestBody SysConfig body) {
        if (body.getConfigGroup() == null || body.getConfigGroup().trim().isEmpty()) {
            return Result.error(400, "configGroup不能为空");
        }
        if (body.getConfigKey() == null || body.getConfigKey().trim().isEmpty()) {
            return Result.error(400, "configKey不能为空");
        }

        body.setId(null);
        if (body.getStatus() == null) {
            body.setStatus(1);
        }
        sysConfigMapper.insert(body);
        return Result.success(body);
    }

    @PutMapping("/{id}")
    public Result<?> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        SysConfig config = sysConfigMapper.selectById(id);
        if (config == null) {
            return Result.error(404, "配置不存在");
        }

        if (body.containsKey("configValue")) {
            Object v = body.get("configValue");
            config.setConfigValue(v == null ? null : v.toString());
        }
        if (body.containsKey("configName")) {
            Object v = body.get("configName");
            config.setConfigName(v == null ? null : v.toString());
        }
        if (body.containsKey("status")) {
            Object v = body.get("status");
            config.setStatus(v == null ? null : Integer.valueOf(v.toString()));
        }
        if (body.containsKey("sortOrder")) {
            Object v = body.get("sortOrder");
            config.setSortOrder(v == null ? null : Integer.valueOf(v.toString()));
        }
        if (body.containsKey("description")) {
            Object v = body.get("description");
            config.setDescription(v == null ? null : v.toString());
        }
        if (body.containsKey("isPublic")) {
            Object v = body.get("isPublic");
            config.setIsPublic(v == null ? null : Integer.valueOf(v.toString()));
        }

        sysConfigMapper.updateById(config);
        return Result.success();
    }
}
