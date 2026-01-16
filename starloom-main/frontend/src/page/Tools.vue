<template>
  <div class="tools-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <div class="header-left">
        <router-link to="/" class="logo">
          <span class="logo-icon">八字</span>
          <span class="logo-text">天机命理</span>
        </router-link>
      </div>
      <div class="header-nav">
        <router-link to="/" class="nav-item">首页</router-link>
        <router-link to="/paipan" class="nav-item">八字排盘</router-link>
        <router-link to="/tools" class="nav-item active">工具箱</router-link>
        <router-link to="/learn" class="nav-item">学习课堂</router-link>
      </div>
      <div class="header-right">
        <span class="mobile-menu-btn" @click="showMobileMenu = !showMobileMenu">☰</span>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <div class="mobile-nav" v-if="showMobileMenu">
      <router-link to="/" class="nav-item" @click="showMobileMenu = false">首页</router-link>
      <router-link to="/paipan" class="nav-item" @click="showMobileMenu = false">八字排盘</router-link>
      <router-link to="/tools" class="nav-item" @click="showMobileMenu = false">工具箱</router-link>
      <router-link to="/learn" class="nav-item" @click="showMobileMenu = false">学习课堂</router-link>
    </div>

    <!-- 页面标题 -->
    <div class="page-title">
      <h1>🛠️ 免费命理工具箱</h1>
      <p>25款专业命理测算工具，全部免费使用</p>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <span 
        class="cat-tab" 
        :class="{ active: activeCategory === 'all' }" 
        @click="activeCategory = 'all'"
      >全部 ({{ allTools.length }})</span>
      <span 
        class="cat-tab" 
        v-for="cat in categories" 
        :key="cat.key"
        :class="{ active: activeCategory === cat.key }" 
        @click="activeCategory = cat.key"
      >{{ cat.icon }} {{ cat.name }} ({{ getCategoryCount(cat.key) }})</span>
    </div>

    <!-- 工具网格 -->
    <div class="tools-grid">
      <div 
        class="tool-card" 
        v-for="tool in filteredTools" 
        :key="tool.id" 
        @click="openTool(tool)"
      >
        <div class="tool-icon">{{ tool.icon }}</div>
        <div class="tool-info">
          <h3>{{ tool.name }}</h3>
          <p>{{ tool.desc }}</p>
        </div>
        <div class="tool-badges">
          <span class="badge hot" v-if="tool.hot">热门</span>
          <span class="badge new" v-if="tool.new">新上</span>
        </div>
      </div>
    </div>

    <!-- 底部引导 -->
    <div class="page-footer">
      <p>想要更专业的命理解读？</p>
      <router-link to="/" class="cta-btn">🧙 咨询大师一对一解答</router-link>
    </div>

    <!-- 工具弹窗（复用 ToolsGrid 组件，隐藏工具列表只显示弹窗） -->
    <div class="tools-modal-container">
      <ToolsGrid 
        ref="toolsGridRef" 
        @open-master="goToMaster" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ToolsGrid from '../components/ToolsGrid.vue'

const router = useRouter()
const showMobileMenu = ref(false)
const activeCategory = ref('all')
const toolsGridRef = ref(null)

const categories = [
  { key: 'match', name: '配对测试', icon: '💕' },
  { key: 'fortune', name: '运势测算', icon: '🔮' },
  { key: 'naming', name: '起名测名', icon: '✍️' },
  { key: 'divination', name: '占卜求签', icon: '🎋' },
  { key: 'life', name: '生活工具', icon: '📅' }
]

const allTools = ref([
  // 配对测试
  { id: 'zodiac-match', icon: '🐲', name: '生肖配对', desc: '看看你们的生肖配不配', hot: true, category: 'match' },
  { id: 'constellation-match', icon: '⭐', name: '星座配对', desc: '星座缘分深度解析', hot: true, category: 'match' },
  { id: 'fate-test', icon: '💘', name: '缘分测试', desc: '测测你们的缘分指数', category: 'match' },
  { id: 'name-match', icon: '💑', name: '姓名配对', desc: '姓名笔画配对分析', new: true, category: 'match' },
  // 运势测算
  { id: 'daily-sign', icon: '🎋', name: '今日运势', desc: '每日运势签文解读', hot: true, category: 'fortune' },
  { id: 'taisui', icon: '🐉', name: '犯太岁查询', desc: '查询今年是否犯太岁', hot: true, category: 'fortune' },
  { id: 'peach-blossom', icon: '🌸', name: '桃花运测试', desc: '测测你的桃花运势', new: true, category: 'fortune' },
  { id: 'wealth-test', icon: '💰', name: '财运测试', desc: '看看你的财运如何', new: true, category: 'fortune' },
  { id: 'wuxing', icon: '🌈', name: '五行查询', desc: '查询你的五行属性', category: 'fortune' },
  { id: 'mbti-test', icon: '🧠', name: '性格测试', desc: 'MBTI性格类型分析', category: 'fortune' },
  { id: 'lucky-number', icon: '🔢', name: '幸运数字', desc: '计算你的幸运数字', category: 'fortune' },
  // 起名测名
  { id: 'name-test', icon: '✍️', name: '姓名测试', desc: '姓名五格三才分析', hot: true, category: 'naming' },
  { id: 'baby-name', icon: '👶', name: '宝宝起名', desc: 'AI智能起名推荐', category: 'naming' },
  { id: 'company-name', icon: '🏢', name: '公司起名', desc: '企业名称吉凶测算', category: 'naming' },
  // 占卜求签
  { id: 'dream', icon: '🌙', name: '周公解梦', desc: '解读梦境寓意吉凶', hot: true, category: 'divination' },
  { id: 'tarot', icon: '🎯', name: '塔罗牌占卜', desc: '塔罗牌在线占卜', new: true, category: 'divination' },
  { id: 'guanyin', icon: '📿', name: '观音灵签', desc: '诚心求签问事', new: true, category: 'divination' },
  { id: 'past-life', icon: '🌀', name: '前世今生', desc: '探索你的前世身份', category: 'divination' },
  // 生活工具
  { id: 'lucky-day', icon: '📅', name: '黄道吉日', desc: '查询黄道吉日宜忌', category: 'life' },
  { id: 'wedding-day', icon: '💍', name: '结婚吉日', desc: '挑选结婚好日子', category: 'life' },
  { id: 'move-day', icon: '🏠', name: '搬家吉日', desc: '搬家入宅吉日查询', category: 'life' },
  { id: 'phone-test', icon: '📱', name: '手机测吉凶', desc: '手机号码吉凶分析', category: 'life' },
  { id: 'plate-test', icon: '🚗', name: '车牌测吉凶', desc: '车牌号码吉凶测算', category: 'life' },
  { id: 'fengshui-test', icon: '🏡', name: '家居风水', desc: '房屋风水分析建议', category: 'life' },
  { id: 'birthday-flower', icon: '💐', name: '生日花语', desc: '查询你的生日花', category: 'life' }
])

const filteredTools = computed(() => {
  if (activeCategory.value === 'all') return allTools.value
  return allTools.value.filter(t => t.category === activeCategory.value)
})

const getCategoryCount = (key) => {
  return allTools.value.filter(t => t.category === key).length
}

const openTool = (tool) => {
  if (toolsGridRef.value) {
    toolsGridRef.value.openToolById(tool.id)
  }
}

const goToMaster = () => {
  router.push('/')
}
</script>

<style scoped>
.tools-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #e0e0e0;
}

/* 顶部导航 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(0,0,0,0.2);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: inherit;
}
.logo-icon {
  background: linear-gradient(135deg, #f0c040, #e0a030);
  color: #1a1a2e;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 14px;
}
.logo-text { font-size: 18px; font-weight: 600; }

.header-nav {
  display: flex;
  gap: 24px;
}
.header-nav .nav-item {
  color: #888;
  text-decoration: none;
  font-size: 15px;
  transition: color 0.2s;
}
.header-nav .nav-item:hover,
.header-nav .nav-item.active { color: #f0c040; }

.mobile-menu-btn {
  display: none;
  font-size: 24px;
  cursor: pointer;
}

/* 移动端菜单 */
.mobile-nav {
  display: none;
  flex-direction: column;
  background: rgba(0,0,0,0.3);
  padding: 12px 24px;
}
.mobile-nav .nav-item {
  padding: 12px 0;
  color: #ccc;
  text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

/* 页面标题 */
.page-title {
  text-align: center;
  padding: 48px 24px 32px;
}
.page-title h1 {
  font-size: 32px;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #f0c040, #ff9500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.page-title p { color: #888; font-size: 16px; margin: 0; }

/* 分类标签 */
.category-tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0 24px 32px;
}
.cat-tab {
  padding: 10px 20px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.cat-tab:hover { background: rgba(255,255,255,0.1); }
.cat-tab.active {
  background: linear-gradient(135deg, #f0c040, #e0a030);
  color: #1a1a2e;
  border-color: transparent;
}

/* 工具网格 */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 0 24px 48px;
  max-width: 1200px;
  margin: 0 auto;
}

.tool-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
}
.tool-card:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(240,192,64,0.3);
  transform: translateY(-2px);
}

.tool-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.tool-info h3 {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
}
.tool-info p {
  margin: 0;
  font-size: 13px;
  color: #888;
}

.tool-badges {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
}
.badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}
.badge.hot { background: #ff4757; color: #fff; }
.badge.new { background: #2ed573; color: #fff; }

/* 底部引导 */
.page-footer {
  text-align: center;
  padding: 48px 24px;
  background: rgba(0,0,0,0.2);
}
.page-footer p { color: #888; margin: 0 0 16px; }
.cta-btn {
  display: inline-block;
  padding: 14px 32px;
  background: linear-gradient(135deg, #f0c040, #e0a030);
  color: #1a1a2e;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  transition: transform 0.2s;
}
.cta-btn:hover { transform: scale(1.05); }

/* 响应式 */
@media (max-width: 768px) {
  .header-nav { display: none; }
  .mobile-menu-btn { display: block; }
  .mobile-nav { display: flex; }
  
  .page-title { padding: 32px 16px 24px; }
  .page-title h1 { font-size: 24px; }
  
  .category-tabs { padding: 0 16px 24px; gap: 8px; }
  .cat-tab { padding: 8px 14px; font-size: 13px; }
  
  .tools-grid { padding: 0 16px 32px; gap: 12px; }
  .tool-card { padding: 16px; }
  .tool-icon { font-size: 28px; }
}

/* 隐藏 ToolsGrid 的工具列表，只保留弹窗 */
.tools-modal-container :deep(.tools-section) {
  display: none;
}
.tools-modal-container :deep(.tool-modal) {
  display: flex;
}
</style>
