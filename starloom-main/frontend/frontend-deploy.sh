#!/bin/bash

# StarLoom 前端 Docker Nginx 部署脚本

CONTAINER_NAME="starloom-frontend"
FRONTEND_DIR="/opt/suanming/dist"
NGINX_CONF="/opt/suanming/nginx.conf"
SSL_DIR="/etc/letsencrypt/live/ibazi.site"

echo "=========================================="
echo "StarLoom Frontend 部署"
echo "=========================================="

# 创建目录
mkdir -p $FRONTEND_DIR

# 停止旧容器
echo "停止旧容器..."
docker stop $CONTAINER_NAME 2>/dev/null
docker rm $CONTAINER_NAME 2>/dev/null

# 启动 Nginx 容器
echo "启动 Nginx..."

# 检查是否有SSL证书
if [ -d "$SSL_DIR" ]; then
  echo "检测到SSL证书，启用HTTPS..."
  docker run -d \
    --name $CONTAINER_NAME \
    --restart always \
    --network host \
    -v $FRONTEND_DIR:/usr/share/nginx/html:ro \
    -v $NGINX_CONF:/etc/nginx/conf.d/default.conf:ro \
    -v $SSL_DIR/fullchain.pem:/etc/nginx/ssl/fullchain.pem:ro \
    -v $SSL_DIR/privkey.pem:/etc/nginx/ssl/privkey.pem:ro \
    -v /etc/letsencrypt:/etc/letsencrypt:ro \
    -e TZ=Asia/Shanghai \
    nginx:alpine
else
  echo "未检测到SSL证书，仅启用HTTP..."
  docker run -d \
    --name $CONTAINER_NAME \
    --restart always \
    --network host \
    -v $FRONTEND_DIR:/usr/share/nginx/html:ro \
    -v $NGINX_CONF:/etc/nginx/conf.d/default.conf:ro \
    -e TZ=Asia/Shanghai \
    nginx:alpine
fi

echo "等待启动..."
sleep 3

if docker ps | grep -q $CONTAINER_NAME; then
  echo "=========================================="
  echo "✅ 启动成功！"
  echo "=========================================="
  if [ -d "$SSL_DIR" ]; then
    echo "前端地址: https://ibazi.site"
  else
    echo "前端地址: http://localhost"
  fi
  echo "查看日志: docker logs -f $CONTAINER_NAME"
else
  echo "❌ 启动失败"
  docker logs $CONTAINER_NAME
fi
