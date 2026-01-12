#!/bin/bash

# StarLoom 前端 Docker Nginx 部署脚本

CONTAINER_NAME="starloom-frontend"
FRONTEND_DIR="/opt/suanming/dist"
NGINX_CONF="/opt/suanming/nginx.conf"

echo "=========================================="
echo "StarLoom Frontend 部署"
echo "=========================================="

# 停止旧容器
echo "停止旧容器..."
docker stop $CONTAINER_NAME 2>/dev/null
docker rm $CONTAINER_NAME 2>/dev/null

# 启动 Nginx 容器
echo "启动 Nginx..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart always \
  --network host \
  -v $FRONTEND_DIR:/usr/share/nginx/html:ro \
  -v $NGINX_CONF:/etc/nginx/conf.d/default.conf:ro \
  -e TZ=Asia/Shanghai \
  nginx:alpine

echo "等待启动..."
sleep 3

if docker ps | grep -q $CONTAINER_NAME; then
  echo "=========================================="
  echo "✅ 启动成功！"
  echo "=========================================="
  echo "前端地址: http://localhost"
  echo "查看日志: docker logs -f $CONTAINER_NAME"
else
  echo "❌ 启动失败"
  docker logs $CONTAINER_NAME
fi
