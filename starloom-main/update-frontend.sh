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

ZIP_FILE="${ZIP_FILE:-$DEPLOY_DIR/dist.zip}"
HTML_DIR="${HTML_DIR:-}"
if [ -z "$HTML_DIR" ]; then
    if [ -d "/opt/suanming/dist" ]; then
        HTML_DIR="/opt/suanming/dist"
    else
        HTML_DIR="$DEPLOY_DIR/dist"
    fi
fi

echo "📌 前端静态目录: $HTML_DIR"

if [ -f "$ZIP_FILE" ]; then
    if ! command -v unzip >/dev/null 2>&1; then
        echo "❌ 未找到 unzip，请先安装 unzip"
        exit 1
    fi

    echo "📦 检测到压缩包: $ZIP_FILE"

    TMP_DIR="$(mktemp -d)"
    trap 'rm -rf "$TMP_DIR"' EXIT

    unzip -q "$ZIP_FILE" -d "$TMP_DIR"

    NEW_DIST=""
    if [ -d "$TMP_DIR/dist" ]; then
        NEW_DIST="$TMP_DIR/dist"
    else
        if [ -f "$TMP_DIR/index.html" ]; then
            NEW_DIST="$TMP_DIR"
        else
            echo "❌ dist.zip 内容不符合预期（未找到 dist/ 或 index.html）"
            exit 1
        fi
    fi

    if [ -d "$HTML_DIR" ]; then
        BACKUP_DIR="${HTML_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
        echo "🗂️  备份旧 dist -> $BACKUP_DIR"
        mv "$HTML_DIR" "$BACKUP_DIR"
    fi

    echo "📁 更新 dist 目录..."
    mkdir -p "$HTML_DIR"
    cp -a "$NEW_DIST/." "$HTML_DIR/"

    if [ ! -f "$HTML_DIR/index.html" ]; then
        echo "❌ 更新后未找到 dist/index.html，请检查 dist.zip 内容"
        exit 1
    fi

    echo "🧹 清理压缩包: $ZIP_FILE"
    rm -f "$ZIP_FILE"
else
    # 检查 dist 目录
    if [ ! -d "$HTML_DIR" ]; then
        echo "❌ 缺少目录: $HTML_DIR 或 dist.zip"
        exit 1
    fi
fi

if [ -f "$HTML_DIR/index.html" ]; then
    echo "✅ 写入部署标记: $HTML_DIR/deploy.txt"
    {
        echo "deployed_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
        echo "deployed_at_local=$(date +%Y-%m-%dT%H:%M:%S%z)"
        echo "hostname=$(hostname)"
    } > "$HTML_DIR/deploy.txt"
else
    echo "⚠️  未找到 $HTML_DIR/index.html，跳过 deploy.txt 写入"
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
