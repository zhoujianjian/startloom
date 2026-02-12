# StarLoom 部署指南

## 📋 快速开始

### 一键部署（新服务器）

```bash
sudo bash deploy.sh
```

这个脚本会：
1. 检查 Docker 和 Docker Compose
2. 验证必要文件
3. 启动 MySQL、Backend、Frontend 容器
4. 自动配置 Nginx

### 单独更新后端

```bash
sudo bash update-backend.sh
```

### 单独更新前端

```bash
sudo bash update-frontend.sh
```

---

## 🌐 访问方式

- **域名访问**：https://ibazi.site
- **IP 访问**：http://10.60.215.165
- **API 地址**：http://10.60.215.165/api

---

## 📁 项目结构

```
starloom-main/
├── deploy.sh                 # 一键部署脚本
├── update-backend.sh         # 后端更新脚本
├── update-frontend.sh        # 前端更新脚本
├── docker-compose.yml        # Docker 编排配置
├── nginx-ip.conf            # Nginx 配置（支持域名和IP）
├── starloom.sql             # 数据库初始化脚本
├── starloom-backend-1.0.0.jar  # 后端 JAR 文件
├── dist/                    # 前端构建输出
├── backend/                 # 后端源代码
└── frontend/                # 前端源代码
```

---

## 🔧 常用命令

```bash
# 查看所有容器日志
docker-compose logs -f

# 查看特定容器日志
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# 停止所有服务
docker-compose down

# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart backend
docker-compose restart frontend
```

---

## 📝 配置说明

### Nginx 配置（nginx-ip.conf）

- 支持 HTTPS 域名访问（https://ibazi.site）
- 支持 HTTP IP 访问（http://10.60.215.165）
- 自动将 HTTP 域名请求重定向到 HTTPS
- 配置了 API 代理和 WebSocket 支持

### Docker Compose 配置（docker-compose.yml）

- **MySQL**：数据库服务，端口 3306
- **Backend**：Java 应用，端口 8080
- **Frontend**：Nginx 服务，端口 80/443

---

## ⚠️ 注意事项

1. **SSL 证书**：如需使用 HTTPS，需要配置 SSL 证书路径在 nginx-ip.conf 中
2. **数据库初始化**：首次部署时，starloom.sql 会自动导入到 MySQL
3. **文件权限**：部署脚本需要 sudo 权限
4. **端口占用**：确保 80、443、3306、8080 端口未被占用

---

## 🐛 故障排查

### 容器无法启动

```bash
# 查看详细日志
docker-compose logs backend

# 重新构建并启动
docker-compose down
docker-compose up -d
```

### API 连接失败

- 检查 Nginx 配置中的 `proxy_pass http://backend:8080`
- 确保 Backend 容器正常运行：`docker ps | grep backend`

### 数据库连接失败

- 检查 MySQL 容器是否运行：`docker ps | grep mysql`
- 验证数据库凭证：用户名默认 `starloom`（可通过环境变量修改），密码通过环境变量设置

---

## 📞 支持

如有问题，请查看容器日志或联系开发团队。

