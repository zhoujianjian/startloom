#!/bin/bash

# StarLoom 前端更新脚本
# 用法: sudo bash update-frontend.sh

set -e

if [ -z "${BASH_VERSION:-}" ]; then
    exec bash "$0" "$@"
fi

echo "=========================================="
echo "StarLoom 前端更新"
echo "=========================================="

if [ "$EUID" -ne 0 ]; then 
    echo "❌ 请使用 sudo 运行此脚本"
    exit 1
fi

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DEPLOY_DIR"

# 检查 dist 目录
if [ ! -d "dist" ]; then
    echo "❌ 缺少目录: dist"
    exit 1
fi

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

# 停止前端容器
echo "1️⃣  停止前端容器..."
$COMPOSE_CMD stop frontend || true

# 等待容器停止
sleep 3

# 启动前端容器
echo ""
echo "2️⃣  启动前端容器..."
$COMPOSE_CMD up -d frontend

# 等待启动
echo ""
echo "⏳ 等待前端启动（10秒）..."
sleep 10

# 检查状态
echo ""
echo "3️⃣  检查前端状态..."
if docker ps | grep -q starloom-frontend; then
    echo "✅ 前端已启动"
else
    echo "❌ 前端启动失败"
    $COMPOSE_CMD logs frontend | tail -30
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ 前端更新完成！"
echo "=========================================="
echo ""
echo "📱 访问地址: http://10.60.215.165"
echo "🔍 查看日志: $COMPOSE_CMD logs -f frontend"
echo ""
