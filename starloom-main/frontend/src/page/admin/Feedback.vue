<template>
  <div class="feedback-management">
    <div class="page-header">
      <h2>反馈管理</h2>
      <div class="header-actions">
        <el-button @click="exportFeedback">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
        <el-button type="primary" @click="loadFeedback">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 搜索筛选 -->
    <div v-if="!isMobile" class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="反馈类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="问题反馈" value="feedback" />
            <el-option label="功能建议" value="suggestion" />
            <el-option label="问题反馈" value="bug" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待处理" :value="0" />
            <el-option label="处理中" :value="1" />
            <el-option label="已解决" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFeedback">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-else class="mobile-toolbar">
      <el-tabs v-model="mobileStatusTab" class="mobile-tabs" @tab-change="onMobileStatusTabChange">
        <el-tab-pane label="待处理" name="0" />
        <el-tab-pane label="处理中" name="1" />
        <el-tab-pane label="已解决" name="2" />
        <el-tab-pane label="全部" name="" />
      </el-tabs>
      <div class="mobile-actions">
        <el-button size="small" @click="mobileFilterOpen = true">筛选</el-button>
        <el-button size="small" type="primary" @click="loadFeedback">刷新</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ stats.total }}</div>
              <div class="stats-label">总反馈数</div>
            </div>
            <el-icon class="stats-icon" color="#409EFF"><Document /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ stats.pending }}</div>
              <div class="stats-label">待处理</div>
            </div>
            <el-icon class="stats-icon" color="#E6A23C"><Clock /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ stats.processing }}</div>
              <div class="stats-label">处理中</div>
            </div>
            <el-icon class="stats-icon" color="#F56C6C"><Loading /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ stats.resolved }}</div>
              <div class="stats-label">已解决</div>
            </div>
            <el-icon class="stats-icon" color="#67C23A"><CircleCheck /></el-icon>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 反馈列表 -->
    <div class="table-section">
      <el-table v-if="!isMobile" :data="feedback" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)">
              {{ getTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="150" show-overflow-tooltip />
        <el-table-column prop="content" label="内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="username" label="用户" width="100" />
        <el-table-column prop="contact" label="联系方式" width="120" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间" width="160">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewFeedback(row)">查看</el-button>
            <el-button 
              size="small" 
              type="primary" 
              @click="updateStatus(row)"
              :disabled="row.status === 2 || row.status === 3"
            >
              处理
            </el-button>
            <el-button size="small" type="danger" @click="deleteFeedback(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-else class="mobile-list" v-loading="loading">
        <el-empty v-if="!feedback || feedback.length === 0" description="暂无反馈" />
        <el-card v-for="row in feedback" :key="row.id" class="feedback-card" shadow="never">
          <div class="feedback-card-header">
            <el-tag size="small" :type="getTypeColor(row.type)">{{ getTypeText(row.type) }}</el-tag>
            <el-tag size="small" :type="getStatusColor(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </div>
          <div class="feedback-card-body">
            <div class="line">
              <span class="label">用户</span>
              <span class="value">{{ row.username || '-' }}</span>
            </div>
            <div class="line">
              <span class="label">时间</span>
              <span class="value">{{ formatTime(row.createTime) }}</span>
            </div>
            <div class="content">{{ row.content }}</div>
          </div>
          <div class="feedback-card-actions">
            <el-button size="small" @click="viewFeedback(row)">查看</el-button>
            <el-button
              size="small"
              type="primary"
              @click="updateStatus(row)"
              :disabled="row.status === 2 || row.status === 3"
            >
              处理
            </el-button>
            <el-button size="small" type="danger" @click="deleteFeedback(row)">删除</el-button>
          </div>
        </el-card>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 查看反馈详情弹窗 -->
    <el-dialog
      v-model="showDetailDialog"
      title="反馈详情"
      width="60%"
      :fullscreen="isMobile"
      destroy-on-close
    >
      <div v-if="currentFeedback" class="feedback-detail">
        <el-descriptions :column="isMobile ? 1 : 2" border>
          <el-descriptions-item label="反馈ID">{{ currentFeedback.id }}</el-descriptions-item>
          <el-descriptions-item label="类型">
            <el-tag :type="getTypeColor(currentFeedback.type)">
              {{ getTypeText(currentFeedback.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="标题">{{ currentFeedback.title }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusColor(currentFeedback.status)">
              {{ getStatusText(currentFeedback.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="用户">{{ currentFeedback.username }}</el-descriptions-item>
          <el-descriptions-item label="联系方式">{{ currentFeedback.contact }}</el-descriptions-item>
          <el-descriptions-item label="提交时间" :span="2">
            {{ formatTime(currentFeedback.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="反馈内容" :span="2">
            <div class="feedback-content">{{ currentFeedback.content }}</div>
          </el-descriptions-item>
          <el-descriptions-item v-if="currentFeedback.reply" label="回复内容" :span="2">
            <div class="feedback-reply">{{ currentFeedback.reply }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
        <el-button 
          v-if="currentFeedback && currentFeedback.status !== 2 && currentFeedback.status !== 3"
          type="primary" 
          @click="showReplyDialog = true"
        >
          回复
        </el-button>
      </template>
    </el-dialog>

    <!-- 回复反馈弹窗 -->
    <el-dialog
      v-model="showReplyDialog"
      title="回复反馈"
      width="50%"
      :fullscreen="isMobile"
      destroy-on-close
    >
      <el-form :model="replyForm" :rules="replyRules" ref="replyFormRef" label-width="80px">
        <el-form-item label="状态" prop="status">
          <el-select v-model="replyForm.status" placeholder="请选择状态">
            <el-option label="处理中" :value="1" />
            <el-option label="已解决" :value="2" />
            <el-option label="已关闭" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="回复内容" prop="reply">
          <el-input
            v-model="replyForm.reply"
            type="textarea"
            :rows="6"
            placeholder="请输入回复内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showReplyDialog = false">取消</el-button>
        <el-button type="primary" @click="submitReply" :loading="replying">提交</el-button>
      </template>
    </el-dialog>
  </div>

  <el-drawer v-model="mobileFilterOpen" title="筛选" direction="btt" size="70%" destroy-on-close>
    <el-form :model="searchForm" label-width="80px">
      <el-form-item label="类型">
        <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
          <el-option label="问题反馈" value="feedback" />
          <el-option label="功能建议" value="suggestion" />
          <el-option label="问题反馈" value="bug" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
          <el-option label="待处理" :value="0" />
          <el-option label="处理中" :value="1" />
          <el-option label="已解决" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户">
        <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="resetSearch">重置</el-button>
        <el-button type="primary" @click="applyMobileFilter">应用</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, Refresh, Document, Clock, Loading, CircleCheck } from '@element-plus/icons-vue'

// 获取当前实例
const { proxy } = getCurrentInstance()

const isMobile = ref(false)
const mobileFilterOpen = ref(false)
const mobileStatusTab = ref('0')

const updateIsMobile = () => {
  if (typeof window === 'undefined') return
  isMobile.value = window.innerWidth <= 768
}

// 响应式数据
const loading = ref(false)
const replying = ref(false)
const showDetailDialog = ref(false)
const showReplyDialog = ref(false)
const currentFeedback = ref(null)
const replyFormRef = ref()

// 搜索表单
const searchForm = reactive({
  type: '',
  status: '',
  username: '',
  dateRange: []
})

// 回复表单
const replyForm = reactive({
  status: '',
  reply: ''
})

// 表单验证规则
const replyRules = {
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  reply: [{ required: true, message: '请输入回复内容', trigger: 'blur' }]
}

// 数据
const feedback = ref([])

// 统计数据
const stats = reactive({
  total: 0,
  pending: 0,
  processing: 0,
  resolved: 0
})

// 分页
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

// 方法
const loadFeedback = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      size: pagination.size
    }

    if (searchForm.type) {
      params.type = searchForm.type
    }
    if (searchForm.status !== '' && searchForm.status !== null && searchForm.status !== undefined) {
      params.status = Number(searchForm.status)
    }
    if (searchForm.username) {
      params.keyword = searchForm.username
    }

    const res = await proxy.$api.feedback.list(params)
    const records = res.data.records || []
    feedback.value = records.map(item => ({
      ...item,
      username: item.nickname,
      title: item.content ? String(item.content).slice(0, 20) : ''
    }))
    pagination.total = res.data.total || 0
    updateStats()
  } catch (error) {
    ElMessage.error('加载反馈列表失败')
  } finally {
    loading.value = false
  }
}

const onMobileStatusTabChange = (name) => {
  mobileStatusTab.value = name
  searchForm.status = name === '' ? '' : Number(name)
  pagination.current = 1
  loadFeedback()
}

const applyMobileFilter = () => {
  mobileFilterOpen.value = false
  pagination.current = 1
  loadFeedback()
}

const updateStats = () => {
  stats.total = pagination.total
  stats.pending = feedback.value.filter(item => item.status === 0).length
  stats.processing = feedback.value.filter(item => item.status === 1).length
  stats.resolved = feedback.value.filter(item => item.status === 2).length
}

const searchFeedback = () => {
  pagination.current = 1
  loadFeedback()
}

const resetSearch = () => {
  Object.assign(searchForm, {
    type: '',
    status: '',
    username: '',
    dateRange: []
  })
  searchFeedback()
}

const viewFeedback = (item) => {
  currentFeedback.value = item
  showDetailDialog.value = true
}

const updateStatus = (item) => {
  currentFeedback.value = item
  replyForm.status = item.status === 0 ? 1 : 2
  replyForm.reply = item.reply || ''
  showReplyDialog.value = true
}

const submitReply = async () => {
  try {
    await replyFormRef.value.validate()
    replying.value = true
    
    await proxy.$api.feedback.reply(currentFeedback.value.id, {
      status: parseInt(replyForm.status),
      reply: replyForm.reply
    })
    
    ElMessage.success('回复提交成功')
    showReplyDialog.value = false
    showDetailDialog.value = false
    loadFeedback()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('提交失败')
    }
  } finally {
    replying.value = false
  }
}

const deleteFeedback = async (item) => {
  try {
    await ElMessageBox.confirm('确定要删除这条反馈吗？删除后不可恢复。', '确认删除', {
      type: 'warning'
    })
    
    await proxy.$api.feedback.delete(item.id)
    
    ElMessage.success('删除成功')
    loadFeedback()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const exportFeedback = async () => {
  try {
    const params = {
      format: 'xlsx'
    }
    if (searchForm.type) {
      params.type = searchForm.type
    }
    if (searchForm.status !== '' && searchForm.status !== null && searchForm.status !== undefined) {
      params.status = Number(searchForm.status)
    }
    if (searchForm.username) {
      params.keyword = searchForm.username
    }

    await proxy.$api.feedback.export({
      ...params,
      format: 'xlsx'
    })
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

const handleSizeChange = (size) => {
  pagination.size = size
  loadFeedback()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  loadFeedback()
}

const getTypeColor = (type) => {
  const colors = {
    suggestion: 'success',
    bug: 'danger',
    question: 'warning',
    other: 'info'
  }
  return colors[type] || 'info'
}

const getTypeText = (type) => {
  const texts = {
    suggestion: '功能建议',
    bug: '问题反馈',
    question: '使用咨询',
    other: '其他'
  }
  return texts[type] || '未知'
}

const getStatusColor = (status) => {
  const colors = {
    0: 'warning',
    1: 'danger',
    2: 'success',
    3: 'info'
  }
  return colors[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    0: '待处理',
    1: '处理中',
    2: '已解决',
    3: '已关闭'
  }
  return texts[status] || '未知'
}

const formatTime = (time) => {
  return new Date(time).toLocaleString()
}

// 生命周期
onMounted(() => {
  updateIsMobile()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateIsMobile)
  }
  loadFeedback()
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateIsMobile)
  }
})
</script>

<style scoped>
.feedback-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.search-section {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.search-form {
  margin: 0;
}

.mobile-toolbar {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.mobile-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.mobile-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feedback-card {
  border: 1px solid #ebeef5;
}

.feedback-card-header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.feedback-card-body .line {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
}

.feedback-card-body .label {
  color: #909399;
}

.feedback-card-body .value {
  color: #303133;
  text-align: right;
}

.feedback-card-body .content {
  margin-top: 8px;
  color: #303133;
  line-height: 1.6;
}

.feedback-card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .feedback-management {
    padding: 12px;
  }

  .stats-section :deep(.el-col) {
    flex: 0 0 50%;
    max-width: 50%;
    margin-bottom: 12px;
  }

  .stats-card :deep(.el-card__body) {
    padding: 12px;
  }

  .stats-card {
    cursor: pointer;
  }

  .stats-card:active {
    transform: scale(0.99);
  }

  .stats-content {
    text-align: center;
  }

  .stats-icon {
    display: none;
  }

  .stats-number {
    font-size: 22px;
  }

  .stats-label {
    font-size: 12px;
    white-space: nowrap;
    word-break: keep-all;
  }

  .table-section {
    padding: 12px;
  }
}

.stats-section {
  margin-bottom: 20px;
}

.stats-card {
  position: relative;
  overflow: hidden;
}

.stats-content {
  position: relative;
  z-index: 2;
}

.stats-number {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stats-label {
  font-size: 14px;
  color: #909399;
}

.stats-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 40px;
  opacity: 0.3;
  z-index: 1;
}

.table-section {
  background: white;
  border-radius: 4px;
  padding: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.feedback-detail {
  margin-bottom: 20px;
}

.feedback-content,
.feedback-reply {
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  line-height: 1.6;
}

.el-dialog__body {
  padding: 20px;
}
</style>
