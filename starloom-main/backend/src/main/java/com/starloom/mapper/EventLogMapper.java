package com.starloom.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.starloom.entity.EventLog;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EventLogMapper extends BaseMapper<EventLog> {
}
