# -*- coding: utf-8 -*-
"""
数据库操作
"""
import os
import json
import pymysql
from config import DB_CONFIG, OUTPUT_DIR


PROGRESS_FILE = os.path.join(OUTPUT_DIR, "progress.json")


class Database:
    def __init__(self):
        self.conn = None
        self.cursor = None
        self.category_cache = {}
        self.progress = self._load_progress()
    
    def _load_progress(self):
        """加载爬取进度"""
        if os.path.exists(PROGRESS_FILE):
            with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"crawled_urls": [], "crawled_categories": []}
    
    def _save_progress(self):
        """保存爬取进度"""
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
            json.dump(self.progress, f, ensure_ascii=False)
    
    def is_url_crawled(self, url):
        """检查URL是否已爬取"""
        return url in self.progress["crawled_urls"]
    
    def mark_url_crawled(self, url):
        """标记URL已爬取"""
        if url not in self.progress["crawled_urls"]:
            self.progress["crawled_urls"].append(url)
            self._save_progress()
    
    def is_category_done(self, slug):
        """检查分类是否已完成"""
        return slug in self.progress["crawled_categories"]
    
    def mark_category_done(self, slug):
        """标记分类已完成"""
        if slug not in self.progress["crawled_categories"]:
            self.progress["crawled_categories"].append(slug)
            self._save_progress()
    
    def reset_progress(self):
        """重置进度（重新爬取）"""
        self.progress = {"crawled_urls": [], "crawled_categories": []}
        if os.path.exists(PROGRESS_FILE):
            os.remove(PROGRESS_FILE)
        print("已重置爬取进度")
    
    def connect(self):
        self.conn = pymysql.connect(**DB_CONFIG)
        self.cursor = self.conn.cursor(pymysql.cursors.DictCursor)
        print(f"已连接数据库: {DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}")
        print(f"已爬取: {len(self.progress['crawled_urls'])} 篇文章, {len(self.progress['crawled_categories'])} 个分类")
    
    def close(self):
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()
    
    def get_or_create_category(self, name, slug, parent_id=0, parent_name="", level=1):
        """获取或创建分类，返回分类信息"""
        cache_key = slug
        if cache_key in self.category_cache:
            return self.category_cache[cache_key]
        
        # 查询是否存在
        self.cursor.execute("SELECT id, name, parent_id, parent_name FROM category WHERE slug = %s", (slug,))
        result = self.cursor.fetchone()
        
        if result:
            self.category_cache[cache_key] = result
            return result
        
        # 创建分类
        full_name = f"{parent_name}/{name}" if parent_name else name
        self.cursor.execute(
            """INSERT INTO category (parent_id, parent_name, name, full_name, slug, level) 
               VALUES (%s, %s, %s, %s, %s, %s)""",
            (parent_id, parent_name, name, full_name, slug, level)
        )
        self.conn.commit()
        
        cat_info = {
            "id": self.cursor.lastrowid,
            "name": name,
            "parent_id": parent_id,
            "parent_name": parent_name,
            "full_name": full_name
        }
        self.category_cache[cache_key] = cat_info
        return cat_info
    
    def article_exists(self, source_url):
        self.cursor.execute("SELECT id FROM article WHERE source_url = %s", (source_url,))
        return self.cursor.fetchone() is not None
    
    def insert_article(self, article, category_info):
        """插入文章，包含冗余的分类信息"""
        url = article["source_url"]
        
        # 检查进度文件（已爬取过）
        if self.is_url_crawled(url):
            print(f"    [跳过] 已爬取: {article['title'][:20]}")
            return None
        
        # 检查数据库（防止重复插入）
        if self.article_exists(url):
            self.mark_url_crawled(url)
            print(f"    [跳过] 已存在: {article['title'][:20]}")
            return None
        
        self.cursor.execute(
            """INSERT INTO article 
               (category_id, category_name, parent_category_id, parent_category_name, full_category,
                title, summary, content, content_html, source_url)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (
                category_info.get("id"),
                category_info.get("name"),
                category_info.get("parent_id", 0),
                category_info.get("parent_name", ""),
                category_info.get("full_name", ""),
                article.get("title", ""),
                article.get("summary", ""),
                article.get("content", ""),
                article.get("content_html", ""),
                url
            )
        )
        self.conn.commit()
        
        # 标记已爬取
        self.mark_url_crawled(url)
        
        # 更新分类文章数
        self.cursor.execute(
            "UPDATE category SET article_count = article_count + 1 WHERE id = %s",
            (category_info.get("id"),)
        )
        self.conn.commit()
        
        return self.cursor.lastrowid
    
    def get_stats(self):
        self.cursor.execute("SELECT COUNT(*) as cnt FROM category")
        cat_count = self.cursor.fetchone()["cnt"]
        self.cursor.execute("SELECT COUNT(*) as cnt FROM article")
        art_count = self.cursor.fetchone()["cnt"]
        return {"categories": cat_count, "articles": art_count}
