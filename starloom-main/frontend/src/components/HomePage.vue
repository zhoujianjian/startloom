<template>
  <div class="home-page">
    <!-- 顶部Header -->
    <div class="home-header">
      <div class="header-left">
        <div class="logo"><span class="logo-icon">八字</span><span class="logo-text">天机命理</span></div>
      </div>
      <div class="header-center">
        <div class="nav-item" :class="{ active: currentTab === 'home' }" @click="currentTab = 'home'">排盘首页</div>
        <div class="nav-item" :class="{ active: currentTab === 'paipan' }" @click="currentTab = 'paipan'">八字排盘</div>
        <div class="nav-item" :class="{ active: currentTab === 'hepan' }" @click="currentTab = 'hepan'">八字合盘</div>
        <div class="nav-item" :class="{ active: currentTab === 'divination' }" @click="currentTab = 'divination'">AI问卦</div>
        <div class="nav-item" :class="{ active: currentTab === 'learn' }" @click="currentTab = 'learn'">学习课堂</div>
        <div class="nav-item" :class="{ active: currentTab === 'member' }" @click="goToMember">会员中心</div>
      </div>
      <div class="header-right">
        <template v-if="!isLoggedIn">
          <span class="login-btn" @click="showLoginModal = true">登录</span>
          <span class="register-btn" @click="showRegisterModal = true">注册</span>
        </template>
        <template v-else>
          <span class="user-info">{{ userNickname }}</span>
          <span class="logout-btn" @click="handleLogout">退出</span>
        </template>
      </div>
      <div class="mobile-menu-btn" @click="showMobileMenu = !showMobileMenu">☰</div>
    </div>

    <!-- 移动端导航 -->
    <div class="mobile-nav" v-if="showMobileMenu">
      <div class="nav-item" @click="switchTab('home')">排盘首页</div>
      <div class="nav-item" @click="switchTab('paipan')">八字排盘</div>
      <div class="nav-item" @click="switchTab('hepan')">八字合盘</div>
      <div class="nav-item" @click="switchTab('divination')">AI问卦</div>
      <div class="nav-item" @click="switchTab('learn')">学习课堂</div>
      <div class="nav-item" @click="switchTab('member')">会员中心</div>
    </div>

    <!-- 登录弹窗 -->
    <div class="modal-overlay" v-if="showLoginModal" @click.self="showLoginModal = false">
      <div class="modal-content">
        <div class="modal-header"><h3>用户登录</h3><span class="close-btn" @click="showLoginModal = false">×</span></div>
        <div class="modal-body">
          <div class="form-group"><label>账号</label><input v-model="loginForm.account" type="text" placeholder="手机号/邮箱/微信号" /></div>
          <div class="form-group"><label>密码</label><input v-model="loginForm.password" type="password" placeholder="请输入密码" /></div>
          <button class="submit-btn" @click="handleLogin" :disabled="loginLoading">{{ loginLoading ? '登录中...' : '登录' }}</button>
          <div class="modal-footer"><span>还没有账号？</span><a @click="showLoginModal = false; showRegisterModal = true">立即注册</a></div>
        </div>
      </div>
    </div>

    <!-- 注册弹窗 -->
    <div class="modal-overlay" v-if="showRegisterModal" @click.self="showRegisterModal = false">
      <div class="modal-content">
        <div class="modal-header"><h3>用户注册</h3><span class="close-btn" @click="showRegisterModal = false">×</span></div>
        <div class="modal-body">
          <div class="form-group"><label>手机号 <span class="optional">(选填)</span></label><input v-model="registerForm.phone" type="text" placeholder="请输入手机号" /></div>
          <div class="form-group"><label>邮箱 <span class="optional">(选填)</span></label><input v-model="registerForm.email" type="email" placeholder="请输入邮箱" /></div>
          <div class="form-group"><label>微信号 <span class="optional">(选填)</span></label><input v-model="registerForm.wechat" type="text" placeholder="请输入微信号" /></div>
          <div class="form-tip">* 手机号、邮箱、微信号至少填写一个</div>
          <div class="form-group"><label>密码</label><input v-model="registerForm.password" type="password" placeholder="请输入密码(至少6位)" /></div>
          <div class="form-group"><label>确认密码</label><input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" /></div>
          <button class="submit-btn" @click="handleRegister" :disabled="registerLoading">{{ registerLoading ? '注册中...' : '注册' }}</button>
          <div class="modal-footer"><span>已有账号？</span><a @click="showRegisterModal = false; showLoginModal = true">立即登录</a></div>
        </div>
      </div>
    </div>

    <!-- 留言弹窗 -->
    <div class="modal-overlay" v-if="showFeedbackModal" @click.self="showFeedbackModal = false">
      <div class="modal-content">
        <div class="modal-header"><h3>用户留言</h3><span class="close-btn" @click="showFeedbackModal = false">×</span></div>
        <div class="modal-body">
          <div class="form-group"><label>昵称</label><input v-model="feedbackForm.nickname" type="text" placeholder="请输入昵称(选填)" /></div>
          <div class="form-group"><label>联系方式</label><input v-model="feedbackForm.contact" type="text" placeholder="手机号/邮箱/微信(选填)" /></div>
          <div class="form-group"><label>留言内容</label><textarea v-model="feedbackForm.content" placeholder="请输入您的留言..." rows="4"></textarea></div>
          <button class="submit-btn" @click="handleSubmitFeedback" :disabled="feedbackLoading">{{ feedbackLoading ? '提交中...' : '提交留言' }}</button>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 首页 -->
      <div v-if="currentTab === 'home'" class="tab-content home-tab">
        <div class="hero-section">
          <h1>天机命理 · 八字排盘</h1>
          <p>传承千年易学智慧，AI智能解读命理玄机</p>
          <button class="cta-btn" @click="currentTab = 'paipan'">立即排盘</button>
        </div>
        <div class="features-section">
          <div class="feature-card" v-for="item in features" :key="item.title">
            <div class="feature-icon">{{ item.icon }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
        <div class="knowledge-section">
          <h2>命理知识</h2>
          <div class="knowledge-grid">
            <div class="knowledge-card" v-for="k in knowledgeList" :key="k.title" @click="currentTab = 'learn'">
              <span class="k-icon">{{ k.icon }}</span>
              <span class="k-title">{{ k.title }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 八字排盘 -->
      <div v-if="currentTab === 'paipan'" class="tab-content paipan-tab">
        <div class="paipan-form">
          <h2>八字排盘</h2>
          <div class="form-row">
            <div class="form-group"><label>命主姓名</label><input v-model="paipanForm.name" placeholder="请输入姓名" /></div>
            <div class="form-group"><label>性别</label>
              <select v-model="paipanForm.gender"><option value="男">男</option><option value="女">女</option></select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>历法</label>
              <select v-model="paipanForm.calendar"><option value="公历">公历</option><option value="农历">农历</option></select>
            </div>
            <div class="form-group"><label>出生日期</label><input type="date" v-model="paipanForm.birthDate" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>出生时辰</label>
              <select v-model="paipanForm.birthHour">
                <option v-for="h in hourOptions" :key="h.value" :value="h.value">{{ h.label }}</option>
              </select>
            </div>
            <div class="form-group"><label>出生地址</label><input v-model="paipanForm.birthPlace" placeholder="省/市" /></div>
          </div>
          <button class="submit-btn paipan-btn" @click="handlePaipan" :disabled="paipanLoading">{{ paipanLoading ? '排盘中...' : '开始排盘' }}</button>
        </div>
        <div class="paipan-result" v-if="paipanResult">
          <h3>排盘结果</h3>
          <div class="result-content" v-html="paipanResult"></div>
        </div>
      </div>

      <!-- 八字合盘 -->
      <div v-if="currentTab === 'hepan'" class="tab-content hepan-tab">
        <div class="hepan-form">
          <h2>八字合盘</h2>
          <div class="person-section">
            <h4>男方信息</h4>
            <div class="form-row">
              <div class="form-group"><label>姓名</label><input v-model="hepanForm.maleName" placeholder="男方姓名" /></div>
              <div class="form-group"><label>出生日期</label><input type="date" v-model="hepanForm.maleBirthDate" /></div>
              <div class="form-group"><label>时辰</label>
                <select v-model="hepanForm.maleBirthHour">
                  <option v-for="h in hourOptions" :key="h.value" :value="h.value">{{ h.label }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="person-section">
            <h4>女方信息</h4>
            <div class="form-row">
              <div class="form-group"><label>姓名</label><input v-model="hepanForm.femaleName" placeholder="女方姓名" /></div>
              <div class="form-group"><label>出生日期</label><input type="date" v-model="hepanForm.femaleBirthDate" /></div>
              <div class="form-group"><label>时辰</label>
                <select v-model="hepanForm.femaleBirthHour">
                  <option v-for="h in hourOptions" :key="h.value" :value="h.value">{{ h.label }}</option>
                </select>
              </div>
            </div>
          </div>
          <button class="submit-btn" @click="handleHepan" :disabled="hepanLoading">{{ hepanLoading ? '合盘中...' : '开始合盘' }}</button>
        </div>
        <div class="hepan-result" v-if="hepanResult">
          <h3>合盘结果</h3>
          <div class="result-content" v-html="hepanResult"></div>
        </div>
      </div>

      <!-- 学习课堂 -->
      <div v-if="currentTab === 'learn'" class="tab-content learn-tab">
        <h2>命理学习课堂</h2>
        <div class="learn-categories">
          <div class="learn-card" v-for="c in learnCategories" :key="c.title">
            <div class="learn-icon">{{ c.icon }}</div>
            <h3>{{ c.title }}</h3>
            <p>{{ c.desc }}</p>
            <ul><li v-for="item in c.items" :key="item">{{ item }}</li></ul>
          </div>
        </div>
      </div>

      <!-- AI问卦 -->
      <div v-if="currentTab === 'divination'" class="tab-content divination-tab">
        <h2>AI智能问卦</h2>
        <div class="divination-grid">
          <!-- AI对话 -->
          <div class="divination-card main-chat" @click="activeDiv = 'chat'">
            <div class="div-icon">🤖</div>
            <h3>AI命理问答</h3>
            <p>智能AI解答您的命理疑问</p>
          </div>
          <!-- 星座运势 -->
          <div class="divination-card" @click="activeDiv = 'horoscope'">
            <div class="div-icon">⭐</div>
            <h3>星座运势</h3>
            <p>每日/每周/每月运势</p>
          </div>
          <!-- 生肖运势 -->
          <div class="divination-card" @click="activeDiv = 'zodiac'">
            <div class="div-icon">🐲</div>
            <h3>生肖运势</h3>
            <p>十二生肖运势分析</p>
          </div>
          <!-- 抽签算命 -->
          <div class="divination-card" @click="activeDiv = 'lottery'">
            <div class="div-icon">🎋</div>
            <h3>抽签算命</h3>
            <p>观音灵签、月老灵签</p>
          </div>
          <!-- 星座查询 -->
          <div class="divination-card" @click="activeDiv = 'constellation'">
            <div class="div-icon">♈</div>
            <h3>星座查询</h3>
            <p>星座性格、配对分析</p>
          </div>
          <!-- 生日密码 -->
          <div class="divination-card" @click="activeDiv = 'birthday'">
            <div class="div-icon">🎂</div>
            <h3>生日密码</h3>
            <p>生日书、生日花</p>
          </div>
        </div>

        <!-- AI对话区域 -->
        <div class="chat-section" v-if="activeDiv === 'chat'">
          <div class="chat-container">
            <div class="chat-messages" ref="chatMessagesRef">
              <div v-for="(msg, idx) in chatMessages" :key="idx" :class="['chat-msg', msg.role]">
                <div class="msg-content">{{ msg.content }}</div>
              </div>
              <div v-if="chatLoading" class="chat-msg assistant">
                <div class="msg-content typing">AI正在思考中...</div>
              </div>
            </div>
            <div class="chat-input-area">
              <input v-model="chatInput" @keyup.enter="sendChatMessage" placeholder="请输入您的问题，如：我今年运势如何？" />
              <button @click="sendChatMessage" :disabled="chatLoading || !chatInput.trim()">发送</button>
            </div>
          </div>
        </div>

        <!-- 星座运势 -->
        <div class="divination-section" v-if="activeDiv === 'horoscope'">
          <h3>星座运势查询</h3>
          <div class="constellation-select">
            <div class="const-item" v-for="c in constellations" :key="c.name" 
                 :class="{ active: selectedConstellation === c.name }"
                 @click="selectedConstellation = c.name">
              <span class="const-icon">{{ c.icon }}</span>
              <span class="const-name">{{ c.name }}</span>
            </div>
          </div>
          <div class="time-tabs">
            <span :class="{ active: fortuneType === 'today' }" @click="fortuneType = 'today'">今日</span>
            <span :class="{ active: fortuneType === 'week' }" @click="fortuneType = 'week'">本周</span>
            <span :class="{ active: fortuneType === 'month' }" @click="fortuneType = 'month'">本月</span>
            <span :class="{ active: fortuneType === 'year' }" @click="fortuneType = 'year'">本年</span>
          </div>
          <button class="query-btn" @click="queryHoroscope" :disabled="!selectedConstellation || horoscopeLoading">
            {{ horoscopeLoading ? '查询中...' : '查询运势' }}
          </button>
          <div class="fortune-result" v-if="horoscopeResult" v-html="horoscopeResult"></div>
        </div>

        <!-- 生肖运势 -->
        <div class="divination-section" v-if="activeDiv === 'zodiac'">
          <h3>生肖运势查询</h3>
          <div class="zodiac-select">
            <div class="zodiac-item" v-for="z in zodiacList" :key="z.name"
                 :class="{ active: selectedZodiac === z.name }"
                 @click="selectedZodiac = z.name">
              <span class="zodiac-icon">{{ z.icon }}</span>
              <span class="zodiac-name">{{ z.name }}</span>
            </div>
          </div>
          <button class="query-btn" @click="queryZodiac" :disabled="!selectedZodiac || zodiacLoading">
            {{ zodiacLoading ? '查询中...' : '查询运势' }}
          </button>
          <div class="fortune-result" v-if="zodiacResult" v-html="zodiacResult"></div>
        </div>

        <!-- 抽签算命 -->
        <div class="divination-section" v-if="activeDiv === 'lottery'">
          <h3>抽签算命</h3>
          <p class="section-desc">心诚则灵，请先静心默念您的问题</p>
          <div class="lottery-types">
            <div class="lottery-card" @click="drawLottery('guanyin')">
              <span class="lottery-icon">🙏</span>
              <span>观音灵签</span>
            </div>
            <div class="lottery-card" @click="drawLottery('yuelao')">
              <span class="lottery-icon">💕</span>
              <span>月老灵签</span>
            </div>
            <div class="lottery-card" @click="drawLottery('caishen')">
              <span class="lottery-icon">💰</span>
              <span>财神灵签</span>
            </div>
          </div>
          <div class="fortune-result" v-if="lotteryResult" v-html="lotteryResult"></div>
        </div>

        <!-- 星座查询 -->
        <div class="divination-section" v-if="activeDiv === 'constellation'">
          <h3>星座详细查询</h3>
          <div class="constellation-select">
            <div class="const-item" v-for="c in constellations" :key="c.name" 
                 :class="{ active: selectedConstellation === c.name }"
                 @click="selectedConstellation = c.name">
              <span class="const-icon">{{ c.icon }}</span>
              <span class="const-name">{{ c.name }}</span>
            </div>
          </div>
          <button class="query-btn" @click="queryConstellation" :disabled="!selectedConstellation || constLoading">
            {{ constLoading ? '查询中...' : '查询星座' }}
          </button>
          <div class="fortune-result" v-if="constResult" v-html="constResult"></div>
        </div>

        <!-- 生日密码 -->
        <div class="divination-section" v-if="activeDiv === 'birthday'">
          <h3>生日密码查询</h3>
          <div class="birthday-form">
            <div class="form-group">
              <label>选择生日</label>
              <input type="date" v-model="birthdayDate" />
            </div>
          </div>
          <div class="birthday-types">
            <button @click="queryBirthday('password')" :disabled="!birthdayDate || birthdayLoading">生日密码</button>
            <button @click="queryBirthday('book')" :disabled="!birthdayDate || birthdayLoading">生日书</button>
            <button @click="queryBirthday('flower')" :disabled="!birthdayDate || birthdayLoading">生日花</button>
          </div>
          <div class="fortune-result" v-if="birthdayResult" v-html="birthdayResult"></div>
        </div>
      </div>

      <!-- 会员中心 -->
      <div v-if="currentTab === 'member'" class="tab-content member-tab">
        <h2>会员中心</h2>
        <div class="vip-info" v-if="isLoggedIn && vipInfo">
          <div class="vip-badge" :class="'level-' + vipInfo.vipLevel">{{ vipLevelName }}</div>
          <p v-if="vipInfo.isVip">到期时间: {{ formatDate(vipInfo.vipExpireTime) }}</p>
          <p v-else>您还不是会员，开通会员享受更多权益</p>
        </div>
        <div class="vip-plans">
          <h3>会员套餐</h3>
          <div class="plans-grid">
            <div class="plan-card" v-for="plan in vipPlans" :key="plan.id" :class="{ recommended: plan.badge === '推荐' }">
              <div class="plan-badge" v-if="plan.badge">{{ plan.badge }}</div>
              <h4>{{ plan.name }}</h4>
              <div class="plan-price"><span class="currency">¥</span><span class="amount">{{ plan.currentPrice }}</span></div>
              <div class="plan-original" v-if="plan.originalPrice > plan.currentPrice">原价 ¥{{ plan.originalPrice }}</div>
              <div class="plan-duration">{{ plan.durationDays }}天</div>
              <button class="buy-btn" @click="handleBuyVip(plan)">立即开通</button>
            </div>
          </div>
        </div>
        <div class="vip-benefits">
          <h3>会员权益对比</h3>
          <table class="benefits-table">
            <thead><tr><th>权益</th><th>普通用户</th><th>黄金会员</th><th>钻石会员</th></tr></thead>
            <tbody>
              <tr v-for="b in vipBenefits" :key="b.name">
                <td>{{ b.name }}</td>
                <td>{{ b.normal || '—' }}</td>
                <td>{{ b.gold || '—' }}</td>
                <td>{{ b.diamond || '✓' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 悬浮留言按钮 -->
    <div class="floating-feedback" @click="showFeedbackModal = true">
      <span>💬</span>
    </div>
  </div>
</template>


<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { userLogin, simpleRegister, loginOut, checkLogin, getVipPlans, getVipBenefits, getVipInfo, createVipOrder, payVipOrder, submitFeedback } from '../api/api'
import { ElMessage } from 'element-plus'

// 状态
const currentTab = ref('home')
const showMobileMenu = ref(false)
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const showFeedbackModal = ref(false)
const isLoggedIn = ref(false)
const userNickname = ref('')
const loginLoading = ref(false)
const registerLoading = ref(false)
const feedbackLoading = ref(false)
const paipanLoading = ref(false)
const hepanLoading = ref(false)
const paipanResult = ref('')
const hepanResult = ref('')
const vipPlans = ref([])
const vipBenefits = ref([])
const vipInfo = ref(null)

// AI问卦相关
const activeDiv = ref('chat')
const chatMessages = ref([])
const chatInput = ref('')
const chatLoading = ref(false)
const chatMessagesRef = ref(null)
const selectedConstellation = ref('')
const fortuneType = ref('today')
const horoscopeLoading = ref(false)
const horoscopeResult = ref('')
const selectedZodiac = ref('')
const zodiacLoading = ref(false)
const zodiacResult = ref('')
const lotteryResult = ref('')
const constLoading = ref(false)
const constResult = ref('')
const birthdayDate = ref('')
const birthdayLoading = ref(false)
const birthdayResult = ref('')

// 星座列表
const constellations = [
  { name: '白羊座', icon: '♈' }, { name: '金牛座', icon: '♉' }, { name: '双子座', icon: '♊' },
  { name: '巨蟹座', icon: '♋' }, { name: '狮子座', icon: '♌' }, { name: '处女座', icon: '♍' },
  { name: '天秤座', icon: '♎' }, { name: '天蝎座', icon: '♏' }, { name: '射手座', icon: '♐' },
  { name: '摩羯座', icon: '♑' }, { name: '水瓶座', icon: '♒' }, { name: '双鱼座', icon: '♓' }
]

// 生肖列表
const zodiacList = [
  { name: '鼠', icon: '🐭' }, { name: '牛', icon: '🐮' }, { name: '虎', icon: '🐯' },
  { name: '兔', icon: '🐰' }, { name: '龙', icon: '🐲' }, { name: '蛇', icon: '🐍' },
  { name: '马', icon: '🐴' }, { name: '羊', icon: '🐑' }, { name: '猴', icon: '🐵' },
  { name: '鸡', icon: '🐔' }, { name: '狗', icon: '🐶' }, { name: '猪', icon: '🐷' }
]

// 表单
const loginForm = reactive({ account: '', password: '' })
const registerForm = reactive({ phone: '', email: '', wechat: '', password: '', confirmPassword: '' })
const feedbackForm = reactive({ nickname: '', contact: '', content: '' })
const paipanForm = reactive({ name: '', gender: '男', calendar: '公历', birthDate: '', birthHour: '子时', birthPlace: '' })
const hepanForm = reactive({ maleName: '', maleBirthDate: '', maleBirthHour: '子时', femaleName: '', femaleBirthDate: '', femaleBirthHour: '子时' })

// 时辰选项
const hourOptions = [
  { value: '子时', label: '子时 (23:00-01:00)' }, { value: '丑时', label: '丑时 (01:00-03:00)' },
  { value: '寅时', label: '寅时 (03:00-05:00)' }, { value: '卯时', label: '卯时 (05:00-07:00)' },
  { value: '辰时', label: '辰时 (07:00-09:00)' }, { value: '巳时', label: '巳时 (09:00-11:00)' },
  { value: '午时', label: '午时 (11:00-13:00)' }, { value: '未时', label: '未时 (13:00-15:00)' },
  { value: '申时', label: '申时 (15:00-17:00)' }, { value: '酉时', label: '酉时 (17:00-19:00)' },
  { value: '戌时', label: '戌时 (19:00-21:00)' }, { value: '亥时', label: '亥时 (21:00-23:00)' }
]

// 首页数据
const features = [
  { icon: '🔮', title: '八字排盘', desc: '精准排出四柱八字，分析命理格局' },
  { icon: '💑', title: '八字合盘', desc: '男女八字配对，分析婚姻缘分' },
  { icon: '📚', title: '命理学习', desc: '系统学习八字命理知识' },
  { icon: '🤖', title: 'AI解读', desc: '智能AI深度解析命盘' }
]

const knowledgeList = [
  { icon: '📖', title: '基础知识' }, { icon: '🎓', title: '专业知识' },
  { icon: '⭐', title: '十神精解' }, { icon: '🌞', title: '十天干精解' },
  { icon: '🌍', title: '十二地支' }, { icon: '💫', title: '神煞详解' }
]

const learnCategories = [
  { icon: '📖', title: '基础知识', desc: '八字入门必学', items: ['天干地支', '阴阳五行', '十神概念', '四柱排法'] },
  { icon: '🎓', title: '专业知识', desc: '进阶命理学习', items: ['格局分析', '用神取法', '大运流年', '命理断事'] },
  { icon: '⭐', title: '十神精解', desc: '十神深度解析', items: ['比肩劫财', '食神伤官', '正财偏财', '正官七杀'] },
  { icon: '🌞', title: '天干精解', desc: '十天干详解', items: ['甲乙木', '丙丁火', '戊己土', '庚辛金壬癸水'] }
]

const vipLevelName = computed(() => {
  if (!vipInfo.value) return '普通用户'
  const level = vipInfo.value.vipLevel
  if (level >= 2) return '钻石会员'
  if (level >= 1) return '黄金会员'
  return '普通用户'
})

// 方法
const switchTab = (tab) => { currentTab.value = tab; showMobileMenu.value = false }
const goToMember = () => { currentTab.value = 'member'; loadVipData() }

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

const handleLogin = async () => {
  if (!loginForm.account || !loginForm.password) {
    ElMessage.warning('请填写账号和密码'); return
  }
  loginLoading.value = true
  try {
    const res = await userLogin({ account: loginForm.account, password: loginForm.password })
    if (res.code === 200) {
      localStorage.setItem('token', res.data.user_token)
      localStorage.setItem('userInfo', JSON.stringify(res.data))
      isLoggedIn.value = true
      userNickname.value = res.data.nickname || res.data.account || '用户'
      showLoginModal.value = false
      ElMessage.success('登录成功')
    } else {
      ElMessage.error(res.msg || '登录失败')
    }
  } catch (e) { ElMessage.error('登录失败') }
  loginLoading.value = false
}

const handleRegister = async () => {
  if (!registerForm.phone && !registerForm.email && !registerForm.wechat) {
    ElMessage.warning('手机号、邮箱、微信号至少填写一个'); return
  }
  if (!registerForm.password || registerForm.password.length < 6) {
    ElMessage.warning('密码至少6位'); return
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    ElMessage.warning('两次密码不一致'); return
  }
  registerLoading.value = true
  try {
    const res = await simpleRegister({
      phone: registerForm.phone, email: registerForm.email,
      wechat: registerForm.wechat, password: registerForm.password
    })
    if (res.code === 200) {
      ElMessage.success('注册成功，请登录')
      showRegisterModal.value = false
      showLoginModal.value = true
    } else {
      ElMessage.error(res.msg || '注册失败')
    }
  } catch (e) { ElMessage.error('注册失败') }
  registerLoading.value = false
}

const handleLogout = async () => {
  await loginOut()
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  isLoggedIn.value = false
  userNickname.value = ''
  ElMessage.success('已退出登录')
}

const handleSubmitFeedback = async () => {
  if (!feedbackForm.content) { ElMessage.warning('请输入留言内容'); return }
  feedbackLoading.value = true
  try {
    const res = await submitFeedback({
      nickname: feedbackForm.nickname, contact: feedbackForm.contact, content: feedbackForm.content
    })
    if (res.code === 200) {
      ElMessage.success('留言提交成功')
      showFeedbackModal.value = false
      feedbackForm.nickname = ''; feedbackForm.contact = ''; feedbackForm.content = ''
    } else {
      ElMessage.error(res.msg || '提交失败')
    }
  } catch (e) { ElMessage.error('提交失败') }
  feedbackLoading.value = false
}

// 八字排盘 - 调用AI接口
const handlePaipan = async () => {
  if (!paipanForm.name || !paipanForm.birthDate) {
    ElMessage.warning('请填写姓名和出生日期'); return
  }
  paipanLoading.value = true
  paipanResult.value = ''
  const prompt = `请为以下信息进行八字排盘分析：
姓名：${paipanForm.name}
性别：${paipanForm.gender}
历法：${paipanForm.calendar}
出生日期：${paipanForm.birthDate}
出生时辰：${paipanForm.birthHour}
出生地点：${paipanForm.birthPlace || '未知'}

请详细分析：1.四柱八字 2.五行分析 3.十神分析 4.格局判断 5.大运流年 6.综合建议`

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || '' },
      body: JSON.stringify({ message: prompt, stream: true })
    })
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value)
      const lines = text.split('\n')
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim()
          if (data && data !== '[DONE]') {
            try {
              const json = JSON.parse(data)
              if (json.content) paipanResult.value += json.content
            } catch { paipanResult.value += data }
          }
        }
      }
    }
  } catch (e) { ElMessage.error('排盘失败，请重试') }
  paipanLoading.value = false
}

// 八字合盘
const handleHepan = async () => {
  if (!hepanForm.maleName || !hepanForm.maleBirthDate || !hepanForm.femaleName || !hepanForm.femaleBirthDate) {
    ElMessage.warning('请填写完整信息'); return
  }
  hepanLoading.value = true
  hepanResult.value = ''
  const prompt = `请进行八字合盘分析：
男方：${hepanForm.maleName}，出生日期：${hepanForm.maleBirthDate}，时辰：${hepanForm.maleBirthHour}
女方：${hepanForm.femaleName}，出生日期：${hepanForm.femaleBirthDate}，时辰：${hepanForm.femaleBirthHour}

请分析：1.双方八字 2.五行互补 3.日柱配对 4.婚姻宫分析 5.综合评分与建议`

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || '' },
      body: JSON.stringify({ message: prompt, stream: true })
    })
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value)
      const lines = text.split('\n')
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim()
          if (data && data !== '[DONE]') {
            try {
              const json = JSON.parse(data)
              if (json.content) hepanResult.value += json.content
            } catch { hepanResult.value += data }
          }
        }
      }
    }
  } catch (e) { ElMessage.error('合盘失败，请重试') }
  hepanLoading.value = false
}

// VIP相关
const loadVipData = async () => {
  try {
    const [plansRes, benefitsRes] = await Promise.all([getVipPlans(), getVipBenefits()])
    if (plansRes.code === 200) vipPlans.value = plansRes.data || []
    if (benefitsRes.code === 200) vipBenefits.value = benefitsRes.data || []
    if (isLoggedIn.value) {
      const infoRes = await getVipInfo()
      if (infoRes.code === 200) vipInfo.value = infoRes.data
    }
  } catch (e) { console.error('加载VIP数据失败', e) }
}

const handleBuyVip = async (plan) => {
  if (!isLoggedIn.value) { showLoginModal.value = true; ElMessage.warning('请先登录'); return }
  try {
    const res = await createVipOrder({ planCode: plan.code })
    if (res.code === 200) {
      ElMessage.success(`订单创建成功，订单号：${res.data.orderNo}`)
      // 模拟支付
      const payRes = await payVipOrder({ orderNo: res.data.orderNo })
      if (payRes.code === 200) {
        ElMessage.success('支付成功，会员已开通')
        loadVipData()
      }
    } else {
      ElMessage.error(res.msg || '创建订单失败')
    }
  } catch (e) { ElMessage.error('操作失败') }
}

// 检查登录状态
const checkLoginStatus = async () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const res = await checkLogin()
      if (res.code === 200) {
        isLoggedIn.value = true
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        userNickname.value = userInfo.nickname || userInfo.email || userInfo.phone || '用户'
      }
    } catch { localStorage.removeItem('token') }
  }
}

// AI对话
const sendChatMessage = async () => {
  if (!chatInput.value.trim() || chatLoading.value) return
  const userMsg = chatInput.value.trim()
  chatMessages.value.push({ role: 'user', content: userMsg })
  chatInput.value = ''
  chatLoading.value = true
  await nextTick()
  if (chatMessagesRef.value) chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || '' },
      body: JSON.stringify({ message: userMsg, stream: true })
    })
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let assistantMsg = ''
    chatMessages.value.push({ role: 'assistant', content: '' })
    const msgIdx = chatMessages.value.length - 1
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value)
      const lines = text.split('\n')
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim()
          if (data && data !== '[DONE]') {
            try {
              const json = JSON.parse(data)
              if (json.content) { assistantMsg += json.content; chatMessages.value[msgIdx].content = assistantMsg }
            } catch { assistantMsg += data; chatMessages.value[msgIdx].content = assistantMsg }
          }
        }
      }
      await nextTick()
      if (chatMessagesRef.value) chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  } catch (e) { chatMessages.value.push({ role: 'assistant', content: '抱歉，请求失败，请重试' }) }
  chatLoading.value = false
}

// 星座运势查询 - 流式
const queryHoroscope = async () => {
  if (!selectedConstellation.value) return
  horoscopeLoading.value = true
  horoscopeResult.value = ''
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/xingzuo/stream/yunshi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || '' },
      body: JSON.stringify({ xingzuo: selectedConstellation.value, type: fortuneType.value })
    })
    await handleStreamResponse(response, (content) => { horoscopeResult.value = content })
  } catch (e) { horoscopeResult.value = '查询失败，请重试' }
  horoscopeLoading.value = false
}

// 生肖运势查询 - 流式
const queryZodiac = async () => {
  if (!selectedZodiac.value) return
  zodiacLoading.value = true
  zodiacResult.value = ''
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/xingzuo/stream/shengxiao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || '' },
      body: JSON.stringify({ shengxiao: selectedZodiac.value })
    })
    await handleStreamResponse(response, (content) => { zodiacResult.value = content })
  } catch (e) { zodiacResult.value = '查询失败，请重试' }
  zodiacLoading.value = false
}

// 抽签 - 流式
const drawLottery = async (type) => {
  lotteryResult.value = ''
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/xingzuo/stream/lottery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || '' },
      body: JSON.stringify({ type })
    })
    await handleStreamResponse(response, (content) => { lotteryResult.value = content })
  } catch (e) { lotteryResult.value = '抽签失败，请重试' }
}

// 星座查询 - 流式
const queryConstellation = async () => {
  if (!selectedConstellation.value) return
  constLoading.value = true
  constResult.value = ''
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/xingzuo/stream/chaxun`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || '' },
      body: JSON.stringify({ xingzuo: selectedConstellation.value })
    })
    await handleStreamResponse(response, (content) => { constResult.value = content })
  } catch (e) { constResult.value = '查询失败，请重试' }
  constLoading.value = false
}

// 生日密码查询 - 流式
const queryBirthday = async (type) => {
  if (!birthdayDate.value) return
  birthdayLoading.value = true
  birthdayResult.value = ''
  const [year, month, day] = birthdayDate.value.split('-')
  const urlMap = { password: 'shengrimima', book: 'shengrishu', flower: 'shengrihua' }
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/xingzuo/stream/${urlMap[type] || 'shengrimima'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || '' },
      body: JSON.stringify({ month, day })
    })
    await handleStreamResponse(response, (content) => { birthdayResult.value = content })
  } catch (e) { birthdayResult.value = '查询失败，请重试' }
  birthdayLoading.value = false
}

// 通用流式响应处理
const handleStreamResponse = async (response, onUpdate) => {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullContent = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value)
    const lines = text.split('\n')
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim()
        if (data && !data.includes('[DONE]')) {
          try {
            const json = JSON.parse(data)
            if (json.content) { fullContent += json.content; onUpdate(fullContent) }
          } catch { /* ignore */ }
        }
      }
    }
  }
}

onMounted(() => { checkLoginStatus() })
</script>


<style scoped>
.home-page { min-height: 100vh; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #fff; }

/* Header */
.home-header { display: flex; align-items: center; justify-content: space-between; padding: 15px 30px; background: rgba(0,0,0,0.3); position: sticky; top: 0; z-index: 100; }
.header-left .logo { display: flex; align-items: center; gap: 8px; }
.logo-icon { background: linear-gradient(135deg, #ffd700, #ff8c00); color: #1a1a2e; padding: 6px 12px; border-radius: 8px; font-weight: bold; }
.logo-text { font-size: 20px; font-weight: bold; background: linear-gradient(90deg, #ffd700, #ff8c00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.header-center { display: flex; gap: 30px; }
.header-center .nav-item { cursor: pointer; padding: 8px 16px; border-radius: 20px; transition: all 0.3s; }
.header-center .nav-item:hover, .header-center .nav-item.active { background: rgba(255,215,0,0.2); color: #ffd700; }
.header-right { display: flex; gap: 15px; align-items: center; }
.login-btn, .register-btn, .logout-btn { cursor: pointer; padding: 8px 20px; border-radius: 20px; transition: all 0.3s; }
.login-btn { border: 1px solid #ffd700; color: #ffd700; }
.register-btn { background: linear-gradient(135deg, #ffd700, #ff8c00); color: #1a1a2e; }
.logout-btn { color: #aaa; }
.login-btn:hover, .register-btn:hover { transform: scale(1.05); }
.user-info { color: #ffd700; }
.mobile-menu-btn { display: none; font-size: 24px; cursor: pointer; }

/* Mobile Nav */
.mobile-nav { display: none; background: rgba(0,0,0,0.9); padding: 20px; }
.mobile-nav .nav-item { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); }

/* Modal */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: #1a1a2e; border-radius: 16px; padding: 30px; width: 90%; max-width: 400px; border: 1px solid rgba(255,215,0,0.3); }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-header h3 { color: #ffd700; margin: 0; }
.close-btn { font-size: 24px; cursor: pointer; color: #aaa; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; color: #ccc; font-size: 14px; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; background: rgba(255,255,255,0.1); color: #fff; box-sizing: border-box; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #ffd700; outline: none; }
.form-tip { font-size: 12px; color: #ff8c00; margin-bottom: 15px; }
.optional { font-size: 12px; color: #888; }
.submit-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #ffd700, #ff8c00); color: #1a1a2e; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; transition: all 0.3s; }
.submit-btn:hover { transform: scale(1.02); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.modal-footer { text-align: center; margin-top: 15px; color: #888; }
.modal-footer a { color: #ffd700; cursor: pointer; margin-left: 5px; }

/* Main Content */
.main-content { padding: 30px; max-width: 1200px; margin: 0 auto; }

/* Home Tab */
.hero-section { text-align: center; padding: 60px 20px; }
.hero-section h1 { font-size: 42px; margin-bottom: 15px; background: linear-gradient(90deg, #ffd700, #ff8c00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-section p { font-size: 18px; color: #aaa; margin-bottom: 30px; }
.cta-btn { padding: 15px 40px; background: linear-gradient(135deg, #ffd700, #ff8c00); color: #1a1a2e; border: none; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; transition: all 0.3s; }
.cta-btn:hover { transform: scale(1.05); box-shadow: 0 10px 30px rgba(255,215,0,0.3); }

.features-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin: 50px 0; }
.feature-card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 30px; text-align: center; border: 1px solid rgba(255,215,0,0.1); transition: all 0.3s; }
.feature-card:hover { transform: translateY(-5px); border-color: rgba(255,215,0,0.3); }
.feature-icon { font-size: 48px; margin-bottom: 15px; }
.feature-card h3 { color: #ffd700; margin-bottom: 10px; }
.feature-card p { color: #aaa; font-size: 14px; }

.knowledge-section { margin-top: 50px; }
.knowledge-section h2 { text-align: center; color: #ffd700; margin-bottom: 30px; }
.knowledge-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
.knowledge-card { background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s; border: 1px solid transparent; }
.knowledge-card:hover { border-color: #ffd700; background: rgba(255,215,0,0.1); }
.k-icon { font-size: 32px; display: block; margin-bottom: 10px; }
.k-title { color: #fff; }

/* Paipan Tab */
.paipan-form, .hepan-form { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 30px; max-width: 600px; margin: 0 auto; }
.paipan-form h2, .hepan-form h2 { color: #ffd700; text-align: center; margin-bottom: 25px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
.paipan-btn { margin-top: 10px; }
.paipan-result, .hepan-result { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 30px; margin-top: 30px; max-width: 800px; margin-left: auto; margin-right: auto; }
.paipan-result h3, .hepan-result h3 { color: #ffd700; margin-bottom: 20px; }
.result-content { color: #ddd; line-height: 1.8; white-space: pre-wrap; }

/* Hepan Tab */
.person-section { margin-bottom: 25px; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 12px; }
.person-section h4 { color: #ffd700; margin-bottom: 15px; }

/* Learn Tab */
.learn-tab h2 { color: #ffd700; text-align: center; margin-bottom: 30px; }
.learn-categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; }
.learn-card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 25px; border: 1px solid rgba(255,215,0,0.1); }
.learn-icon { font-size: 40px; display: block; margin-bottom: 15px; }
.learn-card h3 { color: #ffd700; margin-bottom: 8px; }
.learn-card p { color: #888; font-size: 14px; margin-bottom: 15px; }
.learn-card ul { list-style: none; padding: 0; }
.learn-card li { padding: 8px 0; color: #ccc; border-bottom: 1px solid rgba(255,255,255,0.1); }
.learn-card li:last-child { border-bottom: none; }

/* Member Tab */
.member-tab h2 { color: #ffd700; text-align: center; margin-bottom: 30px; }
.vip-info { text-align: center; margin-bottom: 40px; padding: 30px; background: rgba(255,255,255,0.05); border-radius: 16px; }
.vip-badge { display: inline-block; padding: 10px 30px; border-radius: 30px; font-weight: bold; margin-bottom: 15px; }
.vip-badge.level-0 { background: #666; color: #fff; }
.vip-badge.level-1 { background: linear-gradient(135deg, #ffd700, #ff8c00); color: #1a1a2e; }
.vip-badge.level-2 { background: linear-gradient(135deg, #00d4ff, #7b2ff7); color: #fff; }
.vip-info p { color: #aaa; }

.vip-plans h3, .vip-benefits h3 { color: #ffd700; margin-bottom: 20px; }
.plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
.plan-card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 25px; text-align: center; border: 2px solid transparent; position: relative; transition: all 0.3s; }
.plan-card:hover { border-color: rgba(255,215,0,0.5); }
.plan-card.recommended { border-color: #ffd700; }
.plan-badge { position: absolute; top: -10px; right: 20px; background: #ff4757; color: #fff; padding: 4px 12px; border-radius: 10px; font-size: 12px; }
.plan-card h4 { color: #fff; margin-bottom: 15px; }
.plan-price { margin-bottom: 5px; }
.plan-price .currency { font-size: 18px; color: #ffd700; }
.plan-price .amount { font-size: 36px; font-weight: bold; color: #ffd700; }
.plan-original { color: #888; text-decoration: line-through; font-size: 14px; margin-bottom: 10px; }
.plan-duration { color: #aaa; margin-bottom: 20px; }
.buy-btn { padding: 12px 30px; background: linear-gradient(135deg, #ffd700, #ff8c00); color: #1a1a2e; border: none; border-radius: 25px; font-weight: bold; cursor: pointer; transition: all 0.3s; }
.buy-btn:hover { transform: scale(1.05); }

.benefits-table { width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.05); border-radius: 12px; overflow: hidden; }
.benefits-table th, .benefits-table td { padding: 15px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); }
.benefits-table th { background: rgba(255,215,0,0.2); color: #ffd700; }
.benefits-table td { color: #ccc; }

/* Floating Feedback */
.floating-feedback { position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; background: linear-gradient(135deg, #ffd700, #ff8c00); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 5px 20px rgba(255,215,0,0.4); transition: all 0.3s; z-index: 99; }
.floating-feedback:hover { transform: scale(1.1); }
.floating-feedback span { font-size: 28px; }

/* Responsive */
@media (max-width: 768px) {
  .header-center { display: none; }
  .header-right { display: none; }
  .mobile-menu-btn { display: block; }
  .mobile-nav { display: block; }
  .hero-section h1 { font-size: 28px; }
  .hero-section p { font-size: 14px; }
  .form-row { grid-template-columns: 1fr; }
  .plans-grid { grid-template-columns: 1fr; }
  .benefits-table { font-size: 12px; }
  .benefits-table th, .benefits-table td { padding: 10px 5px; }
  .divination-grid { grid-template-columns: repeat(2, 1fr); }
  .constellation-select { grid-template-columns: repeat(4, 1fr); }
  .zodiac-select { grid-template-columns: repeat(4, 1fr); }
}

/* AI问卦 Tab */
.divination-tab h2 { color: #ffd700; text-align: center; margin-bottom: 30px; }
.divination-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
.divination-card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 25px; text-align: center; cursor: pointer; border: 2px solid transparent; transition: all 0.3s; }
.divination-card:hover, .divination-card.active { border-color: #ffd700; background: rgba(255,215,0,0.1); }
.divination-card.main-chat { grid-column: span 3; background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,140,0,0.1)); }
.div-icon { font-size: 40px; margin-bottom: 10px; display: block; }
.divination-card h3 { color: #ffd700; margin-bottom: 8px; font-size: 18px; }
.divination-card p { color: #aaa; font-size: 13px; }

/* Chat Section */
.chat-section { margin-top: 20px; }
.chat-container { background: rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden; }
.chat-messages { height: 400px; overflow-y: auto; padding: 20px; }
.chat-msg { margin-bottom: 15px; display: flex; }
.chat-msg.user { justify-content: flex-end; }
.chat-msg.assistant { justify-content: flex-start; }
.msg-content { max-width: 80%; padding: 12px 18px; border-radius: 16px; line-height: 1.6; }
.chat-msg.user .msg-content { background: linear-gradient(135deg, #ffd700, #ff8c00); color: #1a1a2e; border-radius: 16px 16px 4px 16px; }
.chat-msg.assistant .msg-content { background: rgba(255,255,255,0.1); color: #ddd; border-radius: 16px 16px 16px 4px; }
.msg-content.typing { color: #ffd700; }
.chat-input-area { display: flex; gap: 10px; padding: 15px; background: rgba(0,0,0,0.2); }
.chat-input-area input { flex: 1; padding: 12px 18px; border: 1px solid rgba(255,255,255,0.2); border-radius: 25px; background: rgba(255,255,255,0.1); color: #fff; }
.chat-input-area input:focus { border-color: #ffd700; outline: none; }
.chat-input-area button { padding: 12px 25px; background: linear-gradient(135deg, #ffd700, #ff8c00); color: #1a1a2e; border: none; border-radius: 25px; font-weight: bold; cursor: pointer; }
.chat-input-area button:disabled { opacity: 0.5; cursor: not-allowed; }

/* Divination Sections */
.divination-section { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 30px; margin-top: 20px; }
.divination-section h3 { color: #ffd700; text-align: center; margin-bottom: 20px; }
.section-desc { text-align: center; color: #aaa; margin-bottom: 20px; }

/* Constellation Select */
.constellation-select { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-bottom: 20px; }
.const-item { background: rgba(255,255,255,0.05); border-radius: 12px; padding: 15px 10px; text-align: center; cursor: pointer; border: 2px solid transparent; transition: all 0.3s; }
.const-item:hover, .const-item.active { border-color: #ffd700; background: rgba(255,215,0,0.1); }
.const-icon { font-size: 24px; display: block; margin-bottom: 5px; }
.const-name { font-size: 12px; color: #ccc; }
.const-item.active .const-name { color: #ffd700; }

/* Time Tabs */
.time-tabs { display: flex; justify-content: center; gap: 15px; margin-bottom: 20px; }
.time-tabs span { padding: 8px 20px; border-radius: 20px; cursor: pointer; background: rgba(255,255,255,0.1); color: #aaa; transition: all 0.3s; }
.time-tabs span:hover, .time-tabs span.active { background: rgba(255,215,0,0.2); color: #ffd700; }

/* Zodiac Select */
.zodiac-select { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-bottom: 20px; }
.zodiac-item { background: rgba(255,255,255,0.05); border-radius: 12px; padding: 15px 10px; text-align: center; cursor: pointer; border: 2px solid transparent; transition: all 0.3s; }
.zodiac-item:hover, .zodiac-item.active { border-color: #ffd700; background: rgba(255,215,0,0.1); }
.zodiac-icon { font-size: 28px; display: block; margin-bottom: 5px; }
.zodiac-name { font-size: 12px; color: #ccc; }
.zodiac-item.active .zodiac-name { color: #ffd700; }

/* Query Button */
.query-btn { display: block; margin: 0 auto 20px; padding: 12px 40px; background: linear-gradient(135deg, #ffd700, #ff8c00); color: #1a1a2e; border: none; border-radius: 25px; font-weight: bold; cursor: pointer; transition: all 0.3s; }
.query-btn:hover { transform: scale(1.05); }
.query-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Lottery Types */
.lottery-types { display: flex; justify-content: center; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; }
.lottery-card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 25px 35px; text-align: center; cursor: pointer; border: 2px solid transparent; transition: all 0.3s; }
.lottery-card:hover { border-color: #ffd700; background: rgba(255,215,0,0.1); transform: translateY(-3px); }
.lottery-icon { font-size: 36px; display: block; margin-bottom: 10px; }
.lottery-card span:last-child { color: #ccc; }

/* Birthday Form */
.birthday-form { max-width: 300px; margin: 0 auto 20px; }
.birthday-types { display: flex; justify-content: center; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; }
.birthday-types button { padding: 10px 25px; background: rgba(255,255,255,0.1); color: #ccc; border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; cursor: pointer; transition: all 0.3s; }
.birthday-types button:hover { background: rgba(255,215,0,0.2); color: #ffd700; border-color: #ffd700; }
.birthday-types button:disabled { opacity: 0.5; cursor: not-allowed; }

/* Fortune Result */
.fortune-result { background: rgba(0,0,0,0.2); border-radius: 12px; padding: 20px; color: #ddd; line-height: 1.8; white-space: pre-wrap; }
.fortune-result .result-card { }
.fortune-result .result-item { padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
.fortune-result .result-item:last-child { border-bottom: none; }
.fortune-result .label { color: #ffd700; margin-right: 10px; }
.fortune-result .value { color: #ddd; }
.fortune-result .loading { text-align: center; color: #ffd700; }

@media (max-width: 768px) {
  .divination-card.main-chat { grid-column: span 2; }
}
</style>
