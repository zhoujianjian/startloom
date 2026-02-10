<template>
  <div class="analytics">
    <!-- 时间范围选择 -->
    <div class="date-selector">
      <div class="date-tabs">
        <button 
          v-for="range in dateRanges" 
          :key="range.value"
          @click="selectDateRange(range.value)"
          :class="{ active: selectedRange === range.value }"
          class="date-tab"
        >
          {{ range.label }}
        </button>
      </div>
      <div class="custom-date">
        <input 
          v-model="customStartDate" 
          type="date" 
          @change="loadAnalytics"
        />
        <span>至</span>
        <input 
          v-model="customEndDate" 
          type="date" 
          @change="loadAnalytics"
        />
      </div>
    </div>

    <!-- 核心指标 -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-header">
          <h3>页面浏览量</h3>
          <span class="metric-change positive">+{{ metrics.pageViewsGrowth }}%</span>
        </div>
        <div class="metric-value">{{ formatNumber(metrics.totalPageViews) }}</div>
        <div class="metric-chart">
          <div class="mini-chart" id="pageViewsChart"></div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <h3>独立访客</h3>
          <span class="metric-change positive">+{{ metrics.uniqueVisitorsGrowth }}%</span>
        </div>
        <div class="metric-value">{{ formatNumber(metrics.uniqueVisitors) }}</div>
        <div class="metric-chart">
          <div class="mini-chart" id="visitorsChart"></div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <h3>平均停留时间</h3>
          <span class="metric-change positive">+{{ metrics.avgStayTimeGrowth }}%</span>
        </div>
        <div class="metric-value">{{ metrics.avgStayTime }}s</div>
        <div class="metric-chart">
          <div class="mini-chart" id="stayTimeChart"></div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <h3>跳出率</h3>
          <span class="metric-change negative">-{{ metrics.bounceRateReduction }}%</span>
        </div>
        <div class="metric-value">{{ metrics.bounceRate }}%</div>
        <div class="metric-chart">
          <div class="mini-chart" id="bounceRateChart"></div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <!-- 访问趋势图 -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>访问趋势</h3>
          <div class="chart-controls">
            <select v-model="chartType" @change="loadPageViewStats">
              <option value="daily">按天</option>
              <option value="hourly">按小时</option>
            </select>
          </div>
        </div>
        <div class="chart-content">
          <div v-if="loading" class="loading">加载中...</div>
          <div v-else class="trend-chart">
            <div class="chart-grid">
              <div class="chart-bars">
                <div 
                  v-for="(item, index) in pageViewStats" 
                  :key="index"
                  class="chart-bar-group"
                >
                  <div 
                    class="chart-bar pageviews" 
                    :style="{ height: getBarHeight(item.views, maxPageViews) + '%' }"
                    :title="`${item.date}: ${item.views}次浏览`"
                  ></div>
                  <div 
                    class="chart-bar visitors" 
                    :style="{ height: getBarHeight(item.uniqueVisitors, maxUniqueVisitors) + '%' }"
                    :title="`${item.date}: ${item.uniqueVisitors}位访客`"
                  ></div>
                  <div class="chart-label">{{ formatChartLabel(item.date) }}</div>
                </div>
              </div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color pageviews"></div>
                <span>页面浏览量</span>
              </div>
              <div class="legend-item">
                <div class="legend-color visitors"></div>
                <span>独立访客</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 设备分布 -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>设备分布</h3>
        </div>
        <div class="chart-content">
          <div class="device-stats">
            <div 
              v-for="device in deviceStats" 
              :key="device.type"
              class="device-item"
            >
              <div class="device-info">
                <div class="device-icon" :class="device.type">
                  <i :class="getDeviceIcon(device.type)"></i>
                </div>
                <div class="device-details">
                  <div class="device-name">{{ getDeviceName(device.type) }}</div>
                  <div class="device-count">{{ device.count }}次访问</div>
                </div>
              </div>
              <div class="device-percentage">{{ device.percentage }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门页面和行为分析 -->
    <div class="analysis-section">
      <!-- 热门页面 -->
      <div class="analysis-card">
        <div class="card-header">
          <h3>热门页面</h3>
        </div>
        <div class="card-content">
          <div class="top-pages-list">
            <div 
              v-for="(page, index) in topPages" 
              :key="index"
              class="page-item"
            >
              <div class="page-rank">{{ index + 1 }}</div>
              <div class="page-info">
                <div class="page-url">{{ page.pageUrl }}</div>
                <div class="page-title">{{ page.pageTitle }}</div>
              </div>
              <div class="page-stats">
                <div class="page-views">{{ formatNumber(page.views) }}</div>
                <div class="page-avg-time">{{ page.avgStayTime }}s</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户行为 -->
      <div class="analysis-card">
        <div class="card-header">
          <h3>用户行为</h3>
        </div>
        <div class="card-content">
          <div class="behavior-stats">
            <div 
              v-for="behavior in behaviorStats" 
              :key="behavior.type"
              class="behavior-item"
            >
              <div class="behavior-icon">
                <i :class="getBehaviorIcon(behavior.type)"></i>
              </div>
              <div class="behavior-info">
                <div class="behavior-name">{{ getBehaviorName(behavior.type) }}</div>
                <div class="behavior-count">{{ behavior.count }}次</div>
              </div>
              <div class="behavior-percentage">{{ behavior.percentage }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时活动 -->
    <div class="realtime-section">
      <div class="realtime-card">
        <div class="card-header">
          <h3>实时活动</h3>
          <div class="live-indicator">
            <span class="live-dot"></span>
            实时
          </div>
        </div>
        <div class="card-content">
          <div class="activity-feed">
            <div 
              v-for="(activity, index) in realtimeActivities" 
              :key="index"
              class="activity-item"
            >
              <div class="activity-time">{{ formatTime(activity.time) }}</div>
              <div class="activity-content">
                <span class="activity-user">{{ activity.user }}</span>
                <span class="activity-action">{{ activity.action }}</span>
                <span class="activity-target">{{ activity.target }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Analytics',
  data() {
    return {
      selectedRange: '7',
      customStartDate: '',
      customEndDate: '',
      chartType: 'daily',
      loading: false,
      
      dateRanges: [
        { label: '今天', value: '1' },
        { label: '最近7天', value: '7' },
        { label: '最近30天', value: '30' },
        { label: '最近90天', value: '90' }
      ],

      metrics: {
        totalPageViews: 0,
        pageViewsGrowth: 0,
        uniqueVisitors: 0,
        uniqueVisitorsGrowth: 0,
        avgStayTime: 0,
        avgStayTimeGrowth: 0,
        bounceRate: 0,
        bounceRateReduction: 0
      },

      pageViewStats: [],
      deviceStats: [],
      topPages: [],
      behaviorStats: [],
      realtimeActivities: [],
      
      maxPageViews: 0,
      maxUniqueVisitors: 0
    }
  },

  methods: {
    selectDateRange(range) {
      this.selectedRange = range
      this.setCustomDates(range)
      this.loadAnalytics()
    },

    setCustomDates(range) {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(range))
      
      this.customStartDate = this.formatDate(startDate)
      this.customEndDate = this.formatDate(endDate)
    },

    async loadAnalytics() {
      this.loading = true
      try {
        await Promise.all([
          this.loadMetrics(),
          this.loadPageViewStats(),
          this.loadDeviceStats(),
          this.loadTopPages(),
          this.loadBehaviorStats(),
          this.loadRealtimeActivities()
        ])
      } catch (error) {
        console.error('加载分析数据失败:', error)
      } finally {
        this.loading = false
      }
    },

    async loadMetrics() {
      try {
        const res = await this.$api.analytics.getRealTimeMetrics()
        if (res?.code === 200) {
          this.metrics = res.data
        }
      } catch (error) {
        this.metrics = {}
      }
    },

    async loadPageViewStats() {
      try {
        const res = await this.$api.analytics.getPageViews({
          startDate: this.customStartDate,
          endDate: this.customEndDate
        })
        
        if (res?.code === 200) {
          this.pageViewStats = [{
            date: this.formatDate(new Date()),
            views: res.data.total || 0,
            uniqueVisitors: res.data.unique || 0
          }]
          this.maxPageViews = res.data.total || 0
          this.maxUniqueVisitors = res.data.unique || 0
        }
      } catch (error) {
        this.pageViewStats = []
        this.maxPageViews = 0
        this.maxUniqueVisitors = 0
      }
    },

    async loadDeviceStats() {
      try {
        const res = await this.$api.analytics.getDeviceStats({
          startDate: this.customStartDate
        })
        
        if (res?.code === 200) {
          this.deviceStats = res.data
        }
      } catch (error) {
        this.deviceStats = []
      }
    },

    async loadTopPages() {
      try {
        const res = await this.$api.analytics.getTopPages({
          startDate: this.customStartDate
        })
        
        if (res?.code === 200) {
          this.topPages = (res.data || []).slice(0, 10)
        }
      } catch (error) {
        this.topPages = []
      }
    },

    async loadBehaviorStats() {
      try {
        const res = await this.$api.analytics.getBehaviorStats({
          startDate: this.customStartDate
        })
        
        if (res?.code === 200) {
          this.behaviorStats = res.data
        }
      } catch (error) {
        this.behaviorStats = []
      }
    },

    async loadRealtimeActivities() {
      try {
        const res = await this.$api.analytics.getActivities()
        if (res?.code === 200) {
          this.realtimeActivities = (res.data || []).slice(0, 20)
        }
      } catch (error) {
        this.realtimeActivities = []
      }
    },

    getBarHeight(value, maxValue) {
      return maxValue > 0 ? (value / maxValue) * 100 : 0
    },

    formatChartLabel(date) {
      const d = new Date(date)
      if (this.chartType === 'daily') {
        return `${d.getMonth() + 1}/${d.getDate()}`
      } else {
        return `${d.getHours()}:00`
      }
    },

    getDeviceIcon(type) {
      const icons = {
        desktop: 'icon-desktop',
        mobile: 'icon-mobile',
        tablet: 'icon-tablet'
      }
      return icons[type] || 'icon-device'
    },

    getDeviceName(type) {
      const names = {
        desktop: '桌面端',
        mobile: '移动端',
        tablet: '平板'
      }
      return names[type] || '其他'
    },

    getBehaviorIcon(type) {
      const icons = {
        page_view: 'icon-eye',
        tool_use: 'icon-tool',
        chat: 'icon-chat',
        article_read: 'icon-book'
      }
      return icons[type] || 'icon-action'
    },

    getBehaviorName(type) {
      const names = {
        page_view: '页面浏览',
        tool_use: '工具使用',
        chat: '聊天互动',
        article_read: '文章阅读'
      }
      return names[type] || type
    },

    formatNumber(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万'
      }
      return num.toLocaleString()
    },

    formatDate(date) {
      return date.toISOString().split('T')[0]
    },

    formatTime(time) {
      return new Date(time).toLocaleTimeString('zh-CN')
    }
  },

  created() {
    this.setCustomDates(this.selectedRange)
    this.loadAnalytics()
    
    // 每30秒更新一次实时数据
    this.realtimeTimer = setInterval(() => {
      this.loadRealtimeActivities()
    }, 30000)
  },

  beforeDestroy() {
    if (this.realtimeTimer) {
      clearInterval(this.realtimeTimer)
    }
  }
}
</script>

<style scoped>
.analytics {
  padding: 0;
}

.date-selector {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-tabs {
  display: flex;
  gap: 8px;
}

.date-tab {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.date-tab.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.custom-date {
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-date input {
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-header h3 {
  margin: 0;
  font-size: 14px;
  color: #8c8c8c;
  font-weight: 400;
}

.metric-change {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 10px;
}

.metric-change.positive {
  background: #f6ffed;
  color: #52c41a;
}

.metric-change.negative {
  background: #fff2f0;
  color: #ff4d4f;
}

.metric-value {
  font-size: 28px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16px;
}

.metric-chart {
  height: 40px;
}

.mini-chart {
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #f0f0f0 0%, #1890ff 100%);
  border-radius: 4px;
  opacity: 0.3;
}

.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-container, .analysis-card, .realtime-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chart-header, .card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h3, .card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #262626;
}

.chart-controls select {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.chart-content, .card-content {
  padding: 20px;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #8c8c8c;
}

.trend-chart {
  height: 300px;
}

.chart-grid {
  height: 250px;
  position: relative;
}

.chart-bars {
  display: flex;
  align-items: end;
  height: 100%;
  gap: 8px;
  padding: 0 8px;
}

.chart-bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  min-width: 30px;
}

.chart-bar {
  width: 100%;
  border-radius: 2px 2px 0 0;
  margin-bottom: 2px;
}

.chart-bar.pageviews {
  background: #1890ff;
}

.chart-bar.visitors {
  background: #52c41a;
  height: 60%;
}

.chart-label {
  font-size: 10px;
  color: #8c8c8c;
  margin-top: 4px;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #595959;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.pageviews {
  background: #1890ff;
}

.legend-color.visitors {
  background: #52c41a;
}

.device-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.device-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.device-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.device-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.device-icon.desktop { background: #1890ff; }
.device-icon.mobile { background: #52c41a; }
.device-icon.tablet { background: #fa8c16; }

.device-name {
  font-weight: 500;
  color: #262626;
}

.device-count {
  font-size: 12px;
  color: #8c8c8c;
}

.device-percentage {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.analysis-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.top-pages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.page-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
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
  flex-shrink: 0;
}

.page-info {
  flex: 1;
}

.page-url {
  font-size: 14px;
  color: #262626;
  margin-bottom: 2px;
}

.page-title {
  font-size: 12px;
  color: #8c8c8c;
}

.page-stats {
  text-align: right;
}

.page-views {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.page-avg-time {
  font-size: 12px;
  color: #8c8c8c;
}

.behavior-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.behavior-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.behavior-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1890ff;
}

.behavior-info {
  flex: 1;
  margin-left: 12px;
}

.behavior-name {
  font-weight: 500;
  color: #262626;
}

.behavior-count {
  font-size: 12px;
  color: #8c8c8c;
}

.behavior-percentage {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.realtime-section {
  margin-bottom: 30px;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #52c41a;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #52c41a;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.activity-feed {
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
  width: 80px;
  font-size: 12px;
  color: #8c8c8c;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  font-size: 14px;
  color: #262626;
}

.activity-user {
  font-weight: 500;
  color: #1890ff;
}

.activity-action {
  margin: 0 4px;
}

.activity-target {
  color: #52c41a;
}

@media (max-width: 1200px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .analysis-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .date-selector {
    flex-direction: column;
    gap: 16px;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
