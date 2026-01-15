<template>
  <div class="test-history-section">
    <!-- 入口按钮 -->
    <div class="history-entry" @click="showHistory = true" v-if="!showHistory">
      <span class="entry-icon">📋</span>
      <span class="entry-text">我的测算记录</span>
      <span class="entry-count" v-if="historyCount > 0">{{ historyCount }}</span>
      <span class="entry-arrow">→</span>
    </div>
    
    <!-- 历史记录弹窗 -->
    <div class="history-modal" v-if="showHistory" @click.self="showHistory = false">
      <div class="history-content">
        <div class="history-header">
          <h3>📋 我的测算记录</h3>
          <span class="close-btn" @click="showHistory = false">×</span>
        </div>
        
        <div class="history-body">
          <!-- 未登录提示 -->
          <div class="login-tip" v-if="!isLoggedIn">
            <span class="tip-icon">🔐</span>
            <p>登录后可保存和查看测算记录</p>
            <button class="login-btn" @click="$emit('showLogin')">立即登录</button>
          </div>
          
          <!-- 历史列表 -->
          <div class="history-list" v-else-if="historyList.length > 0">
            <div class="history-item" v-for="item in historyList" :key="item.id" @click="viewDetail(item)">
              <div class="item-left">
                <span class="item-icon">{{ item.icon }}</span>
                <div class="item-info">
                  <span class="item-title">{{ item.title }}</span>
                  <span class="item-desc">{{ item.desc }}</span>
                </div>
              </div>
              <div class="item-right">
                <span class="item-time">{{ item.time }}</span>
                <span class="item-arrow">→</span>
              </div>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div class="empty-state" v-else>
            <span class="empty-icon">📭</span>
            <p>暂无测算记录</p>
            <p class="empty-tip">快去体验各种有趣的测试吧~</p>
          </div>
        </div>
        
        <!-- 底部操作 -->
        <div class="history-footer" v-if="isLoggedIn && historyList.length > 0">
          <button class="clear-btn" @click="clearHistory">清空记录</button>
        </div>
      </div>
    </div>
    
    <!-- 详情弹窗 -->
    <div class="detail-modal" v-if="showDetail" @click.self="showDetail = false">
      <div class="detail-content">
        <div class="detail-header">
          <h3>{{ currentItem?.icon }} {{ currentItem?.title }}</h3>
          <span class="close-btn" @click="showDetail = false">×</span>
        </div>
        <div class="detail-body">
          <div class="detail-meta">
            <span>{{ currentItem?.desc }}</span>
            <span>{{ currentItem?.time }}</span>
          </div>
          <div class="detail-result">{{ currentItem?.result }}</div>
        </div>
        <div class="detail-footer">
          <button class="retest-btn" @click="retest">重新测算</button>
          <button class="share-btn" @click="shareResult">分享结果</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['showLogin', 'openTool'])

const showHistory = ref(false)
const showDetail = ref(false)
const currentItem = ref(null)
const historyList = ref([])

const isLoggedIn = computed(() => !!localStorage.getItem('starloomAI-token'))
const historyCount = computed(() => historyList.value.length)

// 从本地存储加载历史记录
const loadHistory = () => {
  const saved = localStorage.getItem('testHistory')
  if (saved) {
    historyList.value = JSON.parse(saved)
  }
}

// 保存历史记录（供外部调用）
const saveHistory = (item) => {
  const newItem = {
    id: Date.now(),
    ...item,
    time: formatTime(new Date())
  }
  historyList.value.unshift(newItem)
  if (historyList.value.length > 50) historyList.value.pop()
  localStorage.setItem('testHistory', JSON.stringify(historyList.value))
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const viewDetail = (item) => {
  currentItem.value = item
  showDetail.value = true
}

const clearHistory = () => {
  if (confirm('确定要清空所有测算记录吗？')) {
    historyList.value = []
    localStorage.removeItem('testHistory')
  }
}

const retest = () => {
  showDetail.value = false
  showHistory.value = false
  emit('openTool', { id: currentItem.value?.toolId })
}

const shareResult = () => {
  const text = `我在天机命理测了${currentItem.value?.title}，快来看看你的结果！`
  if (navigator.share) {
    navigator.share({ title: '天机命理', text, url: window.location.href })
  } else {
    navigator.clipboard.writeText(text + ' ' + window.location.href)
    alert('已复制分享内容到剪贴板')
  }
}

onMounted(loadHistory)

// 暴露方法供父组件调用
defineExpose({ saveHistory })
</script>

<style scoped>
.history-entry {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--bgCard, rgba(255,255,255,0.06));
  border: 1px solid var(--border, rgba(255,255,255,0.08));
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  margin: 12px 0;
}
.history-entry:hover {
  background: var(--bgCardHover, rgba(255,255,255,0.1));
  border-color: var(--accent, #f59e0b);
}

.entry-icon { font-size: 18px; }
.entry-text { flex: 1; font-size: 14px; color: var(--textPrimary); }
.entry-count {
  background: var(--accent, #f59e0b);
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}
.entry-arrow { color: var(--textMuted); }

/* 弹窗 */
.history-modal, .detail-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.history-content, .detail-content {
  background: var(--bgCard, #1a1a2e);
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.history-header, .detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border, rgba(255,255,255,0.08));
}
.history-header h3, .detail-header h3 { margin: 0; font-size: 16px; color: var(--textPrimary); }
.close-btn { font-size: 24px; color: rgba(255,255,255,0.6); cursor: pointer; }

.history-body, .detail-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

/* 登录提示 */
.login-tip {
  text-align: center;
  padding: 40px 20px;
}
.tip-icon { font-size: 48px; }
.login-tip p { color: var(--textSecondary); margin: 12px 0; }
.login-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border: none;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

/* 历史列表 */
.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 8px;
  background: rgba(255,255,255,0.03);
}
.history-item:hover { background: rgba(255,255,255,0.08); }

.item-left { display: flex; align-items: center; gap: 12px; }
.item-icon { font-size: 24px; }
.item-info { display: flex; flex-direction: column; }
.item-title { font-size: 14px; color: var(--textPrimary); }
.item-desc { font-size: 12px; color: var(--textSecondary); }

.item-right { display: flex; align-items: center; gap: 8px; }
.item-time { font-size: 11px; color: var(--textMuted); }
.item-arrow { color: var(--textMuted); }

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
}
.empty-icon { font-size: 48px; }
.empty-state p { color: var(--textSecondary); margin: 8px 0; }
.empty-tip { font-size: 12px; color: var(--textMuted); }

/* 底部 */
.history-footer, .detail-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border, rgba(255,255,255,0.08));
  display: flex;
  gap: 12px;
}

.clear-btn {
  flex: 1;
  padding: 10px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--textSecondary);
  cursor: pointer;
}

/* 详情 */
.detail-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--textSecondary);
  margin-bottom: 16px;
}

.detail-result {
  font-size: 14px;
  line-height: 1.7;
  color: var(--textPrimary);
  padding: 16px;
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  white-space: pre-wrap;
}

.retest-btn, .share-btn {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  border: none;
}
.retest-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
}
.share-btn {
  background: rgba(255,255,255,0.08);
  color: var(--textPrimary);
  border: 1px solid var(--border);
}

@media (max-width: 768px) {
  .history-modal, .detail-modal { padding: 10px; align-items: flex-end; }
  .history-content, .detail-content { 
    max-height: 85vh;
    border-radius: 20px 20px 0 0;
  }
}
</style>
