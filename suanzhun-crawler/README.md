# 算准网爬虫

## 安装依赖

```bash
cd suanzhun-crawler
pip install -r requirements.txt
```

## 运行

```bash
python crawler.py
```

## 配置

编辑 `config.py` 修改爬虫参数：
- `REQUEST_DELAY`: 请求间隔
- `TIMEOUT`: 超时时间
- `MAX_RETRIES`: 重试次数
