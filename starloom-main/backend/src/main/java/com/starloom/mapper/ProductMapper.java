package com.starloom.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.starloom.entity.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface ProductMapper extends BaseMapper<Product> {
    
    @Select("SELECT * FROM product WHERE product_type = #{productType} AND status = 1 ORDER BY sort_order ASC")
    List<Product> findByProductType(String productType);
}
