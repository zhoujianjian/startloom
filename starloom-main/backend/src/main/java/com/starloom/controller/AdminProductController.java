package com.starloom.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.starloom.common.Result;
import com.starloom.entity.Product;
import com.starloom.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/sysAdm/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductMapper productMapper;

    @GetMapping("/list")
    public Result<Page<Product>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String productType,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword
    ) {
        Page<Product> pageParam = new Page<>(page, size);
        QueryWrapper<Product> wrapper = new QueryWrapper<>();

        if (productType != null && !productType.trim().isEmpty()) {
            wrapper.eq("product_type", productType.trim());
        }
        if (status != null) {
            wrapper.eq("status", status);
        }
        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.trim();
            wrapper.and(w -> w.like("name", kw)
                    .or().like("product_code", kw)
                    .or().like("subtitle", kw));
        }

        wrapper.orderByAsc("sort_order").orderByDesc("id");
        Page<Product> result = productMapper.selectPage(pageParam, wrapper);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Product> detail(@PathVariable Long id) {
        Product product = productMapper.selectById(id);
        if (product == null) {
            return Result.error(404, "产品不存在");
        }
        return Result.success(product);
    }

    @PostMapping
    public Result<?> create(@RequestBody Product product) {
        product.setId(null);
        productMapper.insert(product);
        return Result.success(product);
    }

    @PutMapping("/{id}")
    public Result<?> update(@PathVariable Long id, @RequestBody Product body) {
        Product product = productMapper.selectById(id);
        if (product == null) {
            return Result.error(404, "产品不存在");
        }
        body.setId(id);
        productMapper.updateById(body);
        return Result.success();
    }

    @PostMapping("/{id}/status")
    public Result<?> setStatus(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Product product = productMapper.selectById(id);
        if (product == null) {
            return Result.error(404, "产品不存在");
        }
        Object v = body.get("status");
        if (v == null) {
            return Result.error(400, "status不能为空");
        }
        product.setStatus(Integer.valueOf(v.toString()));
        productMapper.updateById(product);
        return Result.success();
    }
}
