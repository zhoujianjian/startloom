<template>
  <!-- 新首页独立布局 -->
  <div v-if="pathName === 'home' || pathName === 'learn' || pathName === 'articleDetail'" class="home-layout">
    <router-view></router-view>
    <!-- 底部悬浮大师服务横幅 - 非首页显示（首页已有） -->
    <MasterFloatBar v-if="pathName !== 'home'" />
  </div>
  
  <!-- 原有AI聊天布局 -->
  <div v-else class="main-app">
    <!-- 深邃星空背景 -->
    <div class="cosmic-bg">
      <!-- 星云层 -->
      <div class="nebula-layer"></div>
      <!-- 星星层 -->
      <div class="stars-bg">
        <div v-for="n in 80" :key="'star-'+n" class="star" :style="getStarStyle(n)"></div>
      </div>
      <!-- 流星 -->
      <div v-for="n in 3" :key="'meteor-'+n" class="shooting-star" :style="getMeteorStyle(n)"></div>
      <!-- 神秘光晕 -->
      <div class="mystic-glow"></div>
    </div>
    <Header/>
    <div class="container" :class="screenWidth<=900?'mb-cont':''">
      <div class="left" v-if="screenWidth>900 && pathName != 'chat'">
        <TypeTab />
      </div>
      <div class="main-router">
        <img class="chatBg" src="/@/assets/images/chatBg.png" alt="">
        <div class="right">
          <!-- 品牌展示区域 - AI首页显示 -->
          <div class="brand-area" v-if="pathName === 'index' && !showBrandCollapsed">
            <BrandShowcase />
            <div class="collapse-btn" @click="showBrandCollapsed = true">
              <span>收起</span>
              <span class="arrow">▲</span>
            </div>
          </div>
          <div class="expand-btn" v-if="pathName === 'index' && showBrandCollapsed" @click="showBrandCollapsed = false">
            <span class="icon">✧</span>
            <span>了解天机AI的优势</span>
            <span class="icon">✧</span>
          </div>
          <div class="router-content">
            <router-view></router-view>
          </div>
          <InputContent v-if="pathName != 'chat'"/>
        </div> 
      </div>
    </div>
    <selectModelDialog 
      :showModelDialog ="showModelDialog"
    />
    <!-- 底部悬浮大师服务横幅 -->
    <MasterFloatBar />
  </div>
</template>
<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore} from 'vuex'
import { useRouter,useRoute } from 'vue-router'
import Header from '/@/components/Header.vue'
import selectModelDialog from '/@/components/ChatComponent/selectModelDialog.vue'
import TypeTab from '/@/components/TypeTab.vue'
import InputContent from '/@/components/Input.vue'
import BrandShowcase from '/@/components/BrandShowcase.vue'
import MasterFloatBar from '/@/components/MasterFloatBar.vue'
import { checkLogin } from '/@/api/api.js'
import EventBus from '/@/utils/EventBus.js'
export default {
  name: 'App',
  setup() {
    const store = useStore()
    const route = useRoute()
    const showModelDialog = ref(false)
    const showBrandCollapsed = ref(true) // 默认收起品牌展示
    // 登录状态
    const loginStatus = computed( () => {
      return store.state.loginStatus
    }) 
    //适配
    const screenWidth = computed( () => {
      return store.state.screenWidth
    })
    // const pathName = route.name
    const pathName = computed( () => {
      return route.name
    })
    const checkLoginHandle = async() => {
      const res = await checkLogin({
        timestamp:new Date().getTime()
      })
      if(res.code == 200){
        store.commit('setLoginStatus',true)
        store.commit('setAccount',res.data.account)
        localStorage.setItem('userId',res.data.user_id)
      }else{
        store.commit('setLoginStatus',false)
      }
    }
    watch(() => loginStatus.value, (newValue, oldValue) => {
      // if (!newValue) {
      //     store.commit("setUserModel", "3.5");
      // }
    })
    onMounted(() => {
      checkLoginHandle()
      window.onresize = () => {
        return (() => {
          store.commit('setScreenWidth', document.body.clientWidth)
        })()
      }
    })
    return {
      loginStatus,
      screenWidth,
      pathName,
      showModelDialog,
      showBrandCollapsed,
    }
  },
  methods: {
    getStarStyle(n) {
      const rand = Math.random();
      const size = rand > 0.92 ? 4 : rand > 0.75 ? 3 : rand > 0.5 ? 2 : 1;
      const isGolden = rand > 0.92;
      const isPurple = rand > 0.85 && rand <= 0.92;
      
      let background = '#f8f4ff';
      let boxShadow = 'none';
      
      if (isGolden) {
        background = '#F5D547';
        boxShadow = '0 0 8px rgba(245, 213, 71, 0.8), 0 0 15px rgba(201, 162, 39, 0.4)';
      } else if (isPurple) {
        background = '#7B5CF5';
        boxShadow = '0 0 6px rgba(123, 92, 245, 0.7)';
      } else if (size >= 3) {
        boxShadow = '0 0 6px rgba(248, 244, 255, 0.8), 0 0 12px rgba(123, 92, 245, 0.3)';
      } else if (size === 2) {
        boxShadow = '0 0 3px rgba(248, 244, 255, 0.6)';
      }
      
      return {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 4}s`,
        background: background,
        boxShadow: boxShadow
      }
    },
    getMeteorStyle(n) {
      return {
        left: `${20 + Math.random() * 60}%`,
        top: `${Math.random() * 30}%`,
        animationDelay: `${n * 5 + Math.random() * 10}s`,
        animationDuration: `${2 + Math.random() * 2}s`
      }
    },
    showModelDialogHandle(){
      this.showModelDialog = true
    },
    //获取cookie
    getCookie(cname) {
      var name = cname + '='
      var ca = document.cookie.split(';')
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') c = c.substring(1)
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length)
      }
      return ''
    },
  },
  components:{
    Header,
    TypeTab,
    InputContent,
    selectModelDialog,
    BrandShowcase,
    MasterFloatBar,
  },
  watch: {
    $route: {
      handler(to, from) {
        if (to.name === '') {
          this.$store.commit('setChatType', 'navs')
        } else if (to.name === 'askDivination') {
          this.$store.commit('setChatType', 'Chats')
        }
      },
      deep: true,
    },
  },
 async created(){
  
  },
  mounted() {
    EventBus.$on('showModelDialogHandle', this.showModelDialogHandle)
    const firstLogin = this.getCookie('firstLogin')
    this.$store.commit('setFirstLogin', firstLogin)
  },
  unmounted() {
    EventBus.$off('showModelDialogHandle', this.showModelDialogHandle)
  },
}
</script>

<style scoped lang="scss">
// 新首页独立布局
.home-layout {
  width: 100%;
  min-height: 100vh;
}

// 神秘动画
@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes twinkle-slow {
  0%, 100% { opacity: 0.1; }
  25% { opacity: 0.6; }
  50% { opacity: 0.3; }
  75% { opacity: 0.8; }
}

@keyframes nebula-drift {
  0%, 100% { 
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  33% { 
    transform: translate(30px, -20px) scale(1.1);
    opacity: 0.5;
  }
  66% { 
    transform: translate(-20px, 30px) scale(0.9);
    opacity: 0.4;
  }
}

@keyframes shooting {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translateX(-500px) translateY(300px);
    opacity: 0;
  }
}

@keyframes pulse-glow {
  0%, 100% { 
    opacity: 0.3;
    transform: scale(1);
  }
  50% { 
    opacity: 0.5;
    transform: scale(1.1);
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

// 宇宙背景容器
.cosmic-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  background: radial-gradient(ellipse at center, #12122a 0%, #050510 70%, #020208 100%);
}

// 星云层
.nebula-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(ellipse at 20% 30%, rgba(123, 92, 245, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 70%, rgba(157, 78, 221, 0.1) 0%, transparent 40%),
      radial-gradient(ellipse at 60% 20%, rgba(78, 205, 196, 0.08) 0%, transparent 35%);
    animation: nebula-drift 60s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(ellipse at 70% 80%, rgba(224, 86, 160, 0.08) 0%, transparent 45%),
      radial-gradient(ellipse at 30% 60%, rgba(91, 141, 239, 0.06) 0%, transparent 40%);
    animation: nebula-drift 45s ease-in-out infinite reverse;
  }
}

// 星星背景
.stars-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  border-radius: 50%;
  animation: twinkle 3s infinite ease-in-out;
}

// 流星
.shooting-star {
  position: absolute;
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, rgba(248, 244, 255, 0.9), rgba(123, 92, 245, 0.5), transparent);
  border-radius: 50%;
  animation: shooting 4s linear infinite;
  opacity: 0;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: -1px;
    width: 8px;
    height: 4px;
    background: #f8f4ff;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(248, 244, 255, 0.8), 0 0 20px rgba(123, 92, 245, 0.5);
  }
}

// 神秘光晕
.mystic-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 800px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(123, 92, 245, 0.05) 0%, transparent 70%);
  animation: pulse-glow 8s ease-in-out infinite;
}

.main-app{
 width: 100%;
 height: 100%;
 display: flex;
 flex-direction: column;
 font-size: 14px;
 background: transparent;
 position: relative;
}

.container{
  height: calc(100% - 1.48rem);
  display: flex;
  padding: .4rem 0 .4rem 0rem;
  background: url(/@/assets/images/maxBg.svg) no-repeat;
  background-size: cover;
  padding-top: .1rem;
  position: relative;
  z-index: 1;
  
  &.mb-cont{
    padding: 0;
    height: 100%;
  }
  .left{
    width: 300px;
    padding-top: .3rem;
    padding-left: 0.4rem;
  }
  .main-router{
    flex: 1;
    padding-top: .1rem;
    position: relative;
    .chatBg{
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }
    .right{
      overflow: hidden;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0px;
      z-index: 1;
    }
    .brand-area {
      max-height: 60vh;
      overflow-y: auto;
      position: relative;
      border-bottom: 1px solid rgba(123, 92, 245, 0.2);
      
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-track {
        background: rgba(123, 92, 245, 0.1);
      }
      &::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #7B5CF5 0%, #9D4EDD 100%);
        border-radius: 4px;
      }
      
      .collapse-btn {
        position: sticky;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0.2rem;
        text-align: center;
        background: linear-gradient(180deg, transparent 0%, rgba(5, 5, 16, 0.95) 30%);
        color: rgba(248, 244, 255, 0.7);
        cursor: pointer;
        font-size: 0.28rem;
        transition: all 0.3s ease;
        
        &:hover {
          color: #F5D547;
        }
        
        .arrow {
          margin-left: 0.1rem;
          display: inline-block;
          animation: bounce 1s infinite;
        }
      }
    }
    
    .expand-btn {
      padding: 0.25rem 0.4rem;
      text-align: center;
      background: linear-gradient(135deg, rgba(123, 92, 245, 0.15) 0%, rgba(157, 78, 221, 0.1) 100%);
      border-bottom: 1px solid rgba(123, 92, 245, 0.2);
      color: rgba(248, 244, 255, 0.8);
      cursor: pointer;
      font-size: 0.3rem;
      font-family: Alimama-DongFangDaKai;
      transition: all 0.3s ease;
      
      &:hover {
        background: linear-gradient(135deg, rgba(123, 92, 245, 0.25) 0%, rgba(157, 78, 221, 0.2) 100%);
        color: #F5D547;
      }
      
      .icon {
        margin: 0 0.15rem;
        color: #F5D547;
        animation: twinkle 2s infinite;
      }
    }
    
    .router-content{
      flex: 1;
      overflow: hidden;
      position: relative;
      height: 100%;
    }
  }
}

</style>
