<!-- 登录 -->
<template>
  <div class="headerbox">
    <div class="header" :class="screenWidth>900? '' : 'm'">
      <div class="left" v-if="screenWidth>900" @click="goIndex">
        <img v-if="lang=='en'" src="/@/assets/images/logo_en.png" alt="" class="logo">
        <img v-else src="/@/assets/images/logo_zh.png" alt="" class="logo">
      </div>
      <div class="left" v-if="screenWidth<=900" @click="goIndex">
        <img v-if="lang=='en'" src="/@/assets/images/logo_mb_en.png" alt="" class="logo">
        <img v-else src="/@/assets/images/logo_mb_zh.png" alt="" class="logo">
      </div>
      <div class="right">
        <div class="func-icon">
          <el-popover v-model:visible="languagePopover" placement="bottom" trigger="click" :show-arrow="false" popper-class="language-popover">
            <template #reference>
              <div class="lang">{{ lang=='en'? 'EN' : 'CN' }}</div>
            </template>
            <template #default>
              <div @click="changeLanguage('zh')" class="list" :class="lang == 'zh' ? 'active' : ''">简体中文</div>
              <div @click="changeLanguage('en')" class="list" :class="lang == 'en' ? 'active' : ''">English</div>
            </template>
          </el-popover>
        </div>
        <div class="func-icon" v-if="loginStatus==false" @click="showLoginHandle">
          <div class="login">{{ $t('logInAndRegister') }}</div>
        </div>
        <template v-if="screenWidth>900">
          <div class="userAccount" v-if="loginStatus">
            <img src="/@/assets/images/user.png" alt="">
            <div>{{ cutAddress(account) }}</div>
          </div>
          <div class="func-icon" v-if="loginStatus" @click="logout">
            <div class="signout">{{ $t('logout') }}</div>
          </div>
        </template>
        <div class="mb-header" v-if="screenWidth<=900">
          <!-- <div>
              <el-popover
                v-model:visible="userPopover"
                placement="bottom-end"
                trigger="click"
                :show-arrow="false"
                popper-class="user-popover"
              >
                  <template #reference>
                      <div class="typeTab baseType">基础版</div>
                      <div class="typeTab plusType">Plus版</div>
                  </template>
                  <template #default>
                      <div v-if="loginStatus" class="account"><div class="userPicture"></div> {{ account }}</div>
                      <div class="chooseModel">
                        <div class="baseBox">
                          <div class="part1">
                            <img src="/@/assets/images/headerChoose_grey.svg" alt="" srcset="">
                            基础版
                          </div>
                        </div>
                        <div class="plusBox">
                          <div class="part1">
                            <img src="/@/assets/images/headerChoose_grey.svg" alt="" srcset="">
                            Plus版
                          </div>
                          <div class="timestime">
                            <div class="times">40/20</div>
                            <div class="time">到期：2024.09.23</div>
                          </div>
                          <div class="bottomBtn">续费</div>
                        </div>
                      </div>
                      <div class="signout-mb" v-if="loginStatus" @click="logout">退出</div>
                  </template>
              </el-popover>
            </div> -->

          <div class="mb-menu" @click="drawer = true">
            <img src="/@/assets/images/right-menu.png" alt="">
            <div class="menu">{{ $t('mbNav') }}</div>
          </div>
        </div>

        <!-- <div class="user-info">
              <div class="img"></div>
              <div class="text">
                  wwww.baidu.com
              </div>
          </div> -->
      </div>
    </div>
    <!-- <div class="mb-menu" v-if="screenWidth<=900">
      <div class="menu">
        <img  @click="drawer = true" src="/@/assets/images/right-menu.png" alt="">
      </div>
    </div> -->
    <div class="sloganBox" v-if="screenWidth<=900">
      <div class="content">
        <div class="zhPart">
          <img src="/@/assets/images/slogan_left.svg" alt="">
          <div class="text_zh"> 你不知道你的命运，但也许<span>AI</span>知道</div>
          <img src="/@/assets/images/slogan_right.svg" alt="">
        </div>
        <div class="enPart">You may not know your fate, but maybe Al does</div>
      </div>
    </div>
    <el-drawer v-model="drawer" direction="btt" :before-close="handleClose" :show-close="false" :with-header="false" class="menu-drawer" size="calc(100% - 1.2rem)" :modal="false">
      <!--      -->
      <TypeTab />
    </el-drawer>
  </div>
  <Login :loginShow="loginShow" @closeLogin="closeLogin" @loginSuccess="loginSuccess" ref="Login" />
  <SubscribeType :subscribeDialog="subscribeDialog" :isPlus="accountInfo.user_account" :paytypelist="paylist" @closeSubscribeDialog="closeSubscribeDialog" />
</template>

<script>
import { ref, computed, watch, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import EventBus from "/@/utils/EventBus.js";
import Login from "/@/components/Login.vue";
import { useI18n } from "vue-i18n";
import { loginOut, payCardInfo, payAccount } from "/@/api/api";
export default {
  name: "",
  setup() {
    const router = useRouter();
    const goIndex = () => {
      router.push({ name: "index" });
    };
    const store = useStore();
    const { t } = useI18n();
    const lang = computed(() => store.state.lang);
    console.log("lang,,", lang.value);
    const languagePopover = ref(false);
    const userPopover = ref(false);
    const loginShow = ref(false);
    const account = computed(() => store.state.account);
    const userModel = computed(() => store.state.userModel);
    const accountInfo = ref({});
    const expirationTime = ref("");
    const paylist = ref([]);
    const haveCount = computed(() => store.state.haveCount); // 是否有条数
    // 登录状态
    const loginStatus = computed(() => {
      return store.state.loginStatus;
    });
    //适配
    const screenWidth = computed(() => {
      return store.state.screenWidth;
    });
    const drawer = ref(false);
    const showLoginHandle = () => {
      loginShow.value = true;
    };
    const loginSuccess = (account) => {
      store.commit("setLoginStatus", true);
      store.commit("setAccount", account);
    };
    const logout = () => {
      userPopover.value = false;
      ElMessageBox.confirm(t("logoutUre"), "", {
        confirmButtonText: t("logout"),
        cancelButtonText: t("cancel"),
        cancelButtonClass: "cancel",
        confirmButtonClass: "ok",
      })
        .then(() => {
          loginOut().then((res) => {
            store.commit("setLoginStatus", false);
            store.commit("setAccount", "");
            localStorage.setItem("starloomAI-token", "");
            // store.commit('setUserModel', '3.5')
            accountInfo.value.user_account = null;
          });
        })
        .catch(() => {});
    };
    const loginTipMessageBox = () => {
      ElMessageBox.confirm(t("loginTip"), "", {
        confirmButtonText: t("logInAndRegister"),
        cancelButtonText: t("cancel"),
        cancelButtonClass: "cancel",
        confirmButtonClass: "ok",
      })
        .then(() => {
          showLoginHandle();
        })
        .catch(() => {});
    };
    const handleClose = (done) => {
      done();
    };
    const closeDrawer = () => {
      drawer.value = false;
    };
    const changeMosel = (model) => {
      if (model == "4") {
        if (!loginStatus.value) {
          showLoginHandle();
          return;
        }
        if (
          !accountInfo.value.user_account &&
          !accountInfo.value.allowance_num &&
          !accountInfo.value.user_account?.terminable_time &&
          !accountInfo.value.user_account?.un_terminable_time
        ) {
          goSubscribe();
          return;
        }
      }
      store.commit("setUserModel", model);
      localStorage.setItem("userModel", model);
    };
    const subscribeDialog = ref(false);
    const goSubscribe = () => {
      subscribeDialog.value = true;
    };
    const closeSubscribeDialog = () => {
      subscribeDialog.value = false;
    };
    watch(
      () => userPopover.value,
      async (val, old) => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // 月份从0开始，所以要加1
        const day = today.getDate();
        expirationTime.value = `${year}.${month}.${day}`;
        if (val == true && loginStatus.value) {
          const result = await payAccount({});
          if (result.code == 200) {
            // accountInfo.value.user_account = null
            // userAccountInfo.value.allowance_num=0
            // userAccountInfo.value.user_account.terminable_time = 0
            // userAccountInfo.value.user_account.un_terminable_time = 0
            accountInfo.value = result.data;

            // if(!result.data.user_account){

            // }
          }
        }
      }
    );
    EventBus.$on("closeDrawer", closeDrawer);
    EventBus.$on("showLoginHandle", showLoginHandle);
    EventBus.$on("goSubscribe", goSubscribe);

    onUnmounted(() => {
      EventBus.$off("showLoginHandle", showLoginHandle);
      EventBus.$off("closeDrawer", closeDrawer);
      EventBus.$off("goSubscribe", goSubscribe);
    });
    return {
      goIndex,
      lang,
      languagePopover,
      userPopover,
      loginShow,
      loginStatus,
      showLoginHandle,
      logout,
      loginSuccess,
      account,
      screenWidth,
      drawer,
      handleClose,
      closeDrawer,
      loginTipMessageBox,
      userModel,
      changeMosel,
      subscribeDialog,
      goSubscribe,
      closeSubscribeDialog,
      accountInfo,
      expirationTime,
      paylist,
      haveCount,
    };
  },
  components: {
    Login,
  },
  watch: {
    loginStatus(val, old) {
      if (val) {
        this.getPayCardInfoList();
      }
    },
  },
  methods: {
    changeLanguage(lang) {
      localStorage.setItem("lang", lang);
      this.$store.commit("setLang", lang);
      this.languagePopover = false;
      this.$i18n.locale = lang;
    },
    closeLogin() {
      this.loginShow = false;
    },
    async getPayCardInfoList() {
      const result = await payCardInfo({});
      if (result.code == 200) {
        this.paylist = result.data;
        this.paylist.forEach((item) => {
          if (item.card_type == "1") {
            item.card_name = this.$t("timeOne");
          } else if (item.card_type == "2") {
            item.card_name = this.$t("nTime", { num: 15 });
          } else if (item.card_type == "3") {
            item.card_name = this.$t("monthlyCard");
          } else if (item.card_type == "4") {
            item.card_name = this.$t("quarterlyCard");
          } else if (item.card_type == "5") {
            item.card_name = this.$t("annualCard");
          }
        });
        //  == '3'? '月卡' :  item.card_type == '4'? '季卡' : '年卡'
        // console.log('paylist.slice(2, 5),,',this.paylist.slice(2, 5))
      }
    },
    //设置cookie
    setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    //获取cookie
    getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
      }
      return "";
    },
    cutAddress(account) {
      if (account.indexOf(".com") > -1) {
        return account;
      } else {
        const beforeAdr = account.substring(0, 4);
        const afterAdr = account.substring(account.length - 4, account.length);
        return beforeAdr + "..." + afterAdr;
      }
    },
  },
  mounted() {
    // 控制登录弹框是否弹出
    const num = this.getCookie("popUpLogin");
    const loginToken = localStorage.getItem("starloomAI-token");
    if (num) {
      this.setCookie("popUpLogin", Number(num) + 1, 365);
      const time = (Number(num) + 1) % 5;
      if (time == 1) {
        if (!loginToken) {
          this.loginTipMessageBox();
        }
      }
      // else {
      //   this.$refs.advertiseAlert.show = false
      // }
    } else {
      this.setCookie("popUpLogin", 1, 365);
      if (!loginToken) {
        this.loginTipMessageBox();
      }
    }
    this.getPayCardInfoList();
    setTimeout(() => {
      // const lang = localStorage.getItem('lang')
      // this.$store.commit('setLang',lang)
      this.$i18n.locale = "zh";
    }, 500);
  },
  unmounted() {},
};
</script>

<style scoped lang='scss'>
.header {
  background: linear-gradient(180deg, rgba(18, 18, 42, 0.95) 0%, rgba(5, 5, 16, 0.85) 100%);
  backdrop-filter: blur(20px);
  height: 1.2rem;
  opacity: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 1rem;
  z-index: 11;
  border-bottom: 1px solid rgba(123, 92, 245, 0.15);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3), 0 0 40px rgba(123, 92, 245, 0.05);
  position: relative;
  
  // 底部光线装饰
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(123, 92, 245, 0.4) 20%,
      rgba(245, 213, 71, 0.3) 50%, 
      rgba(123, 92, 245, 0.4) 80%,
      transparent 100%);
  }
  
  .left {
    cursor: pointer;
    .logo {
      width: 6rem;
      margin-right: 0.1rem;
      filter: drop-shadow(0 0 15px rgba(123, 92, 245, 0.4));
      transition: filter 0.3s ease;
      
      &:hover {
        filter: drop-shadow(0 0 20px rgba(123, 92, 245, 0.6)) drop-shadow(0 0 30px rgba(245, 213, 71, 0.3));
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    .func-icon {
      margin-right: 0.4rem;
      font-family: Alimama-DongFangDaKai;
      color: #f8f4ff;
      text-align: center;
      .lang,
      .login {
        border-radius: 10px;
        cursor: pointer;
        background: rgba(123, 92, 245, 0.2);
        border: 1px solid rgba(123, 92, 245, 0.4);
        height: 0.7rem;
        line-height: 0.7rem;
        padding: 0 0.1rem;
        white-space: nowrap;
        transition: all 0.3s ease;
        &:hover {
          background: rgba(123, 92, 245, 0.4);
          box-shadow: 0 0 20px rgba(123, 92, 245, 0.4), 0 0 40px rgba(123, 92, 245, 0.2);
          transform: translateY(-1px);
        }
      }
      .lang {
        width: 0.7rem;
        border-radius: 50%;
      }
      .login {
        border-radius: 0.5rem;
        padding: 0 0.3rem;
        background: linear-gradient(135deg, #7B5CF5 0%, #9D4EDD 100%);
        border: none;
        color: #ffffff;
        box-shadow: 0 4px 15px rgba(123, 92, 245, 0.3);
        &:hover {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 6px 25px rgba(123, 92, 245, 0.5), 0 0 40px rgba(157, 78, 221, 0.3);
        }
      }
      .signout {
        cursor: pointer;
        background: rgba(224, 86, 160, 0.15);
        border: 1px solid rgba(224, 86, 160, 0.3);
        border-radius: 10px;
        height: 0.6rem;
        line-height: 0.6rem;
        padding: 0 0.3rem;
        transition: all 0.3s ease;
        &:hover {
          background: rgba(224, 86, 160, 0.3);
          box-shadow: 0 0 15px rgba(224, 86, 160, 0.3);
        }
      }
    }
    .chooseModelBox {
      cursor: pointer;
    }

    .userAccount {
      display: flex;
      align-items: center;
      padding: 0 0.2rem;
      cursor: default;
      color: #f8f4ff;
      img {
        width: 0.6rem;
        height: 0.6rem;
        margin-right: 0.2rem;
        border-radius: 50%;
        border: 2px solid rgba(123, 92, 245, 0.4);
        box-shadow: 0 0 10px rgba(123, 92, 245, 0.3);
      }
    }
  }
  &.m {
    height: 1.2rem;
    padding-right: 0.2rem;
    .left {
      img {
        width: 100%;
        height: 1.2rem;
        object-fit: contain;
        object-position: left;
      }
    }
    .func-icon {
      margin-right: 0.2rem;
    }
    .typeTab {
      margin-right: 0.2rem;
    }
  }
}

@keyframes glow-gold {
  0%, 100% { box-shadow: 0 0 15px rgba(245, 213, 71, 0.4); }
  50% { box-shadow: 0 0 25px rgba(245, 213, 71, 0.7), 0 0 40px rgba(201, 162, 39, 0.3); }
}

.mb-header {
  display: flex;
  align-items: center;
  .userimg {
    width: 0.8rem;
    margin-right: 0.5rem;
  }
}

.mb-menu {
  width: 2rem;
  height: 0.7rem;
  background: linear-gradient(135deg, #7B5CF5 0%, #9D4EDD 100%);
  border-radius: 0.8rem;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 20px rgba(123, 92, 245, 0.4), 0 0 30px rgba(157, 78, 221, 0.2);
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.05) translateY(-2px);
    box-shadow: 0 6px 30px rgba(123, 92, 245, 0.5), 0 0 40px rgba(157, 78, 221, 0.3);
  }
  img {
    width: 0.8rem;
    margin-right: 0.2rem;
  }
  .menu {
    font-family: Alimama-DongFangDaKai;
    color: #ffffff;
  }
}

:deep(.el-drawer) {
  background: linear-gradient(180deg, #12122a 0%, #050510 100%) !important;
}

.sloganBox {
  padding: 0.2rem 0 0;
  text-align: center;
  position: relative;
  
  &::before {
    content: '✧';
    position: absolute;
    left: 20%;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(245, 213, 71, 0.3);
    font-size: 12px;
    animation: twinkle 2s infinite;
  }
  
  &::after {
    content: '✧';
    position: absolute;
    right: 20%;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(245, 213, 71, 0.3);
    font-size: 12px;
    animation: twinkle 2s infinite 0.5s;
  }
  
  .content {
    .zhPart {
      display: flex;
      justify-content: center;
      font-size: 0.45rem;
      align-items: center;
      color: #f8f4ff;
      .text_zh {
        font-family: Alimama-DongFangDaKai;
        text-shadow: 0 0 30px rgba(123, 92, 245, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3);
        span {
          background: linear-gradient(135deg, #F5D547 0%, #C9A227 50%, #F5D547 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: bold;
          animation: shimmer 3s linear infinite;
        }
      }
    }
    .enPart {
      color: rgba(157, 78, 221, 0.6);
      font-size: 0.24rem;
      text-shadow: 0 0 10px rgba(157, 78, 221, 0.3);
    }
  }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
</style>