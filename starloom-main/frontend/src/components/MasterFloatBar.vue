<template>
  <!-- 底部悬浮大师服务横幅 -->
  <div class="master-float-bar" :class="{ collapsed: isCollapsed, hidden: isHidden, 'modal-open': isModalOpen }" v-if="!isHidden">
    <!-- 收起状态 - 小按钮 -->
    <div class="float-collapsed" v-if="isCollapsed" @click="isCollapsed = false">
      <span class="collapsed-icon">🔮</span>
      <span class="collapsed-text">咨询大师</span>
      <span class="collapsed-badge">限时优惠</span>
    </div>

    <!-- 展开状态 - 完整横幅 -->
    <div class="float-expanded" v-else>
      <div class="float-content">
        <div class="float-left">
          <span class="float-icon">🔮</span>
          <div class="float-text">
            <span class="float-title">{{ config.bannerTitle }}</span>
            <span class="float-subtitle">{{ config.bannerSubtitle }}</span>
          </div>
        </div>
        <div class="float-right">
          <button class="consult-btn" @click="showModal = true">
            <span>立即咨询</span>
            <span class="btn-badge">8折</span>
          </button>
          <button class="collapse-btn" @click="isCollapsed = true" title="收起">−</button>
          <button class="close-btn" @click="hideBar" title="关闭">×</button>
        </div>
      </div>
    </div>

    <!-- 咨询弹窗 -->
    <div class="consult-modal" v-if="showModal" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>🔮 大师服务</h3>
          <span class="close-modal" @click="showModal = false">×</span>
        </div>
        <!-- 新用户优惠提示 -->
        <div class="promo-tip" v-if="isNewUserPromo">
          🎁 新用户专享：每项服务立减 <strong>¥{{ promoDiscount }}</strong>
        </div>
        <div class="modal-body">
          <div class="modal-services">
            <p class="services-title">选择您需要的服务</p>
            <div class="modal-service-grid">
              <div class="modal-service-item" v-for="service in services" :key="service.id"
                :class="{ selected: selectedService?.id === service.id }" @click="selectedService = service">
                <div class="msi-icon">{{ service.icon }}</div>
                <div class="msi-info">
                  <h5>{{ service.name }}</h5>
                  <p>{{ service.subtitle }}</p>
                </div>
                <div class="msi-price">
                  <span class="price" :class="{ promo: isNewUserPromo }">¥{{ isNewUserPromo ? applyPromoDiscount(service.price) : service.price }}</span>
                  <span class="original" v-if="isNewUserPromo">¥{{ service.price }}</span>
                  <span class="original" v-else-if="service.originalPrice">¥{{ service.originalPrice }}</span>
                </div>
                <span class="msi-tag hot" v-if="service.tag === 'hot'">热门</span>
                <span class="msi-tag new" v-if="service.tag === 'new'">新品</span>
                <span class="msi-tag promo" v-if="isNewUserPromo">-¥{{ promoDiscount }}</span>
                <span class="check-icon" v-if="selectedService?.id === service.id">✓</span>
              </div>
            </div>
          </div>
          <div class="modal-action" v-if="selectedService">
            <div class="action-buttons">
              <button class="order-btn primary" @click="createOrder('pay')" :disabled="orderLoading">
                {{ orderLoading ? '提交中...' : `立即预约付款 ¥${isNewUserPromo ? applyPromoDiscount(selectedService.price) : selectedService.price}` }}
              </button>
              <button class="order-btn secondary" @click="createOrder('consult')" :disabled="orderLoading">
                先咨询后付费（免费）
              </button>
            </div>
            <p class="action-tip">💡 不确定？可先免费咨询，满意后再付款</p>
          </div>
          <div class="modal-contact">
            <p class="contact-title">📱 添加大师微信</p>
            <div class="contact-row">
              <div class="contact-qrcode">
                <img v-if="config.wechatQrcode" :src="config.wechatQrcode" alt="微信二维码" />
                <div v-else class="qr-placeholder"><span>📱</span><p>扫码添加</p></div>
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
    
    <!-- 订单成功弹窗 -->
    <div class="order-success-modal" v-if="showOrderSuccess" @click.self="closeSuccessModal">
      <div class="success-content">
        <div class="success-icon">{{ orderType === 'pay' ? '💳' : '✅' }}</div>
        <h3>{{ orderType === 'pay' ? '预约成功，请完成付款' : '咨询预约成功' }}</h3>
        <p class="order-no">订单号：{{ orderNo }}</p>
        <div class="pay-section" v-if="orderType === 'pay'">
          <div class="pay-amount">
            <span class="amount-label">应付金额</span>
            <span class="amount-value">¥{{ orderAmount }}</span>
          </div>
          <div class="pay-methods">
            <p class="pay-title">选择支付方式</p>
            <div class="pay-options">
              <div class="pay-option" :class="{ active: payMethod === 'wechat' }" @click="payMethod = 'wechat'">
                <span class="pay-icon">💚</span><span>微信支付</span>
              </div>
              <div class="pay-option" :class="{ active: payMethod === 'alipay' }" @click="payMethod = 'alipay'">
                <span class="pay-icon">💙</span><span>支付宝</span>
              </div>
            </div>
            <div class="pay-qrcode" v-if="payQrcode"><img :src="payQrcode" alt="付款码" /><p>扫码完成支付</p></div>
            <div class="pay-remark">
              <span>转账备注：</span>
              <span class="remark-value">{{ payRemark }}</span>
              <button class="copy-btn" @click="copyRemark">复制</button>
            </div>
            <button class="confirm-pay-btn" @click="confirmPaid" :disabled="confirmLoading">
              {{ confirmLoading ? '提交中...' : '我已完成付款' }}
            </button>
          </div>
        </div>
        <div class="consult-section" v-else>
          <div class="success-steps">
            <div class="step"><span class="step-num">1</span>复制微信号或扫码添加大师</div>
            <div class="step"><span class="step-num">2</span>发送订单号，说明咨询需求</div>
            <div class="step"><span class="step-num">3</span>大师解答后，满意再付款</div>
          </div>
        </div>
        <div class="success-contact">
          <span>微信号：{{ config.wechat }}</span>
          <button class="copy-btn" @click="copyWechat">复制</button>
        </div>
        <button class="close-success-btn" @click="closeSuccessModal">我知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getMasterServiceConfig, createMasterOrder, getPaymentOptions, createPayOrder, confirmPayment } from '../api/api'

const isHidden = ref(false)
const isCollapsed = ref(false)
const isModalOpen = ref(false) // 外部弹窗是否打开
const showModal = ref(false)
const selectedService = ref(null)
const orderLoading = ref(false)
const showOrderSuccess = ref(false)
const orderNo = ref('')
const orderAmount = ref(0)
const orderType = ref('consult')
const payMethod = ref('wechat')
const payQrcode = ref('')
const payRemark = ref('')
const confirmLoading = ref(false)
const paymentOptions = ref({})

const config = ref({
  bannerTitle: '命理疑惑？大师为您亲自解答',
  bannerSubtitle: '20年资深命理师，一对一深度解析',
  wechat: 'tianji_master',
  wechatQrcode: '',
  consultTime: '9:00 - 22:00',
  discountTip: '首次咨询可享 <strong>8折优惠</strong>',
  contactTip: '添加时请备注「八字咨询」，优先回复'
})

const services = ref([
  { id: 1, name: '八字精批', icon: '📊', subtitle: '详解命盘格局，分析一生运势', price: 199, originalPrice: 399, tag: 'hot' },
  { id: 2, name: '姻缘合婚', icon: '💑', subtitle: '双方八字合盘，婚姻吉凶预测', price: 299, originalPrice: 599, tag: '' },
  { id: 3, name: '流年运势', icon: '📅', subtitle: '2026年运势详批，把握关键时机', price: 99, originalPrice: 199, tag: 'new' },
  { id: 4, name: '事业财运', icon: '💰', subtitle: '事业方向指引，财运旺衰分析', price: 168, originalPrice: 336, tag: '' }
])

onMounted(() => {
  isHidden.value = localStorage.getItem('master-float-hidden') === 'true'
  isCollapsed.value = localStorage.getItem('master-float-collapsed') === 'true'
  loadConfig()
})

const loadConfig = async () => {
  try {
    const res = await getMasterServiceConfig()
    if (res.code === 200 && res.data) {
      if (res.data.config) {
        const cfg = res.data.config
        config.value = {
          bannerTitle: cfg.banner_title || cfg.bannerTitle || config.value.bannerTitle,
          bannerSubtitle: cfg.banner_subtitle || cfg.bannerSubtitle || config.value.bannerSubtitle,
          wechat: cfg.wechat_id || cfg.wechat || config.value.wechat,
          wechatQrcode: cfg.wechat_qrcode || cfg.wechatQrcode || '',
          consultTime: cfg.consult_time || cfg.consultTime || config.value.consultTime,
          discountTip: cfg.discount_tip || cfg.discountTip || config.value.discountTip,
          contactTip: cfg.contact_tip || cfg.contactTip || config.value.contactTip
        }
      }
      if (res.data.products?.length) {
        services.value = res.data.products.map(p => ({
          id: p.id, name: p.name, icon: p.icon,
          subtitle: p.subtitle || p.description,
          price: p.price, originalPrice: p.original_price || p.originalPrice,
          tag: p.tag
        }))
      }
    }
    const payRes = await getPaymentOptions()
    if (payRes.code === 200) paymentOptions.value = payRes.data
  } catch (e) { console.log('使用默认配置') }
}

const hideBar = () => {
  if (confirm('确定关闭吗？刷新页面后会重新显示')) {
    isHidden.value = true
    localStorage.setItem('master-float-hidden', 'true')
  }
}

const copyWechat = () => {
  navigator.clipboard.writeText(config.value.wechat).then(() => alert('微信号已复制'))
    .catch(() => alert('复制失败，请手动复制：' + config.value.wechat))
}

const copyRemark = () => {
  navigator.clipboard.writeText(payRemark.value).then(() => alert('备注已复制'))
    .catch(() => alert('复制失败，请手动复制：' + payRemark.value))
}

const createOrder = async (type) => {
  if (!selectedService.value) return
  orderLoading.value = true
  orderType.value = type
  try {
    const res = await createMasterOrder({
      productId: selectedService.value.id,
      productName: selectedService.value.name,
      price: selectedService.value.price,
      orderType: type
    })
    if (res.code === 200 && res.data) {
      orderNo.value = res.data.orderNo
      orderAmount.value = selectedService.value.price
      payRemark.value = 'MS' + res.data.orderNo.slice(-6)
      showModal.value = false
      showOrderSuccess.value = true
      if (type === 'pay') loadPayQrcode()
    } else {
      alert(res.msg || '创建订单失败')
    }
  } catch (e) {
    console.error('创建订单失败', e)
    alert('创建订单失败，请重试')
  }
  orderLoading.value = false
}

const loadPayQrcode = async () => {
  try {
    const res = await createPayOrder({ orderNo: orderNo.value, payType: payMethod.value })
    if (res.code === 200 && res.data) {
      payQrcode.value = res.data.qrcodeUrl || ''
      if (res.data.remark) payRemark.value = res.data.remark
    }
  } catch (e) { console.log('加载支付码失败') }
}

watch(payMethod, () => {
  if (orderType.value === 'pay' && orderNo.value) loadPayQrcode()
})

const confirmPaid = async () => {
  confirmLoading.value = true
  try {
    const res = await confirmPayment({ orderNo: orderNo.value, remark: payRemark.value })
    if (res.code === 200) {
      alert('已提交，请等待确认。大师会尽快与您联系！')
      showOrderSuccess.value = false
    } else {
      alert(res.msg || '提交失败')
    }
  } catch (e) { alert('提交失败，请重试') }
  confirmLoading.value = false
}

const closeSuccessModal = () => {
  showOrderSuccess.value = false
  selectedService.value = null
}

// 新用户优惠
const isNewUserPromo = ref(false)
const promoDiscount = ref(50) // 优惠金额

const applyPromoDiscount = (price) => {
  if (isNewUserPromo.value && price > promoDiscount.value) {
    return price - promoDiscount.value
  }
  return price
}

defineExpose({
  show: () => { isHidden.value = false; localStorage.removeItem('master-float-hidden') },
  openModal: (promo = false) => { 
    isNewUserPromo.value = promo
    showModal.value = true 
  },
  setModalOpen: (open) => { isModalOpen.value = open } // 外部控制隐藏
})
</script>

<style scoped>
.master-float-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 999; transition: all 0.3s ease; }
.master-float-bar.hidden { display: none; }
.master-float-bar.modal-open { display: none; } /* 当有弹窗打开时隐藏 */
.float-collapsed { position: fixed; bottom: 20px; right: 20px; display: flex; align-items: center; gap: 8px; padding: 12px 20px; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 30px; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.3); animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.3); } 50% { box-shadow: 0 4px 30px rgba(245,158,11,0.4); } }
.collapsed-icon { font-size: 20px; }
.collapsed-text { color: #fff; font-size: 14px; font-weight: 500; }
.collapsed-badge { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 10px; }
.float-expanded { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); border-top: 1px solid rgba(255,255,255,0.1); box-shadow: 0 -4px 20px rgba(0,0,0,0.3); }
.float-content { max-width: 1200px; margin: 0 auto; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; }
.float-left { display: flex; align-items: center; gap: 16px; }
.float-icon { font-size: 32px; }
.float-text { display: flex; flex-direction: column; gap: 2px; }
.float-title { color: #fff; font-size: 16px; font-weight: 600; }
.float-subtitle { color: rgba(255,255,255,0.7); font-size: 13px; }
.float-right { display: flex; align-items: center; gap: 12px; }
.consult-btn { display: flex; align-items: center; gap: 8px; padding: 10px 24px; background: linear-gradient(135deg, #f59e0b, #d97706); border: none; border-radius: 24px; color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.consult-btn:hover { transform: scale(1.05); box-shadow: 0 4px 20px rgba(245,158,11,0.5); }
.btn-badge { background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 10px; font-size: 11px; }
.collapse-btn, .close-btn { width: 28px; height: 28px; border-radius: 50%; border: none; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); font-size: 18px; cursor: pointer; transition: all 0.2s; }
.collapse-btn:hover, .close-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }
.consult-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1001; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-content { background: var(--bgCard, #1a1a2e); border-radius: 20px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; animation: modalIn 0.3s ease; }
@keyframes modalIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; background: linear-gradient(135deg, #1a1a2e, #16213e); position: sticky; top: 0; z-index: 10; }
.modal-header h3 { color: #fff; margin: 0; font-size: 18px; }
.promo-tip { background: linear-gradient(90deg, #ef4444, #dc2626); color: #fff; padding: 10px 20px; text-align: center; font-size: 14px; }
.promo-tip strong { color: #ffd700; font-size: 16px; }
.close-modal { font-size: 24px; color: rgba(255,255,255,0.7); cursor: pointer; }
.close-modal:hover { color: #fff; }
.modal-body { padding: 20px; }
.modal-services { margin-bottom: 20px; }
.services-title { font-size: 14px; color: var(--textMuted, rgba(255,255,255,0.6)); margin: 0 0 12px 0; }
.modal-service-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.modal-service-item { position: relative; padding: 14px; border-radius: 12px; background: var(--bgInput, rgba(255,255,255,0.05)); border: 2px solid transparent; cursor: pointer; transition: all 0.2s; }
.modal-service-item:hover { border-color: var(--accent, #f59e0b); }
.modal-service-item.selected { border-color: var(--accent, #f59e0b); background: rgba(245,158,11,0.1); }
.msi-icon { font-size: 24px; margin-bottom: 8px; }
.msi-info h5 { font-size: 14px; color: var(--textPrimary, #fff); margin: 0 0 4px 0; }
.msi-info p { font-size: 11px; color: var(--textMuted, rgba(255,255,255,0.6)); margin: 0; line-height: 1.3; }
.msi-price { margin-top: 8px; display: flex; align-items: baseline; gap: 6px; }
.msi-price .price { font-size: 16px; font-weight: 700; color: #ef4444; }
.msi-price .price.promo { color: #10b981; }
.msi-price .original { font-size: 11px; color: var(--textMuted, rgba(255,255,255,0.5)); text-decoration: line-through; }
.msi-tag { position: absolute; top: 8px; right: 8px; font-size: 9px; padding: 2px 6px; border-radius: 6px; }
.msi-tag.hot { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: #fff; }
.msi-tag.new { background: linear-gradient(135deg, #10b981, #059669); color: #fff; }
.msi-tag.promo { background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; top: auto; bottom: 8px; }
.check-icon { position: absolute; bottom: 8px; right: 8px; width: 20px; height: 20px; background: var(--accent, #f59e0b); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; }
.modal-action { margin-bottom: 20px; }
.action-buttons { display: flex; flex-direction: column; gap: 10px; }
.order-btn { width: 100%; padding: 14px 24px; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.order-btn.primary { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; }
.order-btn.primary:hover:not(:disabled) { transform: scale(1.02); box-shadow: 0 4px 20px rgba(245,158,11,0.5); }
.order-btn.secondary { background: var(--bgInput, rgba(255,255,255,0.08)); color: var(--textPrimary, #fff); border: 1px solid var(--border, rgba(255,255,255,0.1)); }
.order-btn.secondary:hover:not(:disabled) { background: var(--bgCardHover, rgba(255,255,255,0.12)); border-color: var(--accent, #f59e0b); }
.order-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.action-tip { font-size: 12px; color: var(--accent, #f59e0b); margin: 12px 0 0 0; text-align: center; }
.modal-contact { background: var(--bgInput, rgba(255,255,255,0.05)); border-radius: 12px; padding: 16px; }
.contact-title { font-size: 14px; color: var(--textPrimary, #fff); margin: 0 0 12px 0; font-weight: 500; }
.contact-row { display: flex; gap: 16px; align-items: flex-start; }
.contact-qrcode img { width: 100px; height: 100px; border-radius: 8px; }
.qr-placeholder { width: 100px; height: 100px; background: var(--bgCard, rgba(255,255,255,0.05)); border: 2px dashed var(--border, rgba(255,255,255,0.1)); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.qr-placeholder span { font-size: 24px; }
.qr-placeholder p { font-size: 11px; color: var(--textMuted, rgba(255,255,255,0.5)); margin: 4px 0 0 0; }
.contact-info { flex: 1; }
.info-item { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid var(--borderLight, rgba(255,255,255,0.05)); }
.info-item:last-of-type { border-bottom: none; }
.info-label { font-size: 12px; color: var(--textMuted, rgba(255,255,255,0.5)); width: 60px; }
.info-value { flex: 1; font-size: 13px; color: var(--textPrimary, #fff); font-weight: 500; }
.copy-btn { padding: 3px 10px; background: var(--accent, #f59e0b); border: none; border-radius: 10px; color: #fff; font-size: 11px; cursor: pointer; }
.contact-tip { font-size: 11px; color: var(--accent, #f59e0b); margin: 10px 0 0 0; }
.modal-footer { padding: 14px 20px; background: var(--bgInput, rgba(255,255,255,0.05)); text-align: center; }
.modal-footer p { margin: 0; font-size: 13px; color: var(--textMuted, rgba(255,255,255,0.6)); }
.modal-footer :deep(strong) { color: #ef4444; }
.order-success-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 1002; display: flex; align-items: center; justify-content: center; padding: 20px; }
.success-content { background: var(--bgCard, #1a1a2e); border-radius: 20px; padding: 30px; text-align: center; max-width: 420px; width: 100%; animation: modalIn 0.3s ease; max-height: 90vh; overflow-y: auto; }
.success-icon { font-size: 48px; margin-bottom: 16px; }
.success-content h3 { color: var(--textPrimary, #fff); font-size: 18px; margin: 0 0 12px 0; }
.order-no { font-size: 14px; color: var(--accent, #f59e0b); margin: 0 0 20px 0; font-weight: 500; background: var(--bgInput, rgba(255,255,255,0.05)); padding: 8px 16px; border-radius: 8px; display: inline-block; }
.pay-section { margin-bottom: 20px; text-align: left; }
.pay-amount { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.1)); border-radius: 12px; margin-bottom: 16px; }
.amount-label { font-size: 14px; color: var(--textMuted, rgba(255,255,255,0.6)); }
.amount-value { font-size: 24px; font-weight: 700; color: #ef4444; }
.pay-title { font-size: 13px; color: var(--textMuted, rgba(255,255,255,0.6)); margin: 0 0 10px 0; }
.pay-options { display: flex; gap: 12px; margin-bottom: 16px; }
.pay-option { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: var(--bgInput, rgba(255,255,255,0.05)); border: 2px solid transparent; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
.pay-option:hover { border-color: var(--border, rgba(255,255,255,0.2)); }
.pay-option.active { border-color: var(--accent, #f59e0b); background: rgba(245,158,11,0.1); }
.pay-icon { font-size: 20px; }
.pay-option span:last-child { font-size: 14px; color: var(--textPrimary, #fff); }
.pay-qrcode { text-align: center; margin-bottom: 16px; }
.pay-qrcode img { width: 160px; height: 160px; border-radius: 12px; margin-bottom: 8px; }
.pay-qrcode p { font-size: 12px; color: var(--textMuted, rgba(255,255,255,0.5)); margin: 0; }
.pay-remark { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: var(--bgInput, rgba(255,255,255,0.05)); border-radius: 10px; margin-bottom: 16px; font-size: 13px; }
.pay-remark span:first-child { color: var(--textMuted, rgba(255,255,255,0.6)); }
.remark-value { color: var(--accent, #f59e0b); font-weight: 600; }
.confirm-pay-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 12px; color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; }
.confirm-pay-btn:hover:not(:disabled) { opacity: 0.9; }
.confirm-pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.consult-section { margin-bottom: 20px; }
.success-steps { text-align: left; }
.success-steps .step { display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 13px; color: var(--textSecondary, rgba(255,255,255,0.8)); border-bottom: 1px solid var(--borderLight, rgba(255,255,255,0.05)); }
.success-steps .step:last-child { border-bottom: none; }
.step-num { width: 24px; height: 24px; background: var(--accent, #f59e0b); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
.success-contact { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 12px; background: var(--bgInput, rgba(255,255,255,0.05)); border-radius: 10px; margin-bottom: 16px; }
.success-contact span { font-size: 14px; color: var(--textPrimary, #fff); }
.close-success-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #f59e0b, #d97706); border: none; border-radius: 10px; color: #fff; font-size: 15px; font-weight: 500; cursor: pointer; }
.close-success-btn:hover { opacity: 0.9; }
@media (max-width: 768px) {
  /* 收起状态 - 移动端更小巧，避免遮挡输入框 */
  .float-collapsed { 
    bottom: 100px; /* 提高位置避免遮挡发送按钮 */
    right: 12px; 
    padding: 8px 14px;
    border-radius: 24px;
  }
  .collapsed-icon { font-size: 16px; }
  .collapsed-text { font-size: 12px; }
  .collapsed-badge { font-size: 9px; padding: 2px 6px; }
  
  /* 展开状态 - 移动端精简 */
  .float-expanded { padding-bottom: env(safe-area-inset-bottom, 0); }
  .float-content { flex-direction: column; gap: 10px; padding: 12px 16px; }
  .float-left { width: 100%; gap: 12px; }
  .float-right { width: 100%; justify-content: space-between; }
  .consult-btn { flex: 1; justify-content: center; padding: 10px 20px; font-size: 14px; }
  .float-icon { font-size: 24px; }
  .float-title { font-size: 13px; }
  .float-subtitle { font-size: 11px; }
  .collapse-btn, .close-btn { width: 26px; height: 26px; font-size: 16px; }
  
  /* 弹窗移动端 */
  .consult-modal { padding: 0; align-items: flex-end; }
  .modal-content { 
    max-width: 100%; 
    max-height: 85vh;
    border-radius: 20px 20px 0 0;
  }
  .modal-service-grid { grid-template-columns: 1fr; gap: 10px; }
  .modal-service-item { padding: 12px; }
  .msi-icon { font-size: 20px; }
  .msi-info h5 { font-size: 13px; }
  .msi-info p { font-size: 10px; }
  .contact-row { flex-direction: column; align-items: center; text-align: center; gap: 12px; }
  .contact-qrcode img { width: 80px; height: 80px; }
  .contact-info { width: 100%; }
  .info-item { justify-content: center; }
  .info-label { width: auto; }
  .pay-options { flex-direction: column; }
  
  /* 订单成功弹窗移动端 */
  .order-success-modal { padding: 10px; }
  .success-content { padding: 24px 20px; }
}
</style>
