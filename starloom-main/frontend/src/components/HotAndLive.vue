<template>
  <div class="hot-live-section">
    <div class="hot-live-container">
      <!-- 左侧：热门测试 -->
      <div class="hot-side">
        <div class="section-header">
          <span class="section-title">🔥 热门测试</span>
          <div class="tab-switch">
            <span :class="{ active: activeTab === 'today' }" @click="activeTab = 'today'">今日</span>
            <span :class="{ active: activeTab === 'week' }" @click="activeTab = 'week'">本周</span>
          </div>
        </div>
        <div class="hot-list">
          <div 
            class="hot-item" 
            v-for="(item, idx) in displayList" 
            :key="item.id"
            @click="$emit('openTool', item)"
          >
            <span class="rank" :class="{ top: idx < 3 }">{{ idx + 1 }}</span>
            <span class="icon">{{ item.icon }}</span>
            <span class="name">{{ item.name }}</span>
            <span class="count">{{ formatCount(item.count) }}人</span>
          </div>
        </div>
      </div>
      
      <!-- 右侧：实时动态 -->
      <div class="live-side">
        <div class="section-header">
          <span class="section-title"><span class="live-dot"></span> 实时动态</span>
        </div>
        <div class="live-list">
          <transition-group name="live" tag="div">
            <div class="live-item" v-for="feed in liveFeeds" :key="feed.id">
              <span class="avatar">{{ feed.avatar }}</span>
              <span class="text">{{ feed.text }}</span>
              <span class="time">{{ feed.time }}</span>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineEmits(['openTool'])

const activeTab = ref('today')

// 热门数据
const todayRanking = ref([
  { id: 'name-test', icon: '✍️', name: '姓名测试', count: 12580 },
  { id: 'zodiac-match', icon: '🐲', name: '生肖配对', count: 9876 },
  { id: 'daily-sign', icon: '🎋', name: '今日运势', count: 8654 },
  { id: 'dream', icon: '🌙', name: '周公解梦', count: 7432 },
  { id: 'constellation-match', icon: '⭐', name: '星座配对', count: 6521 }
])

const weekRanking = ref([
  { id: 'name-test', icon: '✍️', name: '姓名测试', count: 89650 },
  { id: 'daily-sign', icon: '🎋', name: '今日运势', count: 76543 },
  { id: 'zodiac-match', icon: '🐲', name: '生肖配对', count: 65432 },
  { id: 'baby-name', icon: '👶', name: '宝宝起名', count: 54321 },
  { id: 'dream', icon: '🌙', name: '周公解梦', count: 43210 }
])

const displayList = computed(() => activeTab.value === 'today' ? todayRanking.value : weekRanking.value)

const formatCount = (num) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num
}

// 实时动态
const liveFeeds = ref([])
const feedId = ref(0)

const names = ['小明', '阿花', '大壮', '小红', '阿强', '小美', '老王', '小李', '阿珍', '大伟', '晓晓', '明明']
const avatars = ['👤', '👩', '👨', '🧑', '👧', '👦', '🧔', '👱', '👸', '🤴', '👩‍🦰', '👨‍🦱']
const actions = [
  '刚测了姓名，得分92分',
  '完成了生肖配对测试',
  '抽到了上上签',
  '测了今日运势',
  '做了周公解梦',
  '测了缘分指数98%',
  '查了黄道吉日',
  '测了手机号吉凶'
]

const addFeed = () => {
  const feed = {
    id: feedId.value++,
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
    text: names[Math.floor(Math.random() * names.length)] + actions[Math.floor(Math.random() * actions.length)],
    time: '刚刚'
  }
  liveFeeds.value.unshift(feed)
  if (liveFeeds.value.length > 5) liveFeeds.value.pop()
  
  // 更新时间显示
  liveFeeds.value.forEach((f, i) => {
    if (i === 0) f.time = '刚刚'
    else if (i === 1) f.time = '1分钟前'
    else f.time = `${i + 1}分钟前`
  })
}

let feedTimer = null
onMounted(() => {
  // 初始化3条
  for (let i = 0; i < 3; i++) addFeed()
  feedTimer = setInterval(addFeed, 4000)
})
onUnmounted(() => {
  if (feedTimer) clearInterval(feedTimer)
})
</script>

<style scoped>
.hot-live-section {
  margin: 24px auto;
  padding: 0 20px;
  max-width: 900px;
}

.hot-live-container {
  display: flex;
  gap: 20px;
  background: var(--bgCard, rgba(255,255,255,0.04));
  border: 1px solid var(--border, rgba(255,255,255,0.08));
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.hot-side, .live-side {
  flex: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border, rgba(255,255,255,0.06));
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--textPrimary, #fff);
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Noto Serif SC', serif;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.tab-switch {
  display: flex;
  gap: 4px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 2px;
}
.tab-switch span {
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 11px;
  cursor: pointer;
  color: var(--textSecondary);
  transition: all 0.2s;
}
.tab-switch span.active {
  background: var(--accent, #f59e0b);
  color: #fff;
}

/* 热门列表 */
.hot-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.hot-item:hover {
  background: rgba(245,158,11,0.12);
  transform: translateX(6px);
  box-shadow: 0 2px 8px rgba(245,158,11,0.15);
}

.rank {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--textSecondary);
}
.rank.top {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(245,158,11,0.4);
}

.icon { font-size: 18px; }
.name { flex: 1; font-size: 14px; color: var(--textPrimary); font-weight: 500; }
.count { font-size: 12px; color: var(--textMuted, rgba(255,255,255,0.5)); }

/* 实时动态 */
.live-list {
  min-height: 180px;
}

.live-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.live-item:last-child { border-bottom: none; }

.avatar { font-size: 16px; }
.text { flex: 1; font-size: 12px; color: var(--textPrimary); }
.time { font-size: 10px; color: var(--textMuted); }

/* 动画 */
.live-enter-active {
  animation: slideIn 0.3s ease;
}
.live-leave-active {
  animation: slideOut 0.2s ease;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideOut {
  from { opacity: 1; }
  to { opacity: 0; height: 0; padding: 0; }
}

/* 移动端 */
@media (max-width: 768px) {
  .hot-live-section { 
    margin: 12px auto;
    padding: 0 10px;
  }
  
  .hot-live-container {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }
  
  .hot-side, .live-side {
    width: 100%;
  }
  
  .live-side {
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 12px;
  }
  
  .live-list { min-height: auto; }
  
  .hot-item {
    padding: 6px 8px;
  }
  
  .live-item {
    padding: 6px 0;
  }
}
</style>
