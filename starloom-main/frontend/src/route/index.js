import { createRouter, createWebHistory } from "vue-router"
import { setSEO, setStructuredData, setCanonical } from '../utils/seo'

const HomePage = () => import("../components/HomePage.vue")
const Index = () => import("../page/Index.vue")
const Chat = () => import("../page/Chat.vue")
const AskDivination = () => import("../page/AskDivination.vue")
const Learn = () => import("../page/Learn.vue")
const ArticleDetail = () => import("../page/ArticleDetail.vue")

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

// 路由守卫 - 自动设置 SEO
router.beforeEach((to, from, next) => {
  const seoKey = to.meta?.seoKey
  if (seoKey) {
    setSEO(seoKey)
  }
  // 设置 canonical URL
  setCanonical(to.path)
  next()
})

// 页面加载后设置结构化数据
router.afterEach((to) => {
  if (to.name === 'home') {
    // 首页已在 index.html 中设置了完整的结构化数据
  }
})

export default router
