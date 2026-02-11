#!/bin/bash

# StarLoom 后端更新脚本
# 用法: sudo bash update-backend.sh
# 功能: 仅重启后端服务，不影响MySQL和前端

set -e

echo "=========================================="
echo "StarLoom 后端更新脚本"
echo "=========================================="

if [ "$EUID" -ne 0 ]; then 
    echo "❌ 请使用 sudo 运行此脚本"
    exit 1
fi

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DEPLOY_DIR"

COMPOSE_CMD=""
if docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_CMD="docker-compose"
else
    echo "❌ 未找到 Docker Compose（请安装 docker compose 插件或 docker-compose）"
    exit 1
fi

# 检查 JAR 文件
if [ ! -f "starloom-backend-1.0.0.jar" ]; then
    echo "❌ 缺少文件: starloom-backend-1.0.0.jar"
    echo "   请确保 JAR 文件在当前目录中"
    exit 1
fi

# 检查 docker-compose.yml
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ 缺少文件: docker-compose.yml"
    exit 1
fi

echo "📁 部署目录: $DEPLOY_DIR"
echo ""

echo "� 更新后端（仅 backend；不动 mysql/redis/frontend）..."

if docker ps --format '{{.Names}}' | grep -q '^starloom-backend$'; then
    echo "1️⃣  重启 backend 容器..."
    $COMPOSE_CMD restart backend
else
    echo "1️⃣  启动 backend 容器..."
    $COMPOSE_CMD up -d backend
fi

echo ""
echo "2️⃣  检查 backend 状态..."
if docker ps --format '{{.Names}}' | grep -q '^starloom-backend$'; then
    echo "✅ backend 容器已运行"
else
    echo "❌ backend 容器未运行"
    echo "📋 backend 最近日志:"
    $COMPOSE_CMD logs --tail=120 backend
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ 后端更新完成！"
echo "=========================================="
echo ""
echo "📊 服务状态:"
echo "   MySQL: $(docker ps | grep starloom-mysql | awk '{print $8}' || echo '未运行')"
echo "   后端:  $(docker ps | grep starloom-backend | awk '{print $8}' || echo '未运行')"
echo "   前端:  $(docker ps | grep starloom-frontend | awk '{print $8}' || echo '未运行')"
echo ""
echo "🔍 常用命令:"
echo "   查看后端日志: $COMPOSE_CMD logs -f backend"
echo "   查看所有服务: $COMPOSE_CMD ps"
echo "   重启后端:     $COMPOSE_CMD restart backend"
echo ""
