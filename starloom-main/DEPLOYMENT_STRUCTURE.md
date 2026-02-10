# StarLoom 部署结构说明

## 📁 项目结构（已整理）

```
starloom-main/
├── 📄 deploy.sh                    # ⭐ 一键部署脚本（新服务器）
├── 📄 update-backend.sh            # ⭐ 后端更新脚本
├── 📄 update-frontend.sh           # ⭐ 前端更新脚本
├── 📄 docker-compose.yml           # Docker 编排配置
├── 📄 nginx-ip.conf                # Nginx 配置（支持域名和IP）
├── 📄 README.md                    # 部署指南
├── 📄 starloom.sql                 # 数据库初始化脚本
├── 📄 starloom-backend-1.0.0.jar   # 后端 JAR 文件
├── 📁 dist/                        # 前端构建输出
├── 📁 backend/                     # 后端源代码
│   ├── Dockerfile
│   ├── pom.xml
│   ├── README.md
│   └── src/
└── 📁 frontend/                    # 前端源代码
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── README.md
    └── src/
```

---

## 🚀 部署流程

### 1️⃣ 新服务器部署

```bash
# 上传所有文件到服务器 /opt/suanming 目录
# 然后执行：
sudo bash deploy.sh
```

**脚本会自动：**
- ✅ 检查 Docker 和 Docker Compose
- ✅ 验证必要文件
- ✅ 停止现有容器
- ✅ 配置 Nginx
- ✅ 启动所有容器
- ✅ 验证服务状态

---

### 2️⃣ 更新后端

```bash
# 替换 starloom-backend-1.0.0.jar 文件
# 然后执行：
sudo bash update-backend.sh
```

**脚本会自动：**
- ✅ 停止后端容器
- ✅ 启动新的后端容器
- ✅ 验证后端状态

---

### 3️⃣ 更新前端

```bash
# 替换 dist/ 目录中的文件
# 然后执行：
sudo bash update-frontend.sh
```

**脚本会自动：**
- ✅ 停止前端容器
- ✅ 启动新的前端容器
- ✅ 验证前端状态

---

## 🌐 访问方式

| 方式 | 地址 | 说明 |
|------|------|------|
| 域名 HTTPS | https://ibazi.site | 生产环境推荐 |
| IP HTTP | http://10.60.215.165 | 测试/开发环境 |
| API | http://10.60.215.165/api | 后端 API 接口 |

---

## 📋 Nginx 配置说明

**文件：nginx-ip.conf**

- ✅ 支持 HTTPS 域名访问（https://ibazi.site）
- ✅ 支持 HTTP IP 访问（http://10.60.215.165）
- ✅ 自动将 HTTP 域名请求重定向到 HTTPS
- ✅ 配置了 API 代理（/api/ → backend:8080）
- ✅ 配置了 WebSocket 支持（/ws/）
- ✅ 静态资源缓存优化

**SSL 证书配置：**
```nginx
# 需要在 nginx-ip.conf 中配置证书路径
ssl_certificate /etc/nginx/ssl/ibazi.site.crt;
ssl_certificate_key /etc/nginx/ssl/ibazi.site.key;
```

---

## 🐳 Docker 容器说明

| 容器名 | 镜像 | 端口 | 说明 |
|--------|------|------|------|
| starloom-mysql | mysql:8.0 | 3306 | 数据库 |
| starloom-backend | eclipse-temurin:17-jdk | 8080 | Java 后端 |
| starloom-frontend | nginx:alpine | 80/443 | 前端服务 |

---

## 🔧 常用命令

```bash
# 查看所有容器状态
docker ps

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
docker-compose restart mysql

# 进入容器
docker exec -it starloom-backend bash
docker exec -it starloom-frontend sh
docker exec -it starloom-mysql mysql -u root -p
```

---

## ⚠️ 重要提示

1. **首次部署**：确保 starloom.sql 文件存在，会自动导入数据库
2. **SSL 证书**：如需使用 HTTPS，需要配置证书路径
3. **文件权限**：部署脚本需要 sudo 权限
4. **端口占用**：确保 80、443、3306、8080 端口未被占用
5. **数据备份**：更新前建议备份数据库

---

## 📞 故障排查

### 容器无法启动
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

### API 连接失败
- 检查 Nginx 配置中的 `proxy_pass http://backend:8080`
- 确保 Backend 容器正常运行

### 数据库连接失败
- 检查 MySQL 容器是否运行
- 验证数据库凭证（用户：starloom，密码：starloom123456）

---

## ✅ 整理完成

已删除的冗余文件：
- ❌ DEPLOY_NOW.sh
- ❌ quick-deploy.sh
- ❌ quick-start.sh
- ❌ QUICK_DEPLOY.md
- ❌ DEPLOYMENT_SUMMARY_CN.md
- ❌ mysql-init.sql
- ❌ starloom-init.sql
- ❌ vite.config.js.timestamp-*
- ❌ dist.zip
- ❌ baidu_verify_codeva-oQ2Chkk21K.html

保留的核心文件：
- ✅ deploy.sh（一键部署）
- ✅ update-backend.sh（后端更新）
- ✅ update-frontend.sh（前端更新）
- ✅ docker-compose.yml（Docker 编排）
- ✅ nginx-ip.conf（Nginx 配置）
- ✅ README.md（部署指南）
