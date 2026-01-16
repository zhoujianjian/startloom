package com.starloom.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.starloom.entity.OnlineSession;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface OnlineSessionMapper extends BaseMapper<OnlineSession> {
    
    // 统计5分钟内活跃的会话数
    @Select("SELECT COUNT(*) FROM online_session WHERE last_active > DATE_SUB(NOW(), INTERVAL 5 MINUTE)")
    int getOnlineCount();
    
    // 清理过期会话
    @Delete("DELETE FROM online_session WHERE last_active < DATE_SUB(NOW(), INTERVAL 30 MINUTE)")
    int cleanExpired();
}
