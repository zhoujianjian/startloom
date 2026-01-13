# -*- coding: utf-8 -*-
"""
算准网爬虫 - 自动获取分类并爬取文章存入数据库
"""
import os
import re
import time
import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
from config import BASE_URL, HEADERS, REQUEST_DELAY, TIMEOUT, MAX_RETRIES, OUTPUT_DIR
from db import Database


class SuanzhunCrawler:
    def __init__(self):
        self.session = requests.Session()
        # 禁用代理，直连
        self.session.trust_env = False
        self.ua = UserAgent()
        self.db = Database()
        self._ensure_output_dir()
    
    def _ensure_output_dir(self):
        if not os.path.exists(OUTPUT_DIR):
            os.makedirs(OUTPUT_DIR)
    
    def get_headers(self):
        headers = HEADERS.copy()
        headers["User-Agent"] = self.ua.random
        return headers
    
    def fetch_page(self, url):
        for attempt in range(MAX_RETRIES):
            try:
                response = self.session.get(url, headers=self.get_headers(), timeout=TIMEOUT)
                response.raise_for_status()
                response.encoding = response.apparent_encoding
                return response.text
            except requests.RequestException as e:
                print(f"  请求失败 ({attempt + 1}/{MAX_RETRIES}): {e}")
                if attempt < MAX_RETRIES - 1:
                    time.sleep(REQUEST_DELAY * 2)
        return None
    
    def extract_slug(self, url):
        """从URL提取slug"""
        match = re.search(r'/([^/]+)/?$', url.rstrip('/'))
        return match.group(1) if match else ""
    
    def parse_navigation(self):
        """从首页导航获取所有分类"""
        print("正在解析导航...")
        html = self.fetch_page(BASE_URL)
        if not html:
            return []
        
        soup = BeautifulSoup(html, "lxml")
        categories = []
        
        nav_items = soup.select(".nav-list > li.menu-item-has-children")
        for nav_item in nav_items:
            main_link = nav_item.find("a")
            if not main_link:
                continue
            
            main_name = main_link.get_text(strip=True)
            if main_name in ["工具", "首页", ""]:
                continue
            
            main_href = main_link.get("href", "")
            main_slug = self.extract_slug(main_href) or main_name
            
            main_cat = {"name": main_name, "slug": main_slug, "children": []}
            
            for sub_link in nav_item.select(".sub-menu li a"):
                href = sub_link.get("href", "")
                name = sub_link.get_text(strip=True)
                if href and name:
                    full_url = href if href.startswith("http") else BASE_URL + href
                    main_cat["children"].append({
                        "name": name,
                        "slug": self.extract_slug(href),
                        "url": full_url
                    })
            
            if main_cat["children"]:
                categories.append(main_cat)
        
        return categories

    def get_article_list(self, category_url):
        """获取分类下的文章列表"""
        articles = []
        page = 1
        
        while True:
            url = category_url if page == 1 else category_url.rstrip("/") + f"/page/{page}/"
            print(f"    第{page}页: {url}")
            
            html = self.fetch_page(url)
            if not html:
                break
            
            soup = BeautifulSoup(html, "lxml")
            found = []
            links = []
            
            for selector in ["article h2 a", ".post-title a", ".entry-title a", "h2 a", "h3 a"]:
                links = soup.select(selector)
                if links:
                    break
            
            for link in links:
                href = link.get("href", "")
                title = link.get_text(strip=True)
                
                if not href or not title or len(title) < 3 or href in ["/", "#"]:
                    continue
                
                full_url = href if href.startswith("http") else BASE_URL + href
                if full_url not in [a["url"] for a in articles + found]:
                    found.append({"title": title, "url": full_url})
            
            if not found:
                break
            
            articles.extend(found)
            print(f"      找到 {len(found)} 篇")
            
            if not soup.select_one("a.next, .pagination .next, a[rel='next']"):
                break
            
            page += 1
            time.sleep(REQUEST_DELAY)
        
        return articles
    
    def get_article_content(self, url):
        """获取文章内容"""
        html = self.fetch_page(url)
        if not html:
            return None
        
        soup = BeautifulSoup(html, "lxml")
        
        # 标题 - 优先 .singletitle
        title = ""
        for selector in [".singletitle", "h1", ".post-title", ".entry-title"]:
            elem = soup.select_one(selector)
            if elem:
                title = elem.get_text(strip=True)
                break
        
        # 内容 - 优先 .content-text
        content = ""
        content_html = ""
        for selector in [".content-text", ".post-content", ".entry-content", ".article-content"]:
            elem = soup.select_one(selector)
            if elem:
                content_html = str(elem)
                # 移除无用标签
                for tag in elem.find_all(["script", "style", "nav", "footer", ".bdf", ".xianguan"]):
                    tag.decompose()
                content = elem.get_text(separator="\n", strip=True)
                break
        
        summary = content[:200] + "..." if len(content) > 200 else content
        
        return {
            "title": title,
            "source_url": url,
            "summary": summary,
            "content": content,
            "content_html": content_html
        }

    def run(self, reset=False):
        """运行爬虫
        Args:
            reset: 是否重置进度，重新爬取
        """
        print("=" * 60)
        print("算准网爬虫")
        print("=" * 60)
        
        self.db.connect()
        
        if reset:
            self.db.reset_progress()
        
        try:
            categories = self.parse_navigation()
            if not categories:
                print("未获取到分类")
                return
            
            print(f"\n获取到 {len(categories)} 个大分类:")
            for cat in categories:
                print(f"  【{cat['name']}】- {len(cat['children'])} 个子分类")
            
            for main_cat in categories:
                main_name = main_cat["name"]
                main_slug = main_cat["slug"]
                
                # 创建大分类
                main_info = self.db.get_or_create_category(main_name, main_slug, 0, "", 1)
                
                print(f"\n{'='*60}")
                print(f"【{main_name}】(ID: {main_info['id']})")
                print("=" * 60)
                
                for sub_cat in main_cat["children"]:
                    sub_name = sub_cat["name"]
                    sub_slug = sub_cat["slug"]
                    sub_url = sub_cat["url"]
                    
                    # 检查分类是否已完成
                    if self.db.is_category_done(sub_slug):
                        print(f"\n  [{sub_name}] [已完成，跳过]")
                        continue
                    
                    # 创建子分类，传入父分类信息
                    sub_info = self.db.get_or_create_category(
                        sub_name, sub_slug, main_info["id"], main_name, 2
                    )
                    sub_info["full_name"] = f"{main_name}/{sub_name}"
                    
                    print(f"\n  [{sub_name}] (ID: {sub_info['id']})")
                    print(f"  {sub_url}")
                    print("-" * 50)
                    
                    articles = self.get_article_list(sub_url)
                    print(f"    共 {len(articles)} 篇文章")
                    
                    for i, article in enumerate(articles):
                        url = article["url"]
                        
                        # 先检查是否已爬取，避免浪费请求
                        if self.db.is_url_crawled(url):
                            print(f"    [{i+1}/{len(articles)}] [跳过] {article['title'][:25]}...")
                            continue
                        
                        print(f"    [{i+1}/{len(articles)}] {article['title'][:25]}...")
                        
                        detail = self.get_article_content(url)
                        if detail:
                            self.db.insert_article(detail, sub_info)
                        
                        time.sleep(REQUEST_DELAY)
                    
                    # 标记分类完成
                    self.db.mark_category_done(sub_slug)
            
            stats = self.db.get_stats()
            print("\n" + "=" * 60)
            print(f"爬取完成! 分类: {stats['categories']} 个, 文章: {stats['articles']} 篇")
            print("=" * 60)
        
        finally:
            self.db.close()


if __name__ == "__main__":
    import sys
    
    crawler = SuanzhunCrawler()
    
    # 命令行参数
    if len(sys.argv) > 1:
        if sys.argv[1] == "--reset":
            crawler.run(reset=True)
        elif sys.argv[1] == "--help":
            print("用法:")
            print("  python crawler.py          # 断点续爬")
            print("  python crawler.py --reset  # 重置进度，重新爬取")
        else:
            print(f"未知参数: {sys.argv[1]}")
    else:
        crawler.run()
