#!/bin/bash

# StarLoom 后端 Docker 快速部署脚本
# 配置已在 application-prod.yml 中，这里只需要 JVM 参数

CONTAINER_NAME="starloom-backend"
JAR_PATH="/opt/suanming/starloom-backend-1.0.0.jar"
APP_PORT="8080"

# 使用 Eclipse Temurin 镜像 (国内可访问)
IMAGE="eclipse-temurin:17-jdk"

# JVM 配置 (2G内存服务器)
JVM_XMS="512m"
JVM_XMX="1024m"

echo "=========================================="
echo "StarLoom Backend 部署"
echo "=========================================="

# 停止并删除旧容器
echo "停止旧容器..."
docker stop $CONTAINER_NAME 2>/dev/null
docker rm $CONTAINER_NAME 2>/dev/null

# 创建日志目录
mkdir -p /opt/suanming/logs

# 拉取镜像
echo "拉取镜像..."
docker pull $IMAGE

# 启动容器
echo "启动新容器..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart always \
  --network host \
  -v $JAR_PATH:/app/app.jar:ro \
  -v /opt/suanming/logs:/app/logs \
  -e TZ=Asia/Shanghai \
  $IMAGE \
  java \
    -Xms${JVM_XMS} \
    -Xmx${JVM_XMX} \
    -XX:+UseG1GC \
    -XX:MaxGCPauseMillis=200 \
    -XX:+HeapDumpOnOutOfMemoryError \
    -XX:HeapDumpPath=/app/logs/heapdump.hprof \
    -Djava.security.egd=file:/dev/./urandom \
    -Dfile.encoding=UTF-8 \
    -jar /app/app.jar \
    --spring.profiles.active=prod

echo "等待启动 (10秒)..."
sleep 10

# 检查状态
if docker ps | grep -q $CONTAINER_NAME; then
  echo "=========================================="
  echo "✅ 启动成功！"
  echo "=========================================="
  echo "服务地址: http://localhost:${APP_PORT}"
  echo "查看日志: docker logs -f $CONTAINER_NAME"
else
  echo "❌ 启动失败，查看日志:"
  docker logs $CONTAINER_NAME
fi
