<template>
  <div class="invite-section" v-if="show">
    <!-- 邀请卡片 -->
    <div class="invite-card">
      <div class="invite-header">
        <span class="invite-icon">💕</span>
        <span class="invite-title">邀请TA一起测</span>
      </div>
      <p class="invite-desc">{{ inviteText }}</p>
      <div class="invite-actions">
        <button class="invite-btn wechat" @click="shareToWechat">
          <span>💚</span> 微信邀请
        </button>
        <button class="invite-btn link" @click="copyInviteLink">
          <span>🔗</span> 复制链接
        </button>
      </div>
    </div>
    
    <!-- 生成邀请链接弹窗 -->
    <div class="invite-modal" v-if="showModal" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>💕 邀请好友配对</h3>
          <span class="close-btn" @click="showModal = false">×</span>
        </div>
        <div class="modal-body">
          <div class="invite-preview">
            <div class="preview-card">
              <div class="preview-header">{{ userName || '我' }} 邀请你来测试</div>
              <div class="preview-content">
                <span class="preview-icon">{{ toolIcon }}</span>
                <span class="preview-name">{{ toolName }}</span>
              </div>
              <div class="preview-footer">点击查看TA的结果，测测你们的缘分</div>
            </div>
          </div>
          
          <div class="invite-form">
            <div class="form-group">
              <label>你的昵称（选填）</label>
              <input v-model="userName" placeholder="让TA知道是谁邀请的" maxlength="10" />
            </div>
          </div>
          
          <div class="invite-link-box">
            <input :value="inviteLink" readonly />
            <button @click="copyLink">复制</button>
          </div>
          
          <div class="share-buttons">
            <button class="share-btn wechat" @click="shareWechat">
              <span>💚</span> 分享到微信
            </button>
            <button class="share-btn qq" @click="shareQQ">
              <span>💙</span> 分享到QQ
            </button>
            <button class="share-btn weibo" @click="shareWeibo">
              <span>🔴</span> 分享到微博
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  toolId: { type: String, default: '' },
  toolName: { type: String, default: '缘分测试' },
  toolIcon: { type: String, default: '💕' },
  result: { type: String, default: '' }
})

const showModal = ref(false)
const userName = ref('')

const inviteText = computed(() => {
  const texts = {
    'zodiac-match': '邀请TA测测你们的生肖配对指数',
    'constellation-match': '邀请TA测测你们的星座配对',
    'fate-test': '邀请TA测测你们的缘分指数',
    'name-test': '邀请TA也来测测姓名',
    'default': '邀请好友一起来测试吧'
  }
  return texts[props.toolId] || texts.default
})

const inviteLink = computed(() => {
  const base = window.location.origin
  const params = new URLSearchParams({
    tool: props.toolId,
    from: userName.value || 'friend',
    t: Date.now()
  })
  return `${base}/?${params.toString()}`
})

const copyInviteLink = () => {
  showModal.value = true
}

const copyLink = () => {
  navigator.clipboard.writeText(inviteLink.value)
  alert('链接已复制，快去分享给好友吧！')
}

const shareToWechat = () => {
  showModal.value = true
}

const shareWechat = () => {
  // 微信分享需要在微信环境内，这里提示用户
  if (/MicroMessenger/i.test(navigator.userAgent)) {
    // 在微信内，触发分享
    alert('请点击右上角分享给好友')
  } else {
    copyLink()
  }
}

const shareQQ = () => {
  const url = encodeURIComponent(inviteLink.value)
  const title = encodeURIComponent(`${userName.value || '好友'}邀请你来测${props.toolName}`)
  const desc = encodeURIComponent('快来看看你们的缘分指数！')
  window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}&desc=${desc}`)
}

const shareWeibo = () => {
  const url = encodeURIComponent(inviteLink.value)
  const title = encodeURIComponent(`我在天机命理测了${props.toolName}，快来测测你的！`)
  window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${title}`)
}
</script>

<style scoped>
.invite-card {
  background: linear-gradient(135deg, rgba(236,72,153,0.15), rgba(219,39,119,0.1));
  border: 1px solid rgba(236,72,153,0.3);
  border-radius: 16px;
  padding: 16px;
  margin-top: 16px;
  text-align: center;
}

.invite-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}
.invite-icon { font-size: 20px; }
.invite-title { font-size: 15px; font-weight: 600; color: var(--textPrimary); }

.invite-desc {
  font-size: 13px;
  color: var(--textSecondary);
  margin: 0 0 12px;
}

.invite-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.invite-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}
.invite-btn.wechat {
  background: #07c160;
  color: #fff;
}
.invite-btn.link {
  background: rgba(255,255,255,0.1);
  color: var(--textPrimary);
  border: 1px solid var(--border);
}
.invite-btn:hover { transform: scale(1.02); }

/* 弹窗 */
.invite-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  background: var(--bgCard, #1a1a2e);
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}
.modal-header h3 { margin: 0; font-size: 16px; color: var(--textPrimary); }
.close-btn { font-size: 24px; color: rgba(255,255,255,0.6); cursor: pointer; }

.modal-body { padding: 20px; }

/* 预览卡片 */
.invite-preview { margin-bottom: 16px; }
.preview-card {
  background: linear-gradient(135deg, #ec4899, #db2777);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  color: #fff;
}
.preview-header { font-size: 14px; opacity: 0.9; margin-bottom: 12px; }
.preview-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}
.preview-icon { font-size: 28px; }
.preview-name { font-size: 18px; font-weight: 600; }
.preview-footer { font-size: 12px; opacity: 0.8; }

/* 表单 */
.invite-form { margin-bottom: 16px; }
.form-group label {
  display: block;
  font-size: 13px;
  color: var(--textSecondary);
  margin-bottom: 6px;
}
.form-group input {
  width: 100%;
  padding: 10px 14px;
  background: rgba(255,255,255,0.08);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--textPrimary);
  font-size: 14px;
}

/* 链接框 */
.invite-link-box {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.invite-link-box input {
  flex: 1;
  padding: 10px 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--textSecondary);
  font-size: 12px;
}
.invite-link-box button {
  padding: 10px 16px;
  background: var(--accent, #f59e0b);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

/* 分享按钮 */
.share-buttons {
  display: flex;
  gap: 10px;
}
.share-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 10px;
  font-size: 11px;
  cursor: pointer;
  border: none;
  color: #fff;
}
.share-btn.wechat { background: #07c160; }
.share-btn.qq { background: #12b7f5; }
.share-btn.weibo { background: #e6162d; }
.share-btn span { font-size: 20px; }

@media (max-width: 768px) {
  .invite-actions { flex-direction: column; }
  .invite-btn { justify-content: center; }
  .invite-modal { padding: 10px; align-items: flex-end; }
  .modal-content { border-radius: 20px 20px 0 0; }
}
</style>
