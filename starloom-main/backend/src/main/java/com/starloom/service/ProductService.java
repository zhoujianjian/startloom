package com.starloom.service;

import com.starloom.entity.Product;
import com.starloom.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductMapper productMapper;
    
    /**
     * 根据商品类型获取商品列表
     */
    public List<Product> getProductsByType(String productType) {
        return productMapper.findByProductType(productType);
    }
    
    /**
     * 获取大师服务列表
     */
    public List<Product> getMasterServices() {
        return getProductsByType("master_service");
    }
    
    /**
     * 根据ID获取商品
     */
    public Product getProductById(Long id) {
        return productMapper.selectById(id);
    }
    
    /**
     * 根据商品编码获取商品
     */
    public Product getProductByCode(String productCode) {
        return productMapper.selectOne(
            new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<Product>()
                .eq("product_code", productCode)
                .eq("status", 1)
        );
    }
}
