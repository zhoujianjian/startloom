# -*- coding: utf-8 -*-
"""
测试页面结构，找出正确的内容选择器
"""
import requests
from bs4 import BeautifulSoup

url = "https://www.suanzhun.net/jichu/minglishuyu/tiangan/"

session = requests.Session()
session.trust_env = False

response = session.get(url, timeout=15)
response.encoding = response.apparent_encoding

soup = BeautifulSoup(response.text, "lxml")

print("=" * 60)
print("页面标题:", soup.title.string if soup.title else "无")
print("=" * 60)

# 尝试找内容区域
selectors = [
    ".post-content",
    ".entry-content", 
    ".article-content",
    "article .content",
    ".content",
    "article",
    ".post-body",
    ".single-content",
    ".main-content",
    "#content",
    ".art-content",
    ".article-body",
]

for sel in selectors:
    elem = soup.select_one(sel)
    if elem:
        text = elem.get_text(strip=True)[:200]
        print(f"\n[{sel}] 找到内容 ({len(text)} 字):")
        print(text[:100] + "...")
    else:
        print(f"\n[{sel}] 未找到")

# 打印页面主要结构
print("\n" + "=" * 60)
print("页面主要 class:")
for tag in soup.find_all(["div", "article", "section"], class_=True):
    classes = tag.get("class", [])
    if classes:
        print(f"  {tag.name}: {' '.join(classes)}")
