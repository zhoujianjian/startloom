package com.starloom.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.starloom.entity.VipBenefit;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface VipBenefitMapper extends BaseMapper<VipBenefit> {
    
    @Select("SELECT b.id, b.name, b.code, lb.benefit_value as value " +
            "FROM t_vip_benefit b " +
            "LEFT JOIN t_vip_level_benefit lb ON b.id = lb.benefit_id AND lb.vip_level = #{vipLevel} " +
            "WHERE b.status = 1 AND b.deleted = 0 " +
            "ORDER BY b.sort_order")
    List<Map<String, Object>> getBenefitsByLevel(@Param("vipLevel") Integer vipLevel);
    
    @Select("SELECT b.id, b.name, b.code, " +
            "MAX(CASE WHEN lb.vip_level = 3 THEN lb.benefit_value END) as diamond, " +
            "MAX(CASE WHEN lb.vip_level = 2 THEN lb.benefit_value END) as gold, " +
            "MAX(CASE WHEN lb.vip_level = 1 THEN lb.benefit_value END) as normal " +
            "FROM t_vip_benefit b " +
            "LEFT JOIN t_vip_level_benefit lb ON b.id = lb.benefit_id " +
            "WHERE b.status = 1 AND b.deleted = 0 " +
            "GROUP BY b.id, b.name, b.code " +
            "ORDER BY b.sort_order")
    List<Map<String, Object>> getAllBenefitsComparison();
}
