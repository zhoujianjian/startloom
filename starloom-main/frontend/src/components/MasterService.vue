<template>
  <!-- 大师服务引导组件 - 可隐藏 -->
  <div class="master-service-wrapper" :class="{ compact: mode === 'compact' }" v-if="!isHidden">
    <!-- 折叠按钮 (非紧凑模式显示) -->
    <div class="collapse-bar" v-if="mode !== 'compact'" @click="toggleCollapse">
      <span>{{ isCollapsed ? '展开大师服务' : '收起' }}</span>
      <span class="collapse-icon">{{ isCollapsed ? '▼' : '▲' }}</span>
    </div>

    <div class="master-service-section" v-show="!isCollapsed || mode === 'compact'">
      <!-- Banner -->
      <div class="service-banner">
        <div class="banner-bg"></div>
        <div class="banner-content">
          <div class="banner-icon">🔮</div>
          <div class="banner-text">
            <h3>{{ config.bannerTitle }}</h3>
            <p>{{ config.bannerSubtitle }}</p>
          </div>
          <button class="consult-btn" @click="showModal = true">
            <span>立即咨询</span>
            <span class="btn-tag">限时优惠</span>
          </button>
        </div>
      </div>

      <!-- 服务卡片 (紧凑模式只显示2个热门) -->
      <div class="service-cards" :class="{ 'compact-cards': mode === 'compact' }">
        <div class="service-card" v-for="service in displayServices" :key="service.id" @click="showModal = true">
          <div class="service-icon">{{ service.icon }}</div>
          <div class="service-info">
            <h4>{{ service.name }}</h4>
            <p>{{ service.subtitle }}</p>
            <div class="service-price">
              <span class="price">¥{{ service.price }}</span>
              <span class="original" v-if="service.originalPrice">¥{{ service.originalPrice }}</span>
            </div>
          </div>
          <span class="service-tag hot" v-if="service.tag === 'hot'">热门</span>
          <span class="service-tag new" v-if="service.tag === 'new'">新品</span>
          <span class="service-tag recommend" v-if="service.tag === 'recommend'">推荐</span>
        </div>
      </div>

      <!-- 信任背书 -->
      <div class="trust-bar">
        <div class="trust-item">
          <span class="trust-num">{{ config.trustUserCount }}</span>
          <span class="trust-label">服务用户</span>
        </div>
        <div class="trust-item">
          <span class="trust-num">{{ config.trustGoodRate }}</span>
          <span class="trust-label">好评率</span>
        </div>
        <div class="trust-item">
          <span class="trust-num">{{ config.trustExperience }}</span>
          <span class="trust-label">从业经验</span>
        </div>
        <div class="trust-item">
          <span class="trust-num">{{ config.trustServiceTime }}</span>
          <span class="trust-label">在线服务</span>
        </div>
      </div>

      <!-- 隐藏按钮 (非紧凑模式显示) -->
      <div class="hide-bar" v-if="mode !== 'compact'">
        <span class="hide-btn" @click="hideService">不再显示</span>
      </div>
    </div>

    <!-- 咨询弹窗 - 包含所有服务 -->
    <div class="consult-modal" v-if="showModal" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>🔮 大师服务</h3>
          <span class="close-modal" @click="showModal = false">×</span>
        </div>
        <div class="modal-body">
          <!-- 服务选择区 -->
          <div class="modal-services">
            <p class="services-title">选择您需要的服务</p>
            <div class="modal-service-grid">
              <div 
                class="modal-service-item" 
                v-for="service in services" 
                :key="service.id"
                :class="{ selected: selectedService?.id === service.id }"
                @click="selectedService = service"
              >
                <div class="msi-icon">{{ service.icon }}</div>
                <div class="msi-info">
                  <h5>{{ service.name }}</h5>
                  <p>{{ service.subtitle }}</p>
                </div>
                <div class="msi-price">
                  <span class="price">¥{{ service.price }}</span>
                  <span class="original" v-if="service.originalPrice">¥{{ service.originalPrice }}</span>
                </div>
                <span class="msi-tag hot" v-if="service.tag === 'hot'">热门</span>
                <span class="msi-tag new" v-if="service.tag === 'new'">新品</span>
                <span class="check-icon" v-if="selectedService?.id === service.id">✓</span>
              </div>
            </div>
          </div>
          
          <!-- 联系方式区 -->
          <div class="modal-contact">
            <p class="contact-title">添加大师微信咨询</p>
            <div class="contact-row">
              <div class="contact-qrcode">
                <img v-if="config.wechatQrcode" :src="config.wechatQrcode" alt="微信二维码" />
                <div v-else class="qr-placeholder">
                  <span>📱</span>
                  <p>扫码添加</p>
                </div>
              </div>
              <div class="contact-info">
                <div class="info-item">
                  <span class="info-label">微信号</span>
                  <span class="info-value">{{ config.wechat }}</span>
                  <button class="copy-btn" @click="copyWechat">复制</button>
                </div>
                <div class="info-item">
                  <span class="info-label">咨询时间</span>
                  <span class="info-value">{{ config.consultTime }}</span>
                </div>
                <p class="contact-tip">💡 {{ config.contactTip }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <p v-html="config.discountTip"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMasterServiceConfig } from '../api/api'

const props = defineProps({
  mode: { type: String, default: 'full' } // full / compact
})

const isHidden = ref(false)
const isCollapsed = ref(false)
const showModal = ref(false)
const selectedService = ref(null)

// 默认配置（API 加载前使用）
const config = ref({
  bannerTitle: '命理疑惑？大师为您亲自解答',
  bannerSubtitle: '20年资深命理师，一对一深度解析，助您趋吉避凶',
  wechat: 'tianji_master',
  wechatQrcode: '',
  consultTime: '9:00 - 22:00',
  discountTip: '首次咨询可享 <strong>8折优惠</strong>',
  contactTip: '添加时请备注「八字咨询」，优先回复',
  trustUserCount: '10000+',
  trustGoodRate: '98%',
  trustExperience: '20年',
  trustServiceTime: '7×24h'
})

// 默认服务列表
const services = ref([
  { id: 1, name: '八字精批', icon: '📊', subtitle: '详解命盘格局，分析一生运势', price: 199, originalPrice: 399, tag: 'hot' },
  { id: 2, name: '姻缘合婚', icon: '💑', subtitle: '双方八字合盘，婚姻吉凶预测', price: 299, originalPrice: 599, tag: '' },
  { id: 3, name: '流年运势', icon: '📅', subtitle: '2026年运势详批，把握关键时机', price: 99, originalPrice: 199, tag: 'new' },
  { id: 4, name: '事业财运', icon: '💰', subtitle: '事业方向指引，财运旺衰分析', price: 168, originalPrice: 336, tag: '' }
])

// 根据模式显示不同数量的服务
const displayServices = computed(() => {
  if (props.mode === 'compact') {
    // 紧凑模式只显示前2个热门服务
    return services.value.slice(0, 2)
  }
  return services.value
})

onMounted(() => {
  // 检查用户是否隐藏过
  isHidden.value = localStorage.getItem('master-service-hidden') === 'true'
  isCollapsed.value = localStorage.getItem('master-service-collapsed') === 'true'
  
  // 加载配置
  loadConfig()
})

const loadConfig = async () => {
  try {
    const res = await getMasterServiceConfig()
    if (res.code === 200 && res.data) {
      // 解析配置
      if (res.data.config) {
        const cfg = res.data.config
        config.value = {
          bannerTitle: cfg.banner_title || cfg.bannerTitle || config.value.bannerTitle,
          bannerSubtitle: cfg.banner_subtitle || cfg.bannerSubtitle || config.value.bannerSubtitle,
          wechat: cfg.wechat_id || cfg.wechat || config.value.wechat,
          wechatQrcode: cfg.wechat_qrcode || cfg.wechatQrcode || '',
          consultTime: cfg.consult_time || cfg.consultTime || config.value.consultTime,
          discountTip: cfg.discount_tip || cfg.discountTip || config.value.discountTip,
          contactTip: cfg.contact_tip || cfg.contactTip || config.value.contactTip,
          trustUserCount: cfg.trust_user_count || cfg.trustUserCount || config.value.trustUserCount,
          trustGoodRate: cfg.trust_good_rate || cfg.trustGoodRate || config.value.trustGoodRate,
          trustExperience: cfg.trust_experience || cfg.trustExperience || config.value.trustExperience,
          trustServiceTime: cfg.trust_service_time || cfg.trustServiceTime || config.value.trustServiceTime
        }
      }
      // 解析商品列表
      if (res.data.products?.length) {
        services.value = res.data.products.map(p => ({
          id: p.id,
          name: p.name,
          icon: p.icon,
          subtitle: p.subtitle || p.description,
          price: p.price,
          originalPrice: p.original_price || p.originalPrice,
          tag: p.tag,
          extra: p.extra
        }))
      }
    }
  } catch (e) { console.log('使用默认配置') }
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem('master-service-collapsed', isCollapsed.value)
}

const hideService = () => {
  if (confirm('确定不再显示大师服务吗？可在设置中重新开启')) {
    isHidden.value = true
    localStorage.setItem('master-service-hidden', 'true')
  }
}

const copyWechat = () => {
  navigator.clipboard.writeText(config.value.wechat).then(() => {
    alert('微信号已复制')
  }).catch(() => {
    alert('复制失败，请手动复制：' + config.value.wechat)
  })
}

// 暴露方法供父组件调用
defineExpose({
  show: () => { isHidden.value = false; localStorage.removeItem('master-service-hidden') }
})
</script>

<style scoped>
.master-service-wrapper { margin-top: 40px; padding-top: 30px; border-top: 1px solid var(--border); }

/* 紧凑模式 */
.master-service-wrapper.compact { margin-top: 30px; padding-top: 0; border-top: none; }
.compact .service-banner { margin-bottom: 16px; }
.compact .banner-content { padding: 20px 24px; }
.compact .banner-icon { font-size: 36px; }
.compact .banner-text h3 { font-size: 18px; margin-bottom: 4px; }
.compact .banner-text p { font-size: 13px; }
.compact .service-cards { margin-bottom: 16px; }
.compact .service-cards.compact-cards { grid-template-columns: repeat(2, 1fr); }
.compact .service-card { padding: 16px; }
.compact .trust-bar { padding: 14px; gap: 30px; }
.compact .trust-num { font-size: 18px; }

/* 折叠栏 */
.collapse-bar {
  display: flex; justify-content: center; align-items: center; gap: 8px;
  padding: 10px; cursor: pointer; color: var(--textMuted); font-size: 13px;
  transition: color 0.2s;
}
.collapse-bar:hover { color: var(--accent); }
.collapse-icon { font-size: 10px; }

/* Banner */
.service-banner {
  position: relative; border-radius: 20px; overflow: hidden; margin-bottom: 24px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}
.banner-bg {
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
.banner-content {
  position: relative; display: flex; align-items: center; gap: 20px; padding: 28px 32px;
}
.banner-icon { font-size: 48px; }
.banner-text { flex: 1; }
.banner-text h3 { font-size: 20px; color: #fff; margin: 0 0 8px 0; }
.banner-text p { font-size: 14px; color: rgba(255,255,255,0.7); margin: 0; }

.consult-btn {
  display: flex; align-items: center; gap: 10px; padding: 14px 28px;
  background: linear-gradient(135deg, #f59e0b, #d97706); border: none; border-radius: 30px;
  color: #fff; font-size: 16px; font-weight: 600; cursor: pointer;
  transition: all 0.3s; box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);
}
.consult-btn:hover { transform: scale(1.05); box-shadow: 0 6px 25px rgba(245, 158, 11, 0.5); }
.btn-tag { font-size: 11px; background: rgba(255,255,255,0.2); padding: 3px 8px; border-radius: 10px; }

/* 服务卡片 */
.service-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.service-card {
  background: var(--bgCard); border: 1px solid var(--border); border-radius: 16px;
  padding: 20px; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden;
}
.service-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px var(--shadow); border-color: var(--accent); }
.service-icon { font-size: 32px; margin-bottom: 12px; }
.service-info h4 { font-size: 16px; color: var(--textPrimary); margin: 0 0 6px 0; }
.service-info p { font-size: 12px; color: var(--textMuted); margin: 0 0 12px 0; line-height: 1.4; }
.service-price { display: flex; align-items: baseline; gap: 8px; }
.service-price .price { font-size: 20px; font-weight: 700; color: #ef4444; }
.service-price .original { font-size: 13px; color: var(--textMuted); text-decoration: line-through; }

.service-tag {
  position: absolute; top: 12px; right: 12px; font-size: 10px; padding: 3px 8px;
  border-radius: 8px; font-weight: 500;
}
.service-tag.hot { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: #fff; }
.service-tag.new { background: linear-gradient(135deg, #10b981, #059669); color: #fff; }
.service-tag.recommend { background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff; }

/* 信任背书 */
.trust-bar {
  display: flex; justify-content: center; gap: 50px; padding: 20px;
  background: var(--bgCard); border: 1px solid var(--border); border-radius: 14px;
  margin-bottom: 16px;
}
.trust-item { text-align: center; }
.trust-num { display: block; font-size: 22px; font-weight: 700; color: var(--accent); }
.trust-label { font-size: 12px; color: var(--textMuted); }

/* 隐藏按钮 */
.hide-bar { text-align: center; }
.hide-btn { font-size: 12px; color: var(--textMuted); cursor: pointer; }
.hide-btn:hover { color: var(--accent); text-decoration: underline; }

/* 弹窗 */
.consult-modal {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1000;
  display: flex; align-items: center; justify-content: center; padding: 20px;
  overflow-y: auto;
}
.modal-content {
  background: var(--bgCard); border-radius: 20px; width: 100%; max-width: 560px;
  overflow: hidden; animation: modalIn 0.3s ease; max-height: 90vh; overflow-y: auto;
}
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 24px; background: linear-gradient(135deg, #1a1a2e, #16213e);
  position: sticky; top: 0; z-index: 10;
}
.modal-header h3 { color: #fff; margin: 0; font-size: 18px; }
.close-modal { font-size: 24px; color: rgba(255,255,255,0.7); cursor: pointer; }
.close-modal:hover { color: #fff; }

.modal-body { padding: 20px; }

/* 弹窗内服务选择 */
.modal-services { margin-bottom: 20px; }
.services-title { font-size: 14px; color: var(--textMuted); margin: 0 0 12px 0; }
.modal-service-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.modal-service-item {
  position: relative; padding: 14px; border-radius: 12px;
  background: var(--bgInput); border: 2px solid transparent;
  cursor: pointer; transition: all 0.2s;
}
.modal-service-item:hover { border-color: var(--accent); }
.modal-service-item.selected { border-color: var(--accent); background: rgba(245, 158, 11, 0.1); }
.msi-icon { font-size: 24px; margin-bottom: 8px; }
.msi-info h5 { font-size: 14px; color: var(--textPrimary); margin: 0 0 4px 0; }
.msi-info p { font-size: 11px; color: var(--textMuted); margin: 0; line-height: 1.3; }
.msi-price { margin-top: 8px; display: flex; align-items: baseline; gap: 6px; }
.msi-price .price { font-size: 16px; font-weight: 700; color: #ef4444; }
.msi-price .original { font-size: 11px; color: var(--textMuted); text-decoration: line-through; }
.msi-tag {
  position: absolute; top: 8px; right: 8px; font-size: 9px; padding: 2px 6px;
  border-radius: 6px; font-weight: 500;
}
.msi-tag.hot { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: #fff; }
.msi-tag.new { background: linear-gradient(135deg, #10b981, #059669); color: #fff; }
.check-icon {
  position: absolute; bottom: 8px; right: 8px; width: 20px; height: 20px;
  background: var(--accent); color: #fff; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 12px;
}

/* 弹窗内联系方式 */
.modal-contact { background: var(--bgInput); border-radius: 12px; padding: 16px; }
.contact-title { font-size: 14px; color: var(--textPrimary); margin: 0 0 12px 0; font-weight: 500; }
.contact-row { display: flex; gap: 16px; align-items: flex-start; }
.contact-qrcode { flex-shrink: 0; }
.contact-qrcode img { width: 100px; height: 100px; border-radius: 8px; }
.qr-placeholder {
  width: 100px; height: 100px; background: var(--bgCard);
  border: 2px dashed var(--border); border-radius: 8px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.qr-placeholder span { font-size: 24px; }
.qr-placeholder p { font-size: 11px; color: var(--textMuted); margin: 4px 0 0 0; }

.contact-info { flex: 1; }
.info-item {
  display: flex; align-items: center; gap: 8px; padding: 8px 0;
  border-bottom: 1px solid var(--borderLight);
}
.info-item:last-of-type { border-bottom: none; }
.info-label { font-size: 12px; color: var(--textMuted); width: 60px; }
.info-value { flex: 1; font-size: 13px; color: var(--textPrimary); font-weight: 500; }
.copy-btn {
  padding: 3px 10px; background: var(--accent); border: none;
  border-radius: 10px; color: #fff; font-size: 11px; cursor: pointer;
}
.contact-tip { font-size: 11px; color: var(--accent); margin: 10px 0 0 0; }

.modal-footer { padding: 14px 20px; background: var(--bgInput); text-align: center; }
.modal-footer p { margin: 0; font-size: 13px; color: var(--textMuted); }
.modal-footer :deep(strong) { color: #ef4444; }

/* 响应式 */
@media (max-width: 768px) {
  .master-service-wrapper { margin-top: 20px; padding: 0 12px; }
  .banner-content { flex-direction: column; text-align: center; padding: 24px 20px; }
  .banner-icon { font-size: 40px; }
  .banner-text h3 { font-size: 18px; }
  .service-cards { grid-template-columns: 1fr 1fr; gap: 12px; }
  .service-card { padding: 16px; }
  .service-icon { font-size: 28px; margin-bottom: 8px; }
  .service-info h4 { font-size: 14px; }
  .service-info p { font-size: 11px; margin-bottom: 8px; }
  .service-price .price { font-size: 18px; }
  .trust-bar { flex-wrap: wrap; gap: 16px 30px; padding: 16px; }
  .trust-num { font-size: 18px; }
  .trust-label { font-size: 11px; }
  .consult-btn { padding: 12px 24px; font-size: 14px; }
  
  /* 弹窗移动端 */
  .modal-content { max-width: 100%; margin: 10px; border-radius: 16px; }
  .modal-service-grid { grid-template-columns: 1fr; }
  .contact-row { flex-direction: column; align-items: center; text-align: center; }
  .contact-qrcode img { width: 120px; height: 120px; }
  .qr-placeholder { width: 120px; height: 120px; }
  .contact-info { width: 100%; }
  .info-item { justify-content: center; }
  .info-label { width: auto; }
}

@media (max-width: 480px) {
  .service-cards { grid-template-columns: 1fr; }
  .trust-bar { gap: 12px 20px; }
}
</style>
