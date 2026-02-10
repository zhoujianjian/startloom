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

# 检查MySQL容器状态
echo "🔍 检查MySQL容器状态..."
if docker ps | grep -q starloom-mysql; then
    echo "✅ MySQL容器运行正常"
else
    echo "⚠️  MySQL容器未运行，但脚本会继续执行"
    echo "   如果后端启动失败，请检查MySQL状态"
fi
echo ""

# 显示当前后端容器状态
echo "📊 当前后端容器状态:"
if docker ps | grep -q starloom-backend; then
    echo "   后端容器正在运行，将进行重启"
    CONTAINER_ACTION="restart"
else
    echo "   后端容器未运行，将进行启动"
    CONTAINER_ACTION="start"
fi
echo ""

# 停止后端容器
echo "1️⃣  停止后端容器..."
docker-compose stop backend || {
    echo "⚠️  停止后端容器时出现问题，继续执行..."
}

# 等待容器完全停止
echo "⏳ 等待容器完全停止..."
sleep 8

# 移除容器以确保完全清理
echo "🧹 清理后端容器..."
docker-compose rm -f backend || {
    echo "⚠️  移除容器时出现问题，继续执行..."
}

sleep 2

# 启动后端容器
echo ""
echo "2️⃣  启动后端容器..."
docker-compose up -d backend

# 等待启动
echo ""
echo "⏳ 等待后端启动（30秒）..."
for i in {1..30}; do
    if docker ps | grep -q starloom-backend; then
        echo "   容器已启动，等待服务就绪... ($i/30)"
    else
        echo "   等待容器启动... ($i/30)"
    fi
    sleep 1
done

# 检查容器状态
echo ""
echo "3️⃣  检查后端状态..."
if docker ps | grep -q starloom-backend; then
    echo "✅ 后端容器已启动"
    
    # 检查健康状态
    echo "🔍 检查服务健康状态..."
    sleep 5
    if docker-compose ps | grep backend | grep -q "healthy\|Up"; then
        echo "✅ 后端服务运行正常"
    else
        echo "⚠️  后端容器启动但健康检查可能仍在进行"
    fi
else
    echo "❌ 后端启动失败"
    echo ""
    echo "📋 最近日志:"
    docker-compose logs --tail=50 backend
    echo ""
    echo "🔧 故障排查建议:"
    echo "   1. 检查 JAR 文件是否正确"
    echo "   2. 检查 MySQL 连接: docker-compose logs mysql"
    echo "   3. 检查端口占用: netstat -tlnp | grep 8080"
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
echo "   查看后端日志: docker-compose logs -f backend"
echo "   查看所有服务: docker-compose ps"
echo "   重启后端:     docker-compose restart backend"
echo ""
