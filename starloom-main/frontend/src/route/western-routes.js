// Western Version Routes (/en prefix)
// 西方版本路由配置

const WesternHome = () => import("../page/Western/WesternHome.vue")
const TarotReading = () => import("../page/Western/TarotReading.vue")
const AstrologyHub = () => import("../page/Western/AstrologyHub.vue")
const DailyHoroscope = () => import("../page/Western/DailyHoroscope.vue")
const Numerology = () => import("../page/Western/Numerology.vue")
const WesternTools = () => import("../page/Western/WesternTools.vue")
const ChakraQuizTool = () => import("../page/Western/Tools/ChakraQuizTool.vue")
const CrystalGuideTool = () => import("../page/Western/Tools/CrystalGuideTool.vue")
const AffirmationTool = () => import("../page/Western/Tools/AffirmationTool.vue")
const MeditationTimerTool = () => import("../page/Western/Tools/MeditationTimerTool.vue")
const EnergyReadingTool = () => import("../page/Western/Tools/EnergyReadingTool.vue")
const MoonCalendarTool = () => import("../page/Western/Tools/MoonCalendarTool.vue")
const PersonalYearTool = () => import("../page/Western/Tools/PersonalYearTool.vue")
const RisingSignTool = () => import("../page/Western/Tools/RisingSignTool.vue")
const ZodiacCompatibility = () => import("../page/Western/ZodiacCompatibility.vue")
const ZodiacCompatibilityDetail = () => import("../page/Western/ZodiacCompatibilityDetail.vue")
const TarotCards = () => import("../page/Western/TarotCards.vue")
const TarotCardDetail = () => import("../page/Western/TarotCardDetail.vue")
const SeoLanding = () => import("../page/Western/SeoLanding.vue")
const Chat = () => import("../page/Chat.vue")

const makeLandingRoute = ({ path, name, seoKey, title, description, keywords, landing }) => ({
  path,
  name,
  component: SeoLanding,
  meta: {
    seoKey,
    title,
    description,
    keywords,
    locale: 'en',
    landing
  }
})

const extraAngelNumberRoutes = [
  {
    number: '666',
    title: '666 Angel Number Meaning | Balance, Mindset & Realignment | StarLoom',
    description: 'What does 666 mean? Explore common meanings of 666 for balance, mindset shifts, and realignment—plus practical next steps.',
    keywords: '666 meaning, 666 angel number meaning, 666 spiritual meaning, 666 balance'
  },
  {
    number: '8888',
    title: '8888 Angel Number Meaning | Prosperity, Momentum & Abundance | StarLoom',
    description: 'What does 8888 mean? Learn common interpretations of 8888 for prosperity, momentum, and abundance—plus grounded next steps.',
    keywords: '8888 meaning, 8888 angel number meaning, 8888 abundance, 8888 money meaning'
  },
  {
    number: '1111',
    title: '1111 Angel Number Meaning | Awakening, Alignment & New Chapter | StarLoom',
    description: 'What does 1111 mean? Explore common 1111 angel number meanings for alignment, awakening, and beginning a new chapter—plus next steps.',
    keywords: '1111 meaning, 1111 angel number meaning, 1111 spiritual meaning, 1111 love meaning'
  },
  {
    number: '2020',
    title: '2020 Angel Number Meaning | Patience, Partnership & Progress | StarLoom',
    description: 'What does 2020 mean? Learn common meanings of 2020 for patience, partnership, and steady progress—plus reflection prompts and actions.',
    keywords: '2020 meaning, 2020 angel number meaning, 2020 spiritual meaning, 2020 love meaning'
  },
  {
    number: '3030',
    title: '3030 Angel Number Meaning | Creativity, Communication & Confidence | StarLoom',
    description: 'What does 3030 mean? Explore common meanings of 3030 for creativity, communication, and confidence—plus practical next steps.',
    keywords: '3030 meaning, 3030 angel number meaning, 3030 spiritual meaning, 3030 creativity'
  },
].map((x) =>
  makeLandingRoute({
    path: `/en/${x.number}-meaning`,
    name: `en-${x.number}-meaning-landing`,
    seoKey: 'western-tools',
    title: x.title,
    description: x.description,
    keywords: x.keywords,
    landing: {
      heroTitle: `${x.number} Angel Number Meaning`,
      intro: 'Use angel numbers as reflective prompts. Notice what you are focusing on, and choose one grounded next step.',
      highlights: [
        'Simple meaning and reflection prompts',
        'Love + career mindset check-in',
        'Action-focused next steps'
      ],
      faqs: [
        { q: `What should I do when I see ${x.number}?`, a: 'Pause for 10 seconds, name your current priority, and take one small action aligned with it today.' },
        { q: 'Are angel numbers always spiritual?', a: 'Not necessarily. Many people use them as meaningful reminders. What matters is how you apply them constructively.' }
      ],
      primaryCta: { text: 'Try a Tarot Reading', to: '/en/tarot' },
      secondaryCta: { text: 'Explore Angel Numbers', to: '/en/angel-numbers' },
      related: [
        { title: '111 Meaning', description: 'Fresh starts and intention.', to: '/en/111-meaning' },
        { title: '888 Meaning', description: 'Abundance and balance.', to: '/en/888-meaning' },
        { title: 'Life Path Number', description: 'Core direction and lessons.', to: '/en/life-path-number' },
      ]
    }
  })
)

const destinyMeaningRoutes = Array.from({ length: 9 }, (_, i) => i + 1).map((n) =>
  makeLandingRoute({
    path: `/en/destiny-number-${n}-meaning`,
    name: `en-destiny-number-${n}-meaning-landing`,
    seoKey: 'western-numerology',
    title: `Destiny Number ${n} Meaning | Numerology Guide | StarLoom`,
    description: `Destiny Number ${n} meaning: strengths, challenges, love/career themes, and practical growth tips. A beginner-friendly numerology guide.`,
    keywords: `destiny number ${n} meaning, expression number ${n}, numerology destiny ${n}, destiny number ${n}`,
    landing: {
      heroTitle: `Destiny Number ${n} Meaning`,
      intro: 'Your Destiny (Expression) Number describes your natural talents and how you are here to express them over time.',
      highlights: [
        'Strengths and natural talents',
        'Common challenges + blind spots',
        'Practical ways to grow this year'
      ],
      faqs: [
        { q: 'What is the Destiny (Expression) Number?', a: 'It is usually calculated from your full birth name and reflects how you express your abilities and direction over time.' },
        { q: 'Is it the same as Life Path?', a: 'No. Life Path is birth-date based. Destiny Number is name-based and relates to expression and talent.' }
      ],
      primaryCta: { text: 'Calculate Your Numbers', to: '/en/numerology' },
      secondaryCta: { text: 'Life Path Number Calculator', to: '/en/life-path-number' },
      related: [
        { title: 'Destiny Number Calculator', description: 'Calculate from your name.', to: '/en/destiny-number' },
        { title: 'Personal Year Number', description: 'Your year theme and focus.', to: '/en/personal-year' },
        { title: 'Tarot Reading', description: 'Ask about next steps.', to: '/en/tarot' },
      ]
    }
  })
)

const personalYearMeaningRoutes = Array.from({ length: 9 }, (_, i) => i + 1).map((n) =>
  makeLandingRoute({
    path: `/en/personal-year-${n}-meaning`,
    name: `en-personal-year-${n}-meaning-landing`,
    seoKey: 'western-numerology',
    title: `Personal Year ${n} Meaning | Numerology Year Theme | StarLoom`,
    description: `Personal Year ${n} meaning: year theme, focus areas, and practical tips for love, career, and growth. Beginner-friendly numerology guide.`,
    keywords: `personal year ${n} meaning, personal year number ${n}, numerology personal year ${n}, personal year ${n}`,
    landing: {
      heroTitle: `Personal Year ${n} Meaning`,
      intro: 'Your Personal Year Number reflects the overall theme of your year. Use it to focus priorities and make better decisions.',
      highlights: [
        'Key theme and focus of the year',
        'Helpful habits and decisions',
        'Love + career reflection prompts'
      ],
      faqs: [
        { q: 'When does my personal year start?', a: 'Some systems start on January 1st; others start on your birthday. Use it as a reflective guide and compare what resonates.' },
        { q: 'Do I need my name for Personal Year?', a: 'No. Personal Year is typically calculated using your birth date and the current year.' }
      ],
      primaryCta: { text: 'Personal Year Calculator', to: '/en/tools/personal-year' },
      secondaryCta: { text: 'Explore Numerology', to: '/en/numerology' },
      related: [
        { title: 'Life Path Number', description: 'Your core strengths and lessons.', to: '/en/life-path-number' },
        { title: 'Destiny Number', description: 'Name-based talents and direction.', to: '/en/destiny-number' },
        { title: 'Tarot Reading', description: 'Ask what to do next.', to: '/en/tarot' },
      ]
    }
  })
)

const zodiacSigns = [
  { key: 'aries', name: 'Aries' },
  { key: 'taurus', name: 'Taurus' },
  { key: 'gemini', name: 'Gemini' },
  { key: 'cancer', name: 'Cancer' },
  { key: 'leo', name: 'Leo' },
  { key: 'virgo', name: 'Virgo' },
  { key: 'libra', name: 'Libra' },
  { key: 'scorpio', name: 'Scorpio' },
  { key: 'sagittarius', name: 'Sagittarius' },
  { key: 'capricorn', name: 'Capricorn' },
  { key: 'aquarius', name: 'Aquarius' },
  { key: 'pisces', name: 'Pisces' },
]

const compatibilityMatrixRoutes = zodiacSigns.flatMap((a) =>
  zodiacSigns.map((b) => {
    const path = `/en/${a.key}-and-${b.key}-compatibility`
    const name = `en-${a.key}-and-${b.key}-compatibility-landing`
    const title = `${a.name} and ${b.name} Compatibility | Love Match & Tips | StarLoom`
    const description = `Explore ${a.name} and ${b.name} compatibility: strengths, challenges, and practical relationship tips. Get a quick score and guidance.`
    const keywords = `${a.name} and ${b.name} compatibility, ${a.name} ${b.name} love compatibility, ${a.key} ${b.key} compatibility, zodiac compatibility`
    const detailTo = `/en/compatibility/${a.key}/${b.key}`
    return makeLandingRoute({
      path,
      name,
      seoKey: 'western-compatibility',
      title,
      description,
      keywords,
      landing: {
        heroTitle: `${a.name} and ${b.name} Compatibility`,
        intro: `Check how ${a.name} and ${b.name} match in love and relationships. Use this as a starting point, then explore your full charts for deeper insight.`,
        highlights: [
          'Quick compatibility score and overview',
          'Strengths and friction points explained',
          'Practical tips to improve communication'
        ],
        faqs: [
          { q: `Is ${a.name} and ${b.name} compatibility accurate?`, a: 'Sun-sign compatibility is a helpful starting point. Full compatibility is deeper and depends on the whole birth chart.' },
          { q: 'What should we do if the score is low?', a: 'Use it to identify growth areas. Good communication, boundaries, and shared values matter more than any single score.' }
        ],
        primaryCta: { text: `Check ${a.name} + ${b.name} Compatibility`, to: detailTo },
        secondaryCta: { text: 'Try a Love Tarot Reading', to: '/en/tarot-love-reading' },
        related: [
          { title: 'Zodiac Compatibility', description: 'Pick any two signs.', to: '/en/compatibility' },
          { title: 'Synastry Compatibility', description: 'Compare two full charts.', to: '/en/synastry-compatibility' },
          { title: 'Birth Chart Calculator', description: 'Get your Big Three placements.', to: '/en/birth-chart' },
          { title: 'Daily Horoscope', description: 'Daily love and life themes.', to: '/en/horoscope' },
        ]
      }
    })
  })
)

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
    path: "/en/tarot-reading",
    name: "en-tarot-reading-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tarot',
      title: 'Free Tarot Reading Online | Instant AI Tarot | StarLoom',
      description: 'Get a free tarot reading online in seconds. Ask a question, draw cards, and receive an instant AI interpretation for love, career, and guidance.',
      keywords: 'free tarot reading, tarot reading online, AI tarot, tarot cards meaning, love tarot, career tarot',
      locale: 'en',
      landing: {
        heroTitle: 'Free Tarot Reading Online',
        intro: 'Ask a question, draw cards, and get instant AI-powered guidance. Fast, private, and beginner-friendly.',
        highlights: [
          'Instant card interpretations for love, career, and general guidance',
          'Multiple spreads and clear explanations',
          'Mobile-friendly and free to use'
        ],
        faqs: [
          { q: 'Is this tarot reading free?', a: 'Yes. You can draw cards and receive an interpretation for free.' },
          { q: 'What should I ask?', a: 'Ask specific questions about a situation. Focus on what you can do next, not just yes/no.' },
          { q: 'How accurate is tarot?', a: 'Tarot is best used as reflective guidance. Use it to clarify options and emotions.' }
        ],
        primaryCta: { text: 'Start a Free Tarot Reading', to: '/en/tarot' },
        secondaryCta: { text: 'Browse Tarot Card Meanings', to: '/en/tarot/cards' },
        related: [
          { title: 'Tarot Card Meanings', description: 'Browse Major & Minor Arcana meanings.', to: '/en/tarot/cards' },
          { title: 'Zodiac Compatibility', description: 'Check love compatibility for any two signs.', to: '/en/compatibility' },
          { title: 'Daily Horoscope', description: 'Read horoscope guidance for all 12 signs.', to: '/en/horoscope' },
          { title: 'Numerology Calculator', description: 'Calculate life path and destiny numbers.', to: '/en/numerology' }
        ]
      }
    }
  },
  {
    path: "/en/tarot-yes-no",
    name: "en-tarot-yes-no-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tarot',
      title: 'Yes or No Tarot Reading | Quick 1-Card Guidance | StarLoom',
      description: 'Need a quick answer? Try a yes-or-no tarot reading with a clear explanation and next-step advice. Free and instant.',
      keywords: 'yes or no tarot, tarot yes no, one card tarot, quick tarot reading',
      locale: 'en',
      landing: {
        heroTitle: 'Yes or No Tarot Reading',
        intro: 'Get a quick yes/no style reading with context and practical guidance for your next step.',
        highlights: [
          'Fast 1-card style guidance',
          'Clear explanation (not just yes/no)',
          'Good for decisions and timing questions'
        ],
        faqs: [
          { q: 'Is yes/no tarot reliable?', a: 'It works best when you ask a clear question and stay open to nuance.' },
          { q: 'What questions work best?', a: 'Try questions about choices you can influence. Avoid questions that remove your agency.' }
        ],
        primaryCta: { text: 'Ask a Yes/No Question', to: '/en/tarot' },
        secondaryCta: { text: 'Learn Tarot Meanings', to: '/en/tarot/cards' },
        related: [
          { title: 'Free Tarot Reading Online', description: 'Full reading experience with interpretations.', to: '/en/tarot-reading' },
          { title: 'Tarot Card Meanings', description: 'Upright and reversed keywords.', to: '/en/tarot/cards' }
        ]
      }
    }
  },
  {
    path: "/en/tarot-love-reading",
    name: "en-tarot-love-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tarot',
      title: 'Love Tarot Reading | Relationship Guidance & Clarity | StarLoom',
      description: 'Get a love tarot reading for relationship clarity. Explore feelings, intentions, and next steps with an instant AI interpretation.',
      keywords: 'love tarot reading, relationship tarot, tarot love reading, soulmate tarot',
      locale: 'en',
      landing: {
        heroTitle: 'Love Tarot Reading',
        intro: 'Whether you are dating, in a relationship, or healing from a breakup, get clarity with a love-focused reading.',
        highlights: [
          'Understand feelings and intentions',
          'See patterns and practical next steps',
          'Great for reconciliation and new love'
        ],
        faqs: [
          { q: 'Can tarot tell if someone loves me?', a: 'Tarot can help reflect emotions and dynamics, but it is not a substitute for communication.' },
          { q: 'What should I ask in love readings?', a: 'Ask what you need to know, what to focus on, and what action supports your wellbeing.' }
        ],
        primaryCta: { text: 'Get a Love Reading', to: '/en/tarot' },
        secondaryCta: { text: 'Check Zodiac Compatibility', to: '/en/compatibility' },
        related: [
          { title: 'Zodiac Compatibility', description: 'See strengths and challenges for two signs.', to: '/en/compatibility' },
          { title: 'Daily Horoscope', description: 'Daily love and relationship guidance.', to: '/en/horoscope' }
        ]
      }
    }
  },
  {
    path: "/en/tarot-career-reading",
    name: "en-tarot-career-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tarot',
      title: 'Career Tarot Reading | Work, Money & Next Steps | StarLoom',
      description: 'Get a career tarot reading for clarity about work, job offers, money decisions, and next steps. Free and instant.',
      keywords: 'career tarot reading, work tarot, money tarot, job tarot reading',
      locale: 'en',
      landing: {
        heroTitle: 'Career Tarot Reading',
        intro: 'Ask about your job, career direction, and money choices. Get a reading that focuses on actions you can take next.',
        highlights: [
          'Guidance for job decisions and career direction',
          'Money mindset and opportunity insights',
          'Clear next-step suggestions'
        ],
        faqs: [
          { q: 'Can tarot predict my career outcome?', a: 'Tarot is better for exploring options, mindset, and likely dynamics than guaranteed predictions.' }
        ],
        primaryCta: { text: 'Get a Career Reading', to: '/en/tarot' },
        secondaryCta: { text: 'Try Numerology', to: '/en/numerology' },
        related: [
          { title: 'Numerology Calculator', description: 'Life path and destiny numbers for career insight.', to: '/en/numerology' },
          { title: 'Daily Horoscope', description: 'Career and money horoscope guidance.', to: '/en/horoscope' }
        ]
      }
    }
  },
  {
    path: "/en/birth-chart",
    name: "en-birth-chart-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-astrology',
      title: 'Birth Chart Calculator | Free Natal Chart | StarLoom',
      description: 'Generate your free birth chart (natal chart) and explore placements, houses, and key themes for love, career, and growth.',
      keywords: 'birth chart calculator, natal chart, free birth chart, astrology chart',
      locale: 'en',
      landing: {
        heroTitle: 'Birth Chart Calculator',
        intro: 'Create your natal chart and explore the patterns that shape your personality, relationships, and life direction.',
        highlights: [
          'Understand your Sun, Moon, and Rising signs',
          'Explore houses and key life themes',
          'Beginner-friendly explanations'
        ],
        faqs: [
          { q: 'What do I need to calculate my birth chart?', a: 'Your birth date, birth time, and birth location (city/country).' },
          { q: 'What if I do not know my birth time?', a: 'You can still explore Sun and Moon placements, but houses and rising sign may be less accurate.' }
        ],
        primaryCta: { text: 'Explore Astrology', to: '/en/astrology' },
        secondaryCta: { text: 'Check Daily Horoscope', to: '/en/horoscope' },
        related: [
          { title: 'Daily Horoscope', description: 'Daily guidance for all 12 signs.', to: '/en/horoscope' },
          { title: 'Zodiac Compatibility', description: 'Love compatibility insights.', to: '/en/compatibility' }
        ]
      }
    }
  },
  {
    path: "/en/daily-horoscope",
    name: "en-daily-horoscope-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-horoscope',
      title: 'Daily Horoscope Today | All Zodiac Signs | StarLoom',
      description: 'Read your daily horoscope today for love, career, and wellness. Quick, clear, and updated guidance for all zodiac signs.',
      keywords: 'daily horoscope, horoscope today, zodiac horoscope, horoscope love career',
      locale: 'en',
      landing: {
        heroTitle: 'Daily Horoscope Today',
        intro: 'Get quick daily guidance for love, career, and wellbeing. Read for your Sun sign and reflect on the themes that matter.',
        highlights: [
          'All 12 zodiac signs',
          'Love, career, and wellness themes',
          'Short and easy to read'
        ],
        faqs: [
          { q: 'Should I read my Sun sign or Rising sign?', a: 'Start with your Sun sign. If you know your Rising sign, it can be even more relevant.' }
        ],
        primaryCta: { text: 'Read Today\'s Horoscope', to: '/en/horoscope' },
        secondaryCta: { text: 'Check Compatibility', to: '/en/compatibility' },
        related: [
          { title: 'Zodiac Compatibility', description: 'Quick score and insights for two signs.', to: '/en/compatibility' },
          { title: 'Birth Chart', description: 'Learn your big three and placements.', to: '/en/birth-chart' }
        ]
      }
    }
  },
  {
    path: "/en/life-path-number",
    name: "en-life-path-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-numerology',
      title: 'Life Path Number Calculator | Free Numerology | StarLoom',
      description: 'Calculate your Life Path Number and learn your core strengths, challenges, and growth direction with a free numerology reading.',
      keywords: 'life path number, life path calculator, numerology calculator, destiny number',
      locale: 'en',
      landing: {
        heroTitle: 'Life Path Number Calculator',
        intro: 'Discover your Life Path Number and what it suggests about your talents, lessons, and direction in life.',
        highlights: [
          'Fast and free calculation',
          'Beginner-friendly explanation',
          'Use it for career and relationship reflection'
        ],
        faqs: [
          { q: 'What is a Life Path Number?', a: 'It is the most commonly used numerology number derived from your birth date.' }
        ],
        primaryCta: { text: 'Calculate Your Number', to: '/en/numerology' },
        secondaryCta: { text: 'Explore Astrology', to: '/en/astrology' },
        related: [
          { title: 'Numerology', description: 'Life path, destiny, and personal year.', to: '/en/numerology' },
          { title: 'Daily Horoscope', description: 'Daily themes and guidance.', to: '/en/horoscope' }
        ]
      }
    }
  },
  {
    path: "/en/destiny-number",
    name: "en-destiny-number-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-numerology',
      title: 'Destiny Number Calculator | Free Numerology Reading | StarLoom',
      description: 'Calculate your Destiny Number (Expression Number) and explore your natural talents, strengths, and life direction. Free and beginner-friendly.',
      keywords: 'destiny number calculator, expression number, numerology destiny number, numerology reading',
      locale: 'en',
      landing: {
        heroTitle: 'Destiny Number Calculator',
        intro: 'Discover your Destiny (Expression) Number and the skills you are here to develop and express.',
        highlights: [
          'Quick calculation',
          'Clear interpretation (strengths + challenges)',
          'Useful for career and personal growth'
        ],
        faqs: [
          { q: 'What is a Destiny Number?', a: 'In numerology, the Destiny (Expression) Number is often calculated from your full birth name and reflects your natural abilities and long-term direction.' },
          { q: 'Is this the same as Life Path?', a: 'No. Life Path comes from your birth date. Destiny Number is name-based and reflects expression and talent.' }
        ],
        primaryCta: { text: 'Explore Numerology', to: '/en/numerology' },
        secondaryCta: { text: 'Calculate Life Path Number', to: '/en/life-path-number' },
        related: [
          { title: 'Life Path Number', description: 'Your core path and lessons.', to: '/en/life-path-number' },
          { title: 'Daily Horoscope', description: 'Daily guidance for love and career.', to: '/en/horoscope' }
        ]
      }
    }
  },
  {
    path: "/en/personal-year",
    name: "en-personal-year-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-numerology',
      title: 'Personal Year Number Calculator | Numerology Forecast | StarLoom',
      description: 'Find your Personal Year Number and understand the themes and opportunities for the year ahead. Free numerology forecast in seconds.',
      keywords: 'personal year number calculator, personal year numerology, numerology forecast, yearly numerology',
      locale: 'en',
      landing: {
        heroTitle: 'Personal Year Number Calculator',
        intro: 'Learn the main theme of your year—growth, relationships, career moves, or reflection—using a simple numerology method.',
        highlights: [
          'Fast and free forecast',
          'Theme-based guidance (what to focus on this year)',
          'Great for planning and reflection'
        ],
        faqs: [
          { q: 'What is a Personal Year Number?', a: 'It is a numerology number that describes the overall theme of a calendar year for you, based on your birth date.' },
          { q: 'When does my personal year start?', a: 'Some systems use January 1st; others use your birthday. Use it as a reflective tool and compare what resonates.' }
        ],
        primaryCta: { text: 'Explore Numerology', to: '/en/numerology' },
        secondaryCta: { text: 'Calculate Life Path Number', to: '/en/life-path-number' },
        related: [
          { title: 'Life Path Number', description: 'Your core path and strengths.', to: '/en/life-path-number' },
          { title: 'Tarot Reading', description: 'Ask a question and get guidance.', to: '/en/tarot' }
        ]
      }
    }
  },
  {
    path: "/en/rising-sign",
    name: "en-rising-sign-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-astrology',
      title: 'Rising Sign Calculator | Find Your Ascendant Sign | StarLoom',
      description: 'Find your Rising Sign (Ascendant) and learn how you come across to others, your first impressions, and your personal style. Free and instant.',
      keywords: 'rising sign calculator, ascendant sign, find my rising sign, astrology rising sign',
      locale: 'en',
      landing: {
        heroTitle: 'Rising Sign Calculator',
        intro: 'Your Rising Sign (Ascendant) shapes your first impressions, outer personality, and how you meet the world.',
        highlights: [
          'Learn why birth time matters',
          'Understand your “first impression” energy',
          'Connect Rising + Sun + Moon for your Big Three'
        ],
        faqs: [
          { q: 'What is a Rising Sign?', a: 'Also called the Ascendant, it is the zodiac sign rising on the eastern horizon at the moment of your birth.' },
          { q: 'Do I need an exact birth time?', a: 'Yes, ideally. The rising sign can change about every two hours.' }
        ],
        primaryCta: { text: 'Explore Astrology', to: '/en/astrology' },
        secondaryCta: { text: 'Birth Chart Calculator', to: '/en/birth-chart' },
        related: [
          { title: 'Birth Chart Calculator', description: 'Explore placements and houses.', to: '/en/birth-chart' },
          { title: 'Daily Horoscope', description: 'Quick daily guidance for all signs.', to: '/en/horoscope' }
        ]
      }
    }
  },
  {
    path: "/en/moon-sign",
    name: "en-moon-sign-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-astrology',
      title: 'Moon Sign Calculator | Find Your Moon Sign | StarLoom',
      description: 'Find your Moon Sign and understand your emotional needs, inner world, and relationship patterns. Free and beginner-friendly.',
      keywords: 'moon sign calculator, find my moon sign, astrology moon sign, moon sign meaning',
      locale: 'en',
      landing: {
        heroTitle: 'Moon Sign Calculator',
        intro: 'Your Moon Sign reflects how you process emotions, what makes you feel safe, and what you need to recharge.',
        highlights: [
          'Understand emotional patterns and needs',
          'Helpful for relationships and self-care',
          'Pairs well with Sun + Rising for a fuller picture'
        ],
        faqs: [
          { q: 'What is a Moon Sign?', a: 'It is the zodiac sign the Moon was in when you were born. It relates to emotions, comfort, and instincts.' },
          { q: 'Do I need birth time for Moon Sign?', a: 'It helps for precision, but the Moon sign changes about every 2–3 days, so it is less sensitive than Rising.' }
        ],
        primaryCta: { text: 'Explore Astrology', to: '/en/astrology' },
        secondaryCta: { text: 'Birth Chart Calculator', to: '/en/birth-chart' },
        related: [
          { title: 'Daily Horoscope', description: 'Daily themes for love and career.', to: '/en/horoscope' },
          { title: 'Zodiac Compatibility', description: 'Compare two signs quickly.', to: '/en/compatibility' }
        ]
      }
    }
  },
  {
    path: "/en/what-is-rising-sign",
    name: "en-what-is-rising-sign-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-astrology',
      title: 'What Is a Rising Sign? (Ascendant) | Astrology Guide | StarLoom',
      description: 'Learn what a Rising Sign (Ascendant) means in astrology, why birth time matters, and how to interpret it with your Sun and Moon signs.',
      keywords: 'what is rising sign, ascendant meaning, rising sign astrology, big three astrology',
      locale: 'en',
      landing: {
        heroTitle: 'What Is a Rising Sign?',
        intro: 'The Rising Sign (Ascendant) describes the “front door” of your personality—your first impressions, style, and how you approach new situations.',
        highlights: [
          'Rising sign = how you show up',
          'Explains first impressions and approach',
          'Works best with your Sun + Moon (Big Three)'
        ],
        faqs: [
          { q: 'Is Rising Sign more important than Sun Sign?', a: 'Both matter. Sun is your core identity; Rising is your outward expression and the start of your birth chart houses.' },
          { q: 'Why does it change so fast?', a: 'The Ascendant is based on Earth’s rotation, so it moves through zodiac signs quickly.' }
        ],
        primaryCta: { text: 'Try Rising Sign Calculator', to: '/en/rising-sign' },
        secondaryCta: { text: 'Birth Chart Calculator', to: '/en/birth-chart' },
        related: [
          { title: 'Moon Sign Guide', description: 'Emotions and inner needs.', to: '/en/moon-sign' },
          { title: 'Zodiac Compatibility', description: 'Quick match insights.', to: '/en/compatibility' }
        ]
      }
    }
  },
  {
    path: "/en/how-to-read-a-birth-chart",
    name: "en-how-to-read-birth-chart-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-astrology',
      title: 'How to Read a Birth Chart (Natal Chart) | Beginner Guide | StarLoom',
      description: 'A beginner-friendly guide to reading your birth chart: planets, signs, houses, and aspects—plus what to look at first.',
      keywords: 'how to read a birth chart, natal chart guide, astrology birth chart, chart reading beginner',
      locale: 'en',
      landing: {
        heroTitle: 'How to Read a Birth Chart',
        intro: 'Start with your Big Three (Sun, Moon, Rising), then explore houses and key aspects for deeper insight.',
        highlights: [
          'What to look at first (Big Three)',
          'Planets + signs + houses explained simply',
          'How to use a chart for love and career reflection'
        ],
        faqs: [
          { q: 'What do I need to read my chart?', a: 'Your birth date, birth time, and birth location. Birth time improves Rising sign and house accuracy.' },
          { q: 'What if my birth time is unknown?', a: 'You can still read Sun and Moon signs. Houses and Rising sign may be inaccurate.' }
        ],
        primaryCta: { text: 'Birth Chart Calculator', to: '/en/birth-chart' },
        secondaryCta: { text: 'Daily Horoscope', to: '/en/horoscope' },
        related: [
          { title: 'Astrology Hub', description: 'Charts, horoscopes and more.', to: '/en/astrology' },
          { title: 'Zodiac Compatibility', description: 'Quick relationship insights.', to: '/en/compatibility' }
        ]
      }
    }
  },
  {
    path: "/en/tarot-spreads-for-beginners",
    name: "en-tarot-spreads-beginners-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tarot',
      title: 'Tarot Spreads for Beginners | Simple Layouts & Meanings | StarLoom',
      description: 'Learn beginner-friendly tarot spreads (1-card, 3-card, and more). Understand what each position means and how to read with confidence.',
      keywords: 'tarot spreads for beginners, 3 card tarot spread, one card tarot, tarot layout meanings',
      locale: 'en',
      landing: {
        heroTitle: 'Tarot Spreads for Beginners',
        intro: 'Start simple. A clear question + an easy spread helps you get useful guidance without feeling overwhelmed.',
        highlights: [
          '1-card and 3-card spreads explained',
          'How to ask better questions',
          'Practical next-step style interpretations'
        ],
        faqs: [
          { q: 'What is the best tarot spread for beginners?', a: 'The 3-card spread is the most popular because it is simple and flexible (past/present/future or situation/action/outcome).' },
          { q: 'Do I need reversed meanings?', a: 'Not at first. Start with upright meanings and add reversals later if you want more nuance.' }
        ],
        primaryCta: { text: 'Start a Tarot Reading', to: '/en/tarot' },
        secondaryCta: { text: 'Browse Tarot Card Meanings', to: '/en/tarot/cards' },
        related: [
          { title: 'Free Tarot Reading Online', description: 'Instant AI interpretation.', to: '/en/tarot-reading' },
          { title: 'Yes or No Tarot', description: 'Quick 1-card guidance.', to: '/en/tarot-yes-no' }
        ]
      }
    }
  },
  {
    path: "/en/how-to-do-a-tarot-reading",
    name: "en-how-to-do-tarot-reading-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tarot',
      title: 'How to Do a Tarot Reading | Step-by-Step Beginner Guide | StarLoom',
      description: 'A simple step-by-step guide to doing a tarot reading: how to ask questions, shuffle, draw cards, and interpret meanings with confidence.',
      keywords: 'how to do a tarot reading, tarot reading for beginners, how to read tarot cards, tarot guide',
      locale: 'en',
      landing: {
        heroTitle: 'How to Do a Tarot Reading',
        intro: 'Tarot works best as reflective guidance. Keep it simple: ask a clear question, draw cards, and focus on your next step.',
        highlights: [
          'How to ask a good question',
          'How to shuffle and draw cards',
          'How to interpret for love and career'
        ],
        faqs: [
          { q: 'Do I need to cleanse my deck?', a: 'Optional. Some people like it for ritual. The most important thing is your intention and attention.' },
          { q: 'Should I read for the future?', a: 'You can, but focus on what you can influence: choices, patterns, and next steps.' }
        ],
        primaryCta: { text: 'Try a Free Tarot Reading', to: '/en/tarot-reading' },
        secondaryCta: { text: 'Tarot Spreads for Beginners', to: '/en/tarot-spreads-for-beginners' },
        related: [
          { title: 'Tarot Card Meanings', description: 'Upright and reversed keywords.', to: '/en/tarot/cards' },
          { title: 'Love Tarot Reading', description: 'Relationship guidance and clarity.', to: '/en/tarot-love-reading' }
        ]
      }
    }
  },
  {
    path: "/en/sun-sign",
    name: "en-sun-sign-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-astrology',
      title: 'Sun Sign Meaning | What Is Your Sun Sign? | StarLoom',
      description: 'Learn what your Sun sign means in astrology, how to find it, and how it differs from your Moon and Rising signs.',
      keywords: 'sun sign meaning, what is sun sign, sun sign astrology, big three astrology',
      locale: 'en',
      landing: {
        heroTitle: 'Sun Sign Meaning',
        intro: 'Your Sun sign represents your core identity, life direction, and how you express your essential self.',
        highlights: [
          'Sun vs Moon vs Rising explained',
          'How to find your Sun sign',
          'How to use it for self-understanding'
        ],
        faqs: [
          { q: 'Is my Sun sign enough to describe me?', a: 'It is a strong starting point, but the Moon and Rising signs add emotional and outward expression layers.' },
          { q: 'Why do horoscopes feel inaccurate?', a: 'Many horoscopes use only Sun sign. Rising sign and key placements can change the emphasis.' }
        ],
        primaryCta: { text: 'Explore Astrology', to: '/en/astrology' },
        secondaryCta: { text: 'Moon Sign Calculator', to: '/en/moon-sign' },
        related: [
          { title: 'Rising Sign (Ascendant)', description: 'First impressions and approach.', to: '/en/rising-sign' },
          { title: 'How to Read a Birth Chart', description: 'Beginner chart reading guide.', to: '/en/how-to-read-a-birth-chart' }
        ]
      }
    }
  },
  {
    path: "/en/zodiac-sign-dates",
    name: "en-zodiac-sign-dates-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-horoscope',
      title: 'Zodiac Sign Dates | 12 Signs Date Ranges & Traits | StarLoom',
      description: 'Find zodiac sign date ranges and quick personality traits for all 12 astrology signs. Simple and easy to understand.',
      keywords: 'zodiac sign dates, zodiac date ranges, astrology signs dates, star sign dates',
      locale: 'en',
      landing: {
        heroTitle: 'Zodiac Sign Dates',
        intro: 'Quickly check the date ranges for all 12 zodiac signs and get a simple overview of traits and themes.',
        highlights: [
          'All 12 signs date ranges',
          'Beginner-friendly traits overview',
          'Links to daily horoscope and compatibility'
        ],
        faqs: [
          { q: 'Can zodiac dates vary by year?', a: 'Slightly. The Sun changes signs on different times/days depending on year and timezone.' },
          { q: 'What if I was born on a cusp?', a: 'You may identify with both. A birth chart calculation can confirm exact placements.' }
        ],
        primaryCta: { text: 'Read Daily Horoscope', to: '/en/horoscope' },
        secondaryCta: { text: 'Check Compatibility', to: '/en/compatibility' },
        related: [
          { title: 'Birth Chart Calculator', description: 'Confirm exact placements.', to: '/en/birth-chart' },
          { title: 'Zodiac Compatibility', description: 'Quick match insights.', to: '/en/zodiac-compatibility' }
        ]
      }
    }
  },
  {
    path: "/en/mercury-retrograde",
    name: "en-mercury-retrograde-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-astrology',
      title: 'Mercury Retrograde Guide | Meaning, Tips & What to Do | StarLoom',
      description: 'Learn what Mercury retrograde means, what themes it brings, and practical tips for communication, tech, and planning.',
      keywords: 'mercury retrograde meaning, mercury retrograde tips, what to do during mercury retrograde',
      locale: 'en',
      landing: {
        heroTitle: 'Mercury Retrograde Guide',
        intro: 'Mercury retrograde is a time to review, revise, and reconnect—especially around communication, travel, and technology.',
        highlights: [
          'What Mercury retrograde means (simple)',
          'Practical do/don’t list',
          'How to use the energy productively'
        ],
        faqs: [
          { q: 'Is Mercury retrograde bad?', a: 'Not necessarily. It can be a helpful review cycle. Expect delays and double-check details.' },
          { q: 'Should I avoid signing contracts?', a: 'If possible, review carefully. If you must sign, triple-check terms and backups.' }
        ],
        primaryCta: { text: 'Explore Astrology', to: '/en/astrology' },
        secondaryCta: { text: 'Read Daily Horoscope', to: '/en/horoscope' },
        related: [
          { title: 'How to Read a Birth Chart', description: 'Planets and placements explained.', to: '/en/how-to-read-a-birth-chart' },
          { title: 'Tarot Reading', description: 'Ask about next steps.', to: '/en/tarot' }
        ]
      }
    }
  },
  {
    path: "/en/angel-numbers",
    name: "en-angel-numbers-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tools',
      title: 'Angel Numbers Meaning | 111, 222, 333 & More | StarLoom',
      description: 'Explore common angel numbers and what they may mean for love, career, and growth. A simple guide for beginners.',
      keywords: 'angel numbers meaning, 111 meaning, 222 meaning, 333 meaning, angel number guide',
      locale: 'en',
      landing: {
        heroTitle: 'Angel Numbers Meaning',
        intro: 'Angel numbers are repeating number patterns many people interpret as guidance or reminders. Use them as reflective prompts.',
        highlights: [
          'Common patterns explained (111/222/333)',
          'How to reflect on meaning without overthinking',
          'Related tools for clarity (tarot, numerology)'
        ],
        faqs: [
          { q: 'Are angel numbers real?', a: 'It depends on your beliefs. Many people use them as meaningful reminders and reflection triggers.' },
          { q: 'Why do I keep seeing the same number?', a: 'It can be attention + pattern recognition. Use it to check in with your current priorities and emotions.' }
        ],
        primaryCta: { text: 'Try a Tarot Reading', to: '/en/tarot' },
        secondaryCta: { text: 'Explore Numerology', to: '/en/numerology' },
        related: [
          { title: 'Life Path Number', description: 'Core lessons and strengths.', to: '/en/life-path-number' },
          { title: 'Personal Year Number', description: 'Themes of your year.', to: '/en/personal-year' }
        ]
      }
    }
  },
  {
    path: "/en/111-meaning",
    name: "en-111-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tools',
      title: '111 Angel Number Meaning | Love, Career & Manifestation | StarLoom',
      description: 'What does 111 mean? Explore common interpretations of the 111 angel number for love, career, and manifestation—plus simple next steps.',
      keywords: '111 meaning, 111 angel number meaning, 111 manifestation, 111 love meaning',
      locale: 'en',
      landing: {
        heroTitle: '111 Angel Number Meaning',
        intro: '111 is often linked with fresh starts, focus, and intention. Use it as a prompt to clarify what you want and what you will do next.',
        highlights: [
          'Fresh start and intention-setting theme',
          'Love + career reflection prompts',
          'Practical next-step suggestions'
        ],
        faqs: [
          { q: 'Does 111 mean my manifestation is coming?', a: 'It can be used as a reminder to align intention with action. Focus on one concrete next step.' },
          { q: 'What should I do when I see 111?', a: 'Pause, name your intention, and take one small action toward it today.' }
        ],
        primaryCta: { text: 'Try a Tarot Reading', to: '/en/tarot' },
        secondaryCta: { text: 'Explore Angel Numbers', to: '/en/angel-numbers' },
        related: [
          { title: '222 Meaning', description: 'Balance and relationships.', to: '/en/222-meaning' },
          { title: 'Life Path Number', description: 'Your core direction.', to: '/en/life-path-number' }
        ]
      }
    }
  },
  {
    path: "/en/222-meaning",
    name: "en-222-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tools',
      title: '222 Angel Number Meaning | Balance, Love & Trust | StarLoom',
      description: 'What does 222 mean? Explore common meanings of 222 for balance, relationships, cooperation, and trust—plus simple reflection prompts.',
      keywords: '222 meaning, 222 angel number meaning, 222 love meaning, 222 balance',
      locale: 'en',
      landing: {
        heroTitle: '222 Angel Number Meaning',
        intro: '222 is often linked with balance, partnership, patience, and trusting the process—especially in relationships and teamwork.',
        highlights: [
          'Balance and patience theme',
          'Relationship and cooperation focus',
          'Actionable prompts to reduce anxiety'
        ],
        faqs: [
          { q: 'Is 222 a good sign for love?', a: 'It is often interpreted as a reminder to communicate, cooperate, and seek balance.' },
          { q: 'What should I do when I see 222?', a: 'Check your boundaries and communication. Choose one supportive action that builds trust.' }
        ],
        primaryCta: { text: 'Try a Love Tarot Reading', to: '/en/tarot-love-reading' },
        secondaryCta: { text: 'Explore Angel Numbers', to: '/en/angel-numbers' },
        related: [
          { title: '111 Meaning', description: 'Fresh starts and intention.', to: '/en/111-meaning' },
          { title: 'Zodiac Compatibility', description: 'Relationship insights.', to: '/en/compatibility' }
        ]
      }
    }
  },
  {
    path: "/en/333-meaning",
    name: "en-333-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tools',
      title: '333 Angel Number Meaning | Creativity & Growth | StarLoom',
      description: 'What does 333 mean? Explore common 333 angel number meanings for creativity, self-expression, and growth—plus simple next steps.',
      keywords: '333 meaning, 333 angel number meaning, 333 spiritual meaning, 333 creativity',
      locale: 'en',
      landing: {
        heroTitle: '333 Angel Number Meaning',
        intro: '333 is often linked with creativity, self-expression, and growth. Use it as a prompt to share your voice and move forward confidently.',
        highlights: [
          'Creativity and self-expression theme',
          'Growth mindset prompts',
          'Simple actions to build momentum'
        ],
        faqs: [
          { q: 'Is 333 a sign to take action?', a: 'Many people interpret it as encouragement. Choose one creative or growth-focused next step.' },
          { q: 'What if I feel stuck?', a: 'Start small. Write, draft, talk to someone, or take one step that supports your expression.' }
        ],
        primaryCta: { text: 'Try a Tarot Reading', to: '/en/tarot' },
        secondaryCta: { text: 'Explore Angel Numbers', to: '/en/angel-numbers' },
        related: [
          { title: 'Life Path Number', description: 'Core strengths and direction.', to: '/en/life-path-number' },
          { title: 'Daily Horoscope', description: 'Daily themes and guidance.', to: '/en/horoscope' }
        ]
      }
    }
  },
  {
    path: "/en/444-meaning",
    name: "en-444-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tools',
      title: '444 Angel Number Meaning | Stability & Protection | StarLoom',
      description: 'What does 444 mean? Explore common interpretations of the 444 angel number for stability, protection, and building strong foundations—plus practical next steps.',
      keywords: '444 meaning, 444 angel number meaning, 444 spiritual meaning, 444 stability',
      locale: 'en',
      landing: {
        heroTitle: '444 Angel Number Meaning',
        intro: '444 is often linked with stability, support, and building strong foundations. Use it as a prompt to simplify and strengthen what matters.',
        highlights: [
          'Foundation and stability theme',
          'Support + protection interpretation',
          'Practical next steps to reduce chaos'
        ],
        faqs: [
          { q: 'Is 444 a warning?', a: 'It is often interpreted as reassurance: slow down, stay consistent, and focus on the basics.' },
          { q: 'What should I do when I see 444?', a: 'Pick one foundation: health, money, work, or relationships—then take one concrete action to strengthen it.' }
        ],
        primaryCta: { text: 'Try a Tarot Reading', to: '/en/tarot' },
        secondaryCta: { text: 'Explore Angel Numbers', to: '/en/angel-numbers' },
        related: [
          { title: '222 Meaning', description: 'Balance and partnership.', to: '/en/222-meaning' },
          { title: 'Personal Year Number', description: 'Themes of your year.', to: '/en/personal-year' }
        ]
      }
    }
  },
  {
    path: "/en/555-meaning",
    name: "en-555-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tools',
      title: '555 Angel Number Meaning | Change & Transformation | StarLoom',
      description: 'What does 555 mean? Explore common meanings of 555 for change, transformation, and new opportunities—plus how to respond in love and career.',
      keywords: '555 meaning, 555 angel number meaning, 555 change meaning, 555 transformation',
      locale: 'en',
      landing: {
        heroTitle: '555 Angel Number Meaning',
        intro: '555 is often linked with change and transformation. Use it as a prompt to release what no longer fits and choose your next direction.',
        highlights: [
          'Change and opportunity theme',
          'Decision-making prompts for love and career',
          'Simple steps to embrace a new chapter'
        ],
        faqs: [
          { q: 'Does 555 mean a big change is coming?', a: 'Many people interpret it that way. Use it to prepare: simplify, communicate clearly, and stay flexible.' },
          { q: 'What should I do when I see 555?', a: 'Identify one change you have been avoiding and take a small action toward it today.' }
        ],
        primaryCta: { text: 'Try a Tarot Reading', to: '/en/tarot' },
        secondaryCta: { text: 'Explore Angel Numbers', to: '/en/angel-numbers' },
        related: [
          { title: '111 Meaning', description: 'Fresh starts and focus.', to: '/en/111-meaning' },
          { title: 'Mercury Retrograde Guide', description: 'Review and revise cycles.', to: '/en/mercury-retrograde' }
        ]
      }
    }
  },
  {
    path: "/en/777-meaning",
    name: "en-777-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tools',
      title: '777 Angel Number Meaning | Spiritual Growth & Alignment | StarLoom',
      description: 'What does 777 mean? Explore common interpretations of 777 for spiritual growth, alignment, and inner wisdom—plus reflective prompts for next steps.',
      keywords: '777 meaning, 777 angel number meaning, 777 spiritual meaning, 777 alignment',
      locale: 'en',
      landing: {
        heroTitle: '777 Angel Number Meaning',
        intro: '777 is often linked with spiritual growth, alignment, and trusting your inner wisdom. Use it as a prompt to reflect and refine your path.',
        highlights: [
          'Spiritual alignment theme',
          'Reflection + learning focus',
          'Practical prompts to stay grounded'
        ],
        faqs: [
          { q: 'Is 777 a lucky number?', a: 'Many people see it as positive alignment. Use it to reinforce habits that support your growth.' },
          { q: 'What should I do when I see 777?', a: 'Take a quiet moment to review what is working, what you have learned, and one next step you will commit to.' }
        ],
        primaryCta: { text: 'Try a Tarot Reading', to: '/en/tarot' },
        secondaryCta: { text: 'Explore Numerology', to: '/en/numerology' },
        related: [
          { title: 'Life Path Number', description: 'Core lessons and direction.', to: '/en/life-path-number' },
          { title: 'Tarot Card Meanings', description: 'Keywords and reflections.', to: '/en/tarot/cards' }
        ]
      }
    }
  },
  {
    path: "/en/888-meaning",
    name: "en-888-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tools',
      title: '888 Angel Number Meaning | Abundance, Money & Balance | StarLoom',
      description: 'What does 888 mean? Explore common interpretations of 888 for abundance, money, balance, and karmic cycles—plus practical next steps.',
      keywords: '888 meaning, 888 angel number meaning, 888 money meaning, 888 abundance',
      locale: 'en',
      landing: {
        heroTitle: '888 Angel Number Meaning',
        intro: '888 is often linked with abundance, balance, and material flow. Use it as a prompt to align your values with your money and decisions.',
        highlights: [
          'Abundance and balance theme',
          'Money and value-alignment prompts',
          'Practical steps for consistent growth'
        ],
        faqs: [
          { q: 'Is 888 a sign of money coming?', a: 'Many people interpret it that way. Use it as a reminder to manage what you have well and choose consistent actions.' },
          { q: 'What should I do when I see 888?', a: 'Review one money habit (spending, saving, pricing, negotiation) and improve one small step today.' }
        ],
        primaryCta: { text: 'Try Numerology', to: '/en/numerology' },
        secondaryCta: { text: 'Explore Angel Numbers', to: '/en/angel-numbers' },
        related: [
          { title: '555 Meaning', description: 'Change and transformation.', to: '/en/555-meaning' },
          { title: 'Personal Year Number', description: 'Themes of your year ahead.', to: '/en/personal-year' }
        ]
      }
    }
  },
  {
    path: "/en/999-meaning",
    name: "en-999-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tools',
      title: '999 Angel Number Meaning | Endings, Closure & New Beginnings | StarLoom',
      description: 'What does 999 mean? Explore common meanings of 999 for endings, closure, forgiveness, and stepping into a new chapter—plus reflection prompts.',
      keywords: '999 meaning, 999 angel number meaning, 999 spiritual meaning, 999 new beginnings',
      locale: 'en',
      landing: {
        heroTitle: '999 Angel Number Meaning',
        intro: '999 is often linked with endings and completion. Use it as a prompt to release what is done, make peace, and prepare for a new chapter.',
        highlights: [
          'Closure and completion theme',
          'Letting go and forgiveness prompts',
          'Action steps to start a new chapter'
        ],
        faqs: [
          { q: 'Does 999 mean something is ending?', a: 'Many people interpret it as completion. Use it to review what is no longer aligned and decide what to close gracefully.' },
          { q: 'What should I do when I see 999?', a: 'Write down one thing you are ready to complete, then take one concrete action to close it (message, decision, plan, cleanup).' }
        ],
        primaryCta: { text: 'Try a Tarot Reading', to: '/en/tarot' },
        secondaryCta: { text: 'Explore Angel Numbers', to: '/en/angel-numbers' },
        related: [
          { title: '111 Meaning', description: 'Fresh starts and intention.', to: '/en/111-meaning' },
          { title: '777 Meaning', description: 'Alignment and inner wisdom.', to: '/en/777-meaning' }
        ]
      }
    }
  },
  {
    path: "/en/1010-meaning",
    name: "en-1010-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tools',
      title: '1010 Angel Number Meaning | Alignment & New Opportunities | StarLoom',
      description: 'What does 1010 mean? Learn common interpretations of the 1010 angel number for alignment, growth, and new opportunities—plus next steps.',
      keywords: '1010 meaning, 1010 angel number meaning, 1010 spiritual meaning, 1010 new opportunities',
      locale: 'en',
      landing: {
        heroTitle: '1010 Angel Number Meaning',
        intro: '1010 is often linked with alignment and stepping into a new level of growth. Use it as a prompt to simplify and move forward with intention.',
        highlights: [
          'Alignment + growth theme',
          'Confidence and direction prompts',
          'Practical steps for momentum'
        ],
        faqs: [
          { q: 'Is 1010 a positive sign?', a: 'Many people interpret it as encouragement and alignment. Use it to pick a direction and commit to consistent action.' },
          { q: 'What should I do when I see 1010?', a: 'Choose one goal, remove one distraction, and do one meaningful step today.' }
        ],
        primaryCta: { text: 'Try a Tarot Reading', to: '/en/tarot' },
        secondaryCta: { text: 'Explore Numerology', to: '/en/numerology' },
        related: [
          { title: '111 Meaning', description: 'Focus and intention.', to: '/en/111-meaning' },
          { title: 'Life Path Number', description: 'Your core direction.', to: '/en/life-path-number' }
        ]
      }
    }
  },
  {
    path: "/en/1212-meaning",
    name: "en-1212-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tools',
      title: '1212 Angel Number Meaning | Growth, Faith & Next Level | StarLoom',
      description: 'What does 1212 mean? Explore common 1212 angel number meanings for growth, faith, and positive change—plus reflection prompts for next steps.',
      keywords: '1212 meaning, 1212 angel number meaning, 1212 love meaning, 1212 spiritual meaning',
      locale: 'en',
      landing: {
        heroTitle: '1212 Angel Number Meaning',
        intro: '1212 is often linked with growth and a “next level” mindset—release doubts and take aligned steps forward.',
        highlights: [
          'Growth and faith theme',
          'Mindset + action alignment prompts',
          'Simple steps to build consistency'
        ],
        faqs: [
          { q: 'What does 1212 mean in love?', a: 'Many interpret it as growth in relationships: communicate clearly, choose balance, and take mature next steps.' },
          { q: 'What should I do when I see 1212?', a: 'Pick one belief that limits you, rewrite it into an empowering one, then take one action that matches it.' }
        ],
        primaryCta: { text: 'Try a Love Tarot Reading', to: '/en/tarot-love-reading' },
        secondaryCta: { text: 'Explore Angel Numbers', to: '/en/angel-numbers' },
        related: [
          { title: '222 Meaning', description: 'Balance and relationships.', to: '/en/222-meaning' },
          { title: '555 Meaning', description: 'Change and transformation.', to: '/en/555-meaning' }
        ]
      }
    }
  },
  {
    path: "/en/1313-meaning",
    name: "en-1313-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tools',
      title: '1313 Angel Number Meaning | Resilience, Creativity & Rebuild | StarLoom',
      description: 'What does 1313 mean? Learn common interpretations of the 1313 angel number for resilience, creativity, and rebuilding after change—plus next steps.',
      keywords: '1313 meaning, 1313 angel number meaning, 1313 spiritual meaning, 1313 change meaning',
      locale: 'en',
      landing: {
        heroTitle: '1313 Angel Number Meaning',
        intro: '1313 is often linked with rebuilding and creative resilience. Use it as a prompt to restructure what is not working and try a new approach.',
        highlights: [
          'Rebuild and resilience theme',
          'Creative problem-solving prompts',
          'Practical steps to regain stability'
        ],
        faqs: [
          { q: 'Is 1313 a warning?', a: 'Some people interpret it as a “pay attention” prompt. Use it to review habits and choose a smarter structure.' },
          { q: 'What should I do when I see 1313?', a: 'Pick one area (work/health/relationship), identify one weak structure, and improve it with one clear rule or routine.' }
        ],
        primaryCta: { text: 'Try a Tarot Reading', to: '/en/tarot' },
        secondaryCta: { text: 'Explore Numerology', to: '/en/numerology' },
        related: [
          { title: '444 Meaning', description: 'Foundations and stability.', to: '/en/444-meaning' },
          { title: '333 Meaning', description: 'Creativity and growth.', to: '/en/333-meaning' }
        ]
      }
    }
  },
  {
    path: "/en/1414-meaning",
    name: "en-1414-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tools',
      title: '1414 Angel Number Meaning | Focus, Discipline & Goals | StarLoom',
      description: 'What does 1414 mean? Explore common meanings of 1414 for focus, discipline, and goal-setting—plus practical next steps to build momentum.',
      keywords: '1414 meaning, 1414 angel number meaning, 1414 goals meaning, 1414 discipline',
      locale: 'en',
      landing: {
        heroTitle: '1414 Angel Number Meaning',
        intro: '1414 is often linked with focus and disciplined action. Use it as a prompt to simplify priorities and build momentum through routine.',
        highlights: [
          'Focus and discipline theme',
          'Goal-setting prompts',
          'Consistency and routine actions'
        ],
        faqs: [
          { q: 'What does 1414 mean spiritually?', a: 'Many interpret it as a reminder to align intention with action—less scattered effort, more consistent execution.' },
          { q: 'What should I do when I see 1414?', a: 'Choose one priority, define one daily habit, and track it for 7 days.' }
        ],
        primaryCta: { text: 'Try Numerology', to: '/en/numerology' },
        secondaryCta: { text: 'Explore Angel Numbers', to: '/en/angel-numbers' },
        related: [
          { title: '111 Meaning', description: 'Intention and focus.', to: '/en/111-meaning' },
          { title: '888 Meaning', description: 'Abundance and balance.', to: '/en/888-meaning' }
        ]
      }
    }
  },
  {
    path: "/en/life-path-1-meaning",
    name: "en-life-path-1-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-numerology',
      title: 'Life Path 1 Meaning | Leader, Independence & Growth | StarLoom',
      description: 'Life Path 1 meaning: leadership, independence, and initiative. Learn strengths, challenges, love/career themes, and practical growth tips.',
      keywords: 'life path 1 meaning, life path 1 numerology, numerology 1 meaning',
      locale: 'en',
      landing: {
        heroTitle: 'Life Path 1 Meaning',
        intro: 'Life Path 1 is often linked with leadership, independence, and starting new paths. Your lesson is confident action without isolation.',
        highlights: [
          'Strengths: initiative, courage, originality',
          'Challenges: impatience, ego, loneliness',
          'Best focus: build healthy confidence + consistency'
        ],
        faqs: [
          { q: 'What careers suit Life Path 1?', a: 'Entrepreneurship, leadership roles, self-directed work, and careers where you can innovate and take initiative.' },
          { q: 'How can Life Path 1 grow in relationships?', a: 'Practice listening, collaboration, and showing vulnerability while keeping healthy independence.' }
        ],
        primaryCta: { text: 'Calculate Your Numbers', to: '/en/numerology' },
        secondaryCta: { text: 'Life Path Number Calculator', to: '/en/life-path-number' },
        related: [
          { title: 'Life Path 2 Meaning', description: 'Balance, partnership, sensitivity.', to: '/en/life-path-2-meaning' },
          { title: 'Destiny Number', description: 'Name-based talents and direction.', to: '/en/destiny-number' }
        ]
      }
    }
  },
  {
    path: "/en/life-path-2-meaning",
    name: "en-life-path-2-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-numerology',
      title: 'Life Path 2 Meaning | Harmony, Partnership & Intuition | StarLoom',
      description: 'Life Path 2 meaning: harmony, partnership, and intuition. Learn strengths, challenges, love/career themes, and growth tips.',
      keywords: 'life path 2 meaning, life path 2 numerology, numerology 2 meaning',
      locale: 'en',
      landing: {
        heroTitle: 'Life Path 2 Meaning',
        intro: 'Life Path 2 is often linked with harmony, cooperation, and emotional intelligence. Your lesson is healthy boundaries and self-trust.',
        highlights: [
          'Strengths: diplomacy, empathy, intuition',
          'Challenges: people-pleasing, indecision, sensitivity',
          'Best focus: boundaries + clear communication'
        ],
        faqs: [
          { q: 'What careers suit Life Path 2?', a: 'Counseling, HR, mediation, design, healing, and roles requiring collaboration and emotional insight.' },
          { q: 'What is the shadow of Life Path 2?', a: 'Avoiding conflict, losing yourself in others, or overthinking decisions instead of trusting your inner signal.' }
        ],
        primaryCta: { text: 'Calculate Your Numbers', to: '/en/numerology' },
        secondaryCta: { text: 'Life Path Number Calculator', to: '/en/life-path-number' },
        related: [
          { title: 'Life Path 1 Meaning', description: 'Leadership and independence.', to: '/en/life-path-1-meaning' },
          { title: 'Personal Year Number', description: 'Your year theme and focus.', to: '/en/personal-year' }
        ]
      }
    }
  },
  {
    path: "/en/life-path-3-meaning",
    name: "en-life-path-3-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-numerology',
      title: 'Life Path 3 Meaning | Creativity, Expression & Joy | StarLoom',
      description: 'Life Path 3 meaning: creativity, self-expression, and joy. Learn strengths, challenges, love/career themes, and practical tips.',
      keywords: 'life path 3 meaning, life path 3 numerology, numerology 3 meaning',
      locale: 'en',
      landing: {
        heroTitle: 'Life Path 3 Meaning',
        intro: 'Life Path 3 is often linked with creativity, communication, and joy. Your lesson is focus and follow-through.',
        highlights: [
          'Strengths: expression, optimism, charm',
          'Challenges: scattered energy, avoidance, insecurity',
          'Best focus: create consistently + ship your work'
        ],
        faqs: [
          { q: 'What careers suit Life Path 3?', a: 'Writing, media, marketing, teaching, performance, design—any path that uses communication and creativity.' },
          { q: 'How does Life Path 3 grow?', a: 'Choose one creative lane, commit to practice, and build routines that protect your focus.' }
        ],
        primaryCta: { text: 'Calculate Your Numbers', to: '/en/numerology' },
        secondaryCta: { text: 'Try a Tarot Reading', to: '/en/tarot' },
        related: [
          { title: 'Life Path 5 Meaning', description: 'Freedom and change.', to: '/en/life-path-5-meaning' },
          { title: '333 Meaning', description: 'Creativity and growth prompts.', to: '/en/333-meaning' }
        ]
      }
    }
  },
  {
    path: "/en/life-path-4-meaning",
    name: "en-life-path-4-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-numerology',
      title: 'Life Path 4 Meaning | Stability, Discipline & Foundations | StarLoom',
      description: 'Life Path 4 meaning: stability, discipline, and building strong foundations. Learn strengths, challenges, and growth tips.',
      keywords: 'life path 4 meaning, life path 4 numerology, numerology 4 meaning',
      locale: 'en',
      landing: {
        heroTitle: 'Life Path 4 Meaning',
        intro: 'Life Path 4 is often linked with structure, discipline, and building. Your lesson is steady progress without rigidity.',
        highlights: [
          'Strengths: reliability, practicality, endurance',
          'Challenges: stubbornness, fear of change, burnout',
          'Best focus: sustainable routines + flexibility'
        ],
        faqs: [
          { q: 'What careers suit Life Path 4?', a: 'Operations, engineering, finance, project management, craftsmanship—anything requiring structure and steady execution.' },
          { q: 'How can Life Path 4 avoid burnout?', a: 'Build rest into the system: realistic timelines, delegation, and recovery routines.' }
        ],
        primaryCta: { text: 'Calculate Your Numbers', to: '/en/numerology' },
        secondaryCta: { text: 'Life Path Number Calculator', to: '/en/life-path-number' },
        related: [
          { title: '444 Meaning', description: 'Stability and foundations.', to: '/en/444-meaning' },
          { title: '1414 Meaning', description: 'Discipline and goals.', to: '/en/1414-meaning' }
        ]
      }
    }
  },
  {
    path: "/en/life-path-5-meaning",
    name: "en-life-path-5-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-numerology',
      title: 'Life Path 5 Meaning | Freedom, Change & Adventure | StarLoom',
      description: 'Life Path 5 meaning: freedom, change, and adventure. Learn strengths, challenges, love/career themes, and growth tips.',
      keywords: 'life path 5 meaning, life path 5 numerology, numerology 5 meaning',
      locale: 'en',
      landing: {
        heroTitle: 'Life Path 5 Meaning',
        intro: 'Life Path 5 is often linked with freedom, change, and exploration. Your lesson is wise risk-taking and healthy boundaries.',
        highlights: [
          'Strengths: adaptability, curiosity, courage',
          'Challenges: impulsiveness, restlessness, inconsistency',
          'Best focus: freedom with structure'
        ],
        faqs: [
          { q: 'What careers suit Life Path 5?', a: 'Sales, travel, entrepreneurship, media, consulting—paths with variety and movement.' },
          { q: 'What is the shadow of Life Path 5?', a: 'Chasing novelty to avoid discomfort. Growth comes from choosing aligned change, not constant escape.' }
        ],
        primaryCta: { text: 'Calculate Your Numbers', to: '/en/numerology' },
        secondaryCta: { text: 'Personal Year Number', to: '/en/personal-year' },
        related: [
          { title: '555 Meaning', description: 'Change and transformation.', to: '/en/555-meaning' },
          { title: 'Mercury Retrograde', description: 'Review and revise cycles.', to: '/en/mercury-retrograde' }
        ]
      }
    }
  },
  {
    path: "/en/life-path-6-meaning",
    name: "en-life-path-6-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-numerology',
      title: 'Life Path 6 Meaning | Love, Responsibility & Care | StarLoom',
      description: 'Life Path 6 meaning: love, responsibility, and care. Learn strengths, challenges, relationship themes, and growth tips.',
      keywords: 'life path 6 meaning, life path 6 numerology, numerology 6 meaning',
      locale: 'en',
      landing: {
        heroTitle: 'Life Path 6 Meaning',
        intro: 'Life Path 6 is often linked with love, service, and responsibility. Your lesson is giving without overgiving.',
        highlights: [
          'Strengths: nurturing, loyalty, harmony-building',
          'Challenges: control, perfectionism, martyrdom',
          'Best focus: boundaries + self-care'
        ],
        faqs: [
          { q: 'What careers suit Life Path 6?', a: 'Teaching, counseling, healthcare, design, community leadership—roles centered on care and improvement.' },
          { q: 'How does Life Path 6 grow in love?', a: 'Choose partners who reciprocate. Communicate needs clearly and allow others to carry responsibility too.' }
        ],
        primaryCta: { text: 'Calculate Your Numbers', to: '/en/numerology' },
        secondaryCta: { text: 'Try a Love Tarot Reading', to: '/en/tarot-love-reading' },
        related: [
          { title: 'Zodiac Compatibility', description: 'Relationship strengths and challenges.', to: '/en/compatibility' },
          { title: '222 Meaning', description: 'Balance in relationships.', to: '/en/222-meaning' }
        ]
      }
    }
  },
  {
    path: "/en/life-path-7-meaning",
    name: "en-life-path-7-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-numerology',
      title: 'Life Path 7 Meaning | Wisdom, Intuition & Inner Growth | StarLoom',
      description: 'Life Path 7 meaning: wisdom, intuition, and inner growth. Learn strengths, challenges, and practical tips for balance.',
      keywords: 'life path 7 meaning, life path 7 numerology, numerology 7 meaning',
      locale: 'en',
      landing: {
        heroTitle: 'Life Path 7 Meaning',
        intro: 'Life Path 7 is often linked with analysis, intuition, and spiritual depth. Your lesson is trust + connection without isolation.',
        highlights: [
          'Strengths: insight, research, intuition',
          'Challenges: withdrawal, skepticism, overthinking',
          'Best focus: grounded spirituality + relationships'
        ],
        faqs: [
          { q: 'What careers suit Life Path 7?', a: 'Research, data, psychology, strategy, writing, spiritual study—paths that reward depth and insight.' },
          { q: 'How can Life Path 7 feel less lonely?', a: 'Share your inner world with trusted people, and build routines that include community.' }
        ],
        primaryCta: { text: 'Calculate Your Numbers', to: '/en/numerology' },
        secondaryCta: { text: 'Try a Tarot Reading', to: '/en/tarot' },
        related: [
          { title: '777 Meaning', description: 'Alignment and inner wisdom.', to: '/en/777-meaning' },
          { title: 'Moon Sign', description: 'Emotional needs and inner world.', to: '/en/moon-sign' }
        ]
      }
    }
  },
  {
    path: "/en/life-path-8-meaning",
    name: "en-life-path-8-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-numerology',
      title: 'Life Path 8 Meaning | Power, Money & Mastery | StarLoom',
      description: 'Life Path 8 meaning: power, money, and mastery. Learn strengths, challenges, love/career themes, and practical growth tips.',
      keywords: 'life path 8 meaning, life path 8 numerology, numerology 8 meaning',
      locale: 'en',
      landing: {
        heroTitle: 'Life Path 8 Meaning',
        intro: 'Life Path 8 is often linked with ambition, material mastery, and leadership. Your lesson is integrity, balance, and wise use of power.',
        highlights: [
          'Strengths: leadership, strategy, execution',
          'Challenges: control, workaholism, fear of loss',
          'Best focus: money with values + balance'
        ],
        faqs: [
          { q: 'What careers suit Life Path 8?', a: 'Business, finance, leadership, operations, management—paths where you can build systems and scale results.' },
          { q: 'How does Life Path 8 stay balanced?', a: 'Define success beyond money: health, relationships, meaning—and build a schedule that protects them.' }
        ],
        primaryCta: { text: 'Calculate Your Numbers', to: '/en/numerology' },
        secondaryCta: { text: 'Personal Year Number', to: '/en/personal-year' },
        related: [
          { title: '888 Meaning', description: 'Abundance and balance prompts.', to: '/en/888-meaning' },
          { title: 'Life Path 4 Meaning', description: 'Foundations and discipline.', to: '/en/life-path-4-meaning' }
        ]
      }
    }
  },
  {
    path: "/en/life-path-9-meaning",
    name: "en-life-path-9-meaning-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-numerology',
      title: 'Life Path 9 Meaning | Compassion, Purpose & Completion | StarLoom',
      description: 'Life Path 9 meaning: compassion, purpose, and completion. Learn strengths, challenges, love/career themes, and growth tips.',
      keywords: 'life path 9 meaning, life path 9 numerology, numerology 9 meaning',
      locale: 'en',
      landing: {
        heroTitle: 'Life Path 9 Meaning',
        intro: 'Life Path 9 is often linked with compassion, purpose, and closure. Your lesson is helping without losing yourself.',
        highlights: [
          'Strengths: empathy, wisdom, big-picture vision',
          'Challenges: overgiving, idealism, difficulty letting go',
          'Best focus: boundaries + purpose-driven action'
        ],
        faqs: [
          { q: 'What careers suit Life Path 9?', a: 'Humanitarian work, teaching, counseling, arts, mission-driven leadership—paths focused on impact and meaning.' },
          { q: 'How can Life Path 9 avoid burnout?', a: 'Practice boundaries, choose sustainable causes, and remember that rest is part of service.' }
        ],
        primaryCta: { text: 'Calculate Your Numbers', to: '/en/numerology' },
        secondaryCta: { text: 'Try a Tarot Reading', to: '/en/tarot' },
        related: [
          { title: '999 Meaning', description: 'Endings and new beginnings.', to: '/en/999-meaning' },
          { title: 'Life Path Number Calculator', description: 'Calculate your life path number.', to: '/en/life-path-number' }
        ]
      }
    }
  },
  {
    path: "/en/venus-sign",
    name: "en-venus-sign-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-astrology',
      title: 'Venus Sign Calculator & Meaning | Love Style in Astrology | StarLoom',
      description: 'Discover your Venus sign and what it means for love, attraction, relationships, and values. Learn how to interpret it with your chart.',
      keywords: 'venus sign, venus sign meaning, venus sign calculator, venus in astrology love',
      locale: 'en',
      landing: {
        heroTitle: 'Venus Sign Meaning',
        intro: 'Your Venus sign reflects how you love, what you value, and what you are drawn to in relationships, beauty, and pleasure.',
        highlights: [
          'Love style + attraction patterns',
          'Values and relationship needs',
          'How Venus works with Sun/Moon/Rising'
        ],
        faqs: [
          { q: 'Is Venus sign more important than Sun sign for love?', a: 'Venus is very relevant for love style, while Sun is core identity. Together they give a fuller picture.' },
          { q: 'How do I find my Venus sign?', a: 'You need your birth date, time, and location for the most accurate chart. A birth chart calculator can show Venus placement.' }
        ],
        primaryCta: { text: 'Birth Chart Calculator', to: '/en/birth-chart' },
        secondaryCta: { text: 'Zodiac Compatibility', to: '/en/compatibility' },
        related: [
          { title: 'Rising Sign', description: 'First impressions and approach.', to: '/en/rising-sign' },
          { title: 'Moon Sign', description: 'Emotional needs in love.', to: '/en/moon-sign' }
        ]
      }
    }
  },
  {
    path: "/en/mars-sign",
    name: "en-mars-sign-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-astrology',
      title: 'Mars Sign Meaning | Drive, Desire & Energy in Astrology | StarLoom',
      description: 'Learn what your Mars sign means for motivation, desire, conflict style, and how you pursue goals. Simple, beginner-friendly guide.',
      keywords: 'mars sign meaning, mars sign, mars in astrology, mars sign calculator',
      locale: 'en',
      landing: {
        heroTitle: 'Mars Sign Meaning',
        intro: 'Your Mars sign reflects how you take action, pursue goals, handle conflict, and express desire and drive.',
        highlights: [
          'Motivation and action style',
          'Conflict patterns + boundaries',
          'Energy management for goals'
        ],
        faqs: [
          { q: 'What is Mars sign used for?', a: 'It helps explain how you go after what you want—drive, passion, and how you respond to pressure.' },
          { q: 'How do I find my Mars sign?', a: 'Use a birth chart calculator with date/time/location for accurate planetary placements.' }
        ],
        primaryCta: { text: 'Birth Chart Calculator', to: '/en/birth-chart' },
        secondaryCta: { text: 'Daily Horoscope', to: '/en/horoscope' },
        related: [
          { title: 'Mercury Retrograde', description: 'Communication and planning cycles.', to: '/en/mercury-retrograde' },
          { title: 'How to Read a Birth Chart', description: 'Planets and houses explained.', to: '/en/how-to-read-a-birth-chart' }
        ]
      }
    }
  },
  {
    path: "/en/saturn-return",
    name: "en-saturn-return-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-astrology',
      title: 'Saturn Return Meaning | What It Is & How to Navigate It | StarLoom',
      description: 'Learn what a Saturn return is in astrology, when it happens, common themes, and practical tips to navigate responsibility, growth, and life changes.',
      keywords: 'saturn return meaning, what is saturn return, saturn return age, saturn return astrology',
      locale: 'en',
      landing: {
        heroTitle: 'Saturn Return Meaning',
        intro: 'Saturn return is a major life milestone often linked with maturity, responsibility, and restructuring. It can feel intense—but it helps you build long-term stability.',
        highlights: [
          'Why it feels like a “life reset”',
          'Common themes: career, commitment, boundaries',
          'Practical tips: simplify, commit, rebuild'
        ],
        faqs: [
          { q: 'When does Saturn return happen?', a: 'Typically around ages 27–31 (first), 56–60 (second), and 84–90 (third), depending on your exact chart.' },
          { q: 'Is Saturn return always bad?', a: 'Not necessarily. It often brings pressure, but it can create long-term stability by pushing you to make mature choices.' }
        ],
        primaryCta: { text: 'Birth Chart Calculator', to: '/en/birth-chart' },
        secondaryCta: { text: 'Try a Tarot Reading', to: '/en/tarot' },
        related: [
          { title: 'How to Read a Birth Chart', description: 'Planets, houses, aspects basics.', to: '/en/how-to-read-a-birth-chart' },
          { title: 'Personal Year Number', description: 'Your year theme and focus.', to: '/en/personal-year' }
        ]
      }
    }
  },
  {
    path: "/en/synastry-compatibility",
    name: "en-synastry-compatibility-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-compatibility',
      title: 'Synastry Compatibility | What It Is & How It Works | StarLoom',
      description: 'Learn what synastry is in astrology, how compatibility is compared between two charts, and what placements to check first for relationships.',
      keywords: 'synastry compatibility, synastry meaning, astrology compatibility chart, relationship astrology',
      locale: 'en',
      landing: {
        heroTitle: 'Synastry Compatibility',
        intro: 'Synastry compares two birth charts to explore relationship dynamics—communication, attraction, emotional needs, and growth lessons.',
        highlights: [
          'What to check first (Sun/Moon/Venus/Mars)',
          'Why timing and patterns matter',
          'How to use it for healthier relationships'
        ],
        faqs: [
          { q: 'Is synastry more accurate than zodiac sign compatibility?', a: 'It is usually deeper because it compares full charts, not only Sun signs.' },
          { q: 'What do I need for synastry?', a: 'Both people’s birth date, time, and location for best accuracy.' }
        ],
        primaryCta: { text: 'Zodiac Compatibility (Quick)', to: '/en/compatibility' },
        secondaryCta: { text: 'Birth Chart Calculator', to: '/en/birth-chart' },
        related: [
          { title: 'Venus Sign', description: 'Love style and attraction patterns.', to: '/en/venus-sign' },
          { title: 'Mars Sign', description: 'Desire and conflict style.', to: '/en/mars-sign' }
        ]
      }
    }
  },
  {
    path: "/en/celtic-cross-tarot-spread",
    name: "en-celtic-cross-spread-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tarot',
      title: 'Celtic Cross Tarot Spread | Positions & How to Read It | StarLoom',
      description: 'Learn the Celtic Cross tarot spread: what each position means, how to interpret the story, and tips for clearer readings. Beginner-friendly guide.',
      keywords: 'celtic cross tarot spread, celtic cross spread positions, how to read celtic cross, tarot spreads',
      locale: 'en',
      landing: {
        heroTitle: 'Celtic Cross Tarot Spread',
        intro: 'The Celtic Cross is a classic 10-card spread used for deeper guidance. Learn the positions and how to connect them into one story.',
        highlights: [
          '10 positions explained simply',
          'How to connect cards into a story',
          'Tips to avoid confusion'
        ],
        faqs: [
          { q: 'Is Celtic Cross too hard for beginners?', a: 'It can be, but you can learn it step-by-step. Start with the core cross (first 6 cards) before adding the staff.' },
          { q: 'What questions fit Celtic Cross?', a: 'Complex situations: relationships, career direction, decisions with many moving parts.' }
        ],
        primaryCta: { text: 'Start a Tarot Reading', to: '/en/tarot' },
        secondaryCta: { text: 'Tarot Spreads for Beginners', to: '/en/tarot-spreads-for-beginners' },
        related: [
          { title: 'Free Tarot Reading Online', description: 'Instant AI interpretation.', to: '/en/tarot-reading' },
          { title: 'Tarot Card Meanings', description: 'Keywords and reflections.', to: '/en/tarot/cards' }
        ]
      }
    }
  },
  {
    path: "/en/three-card-tarot-spread",
    name: "en-three-card-spread-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tarot',
      title: '3 Card Tarot Spread | Meaning, Positions & Examples | StarLoom',
      description: 'Learn the 3 card tarot spread: popular position formats (past/present/future, situation/action/outcome) and how to interpret it clearly.',
      keywords: '3 card tarot spread, three card tarot spread meaning, past present future tarot, situation action outcome tarot',
      locale: 'en',
      landing: {
        heroTitle: '3 Card Tarot Spread',
        intro: 'The 3-card spread is simple and powerful. Use it for clarity and next steps with flexible position meanings.',
        highlights: [
          'Past / Present / Future explained',
          'Situation / Action / Outcome explained',
          'Beginner-friendly interpretation tips'
        ],
        faqs: [
          { q: 'Which 3-card format should I use?', a: 'Use past/present/future for timelines. Use situation/action/outcome for decisions and practical guidance.' },
          { q: 'How do I get clearer answers?', a: 'Ask specific questions and focus on what you can do next instead of trying to predict everything.' }
        ],
        primaryCta: { text: 'Start a Tarot Reading', to: '/en/tarot' },
        secondaryCta: { text: 'Tarot Card Meanings', to: '/en/tarot/cards' },
        related: [
          { title: 'Yes or No Tarot', description: 'Quick 1-card guidance.', to: '/en/tarot-yes-no' },
          { title: 'How to Do a Tarot Reading', description: 'Step-by-step beginner guide.', to: '/en/how-to-do-a-tarot-reading' }
        ]
      }
    }
  },
  ...extraAngelNumberRoutes,
  ...destinyMeaningRoutes,
  ...personalYearMeaningRoutes,
  ...compatibilityMatrixRoutes,
  {
    path: "/en/zodiac-compatibility",
    name: "en-zodiac-compatibility-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-compatibility',
      title: 'Zodiac Compatibility Calculator | Love Match for Any Signs | StarLoom',
      description: 'Check zodiac compatibility for any two signs. Get strengths, challenges, and a quick score. Free and easy to use.',
      keywords: 'zodiac compatibility, zodiac love compatibility, astrology compatibility, star sign compatibility',
      locale: 'en',
      landing: {
        heroTitle: 'Zodiac Compatibility Calculator',
        intro: 'Compare two zodiac signs and explore how the relationship can work best: strengths, challenges, and a quick score.',
        highlights: [
          'Fast compatibility score',
          'Strengths and challenges explained',
          'Good for dating and relationship reflection'
        ],
        faqs: [
          { q: 'Is zodiac compatibility accurate?', a: 'It is a helpful starting point. Full compatibility depends on the whole birth chart.' }
        ],
        primaryCta: { text: 'Check Compatibility', to: '/en/compatibility' },
        secondaryCta: { text: 'Try a Love Tarot Reading', to: '/en/tarot-love-reading' },
        related: [
          { title: 'Daily Horoscope', description: 'Daily love and life guidance.', to: '/en/horoscope' },
          { title: 'Birth Chart', description: 'Explore full chart compatibility later.', to: '/en/birth-chart' }
        ]
      }
    }
  },
  {
    path: "/en/spiritual-guidance",
    name: "en-spiritual-tools-landing",
    component: SeoLanding,
    meta: {
      seoKey: 'western-tools',
      title: 'Spiritual Guidance Tools | Chakra Quiz, Crystals & More | StarLoom',
      description: 'Explore free spiritual tools: chakra quiz, crystal guide, affirmation generator, meditation timer, and moon phase insights.',
      keywords: 'spiritual tools, chakra quiz, crystal guide, affirmation generator, meditation timer, moon phase',
      locale: 'en',
      landing: {
        heroTitle: 'Spiritual Guidance Tools',
        intro: 'Try free spiritual tools designed for clarity, grounding, and self-discovery—quick, calming, and practical.',
        highlights: [
          'Chakra quiz with balancing tips',
          'Crystal guide for intention setting',
          'Affirmations and meditation tools'
        ],
        faqs: [
          { q: 'Which tool should I start with?', a: 'If you want clarity, start with tarot. For grounding, try meditation. For energy awareness, try the chakra quiz.' }
        ],
        primaryCta: { text: 'Explore Tools', to: '/en/tools' },
        secondaryCta: { text: 'Start Tarot Reading', to: '/en/tarot' },
        related: [
          { title: 'Chakra Quiz', description: 'Check your chakra balance.', to: '/en/tools/chakra-quiz' },
          { title: 'Crystal Guide', description: 'Find crystals by intention.', to: '/en/tools/crystal-guide' },
          { title: 'Affirmation Generator', description: 'Daily affirmations for focus and confidence.', to: '/en/tools/affirmation-generator' },
          { title: 'Moon Phase Tool', description: 'Explore moon phases and meanings.', to: '/en/tools/moon-phase' }
        ]
      }
    }
  },
  {
    path: "/en/privacy-policy",
    name: "en-privacy-policy",
    component: SeoLanding,
    meta: {
      title: 'Privacy Policy | StarLoom',
      description: 'Read StarLoom\'s privacy policy to understand what data we collect, how we use it, and your choices.',
      keywords: 'privacy policy, data privacy, cookies, StarLoom',
      locale: 'en',
      landing: {
        heroTitle: 'Privacy Policy',
        intro: 'This page explains what information we collect, how we use it, and your rights and choices. If you have questions, contact us.',
        highlights: [
          'We may collect basic usage data (e.g., page views) to improve the website',
          'We may use cookies for functionality and analytics',
          'Advertising partners may use cookies to show relevant ads'
        ],
        faqs: [
          { q: 'Do you use cookies?', a: 'We may use cookies for site functionality, analytics, and advertising. You can control cookies through your browser settings.' },
          { q: 'Do you sell personal data?', a: 'We do not sell personal data. We may share limited data with service providers to operate the website.' },
          { q: 'How can I contact you about privacy?', a: 'Use the contact page and describe your request. We will respond as soon as possible.' }
        ],
        primaryCta: { text: 'Contact', to: '/en/contact' },
        related: [
          { title: 'Terms of Service', description: 'Rules and conditions for using StarLoom.', to: '/en/terms' },
          { title: 'About', description: 'Learn more about StarLoom.', to: '/en/about' }
        ]
      }
    }
  },
  {
    path: "/en/terms",
    name: "en-terms",
    component: SeoLanding,
    meta: {
      title: 'Terms of Service | StarLoom',
      description: 'Review StarLoom\'s terms of service, including usage rules, disclaimers, and limitations of liability.',
      keywords: 'terms of service, terms, disclaimer, StarLoom',
      locale: 'en',
      landing: {
        heroTitle: 'Terms of Service',
        intro: 'By using StarLoom, you agree to these terms. Please read them carefully.',
        highlights: [
          'StarLoom provides guidance and educational content; it is not professional advice',
          'You are responsible for how you use the information provided',
          'We may update these terms from time to time'
        ],
        faqs: [
          { q: 'Is StarLoom medical, legal, or financial advice?', a: 'No. The content is for informational and entertainment purposes and should not replace professional advice.' },
          { q: 'Can I rely on a tarot reading as a guarantee?', a: 'No. Readings are reflective guidance and do not guarantee outcomes.' }
        ],
        primaryCta: { text: 'Read Privacy Policy', to: '/en/privacy-policy' },
        related: [
          { title: 'Privacy Policy', description: 'How we handle data and cookies.', to: '/en/privacy-policy' },
          { title: 'Contact', description: 'Get in touch with questions.', to: '/en/contact' }
        ]
      }
    }
  },
  {
    path: "/en/about",
    name: "en-about",
    component: SeoLanding,
    meta: {
      title: 'About StarLoom | Tarot, Astrology & Numerology',
      description: 'StarLoom helps you explore tarot, astrology, numerology, and spiritual tools with clear, modern guidance.',
      keywords: 'about StarLoom, tarot, astrology, numerology, spiritual tools',
      locale: 'en',
      landing: {
        heroTitle: 'About StarLoom',
        intro: 'StarLoom is a modern spiritual guidance platform. We build simple tools and guides to help you reflect, gain clarity, and take your next step.',
        highlights: [
          'Tarot readings with practical next-step suggestions',
          'Astrology and numerology tools for self-discovery',
          'Beginner-friendly content with clear explanations'
        ],
        faqs: [
          { q: 'Who is StarLoom for?', a: 'Anyone looking for reflection, clarity, and gentle guidance—beginners and experienced readers alike.' },
          { q: 'Is it free?', a: 'Many tools and pages are free to use. We may display ads to support the site.' }
        ],
        primaryCta: { text: 'Explore Tarot', to: '/en/tarot' },
        secondaryCta: { text: 'Tarot Card Meanings', to: '/en/tarot/cards' },
        related: [
          { title: 'Spiritual Tools', description: 'Chakra quiz, crystals, affirmations and more.', to: '/en/tools' },
          { title: 'Contact', description: 'Reach out with questions or feedback.', to: '/en/contact' }
        ]
      }
    }
  },
  {
    path: "/en/contact",
    name: "en-contact",
    component: SeoLanding,
    meta: {
      title: 'Contact StarLoom | Support & Feedback',
      description: 'Contact StarLoom for support, feedback, or partnership inquiries. We\'ll respond as soon as possible.',
      keywords: 'contact StarLoom, support, feedback, partnership',
      locale: 'en',
      landing: {
        heroTitle: 'Contact',
        intro: 'For support, feedback, or partnerships, email us at zachjianjian@gmail.com. Please include the page URL and a short description of your issue or request.',
        highlights: [
          'Support and bug reports',
          'Feedback and feature requests',
          'Partnership and media inquiries'
        ],
        faqs: [
          { q: 'How long does it take to get a reply?', a: 'We typically respond within a few business days.' },
          { q: 'What should I include in my message?', a: 'Include the page URL, your device/browser, and what you expected to happen.' }
        ],
        primaryCta: { text: 'Email us', to: 'mailto:zachjianjian@gmail.com' },
        related: [
          { title: 'Privacy Policy', description: 'Data and cookie information.', to: '/en/privacy-policy' },
          { title: 'Terms of Service', description: 'Usage rules and disclaimers.', to: '/en/terms' }
        ]
      }
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
    path: "/en/tools/chakra-quiz",
    name: "western-tools-chakra-quiz",
    component: ChakraQuizTool,
    meta: {
      locale: 'en'
    }
  },
  {
    path: "/en/tools/crystal-guide",
    name: "western-tools-crystal-guide",
    component: CrystalGuideTool,
    meta: {
      locale: 'en'
    }
  },
  {
    path: "/en/tools/affirmation-generator",
    name: "western-tools-affirmation",
    component: AffirmationTool,
    meta: {
      locale: 'en'
    }
  },
  {
    path: "/en/tools/meditation-timer",
    name: "western-tools-meditation-timer",
    component: MeditationTimerTool,
    meta: {
      locale: 'en'
    }
  },
  {
    path: "/en/tools/energy-reading",
    name: "western-tools-energy-reading",
    component: EnergyReadingTool,
    meta: {
      locale: 'en'
    }
  },
  {
    path: "/en/tools/moon-phase",
    name: "western-tools-moon-phase",
    component: MoonCalendarTool,
    meta: {
      locale: 'en'
    }
  },
  {
    path: "/en/tools/personal-year",
    name: "western-tools-personal-year",
    component: PersonalYearTool,
    meta: {
      locale: 'en'
    }
  },
  {
    path: "/en/tools/rising-sign",
    name: "western-tools-rising-sign",
    component: RisingSignTool,
    meta: {
      locale: 'en'
    }
  },
  {
    path: "/en/compatibility",
    name: "western-compatibility",
    component: ZodiacCompatibility,
    meta: {
      seoKey: 'western-compatibility',
      title: 'Zodiac Compatibility Calculator | StarLoom',
      description: 'Check love compatibility for any two zodiac signs. Free, fast, and mobile-friendly.',
      locale: 'en'
    }
  },
  {
    path: "/en/compatibility/:signA/:signB",
    name: "western-compatibility-detail",
    component: ZodiacCompatibilityDetail,
    meta: {
      seoKey: 'western-compatibility-detail',
      title: 'Zodiac Compatibility | StarLoom',
      description: 'Compatibility insights for two zodiac signs: strengths, challenges, and a quick score.',
      locale: 'en'
    }
  },
  {
    path: "/en/tarot/cards",
    name: "western-tarot-cards",
    component: TarotCards,
    meta: {
      seoKey: 'western-tarot-cards',
      title: 'Tarot Card Meanings (Major & Minor Arcana) | StarLoom',
      description: 'Browse tarot card meanings, keywords, upright and reversed interpretations. Free and easy to read.',
      locale: 'en'
    }
  },
  {
    path: "/en/tarot/cards/:slug",
    name: "western-tarot-card-detail",
    component: TarotCardDetail,
    meta: {
      seoKey: 'western-tarot-card-detail',
      title: 'Tarot Card Meaning | StarLoom',
      description: 'Learn tarot card meanings, keywords, upright and reversed interpretations, and quick reflections.',
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
