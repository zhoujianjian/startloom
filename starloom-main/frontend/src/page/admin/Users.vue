<template>
  <div class="users-management">
    <!-- 搜索和筛选 -->
    <div class="search-bar">
      <div class="search-input">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索用户名、邮箱、手机号..."
          @input="handleSearch"
        />
      </div>
      <div class="filter-buttons">
        <select v-model="vipFilter" @change="loadUsers">
          <option value="">所有用户</option>
          <option value="0">普通用户</option>
          <option value="1">VIP用户</option>
        </select>
        <select v-model="statusFilter" @change="loadUsers">
          <option value="">所有状态</option>
          <option value="active">活跃</option>
          <option value="inactive">不活跃</option>
        </select>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="users-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>用户信息</th>
            <th>联系方式</th>
            <th>VIP等级</th>
            <th>注册时间</th>
            <th>最后活跃</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>
              <div class="user-info">
                <img v-if="user.avatar" :src="user.avatar" class="avatar" />
                <div v-else class="avatar-placeholder">{{ user.nickname?.[0] || 'U' }}</div>
                <div>
                  <div class="nickname">{{ user.nickname || '未设置' }}</div>
                  <div class="role">{{ user.role || 'user' }}</div>
                </div>
              </div>
            </td>
            <td>
              <div class="contact-info">
                <div v-if="user.email">{{ user.email }}</div>
                <div v-if="user.phone">{{ user.phone }}</div>
                <div v-if="user.wechat">{{ user.wechat }}</div>
              </div>
            </td>
            <td>
              <span class="vip-badge" :class="getVipClass(user.vipLevel)">
                {{ getVipText(user.vipLevel) }}
              </span>
              <div v-if="user.vipExpireTime" class="expire-time">
                {{ formatDate(user.vipExpireTime) }}
              </div>
            </td>
            <td>{{ formatDate(user.createTime) }}</td>
            <td>{{ formatDate(user.updateTime) }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(user)">
                {{ getStatusText(user) }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="viewUser(user)" class="btn-view">查看</button>
                <button @click="editUser(user)" class="btn-edit">编辑</button>
                <button @click="toggleUserStatus(user)" class="btn-toggle">
                  {{ user.deleted ? '启用' : '禁用' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <button 
        @click="prevPage" 
        :disabled="currentPage <= 1"
        class="page-btn"
      >
        上一页
      </button>
      <span class="page-info">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页
      </span>
      <button 
        @click="nextPage" 
        :disabled="currentPage >= totalPages"
        class="page-btn"
      >
        下一页
      </button>
    </div>

    <!-- 用户详情弹窗 -->
    <div v-if="selectedUser" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>用户详情</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="user-detail">
            <div class="detail-item">
              <label>ID:</label>
              <span>{{ selectedUser.id }}</span>
            </div>
            <div class="detail-item">
              <label>昵称:</label>
              <span>{{ selectedUser.nickname || '未设置' }}</span>
            </div>
            <div class="detail-item">
              <label>邮箱:</label>
              <span>{{ selectedUser.email || '未设置' }}</span>
            </div>
            <div class="detail-item">
              <label>手机:</label>
              <span>{{ selectedUser.phone || '未设置' }}</span>
            </div>
            <div class="detail-item">
              <label>微信:</label>
              <span>{{ selectedUser.wechat || '未设置' }}</span>
            </div>
            <div class="detail-item">
              <label>钱包地址:</label>
              <span>{{ selectedUser.walletAddress || '未设置' }}</span>
            </div>
            <div class="detail-item">
              <label>VIP等级:</label>
              <span>{{ getVipText(selectedUser.vipLevel) }}</span>
            </div>
            <div class="detail-item">
              <label>VIP到期时间:</label>
              <span>{{ formatDate(selectedUser.vipExpireTime) || '永久' }}</span>
            </div>
            <div class="detail-item">
              <label>注册时间:</label>
              <span>{{ formatDate(selectedUser.createTime) }}</span>
            </div>
            <div class="detail-item">
              <label>最后更新:</label>
              <span>{{ formatDate(selectedUser.updateTime) }}</span>
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
  name: 'UsersManagement',
  data() {
    return {
      users: [],
      searchQuery: '',
      vipFilter: '',
      statusFilter: '',
      currentPage: 1,
      pageSize: 20,
      totalPages: 1,
      totalUsers: 0,
      selectedUser: null,
      loading: false
    }
  },
  methods: {
    async loadUsers() {
      try {
        const params = {
          page: this.currentPage,
          size: this.pageSize,
          search: this.searchQuery,
          vipLevel: this.vipFilter,
          status: this.statusFilter
        }

        const res = await this.$api.users.getList(params)
        if (res?.code === 200) {
          this.users = res.data.records
          this.totalPages = res.data.pages
          this.totalUsers = res.data.total
        }
      } catch (error) {
        console.error('加载用户列表失败:', error)
        this.users = []
        this.totalPages = 1
        this.totalUsers = 0
      } finally {
        this.loading = false
      }
    },

    handleSearch() {
      this.currentPage = 1
      this.loadUsers()
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.loadUsers()
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.loadUsers()
      }
    },

    viewUser(user) {
      this.selectedUser = user
    },

    editUser(user) {
      console.log('编辑用户:', user)
    },

    async toggleUserStatus(user) {
      try {
        if (user.deleted) {
          await this.$api.users.enable(user.id)
        } else {
          await this.$api.users.disable(user.id)
        }
        this.loadUsers()
      } catch (error) {
        console.error('切换用户状态失败:', error)
      }
    },

    closeModal() {
      this.selectedUser = null
    },

    getVipClass(level) {
      return {
        'vip-0': level === 0,
        'vip-1': level === 1,
        'vip-2': level === 2,
        'vip-3': level === 3
      }
    },

    getVipText(level) {
      const vipLevels = {
        0: '普通用户',
        1: 'VIP1',
        2: 'VIP2', 
        3: 'VIP3'
      }
      return vipLevels[level] || '普通用户'
    },

    getStatusClass(user) {
      return {
        'status-active': !user.deleted,
        'status-inactive': user.deleted
      }
    },

    getStatusText(user) {
      return user.deleted ? '已禁用' : '正常'
    },

    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleString('zh-CN')
    }
  },

  created() {
    this.loadUsers()
  }
}
</script>

<style scoped>
.users-management {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.search-bar {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-input {
  flex: 1;
}

.search-input input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
}

.filter-buttons {
  display: flex;
  gap: 12px;
}

.filter-buttons select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
}

.users-table {
  overflow-x: auto;
}

.users-table table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.users-table th {
  background: #fafafa;
  font-weight: 500;
  color: #262626;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8c8c8c;
}

.nickname {
  font-weight: 500;
  color: #262626;
}

.role {
  font-size: 12px;
  color: #8c8c8c;
}

.contact-info {
  font-size: 14px;
  color: #262626;
}

.contact-info div {
  margin-bottom: 2px;
}

.vip-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.vip-0 { background: #f0f0f0; color: #8c8c8c; }
.vip-1 { background: #e6f7ff; color: #1890ff; }
.vip-2 { background: #f6ffed; color: #52c41a; }
.vip-3 { background: #fff7e6; color: #fa8c16; }

.expire-time {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: #f6ffed;
  color: #52c41a;
}

.status-inactive {
  background: #fff2f0;
  color: #ff4d4f;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-buttons button {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  background: white;
}

.btn-view { color: #1890ff; border-color: #1890ff; }
.btn-edit { color: #fa8c16; border-color: #fa8c16; }
.btn-toggle { color: #ff4d4f; border-color: #ff4d4f; }

.pagination {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  border-top: 1px solid #f0f0f0;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #8c8c8c;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #262626;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #8c8c8c;
}

.modal-body {
  padding: 20px;
}

.user-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-item label {
  width: 120px;
  font-weight: 500;
  color: #262626;
  flex-shrink: 0;
}

.detail-item span {
  color: #595959;
}
</style>
