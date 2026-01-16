<template>
  <div class="admin-stats" v-if="isAuthorized">
    <div class="stats-header">
      <h1>📊 数据统计面板</h1>
      <div class="header-actions">
        <span class="admin-badge">👤 {{ adminName }}</span>
        <span class="refresh-btn" @click="loadStats">🔄 刷新</span>
        <span class="back-btn" @click="goBack">← 返回首页</span>
      </div>
    </div>
    
    <!-- 核心指标 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-label">真实总测算</div>
        <div class="stat-value">{{ realStats.realTotalCount }}</div>
        <div class="stat-base">基数: {{ realStats.baseTotalCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">真实今日测算</div>
        <div class="stat-value">{{ realStats.realTodayCount }}</div>
        <div class="stat-base">基数: {{ realStats.baseTodayCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">真实在线人数</div>
        <div class="stat-value">{{ realStats.realOnlineCount }}</div>
        <div class="stat-base">基数: {{ realStats.baseOnlineCount }}</div>
      </div>
      <div class="stat-card highlight">
        <div class="stat-label">用户看到的今日</div>
        <div class="stat-value">{{ displayStats.todayCount }}</div>
      </div>
      <div class="stat-card highlight">
        <div class="stat-label">用户看到的在线</div>
        <div class="stat-value">{{ displayStats.onlineCount }}</div>
      </div>
    </div>
    
    <!-- 工具统计 -->
    <div class="tools-section">
      <h2>🛠️ 工具使用统计</h2>
      <table class="stats-table">
        <thead>
          <tr>
            <th>工具</th>
            <th>真实总计</th>
            <th>真实今日</th>
            <th>基数总计</th>
            <th>基数今日</th>
            <th>用户看到</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tool in toolStats" :key="tool.toolId">
            <td>{{ tool.toolIcon }} {{ tool.toolName }}</td>
            <td>{{ tool.realTotal }}</td>
            <td>{{ tool.realToday }}</td>
            <td>{{ tool.baseTotal }}</td>
            <td>{{ tool.baseToday }}</td>
            <td class="highlight-cell">{{ tool.baseTotal + tool.realTotal }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="stats-footer">
      <p>最后更新: {{ lastUpdate }}</p>
    </div>
  </div>
  
  <div class="unauthorized" v-else-if="!loading">
    <h2>🔒 无权访问</h2>
    <p>{{ errorMsg || '请使用管理员账号登录后访问' }}</p>
    <button class="login-btn" @click="goToLogin">去登录</button>
  </div>
  
  <div class="loading" v-else>
    <p>验证中...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAuthorized = ref(false)
const loading = ref(true)
const lastUpdate = ref('')
const errorMsg = ref('')
const adminName = ref('')
let refreshTimer = null

const realStats = ref({
  baseTotalCount: 0, baseTodayCount: 0, baseOnlineCount: 0,
  realTotalCount: 0, realTodayCount: 0, realOnlineCount: 0
})

const displayStats = ref({ todayCount: 0, onlineCount: 0 })
const toolStats = ref([])

const getToken = () => localStorage.getItem('starloomAI-token')

const loadStats = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const token = getToken()
    
    // 获取真实数据
    const realRes = await fetch(`${baseUrl}/analytics/admin/real-stats`, {
      headers: { 'Authorization': token }
    })
    const realData = await realRes.json()
    if (realData.code === 200) {
      realStats.value = realData.data
    } else {
      errorMsg.value = realData.msg || '获取数据失败'
      isAuthorized.value = false
      return
    }
    
    // 获取用户看到的数据
    const displayRes = await fetch(`${baseUrl}/analytics/realtime`)
    const displayData = await displayRes.json()
    if (displayData.code === 200) {
      displayStats.value = displayData.data
    }
    
    // 获取工具统计
    const toolRes = await fetch(`${baseUrl}/analytics/admin/tool-stats`, {
      headers: { 'Authorization': token }
    })
    const toolData = await toolRes.json()
    if (toolData.code === 200) {
      toolStats.value = toolData.data
    }
    
    lastUpdate.value = new Date().toLocaleString()
  } catch (e) {
    console.error('加载统计失败', e)
    errorMsg.value = '网络错误'
  }
}

const checkAdmin = async () => {
  const token = getToken()
  if (!token) {
    loading.value = false
    errorMsg.value = '请先登录'
    return
  }
  
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const res = await fetch(`${baseUrl}/api/checkLogin`, {
      headers: { 'Authorization': token }
    })
    const data = await res.json()
    
    if (data.code === 200 && data.data.isAdmin) {
      isAuthorized.value = true
      adminName.value = data.data.nickname || data.data.account
      loadStats()
      // 每30秒自动刷新
      refreshTimer = setInterval(loadStats, 30000)
    } else {
      errorMsg.value = data.data?.isAdmin === false ? '您不是管理员' : '登录已过期'
    }
  } catch (e) {
    errorMsg.value = '验证失败'
  }
  loading.value = false
}

const goBack = () => router.push('/')
const goToLogin = () => router.push('/')

onMounted(() => {
  checkAdmin()
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
})
</script>

<style scoped>
.admin-stats {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #1a1a2e;
  min-height: 100vh;
  color: #e0e0e0;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #333;
  flex-wrap: wrap;
  gap: 12px;
}

.stats-header h1 { margin: 0; font-size: 24px; }

.header-actions { display: flex; gap: 12px; align-items: center; }

.admin-badge {
  background: linear-gradient(135deg, #f0c040, #e0a030);
  color: #1a1a2e;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 14px;
}

.refresh-btn, .back-btn {
  cursor: pointer;
  padding: 8px 16px;
  background: #4a4a6a;
  border-radius: 8px;
  font-size: 14px;
}
.refresh-btn:hover, .back-btn:hover { background: #5a5a7a; }

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: #252540;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}
.stat-card.highlight { background: linear-gradient(135deg, #4a3f6a, #3a2f5a); }

.stat-label { font-size: 14px; color: #888; margin-bottom: 8px; }
.stat-value { font-size: 32px; font-weight: bold; color: #f0c040; }
.stat-base { font-size: 12px; color: #666; margin-top: 8px; }

.tools-section { margin-top: 32px; }
.tools-section h2 { margin-bottom: 16px; }

.stats-table {
  width: 100%;
  border-collapse: collapse;
  background: #252540;
  border-radius: 12px;
  overflow: hidden;
}

.stats-table th, .stats-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #333;
}

.stats-table th { background: #1a1a30; color: #888; font-weight: 500; }
.stats-table tr:hover { background: #2a2a4a; }
.highlight-cell { color: #f0c040; font-weight: bold; }

.stats-footer {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #333;
  color: #666;
  font-size: 14px;
}

.unauthorized, .loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #1a1a2e;
  color: #e0e0e0;
}

.login-btn {
  margin-top: 20px;
  padding: 12px 32px;
  background: linear-gradient(135deg, #f0c040, #e0a030);
  color: #1a1a2e;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
.login-btn:hover { opacity: 0.9; }

@media (max-width: 768px) {
  .stats-table { font-size: 12px; }
  .stats-table th, .stats-table td { padding: 8px; }
  .stat-value { font-size: 24px; }
}
</style>
