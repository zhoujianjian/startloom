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
        <div class="logo" @click="currentTab = 'home'"><span class="logo-icon">八字</span><span class="logo-text">天机命理</span></div>
      </div>
      <div class="header-center">
        <div class="nav-item" :class="{ active: currentTab === 'home' }" @click="currentTab = 'home'">首页</div>
        <div class="nav-item" :class="{ active: currentTab === 'tools' }" @click="currentTab = 'tools'">免费工具</div>
        <div class="nav-item" :class="{ active: currentTab === 'divination' }" @click="currentTab = 'divination'">在线占卜</div>
        <div class="nav-item" :class="{ active: currentTab === 'paipan' }" @click="currentTab = 'paipan'">八字排盘</div>
        <div class="nav-item" :class="{ active: currentTab === 'hepan' }" @click="currentTab = 'hepan'">合婚配对</div>
        <div class="nav-item" :class="{ active: currentTab === 'calendar' }" @click="currentTab = 'calendar'">万年历</div>
        <div class="nav-item" @click="goToLearn">命理学堂</div>
        <div class="nav-item" :class="{ active: currentTab === 'member' }" @click="goToMember">会员</div>
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
      <div class="nav-item" @click="switchTab('home')">🏠 首页</div>
      <div class="nav-item" @click="switchTab('tools')">🛠️ 免费工具</div>
      <div class="nav-item" @click="switchTab('divination')">🔮 在线占卜</div>
      <div class="nav-item" @click="switchTab('paipan')">📊 八字排盘</div>
      <div class="nav-item" @click="switchTab('hepan')">💑 合婚配对</div>
      <div class="nav-item" @click="switchTab('calendar')">📅 万年历</div>
      <div class="nav-item" @click="switchTab('learn')">📚 命理学堂</div>
      <div class="nav-item" @click="switchTab('member')">👑 会员中心</div>
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


    <!-- 今日运势提示条 -->
    <div class="daily-tip-bar" v-if="currentTab === 'home'">
      <div class="tip-content">
        <span class="tip-date">📅 {{ todayDateStr }}</span>
        <span class="tip-divider">|</span>
        <span class="tip-lunar">{{ todayLunarStr }}</span>
        <span class="tip-divider">|</span>
        <span class="tip-yi">宜：{{ dailyYi }}</span>
        <span class="tip-divider">|</span>
        <span class="tip-ji">忌：{{ dailyJi }}</span>
      </div>
      <div class="tip-stats">
        <span class="stat-item">🔥 今日已测 <strong>{{ todayCount }}</strong> 次</span>
        <span class="stat-item online">🟢 <strong>{{ onlineCount }}</strong> 人在线</span>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 首页 -->
      <div v-if="currentTab === 'home'" class="tab-content home-tab">
        <div class="hero-section">
          <h1>天机命理 · 八字排盘</h1>
          <p>传承千年易学智慧，专业解读命理玄机</p>
        </div>
        
        <!-- 限时优惠横幅 -->
        <div class="promo-banner" v-if="showPromoBanner" @click="openPromoMaster">
          <span class="promo-icon">🎁</span>
          <span class="promo-text">新用户专享：首次咨询立减 <strong>50元</strong></span>
          <span class="promo-countdown">
            <span class="countdown-label">倒计时</span>
            <span class="countdown-time">{{ promoCountdown }}</span>
          </span>
          <span class="promo-close" @click.stop="closePromoBanner">×</span>
        </div>
        
        <!-- 免费工具箱 - 放在最前面，用户最常用 -->
        <ToolsGrid ref="toolsGridRef" @open-master="openMasterService" @switch-tab="switchTab" @modal-change="handleToolModalChange" />
        
        <!-- 热门测试 + 实时动态 - 社交证明 -->
        <HotAndLive @open-tool="handleOpenTool" />
        
        <!-- 今日运势弹窗 -->
        <DailyFortune v-if="showFortuneModal" @close="showFortuneModal = false" @open-master="openMasterService" :is-modal="true" />
        
        <!-- 历史记录弹窗 -->
        <TestHistory v-if="showHistoryModal" ref="testHistoryRef" @close="showHistoryModal = false" @show-login="showLoginModal = true" @open-tool="handleOpenTool" :is-modal="true" />
        
        <!-- 用户好评滚动 + 功德箱 -->
        <div class="social-proof-section">
          <!-- 滚动好评 -->
          <div class="reviews-scroll">
            <div class="reviews-header">
              <span class="reviews-title">🌟 用户好评</span>
              <button class="write-review-btn" @click="showReviewModal = true">✍️ 写评价</button>
            </div>
            <div class="reviews-container">
              <div class="reviews-track">
                <div class="review-item" v-for="(r, i) in displayReviews" :key="i">
                  <span class="review-avatar">{{ r.avatar }}</span>
                  <div class="review-content">
                    <span class="review-name">{{ r.name }}</span>
                    <span class="review-text">{{ r.text }}</span>
                    <span class="review-time">{{ r.time }}</span>
                    <span class="review-mine" v-if="r.isMine">我的评价</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 功德箱 -->
          <div class="merit-box" @click="showMeritModal = true">
            <div class="merit-icon">🙏</div>
            <div class="merit-info">
              <span class="merit-title">功德箱</span>
              <span class="merit-desc">点香祈福 · 积累功德</span>
            </div>
            <span class="merit-arrow">→</span>
          </div>
        </div>
        
        <!-- 分享引导 -->
        <div class="share-section">
          <span class="share-text">觉得准？分享给好友</span>
          <div class="share-btns">
            <button class="share-btn wechat" @click="shareToWechat">
              <span>💚</span> 微信
            </button>
            <button class="share-btn copy" @click="copyShareLink">
              <span>🔗</span> 复制链接
            </button>
          </div>
        </div>
      </div>
      
      <!-- 功德箱弹窗 -->
      <div class="merit-modal" v-if="showMeritModal" @click.self="showMeritModal = false">
        <div class="merit-modal-content">
          <div class="merit-modal-header">
            <h3>🙏 功德箱 · 点香祈福</h3>
            <span class="close-btn" @click="showMeritModal = false">×</span>
          </div>
          <div class="merit-modal-body">
            <div class="incense-display">
              <div class="incense-burner">🏮</div>
              <p class="incense-tip">心诚则灵，功德无量</p>
            </div>
            <div class="merit-options">
              <div class="merit-option" v-for="opt in meritOptions" :key="opt.price" :class="{ selected: selectedMerit === opt.price }" @click="selectedMerit = opt.price">
                <span class="opt-icon">{{ opt.icon }}</span>
                <span class="opt-name">{{ opt.name }}</span>
                <span class="opt-price">¥{{ opt.price }}</span>
              </div>
            </div>
            <div class="merit-wish">
              <label>许下心愿（选填）</label>
              <textarea v-model="meritWish" placeholder="写下您的心愿，诚心祈福..." rows="2"></textarea>
            </div>
            <button class="merit-submit" @click="submitMerit" :disabled="!selectedMerit || meritLoading">
              {{ meritLoading ? '祈福中...' : (selectedMerit ? `点香祈福 ¥${selectedMerit}` : '请选择香火') }}
            </button>
            <p class="merit-note">💡 香火钱用于网站运营维护，感谢您的支持</p>
          </div>
        </div>
      </div>
      
      <!-- 用户评价弹窗 -->
      <div class="review-modal" v-if="showReviewModal" @click.self="showReviewModal = false">
        <div class="review-modal-content">
          <div class="review-modal-header">
            <h3>✍️ 写下您的评价</h3>
            <span class="close-btn" @click="showReviewModal = false">×</span>
          </div>
          <div class="review-modal-body">
            <div class="review-rating">
              <label>满意度</label>
              <div class="rating-stars">
                <span v-for="s in 5" :key="s" class="star" :class="{ active: reviewForm.rating >= s }" @click="reviewForm.rating = s">⭐</span>
              </div>
            </div>
            <div class="review-service">
              <label>使用的服务</label>
              <select v-model="reviewForm.service">
                <option value="">请选择</option>
                <option value="八字排盘">八字排盘</option>
                <option value="八字合盘">八字合盘</option>
                <option value="姓名测试">姓名测试</option>
                <option value="周公解梦">周公解梦</option>
                <option value="大师咨询">大师咨询</option>
                <option value="其他工具">其他工具</option>
              </select>
            </div>
            <div class="review-text">
              <label>评价内容</label>
              <textarea v-model="reviewForm.content" placeholder="分享您的使用体验..." rows="3" maxlength="100"></textarea>
              <span class="char-count">{{ reviewForm.content.length }}/100</span>
            </div>
            <button class="review-submit" @click="submitReview" :disabled="reviewLoading || !reviewForm.content">
              {{ reviewLoading ? '提交中...' : '提交评价' }}
            </button>
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

      <!-- 天机问答 -->
      <div v-if="currentTab === 'divination'" class="tab-content divination-tab">
        <div class="divination-layout">
          <!-- 左侧边栏 -->
          <div class="div-sidebar">
            <div class="sidebar-title">天机问答</div>
            <div class="sidebar-section">
              <div class="section-label">🔥 热门推荐</div>
              <div class="sidebar-item" :class="{ active: activeDiv === 'chat' }" @click="activeDiv = 'chat'">
                <span class="item-icon">💬</span><span>天机问答</span><span class="badge-free">免费</span>
              </div>
              <div class="sidebar-item" :class="{ active: activeDiv === 'tarot' }" @click="activeDiv = 'tarot'">
                <span class="item-icon">🃏</span><span>塔罗牌占卜</span><span class="badge-hot">热</span>
              </div>
              <div class="sidebar-item" :class="{ active: activeDiv === 'daily' }" @click="activeDiv = 'daily'">
                <span class="item-icon">🎋</span><span>今日运势签</span>
              </div>
            </div>
            <div class="sidebar-section">
              <div class="section-label">💕 姻缘感情</div>
              <div class="sidebar-item" :class="{ active: activeDiv === 'yuelao' }" @click="activeDiv = 'yuelao'">
                <span class="item-icon">💘</span><span>月老灵签</span><span class="badge-hot">热</span>
              </div>
              <div class="sidebar-item" :class="{ active: activeDiv === 'horoscope' }" @click="activeDiv = 'horoscope'">
                <span class="item-icon">♈</span><span>星座运势</span>
              </div>
              <div class="sidebar-item" :class="{ active: activeDiv === 'birthday' }" @click="activeDiv = 'birthday'">
                <span class="item-icon">🎂</span><span>生日密码</span>
              </div>
            </div>
            <div class="sidebar-section">
              <div class="section-label">💰 财运事业</div>
              <div class="sidebar-item" :class="{ active: activeDiv === 'caishen' }" @click="activeDiv = 'caishen'">
                <span class="item-icon">🧧</span><span>财神灵签</span>
              </div>
              <div class="sidebar-item" :class="{ active: activeDiv === 'zodiac' }" @click="activeDiv = 'zodiac'">
                <span class="item-icon">🐲</span><span>生肖运势</span>
              </div>
              <div class="sidebar-item" :class="{ active: activeDiv === 'numerology' }" @click="activeDiv = 'numerology'">
                <span class="item-icon">🔢</span><span>生命灵数</span>
              </div>
            </div>
            <div class="sidebar-section">
              <div class="section-label">🙏 祈福求签</div>
              <div class="sidebar-item" :class="{ active: activeDiv === 'guanyin' }" @click="activeDiv = 'guanyin'">
                <span class="item-icon">🪷</span><span>观音灵签</span>
              </div>
              <div class="sidebar-item" :class="{ active: activeDiv === 'angel' }" @click="activeDiv = 'angel'">
                <span class="item-icon">👼</span><span>天使数字</span><span class="badge-new">新</span>
              </div>
              <div class="sidebar-item" :class="{ active: activeDiv === 'rune' }" @click="activeDiv = 'rune'">
                <span class="item-icon">ᚱ</span><span>北欧符文</span><span class="badge-new">新</span>
              </div>
            </div>
            <div class="sidebar-section">
              <div class="section-label">📖 深度解读</div>
              <div class="sidebar-item" :class="{ active: activeDiv === 'constellation' }" @click="activeDiv = 'constellation'">
                <span class="item-icon">✨</span><span>星座详解</span>
              </div>
            </div>
          </div>
          
          <!-- 移动端横向滚动标签 -->
          <div class="div-mobile-tabs">
            <div class="mobile-tabs-scroll">
              <div class="mobile-tab" :class="{ active: activeDiv === 'chat' }" @click="activeDiv = 'chat'">💬 问答</div>
              <div class="mobile-tab" :class="{ active: activeDiv === 'tarot' }" @click="activeDiv = 'tarot'">🃏 塔罗</div>
              <div class="mobile-tab" :class="{ active: activeDiv === 'daily' }" @click="activeDiv = 'daily'">🎋 今日</div>
              <div class="mobile-tab" :class="{ active: activeDiv === 'yuelao' }" @click="activeDiv = 'yuelao'">💘 月老</div>
              <div class="mobile-tab" :class="{ active: activeDiv === 'caishen' }" @click="activeDiv = 'caishen'">🧧 财神</div>
              <div class="mobile-tab" :class="{ active: activeDiv === 'guanyin' }" @click="activeDiv = 'guanyin'">🪷 观音</div>
              <div class="mobile-tab" :class="{ active: activeDiv === 'horoscope' }" @click="activeDiv = 'horoscope'">♈ 星座</div>
              <div class="mobile-tab" :class="{ active: activeDiv === 'zodiac' }" @click="activeDiv = 'zodiac'">🐲 生肖</div>
              <div class="mobile-tab" :class="{ active: activeDiv === 'angel' }" @click="activeDiv = 'angel'">👼 天使</div>
              <div class="mobile-tab" :class="{ active: activeDiv === 'rune' }" @click="activeDiv = 'rune'">ᚱ 符文</div>
              <div class="mobile-tab" :class="{ active: activeDiv === 'birthday' }" @click="activeDiv = 'birthday'">🎂 生日</div>
              <div class="mobile-tab" :class="{ active: activeDiv === 'numerology' }" @click="activeDiv = 'numerology'">🔢 灵数</div>
              <div class="mobile-tab" :class="{ active: activeDiv === 'constellation' }" @click="activeDiv = 'constellation'">✨ 详解</div>
            </div>
          </div>
          
          <!-- 右侧内容区 -->
          <div class="div-main">
            <!-- 天机问答 -->
            <div class="div-content" v-if="activeDiv === 'chat'">
              <div class="content-header">
                <h3>🔮 天机问答</h3>
                <p class="header-desc">百万真实案例 + 资深大师经验，<strong>免费</strong>为您解答命理疑惑</p>
              </div>
              
              <!-- 功能亮点 -->
              <div class="ai-features">
                <div class="feature-item"><span class="feature-icon">📊</span><span>百万案例</span></div>
                <div class="feature-item"><span class="feature-icon">🧙</span><span>大师经验</span></div>
                <div class="feature-item"><span class="feature-icon">⚡</span><span>秒级响应</span></div>
                <div class="feature-item"><span class="feature-icon">🔒</span><span>隐私保护</span></div>
              </div>
              
              <!-- 热门问题 -->
              <div class="hot-questions" v-if="chatMessages.length === 0">
                <div class="hot-title">🔥 热门问题 <span class="hot-count">已解答 {{ hotAnswerCount }} 次</span></div>
                <div class="hot-list-scroll">
                  <span class="hot-item" @click="askHotQuestion('我今年的财运怎么样？')">💰 我今年财运如何</span>
                  <span class="hot-item" @click="askHotQuestion('我的桃花运什么时候来？')">💕 桃花运何时来</span>
                  <span class="hot-item" @click="askHotQuestion('我适合什么职业？')">💼 适合什么职业</span>
                  <span class="hot-item" @click="askHotQuestion('我和TA的缘分如何？')">❤️ 和TA缘分如何</span>
                  <span class="hot-item" @click="askHotQuestion('今年有什么需要注意的？')">⚠️ 今年注意事项</span>
                  <span class="hot-item" @click="askHotQuestion('我的事业发展方向？')">📈 事业发展方向</span>
                </div>
              </div>
              
              <div class="chat-container">
                <div class="chat-messages" ref="chatMessagesRef">
                  <div class="chat-msg assistant" v-if="chatMessages.length === 0">
                    <div class="msg-avatar">🔮</div>
                    <div class="msg-content">
                      <div class="msg-name">天机命理师</div>
                      <div class="msg-text">您好！我是天机命理师，融合了<strong>百万真实命理案例</strong>和<strong>资深大师</strong>的解读经验。无论是八字、星座、风水还是姻缘，都可以问我。<br/><br/>💡 <strong>温馨提示：</strong>如需更深入的个性化解读，可以咨询我们的<span class="master-link" @click="openMasterService">真人大师</span>，获得一对一专属服务。</div>
                    </div>
                  </div>
                  <div v-for="(msg, idx) in chatMessages" :key="idx" :class="['chat-msg', msg.role]">
                    <div class="msg-avatar" v-if="msg.role === 'assistant'">🔮</div>
                    <div class="msg-content">
                      <div class="msg-name" v-if="msg.role === 'assistant'">天机命理师</div>
                      <div class="msg-text">{{ msg.content }}</div>
                    </div>
                    <div class="msg-avatar user-avatar" v-if="msg.role === 'user'">👤</div>
                  </div>
                </div>
                <div class="chat-input-area">
                  <input v-model="chatInput" @keyup.enter="sendChatMessage" placeholder="输入您的命理问题，如：我今年运势如何..." />
                  <button @click="sendChatMessage" :disabled="chatLoading">{{ chatLoading ? '分析中...' : '发送' }}</button>
                </div>
              </div>
              
              <!-- 大师引导 -->
              <div class="master-guide" v-if="chatMessages.length >= 2">
                <div class="guide-icon">🧙</div>
                <div class="guide-content">
                  <div class="guide-title">想要更精准的解读？</div>
                  <div class="guide-desc">AI分析仅供参考，真人大师可结合您的完整八字进行深度解读</div>
                </div>
                <button class="guide-btn" @click="openMasterService">咨询大师</button>
              </div>
            </div>
            
            <!-- 星座运势 -->
            <div class="div-content" v-if="activeDiv === 'horoscope'">
              <div class="content-header"><h3>♈ 星座运势</h3><p>查看十二星座今日/本周/本月运势</p></div>
              <div class="select-grid constellation-select">
                <div class="select-item" v-for="c in constellations" :key="c.name" :class="{ active: selectedConstellation === c.name }" @click="selectConstellation(c.name)">
                  <span class="item-icon">{{ c.icon }}</span><span class="item-name">{{ c.name }}</span>
                </div>
              </div>
              <div class="action-bar" ref="horoscopeAction" v-if="selectedConstellation">
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
              <div class="content-header"><h3>🐲 生肖运势</h3><p>查看十二生肖年度运势详解</p></div>
              <div class="select-grid zodiac-select">
                <div class="select-item" v-for="z in zodiacList" :key="z.name" :class="{ active: selectedZodiac === z.name }" @click="selectZodiac(z.name)">
                  <span class="item-icon">{{ z.icon }}</span><span class="item-name">{{ z.name }}</span>
                </div>
              </div>
              <div class="action-bar" ref="zodiacAction" v-if="selectedZodiac">
                <button class="action-btn" @click="queryZodiac" :disabled="zodiacLoading">{{ zodiacLoading ? '查询中...' : '查询 ' + selectedZodiac + ' 运势' }}</button>
              </div>
              <div class="result-box" v-if="zodiacResult">{{ zodiacResult }}</div>
            </div>
            
            <!-- 今日运势 -->
            <div class="div-content" v-if="activeDiv === 'daily'">
              <div class="content-header"><h3>📅 今日运势</h3><p>每日运势签文，指引今日方向</p></div>
              <div class="daily-fortune-card">
                <div class="fortune-draw" @click="drawDailyFortune" v-if="!dailyFortuneResult">
                  <div class="draw-icon">🎋</div>
                  <div class="draw-text">点击抽取今日运势签</div>
                </div>
                <div class="fortune-result" v-else>
                  <div class="fortune-level" :class="dailyFortuneLevel">{{ dailyFortuneLevel }}</div>
                  <div class="fortune-text">{{ dailyFortuneResult }}</div>
                  <button class="redraw-btn" @click="dailyFortuneResult = ''">重新抽签</button>
                </div>
              </div>
            </div>
            
            <!-- 塔罗牌占卜 -->
            <div class="div-content" v-if="activeDiv === 'tarot'">
              <div class="content-header"><h3>🃏 塔罗牌占卜</h3><p>静心冥想，让塔罗牌指引你的方向</p></div>
              <div class="tarot-container">
                <div class="tarot-question">
                  <label>你想问什么？（选填）</label>
                  <input v-model="tarotQuestion" placeholder="如：感情、事业、财运..." />
                </div>
                <div class="tarot-spread">
                  <div class="tarot-card" :class="{ flipped: tarotCards[0] }" @click="drawTarotCard(0)">
                    <div class="card-back">🎴</div>
                    <div class="card-front" v-if="tarotCards[0]">{{ tarotCards[0].name }}<br/>{{ tarotCards[0].position }}</div>
                  </div>
                  <div class="tarot-card" :class="{ flipped: tarotCards[1] }" @click="drawTarotCard(1)">
                    <div class="card-back">🎴</div>
                    <div class="card-front" v-if="tarotCards[1]">{{ tarotCards[1].name }}<br/>{{ tarotCards[1].position }}</div>
                  </div>
                  <div class="tarot-card" :class="{ flipped: tarotCards[2] }" @click="drawTarotCard(2)">
                    <div class="card-back">🎴</div>
                    <div class="card-front" v-if="tarotCards[2]">{{ tarotCards[2].name }}<br/>{{ tarotCards[2].position }}</div>
                  </div>
                </div>
                <div class="tarot-hint" v-if="!tarotCards[0]">点击卡牌抽取塔罗牌</div>
                <button class="action-btn" v-if="tarotCards[0] && tarotCards[1] && tarotCards[2]" @click="interpretTarot" :disabled="tarotLoading">
                  {{ tarotLoading ? '解读中...' : '🔮 AI解读牌阵' }}
                </button>
                <div class="result-box" v-if="tarotResult">{{ tarotResult }}</div>
              </div>
            </div>
            
            <!-- 天使数字 -->
            <div class="div-content" v-if="activeDiv === 'angel'">
              <div class="content-header"><h3>👼 天使数字</h3><p>解读你看到的重复数字的神秘含义</p></div>
              <div class="angel-container">
                <div class="angel-input">
                  <label>输入你看到的数字</label>
                  <input v-model="angelNumber" placeholder="如：111、222、1234..." maxlength="6" />
                </div>
                <button class="action-btn" @click="interpretAngel" :disabled="!angelNumber || angelLoading">
                  {{ angelLoading ? '解读中...' : '👼 解读天使数字' }}
                </button>
                <div class="result-box" v-if="angelResult">{{ angelResult }}</div>
              </div>
            </div>
            
            <!-- 北欧符文 -->
            <div class="div-content" v-if="activeDiv === 'rune'">
              <div class="content-header"><h3>ᚱ 北欧符文</h3><p>古老的北欧符文占卜，揭示命运的指引</p></div>
              <div class="rune-container">
                <div class="rune-draw" @click="drawRune" v-if="!runeResult">
                  <div class="rune-bag">🎒</div>
                  <div class="rune-text">点击符文袋抽取符文</div>
                </div>
                <div class="rune-result" v-else>
                  <div class="rune-symbol">{{ runeSymbol }}</div>
                  <div class="rune-name">{{ runeName }}</div>
                  <div class="result-box">{{ runeResult }}</div>
                  <button class="redraw-btn" @click="runeResult = ''">重新抽取</button>
                </div>
              </div>
            </div>
            
            <!-- 观音灵签 -->
            <div class="div-content" v-if="activeDiv === 'guanyin'">
              <div class="content-header"><h3>🙏 观音灵签</h3><p>诚心祈求，观音菩萨指引迷津</p></div>
              <div class="lottery-container">
                <div class="lottery-draw" @click="drawLottery('guanyin')" v-if="!lotteryResult || lotteryType !== 'guanyin'">
                  <div class="lottery-icon">🙏</div>
                  <div class="lottery-text">诚心默念所求之事，点击求签</div>
                </div>
                <div class="result-box" v-if="lotteryResult && lotteryType === 'guanyin'">
                  <div class="lottery-number">第 {{ lotteryNumber }} 签</div>
                  {{ lotteryResult }}
                  <button class="redraw-btn" @click="lotteryResult = ''">重新求签</button>
                </div>
              </div>
            </div>
            
            <!-- 月老灵签 -->
            <div class="div-content" v-if="activeDiv === 'yuelao'">
              <div class="content-header"><h3>💕 月老灵签</h3><p>姻缘天定，月老指点红线</p></div>
              <div class="lottery-container">
                <div class="lottery-draw" @click="drawLottery('yuelao')" v-if="!lotteryResult || lotteryType !== 'yuelao'">
                  <div class="lottery-icon">💕</div>
                  <div class="lottery-text">诚心默念姻缘之事，点击求签</div>
                </div>
                <div class="result-box" v-if="lotteryResult && lotteryType === 'yuelao'">
                  <div class="lottery-number">第 {{ lotteryNumber }} 签</div>
                  {{ lotteryResult }}
                  <button class="redraw-btn" @click="lotteryResult = ''">重新求签</button>
                </div>
              </div>
            </div>
            
            <!-- 财神灵签 -->
            <div class="div-content" v-if="activeDiv === 'caishen'">
              <div class="content-header"><h3>💰 财神灵签</h3><p>财运亨通，财神爷指点财路</p></div>
              <div class="lottery-container">
                <div class="lottery-draw" @click="drawLottery('caishen')" v-if="!lotteryResult || lotteryType !== 'caishen'">
                  <div class="lottery-icon">💰</div>
                  <div class="lottery-text">诚心默念财运之事，点击求签</div>
                </div>
                <div class="result-box" v-if="lotteryResult && lotteryType === 'caishen'">
                  <div class="lottery-number">第 {{ lotteryNumber }} 签</div>
                  {{ lotteryResult }}
                  <button class="redraw-btn" @click="lotteryResult = ''">重新求签</button>
                </div>
              </div>
            </div>
            
            <!-- 星座详解 -->
            <div class="div-content" v-if="activeDiv === 'constellation'">
              <div class="content-header"><h3>✨ 星座详解</h3><p>深入了解十二星座的性格特点</p></div>
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
              <div class="content-header"><h3>🎂 生日密码</h3><p>解读你的生日蕴含的命运密码</p></div>
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
            
            <!-- 生命数字 -->
            <div class="div-content" v-if="activeDiv === 'numerology'">
              <div class="content-header"><h3>🔢 生命数字</h3><p>根据生日计算你的生命灵数</p></div>
              <div class="numerology-container">
                <div class="birthday-input">
                  <label>选择您的生日</label>
                  <input type="date" v-model="numerologyDate" />
                </div>
                <button class="action-btn" v-if="numerologyDate" @click="calcNumerology" :disabled="numerologyLoading">
                  {{ numerologyLoading ? '计算中...' : '🔢 计算生命数字' }}
                </button>
                <div class="numerology-result" v-if="numerologyNumber">
                  <div class="num-display">{{ numerologyNumber }}</div>
                  <div class="num-name">生命灵数</div>
                </div>
                <div class="result-box" v-if="numerologyResult">{{ numerologyResult }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 工具箱 -->
      <div v-if="currentTab === 'tools'" class="tab-content tools-tab">
        <div class="tools-page-header">
          <h2>🛠️ 免费命理工具箱</h2>
          <p>25款专业命理测算工具，全部免费使用</p>
        </div>
        <ToolsGrid 
          ref="toolsPageGridRef" 
          @open-master="openMasterService" 
          @switch-tab="switchTab" 
          @modal-change="handleToolModalChange"
          :show-full-page="true"
        />
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

    <!-- 悬浮留言按钮 - 天机问答页面隐藏 -->
    <div class="floating-feedback" v-if="currentTab !== 'divination'" @click="showFeedbackModal = true"><span>💬</span></div>
    
    <!-- 底部悬浮大师服务横幅 -->
    <MasterFloatBar ref="masterFloatBarRef" />
    
    <!-- 全局工具弹窗（用于从导航栏打开工具，不受tab限制） -->
    <div class="global-tools-modal">
      <ToolsGrid 
        ref="globalToolsGridRef" 
        @open-master="openMasterService" 
        @switch-tab="switchTab" 
        @modal-change="handleToolModalChange" 
      />
    </div>
  </div>
</template>


<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { userLogin, simpleRegister, loginOut, checkLogin, getVipPlans, getVipBenefits, getVipInfo, createVipOrder, submitFeedback, getPaymentOptions, createPayOrder, confirmPayment } from '../api/api'
import { ElMessage } from 'element-plus'
import { themes, getCurrentTheme, setTheme, initTheme } from '../utils/themes'
import { trackPV, startHeartbeat, stopHeartbeat, getRealTimeStats } from '../utils/analytics'
import MasterService from './MasterService.vue'
import MasterFloatBar from './MasterFloatBar.vue'
import ToolsGrid from './ToolsGrid.vue'
import DailyFortune from './DailyFortune.vue'
import TestHistory from './TestHistory.vue'
import HotAndLive from './HotAndLive.vue'

const router = useRouter()
const route = useRoute()
const masterFloatBarRef = ref(null)
const testHistoryRef = ref(null)
const toolsGridRef = ref(null)
const toolsPageGridRef = ref(null)
const globalToolsGridRef = ref(null)

// 处理打开工具
const handleOpenTool = (tool) => {
  // 切换到首页并打开对应工具弹窗
  currentTab.value = 'home'
  nextTick(() => {
    if (toolsGridRef.value && tool?.id) {
      toolsGridRef.value.openToolById(tool.id)
    }
  })
}

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
const showToolsDropdown = ref(false)
const showMobileTools = ref(false)
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

// 导航栏工具列表
const navTools = ref([
  { id: 'name-test', icon: '✍️', name: '姓名测试' },
  { id: 'zodiac-match', icon: '🐲', name: '生肖配对' },
  { id: 'constellation-match', icon: '⭐', name: '星座配对' },
  { id: 'daily-sign', icon: '🎋', name: '今日运势' },
  { id: 'dream', icon: '🌙', name: '周公解梦' },
  { id: 'fate-test', icon: '💘', name: '缘分测试' },
  { id: 'baby-name', icon: '👶', name: '宝宝起名' },
  { id: 'company-name', icon: '🏢', name: '公司起名' },
  { id: 'phone-test', icon: '📱', name: '手机测吉凶' },
  { id: 'plate-test', icon: '🚗', name: '车牌测吉凶' },
  { id: 'lucky-day', icon: '📅', name: '黄道吉日' },
  { id: 'past-life', icon: '🌀', name: '前世今生' }
])

// 从导航打开工具
const openNavTool = (tool) => {
  showToolsDropdown.value = false
  // 使用全局的 ToolsGrid 打开工具弹窗
  nextTick(() => {
    if (globalToolsGridRef.value) {
      globalToolsGridRef.value.openToolById(tool.id)
    }
  })
}

// 支付相关
const payStep = ref('')
const paymentOptions = ref({})
const currentOrder = ref({})
const payRemark = ref('')
const confirmLoading = ref(false)

// 天机问答相关
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
// 热门问题解答次数（基数 + 随机波动）
const hotAnswerCount = ref(Math.floor(128000 + Math.random() * 5000))

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
const lotteryType = ref('')
const lotteryNumber = ref(0)
const constLoading = ref(false)
const constResult = ref('')
const birthdayDate = ref('')
const birthdayLoading = ref(false)
const birthdayResult = ref('')

// 新增占卜功能变量
const dailyFortuneResult = ref('')
const dailyFortuneLevel = ref('')
const tarotQuestion = ref('')
const tarotCards = ref([null, null, null])
const tarotLoading = ref(false)
const tarotResult = ref('')
const angelNumber = ref('')
const angelLoading = ref(false)
const angelResult = ref('')
const runeSymbol = ref('')
const runeName = ref('')
const runeResult = ref('')
const numerologyDate = ref('')
const numerologyNumber = ref('')
const numerologyLoading = ref(false)
const numerologyResult = ref('')

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
  { icon: '🔮', title: '八字排盘', desc: '精准排盘分析命理', tab: 'paipan' },
  { icon: '💑', title: '八字合盘', desc: '男女配对婚姻分析', tab: 'hepan' },
  { icon: '📅', title: '万年历', desc: '农历黄道吉日查询', tab: 'calendar' },
  { icon: '🔮', title: '天机问答', desc: '命理疑惑在线解答', tab: 'divination' }
]

// 今日运势提示数据
const todayDateStr = computed(() => {
  const d = new Date()
  return `${d.getMonth() + 1}月${d.getDate()}日`
})
const todayLunarStr = computed(() => {
  const d = new Date()
  const lunar = solarToLunar(d.getFullYear(), d.getMonth() + 1, d.getDate())
  return `农历${lunarMonths[lunar.month - 1]}月${lunarDays[lunar.day - 1]}`
})
const dailyYi = computed(() => {
  const seed = new Date().getDate()
  return ['祈福', '求财', '出行', '签约'][seed % 4] + '、' + ['开业', '嫁娶', '搬家', '动土'][(seed + 1) % 4]
})
const dailyJi = computed(() => {
  const seed = new Date().getDate()
  return ['诉讼', '开仓', '破土', '安葬'][seed % 4]
})

// 在线统计
const todayCount = ref(0)
const onlineCount = ref(0)
let statsTimer = null
let useRealStats = false // 标记是否使用真实数据

const initStats = () => {
  // 先用本地模拟数据，等后端数据返回后会被覆盖
  const hour = new Date().getHours()
  const baseCount = 1200 + Math.floor(Math.random() * 300)
  todayCount.value = baseCount + hour * 45 + Math.floor(Math.random() * 20)
  onlineCount.value = Math.floor(50 + hour * 3 + Math.random() * 30)
  
  // 定时刷新（如果使用真实数据则从后端获取，否则本地模拟）
  statsTimer = setInterval(async () => {
    if (useRealStats) {
      // 从后端获取最新数据
      const stats = await getRealTimeStats()
      if (stats) {
        todayCount.value = stats.todayCount || todayCount.value
        onlineCount.value = stats.onlineCount || onlineCount.value
      }
    } else {
      // 本地模拟波动
      if (Math.random() > 0.7) todayCount.value += Math.floor(Math.random() * 3) + 1
      onlineCount.value = Math.max(20, onlineCount.value + Math.floor(Math.random() * 5) - 2)
    }
  }, 30000) // 30秒刷新一次
}

// 限时优惠倒计时
const showPromoBanner = ref(true)
const promoCountdown = ref('00:00:00')
const initPromoCountdown = () => {
  // 每天晚上12点重置
  const updateCountdown = () => {
    const now = new Date()
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
    const diff = endOfDay - now
    if (diff <= 0) {
      promoCountdown.value = '00:00:00'
      return
    }
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    promoCountdown.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  updateCountdown()
  setInterval(updateCountdown, 1000)
  // 检查是否已关闭过
  if (sessionStorage.getItem('promo-closed')) showPromoBanner.value = false
}

// 打开带优惠的大师咨询弹窗
const openPromoMaster = () => {
  if (masterFloatBarRef.value) {
    masterFloatBarRef.value.openModal(true) // true 表示新用户优惠
  }
}

// 关闭优惠横幅
const closePromoBanner = () => {
  showPromoBanner.value = false
  sessionStorage.setItem('promo-closed', 'true')
}

// 分享功能
const shareToWechat = () => {
  // 移动端尝试调用微信分享，PC端提示
  if (/MicroMessenger/i.test(navigator.userAgent)) {
    ElMessage.info('请点击右上角分享给好友')
  } else {
    ElMessage.info('请在微信中打开本页面进行分享')
  }
}
const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    ElMessage.success('链接已复制，快去分享给好友吧！')
  } catch {
    ElMessage.info('请手动复制地址栏链接分享')
  }
}

// 用户好评数据（默认假数据）
const defaultReviews = [
  { avatar: '👨', name: '张**', text: '大师算得太准了！事业运势分析得很到位', time: '3分钟前' },
  { avatar: '👩', name: '李**', text: '姻缘合盘很准，和老公确实很配', time: '5分钟前' },
  { avatar: '👨', name: '王**', text: '八字排盘详细专业，比其他网站好太多', time: '8分钟前' },
  { avatar: '👩', name: '陈**', text: '宝宝起名服务很满意，名字寓意好', time: '12分钟前' },
  { avatar: '👨', name: '刘**', text: '流年运势预测准确，提前避开了小人', time: '15分钟前' },
  { avatar: '👩', name: '赵**', text: '周公解梦解析得很透彻，心里踏实了', time: '18分钟前' },
  { avatar: '👨', name: '孙**', text: '选的结婚吉日很顺利，感谢大师', time: '22分钟前' },
  { avatar: '👩', name: '周**', text: '手机号测吉凶很有意思，换了个号运气变好了', time: '25分钟前' },
  { avatar: '👨', name: '吴**', text: '公司起名后生意明显好转，神了', time: '30分钟前' },
  { avatar: '👩', name: '郑**', text: '每天来抽个签，心情都变好了', time: '35分钟前' }
]

// 用户自己的评论（包括被隐藏的负面评论）
const myReviews = ref([])
// 公开的好评（AI审核通过的）
const publicReviews = ref([])

// 显示的评论列表（合并默认+公开+自己的）
const displayReviews = computed(() => {
  const all = [...defaultReviews, ...publicReviews.value, ...myReviews.value]
  // 复制一份用于无限滚动
  return [...all, ...all]
})

// 评论弹窗
const showReviewModal = ref(false)
const reviewLoading = ref(false)
const reviewForm = reactive({
  rating: 5,
  service: '',
  content: ''
})

// 提交评论（AI审核）
const submitReview = async () => {
  if (!reviewForm.content.trim()) {
    ElMessage.warning('请输入评价内容')
    return
  }
  reviewLoading.value = true
  try {
    // 调用AI接口判断评论情感
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('starloomAI-token') || '' },
      body: JSON.stringify({
        message: `请判断以下用户评价是正面还是负面，只回复"正面"或"负面"两个字：\n"${reviewForm.content}"`,
        stream: false
      })
    })
    const result = await response.text()
    
    // 解析AI返回结果
    let isPositive = true
    if (result.includes('负面') || result.includes('差评') || result.includes('不好')) {
      isPositive = false
    }
    
    // 构建评论对象
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const newReview = {
      avatar: '👤',
      name: (userInfo.nickname || userInfo.phone || '匿名用户').slice(0, 1) + '**',
      text: reviewForm.content,
      time: '刚刚',
      service: reviewForm.service,
      rating: reviewForm.rating,
      isMine: true,
      isPublic: isPositive
    }
    
    if (isPositive) {
      // 正面评价：公开显示
      publicReviews.value.unshift(newReview)
      ElMessage.success('感谢您的好评！已发布')
    } else {
      // 负面评价：只有自己能看到
      myReviews.value.unshift(newReview)
      ElMessage.success('感谢您的反馈！我们会持续改进')
    }
    
    // 保存到本地存储
    localStorage.setItem('my-reviews', JSON.stringify(myReviews.value))
    localStorage.setItem('public-reviews', JSON.stringify(publicReviews.value))
    
    // 重置表单
    showReviewModal.value = false
    reviewForm.content = ''
    reviewForm.rating = 5
    reviewForm.service = ''
  } catch (e) {
    // 如果AI接口失败，默认当作正面评价
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const newReview = {
      avatar: '👤',
      name: (userInfo.nickname || '用户').slice(0, 1) + '**',
      text: reviewForm.content,
      time: '刚刚',
      isMine: true,
      isPublic: true
    }
    publicReviews.value.unshift(newReview)
    localStorage.setItem('public-reviews', JSON.stringify(publicReviews.value))
    ElMessage.success('评价已发布')
    showReviewModal.value = false
    reviewForm.content = ''
  }
  reviewLoading.value = false
}

// 加载本地存储的评论
const loadLocalReviews = () => {
  try {
    const savedMy = localStorage.getItem('my-reviews')
    const savedPublic = localStorage.getItem('public-reviews')
    if (savedMy) myReviews.value = JSON.parse(savedMy)
    if (savedPublic) publicReviews.value = JSON.parse(savedPublic)
  } catch (e) { /* ignore */ }
}

// 功德箱相关
const showMeritModal = ref(false)
const selectedMerit = ref(null)
const meritWish = ref('')
const meritOptions = [
  { icon: '🕯️', name: '一炷清香', price: 1.88 },
  { icon: '🪔', name: '三炷高香', price: 6.66 },
  { icon: '🏮', name: '九炷福香', price: 9.99 },
  { icon: '🎋', name: '功德圆满', price: 66.66 }
]

const meritLoading = ref(false)
const submitMerit = async () => {
  if (!selectedMerit.value || meritLoading.value) return
  meritLoading.value = true
  try {
    // 模拟提交（后续可接入实际支付）
    await new Promise(resolve => setTimeout(resolve, 800))
    ElMessage.success(`🙏 感谢您的香火钱 ¥${selectedMerit.value}，功德无量！`)
    showMeritModal.value = false
    selectedMerit.value = null
    meritWish.value = ''
  } catch (e) {
    ElMessage.error('提交失败，请重试')
  }
  meritLoading.value = false
}

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
const openMasterService = () => {
  // 打开大师服务弹窗
  if (masterFloatBarRef.value) {
    masterFloatBarRef.value.openModal()
  }
}

// 处理工具弹窗状态变化，控制底部浮动栏显示
const handleToolModalChange = (isOpen) => {
  if (masterFloatBarRef.value) {
    masterFloatBarRef.value.setModalOpen(isOpen)
  }
}

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
    const baseUrl = import.meta.env.VITE_APP_BASE_API || ''
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

// 点击热门问题
const askHotQuestion = (question) => {
  chatInput.value = question
  sendChatMessage()
}

const queryHoroscope = async () => {
  if (!selectedConstellation.value) return
  horoscopeLoading.value = true; horoscopeResult.value = ''
  try {
    const baseUrl = import.meta.env.VITE_APP_BASE_API || ''
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
  lotteryType.value = type
  lotteryNumber.value = Math.floor(Math.random() * 100) + 1
  try {
    const baseUrl = import.meta.env.VITE_APP_BASE_API || ''
    const response = await fetch(`${baseUrl}/xingzuo/stream/lottery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('starloomAI-token') || '' },
      body: JSON.stringify({ type, number: lotteryNumber.value })
    })
    await handleStreamResponse(response, (content) => { lotteryResult.value = content })
  } catch (e) { lotteryResult.value = '抽签失败，请重试' }
}

// 通用AI占卜接口
const callAIDivination = async (prompt, onUpdate) => {
  const baseUrl = import.meta.env.VITE_APP_BASE_API || ''
  const response = await fetch(`${baseUrl}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('starloomAI-token') || '' },
    body: JSON.stringify({ message: prompt, stream: true })
  })
  await handleStreamResponse(response, onUpdate)
}

// 今日运势
const drawDailyFortune = async () => {
  const levels = ['大吉', '中吉', '小吉', '吉', '末吉', '凶']
  dailyFortuneLevel.value = levels[Math.floor(Math.random() * levels.length)]
  const prompt = `请为我抽取一支今日运势签，签文等级是"${dailyFortuneLevel.value}"。请给出：签诗（四句七言）、签文解读、今日宜忌、幸运数字和幸运颜色。用古风优雅的语气。`
  try {
    await callAIDivination(prompt, (content) => { dailyFortuneResult.value = content })
  } catch (e) { dailyFortuneResult.value = '今日宜静心养神，诸事顺遂。' }
}

// 塔罗牌
const tarotDeck = [
  '愚者', '魔术师', '女祭司', '皇后', '皇帝', '教皇', '恋人', '战车', '力量', '隐士',
  '命运之轮', '正义', '倒吊人', '死神', '节制', '恶魔', '塔', '星星', '月亮', '太阳', '审判', '世界'
]
const drawTarotCard = (index) => {
  if (tarotCards.value[index]) return
  const available = tarotDeck.filter(c => !tarotCards.value.some(tc => tc?.name === c))
  const card = available[Math.floor(Math.random() * available.length)]
  const position = Math.random() > 0.5 ? '正位' : '逆位'
  tarotCards.value[index] = { name: card, position }
}
const interpretTarot = async () => {
  tarotLoading.value = true; tarotResult.value = ''
  const cards = tarotCards.value.map(c => `${c.name}(${c.position})`).join('、')
  const question = tarotQuestion.value || '综合运势'
  const prompt = `我抽取了三张塔罗牌：${cards}，问题是"${question}"。请解读这个牌阵：1.每张牌的含义 2.牌阵整体解读 3.对问题的回答 4.行动建议。用神秘而温暖的语气。`
  try {
    await callAIDivination(prompt, (content) => { tarotResult.value = content })
  } catch (e) { tarotResult.value = '塔罗解读失败，请重试' }
  tarotLoading.value = false
  tarotCards.value = [null, null, null]
}

// 天使数字
const interpretAngel = async () => {
  angelLoading.value = true; angelResult.value = ''
  const prompt = `请解读天使数字"${angelNumber.value}"的含义。包括：1.这个数字的神秘含义 2.天使想传达的信息 3.对生活的指引 4.行动建议。用温暖灵性的语气。`
  try {
    await callAIDivination(prompt, (content) => { angelResult.value = content })
  } catch (e) { angelResult.value = '天使数字解读失败，请重试' }
  angelLoading.value = false
}

// 北欧符文
const runes = [
  { symbol: 'ᚠ', name: 'Fehu 财富' }, { symbol: 'ᚢ', name: 'Uruz 力量' }, { symbol: 'ᚦ', name: 'Thurisaz 保护' },
  { symbol: 'ᚨ', name: 'Ansuz 智慧' }, { symbol: 'ᚱ', name: 'Raido 旅程' }, { symbol: 'ᚲ', name: 'Kenaz 启示' },
  { symbol: 'ᚷ', name: 'Gebo 礼物' }, { symbol: 'ᚹ', name: 'Wunjo 喜悦' }, { symbol: 'ᚺ', name: 'Hagalaz 变革' },
  { symbol: 'ᚾ', name: 'Nauthiz 需求' }, { symbol: 'ᛁ', name: 'Isa 静止' }, { symbol: 'ᛃ', name: 'Jera 收获' }
]
const drawRune = async () => {
  const rune = runes[Math.floor(Math.random() * runes.length)]
  runeSymbol.value = rune.symbol
  runeName.value = rune.name
  const prompt = `我抽取了北欧符文"${rune.name}"（符号：${rune.symbol}）。请解读：1.这个符文的起源和含义 2.它代表的能量和信息 3.对当前处境的指引 4.如何运用这个符文的能量。用古老神秘的语气。`
  try {
    await callAIDivination(prompt, (content) => { runeResult.value = content })
  } catch (e) { runeResult.value = '符文解读失败，请重试' }
}

// 生命数字
const calcNumerology = async () => {
  numerologyLoading.value = true; numerologyResult.value = ''
  const digits = numerologyDate.value.replace(/-/g, '').split('').map(Number)
  let sum = digits.reduce((a, b) => a + b, 0)
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0)
  }
  numerologyNumber.value = sum
  const prompt = `我的生命灵数是${sum}（生日：${numerologyDate.value}）。请解读：1.生命灵数${sum}的核心特质 2.性格优势和挑战 3.适合的职业方向 4.感情特点 5.人生使命。用温暖智慧的语气。`
  try {
    await callAIDivination(prompt, (content) => { numerologyResult.value = content })
  } catch (e) { numerologyResult.value = '生命数字解读失败，请重试' }
  numerologyLoading.value = false
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
  initStats() // 初始化统计数据
  initPromoCountdown() // 初始化倒计时
  loadLocalReviews() // 加载本地评论
  
  // 根据路由 meta 设置默认 tab
  if (route.meta?.defaultTab) {
    currentTab.value = route.meta.defaultTab
  }
  
  // 埋点：页面浏览 + 启动心跳
  trackPV()
  startHeartbeat()
  
  // 获取实时统计数据
  loadRealTimeStats()
})

// 监听路由变化，更新 tab
watch(() => route.meta?.defaultTab, (newTab) => {
  if (newTab) {
    currentTab.value = newTab
  }
})

onUnmounted(() => {
  stopHeartbeat()
  if (statsTimer) {
    clearInterval(statsTimer)
    statsTimer = null
  }
})

// 加载实时统计数据
const loadRealTimeStats = async () => {
  const stats = await getRealTimeStats()
  if (stats) {
    todayCount.value = stats.todayCount || todayCount.value
    onlineCount.value = stats.onlineCount || onlineCount.value
    useRealStats = true // 标记使用真实数据
  }
}
</script>


<style scoped>
/* ========== 今日运势提示条 ========== */
.daily-tip-bar {
  background: linear-gradient(90deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1));
  border-bottom: 1px solid rgba(245,158,11,0.2);
  padding: 8px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  position: relative;
  z-index: 10;
}
.tip-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.tip-date { color: var(--accent, #f59e0b); font-weight: 500; }
.tip-divider { color: rgba(255,255,255,0.2); }
.tip-lunar { color: var(--textMuted, rgba(255,255,255,0.7)); }
.tip-yi { color: #10b981; }
.tip-ji { color: #ef4444; }
.tip-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
}
.stat-item { color: var(--textMuted, rgba(255,255,255,0.6)); }
.stat-item strong { color: var(--accent, #f59e0b); }
.stat-item.online strong { color: #10b981; }

/* ========== 限时优惠横幅 ========== */
.promo-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 20px;
  background: linear-gradient(90deg, #ef4444, #dc2626);
  border-radius: 12px;
  margin: 0 20px 16px;
  cursor: pointer;
  position: relative;
  animation: promoPulse 2s ease-in-out infinite;
}
@keyframes promoPulse {
  0%, 100% { box-shadow: 0 4px 15px rgba(239,68,68,0.3); }
  50% { box-shadow: 0 4px 25px rgba(239,68,68,0.5); }
}
.promo-icon { font-size: 20px; }
.promo-text { color: #fff; font-size: 14px; }
.promo-text strong { color: #ffd700; font-size: 16px; }
.promo-countdown {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0,0,0,0.2);
  padding: 4px 12px;
  border-radius: 20px;
}
.countdown-label { font-size: 11px; color: rgba(255,255,255,0.8); }
.countdown-time { font-size: 14px; color: #ffd700; font-weight: 600; font-family: monospace; }
.promo-close {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.6);
  font-size: 16px;
  cursor: pointer;
}
.promo-close:hover { color: #fff; }

/* ========== 分享区域 ========== */
.share-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px 20px;
  margin: 20px auto;
  max-width: 400px;
}
.share-text {
  font-size: 13px;
  color: var(--textMuted, rgba(255,255,255,0.6));
}
.share-btns {
  display: flex;
  gap: 10px;
}
.share-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.share-btn.wechat {
  background: #07c160;
  color: #fff;
}
.share-btn.copy {
  background: var(--bgCard, rgba(255,255,255,0.1));
  color: var(--textPrimary, #fff);
  border: 1px solid var(--border, rgba(255,255,255,0.1));
}
.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

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
/* ========== 优化后的导航栏样式 ========== */
.home-header { 
  display: flex; align-items: center; justify-content: space-between; 
  padding: 0 30px; 
  height: 68px;
  background: var(--bgHeader, rgba(255,255,255,0.08)); 
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  position: sticky; top: 0; z-index: 100; 
}
.header-left .logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.logo-icon { 
  background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c)); 
  color: #fff; 
  padding: 8px 14px; 
  border-radius: 12px; 
  font-weight: bold; 
  font-size: 16px;
  box-shadow: 0 4px 15px var(--shadow, rgba(240,147,251,0.4));
}
.logo-text { 
  font-size: 22px; font-weight: 700; 
  font-family: 'Noto Serif SC', serif;
  background: var(--primaryGradient, linear-gradient(90deg, #f093fb, #f5576c)); 
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
  letter-spacing: 1px;
}
.header-center { display: flex; gap: 8px; height: 100%; align-items: center; }
.header-center .nav-item { 
  cursor: pointer; 
  padding: 8px 16px; 
  border-radius: 8px; 
  transition: all 0.3s; 
  font-size: 15px;
  font-weight: 500;
  color: var(--textSecondary, #e8d5f2);
  position: relative;
}
.header-center .nav-item:hover { 
  background: var(--bgCardHover, rgba(240,147,251,0.15)); 
  color: var(--accent, #f5a5c8);
}
.header-center .nav-item.active { 
  color: var(--accent, #f5a5c8);
  font-weight: 600;
}
.header-center .nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background: var(--primaryGradient, linear-gradient(90deg, #f093fb, #f5576c));
  border-radius: 2px;
}

/* 工具箱下拉菜单 */
.nav-dropdown {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 10px;
  background: var(--bgModal, rgba(30,30,50,0.98));
  backdrop-filter: blur(20px);
  border: 1px solid var(--border, rgba(255,255,255,0.1));
  border-radius: 16px;
  padding: 12px;
  min-width: 320px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  z-index: 200;
}
.dropdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bgCard, rgba(255,255,255,0.05));
}
.dropdown-item:hover {
  background: var(--bgCardHover, rgba(245,158,11,0.15));
  transform: translateY(-2px);
}
.dropdown-icon { font-size: 20px; }
.dropdown-name { font-size: 12px; color: var(--textPrimary, #fff); white-space: nowrap; }

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

/* 移动端工具箱 */
.mobile-tools-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.toggle-arrow { font-size: 10px; opacity: 0.6; }
.mobile-tools-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px;
  background: var(--bgCard, rgba(255,255,255,0.03));
  border-radius: 12px;
  margin: 0 0 10px;
}
.mobile-tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 6px;
  background: var(--bgInput, rgba(255,255,255,0.05));
  border-radius: 10px;
  cursor: pointer;
  font-size: 11px;
  color: var(--textPrimary, #fff);
}
.mobile-tool-item:active {
  background: var(--bgCardHover, rgba(245,158,11,0.15));
}

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
.hero-section { text-align: center; padding: 50px 20px 30px; }
.hero-section h1 { 
  font-size: 40px; 
  margin-bottom: 14px; 
  font-family: 'Noto Serif SC', serif;
  font-weight: 700;
  letter-spacing: 2px;
  background: var(--primaryGradient, linear-gradient(90deg, #f093fb, #f5576c)); 
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
  text-shadow: 0 0 60px var(--shadow, rgba(240,147,251,0.3));
}
.hero-section p { 
  font-size: 16px; 
  color: var(--textSecondary, #e8d5f2); 
  margin-bottom: 0; 
  letter-spacing: 3px; 
  opacity: 0.9;
}
.cta-btn { 
  padding: 16px 45px; 
  background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c)); 
  color: #fff; border: none; border-radius: 30px; 
  font-size: 18px; font-weight: bold; cursor: pointer; 
  box-shadow: 0 8px 30px var(--shadow, rgba(240,147,251,0.4));
  transition: all 0.3s;
}
.cta-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 40px var(--shadowHover, rgba(240,147,251,0.5)); }
.cta-btn.secondary { background: var(--bgCard); border: 2px solid var(--accent); }
.cta-btn.secondary:hover { background: var(--accent); }
.hero-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

/* 核心功能 - 紧凑横排 + 优化样式 */
.features-row { 
  display: flex; 
  justify-content: center; 
  gap: 20px; 
  margin: 28px 0 20px; 
  flex-wrap: wrap; 
  padding: 0 20px;
}
.feature-item { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  padding: 14px 24px; 
  background: var(--bgCard, rgba(255,255,255,0.08)); 
  border: 1px solid var(--border, rgba(255,255,255,0.1)); 
  border-radius: 28px; 
  cursor: pointer; 
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.feature-item:hover { 
  background: var(--bgCardHover, rgba(255,255,255,0.15)); 
  border-color: var(--accent, #f59e0b); 
  transform: translateY(-3px); 
  box-shadow: 0 8px 24px var(--shadow, rgba(240,147,251,0.25));
}
.fi-icon { font-size: 22px; }
.fi-title { font-size: 15px; color: var(--textPrimary, #fff); font-weight: 600; }

/* 用户好评 + 功德箱 */
.social-proof-section { display: flex; gap: 20px; margin: 30px auto; max-width: 900px; padding: 0 20px; align-items: stretch; }
.reviews-scroll { flex: 1; background: var(--bgCard, rgba(255,255,255,0.05)); border-radius: 16px; padding: 16px; overflow: hidden; }
.reviews-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.reviews-title { font-size: 14px; color: var(--textPrimary, #fff); }
.write-review-btn { padding: 4px 12px; background: var(--accent, #f59e0b); border: none; border-radius: 12px; color: #fff; font-size: 12px; cursor: pointer; transition: all 0.2s; }
.write-review-btn:hover { transform: scale(1.05); }
.reviews-container { overflow: hidden; height: 120px; }
.reviews-track { display: flex; flex-direction: column; animation: scrollReviews 30s linear infinite; }
.reviews-track:hover { animation-play-state: paused; }
@keyframes scrollReviews { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
.review-item { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--border, rgba(255,255,255,0.05)); }
.review-avatar { font-size: 20px; }
.review-content { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.review-name { font-size: 12px; color: var(--accent, #f59e0b); }
.review-text { font-size: 13px; color: var(--textPrimary, #fff); line-height: 1.4; }
.review-time { font-size: 11px; color: var(--textMuted, rgba(255,255,255,0.4)); }
.review-mine { font-size: 10px; color: var(--accent, #f59e0b); background: rgba(245,158,11,0.15); padding: 1px 6px; border-radius: 8px; margin-left: 6px; }

.merit-box { display: flex; align-items: center; gap: 12px; padding: 20px; background: linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.1)); border: 1px solid rgba(255,215,0,0.3); border-radius: 16px; cursor: pointer; transition: all 0.3s; min-width: 180px; }
.merit-box:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(255,215,0,0.2); border-color: rgba(255,215,0,0.5); }
.merit-icon { font-size: 36px; }
.merit-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.merit-title { font-size: 16px; color: #ffd700; font-weight: 600; }
.merit-desc { font-size: 12px; color: var(--textMuted, rgba(255,255,255,0.6)); }
.merit-arrow { font-size: 18px; color: #ffd700; }

/* 功德箱弹窗 */
.merit-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.merit-modal-content { background: var(--bgCard, #1a1a2e); border-radius: 20px; width: 100%; max-width: 400px; animation: modalIn 0.3s ease; }
.merit-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,165,0,0.1)); border-radius: 20px 20px 0 0; }
.merit-modal-header h3 { color: #ffd700; margin: 0; font-size: 18px; }
.merit-modal-body { padding: 24px; }
.incense-display { text-align: center; margin-bottom: 20px; }
.incense-burner { font-size: 60px; animation: incenseGlow 2s ease-in-out infinite; }
@keyframes incenseGlow { 0%, 100% { filter: drop-shadow(0 0 10px rgba(255,215,0,0.5)); } 50% { filter: drop-shadow(0 0 20px rgba(255,215,0,0.8)); } }
.incense-tip { font-size: 14px; color: var(--textMuted, rgba(255,255,255,0.6)); margin-top: 8px; }
.merit-options { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
.merit-option { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 16px 12px; background: var(--bgInput, rgba(255,255,255,0.05)); border: 2px solid transparent; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
.merit-option:hover { border-color: rgba(255,215,0,0.3); }
.merit-option.selected { border-color: #ffd700; background: rgba(255,215,0,0.1); }
.opt-icon { font-size: 28px; }
.opt-name { font-size: 13px; color: var(--textPrimary, #fff); }
.opt-price { font-size: 15px; color: #ffd700; font-weight: 600; }
.merit-wish label { display: block; font-size: 13px; color: var(--textSecondary, rgba(255,255,255,0.8)); margin-bottom: 8px; }
.merit-wish textarea { width: 100%; padding: 12px; background: var(--bgInput, rgba(255,255,255,0.08)); border: 1px solid var(--border, rgba(255,255,255,0.1)); border-radius: 10px; color: var(--textPrimary, #fff); font-size: 14px; resize: none; }
.merit-submit { width: 100%; padding: 14px; background: linear-gradient(135deg, #ffd700, #ff8c00); border: none; border-radius: 12px; color: #1a1a2e; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 16px; transition: all 0.3s; }
.merit-submit:hover:not(:disabled) { transform: scale(1.02); box-shadow: 0 4px 20px rgba(255,215,0,0.4); }
.merit-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.merit-note { font-size: 12px; color: var(--textMuted, rgba(255,255,255,0.5)); text-align: center; margin-top: 12px; }

/* 用户评价弹窗 */
.review-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.review-modal-content { background: var(--bgCard, #1a1a2e); border-radius: 20px; width: 100%; max-width: 400px; animation: modalIn 0.3s ease; }
.review-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; background: linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.1)); border-radius: 20px 20px 0 0; }
.review-modal-header h3 { color: var(--accent, #f59e0b); margin: 0; font-size: 18px; }
.review-modal-body { padding: 24px; }
.review-rating { margin-bottom: 20px; }
.review-rating label, .review-service label, .review-text label { display: block; font-size: 14px; color: var(--textSecondary, rgba(255,255,255,0.8)); margin-bottom: 10px; font-weight: 500; }
.rating-stars { display: flex; gap: 8px; }
.rating-stars .star { font-size: 28px; cursor: pointer; filter: grayscale(100%); opacity: 0.4; transition: all 0.2s; }
.rating-stars .star.active { filter: grayscale(0%); opacity: 1; }
.rating-stars .star:hover { transform: scale(1.2); filter: grayscale(0%); opacity: 0.8; }
.review-service { margin-bottom: 20px; }
.review-service select { width: 100%; padding: 10px 14px; background: var(--bgInput, rgba(255,255,255,0.08)); border: 1px solid var(--border, rgba(255,255,255,0.1)); border-radius: 10px; color: var(--textPrimary, #fff); font-size: 14px; }
.review-text { margin-bottom: 16px; position: relative; }
.review-text textarea { width: 100%; padding: 12px; background: var(--bgInput, rgba(255,255,255,0.08)); border: 1px solid var(--border, rgba(255,255,255,0.1)); border-radius: 10px; color: var(--textPrimary, #fff); font-size: 14px; resize: none; }
.char-count { position: absolute; bottom: 8px; right: 12px; font-size: 11px; color: var(--textMuted, rgba(255,255,255,0.4)); }
.review-submit { width: 100%; padding: 14px; background: linear-gradient(135deg, #f59e0b, #d97706); border: none; border-radius: 12px; color: #fff; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.review-submit:hover:not(:disabled) { transform: scale(1.02); box-shadow: 0 4px 20px rgba(245,158,11,0.4); }
.review-submit:disabled { opacity: 0.5; cursor: not-allowed; }

/* 旧的features样式保留兼容 */
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

.divination-tab {
  padding: 0;
}

/* ========== 天机问答侧边栏布局 ========== */
.divination-layout {
  display: flex;
  min-height: 600px;
  background: var(--bgCard, rgba(255,255,255,0.03));
  border-radius: 16px;
  overflow: hidden;
}

.div-sidebar {
  width: 200px;
  background: var(--bgCard, rgba(255,255,255,0.05));
  border-right: 1px solid var(--border, rgba(200,165,217,0.15));
  padding: 16px 0;
  flex-shrink: 0;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  padding: 0 16px 16px;
  background: var(--primaryGradient, linear-gradient(90deg, #f093fb, #f5576c));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  border-bottom: 1px solid var(--border, rgba(200,165,217,0.1));
  margin-bottom: 8px;
}

.sidebar-section {
  margin-bottom: 8px;
}

.section-label {
  font-size: 12px;
  color: var(--textMuted, rgba(200,165,217,0.5));
  padding: 8px 16px 4px;
  text-transform: uppercase;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: var(--textSecondary, #e8d5f2);
  position: relative;
}

.sidebar-item:hover {
  background: var(--bgCardHover, rgba(240,147,251,0.08));
}

.sidebar-item.active {
  background: var(--primaryGradient, linear-gradient(90deg, rgba(240,147,251,0.2), rgba(245,87,108,0.2)));
  color: var(--primary, #f093fb);
  border-left: 3px solid var(--primary, #f093fb);
}

.sidebar-item .item-icon {
  font-size: 16px;
}

.sidebar-item .badge-hot,
.sidebar-item .badge-new,
.sidebar-item .badge-free {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: auto;
}

.sidebar-item .badge-hot {
  background: #ff4757;
  color: #fff;
}

.sidebar-item .badge-new {
  background: #2ed573;
  color: #fff;
}

.sidebar-item .badge-free {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: #fff;
}

.div-mobile-tabs {
  display: none;
  padding: 12px 16px;
  background: var(--bgCard, rgba(255,255,255,0.05));
  border-bottom: 1px solid var(--border, rgba(200,165,217,0.15));
}

.mobile-tabs-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mobile-tabs-scroll::-webkit-scrollbar {
  display: none;
}

.mobile-tab {
  flex-shrink: 0;
  padding: 8px 14px;
  background: var(--bgInput, rgba(255,255,255,0.08));
  border: 1px solid var(--border, rgba(200,165,217,0.2));
  border-radius: 20px;
  color: var(--textSecondary, #e8d5f2);
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-tab:hover {
  background: var(--bgHover, rgba(200,165,217,0.15));
}

.mobile-tab.active {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  border-color: #9b59b6;
  color: #fff;
  font-weight: 500;
}

.div-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.content-header {
  margin-bottom: 20px;
}

.content-header h3 {
  font-size: 20px;
  margin: 0 0 6px;
  color: var(--text, #f8f4ff);
}

.content-header p {
  font-size: 14px;
  color: var(--textSecondary, #e8d5f2);
  margin: 0;
}

/* 今日运势 */
.daily-fortune-card {
  text-align: center;
  padding: 40px 20px;
}

.fortune-draw {
  cursor: pointer;
  transition: transform 0.3s;
}

.fortune-draw:hover {
  transform: scale(1.05);
}

.draw-icon {
  font-size: 80px;
  margin-bottom: 16px;
}

.draw-text {
  color: var(--textSecondary, #e8d5f2);
}

.fortune-result {
  text-align: center;
}

.fortune-level {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 16px;
  padding: 16px 32px;
  border-radius: 12px;
  display: inline-block;
}

.fortune-level.大吉 { background: linear-gradient(135deg, #ff6b6b, #feca57); color: #fff; }
.fortune-level.中吉 { background: linear-gradient(135deg, #ff9ff3, #feca57); color: #fff; }
.fortune-level.小吉 { background: linear-gradient(135deg, #48dbfb, #1dd1a1); color: #fff; }
.fortune-level.吉 { background: linear-gradient(135deg, #54a0ff, #5f27cd); color: #fff; }
.fortune-level.末吉 { background: linear-gradient(135deg, #576574, #222f3e); color: #fff; }
.fortune-level.凶 { background: linear-gradient(135deg, #2d3436, #636e72); color: #fff; }

.fortune-text {
  color: var(--textSecondary, #e8d5f2);
  line-height: 1.8;
  margin-bottom: 20px;
}

.redraw-btn {
  padding: 10px 24px;
  background: var(--bgCard, rgba(255,255,255,0.1));
  border: 1px solid var(--border, rgba(200,165,217,0.2));
  border-radius: 20px;
  color: var(--textSecondary, #e8d5f2);
  cursor: pointer;
  transition: all 0.2s;
}

.redraw-btn:hover {
  background: var(--bgCardHover, rgba(240,147,251,0.15));
}

/* 塔罗牌 */
.tarot-container {
  text-align: center;
}

.tarot-question {
  margin-bottom: 24px;
}

.tarot-question label {
  display: block;
  margin-bottom: 8px;
  color: var(--textSecondary, #e8d5f2);
}

.tarot-question input {
  width: 100%;
  max-width: 300px;
  padding: 12px 16px;
  background: var(--bgInput, rgba(255,255,255,0.08));
  border: 1px solid var(--border, rgba(200,165,217,0.2));
  border-radius: 10px;
  color: var(--text, #f8f4ff);
}

.tarot-spread {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.tarot-card {
  width: 100px;
  height: 150px;
  background: linear-gradient(135deg, #2d3436, #636e72);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  perspective: 1000px;
}

.tarot-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(240,147,251,0.3);
}

.tarot-card .card-back {
  font-size: 48px;
}

.tarot-card.flipped {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.tarot-card .card-front {
  font-size: 14px;
  color: #fff;
  text-align: center;
  line-height: 1.5;
}

.tarot-hint {
  color: var(--textMuted, rgba(200,165,217,0.5));
  margin-bottom: 20px;
}

/* 天使数字 */
.angel-container {
  max-width: 400px;
  margin: 0 auto;
}

.angel-input {
  margin-bottom: 20px;
}

.angel-input label {
  display: block;
  margin-bottom: 8px;
  color: var(--textSecondary, #e8d5f2);
}

.angel-input input {
  width: 100%;
  padding: 16px;
  background: var(--bgInput, rgba(255,255,255,0.08));
  border: 1px solid var(--border, rgba(200,165,217,0.2));
  border-radius: 12px;
  color: var(--text, #f8f4ff);
  font-size: 24px;
  text-align: center;
  letter-spacing: 8px;
}

/* 北欧符文 */
.rune-container {
  text-align: center;
  padding: 20px;
}

.rune-draw {
  cursor: pointer;
  transition: transform 0.3s;
}

.rune-draw:hover {
  transform: scale(1.05);
}

.rune-bag {
  font-size: 80px;
  margin-bottom: 16px;
}

.rune-text {
  color: var(--textSecondary, #e8d5f2);
}

.rune-result {
  text-align: center;
}

.rune-symbol {
  font-size: 80px;
  margin-bottom: 8px;
  color: var(--primary, #f093fb);
}

.rune-name {
  font-size: 18px;
  color: var(--text, #f8f4ff);
  margin-bottom: 16px;
}

/* 灵签容器 */
.lottery-container {
  text-align: center;
  padding: 20px;
}

.lottery-draw {
  cursor: pointer;
  transition: transform 0.3s;
  padding: 40px;
}

.lottery-draw:hover {
  transform: scale(1.05);
}

.lottery-draw .lottery-icon {
  font-size: 80px;
  display: block;
  margin-bottom: 16px;
}

.lottery-draw .lottery-text {
  color: var(--textSecondary, #e8d5f2);
}

.lottery-number {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary, #f093fb);
  margin-bottom: 16px;
}

/* 生命数字 */
.numerology-container {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

.numerology-result {
  margin: 24px 0;
}

.num-display {
  font-size: 72px;
  font-weight: bold;
  background: var(--primaryGradient, linear-gradient(90deg, #f093fb, #f5576c));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.num-name {
  font-size: 16px;
  color: var(--textSecondary, #e8d5f2);
}

/* ========== 工具箱页面样式 ========== */
.tools-tab {
  padding: 20px;
}
.tools-page-header {
  text-align: center;
  margin-bottom: 30px;
}
.tools-page-header h2 {
  font-size: 28px;
  margin: 0 0 10px;
  background: var(--primaryGradient, linear-gradient(90deg, #f093fb, #f5576c));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.tools-page-header p {
  color: var(--textSecondary, #e8d5f2);
  font-size: 15px;
  margin: 0;
}

/* ========== 天机问答标签页样式 ========== */
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
.chat-msg { margin-bottom: 15px; display: flex; gap: 10px; align-items: flex-start; }
.chat-msg.user { justify-content: flex-end; }
.chat-msg.assistant { justify-content: flex-start; }
.msg-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--bgCard, rgba(255,255,255,0.1)); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.msg-avatar.user-avatar { background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c)); }
.msg-content { max-width: 75%; }
.msg-name { font-size: 12px; color: var(--textMuted, rgba(200,165,217,0.6)); margin-bottom: 4px; }
.msg-text { padding: 12px 16px; border-radius: 16px; line-height: 1.7; font-size: 14px; background: var(--bgCard, rgba(255,255,255,0.1)); color: var(--textSecondary, #e8d5f2); border-bottom-left-radius: 4px; }
.chat-msg.user .msg-text { 
  background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c)); 
  color: #fff; 
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 16px;
}
.master-link { color: var(--primary, #f093fb); cursor: pointer; text-decoration: underline; }
.master-link:hover { color: var(--accent, #f5a5c8); }
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

/* AI问答功能亮点 */
.ai-features {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--bgCard, rgba(255,255,255,0.05));
  border-radius: 20px;
  font-size: 13px;
  color: var(--textSecondary, #e8d5f2);
}
.feature-icon { font-size: 16px; }

/* 内容头部描述 */
.header-desc {
  color: var(--text, #f8f4ff);
}
.header-desc strong {
  color: #f093fb;
  font-weight: 600;
}

/* 热门问题 */
.hot-questions {
  margin-bottom: 16px;
  padding: 16px;
  background: var(--bgCard, rgba(255,255,255,0.03));
  border-radius: 12px;
}
.hot-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text, #f8f4ff);
  margin-bottom: 12px;
}
.hot-count {
  font-size: 12px;
  font-weight: 400;
  color: var(--textSecondary, #c8a5d9);
}
.hot-list-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.hot-list-scroll::-webkit-scrollbar { display: none; }
.hot-item {
  flex-shrink: 0;
  padding: 8px 14px;
  background: rgba(139, 90, 43, 0.08);
  border: 1px solid rgba(139, 90, 43, 0.2);
  border-radius: 20px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.hot-item:hover {
  background: rgba(139, 90, 43, 0.15);
  border-color: #8b5a2b;
  color: #8b5a2b;
}

/* 大师引导 */
.master-guide {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(240,147,251,0.1), rgba(245,87,108,0.1));
  border: 1px solid rgba(240,147,251,0.2);
  border-radius: 12px;
}
.guide-icon { font-size: 32px; }
.guide-content { flex: 1; }
.guide-title { font-size: 15px; font-weight: 600; color: var(--text, #f8f4ff); margin-bottom: 4px; }
.guide-desc { font-size: 13px; color: var(--textSecondary, #e8d5f2); }
.guide-btn {
  padding: 10px 20px;
  background: var(--primaryGradient, linear-gradient(135deg, #f093fb, #f5576c));
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}
.guide-btn:hover { transform: scale(1.05); }

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

/* 国学雅韵主题 - 新增UI元素样式 */
.theme-guoxue .header-center .nav-item.active::after {
  background: linear-gradient(90deg, #8b5a2b, #d4a574);
}
.theme-guoxue .feature-item {
  background: rgba(139,90,43,0.06);
  border-color: rgba(139,90,43,0.15);
  box-shadow: 0 2px 8px rgba(139,90,43,0.08);
}
.theme-guoxue .feature-item:hover {
  background: rgba(139,90,43,0.12);
  border-color: #8b5a2b;
  box-shadow: 0 6px 20px rgba(139,90,43,0.15);
}

@media (max-width: 768px) {
  /* 今日提示条移动端 - 精简显示 */
  .daily-tip-bar {
    flex-direction: column;
    gap: 6px;
    padding: 8px 12px;
    font-size: 12px;
  }
  .tip-content {
    font-size: 11px;
    justify-content: center;
    flex-wrap: wrap;
    gap: 4px;
  }
  .tip-divider { display: none; }
  .tip-yi, .tip-ji { 
    background: rgba(255,255,255,0.1);
    padding: 2px 8px;
    border-radius: 10px;
  }
  .tip-stats {
    font-size: 11px;
    gap: 12px;
  }
  
  /* 限时优惠横幅移动端 */
  .promo-banner {
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 30px 10px 16px;
    margin: 0 10px 12px;
  }
  .promo-icon { font-size: 16px; }
  .promo-text { font-size: 12px; }
  .promo-text strong { font-size: 14px; }
  .promo-countdown { padding: 3px 10px; }
  .countdown-label { font-size: 10px; }
  .countdown-time { font-size: 12px; }
  
  /* Hero区域移动端 - 更紧凑 */
  .hero-section { padding: 20px 15px 10px; }
  .hero-section h1 { font-size: 22px; margin-bottom: 6px; }
  .hero-section p { font-size: 12px; }
  
  /* 核心功能 - 移动端2x2布局 */
  .features-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin: 16px 10px;
  }
  .feature-item {
    padding: 12px 10px;
    border-radius: 12px;
    justify-content: center;
  }
  .fi-icon { font-size: 18px; }
  .fi-title { font-size: 13px; }
  
  /* 分享区域移动端 */
  .share-section {
    flex-direction: column;
    gap: 10px;
    padding: 12px 16px;
  }
  .share-btns { gap: 8px; }
  .share-btn { padding: 8px 14px; font-size: 12px; }
  
  .header-center, .header-right { display: none; }
  .mobile-header-right { display: flex; }
  .mobile-menu-btn { display: block; font-size: 24px; cursor: pointer; color: var(--accent, #f5a5c8); }
  .mobile-nav { display: block; }
  
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
  
  /* 用户好评+功德箱移动端 */
  .social-proof-section { flex-direction: column; gap: 12px; padding: 0 10px; margin: 20px auto; }
  .reviews-scroll { padding: 12px; }
  .reviews-header { flex-direction: row; gap: 8px; align-items: center; justify-content: space-between; }
  .write-review-btn { font-size: 11px; padding: 4px 10px; }
  .reviews-container { height: 80px; }
  .review-item { padding: 6px 0; }
  .review-avatar { font-size: 16px; }
  .review-name { font-size: 11px; }
  .review-text { font-size: 12px; }
  .review-time { font-size: 10px; }
  .review-modal-content { max-width: 100%; margin: 10px; }
  
  /* 功德箱移动端 - 更紧凑 */
  .merit-box { padding: 12px; gap: 10px; }
  .merit-icon { font-size: 24px; }
  .merit-title { font-size: 13px; }
  .merit-desc { font-size: 11px; }
  .merit-modal-content { max-width: 100%; margin: 10px; }
  .merit-options { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .merit-option { padding: 12px 8px; }
  .opt-icon { font-size: 24px; }
  
  /* 天机问答移动端优化 - 侧边栏布局 */
  .divination-layout {
    flex-direction: column;
    min-height: auto;
  }
  .div-sidebar {
    display: none;
  }
  .div-mobile-tabs {
    display: block;
  }
  .div-main {
    padding: 16px;
  }
  .content-header h3 { font-size: 18px; }
  .content-header p { font-size: 13px; }
  .select-grid { grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .select-item { padding: 10px 5px; }
  .item-icon { font-size: 20px; }
  .item-name { font-size: 11px; }
  .action-bar { padding: 12px; gap: 10px; }
  .action-btn { padding: 10px 25px; font-size: 14px; }
  .time-tabs span { padding: 6px 14px; font-size: 12px; }
  .lottery-draw { padding: 30px; }
  .lottery-draw .lottery-icon { font-size: 60px; }
  .draw-icon { font-size: 60px; }
  .tarot-spread { gap: 12px; }
  .tarot-card { width: 80px; height: 120px; }
  .tarot-card .card-back { font-size: 36px; }
  .tarot-card .card-front { font-size: 12px; }
  .rune-bag, .rune-symbol { font-size: 60px; }
  .num-display { font-size: 56px; }
  .birthday-btns { gap: 8px; }
  .birthday-btn { padding: 8px 15px; font-size: 13px; }
  .chat-messages { height: 300px; padding: 15px; }
  .chat-input-area { padding: 12px; }
  
  /* 移动端 AI 问答优化 */
  .ai-features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }
  .feature-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 10px;
    font-size: 11px;
    justify-content: center;
    gap: 4px;
  }
  .ai-features .feature-icon { font-size: 14px; }
  .hot-questions {
    padding: 12px;
    margin-bottom: 12px;
  }
  .hot-title { font-size: 13px; margin-bottom: 10px; }
  .hot-count { font-size: 11px; }
  .hot-list-scroll { gap: 6px; }
  .hot-item { padding: 6px 12px; font-size: 12px; }
  .master-guide {
    flex-direction: column;
    text-align: center;
    gap: 10px;
    padding: 12px;
  }
  .guide-icon { font-size: 24px; }
  .guide-title { font-size: 13px; color: #333; }
  .guide-desc { font-size: 11px; color: #666; }
  .guide-btn { width: auto; padding: 8px 24px; font-size: 13px; }
  
  /* 移动端字体颜色增强 */
  .content-header h3 { color: #333; }
  .content-header p, .header-desc { color: #555; }
  .header-desc strong { color: #e74c3c; }
  .msg-name { color: #333; }
  .msg-text { color: #444; }
  
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

/* 全局工具弹窗容器 - 隐藏工具列表只保留弹窗 */
.global-tools-modal :deep(.tools-section) {
  display: none !important;
}
</style>
