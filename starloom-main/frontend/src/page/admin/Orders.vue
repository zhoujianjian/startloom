<template>
  <div class="orders-management">
    <div class="page-header">
      <h2>订单管理</h2>
      <div class="header-actions">
        <el-button @click="exportOrders">
          <el-icon><Download /></el-icon>
          导出订单
        </el-button>
        <el-button type="primary" @click="loadOrders">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 搜索筛选 -->
    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待支付" :value="0" />
            <el-option label="已支付" :value="1" />
            <el-option label="已取消" :value="2" />
            <el-option label="已退款" :value="3" />
            <el-option label="待确认" :value="10" />
          </el-select>
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
          <el-button type="primary" @click="searchOrders">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ stats.total }}</div>
              <div class="stats-label">总订单数</div>
            </div>
            <el-icon class="stats-icon" color="#409EFF"><Document /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ stats.pending }}</div>
              <div class="stats-label">待支付</div>
            </div>
            <el-icon class="stats-icon" color="#E6A23C"><Clock /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">¥{{ stats.totalRevenue }}</div>
              <div class="stats-label">总收入</div>
            </div>
            <el-icon class="stats-icon" color="#67C23A"><Money /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ stats.todayOrders }}</div>
              <div class="stats-label">今日订单</div>
            </div>
            <el-icon class="stats-icon" color="#F56C6C"><Calendar /></el-icon>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 订单列表 -->
    <div class="table-section">
      <el-table :data="orders" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="orderNo" label="订单号" width="180" show-overflow-tooltip />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="planName" label="商品" min-width="150" show-overflow-tooltip />
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="{ row }">
            <span class="amount">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式" width="100">
          <template #default="{ row }">
            {{ getPaymentMethodText(row.payType || row.payMethod) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewOrder(row)">查看</el-button>
            <el-button 
              v-if="row.status === 10"
              size="small" 
              type="success" 
              @click="confirmPayment(row)"
            >
              确认支付
            </el-button>
            <el-button 
              v-if="[0, 1, 10].includes(row.status)"
              size="small" 
              type="danger" 
              @click="cancelOrder(row)"
            >
              取消订单
            </el-button>
            <el-button 
              v-if="row.status === 1"
              size="small" 
              type="warning" 
              @click="refundOrder(row)"
            >
              退款
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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

    <!-- 订单详情弹窗 -->
    <el-dialog
      v-model="showDetailDialog"
      title="订单详情"
      width="60%"
      destroy-on-close
    >
      <div v-if="currentOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ currentOrder.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusColor(currentOrder.status)">
              {{ getStatusText(currentOrder.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ currentOrder.userId }}</el-descriptions-item>
          <el-descriptions-item label="金额">
            <span class="amount">¥{{ currentOrder.amount }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">
            {{ getPaymentMethodText(currentOrder.payType || currentOrder.payMethod) }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatTime(currentOrder.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item v-if="currentOrder.payTime" label="支付时间">
            {{ formatTime(currentOrder.payTime) }}
          </el-descriptions-item>
          <el-descriptions-item v-if="currentOrder.completeTime" label="完成时间">
            {{ formatTime(currentOrder.completeTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="商品名称" :span="2">{{ currentOrder.planName }}</el-descriptions-item>
          <el-descriptions-item v-if="currentOrder.remark" label="备注" :span="2">
            {{ currentOrder.remark }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
        <el-button 
          v-if="currentOrder && currentOrder.status === 10"
          type="success" 
          @click="confirmPayment(currentOrder)"
        >
          确认支付
        </el-button>
        <el-button 
          v-if="currentOrder && currentOrder.status === 1"
          type="warning" 
          @click="refundOrder(currentOrder)"
        >
          退款
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, Refresh, Document, Clock, Money, Calendar } from '@element-plus/icons-vue'

// 获取当前实例
const { proxy } = getCurrentInstance()

// 响应式数据
const loading = ref(false)
const showDetailDialog = ref(false)
const currentOrder = ref(null)

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  username: '',
  status: '',
  dateRange: []
})

// 数据
const orders = ref([])

// 统计数据
const stats = reactive({
  total: 0,
  pending: 0,
  totalRevenue: 0,
  todayOrders: 0
})

// 分页
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

// 方法
const loadOrders = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      size: pagination.size
    }
    
    // 添加搜索条件
    if (searchForm.orderNo) {
      params.keyword = searchForm.orderNo
    }
    if (searchForm.username) {
      params.keyword = params.keyword ? `${params.keyword},${searchForm.username}` : searchForm.username
    }
    if (searchForm.status !== '') {
      params.status = searchForm.status
    }
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }
    
    const res = await proxy.$api.orders.list(params)
    orders.value = res.data.records || []
    pagination.total = res.data.total || 0
    updateStats()
  } catch (error) {
    ElMessage.error('加载订单列表失败')
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  stats.total = pagination.total
  stats.pending = orders.value.filter(item => item.status === 0 || item.status === 10).length
  stats.totalRevenue = orders.value
    .filter(item => item.status === 1)
    .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
    .toFixed(2)
  
  const today = new Date().toDateString()
  stats.todayOrders = orders.value.filter(item => {
    return new Date(item.createTime).toDateString() === today
  }).length
}

const searchOrders = () => {
  pagination.current = 1
  loadOrders()
}

const resetSearch = () => {
  Object.assign(searchForm, {
    orderNo: '',
    username: '',
    status: '',
    dateRange: []
  })
  searchOrders()
}

const viewOrder = (order) => {
  currentOrder.value = order
  showDetailDialog.value = true
}

const confirmPayment = async (order) => {
  try {
    await ElMessageBox.confirm('确定要确认支付吗？', '确认操作', {
      type: 'warning'
    })
    
    await proxy.$api.orders.confirm(order.id, {
      payType: 'manual'
    })
    
    ElMessage.success('确认支付成功')
    loadOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('确认支付失败')
    }
  }
}

const completeOrder = async (order) => {
  try {
    await ElMessageBox.confirm('确定要完成订单吗？', '确认操作', {
      type: 'warning'
    })
    
    await proxy.$api.orders.complete(order.id)
    
    ElMessage.success('订单完成成功')
    loadOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('订单完成失败')
    }
  }
}

const cancelOrder = async (order) => {
  try {
    await ElMessageBox.confirm('确定要取消订单吗？', '确认操作', {
      type: 'warning'
    })
    
    await proxy.$api.orders.cancel(order.id, {
      reason: '管理员取消'
    })
    
    ElMessage.success('订单取消成功')
    loadOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('订单取消失败')
    }
  }
}

const refundOrder = async (order) => {
  try {
    await ElMessageBox.confirm('确定要退款吗？', '确认操作', {
      type: 'warning'
    })
    
    await proxy.$api.orders.refund(order.id, {
      adminRemark: '管理员退款'
    })
    
    ElMessage.success('退款成功')
    loadOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('退款失败')
    }
  }
}

const exportOrders = async () => {
  try {
    await proxy.$api.orders.export({
      ...searchForm,
      format: 'xlsx'
    })
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

const handleSizeChange = (size) => {
  pagination.size = size
  loadOrders()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  loadOrders()
}

const getStatusColor = (status) => {
  const colors = {
    0: 'warning',
    1: 'success',
    2: 'danger',
    3: 'info',
    4: 'success',
    10: 'warning'
  }
  return colors[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    0: '待支付',
    1: '已支付',
    2: '已取消',
    3: '已退款',
    4: '已完成',
    10: '待确认'
  }
  return texts[status] || '未知'
}

const getPaymentMethodText = (method) => {
  if (!method) return ''
  const texts = {
    alipay: '支付宝',
    wechat: '微信支付',
    weixin: '微信支付',
    bank: '银行卡'
  }
  return texts[method] || '未知'
}

const formatTime = (time) => {
  if (!time) return ''
  const s = typeof time === 'string' ? time.replace(' ', 'T') : time
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return String(time)
  return d.toLocaleString()
}

// 生命周期
onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.orders-management {
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

.amount {
  font-weight: bold;
  color: #67C23A;
}

.order-detail {
  margin-bottom: 20px;
}

.el-dialog__body {
  padding: 20px;
}
</style>
