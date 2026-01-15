<template>
  <div class="tools-section">
    <!-- 工具区域标题 -->
    <div class="tools-header">
      <span class="tools-title">🛠️ 免费工具</span>
      <span class="tools-count">{{ allTools.length }}款</span>
    </div>
    
    <!-- 紧凑工具网格 - 平铺显示 -->
    <div class="tools-grid">
      <div 
        class="tool-chip" 
        v-for="tool in allTools" 
        :key="tool.id" 
        @click="openTool(tool)" 
        :class="{ hot: tool.hot, new: tool.new }"
      >
        <span class="chip-icon">{{ tool.icon }}</span>
        <span class="chip-name">{{ tool.name }}</span>
        <span class="chip-badge" v-if="tool.hot">热</span>
        <span class="chip-badge new" v-if="tool.new">新</span>
      </div>
    </div>
    
    <!-- 工具弹窗 -->
    <div class="tool-modal" v-if="showToolModal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ currentTool?.icon }} {{ currentTool?.name }}</h3>
          <span class="close-btn" @click="closeModal">×</span>
        </div>
        <div class="modal-body">
          <!-- 姓名测试 -->
          <div v-if="currentTool?.id === 'name-test' || currentTool?.id === 'baby-name' || currentTool?.id === 'company-name'" class="tool-form">
            <div class="form-group" v-if="currentTool?.id !== 'company-name'">
              <label>姓氏</label><input v-model="nameForm.surname" placeholder="请输入姓氏" maxlength="2" />
            </div>
            <div class="form-group">
              <label>{{ currentTool?.id === 'company-name' ? '公司名称' : '名字' }}</label>
              <input v-model="nameForm.name" :placeholder="currentTool?.id === 'company-name' ? '请输入公司名称' : '请输入名字'" maxlength="10" />
            </div>
            <div class="form-group" v-if="currentTool?.id !== 'company-name'">
              <label>性别</label>
              <div class="radio-group">
                <label><input type="radio" v-model="nameForm.gender" value="男" /> 男</label>
                <label><input type="radio" v-model="nameForm.gender" value="女" /> 女</label>
              </div>
            </div>
            <button class="submit-btn" @click="testName" :disabled="loading">{{ loading ? '测算中...' : '开始测算' }}</button>
          </div>
          
          <!-- 生肖配对 -->
          <div v-if="currentTool?.id === 'zodiac-match'" class="tool-form">
            <div class="match-row">
              <div class="match-side"><label>我的生肖</label>
                <div class="zodiac-grid">
                  <span v-for="z in zodiacList" :key="z" class="zodiac-item" :class="{ active: matchForm.zodiac1 === z }" @click="matchForm.zodiac1 = z">{{ z }}</span>
                </div>
              </div>
              <div class="match-vs">💕</div>
              <div class="match-side"><label>TA的生肖</label>
                <div class="zodiac-grid">
                  <span v-for="z in zodiacList" :key="z" class="zodiac-item" :class="{ active: matchForm.zodiac2 === z }" @click="matchForm.zodiac2 = z">{{ z }}</span>
                </div>
              </div>
            </div>
            <button class="submit-btn" @click="matchZodiac" :disabled="loading">{{ loading ? '配对中...' : '开始配对' }}</button>
          </div>
          
          <!-- 星座配对 -->
          <div v-if="currentTool?.id === 'constellation-match'" class="tool-form">
            <div class="match-row">
              <div class="match-side"><label>我的星座</label><select v-model="matchForm.star1" class="star-select"><option value="">请选择</option><option v-for="s in starList" :key="s">{{ s }}</option></select></div>
              <div class="match-vs">💕</div>
              <div class="match-side"><label>TA的星座</label><select v-model="matchForm.star2" class="star-select"><option value="">请选择</option><option v-for="s in starList" :key="s">{{ s }}</option></select></div>
            </div>
            <button class="submit-btn" @click="matchStar" :disabled="loading">{{ loading ? '配对中...' : '开始配对' }}</button>
          </div>
          
          <!-- 周公解梦 -->
          <div v-if="currentTool?.id === 'dream'" class="tool-form">
            <div class="form-group"><label>描述你的梦境</label><textarea v-model="dreamForm.content" placeholder="请详细描述你梦到了什么..." rows="4"></textarea></div>
            <button class="submit-btn" @click="interpretDream" :disabled="loading">{{ loading ? '解梦中...' : '开始解梦' }}</button>
          </div>
          
          <!-- 手机号测吉凶 -->
          <div v-if="currentTool?.id === 'phone-test'" class="tool-form">
            <div class="form-group"><label>手机号码</label><input v-model="phoneForm.number" placeholder="请输入11位手机号" maxlength="11" type="tel" /></div>
            <button class="submit-btn" @click="testPhone" :disabled="loading">{{ loading ? '测算中...' : '开始测算' }}</button>
          </div>
          
          <!-- 车牌号测吉凶 -->
          <div v-if="currentTool?.id === 'plate-test'" class="tool-form">
            <div class="form-group"><label>车牌号码</label><input v-model="plateForm.number" placeholder="如：京A12345" maxlength="8" /></div>
            <button class="submit-btn" @click="testPlate" :disabled="loading">{{ loading ? '测算中...' : '开始测算' }}</button>
          </div>
          
          <!-- 今日运势签 -->
          <div v-if="currentTool?.id === 'daily-sign'" class="tool-form sign-form">
            <div class="sign-box" :class="{ drawing: signDrawing }" @click="drawSign">
              <div class="sign-content" v-if="!toolResult && !signDrawing"><span class="sign-icon">🎋</span><p>点击抽签</p></div>
              <div class="sign-drawing" v-if="signDrawing"><span class="drawing-icon">🎋</span><p>抽签中...</p></div>
            </div>
          </div>
          
          <!-- 缘分测试 -->
          <div v-if="currentTool?.id === 'fate-test'" class="tool-form">
            <div class="form-group"><label>你的名字</label><input v-model="fateForm.name1" placeholder="请输入你的名字" /></div>
            <div class="form-group"><label>TA的名字</label><input v-model="fateForm.name2" placeholder="请输入TA的名字" /></div>
            <button class="submit-btn" @click="testFate" :disabled="loading">{{ loading ? '测算中...' : '测试缘分' }}</button>
          </div>
          
          <!-- 前世今生 -->
          <div v-if="currentTool?.id === 'past-life'" class="tool-form">
            <div class="form-group"><label>你的名字</label><input v-model="pastForm.name" placeholder="请输入你的名字" /></div>
            <div class="form-group"><label>出生日期</label><input type="date" v-model="pastForm.birthday" /></div>
            <button class="submit-btn" @click="testPastLife" :disabled="loading">{{ loading ? '测算中...' : '查看前世' }}</button>
          </div>
          
          <!-- 黄道吉日 -->
          <div v-if="currentTool?.id === 'lucky-day' || currentTool?.id === 'wedding-day' || currentTool?.id === 'move-day'" class="tool-form">
            <div class="form-group"><label>查询事项</label>
              <select v-model="luckyForm.event"><option value="">请选择</option><option value="结婚">结婚嫁娶</option><option value="搬家">搬家入宅</option><option value="开业">开业开张</option><option value="出行">出行远行</option></select>
            </div>
            <div class="form-group"><label>查询月份</label><input type="month" v-model="luckyForm.month" /></div>
            <button class="submit-btn" @click="queryLuckyDay" :disabled="loading">{{ loading ? '查询中...' : '查询吉日' }}</button>
          </div>
          
          <!-- 结果展示 -->
          <div class="tool-result" v-if="toolResult" ref="resultRef">
            <div class="result-content">{{ toolResult }}<span class="typing-cursor" v-if="loading">|</span></div>
            <div class="result-actions" v-if="!loading">
              <button class="action-btn" @click="consultMaster">🧙 咨询大师深度解读</button>
              <button class="action-btn secondary" @click="resetTool">重新测算</button>
              <button class="action-btn invite" @click="showInvite = true" v-if="isMatchTool">💕 邀请TA一起测</button>
            </div>
            <!-- 邀请好友 -->
            <div class="invite-card" v-if="showInvite && isMatchTool">
              <div class="invite-header">
                <span>💕 邀请TA一起测</span>
                <span class="close-invite" @click="showInvite = false">×</span>
              </div>
              <p class="invite-desc">分享给好友，看看你们的配对结果</p>
              <div class="invite-btns">
                <button class="invite-btn wechat" @click="shareToWechat">💚 微信</button>
                <button class="invite-btn copy" @click="copyShareLink">🔗 复制链接</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'

const emit = defineEmits(['openMaster', 'switchTab', 'modalChange'])

// 百度统计埋点 - 记录工具使用
const trackEvent = (category, action, label) => {
  if (window._hmt) {
    window._hmt.push(['_trackEvent', category, action, label])
  }
}

const showToolModal = ref(false)
const currentTool = ref(null)
const loading = ref(false)
const toolResult = ref('')
const signDrawing = ref(false)
const resultRef = ref(null)
const showInvite = ref(false)

// 判断是否是配对类工具
const isMatchTool = computed(() => {
  const matchTools = ['zodiac-match', 'constellation-match', 'fate-test']
  return matchTools.includes(currentTool.value?.id)
})

// 分享到微信
const shareToWechat = () => {
  const text = `我在天机命理测了${currentTool.value?.name}，快来看看你的结果！`
  if (navigator.share) {
    navigator.share({ title: '天机命理', text, url: window.location.href })
  } else {
    copyShareLink()
  }
}

// 复制分享链接
const copyShareLink = () => {
  const url = `${window.location.origin}/?tool=${currentTool.value?.id}&from=share`
  navigator.clipboard.writeText(url)
  alert('链接已复制，快去分享给好友吧！')
}

// 检查登录状态
const isLoggedIn = computed(() => !!localStorage.getItem('starloomAI-token'))

// 所有工具 - 按使用频率排序，核心功能已在顶部导航，这里不重复
const allTools = ref([
  // 高频工具
  { id: 'name-test', icon: '✍️', name: '姓名测试', hot: true },
  { id: 'zodiac-match', icon: '🐲', name: '生肖配对', hot: true },
  { id: 'constellation-match', icon: '⭐', name: '星座配对', hot: true },
  { id: 'daily-sign', icon: '🎋', name: '今日运势', hot: true },
  { id: 'dream', icon: '🌙', name: '周公解梦', hot: true },
  { id: 'fate-test', icon: '💘', name: '缘分测试' },
  // 起名类
  { id: 'baby-name', icon: '👶', name: '宝宝起名', new: true },
  { id: 'company-name', icon: '🏢', name: '公司起名' },
  // 号码测吉
  { id: 'phone-test', icon: '📱', name: '手机测吉凶' },
  { id: 'plate-test', icon: '🚗', name: '车牌测吉凶' },
  // 吉日查询
  { id: 'lucky-day', icon: '📅', name: '黄道吉日' },
  { id: 'wedding-day', icon: '💍', name: '结婚吉日' },
  { id: 'move-day', icon: '🏠', name: '搬家吉日' },
  // 趣味测试
  { id: 'past-life', icon: '🌀', name: '前世今生' }
])

const zodiacList = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
const starList = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']

const nameForm = reactive({ surname: '', name: '', gender: '男' })
const matchForm = reactive({ zodiac1: '', zodiac2: '', star1: '', star2: '' })
const dreamForm = reactive({ content: '' })
const phoneForm = reactive({ number: '' })
const plateForm = reactive({ number: '' })
const fateForm = reactive({ name1: '', name2: '' })
const pastForm = reactive({ name: '', birthday: '' })
const luckyForm = reactive({ event: '', month: '' })

const openTool = (tool) => {
  currentTool.value = tool
  toolResult.value = ''
  showToolModal.value = true
  trackEvent('工具', '打开', tool.name)
  emit('modalChange', true)
}

// 通过ID打开工具（供父组件调用）
const openToolById = (toolId) => {
  const tool = allTools.value.find(t => t.id === toolId)
  if (tool) {
    openTool(tool)
  }
}

// 暴露方法给父组件
defineExpose({ openToolById })

const closeModal = () => { 
  showToolModal.value = false
  currentTool.value = null
  loading.value = false
  emit('modalChange', false) // 通知父组件弹窗关闭
}
const resetTool = () => { toolResult.value = '' }

// 流式调用AI
const callAIStream = async (prompt) => {
  loading.value = true
  toolResult.value = ''
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('starloomAI-token') || '' },
      body: JSON.stringify({ message: prompt, stream: true })
    })
    if (!response.body || typeof response.body.getReader !== 'function') {
      const text = await response.text()
      const lines = text.split('\n')
      let fullContent = ''
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim()
          if (data && !data.includes('[DONE]')) {
            try { const json = JSON.parse(data); if (json.content) fullContent += json.content } catch {}
          }
        }
      }
      toolResult.value = fullContent || '测算完成'
      loading.value = false
      return
    }
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value, { stream: true })
      for (const line of text.split('\n')) {
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim()
          if (data && !data.includes('[DONE]')) {
            try { const json = JSON.parse(data); if (json.content) { toolResult.value += json.content; await nextTick(); if (resultRef.value) resultRef.value.scrollIntoView({ behavior: 'smooth', block: 'end' }) } } catch {}
          }
        }
      }
    }
  } catch (e) { toolResult.value = '测算失败，请重试' }
  loading.value = false
}

const testName = () => {
  trackEvent('工具', '使用', currentTool.value?.name) // 埋点：使用工具
  if (currentTool.value?.id === 'company-name') {
    if (!nameForm.name) return alert('请输入公司名称')
    callAIStream(`请为公司名称"${nameForm.name}"进行测试打分，分析五行属性、数理吉凶、行业适配度、综合评分(满分100分)。`)
  } else if (currentTool.value?.id === 'baby-name') {
    if (!nameForm.surname) return alert('请输入姓氏')
    callAIStream(`请为姓"${nameForm.surname}"的${nameForm.gender}宝宝起5个好名字，要求五行平衡、寓意美好，每个名字说明含义和评分。`)
  } else {
    if (!nameForm.surname || !nameForm.name) return alert('请输入完整姓名')
    callAIStream(`请为"${nameForm.surname}${nameForm.name}"(${nameForm.gender})进行姓名测试打分，分析五行、三才五格、名字寓意，综合评分(满分100分)。`)
  }
}
const matchZodiac = () => { trackEvent('工具', '使用', '生肖配对'); if (!matchForm.zodiac1 || !matchForm.zodiac2) return alert('请选择双方生肖'); callAIStream(`请分析属${matchForm.zodiac1}和属${matchForm.zodiac2}的生肖配对：配对指数(满分100)、性格互补、感情运势、相处建议。`) }
const matchStar = () => { trackEvent('工具', '使用', '星座配对'); if (!matchForm.star1 || !matchForm.star2) return alert('请选择双方星座'); callAIStream(`请分析${matchForm.star1}和${matchForm.star2}的星座配对：配对指数(满分100)、性格分析、相处建议。`) }
const interpretDream = () => { trackEvent('工具', '使用', '周公解梦'); if (!dreamForm.content) return alert('请描述你的梦境'); callAIStream(`请用周公解梦解析这个梦境："${dreamForm.content}"，包括梦境寓意、吉凶预兆、运势提示。`) }
const testPhone = () => { trackEvent('工具', '使用', '手机测吉凶'); if (!phoneForm.number || phoneForm.number.length !== 11) return alert('请输入正确的11位手机号'); callAIStream(`请分析手机号${phoneForm.number}的吉凶：数字能量、五行属性、吉凶等级、对事业财运感情的影响。`) }
const testPlate = () => { trackEvent('工具', '使用', '车牌测吉凶'); if (!plateForm.number) return alert('请输入车牌号'); callAIStream(`请分析车牌号"${plateForm.number}"的吉凶：字母数字寓意、五行分析、吉凶等级。`) }
const testFate = () => { trackEvent('工具', '使用', '缘分测试'); if (!fateForm.name1 || !fateForm.name2) return alert('请输入双方名字'); callAIStream(`请测算"${fateForm.name1}"和"${fateForm.name2}"的缘分：缘分指数(满分100)、姓名配对、感情预测。`) }
const testPastLife = () => { trackEvent('工具', '使用', '前世今生'); if (!pastForm.name || !pastForm.birthday) return alert('请输入完整信息'); callAIStream(`请根据姓名"${pastForm.name}"和生日${pastForm.birthday}，推测前世身份、今生使命。`) }
const queryLuckyDay = () => { trackEvent('工具', '使用', '黄道吉日'); if (!luckyForm.event || !luckyForm.month) return alert('请选择事项和月份'); callAIStream(`请查询${luckyForm.month}适合${luckyForm.event}的黄道吉日，列出5个最佳日期，包括公历农历、宜忌、吉时。`) }
const drawSign = () => { trackEvent('工具', '使用', '今日运势'); if (loading.value || toolResult.value) return; signDrawing.value = true; callAIStream('请为我抽取一支今日运势签，包括签文等级、四句签诗、签文解读、开运建议。'); setTimeout(() => { signDrawing.value = false }, 1000) }
const consultMaster = () => { trackEvent('转化', '点击', '咨询大师'); emit('openMaster'); closeModal() }
</script>


<style scoped>
.tools-section { 
  margin: 24px auto;
  padding: 20px;
  max-width: 900px;
  background: var(--bgCard, rgba(255,255,255,0.04));
  border: 1px solid var(--border, rgba(255,255,255,0.06));
  border-radius: 20px;
  box-sizing: border-box;
}

/* 工具区域标题 */
.tools-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border, rgba(255,255,255,0.08));
}

.tools-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--textPrimary, #fff);
}

.tools-count {
  font-size: 12px;
  color: var(--textMuted, rgba(255,255,255,0.5));
  background: var(--bgInput, rgba(255,255,255,0.08));
  padding: 4px 10px;
  border-radius: 12px;
}

/* 紧凑工具网格 */
.tools-grid { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 10px; 
  justify-content: center; 
}

.tool-chip { 
  display: flex; 
  align-items: center; 
  gap: 6px; 
  padding: 10px 16px; 
  background: var(--bgInput, rgba(255,255,255,0.06)); 
  border: 1px solid var(--border, rgba(255,255,255,0.08)); 
  border-radius: 20px; 
  cursor: pointer; 
  transition: all 0.25s ease; 
  position: relative;
}
.tool-chip:hover { 
  background: var(--bgCardHover, rgba(255,255,255,0.12)); 
  border-color: var(--accent, #f59e0b); 
  transform: translateY(-2px); 
  box-shadow: 0 4px 12px var(--shadow, rgba(245,158,11,0.15));
}
.tool-chip.hot { border-color: rgba(255,107,107,0.3); }
.tool-chip.new { border-color: rgba(16,185,129,0.3); }
.chip-icon { font-size: 16px; }
.chip-name { font-size: 13px; color: var(--textPrimary, #fff); white-space: nowrap; font-weight: 500; }
.chip-badge { position: absolute; top: -6px; right: -4px; font-size: 9px; padding: 2px 5px; border-radius: 6px; background: #ff6b6b; color: #fff; font-weight: 600; }
.chip-badge.new { background: #10b981; }

/* 弹窗 */
.tool-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-content { background: var(--bgCard, #1a1a2e); border-radius: 20px; width: 100%; max-width: 480px; max-height: 85vh; overflow-y: auto; animation: modalIn 0.3s ease; }
@keyframes modalIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 20px 20px 0 0; position: sticky; top: 0; z-index: 10; }
.modal-header h3 { color: #fff; margin: 0; font-size: 16px; }
.close-btn { font-size: 24px; color: rgba(255,255,255,0.6); cursor: pointer; line-height: 1; }
.close-btn:hover { color: #fff; }
.modal-body { padding: 20px; }

/* 表单 */
.tool-form { display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; color: var(--textSecondary, rgba(255,255,255,0.8)); }
.form-group input, .form-group select, .form-group textarea { padding: 10px 14px; background: var(--bgInput, rgba(255,255,255,0.08)); border: 1px solid var(--border, rgba(255,255,255,0.1)); border-radius: 10px; color: var(--textPrimary, #fff); font-size: 14px; outline: none; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--accent, #f59e0b); }
.form-group input::placeholder, .form-group textarea::placeholder { color: var(--textMuted, rgba(255,255,255,0.4)); }
.radio-group { display: flex; gap: 16px; }
.radio-group label { display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 13px; color: var(--textPrimary, #fff); }
.submit-btn { padding: 12px 20px; background: linear-gradient(135deg, #f59e0b, #d97706); border: none; border-radius: 10px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.submit-btn:hover:not(:disabled) { transform: scale(1.02); box-shadow: 0 4px 15px rgba(245,158,11,0.4); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* 配对 */
.match-row { display: flex; align-items: flex-start; gap: 12px; }
.match-side { flex: 1; }
.match-side label { display: block; font-size: 13px; color: var(--textSecondary, rgba(255,255,255,0.8)); margin-bottom: 8px; }
.match-vs { font-size: 24px; padding-top: 24px; }
.zodiac-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
.zodiac-item { padding: 8px 4px; background: var(--bgInput, rgba(255,255,255,0.05)); border: 2px solid transparent; border-radius: 6px; text-align: center; cursor: pointer; font-size: 13px; color: var(--textPrimary, #fff); transition: all 0.2s; }
.zodiac-item:hover { border-color: var(--accent, #f59e0b); }
.zodiac-item.active { border-color: var(--accent, #f59e0b); background: rgba(245,158,11,0.15); }
.star-select { width: 100%; }

/* 抽签 */
.sign-form { display: flex; justify-content: center; }
.sign-box { width: 140px; height: 180px; background: linear-gradient(135deg, #8b4513, #654321); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
.sign-box:hover { transform: scale(1.05); }
.sign-box.drawing { animation: shake 0.5s infinite; }
@keyframes shake { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
.sign-content, .sign-drawing { text-align: center; }
.sign-icon, .drawing-icon { font-size: 36px; display: block; margin-bottom: 8px; }
.sign-content p, .sign-drawing p { color: #f5deb3; font-size: 12px; margin: 0; }

/* 结果 */
.tool-result { margin-top: 16px; padding: 16px; background: var(--bgInput, rgba(255,255,255,0.05)); border-radius: 10px; border-left: 3px solid var(--accent, #f59e0b); }
.result-content { font-size: 13px; color: var(--textPrimary, #fff); line-height: 1.7; white-space: pre-wrap; margin-bottom: 12px; }
.typing-cursor { animation: blink 1s infinite; color: var(--accent, #f59e0b); }
@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
.result-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.action-btn { padding: 8px 16px; border-radius: 8px; font-size: 12px; cursor: pointer; transition: all 0.2s; border: none; }
.action-btn:first-child { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; }
.action-btn.secondary { background: var(--bgCard, rgba(255,255,255,0.08)); color: var(--textPrimary, #fff); border: 1px solid var(--border, rgba(255,255,255,0.1)); }
.action-btn.invite { background: linear-gradient(135deg, #ec4899, #db2777); color: #fff; }

/* 邀请卡片 */
.invite-card { margin-top: 12px; padding: 12px; background: linear-gradient(135deg, rgba(236,72,153,0.15), rgba(219,39,119,0.1)); border: 1px solid rgba(236,72,153,0.3); border-radius: 12px; }
.invite-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 14px; color: var(--textPrimary); }
.close-invite { cursor: pointer; color: var(--textMuted); }
.invite-desc { font-size: 12px; color: var(--textSecondary); margin: 0 0 10px; }
.invite-btns { display: flex; gap: 10px; }
.invite-btn { flex: 1; padding: 8px 12px; border-radius: 8px; font-size: 12px; cursor: pointer; border: none; display: flex; align-items: center; justify-content: center; gap: 4px; }
.invite-btn.wechat { background: #07c160; color: #fff; }
.invite-btn.copy { background: rgba(255,255,255,0.1); color: var(--textPrimary); border: 1px solid var(--border); }

@media (max-width: 768px) {
  .tools-section { 
    padding: 14px; 
    margin: 0 10px;
    border-radius: 16px;
  }
  
  .tools-header {
    margin-bottom: 12px;
    padding-bottom: 10px;
  }
  
  .tools-title { font-size: 15px; }
  
  /* 工具网格 - 移动端 */
  .tools-grid { 
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .tool-chip { 
    padding: 10px 8px;
    flex-direction: column;
    gap: 4px;
    border-radius: 12px;
    justify-content: center;
    text-align: center;
  }
  .chip-icon { font-size: 20px; }
  .chip-name { font-size: 11px; white-space: normal; line-height: 1.2; }
  .chip-badge { top: -4px; right: -2px; font-size: 8px; padding: 1px 4px; }
  
  /* 弹窗移动端优化 */
  .tool-modal { padding: 10px; align-items: flex-end; }
  .modal-content { 
    max-width: 100%; 
    max-height: 90vh;
    border-radius: 20px 20px 0 0;
    margin: 0;
  }
  .modal-header { padding: 14px 16px; }
  .modal-header h3 { font-size: 15px; }
  .modal-body { padding: 16px; }
  
  /* 表单移动端 */
  .form-group input, .form-group select, .form-group textarea {
    padding: 12px 14px;
    font-size: 16px; /* 防止iOS缩放 */
  }
  .submit-btn {
    padding: 14px 20px;
    font-size: 15px;
  }
  
  .match-row { flex-direction: column; gap: 16px; }
  .match-vs { padding: 8px 0; text-align: center; font-size: 20px; }
  .zodiac-grid { grid-template-columns: repeat(6, 1fr); gap: 4px; }
  .zodiac-item { padding: 6px 2px; font-size: 12px; }
  
  .result-actions { flex-direction: column; gap: 8px; }
  .action-btn { width: 100%; text-align: center; padding: 12px 16px; font-size: 14px; }
  
  /* 抽签盒子移动端 */
  .sign-box { width: 120px; height: 150px; }
  .sign-icon, .drawing-icon { font-size: 30px; }
}
</style>
