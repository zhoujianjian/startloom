import axios from 'axios'

const getAdminToken = () => {
  const raw = localStorage.getItem('starloomAI-token')
  if (!raw) return ''
  if (raw.trim().startsWith('{')) {
    try {
      const obj = JSON.parse(raw)
      return obj.adminToken || ''
    } catch (e) {
      return ''
    }
  }
  return ''
}

// 创建axios实例
const adminApi = axios.create({
  baseURL: '/sysAdmApi',
  timeout: 10000
})

// 请求拦截器 - 添加token
adminApi.interceptors.request.use(
  config => {
    const token = getAdminToken()
    console.log('� AdminAPI请求:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      token: token ? token.substring(0, 20) + '...' : 'null',
      headers: config.headers
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('✅ 管理后台token已设置:', {
        Authorization: `Bearer ${token.substring(0, 20)}...`
      });
    } else {
      console.log('⚠️ 管理后台请求无token');
    }
    
    // 添加X-Real-IP请求头（后端需要）
    config.headers['X-Real-IP'] = '127.0.0.1'
    
    console.log('📤 管理后台发送请求:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    
    return config
  },
  error => {
    console.error('❌ 管理后台请求拦截器错误:', error);
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
adminApi.interceptors.response.use(
  response => {
    console.log('📨 AdminAPI响应:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    })
    return response.data
  },
  error => {
    console.error('💥 AdminAPI错误:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      console.log('401错误，清除admin token并跳转登录页')
      // token过期，跳转到登录页
      const raw = localStorage.getItem('starloomAI-token')
      if (raw && raw.trim().startsWith('{')) {
        try {
          const obj = JSON.parse(raw)
          delete obj.adminToken
          localStorage.setItem('starloomAI-token', JSON.stringify(obj))
        } catch (e) {
          localStorage.removeItem('starloomAI-token')
        }
      } else {
        localStorage.removeItem('starloomAI-token')
      }
      window.location.href = '/sysAdm/login'
    }
    return Promise.reject(error)
  }
)

// 管理员认证
export const adminAuth = {
  // 登录
  login: (credentials) => adminApi.post('/login', credentials),
  
  // 获取当前用户信息
  getCurrentUser: () => adminApi.get('/profile')
}

// 用户管理
export const users = {
  // 获取用户列表
  getList: (params) => adminApi.get('/users', { params }),
  
  // 获取用户详情
  getDetail: (id) => adminApi.get(`/users/${id}`),
  
  // 更新用户
  update: (id, data) => adminApi.put(`/users/${id}`, data),
  
  // 设置用户角色
  setRole: (id, role) => adminApi.post(`/users/${id}/role`, { role }),
  
  // 设置VIP等级
  setVip: (id, data) => adminApi.post(`/users/${id}/vip`, data),
  
  // 禁用用户
  disable: (id) => adminApi.post(`/users/${id}/disable`),
  
  // 启用用户
  enable: (id) => adminApi.post(`/users/${id}/enable`),
  
  // 获取用户统计
  getStats: () => adminApi.get('/users/stats')
}

// 文章管理
export const articles = {
  // 获取文章列表
  getList: (params) => adminApi.get('/articles', { params }),
  
  // 获取文章详情
  getDetail: (id) => adminApi.get(`/articles/${id}`),
  
  // 创建文章
  create: (data) => adminApi.post('/articles', data),
  
  // 更新文章
  update: (id, data) => adminApi.put(`/articles/${id}`, data),
  
  // 删除文章
  delete: (id) => adminApi.delete(`/articles/${id}`),
}

// 订单管理
export const orders = {
  // 获取订单列表
  list: (params) => adminApi.get('/orders/list', { params }),
  
  // 获取订单详情
  getDetail: (id) => adminApi.get(`/orders/${id}`),
  
  // 确认订单
  confirm: (id, data) => adminApi.post(`/orders/${id}/confirm`, data),

  // 取消订单
  cancel: (id, data) => adminApi.post(`/orders/${id}/cancel`, data),

  // 退款订单
  refund: (id, data) => adminApi.post(`/orders/${id}/refund`, data),
  
  // 完成订单
  complete: (id) => adminApi.post(`/orders/${id}/complete`),
  
  // 导出订单
  export: (params) => adminApi.get('/orders/export', { params }),
  
  // 获取订单统计
  getStats: () => adminApi.get('/stats/orders'),
  
  // 获取订单趋势
  getTrendStats: (params) => adminApi.get('/stats/order-trend', { params })
}

// 反馈管理
export const feedback = {
  // 获取反馈列表
  list: (params) => adminApi.get('/feedback', { params }),
  
  // 获取反馈详情
  getDetail: (id) => adminApi.get(`/feedback/${id}`),
  
  // 回复反馈
  reply: (id, data) => adminApi.post(`/feedback/${id}/reply`, data),
  
  // 更新反馈状态
  updateStatus: (id, status) => adminApi.put(`/feedback/${id}/status`, { status }),
  
  // 删除反馈
  delete: (id) => adminApi.delete(`/feedback/${id}`),
  
  // 导出反馈
  export: (params) => adminApi.get('/feedback/export', { params }),
  
  // 批量操作
  batchUpdate: (data) => adminApi.post('/feedback/batch', data)
}

// 数据分析
export const analytics = {
  // 仪表板数据
  getDashboard: () => adminApi.get('/dashboard'),
  
  // 页面访问统计
  getPageViews: (params) => adminApi.get('/stats/pageviews', { params }),
  
  // 热门页面
  getTopPages: (params) => adminApi.get('/stats/top-pages', { params }),
  
  // 设备统计
  getDeviceStats: (params) => adminApi.get('/stats/devices', { params }),
  
  // 行为统计
  getBehaviorStats: (params) => adminApi.get('/stats/behaviors', { params }),
  
  // 按小时活动统计
  getHourlyActivity: (params) => adminApi.get('/stats/hourly-activity', { params }),
  
  // 实时活动
  getActivities: () => adminApi.get('/realtime/activities'),

  // 实时指标
  getRealTimeMetrics: () => adminApi.get('/realtime/metrics'),
  
  // 在线用户
  getOnlineUsers: () => adminApi.get('/online-users'),
  
  // 在线用户数量
  getOnlineUserCount: () => adminApi.get('/online-users/count')
}

// 系统设置
export const settings = {
  // 获取设置
  get: (key) => adminApi.get(`/settings/${key}`),
  
  // 更新设置
  update: (key, data) => adminApi.put(`/settings/${key}`, data),
  
  // 获取所有设置
  getAll: () => adminApi.get('/settings'),
  
  // 批量更新设置
  batchUpdate: (data) => adminApi.post('/settings/batch', data),
  
  // 测试邮件发送
  testEmail: (data) => adminApi.post('/settings/test-email', data)
}

export const sysConfig = {
  getList: (params) => adminApi.get('/config/list', { params }),
  getDetail: (id) => adminApi.get(`/config/${id}`),
  create: (data) => adminApi.post('/config', data),
  update: (id, data) => adminApi.put(`/config/${id}`, data),
}

export const products = {
  getList: (params) => adminApi.get('/products/list', { params }),
  getDetail: (id) => adminApi.get(`/products/${id}`),
  create: (data) => adminApi.post('/products', data),
  update: (id, data) => adminApi.put(`/products/${id}`, data),
  setStatus: (id, status) => adminApi.post(`/products/${id}/status`, { status }),
}

export default adminApi
