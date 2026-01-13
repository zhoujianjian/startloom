package com.starloom.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.starloom.entity.SysConfig;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface SysConfigMapper extends BaseMapper<SysConfig> {
    
    @Select("SELECT * FROM sys_config WHERE config_group = #{configGroup} AND status = 1 ORDER BY sort_order ASC")
    List<SysConfig> findByGroup(String configGroup);
    
    @Select("SELECT * FROM sys_config WHERE config_group = #{configGroup} AND is_public = 1 AND status = 1 ORDER BY sort_order ASC")
    List<SysConfig> findPublicByGroup(String configGroup);
    
    @Select("SELECT * FROM sys_config WHERE config_group = #{configGroup} AND config_key = #{configKey} AND status = 1")
    SysConfig findByGroupAndKey(String configGroup, String configKey);
}
