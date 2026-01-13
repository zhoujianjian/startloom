<template>
  <div class="home-page" :class="'theme-' + currentTheme">
    <!-- 主题面板 -->
    <div class="theme-panel" v-if="showThemePanel">
      <div class="theme-panel-header">选择主题</div>
      <div class="theme-option" v-for="t in themeList" :key="t.key" :class="{ active: currentTheme === t.key }" @click="changeTheme(t.key)">
        <span class="theme-opt-icon">{{ t.icon }}</span>
        <span class="theme-opt-name">{{ t.name }}</span>
      </div>
    </div>

    <!-- 顶部Header -->
    <div class="home-header">
      <div class="header-left">
        <div class="logo"><span class="logo-icon">八字</span><span class="logo-text">天机命理</span></div>
      </div>
      <div class="header-center">
        <div class="nav-item" :class="{ active: currentTab === 'home' }" @click="currentTab = 'home'">排盘首页</div>
        <div class="nav-item" :class="{ active: currentTab === 'paipan' }" @click="currentTab = 'paipan'">八字排盘</div>
        <div class="nav-item" :class="{ active: currentTab === 'hepan' }" @click="currentTab = 'hepan'">八字合盘</div>
        <div class="nav-item" :class="{ active: currentTab === 'calendar' }" @click="currentTab = 'calendar'">万年历</div>
        <div class="nav-item" :class="{ active: currentTab === 'divination' }" @click="currentTab = 'divination'">AI问卦</div>
        <div class="nav-item" @click="goToLearn">学习课堂</div>
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
        <span class="theme-btn" @click="showThemePanel = !showThemePanel">{{ themeList.find(t => t.key === currentTheme)?.icon || '🎨' }}</span>
      </div>
      <div class="mobile-header-right">
        <span class="theme-btn-mobile" @click="showThemePanel = !showThemePanel">{{ themeList.find(t => t.key === currentTheme)?.icon || '🎨' }}</span>
        <span class="mobile-menu-btn" @click="showMobileMenu = !showMobileMenu">☰</span>
      </div>
    </div>

    <!-- 移动端导航 -->
    <div class="mobile-nav" v-if="showMobileMenu">
      <div class="mobile-user-section" v-if="isLoggedIn">
        <span class="mobile-user-name">👤 {{ userNickname }}</span>
        <span class="mobile-logout" @click="handleLogout">退出</span>
      </div>
      <div class="mobile-user-section" v-else>
        <span class="mobile-login" @click="showLoginModal = true; showMobileMenu = false">登录</span>
        <span class="mobile-register" @click="showRegisterModal = true; showMobileMenu = false">注册</span>
      </div>
      <div class="nav-item" @click="switchTab('home')">排盘首页</div>
      <div class="nav-item" @click="switchTab('paipan')">八字排盘</div>
      <div class="nav-item" @click="switchTab('hepan')">八字合盘</div>
      <div class="nav-item" @click="switchTab('calendar')">万年历</div>
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

    <!-- 支付弹窗 -->
    <div class="modal-overlay" v-if="showPayModal" @click.self="showPayModal = false">
      <div class="modal-content pay-modal">
        <div class="modal-header"><h3>支付订单</h3><span class="close-btn" @click="showPayModal = false">×</span></div>
        <div class="modal-body">
          <div class="order-info">
            <div class="order-row"><span>套餐：</span><span>{{ currentOrder.planName }}</span></div>
            <div class="order-row"><span>金额：</span><span class="price">¥{{ currentOrder.amount }}</span></div>
            <div class="order-row"><span>订单号：</span><span>{{ currentOrder.orderNo }}</span></div>
          </div>
          <div class="pay-methods" v-if="!payStep">
            <h4>选择支付方式</h4>
            <div class="pay-method-list">
              <div class="pay-method" v-if="paymentOptions.qrcode?.wechat || paymentOptions.official?.wechat" @click="selectPayMethod('wechat')">
                <span class="pay-icon">💚</span><span>微信支付</span>
              </div>
              <div class="pay-method" v-if="paymentOptions.qrcode?.alipay || paymentOptions.official?.alipay" @click="selectPayMethod('alipay')">
                <span class="pay-icon">💙</span><span>支付宝</span>
              </div>
            </div>
          </div>
          <div class="qrcode-pay" v-if="payStep === 'qrcode'">
            <h4>请扫码支付 ¥{{ currentOrder.amount }}</h4>
            <div class="qrcode-img">
              <img :src="currentOrder.qrcodeUrl" alt="收款码" v-if="currentOrder.qrcodeUrl" />
              <div class="no-qrcode" v-else>收款码未配置</div>
            </div>
            <div class="pay-tips">
              <p>1. 请使用{{ currentOrder.payType === 'wechat' ? '微信' : '支付宝' }}扫描上方二维码</p>
              <p>2. 支付金额：<strong>¥{{ currentOrder.amount }}</strong></p>
              <p>3. 转账备注请填写：<strong>{{ currentOrder.remark }}</strong></p>
            </div>
            <div class="form-group">
              <label>转账备注（选填）</label>
              <input v-model="payRemark" type="text" :placeholder="'建议填写: ' + currentOrder.remark" />
            </div>
            <button class="submit-btn" @click="confirmPaid" :disabled="confirmLoading">{{ confirmLoading ? '提交中...' : '我已支付完成' }}</button>
            <p class="pay-note">提交后请等待管理员确认，确认后会员将自动开通</p>
          </div>
          <div class="pay-result" v-if="payStep === 'pending'">
            <div class="result-icon">⏳</div>
            <h4>已提交，等待确认</h4>
            <p>您的支付信息已提交，管理员确认后会员将自动开通</p>
            <button class="submit-btn" @click="showPayModal = false">知道了</button>
          </div>
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
          <div class="feature-card" v-for="item in features" :key="item.title" @click="switchTab(item.tab)">
            <div class="feature-icon">{{ item.icon }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
        <!-- 首页大师服务引导 - 紧凑横幅式 -->
        <MasterService mode="compact" />
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
            <div class="form-group">
              <label>出生日期</label>
              <div class="date-selects">
                <select v-model="paipanForm.birthYear" class="year-select">
                  <option value="">年</option>
                  <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}年</option>
                </select>
                <select v-model="paipanForm.birthMonth" class="month-select">
                  <option value="">月</option>
                  <option v-for="m in 12" :key="m" :value="m">{{ m }}月</option>
                </select>
                <select v-model="paipanForm.birthDay" class="day-select">
                  <option value="">日</option>
                  <option v-for="d in daysInMonth(paipanForm.birthYear, paipanForm.birthMonth)" :key="d" :value="d">{{ d }}日</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>出生时辰</label>
              <select v-model="paipanForm.birthHour">
                <option v-for="h in hourOptions" :key="h.value" :value="h.value">{{ h.label }}</option>
              </select>
            </div>
            <div class="form-group"><label>出生地址</label><input v-model="paipanForm.birthPlace" placeholder="省/市" /></div>
          </div>
          <button type="button" class="submit-btn paipan-btn" @click="handlePaipan" :disabled="paipanLoading">{{ paipanLoading ? '排盘中...' : '开始排盘' }}</button>
        </div>
        <div class="paipan-result" v-if="paipanResult">
          <h3>排盘结果</h3>
          <div class="result-content">{{ paipanResult }}</div>
        </div>
        <!-- 排盘后显示大师服务引导 -->
        <MasterService v-if="paipanResult" />
      </div>

      <!-- 八字合盘 -->
      <div v-if="currentTab === 'hepan'" class="tab-content hepan-tab">
        <div class="hepan-form">
          <h2>八字合盘</h2>
          <div class="person-section">
            <h4>男方信息</h4>
            <div class="form-row">
              <div class="form-group"><label>姓名</label><input v-model="hepanForm.maleName" placeholder="男方姓名" /></div>
              <div class="form-group">
                <label>出生日期</label>
                <div class="date-selects">
                  <select v-model="hepanForm.maleYear" class="year-select">
                    <option value="">年</option>
                    <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}年</option>
                  </select>
                  <select v-model="hepanForm.maleMonth" class="month-select">
                    <option value="">月</option>
                    <option v-for="m in 12" :key="m" :value="m">{{ m }}月</option>
                  </select>
                  <select v-model="hepanForm.maleDay" class="day-select">
                    <option value="">日</option>
                    <option v-for="d in daysInMonth(hepanForm.maleYear, hepanForm.maleMonth)" :key="d" :value="d">{{ d }}日</option>
                  </select>
                </div>
              </div>
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
              <div class="form-group">
                <label>出生日期</label>
                <div class="date-selects">
                  <select v-model="hepanForm.femaleYear" class="year-select">
                    <option value="">年</option>
                    <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}年</option>
                  </select>
                  <select v-model="hepanForm.femaleMonth" class="month-select">
                    <option value="">月</option>
                    <option v-for="m in 12" :key="m" :value="m">{{ m }}月</option>
                  </select>
                  <select v-model="hepanForm.femaleDay" class="day-select">
                    <option value="">日</option>
                    <option v-for="d in daysInMonth(hepanForm.femaleYear, hepanForm.femaleMonth)" :key="d" :value="d">{{ d }}日</option>
                  </select>
                </div>
              </div>
              <div class="form-group"><label>时辰</label>
                <select v-model="hepanForm.femaleBirthHour">
                  <option v-for="h in hourOptions" :key="h.value" :value="h.value">{{ h.label }}</option>
                </select>
              </div>
            </div>
          </div>
          <button type="button" class="submit-btn" @click="handleHepan" :disabled="hepanLoading">{{ hepanLoading ? '合盘中...' : '开始合盘' }}</button>
        </div>
        <div class="hepan-result" v-if="hepanResult">
          <h3>合盘结果</h3>
          <div class="result-content">{{ hepanResult }}</div>
        </div>
        <!-- 合盘后显示大师服务引导 -->
        <MasterService v-if="hepanResult" />
      </div>

      <!-- 万年历 -->
      <div v-if="currentTab === 'calendar'" class="tab-content calendar-tab">
        <div class="calendar-header">
          <h2>📅 万年历</h2>
          <p class="calendar-subtitle">农历查询 · 黄道吉日 · 节气宜忌</p>
        </div>
        
        <!-- 日期选择器 -->
        <div class="calendar-picker">
          <div class="picker-row">
            <button class="picker-btn" @click="changeMonth(-1)">◀</button>
            <div class="picker-display">
              <select v-model="calendarYear" class="year-picker" @change="updateCalendar">
                <option v-for="y in calendarYearOptions" :key="y" :value="y">{{ y }}年</option>
              </select>
              <select v-model="calendarMonth" class="month-picker" @change="updateCalendar">
                <option v-for="m in 12" :key="m" :value="m">{{ m }}月</option>
              </select>
            </div>
            <button class="picker-btn" @click="changeMonth(1)">▶</button>
            <button class="today-btn" @click="goToday">今天</button>
          </div>
        </div>

        <!-- 今日信息卡片 -->
        <div class="today-info-card">
          <div class="today-main">
            <div class="today-date">
              <span class="day-num">{{ todayInfo.day }}</span>
              <div class="date-detail">
                <span class="weekday">{{ todayInfo.weekday }}</span>
                <span class="solar">{{ todayInfo.solar }}</span>
              </div>
            </div>
            <div class="today-lunar">
              <div class="lunar-date">{{ todayInfo.lunar }}</div>
              <div class="lunar-ganzhi">{{ todayInfo.ganzhi }}</div>
            </div>
          </div>
          <div class="today-extra">
            <div class="extra-item">
              <span class="extra-label">节气</span>
              <span class="extra-value">{{ todayInfo.jieqi || '—' }}</span>
            </div>
            <div class="extra-item">
              <span class="extra-label">生肖</span>
              <span class="extra-value">{{ todayInfo.shengxiao }}</span>
            </div>
            <div class="extra-item">
              <span class="extra-label">星座</span>
              <span class="extra-value">{{ todayInfo.xingzuo }}</span>
            </div>
          </div>
        </div>

        <!-- 宜忌信息 -->
        <div class="yiji-card">
          <div class="yi-section">
            <div class="yi-title"><span class="yi-icon">✓</span>宜</div>
            <div class="yi-content">{{ todayInfo.yi }}</div>
          </div>
          <div class="ji-section">
            <div class="ji-title"><span class="ji-icon">✗</span>忌</div>
            <div class="ji-content">{{ todayInfo.ji }}</div>
          </div>
        </div>

        <!-- 日历网格 -->
        <div class="calendar-grid">
          <div class="calendar-weekdays">
            <span v-for="w in ['日', '一', '二', '三', '四', '五', '六']" :key="w" class="weekday-item">{{ w }}</span>
          </div>
          <div class="calendar-days">
            <div 
              v-for="(day, idx) in calendarDays" 
              :key="idx" 
              class="day-cell"
              :class="{ 
                'other-month': day.otherMonth, 
                'today': day.isToday,
                'selected': day.isSelected,
                'weekend': day.isWeekend
              }"
              @click="selectDay(day)"
            >
              <span class="day-solar">{{ day.solar }}</span>
              <span class="day-lunar">{{ day.lunar }}</span>
            </div>
          </div>
        </div>

        <!-- 引导转化 -->
        <div class="calendar-cta">
          <p>想知道这一天适合做什么？</p>
          <button class="cta-btn" @click="currentTab = 'paipan'">🔮 八字排盘看运势</button>
          <button class="cta-btn secondary" @click="showMasterModal">🧙 咨询大师选吉日</button>
        </div>

        <!-- 大师服务 -->
        <MasterService mode="compact" />
      </div>

      <!-- AI问卦 -->
      <div v-if="currentTab === 'divination'" class="tab-content divination-tab">
        <h2>AI智能问卦</h2>
        <!-- 功能标签栏 - 横向滚动 -->
        <div class="div-tabs-wrapper">
          <div class="div-tabs">
            <div class="div-tab" :class="{ active: activeDiv === 'chat' }" @click="activeDiv = 'chat'">
              <span class="tab-icon">🤖</span><span class="tab-name">AI问答</span>
            </div>
            <div class="div-tab" :class="{ active: activeDiv === 'horoscope' }" @click="activeDiv = 'horoscope'">
              <span class="tab-icon">⭐</span><span class="tab-name">星座运势</span>
            </div>
            <div class="div-tab" :class="{ active: activeDiv === 'zodiac' }" @click="activeDiv = 'zodiac'">
              <span class="tab-icon">🐲</span><span class="tab-name">生肖运势</span>
            </div>
            <div class="div-tab" :class="{ active: activeDiv === 'lottery' }" @click="activeDiv = 'lottery'">
              <span class="tab-icon">🎋</span><span class="tab-name">抽签算命</span>
            </div>
            <div class="div-tab" :class="{ active: activeDiv === 'constellation' }" @click="activeDiv = 'constellation'">
              <span class="tab-icon">♈</span><span class="tab-name">星座查询</span>
            </div>
            <div class="div-tab" :class="{ active: activeDiv === 'birthday' }" @click="activeDiv = 'birthday'">
              <span class="tab-icon">🎂</span><span class="tab-name">生日密码</span>
            </div>
          </div>
        </div>
        
        <!-- AI对话 -->
        <div class="div-content" v-if="activeDiv === 'chat'">
          <div class="chat-container">
            <div class="chat-messages" ref="chatMessagesRef">
              <div v-for="(msg, idx) in chatMessages" :key="idx" :class="['chat-msg', msg.role]">
                <div class="msg-content">{{ msg.content }}</div>
              </div>
            </div>
            <div class="chat-input-area">
              <input v-model="chatInput" @keyup.enter="sendChatMessage" placeholder="请输入您的问题..." />
              <button @click="sendChatMessage" :disabled="chatLoading">发送</button>
            </div>
          </div>
        </div>
        
        <!-- 星座运势 -->
        <div class="div-content" v-if="activeDiv === 'horoscope'">
          <div class="select-grid constellation-select">
            <div class="select-item" v-for="c in constellations" :key="c.name" :class="{ active: selectedConstellation === c.name }" @click="selectConstellation(c.name)">
              <span class="item-icon">{{ c.icon }}</span><span class="item-name">{{ c.name }}</span>
            </div>
          </div>
          <div class="action-bar" v-if="selectedConstellation">
            <div class="time-tabs">
              <span :class="{ active: fortuneType === 'today' }" @click="fortuneType = 'today'">今日</span>
              <span :class="{ active: fortuneType === 'week' }" @click="fortuneType = 'week'">本周</span>
              <span :class="{ active: fortuneType === 'month' }" @click="fortuneType = 'month'">本月</span>
            </div>
            <button class="action-btn" @click="queryHoroscope" :disabled="horoscopeLoading">{{ horoscopeLoading ? '查询中...' : '查询 ' + selectedConstellation + ' 运势' }}</button>
          </div>
          <div class="result-box" v-if="horoscopeResult">{{ horoscopeResult }}</div>
        </div>
        
        <!-- 生肖运势 -->
        <div class="div-content" v-if="activeDiv === 'zodiac'">
          <div class="select-grid zodiac-select">
            <div class="select-item" v-for="z in zodiacList" :key="z.name" :class="{ active: selectedZodiac === z.name }" @click="selectZodiac(z.name)">
              <span class="item-icon">{{ z.icon }}</span><span class="item-name">{{ z.name }}</span>
            </div>
          </div>
          <div class="action-bar" v-if="selectedZodiac">
            <button class="action-btn" @click="queryZodiac" :disabled="zodiacLoading">{{ zodiacLoading ? '查询中...' : '查询 ' + selectedZodiac + ' 运势' }}</button>
          </div>
          <div class="result-box" v-if="zodiacResult">{{ zodiacResult }}</div>
        </div>
        
        <!-- 抽签 -->
        <div class="div-content" v-if="activeDiv === 'lottery'">
          <div class="lottery-grid">
            <div class="lottery-item" @click="drawLottery('guanyin')"><span class="lottery-icon">🙏</span><span class="lottery-name">观音灵签</span></div>
            <div class="lottery-item" @click="drawLottery('yuelao')"><span class="lottery-icon">💕</span><span class="lottery-name">月老灵签</span></div>
            <div class="lottery-item" @click="drawLottery('caishen')"><span class="lottery-icon">💰</span><span class="lottery-name">财神灵签</span></div>
          </div>
          <div class="result-box" v-if="lotteryResult">{{ lotteryResult }}</div>
        </div>
        
        <!-- 星座查询 -->
        <div class="div-content" v-if="activeDiv === 'constellation'">
          <div class="select-grid constellation-select">
            <div class="select-item" v-for="c in constellations" :key="c.name" :class="{ active: selectedConstellation === c.name }" @click="selectedConstellation = c.name">
              <span class="item-icon">{{ c.icon }}</span><span class="item-name">{{ c.name }}</span>
            </div>
          </div>
          <div class="action-bar" v-if="selectedConstellation">
            <button class="action-btn" @click="queryConstellation" :disabled="constLoading">{{ constLoading ? '查询中...' : '查询 ' + selectedConstellation + ' 详情' }}</button>
          </div>
          <div class="result-box" v-if="constResult">{{ constResult }}</div>
        </div>
        
        <!-- 生日密码 -->
        <div class="div-content" v-if="activeDiv === 'birthday'">
          <div class="birthday-input">
            <label>选择您的生日</label>
            <input type="date" v-model="birthdayDate" />
          </div>
          <div class="birthday-btns" v-if="birthdayDate">
            <button class="birthday-btn" @click="queryBirthday('password')" :disabled="birthdayLoading">🔮 生日密码</button>
            <button class="birthday-btn" @click="queryBirthday('book')" :disabled="birthdayLoading">📖 生日书</button>
            <button class="birthday-btn" @click="queryBirthday('flower')" :disabled="birthdayLoading">🌸 生日花</button>
          </div>
          <div class="result-box" v-if="birthdayResult">{{ birthdayResult }}</div>
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
          </div>
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
                <td>{{ b.name }}</td><td>{{ b.normal || '—' }}</td><td>{{ b.gold || '—' }}</td><td>{{ b.diamond || '✓' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 悬浮留言按钮 -->
    <div class="floating-feedback" @click="showFeedbackModal = true"><span>💬</span></div>
    
    <!-- 底部悬浮大师服务横幅 -->
    <MasterFloatBar />
  </div>
</template>


<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { userLogin, simpleRegister, loginOut, checkLogin, getVipPlans, getVipBenefits, getVipInfo, createVipOrder, submitFeedback, getPaymentOptions, createPayOrder, confirmPayment } from '../api/api'
import { ElMessage } from 'element-plus'
import { themes, getCurrentTheme, setTheme, initTheme } from '../utils/themes'
import MasterService from './MasterService.vue'
import MasterFloatBar from './MasterFloatBar.vue'

const router = useRouter()

// 主题相关
const currentTheme = ref(getCurrentTheme())
const showThemePanel = ref(false)
const themeList = Object.entries(themes).map(([key, val]) => ({ key, name: val.name, icon: val.icon }))

const changeTheme = (themeName) => {
  currentTheme.value = themeName
  setTheme(themeName)
  showThemePanel.value = false
}

const currentTab = ref('home')
const showMobileMenu = ref(false)
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const showFeedbackModal = ref(false)
const showPayModal = ref(false)
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

// 支付相关
const payStep = ref('')
const paymentOptions = ref({})
const currentOrder = ref({})
const payRemark = ref('')
const confirmLoading = ref(false)

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
const horoscopeAction = ref(null)
const selectedZodiac = ref('')
const zodiacLoading = ref(false)

// 万年历相关
const now = new Date()
const calendarYear = ref(now.getFullYear())
const calendarMonth = ref(now.getMonth() + 1)
const calendarDays = ref([])
const selectedDate = ref(null)
const calendarYearOptions = computed(() => {
  const years = []
  for (let y = 1900; y <= 2100; y++) years.push(y)
  return years
})

// 农历数据（简化版）
const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557
]
const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊']
const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十']
const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const shengXiao = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
const xingZuo = ['摩羯座', '水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座']
const xingZuoDays = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22]
const jieQi = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至']

// 宜忌数据（简化）
const yiList = ['祭祀', '祈福', '求嗣', '开光', '出行', '解除', '动土', '起基', '开市', '交易', '立券', '挂匾', '入宅', '移徙', '安床', '栽种', '纳畜', '入殓', '破土', '安葬']
const jiList = ['嫁娶', '开市', '安葬', '破土', '动土', '词讼', '出行', '移徙', '入宅', '安床']

// 今日信息
const todayInfo = computed(() => {
  const d = selectedDate.value || new Date()
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  
  // 简化的农历计算
  const lunarDate = solarToLunar(year, month, day)
  const ganzhiYear = tianGan[(year - 4) % 10] + diZhi[(year - 4) % 12]
  const sx = shengXiao[(year - 4) % 12]
  const xz = getXingzuo(month, day)
  
  // 随机宜忌（实际应该根据日期计算）
  const seed = year * 10000 + month * 100 + day
  const yiCount = 3 + (seed % 4)
  const jiCount = 2 + (seed % 3)
  const yi = yiList.slice(seed % 10, seed % 10 + yiCount).join(' · ')
  const ji = jiList.slice(seed % 5, seed % 5 + jiCount).join(' · ')
  
  return {
    day: day,
    weekday: weekdays[d.getDay()],
    solar: `${year}年${month}月${day}日`,
    lunar: `${lunarMonths[lunarDate.month - 1]}月${lunarDays[lunarDate.day - 1]}`,
    ganzhi: `${ganzhiYear}年`,
    shengxiao: sx,
    xingzuo: xz,
    jieqi: getJieqi(month, day),
    yi: yi,
    ji: ji
  }
})

// 简化的公历转农历
const solarToLunar = (year, month, day) => {
  // 简化版本，返回近似农历
  const baseDate = new Date(1900, 0, 31)
  const targetDate = new Date(year, month - 1, day)
  let offset = Math.floor((targetDate - baseDate) / 86400000)
  
  let lunarYear = 1900
  let lunarMonth = 1
  let lunarDay = 1
  
  // 简化计算
  const daysInYear = 354 + (year % 3 === 0 ? 30 : 0)
  lunarYear = year
  const dayOfYear = Math.floor((targetDate - new Date(year, 0, 1)) / 86400000)
  lunarMonth = Math.floor(dayOfYear / 30) + 1
  lunarDay = (dayOfYear % 30) + 1
  
  if (lunarMonth > 12) lunarMonth = 12
  if (lunarDay > 30) lunarDay = 30
  
  return { year: lunarYear, month: lunarMonth, day: lunarDay }
}

// 获取星座
const getXingzuo = (month, day) => {
  return day < xingZuoDays[month - 1] ? xingZuo[month - 1] : xingZuo[month]
}

// 获取节气（简化）
const getJieqi = (month, day) => {
  const jqDays = [6, 20, 4, 19, 6, 21, 5, 20, 6, 21, 6, 21, 7, 23, 8, 23, 8, 23, 9, 24, 8, 22, 7, 22]
  const idx = (month - 1) * 2
  if (day === jqDays[idx]) return jieQi[idx]
  if (day === jqDays[idx + 1]) return jieQi[idx + 1]
  return ''
}

// 更新日历
const updateCalendar = () => {
  const year = calendarYear.value
  const month = calendarMonth.value
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const startWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  
  const days = []
  const today = new Date()
  
  // 上月末尾
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year
  const prevLastDay = new Date(prevYear, prevMonth, 0).getDate()
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = prevLastDay - i
    const lunar = solarToLunar(prevYear, prevMonth, d)
    days.push({
      solar: d,
      lunar: lunarDays[lunar.day - 1],
      otherMonth: true,
      isToday: false,
      isSelected: false,
      isWeekend: false,
      date: new Date(prevYear, prevMonth - 1, d)
    })
  }
  
  // 本月
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d)
    const lunar = solarToLunar(year, month, d)
    const isToday = date.toDateString() === today.toDateString()
    const isSelected = selectedDate.value && date.toDateString() === selectedDate.value.toDateString()
    days.push({
      solar: d,
      lunar: lunarDays[lunar.day - 1],
      otherMonth: false,
      isToday,
      isSelected,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      date
    })
  }
  
  // 下月开头
  const remaining = 42 - days.length
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year
  for (let d = 1; d <= remaining; d++) {
    const lunar = solarToLunar(nextYear, nextMonth, d)
    days.push({
      solar: d,
      lunar: lunarDays[lunar.day - 1],
      otherMonth: true,
      isToday: false,
      isSelected: false,
      isWeekend: false,
      date: new Date(nextYear, nextMonth - 1, d)
    })
  }
  
  calendarDays.value = days
}

const changeMonth = (delta) => {
  let m = calendarMonth.value + delta
  let y = calendarYear.value
  if (m < 1) { m = 12; y-- }
  if (m > 12) { m = 1; y++ }
  calendarMonth.value = m
  calendarYear.value = y
  updateCalendar()
}

const goToday = () => {
  const today = new Date()
  calendarYear.value = today.getFullYear()
  calendarMonth.value = today.getMonth() + 1
  selectedDate.value = today
  updateCalendar()
}

const selectDay = (day) => {
  if (!day.otherMonth) {
    selectedDate.value = day.date
    updateCalendar()
  }
}

const showMasterModal = () => {
  // 触发 MasterService 组件的弹窗
  const masterService = document.querySelector('.master-service-wrapper .consult-btn')
  if (masterService) masterService.click()
}
const zodiacResult = ref('')
const zodiacAction = ref(null)
const lotteryResult = ref('')
const constLoading = ref(false)
const constResult = ref('')
const birthdayDate = ref('')
const birthdayLoading = ref(false)
const birthdayResult = ref('')

const loginForm = reactive({ account: '', password: '' })
const registerForm = reactive({ phone: '', email: '', wechat: '', password: '', confirmPassword: '' })
const feedbackForm = reactive({ nickname: '', contact: '', content: '' })
const paipanForm = reactive({ name: '', gender: '男', calendar: '公历', birthYear: '', birthMonth: '', birthDay: '', birthHour: '子时', birthPlace: '' })
const hepanForm = reactive({ maleName: '', maleYear: '', maleMonth: '', maleDay: '', maleBirthHour: '子时', femaleName: '', femaleYear: '', femaleMonth: '', femaleDay: '', femaleBirthHour: '子时' })

// 年份选项 (1920-当前年份)
const currentYear = new Date().getFullYear()
const yearOptions = []
for (let y = currentYear; y >= 1920; y--) {
  yearOptions.push(y)
}

// 计算每月天数
const daysInMonth = (year, month) => {
  if (!year || !month) return 31
  const y = parseInt(year)
  const m = parseInt(month)
  return new Date(y, m, 0).getDate()
}

const hourOptions = [
  { value: '子时', label: '子时 (23:00-01:00)' }, { value: '丑时', label: '丑时 (01:00-03:00)' },
  { value: '寅时', label: '寅时 (03:00-05:00)' }, { value: '卯时', label: '卯时 (05:00-07:00)' },
  { value: '辰时', label: '辰时 (07:00-09:00)' }, { value: '巳时', label: '巳时 (09:00-11:00)' },
  { value: '午时', label: '午时 (11:00-13:00)' }, { value: '未时', label: '未时 (13:00-15:00)' },
  { value: '申时', label: '申时 (15:00-17:00)' }, { value: '酉时', label: '酉时 (17:00-19:00)' },
  { value: '戌时', label: '戌时 (19:00-21:00)' }, { value: '亥时', label: '亥时 (21:00-23:00)' }
]

const features = [
  { icon: '🔮', title: '八字排盘', desc: '精准排出四柱八字，分析命理格局', tab: 'paipan' },
  { icon: '💑', title: '八字合盘', desc: '男女八字配对，分析婚姻缘分', tab: 'hepan' },
  { icon: '📅', title: '万年历', desc: '农历查询、黄道吉日、节气宜忌', tab: 'calendar' },
  { icon: '📚', title: '命理学习', desc: '系统学习八字命理知识', tab: 'learn' },
  { icon: '🧙', title: '大师解盘', desc: '资深命理师深度解析命盘', tab: 'member' }
]

const constellations = [
  { name: '白羊座', icon: '♈' }, { name: '金牛座', icon: '♉' }, { name: '双子座', icon: '♊' },
  { name: '巨蟹座', icon: '♋' }, { name: '狮子座', icon: '♌' }, { name: '处女座', icon: '♍' },
  { name: '天秤座', icon: '♎' }, { name: '天蝎座', icon: '♏' }, { name: '射手座', icon: '♐' },
  { name: '摩羯座', icon: '♑' }, { name: '水瓶座', icon: '♒' }, { name: '双鱼座', icon: '♓' }
]

const zodiacList = [
  { name: '鼠', icon: '🐭' }, { name: '牛', icon: '🐮' }, { name: '虎', icon: '🐯' },
  { name: '兔', icon: '🐰' }, { name: '龙', icon: '🐲' }, { name: '蛇', icon: '🐍' },
  { name: '马', icon: '🐴' }, { name: '羊', icon: '🐑' }, { name: '猴', icon: '🐵' },
  { name: '鸡', icon: '🐔' }, { name: '狗', icon: '🐶' }, { name: '猪', icon: '🐷' }
]

const learnCategories = [
  { icon: '📖', title: '基础知识', desc: '八字入门必学' },
  { icon: '🎓', title: '专业知识', desc: '进阶命理学习' },
  { icon: '⭐', title: '十神精解', desc: '十神深度解析' },
  { icon: '🌞', title: '天干精解', desc: '十天干详解' }
]

const vipLevelName = computed(() => {
  if (!vipInfo.value) return '普通用户'
  const level = vipInfo.value.vipLevel
  if (level >= 2) return '钻石会员'
  if (level >= 1) return '黄金会员'
  return '普通用户'
})

const switchTab = (tab) => { 
  if (tab === 'learn') {
    router.push({ name: 'learn' })
    showMobileMenu.value = false
    return
  }
  currentTab.value = tab
  showMobileMenu.value = false 
}
const goToLearn = () => { router.push({ name: 'learn' }) }
const goToMember = () => { currentTab.value = 'member'; loadVipData() }
const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('zh-CN') : ''

// 选择星座并滚动到操作区
const selectConstellation = (name) => {
  selectedConstellation.value = name
  nextTick(() => {
    if (horoscopeAction.value) {
      horoscopeAction.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}

// 选择生肖并滚动到操作区
const selectZodiac = (name) => {
  selectedZodiac.value = name
  nextTick(() => {
    if (zodiacAction.value) {
      zodiacAction.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}

const handleLogin = async () => {
  if (!loginForm.account || !loginForm.password) { ElMessage.warning('请填写账号和密码'); return }
  loginLoading.value = true
  try {
    const res = await userLogin({ account: loginForm.account, password: loginForm.password })
    if (res.code === 200) {
      localStorage.setItem('starloomAI-token', res.data.user_token)
      localStorage.setItem('userInfo', JSON.stringify(res.data))
      isLoggedIn.value = true
      userNickname.value = res.data.nickname || res.data.account || '用户'
      showLoginModal.value = false
      ElMessage.success('登录成功')
    } else { ElMessage.error(res.msg || '登录失败') }
  } catch (e) { ElMessage.error('登录失败') }
  loginLoading.value = false
}

const handleRegister = async () => {
  if (!registerForm.phone && !registerForm.email && !registerForm.wechat) { ElMessage.warning('手机号、邮箱、微信号至少填写一个'); return }
  if (!registerForm.password || registerForm.password.length < 6) { ElMessage.warning('密码至少6位'); return }
  if (registerForm.password !== registerForm.confirmPassword) { ElMessage.warning('两次密码不一致'); return }
  registerLoading.value = true
  try {
    const res = await simpleRegister({ phone: registerForm.phone, email: registerForm.email, wechat: registerForm.wechat, password: registerForm.password })
    if (res.code === 200) { ElMessage.success('注册成功，请登录'); showRegisterModal.value = false; showLoginModal.value = true }
    else { ElMessage.error(res.msg || '注册失败') }
  } catch (e) { ElMessage.error('注册失败') }
  registerLoading.value = false
}

const handleLogout = async () => {
  await loginOut()
  localStorage.removeItem('starloomAI-token')
  localStorage.removeItem('userInfo')
  isLoggedIn.value = false
  userNickname.value = ''
  ElMessage.success('已退出登录')
}

const handleSubmitFeedback = async () => {
  if (!feedbackForm.content) { ElMessage.warning('请输入留言内容'); return }
  feedbackLoading.value = true
  try {
    const res = await submitFeedback({ nickname: feedbackForm.nickname, contact: feedbackForm.contact, content: feedbackForm.content })
    if (res.code === 200) { ElMessage.success('留言提交成功'); showFeedbackModal.value = false; feedbackForm.nickname = ''; feedbackForm.contact = ''; feedbackForm.content = '' }
    else { ElMessage.error(res.msg || '提交失败') }
  } catch (e) { ElMessage.error('提交失败') }
  feedbackLoading.value = false
}

const handlePaipan = async () => {
  if (!paipanForm.name || !paipanForm.birthYear || !paipanForm.birthMonth || !paipanForm.birthDay) { 
    ElMessage.warning('请填写姓名和完整出生日期'); return 
  }
  paipanLoading.value = true
  paipanResult.value = ''
  const birthDate = `${paipanForm.birthYear}年${paipanForm.birthMonth}月${paipanForm.birthDay}日`
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/xingzuo/stream/paipan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('starloomAI-token') || '' },
      body: JSON.stringify({ 
        name: paipanForm.name, 
        gender: paipanForm.gender, 
        calendar: paipanForm.calendar, 
        birthDate: birthDate, 
        birthHour: paipanForm.birthHour, 
        birthPlace: paipanForm.birthPlace || '未知' 
      })
    })
    await handleStreamResponse(response, (content) => { paipanResult.value = content })
  } catch (e) { ElMessage.error('排盘失败，请重试') }
  paipanLoading.value = false
}

const handleHepan = async () => {
  if (!hepanForm.maleName || !hepanForm.maleYear || !hepanForm.femaleName || !hepanForm.femaleYear) { 
    ElMessage.warning('请填写完整信息'); return 
  }
  hepanLoading.value = true
  hepanResult.value = ''
  const maleBirthDate = `${hepanForm.maleYear}年${hepanForm.maleMonth}月${hepanForm.maleDay}日`
  const femaleBirthDate = `${hepanForm.femaleYear}年${hepanForm.femaleMonth}月${hepanForm.femaleDay}日`
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/xingzuo/stream/hepan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('starloomAI-token') || '' },
      body: JSON.stringify({ 
        maleName: hepanForm.maleName, 
        maleBirthDate: maleBirthDate, 
        maleBirthHour: hepanForm.maleBirthHour,
        femaleName: hepanForm.femaleName, 
        femaleBirthDate: femaleBirthDate, 
        femaleBirthHour: hepanForm.femaleBirthHour 
      })
    })
    await handleStreamResponse(response, (content) => { hepanResult.value = content })
  } catch (e) { ElMessage.error('合盘失败，请重试') }
  hepanLoading.value = false
}

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
    const optRes = await getPaymentOptions()
    if (optRes.code === 200) paymentOptions.value = optRes.data
    const res = await createVipOrder({ planCode: plan.code })
    if (res.code === 200) {
      currentOrder.value = { orderNo: res.data.orderNo, amount: res.data.amount, planName: res.data.planName || plan.name }
      payStep.value = ''
      showPayModal.value = true
    } else { ElMessage.error(res.msg || '创建订单失败') }
  } catch (e) { ElMessage.error('操作失败') }
}

const selectPayMethod = async (payType) => {
  try {
    const res = await createPayOrder({ orderNo: currentOrder.value.orderNo, payType })
    if (res.code === 200) {
      currentOrder.value = { ...currentOrder.value, ...res.data }
      if (res.data.mode === 'qrcode') { payStep.value = 'qrcode'; payRemark.value = res.data.remark || '' }
      else if (res.data.payUrl) { window.open(res.data.payUrl, '_blank') }
    } else { ElMessage.error(res.msg || '创建支付失败') }
  } catch (e) { ElMessage.error('操作失败') }
}

const confirmPaid = async () => {
  confirmLoading.value = true
  try {
    const res = await confirmPayment({ orderNo: currentOrder.value.orderNo, remark: payRemark.value || currentOrder.value.remark })
    if (res.code === 200) { payStep.value = 'pending'; ElMessage.success('已提交，请等待确认') }
    else { ElMessage.error(res.msg || '提交失败') }
  } catch (e) { ElMessage.error('提交失败') }
  confirmLoading.value = false
}

const checkLoginStatus = async () => {
  const token = localStorage.getItem('starloomAI-token')
  if (token) {
    try {
      const res = await checkLogin()
      if (res.code === 200) {
        isLoggedIn.value = true
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        userNickname.value = userInfo.nickname || userInfo.email || userInfo.phone || '用户'
      }
    } catch { localStorage.removeItem('starloomAI-token') }
  }
}

const sendChatMessage = async () => {
  if (!chatInput.value.trim() || chatLoading.value) return
  const userMsg = chatInput.value.trim()
  chatMessages.value.push({ role: 'user', content: userMsg })
  chatInput.value = ''
  chatLoading.value = true
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('starloomAI-token') || '' },
      body: JSON.stringify({ message: userMsg, stream: true })
    })
    chatMessages.value.push({ role: 'assistant', content: '' })
    const msgIdx = chatMessages.value.length - 1
    await handleStreamResponse(response, (content) => { chatMessages.value[msgIdx].content = content })
  } catch (e) { chatMessages.value.push({ role: 'assistant', content: '抱歉，请求失败，请重试' }) }
  chatLoading.value = false
}

const queryHoroscope = async () => {
  if (!selectedConstellation.value) return
  horoscopeLoading.value = true; horoscopeResult.value = ''
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/xingzuo/stream/yunshi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('starloomAI-token') || '' },
      body: JSON.stringify({ xingzuo: selectedConstellation.value, type: fortuneType.value })
    })
    await handleStreamResponse(response, (content) => { horoscopeResult.value = content })
  } catch (e) { horoscopeResult.value = '查询失败，请重试' }
  horoscopeLoading.value = false
}

const queryZodiac = async () => {
  if (!selectedZodiac.value) return
  zodiacLoading.value = true; zodiacResult.value = ''
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/xingzuo/stream/shengxiao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('starloomAI-token') || '' },
      body: JSON.stringify({ shengxiao: selectedZodiac.value })
    })
    await handleStreamResponse(response, (content) => { zodiacResult.value = content })
  } catch (e) { zodiacResult.value = '查询失败，请重试' }
  zodiacLoading.value = false
}

const drawLottery = async (type) => {
  lotteryResult.value = ''
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/xingzuo/stream/lottery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('starloomAI-token') || '' },
      body: JSON.stringify({ type })
    })
    await handleStreamResponse(response, (content) => { lotteryResult.value = content })
  } catch (e) { lotteryResult.value = '抽签失败，请重试' }
}

const queryConstellation = async () => {
  if (!selectedConstellation.value) return
  constLoading.value = true; constResult.value = ''
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/xingzuo/stream/chaxun`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('starloomAI-token') || '' },
      body: JSON.stringify({ xingzuo: selectedConstellation.value })
    })
    await handleStreamResponse(response, (content) => { constResult.value = content })
  } catch (e) { constResult.value = '查询失败，请重试' }
  constLoading.value = false
}

const queryBirthday = async (type) => {
  if (!birthdayDate.value) return
  birthdayLoading.value = true; birthdayResult.value = ''
  const [year, month, day] = birthdayDate.value.split('-')
  const urlMap = { password: 'shengrimima', book: 'shengrishu', flower: 'shengrihua' }
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/xingzuo/stream/${urlMap[type] || 'shengrimima'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('starloomAI-token') || '' },
      body: JSON.stringify({ month, day })
    })
    await handleStreamResponse(response, (content) => { birthdayResult.value = content })
  } catch (e) { birthdayResult.value = '查询失败，请重试' }
  birthdayLoading.value = false
}

const handleStreamResponse = async (response, onUpdate) => {
  // 检查是否支持 ReadableStream
  if (!response.body || typeof response.body.getReader !== 'function') {
    // 降级处理：直接读取完整响应
    try {
      const text = await response.text()
      const lines = text.split('\n')
      let fullContent = ''
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim()
          if (data && !data.includes('[DONE]')) {
            try {
              const json = JSON.parse(data)
              if (json.content) { fullContent += json.content }
            } catch { /* ignore */ }
          }
        }
      }
      onUpdate(fullContent)
      return
    } catch (e) {
      console.error('Stream fallback error:', e)
      return
    }
  }
  
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullContent = ''
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value, { stream: true })
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
  } catch (e) {
    console.error('Stream read error:', e)
    if (fullContent) onUpdate(fullContent)
  }
}

onMounted(() => { 
  initTheme()
  checkLoginStatus()
  updateCalendar() // 初始化万年历
})
</script>


<style scoped>
/* ========== 主题切换按钮样式（在header中） ========== */
.theme-btn {
  font-size: 20px;
  cursor: pointer;
  margin-left: 15px;
  transition: transform 0.3s;
}
.theme-btn:hover { transform: scale(1.2); }
.mobile-header-right {
  display: none;
  align-items: center;
  gap: 12px;
}
.theme-btn-mobile {
  font-size: 20px;
  cursor: pointer;
}
.theme-panel {
  position: fixed; top: 70px; right: 20px; z-index: 1001;
  background: var(--bgModal, linear-gradient(145deg, rgba(48,43,99,0.95), rgba(36,36,62,0.95)));
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 15px;
  border: 1px solid var(--border, rgba(200,165,217,0.2));
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  min-width: 160px;
}
.theme-panel-header { color: var(--accent, #f5a5c8); font-size: 14px; margin-bottom: 12px; text-align: center; }
.theme-option {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 10px;
  cursor: pointer; transition: all 0.3s;
  margin-bottom: 6px;
}
.theme-option:hover { background: var(--bgCardHover, rgba(240,147,251,0.12)); }
.theme-option.active { background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c)); }
.theme-opt-icon { font-size: 18px; }
.theme-opt-name { font-size: 14px; color: var(--textSecondary, #e8d5f2); }
.theme-option.active .theme-opt-name { color: #fff; }

/* ========== 基础样式 - 使用CSS变量 ========== */
.home-page { 
  min-height: 100vh; 
  background: var(--bgPrimary, linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)); 
  color: var(--textPrimary, #fff); 
  position: relative;
  overflow-x: hidden;
}
/* 星星动画 - 仅深色主题显示 */
.home-page::before {
  content: '';
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.8), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,182,193,0.6), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 130px 80px, rgba(200,162,255,0.7), transparent),
    radial-gradient(1px 1px at 160px 120px, rgba(255,255,255,0.5), transparent);
  background-size: 200px 200px;
  animation: twinkle 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
.home-header { 
  display: flex; align-items: center; justify-content: space-between; 
  padding: 15px 30px; 
  background: var(--bgHeader, rgba(255,255,255,0.08)); 
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  position: sticky; top: 0; z-index: 100; 
}
.header-left .logo { display: flex; align-items: center; gap: 8px; }
.logo-icon { 
  background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c)); 
  color: #fff; 
  padding: 6px 12px; 
  border-radius: 12px; 
  font-weight: bold; 
  box-shadow: 0 4px 15px var(--shadow, rgba(240,147,251,0.4));
}
.logo-text { 
  font-size: 20px; font-weight: bold; 
  background: var(--primaryGradient, linear-gradient(90deg, #f093fb, #f5576c)); 
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
}
.header-center { display: flex; gap: 25px; }
.header-center .nav-item { 
  cursor: pointer; padding: 8px 18px; border-radius: 25px; 
  transition: all 0.3s; 
  font-size: 14px;
}
.header-center .nav-item:hover, .header-center .nav-item.active { 
  background: var(--bgCardHover, linear-gradient(135deg, rgba(240,147,251,0.3), rgba(245,87,108,0.3))); 
  color: var(--accent, #f5a5c8);
  box-shadow: 0 0 20px var(--shadow, rgba(240,147,251,0.3));
}
.header-right { display: flex; gap: 15px; align-items: center; }
.login-btn, .register-btn, .logout-btn { cursor: pointer; padding: 8px 20px; border-radius: 25px; transition: all 0.3s; font-size: 14px; }
.login-btn { border: 1px solid var(--accent, #f5a5c8); color: var(--accent, #f5a5c8); }
.login-btn:hover { background: var(--bgCardHover, rgba(245,165,200,0.2)); }
.register-btn { background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c)); color: #fff; box-shadow: 0 4px 15px var(--shadow, rgba(240,147,251,0.4)); }
.register-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--shadowHover, rgba(240,147,251,0.5)); }
.logout-btn { color: var(--accentLight, #c8a5d9); }
.user-info { color: var(--accent, #f5a5c8); }
.mobile-menu-btn { display: none; font-size: 24px; cursor: pointer; color: var(--accent, #f5a5c8); }
.mobile-nav { display: none; background: var(--bgMobileNav, rgba(15,12,41,0.95)); backdrop-filter: blur(20px); padding: 20px; }
.mobile-nav .nav-item { padding: 15px; border-bottom: 1px solid var(--borderLight, rgba(255,255,255,0.1)); color: var(--textSecondary, #e8d5f2); cursor: pointer; }
.mobile-user-section {
  display: flex; justify-content: space-between; align-items: center;
  padding: 15px; margin-bottom: 10px;
  background: var(--bgCard, rgba(255,255,255,0.06));
  border-radius: 12px;
}
.mobile-user-name { color: var(--accent, #f5a5c8); font-weight: 500; }
.mobile-logout { color: var(--textMuted, #a89cc8); cursor: pointer; font-size: 14px; }
.mobile-login, .mobile-register {
  padding: 8px 20px; border-radius: 20px; cursor: pointer; font-size: 14px;
}
.mobile-login { border: 1px solid var(--accent, #f5a5c8); color: var(--accent, #f5a5c8); }
.mobile-register { background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c)); color: #fff; }

.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15,12,41,0.85); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { 
  background: var(--bgModal, linear-gradient(145deg, rgba(48,43,99,0.95), rgba(36,36,62,0.95))); 
  border-radius: 24px; padding: 30px; width: 90%; max-width: 400px; 
  border: 1px solid var(--border, rgba(240,147,251,0.3)); 
  box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px var(--shadow, rgba(240,147,251,0.1));
  backdrop-filter: blur(20px);
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-header h3 { background: var(--primaryGradient, linear-gradient(90deg, #f093fb, #f5576c)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; font-size: 20px; }
.close-btn { font-size: 24px; cursor: pointer; color: var(--accentLight, #c8a5d9); transition: all 0.3s; }
.close-btn:hover { color: var(--accent, #f5a5c8); transform: rotate(90deg); }
.form-group { margin-bottom: 18px; }
.form-group label { display: block; margin-bottom: 8px; color: var(--textSecondary, #e8d5f2); font-size: 14px; }
.form-group input, .form-group select, .form-group textarea { 
  width: 100%; padding: 14px 16px; 
  border: 1px solid var(--border, rgba(200,165,217,0.3)); 
  border-radius: 12px; 
  background: var(--bgInput, rgba(255,255,255,0.08)); 
  color: var(--textPrimary, #fff); box-sizing: border-box; 
  transition: all 0.3s;
  font-size: 16px; /* 防止iOS自动缩放 */
  -webkit-appearance: none;
  appearance: none;
}
/* 年月日选择器样式 */
.date-selects {
  display: flex;
  gap: 8px;
}
.date-selects select {
  flex: 1;
  min-width: 0;
  padding: 12px 8px;
  text-align: center;
}
.date-selects .year-select { flex: 1.3; }
.date-selects .month-select { flex: 0.9; }
.date-selects .day-select { flex: 0.9; }
/* 日期输入框优化 */
.form-group input[type="date"] {
  min-height: 48px;
  line-height: 1.2;
}
.form-group input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.8);
  cursor: pointer;
  padding: 4px;
}
.theme-guoxue .form-group input[type="date"]::-webkit-calendar-picker-indicator {
  filter: none;
  opacity: 0.6;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { 
  border-color: var(--primary, #f093fb); 
  outline: none; 
  box-shadow: 0 0 20px var(--shadow, rgba(240,147,251,0.2));
  background: rgba(255,255,255,0.12);
}
.form-tip { font-size: 12px; color: var(--accent, #f5a5c8); margin-bottom: 15px; }
.optional { font-size: 12px; color: var(--textMuted, #a89cc8); }
.submit-btn { 
  width: 100%; padding: 14px; 
  background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c)); 
  color: #fff; border: none; border-radius: 12px; 
  font-size: 16px; font-weight: bold; cursor: pointer; 
  box-shadow: 0 4px 20px var(--shadow, rgba(240,147,251,0.4));
  transition: all 0.3s;
}
.submit-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 25px var(--shadowHover, rgba(240,147,251,0.5)); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.modal-footer { text-align: center; margin-top: 18px; color: var(--textMuted, #a89cc8); }
.modal-footer a { color: var(--accent, #f5a5c8); cursor: pointer; margin-left: 5px; transition: all 0.3s; }
.modal-footer a:hover { color: var(--primary, #f093fb); }

.main-content { padding: 30px; max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
.hero-section { text-align: center; padding: 80px 20px; }
.hero-section h1 { 
  font-size: 48px; margin-bottom: 20px; 
  background: var(--primaryGradient, linear-gradient(90deg, #f093fb, #f5576c)); 
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
  text-shadow: 0 0 60px var(--shadow, rgba(240,147,251,0.3));
}
.hero-section p { font-size: 18px; color: var(--accentLight, #c8a5d9); margin-bottom: 35px; letter-spacing: 2px; }
.cta-btn { 
  padding: 16px 45px; 
  background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c)); 
  color: #fff; border: none; border-radius: 30px; 
  font-size: 18px; font-weight: bold; cursor: pointer; 
  box-shadow: 0 8px 30px var(--shadow, rgba(240,147,251,0.4));
  transition: all 0.3s;
}
.cta-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 40px var(--shadowHover, rgba(240,147,251,0.5)); }
.features-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin: 50px 0; }
.feature-card { 
  background: var(--bgCard, rgba(255,255,255,0.06)); 
  backdrop-filter: blur(10px);
  border-radius: 20px; padding: 35px 25px; text-align: center; 
  border: 1px solid var(--border, rgba(200,165,217,0.2)); 
  transition: all 0.4s;
  cursor: pointer;
}
.feature-card:hover { 
  transform: translateY(-8px); 
  border-color: var(--borderHover, rgba(240,147,251,0.4));
  box-shadow: 0 20px 40px var(--shadow, rgba(240,147,251,0.15));
}
.feature-icon { font-size: 50px; margin-bottom: 18px; }
.feature-card h3 { background: var(--primaryGradient, linear-gradient(90deg, #f5a5c8, #c8a5d9)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 12px; font-size: 18px; }
.feature-card p { color: var(--textMuted, #a89cc8); font-size: 14px; line-height: 1.6; }

.paipan-form, .hepan-form { 
  background: var(--bgCard, rgba(255,255,255,0.06)); 
  backdrop-filter: blur(15px);
  border-radius: 24px; padding: 35px; max-width: 600px; margin: 0 auto; 
  border: 1px solid var(--border, rgba(200,165,217,0.2));
}
.paipan-form h2, .hepan-form h2 { 
  background: var(--primaryGradient, linear-gradient(90deg, #f093fb, #f5576c)); 
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
  text-align: center; margin-bottom: 30px; font-size: 24px;
}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }
.paipan-result, .hepan-result { 
  background: var(--bgCard, rgba(255,255,255,0.06)); 
  backdrop-filter: blur(15px);
  border-radius: 20px; padding: 30px; margin-top: 30px; max-width: 800px; margin-left: auto; margin-right: auto; 
  border: 1px solid var(--border, rgba(200,165,217,0.2));
}
.paipan-result h3, .hepan-result h3 { 
  background: var(--primaryGradient, linear-gradient(90deg, #f5a5c8, #c8a5d9)); 
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
  margin-bottom: 20px; 
}
.result-content { color: var(--textSecondary, #e8d5f2); line-height: 1.9; white-space: pre-wrap; }
.person-section { margin-bottom: 25px; padding: 22px; background: var(--bgCardHover, rgba(240,147,251,0.08)); border-radius: 16px; border: 1px solid var(--border, rgba(240,147,251,0.15)); }
.person-section h4 { color: var(--accent, #f5a5c8); margin-bottom: 18px; font-size: 16px; }

.divination-tab h2 { 
  background: var(--primaryGradient, linear-gradient(90deg, #f093fb, #f5576c)); 
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
  text-align: center; margin-bottom: 25px; font-size: 26px;
}

/* ========== AI问卦标签页样式 ========== */
.div-tabs-wrapper {
  overflow-x: auto;
  margin-bottom: 20px;
  -webkit-overflow-scrolling: touch;
}
.div-tabs-wrapper::-webkit-scrollbar { display: none; }
.div-tabs {
  display: flex;
  gap: 10px;
  padding: 5px;
  min-width: max-content;
}
.div-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--bgCard, rgba(255,255,255,0.06));
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid transparent;
  white-space: nowrap;
}
.div-tab:hover {
  background: var(--bgCardHover, rgba(240,147,251,0.12));
}
.div-tab.active {
  background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c));
  color: #fff;
  box-shadow: 0 4px 15px var(--shadow, rgba(240,147,251,0.4));
}
.tab-icon { font-size: 18px; }
.tab-name { font-size: 14px; font-weight: 500; color: var(--textSecondary, #e8d5f2); }
.div-tab.active .tab-name { color: #fff; }

.div-content {
  background: var(--bgCard, rgba(255,255,255,0.06));
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid var(--border, rgba(200,165,217,0.2));
}

/* 选择网格 */
.select-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}
.select-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: var(--bgInput, rgba(255,255,255,0.08));
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}
.select-item:hover {
  background: var(--bgCardHover, rgba(240,147,251,0.12));
}
.select-item.active {
  border-color: var(--primary, #f093fb);
  background: var(--bgCardHover, rgba(240,147,251,0.15));
  box-shadow: 0 0 15px var(--shadow, rgba(240,147,251,0.2));
}
.item-icon { font-size: 24px; margin-bottom: 4px; }
.item-name { font-size: 12px; color: var(--textSecondary, #e8d5f2); }

/* 操作栏 */
.action-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: var(--bgCardHover, rgba(240,147,251,0.08));
  border-radius: 12px;
  margin-top: 15px;
}
.action-btn {
  padding: 12px 30px;
  background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c));
  color: #fff;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px var(--shadow, rgba(240,147,251,0.4));
}
.action-btn:hover { transform: translateY(-2px); }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

/* 时间标签 */
.time-tabs {
  display: flex;
  gap: 10px;
}
.time-tabs span {
  padding: 8px 18px;
  border-radius: 20px;
  cursor: pointer;
  background: var(--bgInput, rgba(255,255,255,0.08));
  color: var(--textMuted, #a89cc8);
  transition: all 0.3s;
  font-size: 13px;
}
.time-tabs span.active {
  background: var(--bgCard, rgba(255,255,255,0.15));
  color: var(--accent, #f5a5c8);
}

/* 抽签网格 */
.lottery-grid {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}
.lottery-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 25px;
  background: var(--bgInput, rgba(255,255,255,0.08));
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}
.lottery-item:hover {
  border-color: var(--borderHover, rgba(240,147,251,0.5));
  transform: translateY(-3px);
  box-shadow: 0 10px 25px var(--shadow, rgba(240,147,251,0.2));
}
.lottery-icon { font-size: 36px; margin-bottom: 8px; }
.lottery-name { font-size: 14px; color: var(--textSecondary, #e8d5f2); font-weight: 500; }

/* 生日输入 */
.birthday-input {
  text-align: center;
  margin-bottom: 15px;
}
.birthday-input label {
  display: block;
  margin-bottom: 10px;
  color: var(--textSecondary, #e8d5f2);
  font-size: 14px;
}
.birthday-input input {
  padding: 12px 20px;
  border: 1px solid var(--border, rgba(200,165,217,0.3));
  border-radius: 12px;
  background: var(--bgInput, rgba(255,255,255,0.08));
  color: var(--textPrimary, #fff);
  font-size: 16px;
  min-width: 200px;
}
.birthday-btns {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
.birthday-btn {
  padding: 10px 20px;
  background: var(--bgInput, rgba(255,255,255,0.08));
  color: var(--textSecondary, #e8d5f2);
  border: 1px solid var(--border, rgba(200,165,217,0.3));
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}
.birthday-btn:hover {
  background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c));
  color: #fff;
  border-color: transparent;
}
.birthday-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* 结果框 */
.result-box {
  margin-top: 15px;
  padding: 15px;
  background: var(--bgInput, rgba(255,255,255,0.05));
  border-radius: 12px;
  color: var(--textSecondary, #e8d5f2);
  line-height: 1.8;
  white-space: pre-wrap;
}

/* 聊天容器 */
.chat-container { 
  border-radius: 16px; overflow: hidden; 
  border: 1px solid var(--border, rgba(200,165,217,0.2));
}
.chat-messages { height: 350px; overflow-y: auto; padding: 20px; background: var(--bgInput, rgba(255,255,255,0.03)); }
.chat-messages::-webkit-scrollbar { width: 6px; }
.chat-messages::-webkit-scrollbar-thumb { background: var(--shadow, rgba(240,147,251,0.3)); border-radius: 3px; }
.chat-msg { margin-bottom: 15px; display: flex; }
.chat-msg.user { justify-content: flex-end; }
.chat-msg.assistant { justify-content: flex-start; }
.msg-content { max-width: 80%; padding: 12px 16px; border-radius: 16px; line-height: 1.6; font-size: 14px; }
.chat-msg.user .msg-content { 
  background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c)); 
  color: #fff; 
  border-bottom-right-radius: 4px;
}
.chat-msg.assistant .msg-content { 
  background: var(--bgCard, rgba(255,255,255,0.1)); 
  color: var(--textSecondary, #e8d5f2); 
  border-bottom-left-radius: 4px;
}
.chat-input-area { display: flex; gap: 10px; padding: 15px; background: rgba(0,0,0,0.15); }
.chat-input-area input { 
  flex: 1; padding: 12px 18px; 
  border: 1px solid var(--border, rgba(200,165,217,0.3)); 
  border-radius: 25px; 
  background: var(--bgInput, rgba(255,255,255,0.08)); 
  color: var(--textPrimary, #fff); 
  font-size: 14px;
}
.chat-input-area input:focus { border-color: var(--primary, #f093fb); outline: none; }
.chat-input-area button { 
  padding: 12px 24px; 
  background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c)); 
  color: #fff; border: none; border-radius: 25px; 
  font-weight: bold; cursor: pointer; 
  font-size: 14px;
}

/* 保留旧样式兼容 */
.constellation-select, .zodiac-select { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
.const-item, .zodiac-item { 
  background: var(--bgCard, rgba(255,255,255,0.06)); 
  border-radius: 16px; padding: 16px 10px; text-align: center; cursor: pointer; 
  border: 2px solid transparent; 
  transition: all 0.3s;
}
.const-item:hover, .const-item.active, .zodiac-item:hover, .zodiac-item.active { 
  border-color: var(--primary, #f093fb); 
  background: var(--bgCardHover, rgba(240,147,251,0.15)); 
  box-shadow: 0 0 20px var(--shadow, rgba(240,147,251,0.2));
}
.const-icon, .zodiac-icon { font-size: 26px; display: block; margin-bottom: 6px; }
.const-name, .zodiac-name { font-size: 12px; color: var(--accentLight, #c8a5d9); }

/* 操作区域样式 */
.action-area {
  background: var(--bgCard, rgba(255,255,255,0.06));
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
  border: 1px solid var(--borderHover, rgba(240,147,251,0.3));
  animation: fadeInUp 0.3s ease;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.selected-hint {
  text-align: center;
  color: var(--accent, #f5a5c8);
  font-size: 15px;
  margin-bottom: 15px;
  font-weight: 500;
}

.time-tabs { display: flex; justify-content: center; gap: 15px; margin-bottom: 20px; }
.time-tabs span { 
  padding: 10px 24px; border-radius: 25px; cursor: pointer; 
  background: var(--bgInput, rgba(255,255,255,0.08)); color: var(--textMuted, #a89cc8); 
  transition: all 0.3s;
}
.time-tabs span.active { 
  background: var(--bgCardHover, linear-gradient(135deg, rgba(240,147,251,0.3), rgba(245,87,108,0.3))); 
  color: var(--accent, #f5a5c8); 
  box-shadow: 0 0 15px var(--shadow, rgba(240,147,251,0.2));
}
.query-btn { 
  display: block; margin: 0 auto; padding: 14px 45px; 
  background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c)); 
  color: #fff; border: none; border-radius: 25px; 
  font-weight: bold; cursor: pointer; 
  box-shadow: 0 4px 20px var(--shadow, rgba(240,147,251,0.4));
  transition: all 0.3s;
}
.query-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 25px var(--shadowHover, rgba(240,147,251,0.5)); }
.query-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.lottery-types { display: flex; justify-content: center; gap: 20px; margin-bottom: 25px; }
.lottery-card { 
  background: var(--bgCard, rgba(255,255,255,0.06)); 
  border-radius: 20px; padding: 28px 38px; text-align: center; cursor: pointer; 
  border: 2px solid transparent; 
  transition: all 0.4s;
}
.lottery-card:hover { 
  border-color: var(--primary, #f093fb); 
  background: var(--bgCardHover, rgba(240,147,251,0.12));
  transform: translateY(-5px);
}
.lottery-icon { font-size: 40px; display: block; margin-bottom: 12px; }
.birthday-form { max-width: 300px; margin: 0 auto 25px; }
.birthday-types { display: flex; justify-content: center; gap: 15px; margin-bottom: 25px; }
.birthday-types button { 
  padding: 12px 28px; 
  background: var(--bgInput, rgba(255,255,255,0.08)); 
  color: var(--accentLight, #c8a5d9); 
  border: 1px solid var(--border, rgba(200,165,217,0.3)); 
  border-radius: 25px; cursor: pointer; 
  transition: all 0.3s;
}
.birthday-types button:hover { 
  background: var(--bgCardHover, rgba(240,147,251,0.2)); 
  color: var(--accent, #f5a5c8); 
  border-color: var(--primary, #f093fb); 
}
.fortune-result { 
  background: rgba(0,0,0,0.2); 
  border-radius: 16px; padding: 25px; 
  color: var(--textSecondary, #e8d5f2); line-height: 1.9; white-space: pre-wrap; 
  border: 1px solid var(--border, rgba(200,165,217,0.15));
}

.learn-tab h2 { 
  background: var(--primaryGradient, linear-gradient(90deg, #f093fb, #f5576c)); 
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
  text-align: center; margin-bottom: 35px; font-size: 28px;
}
.learn-categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; }
.learn-card { 
  background: var(--bgCard, rgba(255,255,255,0.06)); 
  backdrop-filter: blur(10px);
  border-radius: 20px; padding: 30px; 
  border: 1px solid var(--border, rgba(200,165,217,0.2)); 
  transition: all 0.4s;
}
.learn-card:hover { 
  transform: translateY(-5px); 
  border-color: var(--borderHover, rgba(240,147,251,0.4));
  box-shadow: 0 15px 35px var(--shadow, rgba(240,147,251,0.15));
}
.learn-icon { font-size: 44px; display: block; margin-bottom: 18px; }
.learn-card h3 { 
  background: var(--primaryGradient, linear-gradient(90deg, #f5a5c8, #c8a5d9)); 
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
  margin-bottom: 10px; font-size: 18px;
}
.learn-card p { color: var(--textMuted, #a89cc8); font-size: 14px; line-height: 1.6; }

.member-tab h2 { 
  background: var(--primaryGradient, linear-gradient(90deg, #f093fb, #f5576c)); 
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
  text-align: center; margin-bottom: 35px; font-size: 28px;
}
.vip-info { 
  text-align: center; margin-bottom: 45px; padding: 35px; 
  background: var(--bgCard, rgba(255,255,255,0.06)); 
  backdrop-filter: blur(15px);
  border-radius: 24px; 
  border: 1px solid var(--border, rgba(200,165,217,0.2));
}
.vip-badge { display: inline-block; padding: 12px 35px; border-radius: 30px; font-weight: bold; margin-bottom: 18px; }
.vip-badge.level-0 { background: rgba(150,150,150,0.3); color: #ccc; border: 1px solid rgba(150,150,150,0.3); }
.vip-badge.level-1 { 
  background: var(--vipGold, linear-gradient(135deg, #f093fb, #f5576c)); 
  color: #fff; 
  box-shadow: 0 4px 20px var(--shadow, rgba(240,147,251,0.4));
}
.vip-badge.level-2 { 
  background: var(--vipDiamond, linear-gradient(135deg, #667eea, #764ba2)); 
  color: #fff; 
  box-shadow: 0 4px 20px rgba(118,75,162,0.4);
}
.vip-info p { color: var(--accentLight, #c8a5d9); }
.vip-plans h3, .vip-benefits h3 { 
  background: var(--primaryGradient, linear-gradient(90deg, #f5a5c8, #c8a5d9)); 
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
  margin-bottom: 25px; font-size: 20px;
}
.plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 25px; margin-bottom: 45px; }
.plan-card { 
  background: var(--bgCard, rgba(255,255,255,0.06)); 
  backdrop-filter: blur(10px);
  border-radius: 24px; padding: 30px; text-align: center; 
  border: 2px solid transparent; position: relative; 
  transition: all 0.4s;
}
.plan-card:hover { 
  transform: translateY(-8px); 
  border-color: var(--borderHover, rgba(240,147,251,0.3));
  box-shadow: 0 20px 40px var(--shadow, rgba(240,147,251,0.15));
}
.plan-card.recommended { 
  border-color: var(--primary, #f093fb); 
  background: var(--bgCardHover, linear-gradient(145deg, rgba(240,147,251,0.1), rgba(245,87,108,0.1)));
}
.plan-badge { 
  position: absolute; top: -12px; right: 20px; 
  background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c)); 
  color: #fff; padding: 6px 16px; border-radius: 15px; font-size: 12px; 
  box-shadow: 0 4px 15px var(--shadow, rgba(240,147,251,0.4));
}
.plan-card h4 { color: var(--textSecondary, #e8d5f2); margin-bottom: 18px; font-size: 18px; }
.plan-price .currency { font-size: 18px; color: var(--accent, #f5a5c8); }
.plan-price .amount { font-size: 40px; font-weight: bold; background: var(--primaryGradient, linear-gradient(90deg, #f093fb, #f5576c)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.plan-original { color: var(--textMuted, #a89cc8); text-decoration: line-through; font-size: 14px; margin-bottom: 10px; }
.plan-duration { color: var(--accentLight, #c8a5d9); margin-bottom: 22px; }
.buy-btn { 
  padding: 14px 35px; 
  background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c)); 
  color: #fff; border: none; border-radius: 25px; 
  font-weight: bold; cursor: pointer; 
  box-shadow: 0 4px 20px var(--shadow, rgba(240,147,251,0.4));
  transition: all 0.3s;
}
.buy-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 25px var(--shadowHover, rgba(240,147,251,0.5)); }
.benefits-table { 
  width: 100%; border-collapse: collapse; 
  background: var(--bgCard, rgba(255,255,255,0.06)); 
  border-radius: 16px; overflow: hidden; 
}
.benefits-table th, .benefits-table td { padding: 18px; text-align: center; border-bottom: 1px solid var(--border, rgba(200,165,217,0.15)); }
.benefits-table th { 
  background: var(--bgCardHover, linear-gradient(135deg, rgba(240,147,251,0.2), rgba(245,87,108,0.2))); 
  color: var(--accent, #f5a5c8); 
}
.benefits-table td { color: var(--accentLight, #c8a5d9); }

.floating-feedback { 
  position: fixed; bottom: 100px; right: 30px; 
  width: 60px; height: 60px; 
  background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c)); 
  border-radius: 50%; 
  display: flex; align-items: center; justify-content: center; 
  cursor: pointer; 
  box-shadow: 0 8px 30px var(--shadow, rgba(240,147,251,0.5)); 
  z-index: 99; 
  transition: all 0.3s;
}
.floating-feedback:hover { transform: scale(1.1); box-shadow: 0 10px 40px var(--shadowHover, rgba(240,147,251,0.6)); }
.floating-feedback span { font-size: 28px; }

.pay-modal { max-width: 450px; }
.order-info { 
  background: var(--bgCardHover, rgba(240,147,251,0.1)); 
  border-radius: 16px; padding: 22px; margin-bottom: 22px; 
  border: 1px solid var(--border, rgba(240,147,251,0.2));
}
.order-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border, rgba(200,165,217,0.15)); }
.order-row:last-child { border-bottom: none; }
.order-row .price { 
  background: var(--primaryGradient, linear-gradient(90deg, #f093fb, #f5576c)); 
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
  font-size: 22px; font-weight: bold; 
}
.pay-methods h4 { color: var(--accent, #f5a5c8); text-align: center; margin-bottom: 18px; }
.pay-method-list { display: flex; gap: 18px; justify-content: center; }
.pay-method { 
  background: var(--bgCard, rgba(255,255,255,0.06)); 
  border-radius: 16px; padding: 22px 35px; text-align: center; cursor: pointer; 
  border: 2px solid transparent; 
  transition: all 0.3s;
}
.pay-method:hover { border-color: var(--primary, #f093fb); background: var(--bgCardHover, rgba(240,147,251,0.1)); }
.pay-icon { font-size: 36px; display: block; margin-bottom: 10px; }
.qrcode-pay h4 { color: var(--accent, #f5a5c8); text-align: center; margin-bottom: 18px; }
.qrcode-img { text-align: center; margin-bottom: 22px; }
.qrcode-img img { max-width: 200px; border-radius: 16px; border: 2px solid var(--border, rgba(240,147,251,0.3)); }
.no-qrcode { padding: 60px 40px; background: var(--bgCard, rgba(255,255,255,0.05)); border-radius: 16px; color: var(--textMuted, #a89cc8); }
.pay-tips { 
  background: var(--bgCardHover, linear-gradient(135deg, rgba(240,147,251,0.1), rgba(245,87,108,0.1))); 
  border-radius: 16px; padding: 18px; margin-bottom: 22px; 
  border: 1px solid var(--border, rgba(240,147,251,0.2));
}
.pay-tips p { margin: 6px 0; font-size: 14px; color: var(--accentLight, #c8a5d9); }
.pay-tips strong { color: var(--accent, #f5a5c8); }
.pay-note { text-align: center; font-size: 12px; color: var(--textMuted, #a89cc8); margin-top: 18px; }
.pay-result { text-align: center; padding: 35px 0; }
.result-icon { font-size: 65px; margin-bottom: 18px; }
.pay-result h4 { color: var(--accent, #f5a5c8); margin-bottom: 12px; font-size: 18px; }
.pay-result p { color: var(--accentLight, #c8a5d9); margin-bottom: 12px; }

/* ========== 国学雅韵主题特殊样式 ========== */
.theme-guoxue::before { display: none; } /* 隐藏星星动画 */
.theme-guoxue .home-header { 
  border-bottom: 2px solid #e8e0d5; 
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.theme-guoxue .logo-icon { 
  background: #1a1a1a; 
  color: #d4a574;
  font-family: "KaiTi", "楷体", serif;
}
.theme-guoxue .feature-card,
.theme-guoxue .divination-card,
.theme-guoxue .plan-card,
.theme-guoxue .learn-card,
.theme-guoxue .chat-container,
.theme-guoxue .divination-section,
.theme-guoxue .paipan-form,
.theme-guoxue .hepan-form { 
  box-shadow: 0 2px 15px rgba(0,0,0,0.08);
  border: 1px solid #e8e0d5;
}
.theme-guoxue .modal-content {
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  border: 1px solid #d4c4b0;
}
.theme-guoxue .submit-btn,
.theme-guoxue .cta-btn,
.theme-guoxue .query-btn,
.theme-guoxue .buy-btn,
.theme-guoxue .register-btn { 
  background: #1a1a1a;
  color: #d4a574;
}
.theme-guoxue .chat-msg.user .msg-content {
  background: #1a1a1a;
  color: #d4a574;
}
.theme-guoxue .divination-card.main-chat {
  background: linear-gradient(135deg, rgba(26,26,26,0.05), rgba(139,90,43,0.08));
  border: 1px solid #d4c4b0;
}
.theme-guoxue .theme-panel {
  background: #fffef9;
  border: 1px solid rgba(139,90,43,0.2);
}
.theme-guoxue .theme-panel-header { color: #8b5a2b; }
.theme-guoxue .theme-opt-name { color: #555; }
.theme-guoxue .floating-feedback {
  background: #1a1a1a;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.theme-guoxue .div-tab.active {
  background: #1a1a1a;
  color: #d4a574;
}
.theme-guoxue .div-content,
.theme-guoxue .action-bar {
  border: 1px solid #e8e0d5;
}
.theme-guoxue .action-btn,
.theme-guoxue .birthday-btn:hover {
  background: #1a1a1a;
  color: #d4a574;
}

@media (max-width: 768px) {
  .header-center, .header-right { display: none; }
  .mobile-header-right { display: flex; }
  .mobile-menu-btn { display: block; font-size: 24px; cursor: pointer; color: var(--accent, #f5a5c8); }
  .mobile-nav { display: block; }
  .hero-section h1 { font-size: 28px; }
  .hero-section { padding: 40px 15px; }
  .form-row { grid-template-columns: 1fr; }
  .plans-grid { grid-template-columns: 1fr; }
  .theme-panel { top: 60px; right: 10px; width: 150px; }
  .theme-panel .theme-option { padding: 8px 10px; font-size: 12px; }
  .mobile-nav .nav-item { font-size: 15px; }
  /* 移动端表单优化 */
  .paipan-form, .hepan-form { padding: 20px; margin: 0 10px; }
  .form-group input, .form-group select { padding: 12px 14px; font-size: 16px; }
  .form-group input[type="date"] { min-height: 50px; }
  .form-group label { font-size: 14px; margin-bottom: 6px; }
  .features-section { gap: 15px; margin: 30px 0; }
  .feature-card { padding: 25px 15px; }
  .feature-icon { font-size: 40px; margin-bottom: 12px; }
  /* AI问卦移动端优化 */
  .divination-tab h2 { font-size: 22px; margin-bottom: 15px; }
  .div-tabs { gap: 8px; }
  .div-tab { padding: 8px 12px; }
  .tab-icon { font-size: 16px; }
  .tab-name { font-size: 12px; }
  .div-content { padding: 15px; }
  .select-grid { grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .select-item { padding: 10px 5px; }
  .item-icon { font-size: 20px; }
  .item-name { font-size: 11px; }
  .action-bar { padding: 12px; gap: 10px; }
  .action-btn { padding: 10px 25px; font-size: 14px; }
  .time-tabs span { padding: 6px 14px; font-size: 12px; }
  .lottery-grid { gap: 10px; }
  .lottery-item { padding: 15px 20px; }
  .lottery-icon { font-size: 28px; }
  .lottery-name { font-size: 13px; }
  .birthday-btns { gap: 8px; }
  .birthday-btn { padding: 8px 15px; font-size: 13px; }
  .chat-messages { height: 300px; padding: 15px; }
  .chat-input-area { padding: 12px; }
  /* 移动端日期选择器和按钮优化 */
  .date-selects {
    display: flex;
    flex-wrap: nowrap;
    gap: 6px;
    width: 100%;
  }
  .date-selects select {
    flex: 1;
    min-width: 0;
    padding: 10px 4px;
    font-size: 14px;
    text-align: center;
    -webkit-appearance: none;
    appearance: none;
    border-radius: 8px;
  }
  .date-selects .year-select { flex: 1.2; }
  .date-selects .month-select { flex: 0.9; }
  .date-selects .day-select { flex: 0.9; }
  .submit-btn {
    display: block;
    width: 100%;
    padding: 14px 20px;
    font-size: 16px;
    margin-top: 15px;
    -webkit-appearance: none;
    appearance: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    cursor: pointer;
  }
  .submit-btn:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
}

/* 国学雅韵主题移动端特殊样式 */
.theme-guoxue .mobile-nav {
  background: rgba(248,246,241,0.98);
  border-bottom: 1px solid rgba(139,90,43,0.2);
}
.theme-guoxue .mobile-nav .nav-item {
  color: #333;
  border-bottom-color: rgba(139,90,43,0.15);
}
.theme-guoxue .mobile-user-section {
  background: rgba(139,90,43,0.08);
}
.theme-guoxue .mobile-user-name { color: #8b5a2b; }
.theme-guoxue .mobile-logout { color: #888; }
.theme-guoxue .mobile-login { border-color: #8b5a2b; color: #8b5a2b; }

/* ========== 万年历样式 ========== */
.calendar-tab { max-width: 800px; margin: 0 auto; }
.calendar-header { text-align: center; margin-bottom: 24px; }
.calendar-header h2 { font-size: 28px; margin: 0 0 8px 0; color: var(--textPrimary, #fff); }
.calendar-subtitle { font-size: 14px; color: var(--textMuted, rgba(255,255,255,0.6)); margin: 0; }

.calendar-picker { margin-bottom: 20px; }
.picker-row { display: flex; align-items: center; justify-content: center; gap: 12px; }
.picker-btn {
  width: 36px; height: 36px; border-radius: 50%; border: none;
  background: var(--bgCard, rgba(255,255,255,0.08)); color: var(--textPrimary, #fff);
  cursor: pointer; font-size: 14px; transition: all 0.2s;
}
.picker-btn:hover { background: var(--accent, #f59e0b); }
.picker-display { display: flex; gap: 8px; }
.year-picker, .month-picker {
  padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border, rgba(255,255,255,0.1));
  background: var(--bgCard, rgba(255,255,255,0.08)); color: var(--textPrimary, #fff);
  font-size: 15px; cursor: pointer;
}
.today-btn {
  padding: 8px 16px; border-radius: 8px; border: none;
  background: var(--accent, #f59e0b); color: #fff; font-size: 14px; cursor: pointer;
}

.today-info-card {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 16px; padding: 24px; margin-bottom: 16px;
}
.today-main { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.today-date { display: flex; align-items: center; gap: 16px; }
.day-num { font-size: 56px; font-weight: 700; color: #fff; line-height: 1; }
.date-detail { display: flex; flex-direction: column; gap: 4px; }
.weekday { font-size: 16px; color: rgba(255,255,255,0.9); }
.solar { font-size: 13px; color: rgba(255,255,255,0.6); }
.today-lunar { text-align: right; }
.lunar-date { font-size: 20px; color: #f59e0b; font-weight: 500; }
.lunar-ganzhi { font-size: 14px; color: rgba(255,255,255,0.7); margin-top: 4px; }
.today-extra { display: flex; justify-content: space-around; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); }
.extra-item { text-align: center; }
.extra-label { display: block; font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 4px; }
.extra-value { font-size: 15px; color: #fff; }

.yiji-card {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;
}
.yi-section, .ji-section {
  background: var(--bgCard, rgba(255,255,255,0.06)); border-radius: 12px; padding: 16px;
}
.yi-title, .ji-title { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 600; margin-bottom: 10px; }
.yi-icon { color: #10b981; }
.ji-icon { color: #ef4444; }
.yi-title { color: #10b981; }
.ji-title { color: #ef4444; }
.yi-content, .ji-content { font-size: 13px; color: var(--textMuted, rgba(255,255,255,0.7)); line-height: 1.6; }

.calendar-grid { background: var(--bgCard, rgba(255,255,255,0.06)); border-radius: 16px; padding: 16px; margin-bottom: 24px; }
.calendar-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 8px; }
.weekday-item { text-align: center; font-size: 13px; color: var(--textMuted, rgba(255,255,255,0.5)); padding: 8px 0; }
.calendar-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.day-cell {
  aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  border-radius: 8px; cursor: pointer; transition: all 0.2s; padding: 4px;
}
.day-cell:hover { background: var(--accent, #f59e0b); }
.day-cell.other-month { opacity: 0.3; }
.day-cell.today { background: var(--accent, #f59e0b); }
.day-cell.selected { background: var(--accent, #f59e0b); box-shadow: 0 0 0 2px #fff; }
.day-cell.weekend .day-solar { color: #ef4444; }
.day-solar { font-size: 16px; color: var(--textPrimary, #fff); font-weight: 500; }
.day-lunar { font-size: 10px; color: var(--textMuted, rgba(255,255,255,0.5)); margin-top: 2px; }
.day-cell.today .day-solar, .day-cell.today .day-lunar,
.day-cell.selected .day-solar, .day-cell.selected .day-lunar { color: #fff; }

.calendar-cta { text-align: center; margin-bottom: 24px; }
.calendar-cta p { font-size: 14px; color: var(--textMuted, rgba(255,255,255,0.6)); margin: 0 0 16px 0; }
.calendar-cta .cta-btn {
  padding: 12px 24px; border-radius: 24px; border: none; font-size: 14px; cursor: pointer;
  background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; margin: 0 8px;
  transition: all 0.2s;
}
.calendar-cta .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(245,158,11,0.4); }
.calendar-cta .cta-btn.secondary { background: var(--bgCard, rgba(255,255,255,0.1)); }
.calendar-cta .cta-btn.secondary:hover { background: var(--accent, #f59e0b); }

@media (max-width: 768px) {
  .calendar-header h2 { font-size: 22px; }
  .day-num { font-size: 40px; }
  .today-main { flex-direction: column; gap: 16px; text-align: center; }
  .today-lunar { text-align: center; }
  .yiji-card { grid-template-columns: 1fr; }
  .calendar-cta .cta-btn { display: block; width: 100%; margin: 8px 0; }
}
</style>
