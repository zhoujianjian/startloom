# 爬虫配置
BASE_URL = "https://www.suanzhun.net"

# 请求头配置
HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Connection": "keep-alive",
}

# 请求延迟（秒），避免请求过快被封
REQUEST_DELAY = 1.5

# 超时设置（秒）
TIMEOUT = 15

# 重试次数
MAX_RETRIES = 3

# 输出目录
OUTPUT_DIR = "output"

# 数据库配置
DB_CONFIG = {
    "host": "192.168.110.58",
    "port": 3307,
    "user": "root",
    "password": "DP123456",
    "database": "starloom",
    "charset": "utf8mb4"
}
