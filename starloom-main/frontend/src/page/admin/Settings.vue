<template>
  <div class="settings-management">
    <div class="page-header">
      <h2>系统设置</h2>
      <el-button type="primary" @click="saveAllSettings" :loading="saving">
        <el-icon><Check /></el-icon>
        保存所有设置
      </el-button>
    </div>

    <el-row :gutter="20">
      <!-- 基本设置 -->
      <el-col :span="12">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <el-icon><Setting /></el-icon>
              <span>基本设置</span>
            </div>
          </template>
          
          <el-form :model="basicSettings" label-width="120px">
            <el-form-item label="网站名称">
              <el-input v-model="basicSettings.siteName" placeholder="请输入网站名称" />
            </el-form-item>
            <el-form-item label="网站标题">
              <el-input v-model="basicSettings.siteTitle" placeholder="请输入网站标题" />
            </el-form-item>
            <el-form-item label="网站描述">
              <el-input
                v-model="basicSettings.siteDescription"
                type="textarea"
                :rows="3"
                placeholder="请输入网站描述"
              />
            </el-form-item>
            <el-form-item label="关键词">
              <el-input v-model="basicSettings.keywords" placeholder="请输入关键词，用逗号分隔" />
            </el-form-item>
            <el-form-item label="联系邮箱">
              <el-input v-model="basicSettings.contactEmail" placeholder="请输入联系邮箱" />
            </el-form-item>
            <el-form-item label="备案号">
              <el-input v-model="basicSettings.icpNumber" placeholder="请输入备案号" />
            </el-form-item>
            <el-form-item label="网站状态">
              <el-switch
                v-model="basicSettings.siteEnabled"
                active-text="开启"
                inactive-text="关闭"
              />
            </el-form-item>
            <el-form-item label="维护模式">
              <el-switch
                v-model="basicSettings.maintenanceMode"
                active-text="开启"
                inactive-text="关闭"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- VIP设置 -->
      <el-col :span="12">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <el-icon><Star /></el-icon>
              <span>VIP设置</span>
            </div>
          </template>
          
          <el-form :model="vipSettings" label-width="120px">
            <el-form-item label="VIP功能开关">
              <el-switch
                v-model="vipSettings.vipEnabled"
                active-text="开启"
                inactive-text="关闭"
              />
            </el-form-item>
            <el-form-item label="月度价格">
              <el-input-number
                v-model="vipSettings.monthlyPrice"
                :min="0"
                :precision="2"
                controls-position="right"
              />
              <span style="margin-left: 10px;">元</span>
            </el-form-item>
            <el-form-item label="年度价格">
              <el-input-number
                v-model="vipSettings.yearlyPrice"
                :min="0"
                :precision="2"
                controls-position="right"
              />
              <span style="margin-left: 10px;">元</span>
            </el-form-item>
            <el-form-item label="年度折扣">
              <el-input-number
                v-model="vipSettings.yearlyDiscount"
                :min="0"
                :max="100"
                controls-position="right"
              />
              <span style="margin-left: 10px;">%</span>
            </el-form-item>
            <el-form-item label="免费试用天数">
              <el-input-number
                v-model="vipSettings.trialDays"
                :min="0"
                :max="30"
                controls-position="right"
              />
              <span style="margin-left: 10px;">天</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 邮件设置 -->
      <el-col :span="12">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <el-icon><Message /></el-icon>
              <span>邮件设置</span>
            </div>
          </template>
          
          <el-form :model="emailSettings" label-width="120px">
            <el-form-item label="SMTP服务器">
              <el-input v-model="emailSettings.smtpHost" placeholder="请输入SMTP服务器地址" />
            </el-form-item>
            <el-form-item label="SMTP端口">
              <el-input-number
                v-model="emailSettings.smtpPort"
                :min="1"
                :max="65535"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="发送邮箱">
              <el-input v-model="emailSettings.fromEmail" placeholder="请输入发送邮箱" />
            </el-form-item>
            <el-form-item label="邮箱密码">
              <el-input
                v-model="emailSettings.fromPassword"
                type="password"
                placeholder="请输入邮箱密码"
                show-password
              />
            </el-form-item>
            <el-form-item label="启用SSL">
              <el-switch
                v-model="emailSettings.sslEnabled"
                active-text="开启"
                inactive-text="关闭"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="testEmail" :loading="testingEmail">
                测试邮件发送
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 支付设置 -->
      <el-col :span="12">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <el-icon><CreditCard /></el-icon>
              <span>支付设置</span>
            </div>
          </template>
          
          <el-form :model="paymentSettings" label-width="120px">
            <el-form-item label="支付宝支付">
              <el-switch
                v-model="paymentSettings.alipayEnabled"
                active-text="开启"
                inactive-text="关闭"
              />
            </el-form-item>
            <el-form-item label="支付宝AppID">
              <el-input v-model="paymentSettings.alipayAppId" placeholder="请输入支付宝AppID" />
            </el-form-item>
            <el-form-item label="支付宝密钥">
              <el-input
                v-model="paymentSettings.alipayPrivateKey"
                type="password"
                placeholder="请输入支付宝私钥"
                show-password
              />
            </el-form-item>
            <el-form-item label="微信支付">
              <el-switch
                v-model="paymentSettings.wechatEnabled"
                active-text="开启"
                inactive-text="关闭"
              />
            </el-form-item>
            <el-form-item label="微信AppID">
              <el-input v-model="paymentSettings.wechatAppId" placeholder="请输入微信AppID" />
            </el-form-item>
            <el-form-item label="微信密钥">
              <el-input
                v-model="paymentSettings.wechatApiKey"
                type="password"
                placeholder="请输入微信API密钥"
                show-password
              />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 系统配置 -->
      <el-col :span="24">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <el-icon><Tools /></el-icon>
              <span>系统配置</span>
            </div>
          </template>
          
          <el-form :model="systemSettings" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="缓存类型">
                  <el-select v-model="systemSettings.cacheType" placeholder="请选择缓存类型">
                    <el-option label="Redis" value="redis" />
                    <el-option label="内存缓存" value="memory" />
                  </el-select>
                </el-form-item>
                <el-form-item label="缓存过期时间">
                  <el-input-number
                    v-model="systemSettings.cacheExpire"
                    :min="60"
                    controls-position="right"
                  />
                  <span style="margin-left: 10px;">秒</span>
                </el-form-item>
                <el-form-item label="日志级别">
                  <el-select v-model="systemSettings.logLevel" placeholder="请选择日志级别">
                    <el-option label="DEBUG" value="debug" />
                    <el-option label="INFO" value="info" />
                    <el-option label="WARN" value="warn" />
                    <el-option label="ERROR" value="error" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="最大上传大小">
                  <el-input-number
                    v-model="systemSettings.maxUploadSize"
                    :min="1"
                    :max="100"
                    controls-position="right"
                  />
                  <span style="margin-left: 10px;">MB</span>
                </el-form-item>
                <el-form-item label="会话超时时间">
                  <el-input-number
                    v-model="systemSettings.sessionTimeout"
                    :min="30"
                    controls-position="right"
                  />
                  <span style="margin-left: 10px;">分钟</span>
                </el-form-item>
                <el-form-item label="启用调试模式">
                  <el-switch
                    v-model="systemSettings.debugMode"
                    active-text="开启"
                    inactive-text="关闭"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Check, Setting, Star, Message, CreditCard, Tools 
} from '@element-plus/icons-vue'

// 获取当前实例
const { proxy } = getCurrentInstance()

// 响应式数据
const saving = ref(false)
const testingEmail = ref(false)

// 基本设置
const basicSettings = reactive({
  siteName: '',
  siteTitle: '',
  siteDescription: '',
  keywords: '',
  contactEmail: '',
  icpNumber: '',
  siteEnabled: true,
  maintenanceMode: false
})

// VIP设置
const vipSettings = reactive({
  vipEnabled: true,
  monthlyPrice: 29.90,
  yearlyPrice: 299.00,
  yearlyDiscount: 20,
  trialDays: 7
})

// 邮件设置
const emailSettings = reactive({
  smtpHost: '',
  smtpPort: 587,
  fromEmail: '',
  fromPassword: '',
  sslEnabled: true
})

// 支付设置
const paymentSettings = reactive({
  alipayEnabled: true,
  alipayAppId: '',
  alipayPrivateKey: '',
  wechatEnabled: true,
  wechatAppId: '',
  wechatApiKey: ''
})

// 系统设置
const systemSettings = reactive({
  cacheType: 'redis',
  cacheExpire: 3600,
  logLevel: 'info',
  maxUploadSize: 10,
  sessionTimeout: 120,
  debugMode: false
})

// 方法
const loadSettings = async () => {
  try {
    const res = await proxy.$api.settings.getAll()
    const settings = res.data || []

    const setBool = (v) => String(v) === 'true'
    const setNum = (v) => {
      const n = Number(v)
      return Number.isFinite(n) ? n : 0
    }

    settings.forEach(item => {
      const key = item.configKey
      const value = item.configValue

      switch (key) {
        // site
        case 'site_name': basicSettings.siteName = value || ''; break
        case 'site_title': basicSettings.siteTitle = value || ''; break
        case 'site_description': basicSettings.siteDescription = value || ''; break
        case 'site_keywords': basicSettings.keywords = value || ''; break
        case 'site_contact_email': basicSettings.contactEmail = value || ''; break
        case 'site_icp_number': basicSettings.icpNumber = value || ''; break
        case 'site_enabled': basicSettings.siteEnabled = setBool(value); break
        case 'site_maintenance_mode': basicSettings.maintenanceMode = setBool(value); break

        // vip
        case 'vip_enabled': vipSettings.vipEnabled = setBool(value); break
        case 'vip_monthly_price': vipSettings.monthlyPrice = setNum(value); break
        case 'vip_yearly_price': vipSettings.yearlyPrice = setNum(value); break
        case 'vip_yearly_discount': vipSettings.yearlyDiscount = setNum(value); break
        case 'vip_trial_days': vipSettings.trialDays = setNum(value); break

        // email
        case 'email_smtp_host': emailSettings.smtpHost = value || ''; break
        case 'email_smtp_port': emailSettings.smtpPort = setNum(value); break
        case 'email_from_email': emailSettings.fromEmail = value || ''; break
        case 'email_from_password': emailSettings.fromPassword = value || ''; break
        case 'email_ssl_enabled': emailSettings.sslEnabled = setBool(value); break

        // payment
        case 'payment_alipay_enabled': paymentSettings.alipayEnabled = setBool(value); break
        case 'payment_alipay_app_id': paymentSettings.alipayAppId = value || ''; break
        case 'payment_alipay_private_key': paymentSettings.alipayPrivateKey = value || ''; break
        case 'payment_wechat_enabled': paymentSettings.wechatEnabled = setBool(value); break
        case 'payment_wechat_app_id': paymentSettings.wechatAppId = value || ''; break
        case 'payment_wechat_api_key': paymentSettings.wechatApiKey = value || ''; break

        // system
        case 'system_cache_type': systemSettings.cacheType = value || 'redis'; break
        case 'system_cache_expire': systemSettings.cacheExpire = setNum(value); break
        case 'system_log_level': systemSettings.logLevel = value || 'info'; break
        case 'system_max_upload_size': systemSettings.maxUploadSize = setNum(value); break
        case 'system_session_timeout': systemSettings.sessionTimeout = setNum(value); break
        case 'system_debug_mode': systemSettings.debugMode = setBool(value); break
        default:
          break
      }
    })
  } catch (error) {
    ElMessage.error('加载设置失败')
  }
}

const saveAllSettings = async () => {
  saving.value = true
  try {
    const updates = {
      // site
      site_name: String(basicSettings.siteName ?? ''),
      site_title: String(basicSettings.siteTitle ?? ''),
      site_description: String(basicSettings.siteDescription ?? ''),
      site_keywords: String(basicSettings.keywords ?? ''),
      site_contact_email: String(basicSettings.contactEmail ?? ''),
      site_icp_number: String(basicSettings.icpNumber ?? ''),
      site_enabled: String(!!basicSettings.siteEnabled),
      site_maintenance_mode: String(!!basicSettings.maintenanceMode),

      // vip
      vip_enabled: String(!!vipSettings.vipEnabled),
      vip_monthly_price: String(vipSettings.monthlyPrice ?? 0),
      vip_yearly_price: String(vipSettings.yearlyPrice ?? 0),
      vip_yearly_discount: String(vipSettings.yearlyDiscount ?? 0),
      vip_trial_days: String(vipSettings.trialDays ?? 0),

      // email
      email_smtp_host: String(emailSettings.smtpHost ?? ''),
      email_smtp_port: String(emailSettings.smtpPort ?? 0),
      email_from_email: String(emailSettings.fromEmail ?? ''),
      email_from_password: String(emailSettings.fromPassword ?? ''),
      email_ssl_enabled: String(!!emailSettings.sslEnabled),

      // payment
      payment_alipay_enabled: String(!!paymentSettings.alipayEnabled),
      payment_alipay_app_id: String(paymentSettings.alipayAppId ?? ''),
      payment_alipay_private_key: String(paymentSettings.alipayPrivateKey ?? ''),
      payment_wechat_enabled: String(!!paymentSettings.wechatEnabled),
      payment_wechat_app_id: String(paymentSettings.wechatAppId ?? ''),
      payment_wechat_api_key: String(paymentSettings.wechatApiKey ?? ''),

      // system
      system_cache_type: String(systemSettings.cacheType ?? 'redis'),
      system_cache_expire: String(systemSettings.cacheExpire ?? 0),
      system_log_level: String(systemSettings.logLevel ?? 'info'),
      system_max_upload_size: String(systemSettings.maxUploadSize ?? 0),
      system_session_timeout: String(systemSettings.sessionTimeout ?? 0),
      system_debug_mode: String(!!systemSettings.debugMode),
    }

    await proxy.$api.settings.batchUpdate(updates)
    
    ElMessage.success('设置保存成功')
  } catch (error) {
    ElMessage.error('保存设置失败')
  } finally {
    saving.value = false
  }
}

const testEmail = async () => {
  testingEmail.value = true
  try {
    await proxy.$api.settings.testEmail({
      smtpHost: emailSettings.smtpHost,
      smtpPort: emailSettings.smtpPort,
      fromEmail: emailSettings.fromEmail,
      fromPassword: emailSettings.fromPassword,
      sslEnabled: emailSettings.sslEnabled
    })
    
    ElMessage.success('测试邮件发送成功')
  } catch (error) {
    ElMessage.error('测试邮件发送失败')
  } finally {
    testingEmail.value = false
  }
}

// 生命周期
onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.settings-management {
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

.settings-card {
  margin-bottom: 20px;
  min-height: 400px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.el-form {
  padding: 10px 0;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input-number {
  width: 200px;
}

.el-select {
  width: 200px;
}

@media (max-width: 768px) {
  .settings-management {
    padding: 12px;
  }

  :deep(.el-col) {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }

  .settings-card {
    min-height: auto;
  }

  .el-input-number {
    width: 100%;
  }

  .el-select {
    width: 100%;
  }
}

.el-card__body {
  padding: 20px;
}

.el-switch {
  --el-switch-on-color: #13ce66;
  --el-switch-off-color: #ff4949;
}
</style>
