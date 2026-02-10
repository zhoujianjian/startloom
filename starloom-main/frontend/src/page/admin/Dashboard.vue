<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon user-icon">
          <i class="icon-users"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalUsers }}</h3>
          <p>总用户数</p>
          <span class="stat-change positive">+{{ stats.userGrowth }}%</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon order-icon">
          <i class="icon-orders"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalOrders }}</h3>
          <p>总订单数</p>
          <span class="stat-change positive">+{{ stats.orderGrowth }}%</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon view-icon">
          <i class="icon-views"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalViews }}</h3>
          <p>页面浏览量</p>
          <span class="stat-change positive">+{{ stats.viewGrowth }}%</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon online-icon">
          <i class="icon-online"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.onlineUsers }}</h3>
          <p>在线用户</p>
          <span class="stat-change">当前</span>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <!-- 访问趋势 -->
      <div class="chart-card">
        <div class="card-header">
          <h3>访问趋势</h3>
          <select v-model="dateRange" @change="loadPageViewStats">
            <option value="7">最近7天</option>
            <option value="30">最近30天</option>
            <option value="90">最近90天</option>
          </select>
        </div>
        <div class="chart-content">
          <div v-if="loading" class="loading">加载中...</div>
          <div v-else class="simple-chart">
            <div 
              v-for="(item, index) in pageViewStats" 
              :key="index"
              class="chart-bar"
              :style="{ height: getBarHeight(item.views) + '%' }"
              :title="`${item.date}: ${item.views}次访问`"
            ></div>
          </div>
        </div>
      </div>

      <!-- 热门页面 -->
      <div class="chart-card">
        <div class="card-header">
          <h3>热门页面</h3>
        </div>
        <div class="chart-content">
          <div v-if="loading" class="loading">加载中...</div>
          <div v-else class="top-pages">
            <div 
              v-for="(page, index) in topPages" 
              :key="index"
              class="page-item"
            >
              <span class="page-rank">{{ index + 1 }}</span>
              <span class="page-url">{{ page.pageUrl }}</span>
              <span class="page-views">{{ page.views }}次</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="activity-section">
      <div class="section-card">
        <div class="card-header">
          <h3>最近活动</h3>
        </div>
        <div class="activity-list">
          <div 
            v-for="(activity, index) in recentActivities" 
            :key="index"
            class="activity-item"
          >
            <div class="activity-time">{{ formatTime(activity.time) }}</div>
            <div class="activity-content">{{ activity.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      stats: {
        totalUsers: 0,
        userGrowth: 0,
        totalOrders: 0,
        orderGrowth: 0,
        totalViews: 0,
        viewGrowth: 0,
        onlineUsers: 0
      },
      pageViewStats: [],
      topPages: [],
      recentActivities: [],
      dateRange: '7',
      loading: false,
      maxViews: 0
    }
  },
  methods: {
    async loadDashboard() {
      try {
        const res = await this.$api.analytics.getDashboard()
        if (res?.code === 200) {
          this.stats = res.data
        }
      } catch (error) {
        console.error('加载仪表板数据失败:', error)
      }
    },

    async loadPageViewStats() {
      this.loading = true
      try {
        const res = await this.$api.analytics.getPageViews({
          startDate: this.getStartDate(this.dateRange),
          endDate: this.formatDate(new Date())
        })

        if (res?.code === 200) {
          this.pageViewStats = res.data
          this.maxViews = Math.max(...this.pageViewStats.map(item => item.views))
        }
      } catch (error) {
        console.error('加载访问统计失败:', error)
      } finally {
        this.loading = false
      }
    },

    async loadTopPages() {
      try {
        const res = await this.$api.analytics.getTopPages({
          startDate: this.getStartDate(7)
        })

        if (res?.code === 200) {
          this.topPages = (res.data || []).slice(0, 10)
        }
      } catch (error) {
        console.error('加载热门页面失败:', error)
      }
    },

    async loadRecentActivities() {
      try {
        const res = await this.$api.analytics.getActivities()
        if (res?.code === 200) {
          this.recentActivities = (res.data || []).slice(0, 10)
        }
      } catch (error) {
        console.error('加载最近活动失败:', error)
      }
    },

    getBarHeight(views) {
      return this.maxViews > 0 ? (views / this.maxViews) * 100 : 0
    },

    getStartDate(days) {
      const date = new Date()
      date.setDate(date.getDate() - parseInt(days))
      return this.formatDate(date)
    },

    formatDate(date) {
      return date.toISOString().split('T')[0]
    },

    formatTime(time) {
      return new Date(time).toLocaleString('zh-CN')
    }
  },

  created() {
    this.loadDashboard()
    this.loadPageViewStats()
    this.loadTopPages()
    this.loadRecentActivities()
  }
}
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
  color: white;
}

.user-icon { background: #1890ff; }
.order-icon { background: #52c41a; }
.view-icon { background: #fa8c16; }
.online-icon { background: #722ed1; }

.stat-content h3 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
}

.stat-content p {
  margin: 0 0 8px 0;
  color: #8c8c8c;
  font-size: 14px;
}

.stat-change {
  font-size: 12px;
  font-weight: 500;
}

.stat-change.positive {
  color: #52c41a;
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card, .section-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #262626;
}

.card-header select {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.chart-content {
  padding: 20px;
  height: 300px;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #8c8c8c;
}

.simple-chart {
  display: flex;
  align-items: end;
  height: 100%;
  gap: 4px;
}

.chart-bar {
  flex: 1;
  background: #1890ff;
  min-height: 4px;
  border-radius: 2px 2px 0 0;
  transition: height 0.3s;
}

.top-pages {
  height: 100%;
  overflow-y: auto;
}

.page-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.page-item:last-child {
  border-bottom: none;
}

.page-rank {
  width: 24px;
  height: 24px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  margin-right: 12px;
}

.page-url {
  flex: 1;
  font-size: 14px;
  color: #262626;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-views {
  font-size: 14px;
  color: #8c8c8c;
}

.activity-section {
  margin-bottom: 30px;
}

.activity-list {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-time {
  width: 140px;
  font-size: 12px;
  color: #8c8c8c;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  font-size: 14px;
  color: #262626;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
