<template>
  <div class="login-container">
    <!-- 调试面板 -->
    <div class="debug-panel">
      <h4>🔍 调试信息</h4>
      <div class="debug-info">
        <p><strong>URL:</strong> {{ currentUrl }}</p>
        <p><strong>Token:</strong> {{ token ? token.substring(0, 20) + '...' : '无' }}</p>
        <p><strong>时间:</strong> {{ currentTime }}</p>
      </div>
      <div class="debug-actions">
        <button @click="testAPI" class="debug-btn">测试API</button>
        <button @click="clearToken" class="debug-btn">清除Token</button>
        <button @click="forceGoToDashboard" class="debug-btn">强制跳转仪表板</button>
      </div>
    </div>

    <div class="login-box">
      <div class="login-header">
        <h1>StarLoom 管理后台</h1>
        <p>请登录您的管理员账户</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>用户名</label>
          <input 
            v-model="loginForm.username" 
            type="text" 
            placeholder="请输入用户名"
            required
          />
        </div>
        
        <div class="form-group">
          <label>密码</label>
          <input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
            required
          />
        </div>
        
        <button 
          type="submit" 
          class="login-btn"
          :disabled="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AdminLogin',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loading: false,
      errorMessage: '',
      currentUrl: '',
      token: '',
      currentTime: ''
    }
  },
  methods: {
    async testAPI() {
      console.log('🧪 测试API连接...')
      try {
        const raw = localStorage.getItem('starloomAI-token') || ''
        let token = ''
        if (raw.trim().startsWith('{')) {
          try {
            token = JSON.parse(raw).adminToken || ''
          } catch (e) {
            token = ''
          }
        }
        const response = await axios.get('/sysAdmApi/dashboard', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        })
        console.log('✅ API测试成功:', response.data)
        alert('API连接正常')
      } catch (error) {
        console.error('❌ API测试失败:', error.response?.data || error.message)
        alert('API连接失败: ' + (error.response?.data?.message || error.message))
      }
    },

    async checkAuth() {
      console.log('🔍 检查认证状态')
      try {
        const raw = localStorage.getItem('starloomAI-token') || ''
        let token = ''
        if (raw.trim().startsWith('{')) {
          try {
            token = JSON.parse(raw).adminToken || ''
          } catch (e) {
            token = ''
          }
        }
        const response = await axios.get('/sysAdmApi/dashboard', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        })
        console.log('✅ 认证检查结果:', response.data)
        alert('认证成功: ' + JSON.stringify(response.data))
      } catch (error) {
        console.error('❌ 认证检查失败:', error.response?.data || error.message)
        alert('认证失败: ' + (error.response?.data?.message || error.message))
      }
    },

    clearToken() {
      console.log('🗑️ 清除Token')
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
      this.updateDebugInfo()
      alert('Token已清除')
    },

    forceGoToDashboard() {
      console.log('🚀 强制跳转到仪表板')
      console.log('当前状态:', {
        hasToken: !!this.token,
        token: this.token ? this.token.substring(0, 20) + '...' : 'null',
        storeAdminUser: this.$store.state.adminUser
      })
      
      // 强制跳转
      window.location.href = '/sysAdm/dashboard'
    },

    updateDebugInfo() {
      this.currentUrl = window.location.href
      const raw = localStorage.getItem('starloomAI-token') || ''
      if (raw.trim().startsWith('{')) {
        try {
          this.token = JSON.parse(raw).adminToken || ''
        } catch (e) {
          this.token = ''
        }
      } else {
        this.token = ''
      }
      this.currentTime = new Date().toLocaleTimeString()
    },

    async handleLogin() {
      console.log('🚀 开始管理员登录:', {
        username: this.loginForm.username,
        password: this.loginForm.password ? '***' : 'empty',
        timestamp: new Date().toISOString()
      })
      
      this.loading = true
      this.errorMessage = ''
      
      try {
        console.log('📞 调用登录API...');
        const response = await axios.post('/sysAdmApi/login', this.loginForm, {
          headers: {
            'Content-Type': 'application/json',
            'X-Real-IP': '127.0.0.1'
          }
        })
        
        console.log('📨 登录API响应:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers
        })
        
        if (response.data.code === 200) {
          const token = response.data.data?.token
          const user = response.data.data?.user
          
          console.log('✅ 登录成功:', {
            hasToken: !!token,
            token: token ? token.substring(0, 20) + '...' : 'null',
            isAdmin: user?.isAdmin,
            role: user?.role
          })
          
          if (!token) {
            this.errorMessage = '登录成功但未返回token'
            return
          }

          const prevRaw = localStorage.getItem('starloomAI-token') || ''
          let payload = { userToken: '', adminToken: token }
          if (prevRaw.trim().startsWith('{')) {
            try {
              const prevObj = JSON.parse(prevRaw)
              payload.userToken = prevObj.userToken || ''
            } catch (e) {
              payload.userToken = ''
            }
          } else if (prevRaw) {
            payload.userToken = prevRaw
          }
          localStorage.setItem('starloomAI-token', JSON.stringify(payload))
          console.log('💾 admin token已保存到starloomAI-token')
          
          // 验证token
          const savedToken = token
          console.log('🔍 验证保存的token:', {
            hasSavedToken: !!savedToken,
            tokenMatch: true,
            savedToken: savedToken ? savedToken.substring(0, 20) + '...' : 'null'
          })
          
          // 更新store
          this.$store.commit('setAdminUser', user)
          this.$store.commit('setAdminToken', token)
          
          console.log('🔄 准备跳转到仪表板...')

          setTimeout(() => {
            console.log('🚀 执行跳转到管理后台')
            window.location.href = '/sysAdm/dashboard'
          }, 300)
        } else {
          console.log('❌ 登录失败:', {
            code: response.data.code,
            message: response.data.message,
            data: response.data.data
          })
          this.errorMessage = response.data.message || '登录失败'
        }
      } catch (error) {
        console.error('💥 登录异常:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
          response: error.response ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            headers: error.response.headers
          } : 'no response',
          config: error.config ? {
            url: error.config.url,
            method: error.config.method,
            data: error.config.data
          } : 'no config'
        })
        this.errorMessage = error.response?.data?.message || '网络错误，请重试'
      } finally {
        this.loading = false
        console.log('🏁 登录流程结束，loading状态已重置');
      }
    }
  },
  created() {
    console.log('🔐 管理后台登录页面 created');
    this.updateDebugInfo();
    
    // 检查当前token状态
    const currentToken = localStorage.getItem('starloomAI-token');
    console.log('🔑 当前token状态:', {
      hasToken: !!currentToken,
      token: currentToken ? currentToken.substring(0, 20) + '...' : 'null',
      localStorageKeys: Object.keys(localStorage)
    });
    
    // 检查store状态
    console.log('🏪 Store状态:', {
      adminUser: this.$store.state.adminUser,
      adminToken: this.$store.state.adminToken
    });
    
    // 如果已登录，直接跳转
    if (currentToken) {
      console.log('✅ 检测到已有token，尝试跳转到仪表板');
      this.$router.push('/sysAdm/dashboard').catch(err => {
        console.error('❌ 跳转失败:', err);
      });
    } else {
      console.log('⚠️ 无token，停留在登录页面');
    }
  },
  mounted() {
    console.log('🎯 登录页面mounted');
    this.updateDebugInfo();
    // 定期更新时间
    this.timer = setInterval(() => {
      this.updateDebugInfo();
    }, 1000);
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
</script>

<style scoped>
.debug-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-size: 12px;
  max-width: 250px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.debug-panel h4 {
  margin: 0 0 10px 0;
  color: #4CAF50;
  font-size: 14px;
}

.debug-info p {
  margin: 5px 0;
  word-break: break-all;
}

.debug-actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}

.debug-btn {
  padding: 6px 10px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.debug-btn:hover {
  background: #40a9ff;
}

.debug-btn:nth-child(2) {
  background: #ff4d4f;
}

.debug-btn:nth-child(2):hover {
  background: #ff7875;
}

.debug-btn:nth-child(3) {
  background: #722ed1;
}

.debug-btn:nth-child(3):hover {
  background: #9254de;
}

.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #262626;
  margin: 0 0 10px 0;
  font-size: 24px;
}

.login-header p {
  color: #8c8c8c;
  margin: 0;
  font-size: 14px;
}

.login-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #262626;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn:hover:not(:disabled) {
  background: #40a9ff;
}

.login-btn:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

.error-message {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
}
</style>
