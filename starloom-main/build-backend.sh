#!/bin/bash

# StarLoom 后端构建脚本
# 用法: bash build-backend.sh

set -e

echo "=========================================="
echo "StarLoom 后端构建脚本"
echo "=========================================="

if [ "$EUID" -eq 0 ]; then 
    echo "⚠️  不建议使用 root 用户构建，建议使用普通用户"
    read -p "是否继续？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 检查是否在正确目录
if [ ! -d "backend" ]; then
    echo "❌ 请在 starloom-main 根目录执行此脚本"
    exit 1
fi

echo "📁 当前目录: $(pwd)"
echo ""

# 检查 Java 版本
echo "🔍 检查 Java 版本..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | awk -F '"' '{print $2}')
    echo "✅ Java 版本: $JAVA_VERSION"
else
    echo "❌ 未找到 Java，请安装 Java 17"
    exit 1
fi

# 检查 Maven
echo "🔍 检查 Maven..."
if command -v mvn &> /dev/null; then
    MVN_VERSION=$(mvn -version | head -n 1 | awk '{print $3}')
    echo "✅ Maven 版本: $MVN_VERSION"
else
    echo "❌ 未找到 Maven，请安装 Maven"
    exit 1
fi

echo ""
echo "🔨 开始构建后端..."
echo ""

# 进入后端目录
cd backend

# 清理并编译
echo "1️⃣  清理之前的构建..."
mvn clean

echo ""
echo "2️⃣  编译项目..."
mvn compile

echo ""
echo "3️⃣  打包项目..."
mvn package -DskipTests

# 检查构建结果
if [ -f "target/starloom-backend-1.0.0.jar" ]; then
    echo ""
    echo "✅ 构建成功！"
    echo "📦 JAR 文件位置: backend/target/starloom-backend-1.0.0.jar"
    
    # 复制到根目录
    echo ""
    echo "4️⃣  复制 JAR 文件到根目录..."
    cp target/starloom-backend-1.0.0.jar ../starloom-backend-1.0.0.jar
    echo "✅ 已复制到根目录"
    
    # 显示文件信息
    echo ""
    echo "📊 文件信息:"
    ls -lh ../starloom-backend-1.0.0.jar
    
else
    echo ""
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ 后端构建完成！"
echo "=========================================="
echo ""
echo "🚀 下一步操作:"
echo "   1. 上传 starloom-backend-1.0.0.jar 到服务器"
echo "   2. 在服务器执行: sudo bash update-backend.sh"
echo ""
