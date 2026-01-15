/**
 * SEO 工具 - 动态设置页面 Meta 信息
 * 根据产品功能优化，覆盖14款免费工具
 */

// 网站基础信息
const SITE_NAME = '天机命理'
const SITE_URL = 'https://ibazi.site'

// 页面 SEO 配置 - 覆盖所有功能页面
export const SEO_CONFIG = {
  // 首页
  home: {
    title: '天机命理_免费八字排盘_周公解梦_姓名测试_生肖星座配对',
    description: '天机命理提供21款免费命理工具：八字排盘、周公解梦、姓名测试、生肖配对、星座配对、犯太岁查询、桃花运测试、财运测试、MBTI性格测试、宝宝起名、手机号测吉凶、黄道吉日查询等。资深命理师在线咨询。',
    keywords: '八字排盘,周公解梦,姓名测试,生肖配对,星座配对,犯太岁,桃花运,财运测试,MBTI,宝宝起名,手机号测吉凶,黄道吉日,万年历,今日运势,免费算命,天机命理'
  },
  
  // 八字排盘
  paipan: {
    title: '八字排盘_免费生辰八字排盘_四柱八字在线排盘_天机命理',
    description: '免费在线八字排盘工具，输入出生年月日时，自动生成四柱八字命盘。包含天干地支、十神、神煞、大运流年等详细信息，专业命理师解读您的命运格局。',
    keywords: '八字排盘,四柱八字,生辰八字排盘,免费排盘,八字命盘,天干地支,十神,大运流年,命理排盘,在线排盘'
  },
  
  // 八字合盘
  hepan: {
    title: '八字合婚_免费婚姻配对_男女八字合盘_天机命理',
    description: '免费八字合婚测试，输入男女双方生辰八字，分析婚姻匹配度、感情运势、婚后生活。专业命理师解读两人缘分深浅，助您找到命中注定的另一半。',
    keywords: '八字合婚,婚姻配对,八字合盘,姻缘测试,婚姻算命,男女配对,感情运势,结婚吉日,合婚测试'
  },
  
  // 万年历
  calendar: {
    title: '万年历_老黄历查询_农历阳历转换_今日宜忌_天机命理',
    description: '在线万年历查询工具，提供农历阳历转换、每日宜忌、黄道吉日、节气节日、生肖星座等信息。查结婚吉日、搬家吉日、开业吉日，一键查询。',
    keywords: '万年历,老黄历,农历查询,阳历转换,黄道吉日,今日宜忌,结婚吉日,搬家吉日,节气,生肖,日历查询'
  },
  
  // 天机问答（原AI问卦）
  divination: {
    title: '天机问答_在线问卦_星座运势_生肖运势_抽签算命_天机命理',
    description: '天机问答为您解答命理疑惑，提供星座运势、生肖运势、观音灵签、月老灵签、财神灵签、生日密码等服务。心诚则灵，为您指点迷津。',
    keywords: '天机问答,在线问卦,星座运势,生肖运势,抽签算命,观音灵签,月老灵签,财神灵签,生日密码,运势查询'
  },
  
  // 姓名测试
  nameTest: {
    title: '姓名测试打分_免费测名字_五格三才分析_天机命理',
    description: '免费姓名测试打分，根据五格剖象法分析姓名吉凶。综合天格、人格、地格、外格、总格，解读名字对事业、财运、感情的影响。',
    keywords: '姓名测试,测名字,姓名打分,五格分析,三才配置,名字吉凶,姓名学,起名测试'
  },
  
  // 宝宝起名
  babyName: {
    title: '宝宝起名_新生儿取名_五行起名_天机命理',
    description: '专业宝宝起名服务，根据生辰八字、五行喜用为宝宝取名。结合音韵、寓意、五行平衡，为您的宝宝取一个吉祥如意的好名字。',
    keywords: '宝宝起名,新生儿取名,五行起名,八字起名,取名字,婴儿起名,男宝宝名字,女宝宝名字'
  },
  
  // 公司起名
  companyName: {
    title: '公司起名_店铺取名_品牌命名_天机命理',
    description: '专业公司起名服务，结合行业五行、数理吉凶为企业取名。店铺取名、品牌命名、商标起名，助您事业兴旺、财源广进。',
    keywords: '公司起名,店铺取名,品牌命名,企业起名,商标起名,公司名字,店名大全'
  },
  
  // 周公解梦
  dream: {
    title: '周公解梦_免费解梦_梦境分析_天机命理',
    description: '免费周公解梦，输入梦境内容，为您解析梦境寓意。结合传统周公解梦与现代心理学，分析梦境吉凶、运势预兆。',
    keywords: '周公解梦,解梦,梦境分析,梦见什么,做梦,梦的含义,梦境预兆,免费解梦'
  },
  
  // 生肖配对
  zodiacMatch: {
    title: '生肖配对_十二生肖配对表_属相婚配_天机命理',
    description: '免费生肖配对测试，查看十二生肖配对指数。分析属相相合相冲，了解两人性格互补、感情运势、婚姻匹配度。',
    keywords: '生肖配对,十二生肖配对,属相配对,生肖婚配,属相相合,生肖相冲,属相婚姻'
  },
  
  // 星座配对
  constellationMatch: {
    title: '星座配对_十二星座配对指数_星座速配_天机命理',
    description: '免费星座配对测试，查看十二星座配对指数。分析两个星座的性格特点、相处模式、爱情运势，找到最适合你的星座伴侣。',
    keywords: '星座配对,十二星座配对,星座速配,星座爱情,星座匹配,星座运势,星座性格'
  },
  
  // 今日运势
  dailySign: {
    title: '今日运势_每日运势签_抽签算命_天机命理',
    description: '每日运势签，为您预测今日运势吉凶。包含事业运、财运、感情运、健康运等方面，开启美好的一天。',
    keywords: '今日运势,每日运势,运势签,抽签,今日运气,每日占卜,运势预测'
  },
  
  // 缘分测试
  fateTest: {
    title: '缘分测试_姓名缘分配对_爱情测试_天机命理',
    description: '免费缘分测试，输入双方姓名测试缘分指数。分析两人姓名配对、感情缘分、爱情运势，看看你们是否天生一对。',
    keywords: '缘分测试,姓名配对,爱情测试,缘分指数,情侣配对,姓名缘分,爱情占卜'
  },
  
  // 手机号测吉凶
  phoneTest: {
    title: '手机号测吉凶_号码吉凶查询_数字能量_天机命理',
    description: '免费手机号测吉凶，分析手机号码的数字能量、五行属性。了解号码对事业、财运、感情的影响，选择吉祥号码。',
    keywords: '手机号测吉凶,号码吉凶,数字能量,手机号码,吉祥号码,号码五行,电话号码测试'
  },
  
  // 车牌号测吉凶
  plateTest: {
    title: '车牌号测吉凶_车牌号码吉凶_选车牌_天机命理',
    description: '免费车牌号测吉凶，分析车牌号码的字母数字寓意、五行属性。选择吉祥车牌，保佑出行平安、一路顺风。',
    keywords: '车牌号测吉凶,车牌吉凶,选车牌,车牌号码,吉祥车牌,车牌五行'
  },
  
  // 前世今生
  pastLife: {
    title: '前世今生_前世测试_轮回转世_天机命理',
    description: '免费前世今生测试，根据姓名和生日推测前世身份、今生使命。探索灵魂的轮回之旅，了解命运的因果。',
    keywords: '前世今生,前世测试,轮回转世,前世身份,今生使命,灵魂测试'
  },
  
  // 黄道吉日
  luckyDay: {
    title: '黄道吉日_吉日查询_结婚吉日_搬家吉日_天机命理',
    description: '免费黄道吉日查询，提供结婚吉日、搬家吉日、开业吉日、出行吉日等。根据老黄历宜忌，选择最佳日期办大事。',
    keywords: '黄道吉日,吉日查询,结婚吉日,搬家吉日,开业吉日,出行吉日,老黄历,宜忌查询'
  },
  
  // 犯太岁查询
  taisui: {
    title: '犯太岁查询_2026年犯太岁生肖_化解太岁_天机命理',
    description: '免费犯太岁查询，查看2026年哪些生肖犯太岁。包含值太岁、冲太岁、刑太岁、害太岁、破太岁详解，提供化解方法和注意事项。',
    keywords: '犯太岁,太岁查询,2026犯太岁,化解太岁,值太岁,冲太岁,刑太岁,害太岁,破太岁,生肖运势'
  },
  
  // 桃花运测试
  peachBlossom: {
    title: '桃花运测试_2026年桃花运势_脱单指南_天机命理',
    description: '免费桃花运测试，根据生辰八字测算2026年桃花运势。分析桃花旺月、桃花位、脱单指数，助您早日遇见真爱。',
    keywords: '桃花运,桃花运测试,2026桃花运,脱单,感情运势,爱情运势,桃花位,姻缘测试'
  },
  
  // 财运测试
  wealthTest: {
    title: '财运测试_2026年财运运势_招财方法_天机命理',
    description: '免费财运测试，根据生辰八字测算2026年财运走势。分析正财运、偏财运、旺财月份，提供招财开运建议。',
    keywords: '财运测试,2026财运,财运运势,正财运,偏财运,招财,旺财,财运预测'
  },
  
  // 性格测试(MBTI)
  mbtiTest: {
    title: 'MBTI性格测试_16型人格测试_性格分析_天机命理',
    description: '免费MBTI性格测试，4道题快速测出你的16型人格类型。分析性格特点、职业倾向、恋爱风格，深入了解真实的自己。',
    keywords: 'MBTI,性格测试,16型人格,人格测试,性格分析,INFP,INTJ,ENFP,职业性格'
  },
  
  // 幸运数字
  luckyNumber: {
    title: '幸运数字查询_生日幸运数字_幸运颜色_天机命理',
    description: '免费幸运数字查询，根据生日计算专属幸运数字、幸运颜色、幸运方位。了解数字能量，提升个人运势。',
    keywords: '幸运数字,生日幸运数字,幸运颜色,幸运方位,数字能量,幸运日,开运数字'
  },
  
  // 生日花语
  birthdayFlower: {
    title: '生日花语_366天生日花_花语大全_天机命理',
    description: '免费查询生日花语，每一天都有专属的生日花。了解生日花的花语、传说、性格特点，送给TA最有意义的礼物。',
    keywords: '生日花语,生日花,花语大全,366天生日花,花的含义,生日礼物,花语查询'
  },
  
  // 家居风水
  fengshuiTest: {
    title: '家居风水测试_房屋风水分析_风水布局_天机命理',
    description: '免费家居风水测试，根据房屋朝向和楼层分析风水吉凶。提供财位、文昌位、桃花位布局建议，打造旺宅好风水。',
    keywords: '家居风水,房屋风水,风水测试,风水布局,财位,文昌位,桃花位,楼层风水,朝向风水'
  },
  
  // 学习课堂
  learn: {
    title: '命理知识_八字入门教程_风水学习_天机命理学堂',
    description: '系统学习命理知识，包含八字入门、四柱详解、十神分析、大运流年、风水布局等专业课程。从零基础到精通，成为命理高手。',
    keywords: '命理知识,八字入门,四柱八字教程,十神详解,风水学习,命理学堂,算命教程,易学入门'
  },
  
  // 文章详情
  article: {
    title: '命理文章_八字案例分析_天机命理',
    description: '精选命理文章，包含八字实战案例、名人命盘分析、风水布局技巧等内容。深入浅出，帮助您理解命理奥秘。',
    keywords: '命理文章,八字案例,命盘分析,风水文章,算命知识,命理分析'
  },
  
  // 大师咨询
  master: {
    title: '大师咨询_命理师在线_一对一解答_天机命理',
    description: '20年资深命理师在线咨询，提供八字精批、姻缘合婚、流年运势、事业财运等专业服务。新用户首次咨询立减50元，满意后再付款。',
    keywords: '大师咨询,命理师,在线咨询,八字精批,姻缘合婚,流年运势,事业财运,命理大师'
  }
}

/**
 * 设置页面 SEO 信息
 * @param {string} pageKey - 页面标识
 * @param {object} customMeta - 自定义 meta（用于文章详情等动态页面）
 */
export function setSEO(pageKey, customMeta = {}) {
  const config = SEO_CONFIG[pageKey] || SEO_CONFIG.home
  const title = customMeta.title || config.title
  const description = customMeta.description || config.description
  const keywords = customMeta.keywords || config.keywords
  
  // 设置 title
  document.title = title
  
  // 设置 meta description
  setMetaTag('name', 'description', description)
  
  // 设置 meta keywords
  setMetaTag('name', 'keywords', keywords)
  
  // 设置 Open Graph
  setMetaTag('property', 'og:title', title)
  setMetaTag('property', 'og:description', description)
  setMetaTag('property', 'og:url', window.location.href)
  
  // 设置 Twitter Card
  setMetaTag('name', 'twitter:title', title)
  setMetaTag('name', 'twitter:description', description)
}

/**
 * 设置 meta 标签
 */
function setMetaTag(attrName, attrValue, content) {
  let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attrName, attrValue)
    document.head.appendChild(meta)
  }
  meta.content = content
}

/**
 * 设置文章详情页 SEO
 */
export function setArticleSEO(article) {
  if (!article) return
  const title = `${article.title}_天机命理`
  const description = article.summary || article.content?.substring(0, 150) || article.title
  const keywords = article.tags ? `${article.tags},命理,八字,天机命理` : '命理文章,八字知识,天机命理'
  
  setSEO('article', { title, description, keywords })
  
  // 设置文章结构化数据
  setArticleStructuredData(article)
}

/**
 * 设置工具页面 SEO
 * @param {string} toolId - 工具ID
 */
export function setToolSEO(toolId) {
  const toolSEOMap = {
    'name-test': 'nameTest',
    'baby-name': 'babyName',
    'company-name': 'companyName',
    'dream': 'dream',
    'zodiac-match': 'zodiacMatch',
    'constellation-match': 'constellationMatch',
    'daily-sign': 'dailySign',
    'fate-test': 'fateTest',
    'phone-test': 'phoneTest',
    'plate-test': 'plateTest',
    'past-life': 'pastLife',
    'lucky-day': 'luckyDay',
    'wedding-day': 'luckyDay',
    'move-day': 'luckyDay',
    'taisui': 'taisui',
    'peach-blossom': 'peachBlossom',
    'wealth-test': 'wealthTest',
    'mbti-test': 'mbtiTest',
    'lucky-number': 'luckyNumber',
    'birthday-flower': 'birthdayFlower',
    'fengshui-test': 'fengshuiTest'
  }
  
  const pageKey = toolSEOMap[toolId] || 'home'
  setSEO(pageKey)
}

/**
 * 设置文章结构化数据
 */
function setArticleStructuredData(article) {
  removeStructuredData('Article')
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.summary || article.title,
    "author": {
      "@type": "Person",
      "name": article.author || SITE_NAME
    },
    "datePublished": article.publishTime || article.createdAt,
    "dateModified": article.updateTime || article.updatedAt,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/favicon.svg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  }
  
  if (article.coverImage) {
    structuredData.image = article.coverImage
  }
  
  addStructuredData(structuredData)
}

/**
 * 添加结构化数据 (JSON-LD)
 */
export function setStructuredData(type, data) {
  removeStructuredData(type)
  
  let structuredData = {}
  
  switch (type) {
    case 'website':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": SITE_NAME,
        "url": SITE_URL,
        "description": SEO_CONFIG.home.description,
        "inLanguage": "zh-CN",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${SITE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
      break
      
    case 'service':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "命理咨询",
        "name": data?.name || "大师一对一咨询",
        "provider": {
          "@type": "Organization",
          "name": SITE_NAME
        },
        "description": data?.description || "20年资深命理师提供专业命理咨询服务",
        "areaServed": "CN",
        "offers": data?.offers || {
          "@type": "Offer",
          "price": "99",
          "priceCurrency": "CNY"
        }
      }
      break
      
    case 'faq':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data?.questions?.map(q => ({
          "@type": "Question",
          "name": q.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": q.answer
          }
        })) || []
      }
      break
      
    case 'breadcrumb':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": data?.items?.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url
        })) || []
      }
      break
      
    default:
      structuredData = data
  }
  
  addStructuredData(structuredData)
}

/**
 * 添加结构化数据脚本
 */
function addStructuredData(data) {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  script.setAttribute('data-type', data['@type'])
  document.head.appendChild(script)
}

/**
 * 移除指定类型的结构化数据
 */
function removeStructuredData(type) {
  const scripts = document.querySelectorAll(`script[type="application/ld+json"][data-type="${type}"]`)
  scripts.forEach(script => script.remove())
}

/**
 * 设置面包屑导航结构化数据
 */
export function setBreadcrumb(items) {
  setStructuredData('breadcrumb', { items })
}

/**
 * 生成页面 canonical URL
 */
export function setCanonical(path = '') {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = `${SITE_URL}${path}`
}

export default {
  setSEO,
  setArticleSEO,
  setToolSEO,
  setStructuredData,
  setBreadcrumb,
  setCanonical,
  SEO_CONFIG
}
