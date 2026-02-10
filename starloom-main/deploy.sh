#!/bin/bash

# StarLoom 一键部署脚本（支持 Ubuntu/CentOS，自动选择镜像源）
# 用法: sudo bash deploy.sh

set -e

echo "=========================================="
echo "StarLoom 全自动部署脚本"
echo "=========================================="

if [ "$EUID" -ne 0 ]; then 
    echo "❌ 请使用 sudo 运行此脚本"
    exit 1
fi

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DEPLOY_DIR"

echo "📁 部署目录: $DEPLOY_DIR"
echo ""

# 检测操作系统
echo "1️⃣  检测操作系统..."
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
    echo "🖥️  操作系统: $OS $VER"
else
    echo "❌ 无法检测操作系统"
    exit 1
fi

# 检测网络环境（国内/国外）
echo ""
echo "2️⃣  检测网络环境..."
if curl -s --connect-timeout 5 http://mirrors.aliyun.com >/dev/null 2>&1; then
    echo "🇨🇳 检测到国内网络环境，使用国内镜像源"
    CHINA=true
else
    echo "🌍 检测到国外网络环境，使用官方镜像源"
    CHINA=false
fi

# 安装 Docker 和 Docker Compose
echo ""
echo "3️⃣  安装 Docker 和 Docker Compose..."

install_docker_ubuntu() {
    echo "📦 Ubuntu 系统安装 Docker..."
    
    # 卸载旧版本
    apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
    
    # 更新包索引
    apt-get update
    
    # 安装依赖
    apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
    
    # 添加 Docker GPG 密钥
    if [ "$CHINA" = true ]; then
        curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
    else
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
    fi
    
    # 安装 Docker
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io
    
    # 安装 Docker Compose
    if [ "$CHINA" = true ]; then
        curl -L "https://get.daocloud.io/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    else
        curl -L "https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    fi
    chmod +x /usr/local/bin/docker-compose
}

install_docker_centos() {
    echo "📦 CentOS 系统安装 Docker..."
    
    # 卸载旧版本
    yum remove -y docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine 2>/dev/null || true
    
    # 安装依赖
    yum install -y yum-utils
    
    # 添加 Docker 仓库
    if [ "$CHINA" = true ]; then
        yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
    else
        yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    fi
    
    # 安装 Docker
    yum install -y docker-ce docker-ce-cli containerd.io
    
    # 安装 Docker Compose
    if [ "$CHINA" = true ]; then
        curl -L "https://get.daocloud.io/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    else
        curl -L "https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    fi
    chmod +x /usr/local/bin/docker-compose
}

# 根据操作系统安装 Docker
if [[ "$OS" == *"Ubuntu"* ]]; then
    install_docker_ubuntu
elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]] || [[ "$OS" == *"Rocky"* ]]; then
    install_docker_centos
else
    echo "❌ 不支持的操作系统: $OS"
    exit 1
fi

# 启动 Docker 服务
echo ""
echo "4️⃣  启动 Docker 服务..."
systemctl enable docker
systemctl start docker

# 配置 Docker 镜像加速器（国内）
if [ "$CHINA" = true ]; then
    echo "🚀 配置 Docker 镜像加速器..."
    mkdir -p /etc/docker
    cat > /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
EOF
    systemctl daemon-reload
    systemctl restart docker
fi

# 创建部署目录
echo ""
echo "5️⃣  创建部署目录..."
mkdir -p /opt/suanming/{deploy,logs/nginx}
mkdir -p /opt/suanming/logs

# 检查必要文件
echo ""
echo "6️⃣  检查必要文件..."
required_files=("docker-compose.yml" "nginx-ip.conf" "starloom-backend-1.0.0.jar" "dist" "starloom.sql")
for file in "${required_files[@]}"; do
    if [ ! -e "$file" ]; then
        echo "❌ 缺少文件: $file"
        exit 1
    fi
done
echo "✅ 所有必要文件都存在"

# 复制文件到部署目录
echo ""
echo "7️⃣  复制部署文件..."
cp starloom-backend-1.0.0.jar /opt/suanming/deploy/
cp -r dist /opt/suanming/
cp nginx-ip.conf /opt/suanming/nginx.conf
cp docker-compose.yml /opt/suanming/
cp starloom.sql /opt/suanming/

# 停止现有容器
echo ""
echo "8️⃣  停止现有容器..."
cd /opt/suanming
docker-compose down 2>/dev/null || true

# 启动容器
echo ""
echo "9️⃣  启动所有服务..."
echo "   - MySQL 数据库"
echo "   - Redis 缓存" 
echo "   - 后端服务"
echo "   - 前端服务"
docker-compose up -d

# 等待服务启动
echo ""
echo "⏳ 等待服务启动..."
echo "   - MySQL 启动中..."
sleep 20
echo "   - Redis 启动中..."
sleep 10
echo "   - 后端服务启动中..."
sleep 30
echo "   - 前端服务启动中..."
sleep 10

# 检查容器状态
echo ""
echo "🔟 检查服务状态..."
services=("starloom-mysql:MySQL数据库" "starloom-redis:Redis缓存" "starloom-backend:后端服务" "starloom-frontend:前端服务")

all_running=true
for service_info in "${services[@]}"; do
    container=$(echo $service_info | cut -d: -f1)
    name=$(echo $service_info | cut -d: -f2)
    
    if docker ps | grep -q $container; then
        echo "✅ $name 运行中"
    else
        echo "❌ $name 未运行"
        docker-compose logs $container | tail -10
        all_running=false
    fi
done

# 获取服务器IP
SERVER_IP=$(ip route get 1 | awk '{print $7}' | head -1)

# 显示部署结果
echo ""
echo "=========================================="
if [ "$all_running" = true ]; then
    echo "✅ 部署成功完成！"
else
    echo "⚠️  部署完成，但部分服务可能有问题"
fi
echo "=========================================="
echo ""
echo "🌐 访问地址:"
echo "   - 前端页面: http://$SERVER_IP"
echo "   - 后端API: http://$SERVER_IP:8080"
echo ""
echo "🔧 常用命令:"
echo "   - 查看日志: cd /opt/suanming && docker-compose logs -f"
echo "   - 重启服务: cd /opt/suanming && docker-compose restart"
echo "   - 停止服务: cd /opt/suanming && docker-compose down"
echo "   - Redis 客户端: docker exec -it starloom-redis redis-cli"
echo "   - MySQL 连接: docker exec -it starloom-mysql mysql -u root -proot123456"
echo ""
echo "📁 重要目录:"
echo "   - 部署目录: /opt/suanming"
echo "   - 日志目录: /opt/suanming/logs"
echo "   - 配置文件: /opt/suanming/docker-compose.yml"
echo ""
