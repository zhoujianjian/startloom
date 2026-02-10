<template>
  <div class="products-page">
    <div class="page-header">
      <h2>产品管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="openCreate">新增产品</el-button>
        <el-button type="primary" @click="loadList" :loading="loading">刷新</el-button>
      </div>
    </div>

    <el-card>
      <el-form :inline="true" :model="query" class="query-form">
        <el-form-item label="类型">
          <el-input v-model="query.productType" placeholder="例如 master_service" clearable />
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="query.keyword" placeholder="名称/编码" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="全部" clearable>
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="productCode" label="编码" width="160" show-overflow-tooltip />
        <el-table-column prop="name" label="名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="productType" label="类型" width="160" show-overflow-tooltip />
        <el-table-column prop="price" label="价格" width="120" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '上架' : '下架' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="openEdit(row)">编辑</el-button>
            <el-button
              size="small"
              :type="row.status === 1 ? 'warning' : 'success'"
              @click="toggleStatus(row)"
            >
              {{ row.status === 1 ? '下架' : '上架' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="page.current"
          v-model:page-size="page.size"
          :total="page.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <el-alert
        v-if="hint"
        :title="hint"
        type="warning"
        show-icon
        :closable="false"
        style="margin-top: 12px;"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="720px" destroy-on-close>
      <el-form :model="form" label-width="110px">
        <el-form-item label="产品类型" required>
          <el-input v-model="form.productType" placeholder="例如 master_service" />
        </el-form-item>
        <el-form-item label="产品编码" required>
          <el-input v-model="form.productCode" placeholder="唯一编码" />
        </el-form-item>
        <el-form-item label="名称" required>
          <el-input v-model="form.name" placeholder="产品名称" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="form.subtitle" placeholder="可选" />
        </el-form-item>
        <el-form-item label="价格" required>
          <el-input-number v-model="form.price" :min="0" :precision="2" controls-position="right" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="上架">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, computed } from 'vue'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()

const loading = ref(false)
const hint = ref('')

const query = reactive({
  productType: '',
  keyword: '',
  status: undefined,
})

const page = reactive({
  current: 1,
  size: 20,
  total: 0,
})

const list = ref([])

const dialogVisible = ref(false)
const saving = ref(false)
const editingId = ref(null)

const form = reactive({
  productType: '',
  productCode: '',
  name: '',
  subtitle: '',
  price: 0,
  sortOrder: 0,
  status: 1,
})

const dialogTitle = computed(() => (editingId.value ? '编辑产品' : '新增产品'))

const loadList = async () => {
  loading.value = true
  hint.value = ''
  try {
    if (!proxy?.$api?.products?.getList) {
      hint.value = '后端/sysAdm/products接口尚未接入（页面已就绪，可继续补后端接口）'
      list.value = []
      page.total = 0
      return
    }

    const params = {
      page: page.current,
      size: page.size,
    }
    if (query.productType) params.productType = query.productType
    if (query.keyword) params.keyword = query.keyword
    if (query.status !== undefined && query.status !== null && query.status !== '') params.status = query.status

    const res = await proxy.$api.products.getList(params)
    if (res?.code === 200) {
      const data = res.data || {}
      list.value = data.records || []
      page.total = data.total || 0
    } else {
      ElMessage.error(res?.msg || '加载失败')
    }
  } catch (e) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const search = () => {
  page.current = 1
  loadList()
}

const reset = () => {
  query.productType = ''
  query.keyword = ''
  query.status = undefined
  search()
}

const handleSizeChange = (s) => {
  page.size = s
  loadList()
}

const handleCurrentChange = (c) => {
  page.current = c
  loadList()
}

onMounted(() => {
  loadList()
})

const openCreate = () => {
  editingId.value = null
  Object.assign(form, {
    productType: '',
    productCode: '',
    name: '',
    subtitle: '',
    price: 0,
    sortOrder: 0,
    status: 1,
  })
  dialogVisible.value = true
}

const openEdit = (row) => {
  editingId.value = row.id
  Object.assign(form, {
    productType: row.productType || '',
    productCode: row.productCode || '',
    name: row.name || '',
    subtitle: row.subtitle || '',
    price: Number(row.price || 0),
    sortOrder: row.sortOrder ?? 0,
    status: row.status ?? 1,
  })
  dialogVisible.value = true
}

const submit = async () => {
  if (!form.productType || !form.productCode || !form.name) {
    ElMessage.error('产品类型/编码/名称不能为空')
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      const res = await proxy.$api.products.update(editingId.value, { ...form })
      if (res?.code === 200) {
        ElMessage.success('保存成功')
        dialogVisible.value = false
        await loadList()
      } else {
        ElMessage.error(res?.msg || '保存失败')
      }
    } else {
      const res = await proxy.$api.products.create({ ...form })
      if (res?.code === 200) {
        ElMessage.success('新增成功')
        dialogVisible.value = false
        await loadList()
      } else {
        ElMessage.error(res?.msg || '新增失败')
      }
    }
  } catch (e) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

const toggleStatus = async (row) => {
  try {
    const nextStatus = row.status === 1 ? 0 : 1
    const res = await proxy.$api.products.setStatus(row.id, nextStatus)
    if (res?.code === 200) {
      ElMessage.success('操作成功')
      await loadList()
    } else {
      ElMessage.error(res?.msg || '操作失败')
    }
  } catch (e) {
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
.products-page {
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
}

.query-form {
  margin-bottom: 12px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
