<template>
  <div class="inline-login-container">
    <div class="debug-panel">
      <h3>🔍 调试信息</h3>
      <div class="debug-info">
        <p><strong>当前URL:</strong> {{ currentUrl }}</p>
        <p><strong>Token存在:</strong> {{ !!token }}</p>
        <p><strong>Token内容:</strong> {{ token ? token.substring(0, 30) + '...' : '无' }}</p>
        <p><strong>Store状态:</strong> {{ storeState }}</p>
        <p><strong>LocalStorage键:</strong> {{ localStorageKeys }}</p>
      </div>
    </div>

    <div class="login-box">
      <div class="login-header">
        <h1>StarLoom 管理后台 - 调试版</h1>
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

      <div class="debug-actions">
        <button @click="testToken" class="debug-btn">测试Token</button>
        <button @click="clearToken" class="debug-btn">清除Token</button>
        <button @click="checkAuth" class="debug-btn">检查认证</button>
        <button @click="goToDashboard" class="debug-btn">直接跳转仪表板</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AdminInlineLogin',
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
      localStorageKeys: [],
      storeState: {}
    }
  },
  methods: {
    async handleLogin() {
      console.log('🚀 内联登录开始:', {
        username: this.loginForm.username,
        password: this.loginForm.password ? '***' : 'empty',
        timestamp: new Date().toISOString()
      })
      
      this.loading = true
      this.errorMessage = ''
      
      try {
        console.log('📞 调用登录API...')
        
        // 直接使用 axios 调用 API
        const response = await axios.post('/api/userLogin', this.loginForm, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        console.log('📨 登录API响应:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers
        })
        
        if (response.data.code === 200) {
          const { user_token, user_id, account, isAdmin } = response.data.data
          
          console.log('✅ 登录成功:', {
            hasToken: !!user_token,
            token: user_token ? user_token.substring(0, 20) + '...' : 'null',
            user_id,
            account,
            isAdmin
          })
          
          // 保存token
          localStorage.setItem('starloomAI-token', user_token)
          console.log('💾 token已保存到localStorage')
          
          // 验证token
          const savedToken = localStorage.getItem('starloomAI-token')
          console.log('🔍 验证保存的token:', {
            hasSavedToken: !!savedToken,
            tokenMatch: savedToken === user_token,
            savedToken: savedToken ? savedToken.substring(0, 20) + '...' : 'null'
          })
          
          // 更新store
          this.$store.commit('setAdminUser', response.data.data)
          this.$store.commit('setLoginStatus', true)
          
          console.log('🔄 准备跳转到仪表板...')
          this.$router.push('/sysAdm/dashboard')
        } else {
          console.log('❌ 登录失败:', response.data)
          this.errorMessage = response.data.message || '登录失败'
        }
      } catch (error) {
        console.error('💥 登录异常:', {
          message: error.message,
          name: error.name,
          response: error.response ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
          } : 'no response'
        })
        this.errorMessage = error.response?.data?.message || '网络错误，请重试'
      } finally {
        this.loading = false
        this.updateDebugInfo()
      }
    },

    async testToken() {
      console.log('🧪 测试Token有效性...')
      try {
        const response = await axios.get('/api/checkLogin', {
          headers: {
            'Authorization': this.token
          }
        })
        console.log('✅ Token测试结果:', response.data)
        alert('Token有效: ' + JSON.stringify(response.data))
      } catch (error) {
        console.error('❌ Token测试失败:', error.response?.data || error.message)
        alert('Token无效: ' + (error.response?.data?.message || error.message))
      }
    },

    clearToken() {
      console.log('🗑️ 清除Token')
      localStorage.removeItem('starloomAI-token')
      this.updateDebugInfo()
      alert('Token已清除')
    },

    async checkAuth() {
      console.log('🔍 检查认证状态')
      try {
        const response = await axios.get('/sysAdm/profile', {
          headers: {
            'Authorization': 'Bearer ' + this.token
          }
        })
        console.log('✅ 认证检查结果:', response.data)
        alert('认证成功: ' + JSON.stringify(response.data))
      } catch (error) {
        console.error('❌ 认证检查失败:', error.response?.data || error.message)
        alert('认证失败: ' + (error.response?.data?.message || error.message))
      }
    },

    goToDashboard() {
      console.log('🚀 直接跳转到仪表板')
      this.$router.push('/sysAdm/dashboard')
    },

    updateDebugInfo() {
      this.currentUrl = window.location.href
      this.token = localStorage.getItem('starloomAI-token')
      this.localStorageKeys = Object.keys(localStorage)
      this.storeState = {
        adminUser: this.$store.state.adminUser,
        loginStatus: this.$store.state.loginStatus,
        adminToken: this.$store.state.adminToken
      }
    }
  },
  
  created() {
    console.log('🔐 内联登录页面 created')
    this.updateDebugInfo()
    
    // 检查是否已有token
    if (this.token) {
      console.log('✅ 检测到已有token，可以尝试直接访问')
    }
  },
  
  mounted() {
    console.log('🎯 内联登录页面 mounted')
    // 定期更新调试信息
    this.debugInterval = setInterval(() => {
      this.updateDebugInfo()
    }, 2000)
  },
  
  beforeUnmount() {
    if (this.debugInterval) {
      clearInterval(this.debugInterval)
    }
  }
}
</script>

<style scoped>
.inline-login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.debug-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-size: 12px;
  max-width: 300px;
  z-index: 1000;
}

.debug-panel h3 {
  margin: 0 0 10px 0;
  color: #4CAF50;
}

.debug-info p {
  margin: 5px 0;
  word-break: break-all;
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
  margin-top: 10px;
}

.debug-actions {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.debug-btn {
  padding: 8px 12px;
  background: #52c41a;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.debug-btn:hover {
  background: #73d13d;
}

.debug-btn:nth-child(2) {
  background: #ff4d4f;
}

.debug-btn:nth-child(2):hover {
  background: #ff7875;
}

.debug-btn:nth-child(3) {
  background: #faad14;
}

.debug-btn:nth-child(3):hover {
  background: #ffc53d;
}

.debug-btn:nth-child(4) {
  background: #722ed1;
}

.debug-btn:nth-child(4):hover {
  background: #9254de;
}
</style>
