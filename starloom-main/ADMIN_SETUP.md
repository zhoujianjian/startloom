# 管理后台设置说明

## 概述

StarLoom管理后台已集成到主应用中，通过 `/sysAdm` 路径访问。系统直接使用 `t_user` 表的 `role` 字段区分管理员和普通用户，无需单独的管理员表。

## 用户角色说明

### 角色类型
- `user` - 普通用户（默认）
- `admin` - 管理员
- `super_admin` - 超级管理员

### 权限说明
- **普通用户**: 只能访问前台功能
- **管理员**: 可访问管理后台，管理用户、文章、订单等
- **超级管理员**: 拥有所有权限，可设置其他用户为管理员

## 创建管理员账户

### 方法1: 直接修改数据库
```sql
-- 将现有用户设置为管理员
UPDATE t_user SET role = 'admin' WHERE email = 'admin@example.com';

-- 或创建新的管理员用户
INSERT INTO t_user (email, password, nickname, role, create_time) 
VALUES ('admin@example.com', '$2a$10$...', '管理员', 'admin', NOW());
```

### 方法2: 通过注册后修改角色
1. 先正常注册一个用户账户
2. 在数据库中修改该用户的 `role` 字段为 `admin` 或 `super_admin`

## 登录管理后台

1. 访问: `http://your-domain.com/sysAdm`
2. 使用管理员账户登录
3. 登录成功后自动跳转到仪表板

## 管理后台功能

### 仪表板 (`/sysAdm/dashboard`)
- 用户统计（总数、VIP用户、今日新增等）
- 访问统计（页面浏览量、独立访客等）
- 订单统计（总订单、收入等）
- 实时活动监控

### 用户管理 (`/sysAdm/users`)
- 查看用户列表
- 搜索和筛选用户
- 设置用户角色
- 设置VIP等级和到期时间
- 禁用/启用用户账户

### 数据分析 (`/sysAdm/analytics`)
- 访问趋势图表
- 设备分布统计
- 热门页面分析
- 用户行为分析
- 实时活动监控

## API接口说明

### 认证接口
- `POST /sysAdm/login` - 管理员登录
- 需要提供用户名/邮箱/手机号 + 密码
- 返回管理员token和用户信息

### 用户管理接口
- `GET /sysAdm/users` - 获取用户列表
- `GET /sysAdm/users/{id}` - 获取用户详情
- `POST /sysAdm/users/{id}/role` - 设置用户角色
- `POST /sysAdm/users/{id}/vip` - 设置VIP等级
- `POST /sysAdm/users/{id}/enable` - 启用用户
- `POST /sysAdm/users/{id}/disable` - 禁用用户
- `GET /sysAdm/users/stats` - 获取用户统计

### 统计分析接口
- `GET /sysAdm/dashboard` - 获取仪表板数据
- `GET /sysAdm/stats/pageviews` - 页面访问统计
- `GET /sysAdm/stats/devices` - 设备统计
- `GET /sysAdm/stats/top-pages` - 热门页面
- `GET /sysAdm/realtime/metrics` - 实时指标
- `GET /sysAdm/realtime/activities` - 实时活动

## 安全注意事项

1. **密码加密**: 用户密码使用BCrypt加密存储
2. **Token验证**: 管理员token包含type标识，区分普通用户token
3. **权限控制**: 所有管理接口都需要验证管理员token和权限
4. **操作日志**: 建议记录重要管理操作的日志

## 浏览量统计

系统已集成完整的浏览量统计功能：
- `page_view` 表记录所有页面访问
- 支持按时间、页面、设备等维度分析
- 实时统计热门页面和用户行为
- 可视化图表展示访问趋势

## 扩展功能

管理后台采用模块化设计，可以轻松扩展：
- 文章管理模块
- 订单管理模块  
- 反馈管理模块
- 系统设置模块
- 更多自定义功能

## 技术栈

- **后端**: Spring Boot + MyBatis Plus + MySQL
- **前端**: Vue 3 + Vuex + Vue Router
- **认证**: JWT Token
- **样式**: 自定义CSS（响应式设计）
- **图表**: 纯CSS实现（轻量级）

## 部署说明

管理后台与主应用共享部署配置，无需额外设置。确保：

1. 数据库中存在管理员账户
2. JWT配置正确
3. 管理后台路由拦截器已配置
4. 前端路由守卫已设置权限检查

## 故障排除

### 无法登录管理后台
1. 检查用户是否具有管理员权限（role字段）
2. 确认密码是否正确
3. 检查token生成和验证逻辑

### 权限不足错误
1. 确认用户role字段设置正确
2. 检查AdminInterceptor配置
3. 验证token类型是否为admin

### 数据不显示
1. 检查数据库连接
2. 确认相关表是否存在数据
3. 检查API接口返回格式
