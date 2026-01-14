<template>
  <div class="article-page" :class="'theme-' + currentTheme">
    <div class="home-header">
      <div class="header-left">
        <div class="logo" @click="goHome"><span class="logo-icon">八字</span><span class="logo-text">天机命理</span></div>
      </div>
      <div class="header-center">
        <div class="nav-item" @click="goHome">排盘首页</div>
        <div class="nav-item" @click="goLearn">学习课堂</div>
      </div>
      <div class="header-right">
        <span class="theme-btn" @click="showThemePanel = !showThemePanel">{{ themeList.find(t => t.key === currentTheme)?.icon || '🎨' }}</span>
      </div>
    </div>

    <div class="theme-panel" v-if="showThemePanel">
      <div class="theme-panel-header">选择主题</div>
      <div class="theme-option" v-for="t in themeList" :key="t.key" :class="{ active: currentTheme === t.key }" @click="changeTheme(t.key)">
        <span class="theme-opt-icon">{{ t.icon }}</span>
        <span class="theme-opt-name">{{ t.name }}</span>
      </div>
    </div>

    <div class="main-content">
      <div class="loading-tip" v-if="loading">加载中...</div>
      <div class="error-tip" v-else-if="!article">文章不存在</div>
      <template v-else>
        <div class="breadcrumb">
          <span @click="goHome">首页</span> / <span @click="goLearn">学习课堂</span>
          <span v-if="article.categoryName"> / {{ article.categoryName }}</span>
        </div>
        <div class="article-card">
          <div class="article-header">
            <h1>{{ article.title }}</h1>
            <div class="article-meta">
              <span v-if="article.author">✍️ {{ article.author }}</span>
              <span>📅 {{ formatDate(article.publishTime) }}</span>
              <span>👁️ {{ article.viewCount || 0 }} 阅读</span>
            </div>
            <div class="article-tags" v-if="article.tags">
              <span class="tag" v-for="tag in article.tags.split(',')" :key="tag">{{ tag }}</span>
            </div>
          </div>
          <div class="article-body" v-html="cleanContent(article.contentHtml) || formatContent(article.content)"></div>
          
          <!-- 上一篇/下一篇导航 -->
          <div class="article-nav">
            <div class="nav-item prev" :class="{ disabled: !prevArticle }" @click="goPrev">
              <span class="nav-label">← 上一篇</span>
              <span class="nav-title">{{ prevArticle?.title || '没有了' }}</span>
            </div>
            <div class="nav-item next" :class="{ disabled: !nextArticle }" @click="goNext">
              <span class="nav-label">下一篇 →</span>
              <span class="nav-title">{{ nextArticle?.title || '没有了' }}</span>
            </div>
          </div>
          
          <div class="article-footer">
            <button class="back-btn" @click="goLearn">← 返回列表</button>
          </div>
        </div>
      </template>
    </div>
    
    <!-- 移动端返回首页悬浮按钮 -->
    <div class="mobile-home-btn" @click="goHome">
      <span class="home-icon">🏠</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleDetail, getArticleNav } from '../api/api'
import { themes, getCurrentTheme, setTheme, initTheme } from '../utils/themes'
import { setArticleSEO, setStructuredData } from '../utils/seo'

const route = useRoute()
const router = useRouter()
const currentTheme = ref(getCurrentTheme())
const showThemePanel = ref(false)
const themeList = Object.entries(themes).map(([key, val]) => ({ key, name: val.name, icon: val.icon }))

const changeTheme = (themeName) => { currentTheme.value = themeName; setTheme(themeName); showThemePanel.value = false }

const loading = ref(true)
const article = ref(null)
const prevArticle = ref(null)
const nextArticle = ref(null)

const goHome = () => router.push({ name: 'home' })
const goLearn = () => router.push({ name: 'learn' })

const goPrev = () => {
  if (prevArticle.value) {
    router.push({ name: 'articleDetail', params: { id: prevArticle.value.id } })
  }
}

const goNext = () => {
  if (nextArticle.value) {
    router.push({ name: 'articleDetail', params: { id: nextArticle.value.id } })
  }
}

const loadArticle = async (id) => {
  loading.value = true
  try {
    const res = await getArticleDetail(id)
    article.value = (res.code === 200 && res.data) ? res.data : null
    
    // 设置文章 SEO
    if (article.value) {
      setArticleSEO(article.value)
      setStructuredData('article', article.value)
      
      // 加载上一篇/下一篇
      const navRes = await getArticleNav(id, article.value.categoryId)
      if (navRes.code === 200 && navRes.data) {
        prevArticle.value = navRes.data.prev
        nextArticle.value = navRes.data.next
      }
    }
  } catch (e) { article.value = null }
  finally { loading.value = false }
}

// 清理文章内容中的旧导航链接
const cleanContent = (html) => {
  if (!html) return ''
  // 移除包含"上一篇"、"下一篇"的段落（通常是爬虫带来的旧导航）
  let cleaned = html
    // 移除包含上一篇/下一篇链接的<p>标签
    .replace(/<p[^>]*>[\s\S]*?<span[^>]*style="color:\s*red"[^>]*>上一篇[\s\S]*?<\/p>/gi, '')
    .replace(/<p[^>]*>[\s\S]*?上一篇：[\s\S]*?下一篇：[\s\S]*?<\/p>/gi, '')
    // 移除单独的上一篇/下一篇链接行
    .replace(/<p[^>]*>\s*<a[^>]*href="[^"]*\.html"[^>]*>[^<]*<\/a>\s*<\/p>/gi, '')
    // 移除末尾的空白段落
    .replace(/(<p>\s*<\/p>\s*)+$/gi, '')
  return cleaned
}

const formatContent = (content) => content ? content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('') : ''
const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('zh-CN') : ''

watch(() => route.params.id, (newId) => { if (newId) { loadArticle(newId); window.scrollTo({ top: 0 }) } })
onMounted(() => { initTheme(); currentTheme.value = getCurrentTheme(); if (route.params.id) loadArticle(route.params.id) })
</script>

<style scoped>
.article-page { min-height: 100vh; background: var(--bgPrimary); color: var(--textPrimary); }

.home-header { display: flex; align-items: center; justify-content: space-between; padding: 15px 30px; background: var(--bgHeader); backdrop-filter: blur(20px); border-bottom: 1px solid var(--borderLight); position: sticky; top: 0; z-index: 100; }
.header-left .logo { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.logo-icon { background: var(--primaryGradient); color: #fff; padding: 6px 12px; border-radius: 12px; font-weight: bold; }
.logo-text { font-size: 20px; font-weight: bold; background: var(--primaryGradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.header-center { display: flex; gap: 25px; }
.header-center .nav-item { cursor: pointer; padding: 8px 18px; border-radius: 25px; font-size: 14px; color: var(--textSecondary); }
.header-center .nav-item:hover { background: var(--bgCardHover); color: var(--accent); }
.header-right { display: flex; gap: 15px; align-items: center; }
.theme-btn { cursor: pointer; font-size: 20px; }

.theme-panel { position: fixed; top: 70px; right: 20px; z-index: 200; background: var(--bgModal); border-radius: 16px; padding: 15px; border: 1px solid var(--border); }
.theme-panel-header { color: var(--accent); margin-bottom: 12px; font-weight: bold; }
.theme-option { display: flex; align-items: center; gap: 10px; padding: 10px 15px; border-radius: 10px; cursor: pointer; color: var(--textSecondary); }
.theme-option:hover, .theme-option.active { background: var(--bgCardHover); }

.main-content { padding: 30px; max-width: 900px; margin: 0 auto; }
.loading-tip, .error-tip { text-align: center; padding: 60px; color: var(--textMuted); }

.breadcrumb { font-size: 13px; color: var(--textMuted); margin-bottom: 20px; }
.breadcrumb span { cursor: pointer; }
.breadcrumb span:hover { color: var(--accent); }

.article-card { background: var(--bgCard); border-radius: 24px; padding: 35px; border: 1px solid var(--border); }
.article-header { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
.article-header h1 { font-size: 1.8rem; line-height: 1.4; margin-bottom: 15px; background: var(--primaryGradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.article-meta { display: flex; flex-wrap: wrap; gap: 15px; font-size: 13px; color: var(--textMuted); margin-bottom: 12px; }
.article-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.article-tags .tag { padding: 4px 12px; background: var(--bgCardHover); color: var(--accent); border-radius: 15px; font-size: 12px; }

.article-body { line-height: 1.9; font-size: 15px; color: var(--textSecondary); }
.article-body :deep(p) { margin-bottom: 16px; }
.article-body :deep(h2), .article-body :deep(h3) { background: var(--primaryGradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 24px 0 16px; }
.article-body :deep(img) { max-width: 100%; border-radius: 12px; margin: 16px 0; }

.article-footer { padding-top: 20px; margin-top: 30px; border-top: 1px solid var(--border); }
.back-btn { padding: 12px 30px; background: var(--bgInput); border: 1px solid var(--border); border-radius: 25px; color: var(--textSecondary); cursor: pointer; font-size: 14px; }
.back-btn:hover { background: var(--bgCardHover); color: var(--accent); border-color: var(--primary); }

/* 上一篇/下一篇导航 */
.article-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border); }
.article-nav .nav-item { padding: 16px; background: var(--bgInput); border-radius: 12px; cursor: pointer; transition: all 0.2s; }
.article-nav .nav-item:hover:not(.disabled) { background: var(--bgCardHover); }
.article-nav .nav-item.disabled { opacity: 0.5; cursor: not-allowed; }
.article-nav .nav-item.next { text-align: right; }
.article-nav .nav-label { display: block; font-size: 12px; color: var(--textMuted); margin-bottom: 6px; }
.article-nav .nav-title { display: block; font-size: 14px; color: var(--textPrimary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

@media (max-width: 600px) { 
  .main-content { padding: 20px 15px; } 
  .article-card { padding: 20px; } 
  .article-header h1 { font-size: 1.4rem; } 
  .header-center { display: none; } 
  .article-nav { grid-template-columns: 1fr; }
  
  /* 移动端返回首页按钮 */
  .mobile-home-btn { display: flex; }
}

/* 移动端返回首页悬浮按钮 */
.mobile-home-btn {
  display: none;
  position: fixed;
  left: 16px;
  bottom: 80px;
  width: 48px;
  height: 48px;
  background: var(--primaryGradient);
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  cursor: pointer;
  z-index: 100;
  transition: transform 0.2s;
}
.mobile-home-btn:active { transform: scale(0.95); }
.home-icon { font-size: 22px; }
</style>
