package com.starloom.service;

import com.starloom.entity.SysConfig;
import com.starloom.mapper.SysConfigMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SysConfigService {
    
    private final SysConfigMapper sysConfigMapper;
    
    /**
     * 获取指定分组的所有配置
     */
    public List<SysConfig> getConfigsByGroup(String configGroup) {
        return sysConfigMapper.findByGroup(configGroup);
    }
    
    /**
     * 获取指定分组的公开配置（前端可读）
     */
    public List<SysConfig> getPublicConfigsByGroup(String configGroup) {
        return sysConfigMapper.findPublicByGroup(configGroup);
    }
    
    /**
     * 获取指定分组的配置，转为Map
     */
    public Map<String, String> getConfigMapByGroup(String configGroup) {
        List<SysConfig> configs = sysConfigMapper.findPublicByGroup(configGroup);
        Map<String, String> map = new HashMap<>();
        for (SysConfig config : configs) {
            map.put(config.getConfigKey(), config.getConfigValue());
        }
        return map;
    }
    
    /**
     * 获取单个配置值
     */
    public String getConfigValue(String configGroup, String configKey) {
        SysConfig config = sysConfigMapper.findByGroupAndKey(configGroup, configKey);
        return config != null ? config.getConfigValue() : null;
    }
    
    /**
     * 获取单个配置值，带默认值
     */
    public String getConfigValue(String configGroup, String configKey, String defaultValue) {
        String value = getConfigValue(configGroup, configKey);
        return value != null ? value : defaultValue;
    }
}
