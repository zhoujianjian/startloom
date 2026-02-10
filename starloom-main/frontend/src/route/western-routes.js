// Western Version Routes (/en prefix)
// 西方版本路由配置

const WesternHome = () => import("../page/Western/WesternHome.vue")
const TarotReading = () => import("../page/Western/TarotReading.vue")
const AstrologyHub = () => import("../page/Western/AstrologyHub.vue")
const DailyHoroscope = () => import("../page/Western/DailyHoroscope.vue")
const Numerology = () => import("../page/Western/Numerology.vue")
const WesternTools = () => import("../page/Western/WesternTools.vue")
const Index = () => import("../page/Index.vue")
const Chat = () => import("../page/Chat.vue")

export const westernRoutes = [
  {
    path: "/en",
    name: "western-home",
    component: WesternHome,
    meta: {
      seoKey: 'western-home',
      title: 'Tarot Reading, Astrology & Numerology | StarLoom',
      description: 'Discover your cosmic destiny through AI-powered tarot readings, astrology charts, and numerology. Get personalized spiritual guidance.',
      locale: 'en'
    }
  },
  {
    path: "/en/tarot",
    name: "western-tarot",
    component: TarotReading,
    meta: {
      seoKey: 'western-tarot',
      title: 'Free Tarot Reading | AI-Powered Card Interpretations | StarLoom',
      description: 'Get instant tarot readings with AI interpretation. Choose from multiple spreads: 3-card, Celtic Cross, and more.',
      locale: 'en'
    }
  },
  {
    path: "/en/astrology",
    name: "western-astrology",
    component: AstrologyHub,
    meta: {
      seoKey: 'western-astrology',
      title: 'Birth Chart & Horoscope | Astrology Readings | StarLoom',
      description: 'Generate your birth chart, read daily horoscopes, and explore planetary transits. Complete astrology guidance.',
      locale: 'en'
    }
  },
  {
    path: "/en/horoscope",
    name: "western-horoscope",
    component: DailyHoroscope,
    meta: {
      seoKey: 'western-horoscope',
      title: 'Daily Horoscope | All 12 Zodiac Signs | StarLoom',
      description: 'Read your daily horoscope for all zodiac signs. Get personalized guidance for love, career, and wellness.',
      locale: 'en'
    }
  },
  {
    path: "/en/numerology",
    name: "western-numerology",
    component: Numerology,
    meta: {
      seoKey: 'western-numerology',
      title: 'Numerology Calculator | Life Path & Destiny Numbers | StarLoom',
      description: 'Calculate your life path number, destiny number, and personal year. Unlock the power of numerology.',
      locale: 'en'
    }
  },
  {
    path: "/en/tools",
    name: "western-tools",
    component: WesternTools,
    meta: {
      seoKey: 'western-tools',
      title: 'Spiritual Tools | Chakra Quiz, Crystal Guide & More | StarLoom',
      description: 'Explore our collection of spiritual tools: chakra balancing, crystal selector, affirmation generator, and more.',
      locale: 'en'
    }
  },
  {
    path: "/en/ai",
    name: "western-ai",
    component: Index,
    meta: {
      seoKey: 'western-ai',
      title: 'AI Spiritual Guide | Ask Questions | StarLoom',
      description: 'Chat with our AI spiritual guide. Ask questions about tarot, astrology, numerology, and get personalized guidance.',
      locale: 'en'
    }
  },
  {
    path: "/en/chat/:shareKey",
    name: "western-chat",
    component: Chat,
    meta: {
      locale: 'en'
    }
  }
]
