<template>
  <div class="articles-management">
    <div class="page-header">
      <h2>文章管理</h2>
      <el-button type="primary" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        新建文章
      </el-button>
    </div>

    <!-- 搜索筛选 -->
    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="标题">
          <el-input v-model="searchForm.title" placeholder="请输入文章标题" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.categoryId" placeholder="请选择分类" clearable>
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="草稿" :value="0" />
            <el-option label="已发布" :value="1" />
            <el-option label="已下线" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchArticles">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 文章列表 -->
    <div class="table-section">
      <el-table :data="articles" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column prop="author" label="作者" width="100" />
        <el-table-column prop="viewCount" label="浏览量" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="editArticle(row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="row.status === 1 ? 'warning' : 'success'"
              @click="toggleStatus(row)"
            >
              {{ row.status === 1 ? '下线' : '发布' }}
            </el-button>
            <el-button size="small" type="danger" @click="deleteArticle(row)">删除</el-button>
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

    <!-- 创建/编辑文章弹窗 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingArticle ? '编辑文章' : '新建文章'"
      width="80%"
      destroy-on-close
    >
      <el-form :model="articleForm" :rules="articleRules" ref="articleFormRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="articleForm.categoryId" placeholder="请选择分类">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="articleForm.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input
            v-model="articleForm.summary"
            type="textarea"
            :rows="3"
            placeholder="请输入文章摘要"
          />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="articleForm.content"
            type="textarea"
            :rows="10"
            placeholder="请输入文章内容"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="articleForm.status">
            <el-radio label="draft">草稿</el-radio>
            <el-radio label="published">发布</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="saveArticle" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 获取当前实例
const { proxy } = getCurrentInstance()

// 响应式数据
const loading = ref(false)
const saving = ref(false)
const showCreateDialog = ref(false)
const editingArticle = ref(null)
const articleFormRef = ref()

// 搜索表单
const searchForm = reactive({
  title: '',
  categoryId: '',
  status: ''
})

// 文章表单
const articleForm = reactive({
  title: '',
  categoryId: '',
  author: '',
  summary: '',
  content: '',
  status: 0
})

// 表单验证规则
const articleRules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
}

// 数据
const articles = ref([])
const categories = ref([])

// 分页
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

// 方法
const loadArticles = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      size: pagination.size,
    }

    if (searchForm.title) params.title = searchForm.title
    if (searchForm.categoryId) params.categoryId = searchForm.categoryId
    if (searchForm.status !== '' && searchForm.status !== null && searchForm.status !== undefined) {
      params.status = searchForm.status
    }

    const res = await proxy.$api.articles.getList(params)
    if (res?.code === 200) {
      articles.value = res.data.records || []
      pagination.total = res.data.total || 0
    } else {
      ElMessage.error(res?.msg || '加载文章列表失败')
    }
  } catch (error) {
    ElMessage.error('加载文章列表失败')
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    categories.value = []
  } catch (error) {
    ElMessage.error('加载分类列表失败')
  }
}

const searchArticles = () => {
  pagination.current = 1
  loadArticles()
}

const resetSearch = () => {
  Object.assign(searchForm, {
    title: '',
    categoryId: '',
    status: ''
  })
  searchArticles()
}

const editArticle = (article) => {
  editingArticle.value = article
  Object.assign(articleForm, {
    ...article,
    categoryId: article.categoryId
  })
  showCreateDialog.value = true
}

const saveArticle = async () => {
  try {
    await articleFormRef.value.validate()
    saving.value = true
    
    if (editingArticle.value) {
      const res = await proxy.$api.articles.update(editingArticle.value.id, articleForm)
      if (res?.code === 200) {
        ElMessage.success('文章更新成功')
      } else {
        ElMessage.error(res?.msg || '文章更新失败')
      }
    } else {
      const res = await proxy.$api.articles.create(articleForm)
      if (res?.code === 200) {
        ElMessage.success('文章创建成功')
      } else {
        ElMessage.error(res?.msg || '文章创建失败')
      }
    }
    
    showCreateDialog.value = false
    resetForm()
    loadArticles()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('保存失败')
    }
  } finally {
    saving.value = false
  }
}

const toggleStatus = async (article) => {
  try {
    const nextStatus = article.status === 1 ? 2 : 1
    const res = await proxy.$api.articles.update(article.id, { ...article, status: nextStatus })
    if (res?.code === 200) {
      ElMessage.success('状态更新成功')
      await loadArticles()
    } else {
      ElMessage.error(res?.msg || '状态更新失败')
    }
  } catch (error) {
    ElMessage.error('状态更新失败')
  }
}

const deleteArticle = async (article) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？删除后不可恢复。', '确认删除', {
      type: 'warning'
    })
    
    const res = await proxy.$api.articles.delete(article.id)
    if (res?.code === 200) {
      ElMessage.success('删除成功')
      await loadArticles()
    } else {
      ElMessage.error(res?.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const resetForm = () => {
  editingArticle.value = null
  Object.assign(articleForm, {
    title: '',
    categoryId: '',
    author: '',
    summary: '',
    content: '',
    status: 'draft'
  })
  articleFormRef.value?.resetFields()
}

const handleSizeChange = (size) => {
  pagination.size = size
  loadArticles()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  loadArticles()
}

const getStatusType = (status) => {
  const types = {
    published: 'success',
    draft: 'warning',
    offline: 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    published: '已发布',
    draft: '草稿',
    offline: '已下线'
  }
  return texts[status] || '未知'
}

const formatTime = (time) => {
  return new Date(time).toLocaleString()
}

// 生命周期
onMounted(() => {
  loadArticles()
  loadCategories()
})
</script>

<style scoped>
.articles-management {
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

.search-section {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.search-form {
  margin: 0;
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

.el-dialog__body {
  padding: 20px;
}
</style>
