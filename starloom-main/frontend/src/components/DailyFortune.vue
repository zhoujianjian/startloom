<template>
  <div class="daily-fortune-section">
    <!-- 今日运势卡片 -->
    <div class="fortune-card" v-if="!showDetail">
      <div class="fortune-header">
        <span class="fortune-title">🌟 今日运势</span>
        <span class="fortune-date">{{ todayStr }}</span>
      </div>
      
      <!-- 未设置生肖/星座时显示选择器 -->
      <div class="fortune-selector" v-if="!userSign">
        <p class="selector-tip">选择你的生肖或星座，获取专属运势</p>
        <div class="selector-tabs">
          <span :class="{ active: selectorType === 'zodiac' }" @click="selectorType = 'zodiac'">生肖</span>
          <span :class="{ active: selectorType === 'star' }" @click="selectorType = 'star'">星座</span>
        </div>
        <div class="selector-grid" v-if="selectorType === 'zodiac'">
          <span v-for="z in zodiacList" :key="z" class="selector-item" @click="selectSign('zodiac', z)">{{ z }}</span>
        </div>
        <div class="selector-grid star-grid" v-else>
          <span v-for="s in starList" :key="s.name" class="selector-item" @click="selectSign('star', s.name)">
            <span class="item-icon">{{ s.icon }}</span>
            <span class="item-name">{{ s.name }}</span>
          </span>
        </div>
      </div>
      
      <!-- 已设置时显示运势摘要 -->
      <div class="fortune-summary" v-else @click="showDetail = true">
        <div class="summary-left">
          <span class="user-sign-icon">{{ userSignIcon }}</span>
          <span class="user-sign-name">{{ userSign }}</span>
        </div>
        <div class="summary-center">
          <div class="fortune-score">
            <span class="score-label">综合运势</span>
            <div class="score-stars">
              <span v-for="i in 5" :key="i" :class="{ active: i <= fortuneScore }">⭐</span>
            </div>
          </div>
          <p class="fortune-brief">{{ fortuneBrief }}</p>
        </div>
        <div class="summary-right">
          <span class="view-detail">查看详情 →</span>
        </div>
      </div>
      
      <!-- 切换生肖/星座 -->
      <div class="change-sign" v-if="userSign" @click="userSign = ''">
        <span>切换{{ userSignType === 'zodiac' ? '生肖' : '星座' }}</span>
      </div>
    </div>
    
    <!-- 运势详情弹窗 -->
    <div class="fortune-detail-modal" v-if="showDetail" @click.self="showDetail = false">
      <div class="detail-content">
        <div class="detail-header">
          <div class="header-left">
            <span class="sign-icon">{{ userSignIcon }}</span>
            <span class="sign-name">{{ userSign }}</span>
            <span class="date">{{ todayStr }}</span>
          </div>
          <span class="close-btn" @click="showDetail = false">×</span>
        </div>
        <div class="detail-body">
          <div class="fortune-loading" v-if="fortuneLoading">
            <span class="loading-icon">🔮</span>
            <p>正在为您解读今日运势...</p>
          </div>
          <div class="fortune-content" v-else>
            <div class="fortune-overview">
              <div class="overview-item" v-for="item in fortuneItems" :key="item.label">
                <span class="item-label">{{ item.label }}</span>
                <div class="item-stars">
                  <span v-for="i in 5" :key="i" :class="{ active: i <= item.score }">★</span>
                </div>
              </div>
            </div>
            <div class="fortune-text">{{ fortuneText }}</div>
            <div class="fortune-tips">
              <div class="tip-item"><span class="tip-label">幸运颜色</span><span class="tip-value">{{ luckyColor }}</span></div>
              <div class="tip-item"><span class="tip-label">幸运数字</span><span class="tip-value">{{ luckyNumber }}</span></div>
              <div class="tip-item"><span class="tip-label">贵人方位</span><span class="tip-value">{{ luckyDirection }}</span></div>
            </div>
          </div>
        </div>
        <div class="detail-footer">
          <button class="consult-btn" @click="consultMaster">🧙 咨询大师深度解读</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['openMaster'])

const todayStr = computed(() => {
  const d = new Date()
  return `${d.getMonth() + 1}月${d.getDate()}日`
})

const zodiacList = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
const starList = [
  { name: '白羊座', icon: '♈' }, { name: '金牛座', icon: '♉' }, { name: '双子座', icon: '♊' },
  { name: '巨蟹座', icon: '♋' }, { name: '狮子座', icon: '♌' }, { name: '处女座', icon: '♍' },
  { name: '天秤座', icon: '♎' }, { name: '天蝎座', icon: '♏' }, { name: '射手座', icon: '♐' },
  { name: '摩羯座', icon: '♑' }, { name: '水瓶座', icon: '♒' }, { name: '双鱼座', icon: '♓' }
]

const selectorType = ref('zodiac')
const userSign = ref('')
const userSignType = ref('')
const showDetail = ref(false)
const fortuneLoading = ref(false)
const fortuneText = ref('')
const fortuneScore = ref(4)
const fortuneBrief = ref('今日运势不错，适合开展新计划')

const fortuneItems = ref([
  { label: '综合运势', score: 4 },
  { label: '爱情运势', score: 3 },
  { label: '事业运势', score: 4 },
  { label: '财富运势', score: 5 }
])

const luckyColor = ref('金色')
const luckyNumber = ref('6')
const luckyDirection = ref('东南')

const userSignIcon = computed(() => {
  if (userSignType.value === 'zodiac') {
    const zodiacIcons = { '鼠': '🐭', '牛': '🐮', '虎': '🐯', '兔': '🐰', '龙': '🐲', '蛇': '🐍', '马': '🐴', '羊': '🐑', '猴': '🐵', '鸡': '🐔', '狗': '🐕', '猪': '🐷' }
    return zodiacIcons[userSign.value] || '🐲'
  } else {
    const star = starList.find(s => s.name === userSign.value)
    return star?.icon || '⭐'
  }
})

const selectSign = async (type, sign) => {
  userSignType.value = type
  userSign.value = sign
  localStorage.setItem('userSign', JSON.stringify({ type, sign }))
  await fetchFortune()
}

const fetchFortune = async () => {
  fortuneLoading.value = true
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const prompt = userSignType.value === 'zodiac' 
      ? `请为属${userSign.value}的人分析今日运势，包括：综合运势(1-5星)、爱情运势、事业运势、财富运势，以及幸运颜色、幸运数字、贵人方位。简洁明了，100字以内。`
      : `请为${userSign.value}分析今日运势，包括：综合运势(1-5星)、爱情运势、事业运势、财富运势，以及幸运颜色、幸运数字、贵人方位。简洁明了，100字以内。`
    
    const response = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt, stream: false })
    })
    const data = await response.json()
    fortuneText.value = data.content || data.message || '今日运势良好，宜积极进取。'
    
    // 随机生成运势数据
    fortuneScore.value = Math.floor(Math.random() * 2) + 3
    fortuneItems.value = [
      { label: '综合运势', score: fortuneScore.value },
      { label: '爱情运势', score: Math.floor(Math.random() * 3) + 3 },
      { label: '事业运势', score: Math.floor(Math.random() * 3) + 3 },
      { label: '财富运势', score: Math.floor(Math.random() * 3) + 3 }
    ]
    
    const colors = ['红色', '金色', '蓝色', '绿色', '紫色', '白色']
    const directions = ['东', '南', '西', '北', '东南', '西北']
    luckyColor.value = colors[Math.floor(Math.random() * colors.length)]
    luckyNumber.value = String(Math.floor(Math.random() * 9) + 1)
    luckyDirection.value = directions[Math.floor(Math.random() * directions.length)]
    
    fortuneBrief.value = fortuneText.value.slice(0, 20) + '...'
  } catch (e) {
    fortuneText.value = '今日运势良好，宜积极进取，把握机遇。'
  }
  fortuneLoading.value = false
}

const consultMaster = () => {
  showDetail.value = false
  emit('openMaster')
}

onMounted(() => {
  const saved = localStorage.getItem('userSign')
  if (saved) {
    const { type, sign } = JSON.parse(saved)
    userSignType.value = type
    userSign.value = sign
    fetchFortune()
  }
})
</script>


<style scoped>
.daily-fortune-section { margin: 16px 0; }

.fortune-card {
  background: linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1));
  border: 1px solid rgba(245,158,11,0.3);
  border-radius: 16px;
  padding: 16px;
  position: relative;
}

.fortune-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.fortune-title { font-size: 15px; font-weight: 600; color: var(--textPrimary, #fff); }
.fortune-date { font-size: 12px; color: var(--textSecondary, rgba(255,255,255,0.6)); }

.selector-tip { font-size: 13px; color: var(--textSecondary); text-align: center; margin-bottom: 12px; }

.selector-tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;
}
.selector-tabs span {
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  background: rgba(255,255,255,0.05);
  color: var(--textSecondary);
  transition: all 0.2s;
}
.selector-tabs span.active {
  background: var(--accent, #f59e0b);
  color: #fff;
}

.selector-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}
.selector-grid.star-grid { grid-template-columns: repeat(4, 1fr); }

.selector-item {
  padding: 8px 4px;
  background: rgba(255,255,255,0.05);
  border: 1px solid transparent;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  font-size: 13px;
  color: var(--textPrimary);
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.selector-item:hover {
  border-color: var(--accent, #f59e0b);
  background: rgba(245,158,11,0.1);
}
.item-icon { font-size: 16px; }
.item-name { font-size: 11px; }

.fortune-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: background 0.2s;
}
.fortune-summary:hover { background: rgba(255,255,255,0.05); }

.summary-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
}
.user-sign-icon { font-size: 28px; }
.user-sign-name { font-size: 12px; color: var(--textSecondary); }

.summary-center { flex: 1; }
.fortune-score { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.score-label { font-size: 12px; color: var(--textSecondary); }
.score-stars span { font-size: 12px; opacity: 0.3; }
.score-stars span.active { opacity: 1; }
.fortune-brief { font-size: 13px; color: var(--textPrimary); margin: 0; }

.summary-right { color: var(--accent, #f59e0b); font-size: 12px; }

.change-sign {
  text-align: center;
  margin-top: 8px;
  font-size: 11px;
  color: var(--textMuted, rgba(255,255,255,0.4));
  cursor: pointer;
}
.change-sign:hover { color: var(--accent); }

/* 详情弹窗 */
.fortune-detail-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.detail-content {
  background: var(--bgCard, #1a1a2e);
  border-radius: 20px;
  width: 100%;
  max-width: 420px;
  max-height: 80vh;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.1));
  border-radius: 20px 20px 0 0;
}
.header-left { display: flex; align-items: center; gap: 8px; }
.sign-icon { font-size: 24px; }
.sign-name { font-size: 16px; font-weight: 600; color: var(--textPrimary); }
.date { font-size: 12px; color: var(--textSecondary); }
.close-btn { font-size: 24px; color: rgba(255,255,255,0.6); cursor: pointer; }

.detail-body { padding: 20px; }

.fortune-loading {
  text-align: center;
  padding: 40px 0;
}
.loading-icon { font-size: 48px; animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.fortune-loading p { color: var(--textSecondary); margin-top: 12px; }

.fortune-overview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}
.overview-item {
  background: rgba(255,255,255,0.05);
  padding: 10px;
  border-radius: 10px;
}
.item-label { font-size: 12px; color: var(--textSecondary); display: block; margin-bottom: 4px; }
.item-stars span { color: #ccc; font-size: 14px; }
.item-stars span.active { color: #f59e0b; }

.fortune-text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--textPrimary);
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
}

.fortune-tips {
  display: flex;
  justify-content: space-around;
  padding: 12px;
  background: rgba(245,158,11,0.1);
  border-radius: 10px;
}
.tip-item { text-align: center; }
.tip-label { font-size: 11px; color: var(--textSecondary); display: block; }
.tip-value { font-size: 14px; color: var(--accent, #f59e0b); font-weight: 600; }

.detail-footer { padding: 16px 20px; }
.consult-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 768px) {
  .selector-grid { grid-template-columns: repeat(4, 1fr); }
  .selector-grid.star-grid { grid-template-columns: repeat(3, 1fr); }
  .fortune-summary { flex-direction: column; text-align: center; }
  .summary-right { margin-top: 8px; }
}
</style>
