import { createRouter, createWebHashHistory } from "vue-router"

const HomePage = () => import("../components/HomePage.vue")
const Index = () => import("../page/Index.vue")
const Crypto = () => import("../page/Crypto.vue")
const Chat = () => import("../page/Chat.vue")
const AskDivination = () => import("../page/AskDivination.vue")
const Success = () => import("../components/ChatComponent/Success.vue")
const Cancel = () => import("../components/ChatComponent/Cancel.vue")
const Learn = () => import("../page/Learn.vue")
const ArticleDetail = () => import("../page/ArticleDetail.vue")

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage
  },
  {
    path: "/ai",
    name: "index",
    component: Index
  },
  // {
  //   path: "/crypto",
  //   name: "crypto",
  //   component: Crypto
  // },
  {
    path: "/askDivination/:id",
    name: "askDivination",
    component: AskDivination
  },
  {
    path: "/chat/:shareKey",
    name: "chat",
    component: Chat
  },
  {
    path: "/learn",
    name: "learn",
    component: Learn
  },
  {
    path: "/article/:id",
    name: "articleDetail",
    component: ArticleDetail
  },
  // {
  //   path: "/success",
  //   name: "success",
  //   component: Success
  // },
  // {
  //   path: "/cancel",
  //   name: "cancel",
  //   component: Cancel
  // },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
  })
  export default router