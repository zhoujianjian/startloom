#!/bin/bash

# 修复 nginx.conf 文件问题
# 用法: sudo bash fix-nginx.sh

set -e

if [ -z "${BASH_VERSION:-}" ]; then
    exec bash "$0" "$@"
fi

echo "=========================================="
echo "修复 Nginx 配置文件"
echo "=========================================="

if [ "$EUID" -ne 0 ]; then 
    echo "❌ 请使用 sudo 运行此脚本"
    exit 1
fi

DEPLOY_DIR="/opt/suanming"
cd "$DEPLOY_DIR"

echo "📁 部署目录: $DEPLOY_DIR"
echo ""

COMPOSE_CMD=""
if docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_CMD="docker-compose"
else
    echo "❌ 未找到 Docker Compose（请安装 docker compose 插件或 docker-compose）"
    exit 1
fi

# 检查 nginx.conf 是否为目录
if [ -d "nginx.conf" ]; then
    echo "1️⃣  删除 nginx.conf 目录..."
    rm -rf nginx.conf
    echo "✅ 已删除"
fi

# 创建 nginx.conf 文件
echo ""
echo "2️⃣  创建 nginx.conf 文件..."
cat > nginx.conf << 'NGINX_EOF'
# StarLoom Nginx 配置
# 支持域名 https://ibazi.site 和 IP 直接访问

# 上游服务器定义
upstream backend {
    server backend:8080 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

server {
    listen 80;
    server_name ibazi.site www.ibazi.site;

    root /usr/share/nginx/html;
    index index.html;

    access_log /dev/stdout;
    error_log /dev/stderr warn;

    location = /robots.txt {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }

    location = /sitemap.xml {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }

    location = /sitemap-en.xml {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }

    location ~ ^/(chat|v1/chat)$ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 10s;
        proxy_buffering off;
        proxy_cache off;
        proxy_set_header Connection "";
        proxy_http_version 1.1;
    }
    
    # 前端路由
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API 代理
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }

    # Analytics 埋点代理
    location /analytics/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }

    location /sysAdmApi/ {
        rewrite ^/sysAdmApi/(.*)$ /sysAdm/$1 break;
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }
    
    # WebSocket 支持
    location /ws/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 86400;
    }
}

# HTTP 直接访问（IP 地址）
server {
    listen 80;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;

    access_log /dev/stdout;
    error_log /dev/stderr warn;

    location = /robots.txt {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }

    location = /sitemap.xml {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }

    location = /sitemap-en.xml {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }

    location ~ ^/(chat|v1/chat)$ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 10s;
        proxy_buffering off;
        proxy_cache off;
        proxy_set_header Connection "";
        proxy_http_version 1.1;
    }
    
    # 前端路由
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API 代理
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }

    # Analytics 埋点代理
    location /analytics/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }

    location /sysAdmApi/ {
        rewrite ^/sysAdmApi/(.*)$ /sysAdm/$1 break;
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }
    
    # WebSocket 支持
    location /ws/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 86400;
    }
    
    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
NGINX_EOF

echo "✅ 已创建"

# 验证文件类型
echo ""
echo "3️⃣  验证文件类型..."
if [ -f "nginx.conf" ]; then
    echo "✅ nginx.conf 是文件"
else
    echo "❌ nginx.conf 不是文件"
    exit 1
fi

# 停止前端容器
echo ""
echo "4️⃣  停止前端容器..."
$COMPOSE_CMD stop frontend || true
sleep 2

# 启动前端容器
echo ""
echo "5️⃣  启动前端容器..."
$COMPOSE_CMD up -d frontend

# 等待启动
echo ""
echo "⏳ 等待前端启动（10秒）..."
sleep 10

# 检查状态
echo ""
echo "6️⃣  检查前端状态..."
if docker ps | grep -q starloom-frontend; then
    echo "✅ 前端已启动"
else
    echo "❌ 前端启动失败"
    $COMPOSE_CMD logs frontend | tail -30
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Nginx 配置修复完成！"
echo "=========================================="
echo ""
echo "📱 访问地址: http://10.60.215.165"
echo "🔍 查看日志: $COMPOSE_CMD logs -f frontend"
echo ""
