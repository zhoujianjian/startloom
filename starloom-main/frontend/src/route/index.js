import { createRouter, createWebHistory } from "vue-router"
import { setSEO, setStructuredData, setCanonical, setHreflang } from '../utils/seo'
import { westernRoutes } from './western-routes'
import i18n from '../locales'
import store from '../store'

const HomePage = () => import("../components/HomePage.vue")
const Index = () => import("../page/Index.vue")
const Chat = () => import("../page/Chat.vue")
const AskDivination = () => import("../page/AskDivination.vue")
const Learn = () => import("../page/Learn.vue")
const ArticleDetail = () => import("../page/ArticleDetail.vue")
const AdminStats = () => import("../page/AdminStats.vue")
const Tools = () => import("../page/Tools.vue")

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: {
      seoKey: 'home',
      title: '天机命理_免费八字排盘_周公解梦_姓名测试_生肖星座配对'
    }
  },
  {
    path: "/tools",
    name: "tools",
    component: HomePage,
    meta: {
      seoKey: 'tools',
      title: '免费命理工具箱_生肖配对_星座配对_姓名测试_周公解梦_天机命理',
      defaultTab: 'tools'
    }
  },
  {
    path: "/bazi",
    name: "bazi",
    component: Index,
    meta: {
      seoKey: 'paipan',
      title: '八字排盘_免费生辰八字排盘_四柱八字在线排盘_天机命理'
    }
  },
  {
    path: "/paipan",
    name: "paipan",
    component: HomePage,
    meta: {
      seoKey: 'paipan',
      title: '八字排盘_免费生辰八字排盘_四柱八字在线排盘_天机命理',
      defaultTab: 'paipan'
    }
  },
  {
    path: "/hepan",
    name: "hepan",
    component: HomePage,
    meta: {
      seoKey: 'hepan',
      title: '八字合婚_免费婚姻配对_男女八字合盘_天机命理',
      defaultTab: 'hepan'
    }
  },
  {
    path: "/calendar",
    name: "calendar",
    component: HomePage,
    meta: {
      seoKey: 'calendar',
      title: '万年历_老黄历查询_农历阳历转换_今日宜忌_天机命理',
      defaultTab: 'calendar'
    }
  },
  {
    path: "/divination",
    name: "divination",
    component: HomePage,
    meta: {
      seoKey: 'divination',
      title: '天机问答_在线问卦_星座运势_生肖运势_抽签算命_天机命理',
      defaultTab: 'divination'
    }
  },
  // 工具独立页面 - SEO友好
  {
    path: "/tool/name-test",
    name: "nameTest",
    component: HomePage,
    meta: { seoKey: 'nameTest', defaultTool: 'name-test' }
  },
  {
    path: "/tool/baby-name",
    name: "babyName",
    component: HomePage,
    meta: { seoKey: 'babyName', defaultTool: 'baby-name' }
  },
  {
    path: "/tool/company-name",
    name: "companyName",
    component: HomePage,
    meta: { seoKey: 'companyName', defaultTool: 'company-name' }
  },
  {
    path: "/tool/dream",
    name: "dream",
    component: HomePage,
    meta: { seoKey: 'dream', defaultTool: 'dream' }
  },
  {
    path: "/tool/zodiac-match",
    name: "zodiacMatch",
    component: HomePage,
    meta: { seoKey: 'zodiacMatch', defaultTool: 'zodiac-match' }
  },
  {
    path: "/tool/constellation-match",
    name: "constellationMatch",
    component: HomePage,
    meta: { seoKey: 'constellationMatch', defaultTool: 'constellation-match' }
  },
  {
    path: "/tool/daily-sign",
    name: "dailySign",
    component: HomePage,
    meta: { seoKey: 'dailySign', defaultTool: 'daily-sign' }
  },
  {
    path: "/tool/fate-test",
    name: "fateTest",
    component: HomePage,
    meta: { seoKey: 'fateTest', defaultTool: 'fate-test' }
  },
  {
    path: "/tool/phone-test",
    name: "phoneTest",
    component: HomePage,
    meta: { seoKey: 'phoneTest', defaultTool: 'phone-test' }
  },
  {
    path: "/tool/plate-test",
    name: "plateTest",
    component: HomePage,
    meta: { seoKey: 'plateTest', defaultTool: 'plate-test' }
  },
  {
    path: "/tool/past-life",
    name: "pastLife",
    component: HomePage,
    meta: { seoKey: 'pastLife', defaultTool: 'past-life' }
  },
  {
    path: "/tool/lucky-day",
    name: "luckyDay",
    component: HomePage,
    meta: { seoKey: 'luckyDay', defaultTool: 'lucky-day' }
  },
  // 新增工具路由
  {
    path: "/tool/taisui",
    name: "taisui",
    component: HomePage,
    meta: { seoKey: 'taisui', defaultTool: 'taisui' }
  },
  {
    path: "/tool/peach-blossom",
    name: "peachBlossom",
    component: HomePage,
    meta: { seoKey: 'peachBlossom', defaultTool: 'peach-blossom' }
  },
  {
    path: "/tool/wealth-test",
    name: "wealthTest",
    component: HomePage,
    meta: { seoKey: 'wealthTest', defaultTool: 'wealth-test' }
  },
  {
    path: "/tool/mbti-test",
    name: "mbtiTest",
    component: HomePage,
    meta: { seoKey: 'mbtiTest', defaultTool: 'mbti-test' }
  },
  {
    path: "/tool/lucky-number",
    name: "luckyNumber",
    component: HomePage,
    meta: { seoKey: 'luckyNumber', defaultTool: 'lucky-number' }
  },
  {
    path: "/tool/birthday-flower",
    name: "birthdayFlower",
    component: HomePage,
    meta: { seoKey: 'birthdayFlower', defaultTool: 'birthday-flower' }
  },
  {
    path: "/tool/fengshui-test",
    name: "fengshuiTest",
    component: HomePage,
    meta: { seoKey: 'fengshuiTest', defaultTool: 'fengshui-test' }
  },
  {
    path: "/tool/name-match",
    name: "nameMatch",
    component: HomePage,
    meta: { seoKey: 'nameMatch', defaultTool: 'name-match' }
  },
  {
    path: "/tool/wuxing",
    name: "wuxing",
    component: HomePage,
    meta: { seoKey: 'wuxing', defaultTool: 'wuxing' }
  },
  {
    path: "/tool/tarot",
    name: "tarot",
    component: HomePage,
    meta: { seoKey: 'tarot', defaultTool: 'tarot' }
  },
  {
    path: "/tool/guanyin",
    name: "guanyin",
    component: HomePage,
    meta: { seoKey: 'guanyin', defaultTool: 'guanyin' }
  },
  {
    path: "/naming",
    name: "naming",
    component: HomePage,
    meta: {
      seoKey: 'babyName',
      title: '宝宝起名_公司取名_姓名测试打分_天机命理',
      defaultTool: 'baby-name'
    }
  },
  {
    path: "/ai",
    name: "index",
    component: Index,
    meta: { seoKey: 'paipan' }
  },
  {
    path: "/askDivination/:id",
    name: "askDivination",
    component: AskDivination,
    meta: { seoKey: 'divination' }
  },
  {
    path: "/chat/:shareKey",
    name: "chat",
    component: Chat
  },
  {
    path: "/learn",
    name: "learn",
    component: Learn,
    meta: {
      seoKey: 'learn',
      title: '命理知识_八字入门教程_风水学习_天机命理学堂'
    }
  },
  {
    path: "/master",
    name: "master",
    component: HomePage,
    meta: {
      seoKey: 'master',
      title: '大师咨询_命理师在线_一对一解答_天机命理'
    }
  },
  {
    path: "/article/:id",
    name: "articleDetail",
    component: ArticleDetail,
    meta: { seoKey: 'article' }
  },
  // SEO 友好的文章路径
  {
    path: "/article/:category/:id",
    name: "articleByCat",
    component: ArticleDetail,
    meta: { seoKey: 'article' }
  },
  // 隐藏的管理员统计页面
  {
    path: "/admin-stats",
    name: "adminStats",
    component: AdminStats,
    meta: { title: '数据统计' }
  },
  // 管理后台路由
  {
    path: "/sysAdm",
    component: () => import("../page/admin/Layout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: "/sysAdm/dashboard"
      },
      {
        path: "dashboard",
        name: "adminDashboard",
        component: () => import("../page/admin/Dashboard.vue"),
        meta: { requiresAuth: true, title: '仪表板' }
      },
      {
        path: "users",
        name: "adminUsers",
        component: () => import("../page/admin/Users.vue"),
        meta: { requiresAuth: true, title: '用户管理' }
      },
      {
        path: "articles",
        name: "adminArticles",
        component: () => import("../page/admin/Articles.vue"),
        meta: { requiresAuth: true, title: '文章管理' }
      },
      {
        path: "orders",
        name: "adminOrders",
        component: () => import("../page/admin/Orders.vue"),
        meta: { requiresAuth: true, title: '订单管理' }
      },
      {
        path: "feedback",
        name: "adminFeedback",
        component: () => import("../page/admin/Feedback.vue"),
        meta: { requiresAuth: true, title: '反馈管理' }
      },
      {
        path: "analytics",
        name: "adminAnalytics",
        component: () => import("../page/admin/Analytics.vue"),
        meta: { requiresAuth: true, title: '数据分析' }
      },
      {
        path: "settings",
        name: "adminSettings",
        component: () => import("../page/admin/Settings.vue"),
        meta: { requiresAuth: true, title: '系统设置' }
      },
      {
        path: "sys-config",
        name: "adminSysConfig",
        component: () => import("../page/admin/SysConfig.vue"),
        meta: { requiresAuth: true, title: '系统配置' }
      },
      {
        path: "products",
        name: "adminProducts",
        component: () => import("../page/admin/Products.vue"),
        meta: { requiresAuth: true, title: '产品管理' }
      }
    ]
  },
  {
    path: "/sysAdm/login",
    name: "adminLogin",
    component: () => import("../page/admin/Login.vue"),
    meta: { title: '管理员登录' }
  },
  // 西方版本路由
  ...westernRoutes,
  // 根路由重定向
  {
    path: "/cn",
    redirect: "/"
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

// 路由守卫 - 自动设置 SEO 和语言
router.beforeEach((to, from, next) => {
  console.log('🚀 路由守卫触发:', {
    from: from.path,
    to: to.path,
    requiresAuth: to.meta?.requiresAuth,
    timestamp: new Date().toISOString()
  });

  if (to.path.startsWith('/sysAdm')) {
    if (typeof window !== 'undefined') {
      document.documentElement.style.fontSize = '16px'
    }
  }
  
  // 检查管理员页面权限
  if (to.meta.requiresAuth) {
    const raw = localStorage.getItem('starloomAI-token') || '';
    let token = '';
    if (raw.trim().startsWith('{')) {
      try {
        token = JSON.parse(raw).adminToken || '';
      } catch (e) {
        token = '';
      }
    }
    console.log('🔑 管理员权限检查:', {
      path: to.path,
      hasToken: !!token,
      token: token ? token.substring(0, 20) + '...' : 'null',
      localStorageKeys: Object.keys(localStorage),
      storeAdminUser: store.state.adminUser,
      storeAdminToken: store.state.adminToken
    });
    
    if (!token) {
      console.log('❌ 无token，跳转到登录页');
      next('/sysAdm/login');
      return;
    } else {
      console.log('✅ 有token，允许访问:', to.path);
    }
  }

  const seoKey = to.meta?.seoKey;
  if (seoKey) {
    console.log('🔍 设置SEO:', seoKey);
    setSEO(seoKey);
  }
  
  // 设置 canonical URL
  setCanonical(to.path);

  // 多语言 hreflang：英文固定 /en，中文为根路径（best-effort 映射）
  if (to.path.startsWith('/en')) {
    const enUrl = `https://ibazi.site${to.path}`

    const zhMap = {
      '/en': '/',
      '/en/tools': '/tools',
      '/en/tarot': '/tool/tarot',
      '/en/compatibility': '/tool/constellation-match',
      '/en/horoscope': '/tool/daily-sign',
    }

    const exact = zhMap[to.path]
    const fallback = to.path.startsWith('/en/compatibility/') ? '/tool/constellation-match' : null
    const zhPath = exact || fallback
    const zhUrl = zhPath ? `https://ibazi.site${zhPath}` : undefined

    setHreflang({ en: enUrl, zh: zhUrl, xDefault: enUrl })
  } else {
    const zhUrl = `https://ibazi.site${to.path}`
    const enReverseMap = {
      '/': '/en',
      '/tools': '/en/tools',
      '/tool/tarot': '/en/tarot',
      '/tool/constellation-match': '/en/compatibility',
      '/tool/daily-sign': '/en/horoscope',
    }

    const enPath = enReverseMap[to.path]
    if (enPath) {
      const enUrl = `https://ibazi.site${enPath}`
      setHreflang({ en: enUrl, zh: zhUrl, xDefault: zhUrl })
    }
  }
  
  // 根据路由前缀设置语言和字体大小
  if (to.path.startsWith('/en')) {
    console.log('🌍 设置为西方版本');
    // 西方版本
    i18n.global.locale.value = 'en';
    if (typeof window !== 'undefined') {
      import('vue').then(({ nextTick }) => {
        nextTick(() => {
          document.documentElement.style.fontSize = '16px';
          document.documentElement.lang = 'en'
          console.log('📝 西方版本字体大小已设置为16px');
        });
      });
    }
  } else {
    console.log('🌏 设置为东方版本');
    // 东方版本
    i18n.global.locale.value = 'zh';
    if (typeof window !== 'undefined') {
      import('vue').then(({ nextTick }) => {
        nextTick(() => {
          if (to.path.startsWith('/sysAdm')) {
            document.documentElement.style.fontSize = '16px'
            return
          }
          const clientWidth = document.documentElement.clientWidth;
          if (clientWidth !== undefined) {
            const fontSize = (clientWidth / 10) + 'px';
            document.documentElement.style.fontSize = fontSize;
            console.log('📝 东方版本字体大小已设置为:', fontSize);
          }
        });
      });
    }
  }
  
  console.log('✅ 路由守卫检查完成，允许导航到:', to.path);
  next();
});

// 页面加载后设置结构化数据
router.afterEach((to) => {
  if (to.name === 'home') {
    // 首页已在 index.html 中设置了完整的结构化数据
  }
})

export default router
