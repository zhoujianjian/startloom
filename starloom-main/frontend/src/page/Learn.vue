<template>
  <div class="learn-page" :class="'theme-' + currentTheme">
    <!-- 顶部Header -->
    <div class="home-header">
      <div class="header-left">
        <div class="logo" @click="goHome"><span class="logo-icon">八字</span><span class="logo-text">天机命理</span></div>
      </div>
      <div class="header-center">
        <div class="nav-item" @click="goHome">排盘首页</div>
        <div class="nav-item active">学习课堂</div>
      </div>
      <div class="header-right">
        <div class="search-mini" v-if="!showSearch">
          <span class="search-icon" @click="showSearch = true">🔍</span>
        </div>
        <div class="search-expand" v-else>
          <input v-model="keyword" @keyup.enter="handleSearch" placeholder="搜索..." />
          <span class="close-search" @click="showSearch = false; keyword = ''">×</span>
        </div>
        <span class="theme-btn" @click="showThemePanel = !showThemePanel">{{ themeList.find(t => t.key === currentTheme)?.icon || '🎨' }}</span>
      </div>
    </div>

    <!-- 主题面板 -->
    <div class="theme-panel" v-if="showThemePanel">
      <div class="theme-panel-header">选择主题</div>
      <div class="theme-option" v-for="t in themeList" :key="t.key" :class="{ active: currentTheme === t.key }" @click="changeTheme(t.key)">
        <span class="theme-opt-icon">{{ t.icon }}</span>
        <span class="theme-opt-name">{{ t.name }}</span>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 页面标题 + 学习统计 -->
      <div class="page-header-section">
        <div class="page-title">
          <h1>📚 命理学习课堂</h1>
          <p>传承千年易学智慧，系统学习命理知识</p>
        </div>
        <div class="user-stats-card">
          <div class="stat-item">
            <span class="stat-value">{{ readHistory.length }}</span>
            <span class="stat-name">已学文章</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ getTotalArticleCount() }}</span>
            <span class="stat-name">全部文章</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item progress">
            <span class="stat-value">{{ getProgressPercent() }}%</span>
            <span class="stat-name">学习进度</span>
          </div>
        </div>
      </div>

      <!-- 今日推荐 -->
      <div class="recommend-section" v-if="!currentCategory && !keyword">
        <div class="section-header">
          <h2>🔥 今日推荐</h2>
          <span class="refresh-btn" @click="refreshRecommend">换一批</span>
        </div>
        <div class="recommend-grid">
          <div class="recommend-card" v-for="(article, idx) in recommendArticles" :key="article.id" 
               :class="{ 'featured': idx === 0 }" @click="goToDetail(article.id)">
            <div class="rec-badges">
              <span class="rec-badge hot" v-if="article.viewCount > 100">热门</span>
              <span class="rec-badge new" v-if="isNewArticle(article.publishTime)">新</span>
              <span class="rec-badge vip" v-if="article.isVip">VIP</span>
            </div>
            <div class="rec-content">
              <h4 class="rec-title">{{ article.title }}</h4>
              <p class="rec-summary" v-if="idx === 0">{{ article.summary }}</p>
              <div class="rec-meta">
                <span>{{ article.categoryName }}</span>
                <span>👁️ {{ article.viewCount || 0 }}</span>
              </div>
            </div>
            <div class="rec-read-status" v-if="isRead(article.id)">✓ 已读</div>
          </div>
        </div>
      </div>

      <!-- 知识体系导航 - 一二级分类整合展示 -->
      <div class="knowledge-system">
        <div class="category-block" v-for="(cat, catIndex) in categories" :key="cat.id">
          <!-- 一级分类头部 -->
          <div class="category-header" :class="{ active: currentCategory === cat.id }">
            <div class="cat-icon-area" @click="selectCategory(cat)">
              <span class="cat-icon">{{ getCategoryIcon(cat.name, catIndex) }}</span>
            </div>
            <div class="cat-title-area" @click="selectCategory(cat)">
              <h3 class="cat-title">{{ cat.name }}</h3>
              <p class="cat-desc">{{ getCategoryDesc(cat.name) }}</p>
            </div>
            <div class="cat-stats">
              <span class="stat-num">{{ cat.articleCount || getTotalArticles(cat) }}</span>
              <span class="stat-label">篇文章</span>
            </div>
            <button class="view-all-btn" @click="selectCategory(cat)">
              查看全部 <span class="btn-arrow">→</span>
            </button>
          </div>
          
          <!-- 二级分类网格 -->
          <div class="sub-category-grid" v-if="cat.children && cat.children.length > 0">
            <div class="sub-cat-card" 
                 v-for="(sub, subIndex) in cat.children" 
                 :key="sub.id"
                 :class="{ active: currentSubCategory === sub.id }"
                 :style="{ '--index': subIndex }"
                 @click="selectSubCategoryDirect(cat, sub)">
              <div class="sub-cat-icon">{{ getSubCategoryIcon(sub.name, subIndex) }}</div>
              <div class="sub-cat-info">
                <span class="sub-cat-name">{{ sub.name }}</span>
                <span class="sub-cat-count" v-if="sub.articleCount">{{ sub.articleCount }}篇</span>
              </div>
              <span class="sub-cat-arrow">›</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 当前筛选状态 -->
      <div class="filter-status" v-if="currentCategory || currentSubCategory">
        <div class="filter-breadcrumb">
          <span class="breadcrumb-item home" @click="clearCategory">全部分类</span>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-item" :class="{ active: !currentSubCategory }" @click="currentSubCategory = null; loadArticles()">
            {{ currentCategoryName }}
          </span>
          <template v-if="currentSubCategory">
            <span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-item active">{{ currentSubCategoryName }}</span>
          </template>
        </div>
        <button class="clear-filter" @click="clearCategory">清除筛选</button>
      </div>

      <!-- 文章列表 -->
      <div class="article-section" v-if="currentCategory || currentSubCategory || keyword">
        <div class="article-list-area">
          <div class="list-header">
            <h3>{{ listTitle }}</h3>
            <div class="sort-tabs">
              <span :class="{ active: sortBy === 'latest' }" @click="sortBy = 'latest'; loadArticles()">最新</span>
              <span :class="{ active: sortBy === 'hot' }" @click="sortBy = 'hot'; loadArticles()">最热</span>
            </div>
          </div>
          
          <div class="loading-tip" v-if="loading">加载中...</div>
          <div class="empty-tip" v-else-if="articles.length === 0">暂无文章</div>
          
          <div class="article-item" v-for="article in articles" :key="article.id" @click="goToDetail(article.id)">
            <div class="article-info">
              <div class="article-badges">
                <span class="badge top" v-if="article.isTop">置顶</span>
                <span class="badge hot" v-if="article.viewCount > 100">🔥热门</span>
                <span class="badge vip" v-if="article.isVip">👑VIP</span>
                <span class="badge category">{{ article.categoryName }}</span>
              </div>
              <h4 class="article-title">
                {{ article.title }}
                <span class="read-tag" v-if="isRead(article.id)">已读</span>
              </h4>
              <p class="article-summary">{{ article.summary }}</p>
              <div class="article-meta">
                <span v-if="article.author">✍️ {{ article.author }}</span>
                <span>📅 {{ formatDate(article.publishTime) }}</span>
                <span>👁️ {{ article.viewCount || 0 }}</span>
              </div>
            </div>
            <div class="article-actions">
              <span class="action-btn" @click.stop="toggleFavorite(article)" :class="{ active: isFavorite(article.id) }">
                {{ isFavorite(article.id) ? '❤️' : '🤍' }}
              </span>
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination" v-if="totalPages > 1">
            <button :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">上一页</button>
            <span class="page-num">{{ currentPage }} / {{ totalPages }}</span>
            <button :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)">下一页</button>
          </div>
        </div>
      </div>

      <!-- 未选择分类时的引导 -->
      <div class="guide-section" v-if="!currentCategory && !currentSubCategory && !keyword">
        <div class="guide-content">
          <div class="guide-icon">☝️</div>
          <div class="guide-text">点击上方任意分类或子分类，开始您的命理学习之旅</div>
        </div>
      </div>

      <!-- 大师服务组件 -->
      <MasterService />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getArticleHome, getArticleList, getChildCategories } from '../api/api'
import { themes, getCurrentTheme, setTheme, initTheme } from '../utils/themes'
import MasterService from '../components/MasterService.vue'

const router = useRouter()
const currentTheme = ref(getCurrentTheme())
const showThemePanel = ref(false)
const showSearch = ref(false)
const themeList = Object.entries(themes).map(([key, val]) => ({ key, name: val.name, icon: val.icon }))

const changeTheme = (themeName) => {
  currentTheme.value = themeName
  setTheme(themeName)
  showThemePanel.value = false
}

// 监听storage变化，同步其他页面的主题切换
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'starloom-theme') {
      currentTheme.value = e.newValue || 'guoxue'
      initTheme()
    }
  })
}

const loading = ref(false)
const categories = ref([])
const subCategories = ref([])
const articles = ref([])
const keyword = ref('')
const currentCategory = ref(null)
const currentCategoryName = ref('')
const currentSubCategory = ref(null)
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 运营功能相关
const recommendArticles = ref([])
const readHistory = ref([])
const favorites = ref([])

// 初始化本地存储数据
const initLocalData = () => {
  try {
    readHistory.value = JSON.parse(localStorage.getItem('learn-read-history') || '[]')
    favorites.value = JSON.parse(localStorage.getItem('learn-favorites') || '[]')
  } catch (e) {
    readHistory.value = []
    favorites.value = []
  }
}

// 记录阅读历史
const recordRead = (articleId) => {
  if (!readHistory.value.includes(articleId)) {
    readHistory.value.push(articleId)
    localStorage.setItem('learn-read-history', JSON.stringify(readHistory.value))
  }
}

// 判断是否已读
const isRead = (articleId) => readHistory.value.includes(articleId)

// 判断是否收藏
const isFavorite = (articleId) => favorites.value.includes(articleId)

// 切换收藏
const toggleFavorite = (article) => {
  const idx = favorites.value.indexOf(article.id)
  if (idx > -1) {
    favorites.value.splice(idx, 1)
  } else {
    favorites.value.push(article.id)
  }
  localStorage.setItem('learn-favorites', JSON.stringify(favorites.value))
}

// 判断是否新文章（7天内）
const isNewArticle = (publishTime) => {
  if (!publishTime) return false
  const days = Math.floor((new Date() - new Date(publishTime)) / (1000 * 60 * 60 * 24))
  return days <= 7
}

// 获取总文章数
const getTotalArticleCount = () => {
  return categories.value.reduce((sum, cat) => {
    const catCount = cat.articleCount || 0
    const childCount = cat.children ? cat.children.reduce((s, c) => s + (c.articleCount || 0), 0) : 0
    return sum + catCount + childCount
  }, 0)
}

// 获取学习进度百分比
const getProgressPercent = () => {
  const total = getTotalArticleCount()
  if (total === 0) return 0
  return Math.min(100, Math.round((readHistory.value.length / total) * 100))
}

// 刷新推荐
const refreshRecommend = async () => {
  try {
    const res = await getArticleList({ page: 1, size: 20 })
    if (res.code === 200 && res.data?.list) {
      // 随机打乱并取前4个
      const shuffled = [...res.data.list].sort(() => Math.random() - 0.5)
      recommendArticles.value = shuffled.slice(0, 4)
    }
  } catch (e) { console.error('加载推荐失败', e) }
}

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
const listTitle = computed(() => {
  if (keyword.value) return `搜索: ${keyword.value}`
  if (currentSubCategory.value) {
    const sub = subCategories.value.find(s => s.id === currentSubCategory.value)
    return sub ? sub.name : currentCategoryName.value
  }
  return currentCategoryName.value || '全部文章'
})

const currentSubCategoryName = computed(() => {
  const sub = subCategories.value.find(s => s.id === currentSubCategory.value)
  return sub ? sub.name : ''
})

// 分类图标映射
const getCategoryIcon = (name, index) => {
  const iconMap = {
    '基础': '📖',
    '典籍': '📜',
    '进阶': '🎯',
    '实战': '⚔️',
    '案例': '📋'
  }
  const defaultIcons = ['📚', '🏛️', '🔮', '⭐', '🌙']
  return iconMap[name] || defaultIcons[index % defaultIcons.length]
}

// 分类描述
const getCategoryDesc = (name) => {
  const descMap = {
    '基础': '入门必学，打好命理根基',
    '典籍': '经典著作，传承千年智慧'
  }
  return descMap[name] || '系统学习，循序渐进'
}

// 子分类图标
const getSubCategoryIcon = (name, index) => {
  const iconMap = {
    '术语': '📝', '常识': '💡', '格局': '🎲', '神煞': '✨',
    '滴天髓': '💧', '滴天髓阐微': '🌊', '子平真诠': '📕',
    '穷通宝鉴': '💎', '三命通会': '📗', '渊海子平': '🌊'
  }
  const defaultIcons = ['📄', '📑', '📃', '📋', '📌', '📍']
  return iconMap[name] || defaultIcons[index % defaultIcons.length]
}

// 计算总文章数
const getTotalArticles = (cat) => {
  if (cat.articleCount) return cat.articleCount
  if (cat.children) {
    return cat.children.reduce((sum, sub) => sum + (sub.articleCount || 0), 0)
  }
  return 0
}

// 直接选择二级分类
const selectSubCategoryDirect = async (parentCat, sub) => {
  currentCategory.value = parentCat.id
  currentCategoryName.value = parentCat.name
  currentSubCategory.value = sub.id
  subCategories.value = parentCat.children || []
  currentPage.value = 1
  await loadArticles()
  
  // 滚动到文章列表
  setTimeout(() => {
    const articleSection = document.querySelector('.article-section')
    if (articleSection) {
      articleSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 100)
}

const goHome = () => router.push({ name: 'home' })
const goToDetail = (id) => {
  recordRead(id) // 记录阅读
  router.push({ name: 'articleDetail', params: { id } })
}

onMounted(async () => {
  // 确保主题立即应用
  initTheme()
  currentTheme.value = getCurrentTheme()
  initLocalData() // 初始化本地数据
  await loadHomeData()
  await refreshRecommend() // 加载推荐
})

const loadHomeData = async () => {
  try {
    const res = await getArticleHome()
    if (res.code === 200 && res.data) {
      categories.value = res.data.categories || []
    }
  } catch (e) { console.error('加载数据失败', e) }
}

const loadArticles = async () => {
  loading.value = true
  try {
    const params = { page: currentPage.value, size: pageSize.value }
    if (currentSubCategory.value) {
      params.categoryId = currentSubCategory.value
    } else if (currentCategory.value) {
      params.parentCategoryId = currentCategory.value
    }
    if (keyword.value) params.keyword = keyword.value
    const res = await getArticleList(params)
    if (res.code === 200 && res.data) {
      articles.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (e) { console.error('加载文章失败', e) }
  finally { loading.value = false }
}

const selectCategory = async (cat) => {
  currentCategory.value = cat.id
  currentCategoryName.value = cat.name
  currentSubCategory.value = null
  currentPage.value = 1
  
  // 加载子分类
  if (cat.children && cat.children.length > 0) {
    subCategories.value = cat.children
  } else {
    try {
      const res = await getChildCategories(cat.id)
      if (res.code === 200) subCategories.value = res.data || []
    } catch (e) { subCategories.value = [] }
  }
  
  await loadArticles()
  
  // 滚动到文章列表
  setTimeout(() => {
    const articleSection = document.querySelector('.article-section')
    if (articleSection) {
      articleSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 100)
}

const clearCategory = () => {
  currentCategory.value = null
  currentCategoryName.value = ''
  currentSubCategory.value = null
  subCategories.value = []
  articles.value = []
}

const selectSubCategory = async (subId) => {
  currentSubCategory.value = subId
  currentPage.value = 1
  await loadArticles()
}

const handleSearch = async () => {
  if (!keyword.value.trim()) return
  currentCategory.value = null
  currentSubCategory.value = null
  currentPage.value = 1
  await loadArticles()
}

const changePage = async (page) => {
  currentPage.value = page
  await loadArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const days = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24))
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return `${date.getMonth() + 1}-${date.getDate()}`
}
</script>

<style scoped>
.learn-page { min-height: 100vh; background: var(--bgPrimary); color: var(--textPrimary); transition: background 0.3s, color 0.3s; }

/* Header */
.home-header { display: flex; align-items: center; justify-content: space-between; padding: 15px 30px; background: var(--bgHeader); backdrop-filter: blur(20px); border-bottom: 1px solid var(--borderLight); position: sticky; top: 0; z-index: 100; }
.header-left .logo { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.logo-icon { background: var(--primaryGradient); color: #fff; padding: 6px 12px; border-radius: 12px; font-weight: bold; }
.logo-text { font-size: 20px; font-weight: bold; background: var(--primaryGradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.header-center { display: flex; gap: 25px; }
.header-center .nav-item { cursor: pointer; padding: 8px 18px; border-radius: 25px; font-size: 14px; color: var(--textSecondary); }
.header-center .nav-item:hover, .header-center .nav-item.active { background: var(--bgCardHover); color: var(--accent); }
.header-right { display: flex; gap: 15px; align-items: center; }
.search-icon { cursor: pointer; font-size: 18px; }
.search-expand { display: flex; align-items: center; gap: 8px; }
.search-expand input { padding: 6px 12px; border: 1px solid var(--border); border-radius: 15px; background: var(--bgInput); color: var(--textPrimary); font-size: 13px; width: 150px; }
.close-search { cursor: pointer; font-size: 18px; color: var(--textMuted); }
.theme-btn { cursor: pointer; font-size: 20px; }

/* 主题面板 */
.theme-panel { position: fixed; top: 70px; right: 20px; z-index: 200; background: var(--bgModal); border-radius: 16px; padding: 15px; border: 1px solid var(--border); box-shadow: 0 10px 40px rgba(0,0,0,0.15); }
.theme-panel-header { color: var(--accent); margin-bottom: 12px; font-weight: bold; }
.theme-option { display: flex; align-items: center; gap: 10px; padding: 10px 15px; border-radius: 10px; cursor: pointer; color: var(--textSecondary); }
.theme-option:hover, .theme-option.active { background: var(--bgCardHover); }

/* 主内容 */
.main-content { padding: 30px; max-width: 1200px; margin: 0 auto; }

/* 页面头部 + 统计 */
.page-header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 20px; }
.page-title { text-align: left; }
.page-title h1 { font-size: 28px; margin-bottom: 8px; background: var(--primaryGradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.page-title p { color: var(--textMuted); font-size: 14px; margin: 0; }

.user-stats-card {
  display: flex; align-items: center; gap: 20px; padding: 16px 24px;
  background: var(--bgCard); border: 1px solid var(--border); border-radius: 16px;
}
.stat-item { text-align: center; }
.stat-value { display: block; font-size: 22px; font-weight: 700; color: var(--accent); }
.stat-name { font-size: 12px; color: var(--textMuted); }
.stat-item.progress .stat-value { color: #10b981; }
.stat-divider { width: 1px; height: 36px; background: var(--border); }

/* 今日推荐 */
.recommend-section { margin-bottom: 30px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.section-header h2 { font-size: 18px; color: var(--textPrimary); margin: 0; }
.refresh-btn { font-size: 13px; color: var(--accent); cursor: pointer; padding: 6px 12px; border-radius: 15px; transition: all 0.2s; }
.refresh-btn:hover { background: var(--bgCardHover); }

.recommend-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.recommend-card {
  background: var(--bgCard); border: 1px solid var(--border); border-radius: 14px;
  padding: 16px; cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden;
}
.recommend-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px var(--shadow); border-color: var(--borderHover); }
.recommend-card.featured { grid-column: span 2; }

.rec-badges { display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; }
.rec-badge { padding: 3px 8px; border-radius: 8px; font-size: 10px; font-weight: 500; }
.rec-badge.hot { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: #fff; }
.rec-badge.new { background: linear-gradient(135deg, #10b981, #059669); color: #fff; }
.rec-badge.vip { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; }

.rec-content { flex: 1; }
.rec-title { font-size: 15px; font-weight: 600; color: var(--textPrimary); margin: 0 0 8px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.recommend-card.featured .rec-title { font-size: 17px; -webkit-line-clamp: 2; }
.rec-summary { font-size: 13px; color: var(--textMuted); margin: 0 0 10px 0; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rec-meta { display: flex; gap: 12px; font-size: 11px; color: var(--textMuted); }

.rec-read-status { position: absolute; top: 12px; right: 12px; font-size: 11px; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 3px 8px; border-radius: 8px; }

/* 知识体系 - 一二级分类整合 */
.knowledge-system { display: flex; flex-direction: column; gap: 24px; margin-bottom: 30px; }

.category-block {
  background: var(--bgCard); border: 1px solid var(--border); border-radius: 20px;
  overflow: hidden; transition: all 0.3s;
}
.category-block:hover { box-shadow: 0 8px 30px var(--shadow); }

/* 一级分类头部 */
.category-header {
  display: flex; align-items: center; gap: 16px; padding: 20px 24px;
  background: linear-gradient(135deg, var(--bgCardHover) 0%, var(--bgCard) 100%);
  border-bottom: 1px solid var(--borderLight);
}
.category-header.active { background: linear-gradient(135deg, var(--bgCardHover) 0%, var(--bgCard) 50%); }

.cat-icon-area {
  width: 52px; height: 52px; border-radius: 14px;
  background: var(--primaryGradient); display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.2); cursor: pointer; transition: transform 0.2s;
}
.cat-icon-area:hover { transform: scale(1.05); }
.cat-icon { font-size: 26px; filter: brightness(1.1); }

.cat-title-area { flex: 1; cursor: pointer; }
.cat-title-area:hover .cat-title { color: var(--accent); }
.cat-title { font-size: 18px; font-weight: 600; color: var(--textPrimary); margin: 0 0 4px 0; }
.cat-desc { font-size: 13px; color: var(--textMuted); margin: 0; }

.cat-stats { text-align: center; padding: 0 20px; }
.stat-num { display: block; font-size: 24px; font-weight: 700; color: var(--accent); }
.stat-label { font-size: 12px; color: var(--textMuted); }

.view-all-btn {
  padding: 10px 20px; background: var(--bgInput); border: 1px solid var(--border);
  border-radius: 25px; color: var(--textSecondary); font-size: 13px; cursor: pointer;
  display: flex; align-items: center; gap: 6px; transition: all 0.25s;
}
.view-all-btn:hover { background: var(--primaryGradient); color: #fff; border-color: transparent; }
.btn-arrow { transition: transform 0.2s; }
.view-all-btn:hover .btn-arrow { transform: translateX(3px); }

/* 二级分类网格 */
.sub-category-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px; padding: 18px 20px; background: var(--bgPrimary);
}

.sub-cat-card {
  display: flex; align-items: center; gap: 12px; padding: 14px 16px;
  background: var(--bgCard); border: 1px solid var(--borderLight); border-radius: 12px;
  cursor: pointer; transition: all 0.25s; position: relative;
  animation: fadeIn 0.3s ease forwards;
  animation-delay: calc(var(--index) * 0.05s);
  opacity: 0;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.sub-cat-card:hover {
  background: var(--bgCardHover); border-color: var(--border);
  transform: translateY(-2px); box-shadow: 0 4px 15px var(--shadow);
}
.sub-cat-card.active {
  background: var(--primaryGradient); border-color: transparent;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.25);
}
.sub-cat-card.active .sub-cat-name,
.sub-cat-card.active .sub-cat-count,
.sub-cat-card.active .sub-cat-arrow { color: #fff; }

.sub-cat-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--bgInput); display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}
.sub-cat-card.active .sub-cat-icon { background: rgba(255,255,255,0.2); }

.sub-cat-info { flex: 1; min-width: 0; }
.sub-cat-name { display: block; font-size: 14px; font-weight: 500; color: var(--textPrimary); }
.sub-cat-count { font-size: 12px; color: var(--textMuted); }

.sub-cat-arrow {
  font-size: 18px; color: var(--textMuted); opacity: 0; transition: all 0.2s;
}
.sub-cat-card:hover .sub-cat-arrow { opacity: 1; transform: translateX(2px); }
.sub-cat-card.active .sub-cat-arrow { opacity: 1; }

/* 筛选状态 */
.filter-status {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 20px; background: var(--bgCard); border: 1px solid var(--border);
  border-radius: 12px; margin-bottom: 20px;
}
.filter-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.breadcrumb-item { color: var(--textMuted); cursor: pointer; transition: color 0.2s; }
.breadcrumb-item:hover { color: var(--accent); }
.breadcrumb-item.home { color: var(--textSecondary); }
.breadcrumb-item.active { color: var(--textPrimary); font-weight: 500; cursor: default; }
.breadcrumb-sep { color: var(--textMuted); }
.clear-filter {
  padding: 6px 14px; background: transparent; border: 1px solid var(--border);
  border-radius: 15px; color: var(--textMuted); font-size: 12px; cursor: pointer;
  transition: all 0.2s;
}
.clear-filter:hover { background: var(--bgCardHover); color: var(--accent); border-color: var(--accent); }

/* 文章列表 */
.article-section { margin-top: 20px; }
.article-list-area { background: var(--bgCard); border-radius: 16px; padding: 20px; border: 1px solid var(--border); }
.list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
.list-header h3 { font-size: 16px; color: var(--textPrimary); }
.sort-tabs { display: flex; gap: 15px; }
.sort-tabs span { cursor: pointer; color: var(--textMuted); font-size: 13px; }
.sort-tabs span.active, .sort-tabs span:hover { color: var(--accent); }
.loading-tip, .empty-tip { text-align: center; padding: 40px; color: var(--textMuted); }

.article-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 15px 0; border-bottom: 1px solid var(--borderLight); cursor: pointer; transition: all 0.2s; }
.article-item:hover { background: var(--bgCardHover); margin: 0 -15px; padding: 15px; border-radius: 10px; }
.article-item:last-child { border-bottom: none; }
.article-info { flex: 1; min-width: 0; }
.article-badges { display: flex; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
.badge { padding: 3px 10px; border-radius: 10px; font-size: 11px; }
.badge.top { background: var(--primaryGradient); color: #fff; }
.badge.hot { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: #fff; }
.badge.vip { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; }
.badge.category { background: var(--bgInput); color: var(--textMuted); }
.article-title { font-size: 16px; margin-bottom: 8px; color: var(--textPrimary); line-height: 1.4; display: flex; align-items: center; gap: 8px; }
.read-tag { font-size: 11px; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 2px 8px; border-radius: 8px; flex-shrink: 0; }
.article-summary { font-size: 13px; color: var(--textMuted); margin-bottom: 10px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.article-meta { display: flex; gap: 15px; font-size: 12px; color: var(--textMuted); }

.article-actions { display: flex; gap: 8px; flex-shrink: 0; padding-left: 15px; }
.action-btn { font-size: 18px; cursor: pointer; transition: transform 0.2s; opacity: 0.6; }
.action-btn:hover { transform: scale(1.2); opacity: 1; }
.action-btn.active { opacity: 1; }

/* 分页 */
.pagination { display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 20px; padding-top: 15px; }
.pagination button { padding: 8px 20px; background: var(--bgInput); border: 1px solid var(--border); border-radius: 20px; color: var(--textSecondary); cursor: pointer; }
.pagination button:hover:not(:disabled) { background: var(--bgCardHover); color: var(--accent); }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.page-num { color: var(--textMuted); }

/* 引导区域 */
.guide-section { text-align: center; padding: 50px 20px; }
.guide-content {
  display: inline-flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 30px 50px; background: var(--bgCard); border: 1px dashed var(--border);
  border-radius: 16px;
}
.guide-icon { font-size: 32px; animation: bounce 2s infinite; }
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.guide-text { font-size: 15px; color: var(--textMuted); }

/* 响应式 */
@media (max-width: 768px) {
  .main-content { padding: 20px 15px; }
  .page-header-section { flex-direction: column; align-items: stretch; }
  .page-title { text-align: center; }
  .page-title h1 { font-size: 22px; }
  .user-stats-card { justify-content: center; }
  
  .recommend-grid { grid-template-columns: 1fr 1fr; }
  .recommend-card.featured { grid-column: span 2; }
  .rec-summary { display: none; }
  
  .category-header { flex-wrap: wrap; gap: 12px; padding: 16px; }
  .cat-icon-area { width: 44px; height: 44px; }
  .cat-icon { font-size: 22px; }
  .cat-title { font-size: 16px; }
  .cat-stats { display: none; }
  .view-all-btn { width: 100%; justify-content: center; margin-top: 8px; }
  
  .sub-category-grid { grid-template-columns: 1fr 1fr; gap: 10px; padding: 14px; }
  .sub-cat-card { padding: 12px; }
  .sub-cat-icon { width: 32px; height: 32px; font-size: 16px; }
  .sub-cat-name { font-size: 13px; }
  .sub-cat-arrow { display: none; }
  
  .filter-status { flex-direction: column; gap: 10px; align-items: flex-start; }
  .header-center { display: none; }
  
  .article-actions { display: none; }
}
</style>
