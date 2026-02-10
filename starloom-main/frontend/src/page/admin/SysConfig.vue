<template>
  <div class="sysconfig-page">
    <div class="page-header">
      <h2>系统配置</h2>
      <div class="header-actions">
        <el-button type="primary" @click="openCreate">新增配置</el-button>
        <el-button type="primary" @click="loadList" :loading="loading">刷新</el-button>
      </div>
    </div>

    <el-card>
      <el-form :inline="true" :model="query" class="query-form">
        <el-form-item label="分组">
          <el-input v-model="query.group" placeholder="例如 master" clearable />
        </el-form-item>
        <el-form-item label="Key">
          <el-input v-model="query.key" placeholder="config_key" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="configGroup" label="分组" width="140" />
        <el-table-column prop="configKey" label="Key" min-width="200" show-overflow-tooltip />
        <el-table-column prop="configName" label="名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="configValue" label="值" min-width="220" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '启用' : '停用' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="openEdit(row)">编辑</el-button>
            <el-button
              size="small"
              :type="row.status === 1 ? 'warning' : 'success'"
              @click="toggleStatus(row)"
            >
              {{ row.status === 1 ? '停用' : '启用' }}
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="680px" destroy-on-close>
      <el-form :model="form" label-width="110px">
        <el-form-item label="分组" required>
          <el-input v-model="form.configGroup" placeholder="例如 master" />
        </el-form-item>
        <el-form-item label="Key" required>
          <el-input v-model="form.configKey" placeholder="config_key" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.configName" placeholder="展示名称" />
        </el-form-item>
        <el-form-item label="值" required>
          <el-input v-model="form.configValue" placeholder="配置值" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" placeholder="说明" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="公开可读">
          <el-switch v-model="form.isPublic" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="启用">
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
  group: '',
  key: '',
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
  configGroup: '',
  configKey: '',
  configName: '',
  configValue: '',
  description: '',
  sortOrder: 0,
  isPublic: 0,
  status: 1,
})

const dialogTitle = computed(() => (editingId.value ? '编辑配置' : '新增配置'))

const loadList = async () => {
  loading.value = true
  hint.value = ''
  try {
    if (!proxy?.$api?.sysConfig?.getList) {
      hint.value = '后端/sysAdm/config接口尚未接入（页面已就绪，可继续补后端接口）'
      list.value = []
      page.total = 0
      return
    }

    const params = {
      page: page.current,
      size: page.size,
    }
    if (query.group) params.group = query.group
    if (query.key) params.key = query.key

    const res = await proxy.$api.sysConfig.getList(params)
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
  query.group = ''
  query.key = ''
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
    configGroup: '',
    configKey: '',
    configName: '',
    configValue: '',
    description: '',
    sortOrder: 0,
    isPublic: 0,
    status: 1,
  })
  dialogVisible.value = true
}

const openEdit = (row) => {
  editingId.value = row.id
  Object.assign(form, {
    configGroup: row.configGroup || '',
    configKey: row.configKey || '',
    configName: row.configName || '',
    configValue: row.configValue || '',
    description: row.description || '',
    sortOrder: row.sortOrder ?? 0,
    isPublic: row.isPublic ?? 0,
    status: row.status ?? 1,
  })
  dialogVisible.value = true
}

const submit = async () => {
  if (!form.configGroup || !form.configKey) {
    ElMessage.error('分组和Key不能为空')
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      const res = await proxy.$api.sysConfig.update(editingId.value, {
        configName: form.configName,
        configValue: form.configValue,
        description: form.description,
        sortOrder: form.sortOrder,
        isPublic: form.isPublic,
        status: form.status,
      })
      if (res?.code === 200) {
        ElMessage.success('保存成功')
        dialogVisible.value = false
        await loadList()
      } else {
        ElMessage.error(res?.msg || '保存失败')
      }
    } else {
      const res = await proxy.$api.sysConfig.create({
        ...form,
      })
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
    const res = await proxy.$api.sysConfig.update(row.id, { status: nextStatus })
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
.sysconfig-page {
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
