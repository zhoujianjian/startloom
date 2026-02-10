<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="logo">
        <h2 v-if="!sidebarCollapsed">StarLoom</h2>
        <h2 v-else>SL</h2>
      </div>
      
      <nav class="menu">
        <div class="menu-group" v-if="!sidebarCollapsed">核心概览</div>
        <router-link to="/sysAdm/dashboard" class="menu-item" active-class="active">
          <i class="icon-dashboard"></i>
          <span v-if="!sidebarCollapsed">仪表板</span>
        </router-link>
        <router-link to="/sysAdm/orders" class="menu-item" active-class="active">
          <i class="icon-orders"></i>
          <span v-if="!sidebarCollapsed">订单列表</span>
        </router-link>

        <div class="menu-group" v-if="!sidebarCollapsed">内容与用户</div>
        <router-link to="/sysAdm/users" class="menu-item" active-class="active">
          <i class="icon-users"></i>
          <span v-if="!sidebarCollapsed">用户管理</span>
        </router-link>
        <router-link to="/sysAdm/articles" class="menu-item" active-class="active">
          <i class="icon-articles"></i>
          <span v-if="!sidebarCollapsed">文章管理</span>
        </router-link>
        <router-link to="/sysAdm/feedback" class="menu-item" active-class="active">
          <i class="icon-feedback"></i>
          <span v-if="!sidebarCollapsed">反馈管理</span>
        </router-link>

        <div class="menu-group" v-if="!sidebarCollapsed">增长与运营</div>
        <router-link to="/sysAdm/analytics" class="menu-item" active-class="active">
          <i class="icon-analytics"></i>
          <span v-if="!sidebarCollapsed">数据分析</span>
        </router-link>
        <router-link to="/sysAdm/products" class="menu-item" active-class="active">
          <i class="icon-products"></i>
          <span v-if="!sidebarCollapsed">产品管理</span>
        </router-link>

        <div class="menu-group" v-if="!sidebarCollapsed">系统</div>
        <router-link to="/sysAdm/sys-config" class="menu-item" active-class="active">
          <i class="icon-config"></i>
          <span v-if="!sidebarCollapsed">系统配置</span>
        </router-link>
        <router-link to="/sysAdm/settings" class="menu-item" active-class="active">
          <i class="icon-settings"></i>
          <span v-if="!sidebarCollapsed">基础设置</span>
        </router-link>
      </nav>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 顶部栏 -->
      <header class="header">
        <div class="header-left">
          <button @click="toggleSidebar" class="sidebar-toggle">
            <i class="icon-menu"></i>
          </button>
          <h1>{{ pageTitle }}</h1>
        </div>
        
        <div class="header-right">
          <div class="user-info">
            <span>{{ (adminUser && (adminUser.realName || adminUser.username || adminUser.email)) || '管理员' }}</span>
            <button @click="logout" class="logout-btn">退出</button>
          </div>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AdminLayout',
  computed: {
    ...mapState(['adminUser']),
    pageTitle() {
      return this.$route.meta.title || '管理后台'
    }
  },
  data() {
    return {
      sidebarCollapsed: false
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    logout() {
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
      this.$store.commit('setAdminUser', null)
      this.$router.push('/sysAdm/login')
    }
  },
  created() {}
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
}

.sidebar {
  width: 220px;
  background: #001529;
  color: white;
  transition: width 0.3s;
}

.sidebar.collapsed {
  width: 60px;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #1f1f1f;
}

.logo h2 {
  margin: 0;
  color: #1890ff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.menu {
  padding: 20px 0;
}

.menu-group {
  padding: 10px 20px 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.5px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: all 0.3s;
  font-size: 14px;
}

.menu-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.menu-item.active {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.1);
}

.menu-item i {
  margin-right: 10px;
  font-size: 16px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}

.sidebar-toggle {
  background: none;
  border: none;
  font-size: 18px;
  margin-right: 15px;
  cursor: pointer;
}

.header-left h1 {
  margin: 0;
  font-size: 18px;
  color: #262626;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-btn {
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.collapsed .menu-item span {
  display: none;
}

.collapsed .menu-item {
  justify-content: center;
}

.collapsed .menu-item i {
  margin: 0;
}
</style>
