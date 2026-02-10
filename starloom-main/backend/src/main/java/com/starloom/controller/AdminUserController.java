package com.starloom.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.starloom.common.Result;
import com.starloom.entity.User;
import com.starloom.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/sysAdm/users")
@RequiredArgsConstructor
public class AdminUserController {
    
    private final UserService userService;
    
    /**
     * 用户列表
     */
    @GetMapping
    public Result<Page<User>> getUserList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String vipLevel,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String keyword) {
        
        Page<User> pageParam = new Page<>(page, size);
        QueryWrapper<User> wrapper = new QueryWrapper<>();
        
        if (role != null) {
            wrapper.eq("role", role);
        }
        
        if (vipLevel != null) {
            wrapper.eq("vip_level", vipLevel);
        }
        
        if (startDate != null) {
            LocalDateTime start = LocalDateTime.parse(startDate + "T00:00:00");
            wrapper.ge("create_time", start);
        }
        
        if (endDate != null) {
            LocalDateTime end = LocalDateTime.parse(endDate + "T23:59:59");
            wrapper.le("create_time", end);
        }
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            wrapper.and(w -> w.like("email", keyword)
                    .or().like("phone", keyword)
                    .or().like("wechat", keyword)
                    .or().like("nickname", keyword)
                    .or().like("wallet_address", keyword));
        }
        
        wrapper.orderByDesc("create_time");
        Page<User> result = userService.page(pageParam, wrapper);
        
        // 清除密码信息
        result.getRecords().forEach(user -> user.setPassword(null));
        
        return Result.success(result);
    }
    
    /**
     * 用户详情
     */
    @GetMapping("/{id}")
    public Result<User> getUserDetail(@PathVariable Long id) {
        User user = userService.getById(id);
        if (user == null) {
            return Result.error("用户不存在");
        }
        user.setPassword(null);
        return Result.success(user);
    }
    
    /**
     * 设置用户角色
     */
    @PostMapping("/{id}/role")
    public Result<?> setUserRole(@PathVariable Long id, @RequestBody Map<String, String> params) {
        User user = userService.getById(id);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        String role = params.get("role");
        if (!"user".equals(role) && !"admin".equals(role) && !"super_admin".equals(role)) {
            return Result.error("角色参数错误");
        }
        
        user.setRole(role);
        userService.updateById(user);
        
        return Result.success();
    }
    
    /**
     * 设置VIP等级
     */
    @PostMapping("/{id}/vip")
    public Result<?> setUserVip(@PathVariable Long id, @RequestBody Map<String, Object> params) {
        User user = userService.getById(id);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        Integer vipLevel = (Integer) params.get("vipLevel");
        LocalDateTime vipExpireTime = params.get("vipExpireTime") != null ? 
            LocalDateTime.parse(params.get("vipExpireTime").toString()) : null;
        
        user.setVipLevel(vipLevel);
        user.setVipExpireTime(vipExpireTime);
        
        userService.updateById(user);
        
        return Result.success();
    }
    
    /**
     * 禁用/启用用户
     */
    @PostMapping("/{id}/disable")
    public Result<?> disableUser(@PathVariable Long id) {
        User user = userService.getById(id);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        // 不允许禁用管理员
        if (user.isAdmin()) {
            return Result.error("不能禁用管理员账户");
        }
        
        user.setDeleted(1);
        userService.updateById(user);
        
        return Result.success();
    }
    
    @PostMapping("/{id}/enable")
    public Result<?> enableUser(@PathVariable Long id) {
        User user = userService.getById(id);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        user.setDeleted(0);
        userService.updateById(user);
        
        return Result.success();
    }
    
    /**
     * 获取用户统计
     */
    @GetMapping("/stats")
    public Result<?> getUserStats() {
        // 总用户数
        long totalUsers = userService.count();
        
        // 普通用户数
        long normalUsers = userService.count(new QueryWrapper<User>()
                .eq("vip_level", 0)
                .eq("deleted", 0));
        
        // VIP用户数
        long vipUsers = userService.count(new QueryWrapper<User>()
                .gt("vip_level", 0)
                .eq("deleted", 0));
        
        // 管理员数
        long adminUsers = userService.count(new QueryWrapper<User>()
                .in("role", "admin", "super_admin")
                .eq("deleted", 0));
        
        // 今日新增
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        long todayNew = userService.count(new QueryWrapper<User>()
                .ge("create_time", todayStart));
        
        Map<String, Object> stats = Map.of(
                "totalUsers", totalUsers,
                "normalUsers", normalUsers,
                "vipUsers", vipUsers,
                "adminUsers", adminUsers,
                "todayNew", todayNew
        );
        
        return Result.success(stats);
    }
}
