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

const SeoLandingZh = () => import("../page/SeoLandingZh.vue")

const makeZhLandingRoute = ({ path, name, title, description, keywords, landing }) => ({
  path,
  name,
  component: SeoLandingZh,
  meta: {
    seoKey: 'home',
    title,
    description,
    keywords,
    landing
  }
})

const baziTopicRoutes = [
  {
    slug: 'bazi-ru-men',
    title: '八字入门_新手快速看懂四柱八字_天机命理',
    description: '八字入门教程：什么是四柱八字？如何看天干地支、五行十神与大运流年。新手也能快速理解八字基础。',
    keywords: '八字入门,四柱八字,天干地支,八字基础,命盘怎么看,八字教程',
    hero: '八字入门：新手快速看懂四柱八字',
    intro: '用最简单的方式理解四柱八字：天干地支、五行十神、大运流年，以及如何用八字做人生规划。'
  },
  {
    slug: 'shi-shen-jie-du',
    title: '十神详解_比肩劫财食神伤官正偏财官杀印_天机命理',
    description: '十神详解：比肩、劫财、食神、伤官、正财、偏财、正官、七杀、正印、偏印的含义与性格/事业/感情解读。',
    keywords: '十神详解,比肩,劫财,食神,伤官,正财,偏财,正官,七杀,正印,偏印',
    hero: '十神详解：一篇看懂八字十神',
    intro: '十神是八字解读的核心语言。用十神看性格、事业、财运、感情与人际关系。'
  },
  {
    slug: 'wu-xing-qiang-ruo',
    title: '五行强弱怎么看_八字五行平衡与补救建议_天机命理',
    description: '五行强弱怎么看？从八字看金木水火土的旺衰与平衡，并给出简单的五行补救思路与注意事项。',
    keywords: '五行强弱,八字五行,五行平衡,五行补救,五行缺什么',
    hero: '五行强弱怎么看？',
    intro: '学会判断五行旺衰与平衡，是理解喜用神、职业方向和生活取舍的重要一步。'
  },
  {
    slug: 'xi-yong-shen',
    title: '喜用神是什么_如何从八字找喜用神_天机命理',
    description: '喜用神是什么？如何从八字判断喜神与用神，并用在职业选择、起名用字、生活取舍与运势规划中。',
    keywords: '喜用神,用神,喜神,八字用神,如何找喜用神,八字分析',
    hero: '喜用神是什么？如何找喜用神',
    intro: '喜用神常用于指导“往哪里发力”。你可以把它理解为：对你最有帮助的能量与方向。'
  },
  {
    slug: 'da-yun-liu-nian',
    title: '大运流年怎么看_运势周期与关键年份判断_天机命理',
    description: '大运流年怎么看？了解运势周期的基本规律，如何判断关键年份、机会与挑战，并给出实用的规划建议。',
    keywords: '大运流年,大运怎么看,流年运势,关键年份,运势周期',
    hero: '大运流年怎么看？',
    intro: '大运是阶段趋势，流年是当年主题。把两者结合，可以更清晰地理解运势节奏。'
  },
  {
    slug: 'hun-yin-he-hun',
    title: '八字合婚怎么看_婚姻匹配度与相处建议_天机命理',
    description: '八字合婚怎么看？从命盘角度分析婚姻匹配度、相处模式与冲突点，给出更落地的相处建议。',
    keywords: '八字合婚,婚姻配对,合婚怎么看,姻缘,婚姻匹配度',
    hero: '八字合婚怎么看？',
    intro: '合婚不是简单打分，更重要的是看相处结构：沟通、边界、价值观与现实协作。'
  },
  {
    slug: 'shi-ye-cai-yun',
    title: '事业财运怎么看_八字看工作方向与赚钱能力_天机命理',
    description: '事业财运怎么看？从八字角度理解职业倾向、赚钱方式与风险点，帮助你做更稳的职业与财务决策。',
    keywords: '事业财运,八字看事业,八字看财运,赚钱能力,职业方向',
    hero: '事业财运怎么看？',
    intro: '把八字当成“优势与风险提示”。更重要的是找到适合你的赚钱方式与职业结构。'
  },
  {
    slug: 'tao-hua-yuan',
    title: '桃花运怎么看_八字感情运势与提升建议_天机命理',
    description: '桃花运怎么看？从八字角度理解感情运势、桃花期与择偶偏好，并给出更现实的提升建议。',
    keywords: '桃花运,感情运势,八字看桃花,姻缘运,脱单建议',
    hero: '桃花运怎么看？',
    intro: '桃花运不仅是“有没有人喜欢”，更是你如何建立关系、如何相处与如何选择。'
  },
  {
    slug: 'fan-tai-sui',
    title: '犯太岁是什么意思_如何查询与化解建议_天机命理',
    description: '犯太岁是什么意思？值太岁、冲太岁、刑太岁、害太岁、破太岁分别代表什么？附简单化解思路与注意事项。',
    keywords: '犯太岁,值太岁,冲太岁,刑太岁,害太岁,破太岁,化解太岁',
    hero: '犯太岁是什么意思？',
    intro: '犯太岁更像“年度压力主题”。重点是提前做风险管理与节奏调整，而不是恐慌。'
  },
  {
    slug: 'ba-zi-chang-jian-wen-da',
    title: '八字常见问题汇总_新手最关心的10个问题_天机命理',
    description: '八字常见问题汇总：生辰八字怎么看？缺五行怎么办？大运流年怎么用？新手最关心的问题一次讲清楚。',
    keywords: '八字常见问题,生辰八字怎么看,八字缺五行怎么办,大运流年怎么用,喜用神',
    hero: '八字常见问题汇总',
    intro: '把高频问题一次讲清楚，帮助你更高效地使用八字排盘与运势分析。'
  },
].map((x) =>
  makeZhLandingRoute({
    path: `/zhuanti/${x.slug}`,
    name: `zhuanti-${x.slug}`,
    title: x.title,
    description: x.description,
    keywords: x.keywords,
    landing: {
      heroTitle: x.hero,
      intro: x.intro,
      highlights: ['结构化讲解，适合新手', '结合实际生活决策', '可直接跳转到对应工具测算'],
      faqs: [
        { q: '需要提供哪些信息？', a: '一般需要出生年月日时（尽量准确到时辰）以及出生地。' },
        { q: '这类内容适合做什么？', a: '适合作为学习与自我规划参考，再结合个人现实条件做决策。' },
      ],
      primaryCta: { text: '立即八字排盘', to: '/paipan' },
      secondaryCta: { text: '查看学习课堂', to: '/learn' },
      related: [
        { title: '五行查询', description: '快速查看五行属性与补救建议。', to: '/tool/wuxing' },
        { title: '犯太岁查询', description: '查看今年是否犯太岁与注意事项。', to: '/tool/taisui' },
        { title: '大师咨询', description: '需要更专业解读可咨询大师。', to: '/master' },
      ]
    }
  })
)

const dreamKeywords = [
  { slug: 'she', kw: '蛇', title: '梦见蛇', desc: '梦见蛇是什么意思？' },
  { slug: 'diao-ya', kw: '掉牙', title: '梦见掉牙', desc: '梦见掉牙预示什么？' },
  { slug: 'huai-yun', kw: '怀孕', title: '梦见怀孕', desc: '梦见怀孕代表什么？' },
  { slug: 'qian-ren', kw: '前任', title: '梦见前任', desc: '梦见前任意味着什么？' },
  { slug: 'kao-shi', kw: '考试', title: '梦见考试', desc: '梦见考试与压力有关吗？' },
  { slug: 'shui', kw: '水', title: '梦见水', desc: '梦见水的象征含义？' },
  { slug: 'huo', kw: '火', title: '梦见火', desc: '梦见火代表什么？' },
  { slug: 'si-ren', kw: '死人', title: '梦见死人', desc: '梦见死人吉凶怎么看？' },
  { slug: 'gui', kw: '鬼', title: '梦见鬼', desc: '梦见鬼是怎么回事？' },
  { slug: 'zhui', kw: '被追', title: '梦见被追', desc: '梦见被追代表逃避或焦虑？' },
  { slug: 'fei', kw: '飞', title: '梦见飞', desc: '梦见飞象征自由吗？' },
  { slug: 'diao-xia', kw: '掉下去', title: '梦见掉下去', desc: '梦见掉下去预示什么？' },
  { slug: 'xue', kw: '血', title: '梦见血', desc: '梦见血是好是坏？' },
  { slug: 'gou', kw: '狗', title: '梦见狗', desc: '梦见狗代表朋友或忠诚？' },
  { slug: 'mao', kw: '猫', title: '梦见猫', desc: '梦见猫是什么意思？' },
  { slug: 'lao-shu', kw: '老鼠', title: '梦见老鼠', desc: '梦见老鼠预示什么？' },
  { slug: 'yu', kw: '鱼', title: '梦见鱼', desc: '梦见鱼与财运有关吗？' },
  { slug: 'zhu', kw: '猪', title: '梦见猪', desc: '梦见猪象征什么？' },
  { slug: 'hu', kw: '老虎', title: '梦见老虎', desc: '梦见老虎代表压力或力量？' },
  { slug: 'shi-zi', kw: '狮子', title: '梦见狮子', desc: '梦见狮子象征权威吗？' },
  { slug: 'ma', kw: '马', title: '梦见马', desc: '梦见马象征事业与行动？' },
  { slug: 'che', kw: '车', title: '梦见车', desc: '梦见车代表人生方向？' },
  { slug: 'fang-zi', kw: '房子', title: '梦见房子', desc: '梦见房子象征自我与家庭？' },
  { slug: 'ban-jia', kw: '搬家', title: '梦见搬家', desc: '梦见搬家代表变化？' },
  { slug: 'jie-hun', kw: '结婚', title: '梦见结婚', desc: '梦见结婚是好事吗？' },
  { slug: 'sheng-bing', kw: '生病', title: '梦见生病', desc: '梦见生病预示什么？' },
  { slug: 'yi-yuan', kw: '医院', title: '梦见医院', desc: '梦见医院代表修复与疗愈？' },
  { slug: 'qian', kw: '钱', title: '梦见钱', desc: '梦见钱与现实焦虑有关吗？' },
  { slug: 'diu-dong-xi', kw: '丢东西', title: '梦见丢东西', desc: '梦见丢东西代表失控感？' },
  { slug: 'zhao-bu-dao-lu', kw: '迷路', title: '梦见迷路', desc: '梦见迷路代表方向感缺失？' },
  { slug: 'da-ren', kw: '打人', title: '梦见打人', desc: '梦见打人代表情绪释放？' },
  { slug: 'bei-da', kw: '被打', title: '梦见被打', desc: '梦见被打代表压力与委屈？' },
  { slug: 'ku', kw: '哭', title: '梦见哭', desc: '梦见哭是情绪释放吗？' },
  { slug: 'xiao', kw: '笑', title: '梦见笑', desc: '梦见笑象征什么？' },
  { slug: 'si-wang', kw: '死亡', title: '梦见死亡', desc: '梦见死亡代表结束与重生？' },
  { slug: 'shang-xue', kw: '上学', title: '梦见上学', desc: '梦见上学与成长有关吗？' },
  { slug: 'lao-shi', kw: '老师', title: '梦见老师', desc: '梦见老师代表规则与指导？' },
  { slug: 'tong-shi', kw: '同事', title: '梦见同事', desc: '梦见同事代表工作压力？' },
  { slug: 'ling-dao', kw: '领导', title: '梦见领导', desc: '梦见领导代表权威与压力？' },
  { slug: 'shou-ji', kw: '手机', title: '梦见手机', desc: '梦见手机代表沟通与连接？' },
  { slug: 'yao-si', kw: '钥匙', title: '梦见钥匙', desc: '梦见钥匙象征机会？' },
  { slug: 'shu', kw: '树', title: '梦见树', desc: '梦见树象征成长？' },
  { slug: 'hua', kw: '花', title: '梦见花', desc: '梦见花象征关系与美好？' },
  { slug: 'yu-san', kw: '雨伞', title: '梦见雨伞', desc: '梦见雨伞代表保护？' },
  { slug: 'yu', kw: '下雨', title: '梦见下雨', desc: '梦见下雨代表情绪释放？' },
  { slug: 'xue-tian', kw: '下雪', title: '梦见下雪', desc: '梦见下雪象征什么？' },
  { slug: 'feng', kw: '风', title: '梦见风', desc: '梦见风代表变化？' },
  { slug: 'shan', kw: '山', title: '梦见山', desc: '梦见山代表目标与压力？' },
  { slug: 'hai', kw: '海', title: '梦见海', desc: '梦见海代表潜意识？' },
]

const dreamTopicRoutes = dreamKeywords.map((x) =>
  makeZhLandingRoute({
    path: `/zhuanti/meng-jian-${x.slug}`,
    name: `zhuanti-meng-jian-${x.slug}`,
    title: `${x.title}是什么意思_${x.desc}_周公解梦_天机命理`,
    description: `${x.title}是什么意思？这里提供更清晰的梦境象征解读、常见情境拆解与现实建议，并可直接使用周公解梦工具进一步解析。`,
    keywords: `${x.title},${x.title}是什么意思,${x.title}预示什么,周公解梦,梦境解析,梦的含义`,
    landing: {
      heroTitle: `${x.title}是什么意思？`,
      intro: '梦境更像潜意识的“情绪与需求提示”。你可以把它当作一种自我观察工具，而不是绝对的吉凶预言。',
      highlights: ['常见象征含义拆解', '结合现实情境给出建议', '可继续使用周公解梦工具输入细节'],
      faqs: [
        { q: '梦一定代表吉凶吗？', a: '不一定。很多梦与压力、情绪、近期经历有关。更重要的是结合你的现实处境理解。' },
        { q: '如何得到更准确的解读？', a: '把梦里的关键元素（人物、地点、情绪、动作）写下来，并在解梦工具里补充细节。' },
      ],
      primaryCta: { text: '立即周公解梦', to: '/tool/dream' },
      secondaryCta: { text: '看更多工具', to: '/tools' },
      related: [
        { title: '今日运势', description: '抽取今日运势签文解读。', to: '/tool/daily-sign' },
        { title: '缘分测试', description: '测测你们的缘分指数。', to: '/tool/fate-test' },
        { title: '大师咨询', description: '需要深入解读可咨询大师。', to: '/master' },
      ]
    }
  })
)

const namingTopicRoutes = [
  {
    slug: 'xing-ming-da-fen',
    title: '姓名测试打分_五格三才怎么分析_天机命理',
    description: '姓名测试打分：了解五格三才的核心思路、常见误区与更实用的取名建议，并可直接使用姓名测试工具测评。',
    keywords: '姓名测试打分,五格三才,姓名学,名字吉凶,测名字,免费姓名测试',
    hero: '姓名测试打分：五格三才怎么分析？',
    primaryTo: '/tool/name-test',
    primaryText: '立即姓名测试'
  },
  {
    slug: 'bao-bao-qi-ming',
    title: '宝宝起名_结合八字五行取好名字_天机命理',
    description: '宝宝起名：结合生辰八字与五行喜用，提供更系统的取名思路与用字方向，并可直接使用宝宝起名工具生成名字建议。',
    keywords: '宝宝起名,新生儿取名,八字起名,五行起名,取名字,宝宝名字',
    hero: '宝宝起名：如何结合八字五行取好名字',
    primaryTo: '/tool/baby-name',
    primaryText: '立即宝宝起名'
  },
  {
    slug: 'gong-si-qi-ming',
    title: '公司起名_品牌命名与行业五行思路_天机命理',
    description: '公司起名：从行业属性、五行与数理角度梳理命名思路，帮助你筛选更顺口、更聚财、更易传播的品牌名。',
    keywords: '公司起名,品牌命名,店铺取名,企业起名,商标起名,公司名字',
    hero: '公司起名：品牌命名与行业五行思路',
    primaryTo: '/tool/company-name',
    primaryText: '立即公司起名'
  },
  {
    slug: 'ming-zi-zen-me-xuan',
    title: '名字怎么选_起名避坑与实用原则_天机命理',
    description: '名字怎么选？总结起名常见误区、发音/寓意/结构的实用原则，并给出更可执行的起名流程。',
    keywords: '名字怎么选,起名技巧,起名避坑,名字寓意,名字发音',
    hero: '名字怎么选？起名避坑与实用原则',
    primaryTo: '/tool/name-test',
    primaryText: '测测名字好不好'
  },
  {
    slug: 'wu-xing-yong-zi',
    title: '五行用字怎么选_起名用字方向与示例_天机命理',
    description: '五行用字怎么选？给出五行（金木水火土）常见用字方向与注意事项，并配合五行查询工具做更个性化的选择。',
    keywords: '五行用字,起名用字,五行取名,五行缺什么,五行补救',
    hero: '五行用字怎么选？起名用字方向与示例',
    primaryTo: '/tool/wuxing',
    primaryText: '先查五行属性'
  },
  {
    slug: 'san-cai-wu-ge',
    title: '三才五格是什么_姓名学基础与常见问题_天机命理',
    description: '三才五格是什么？用更好理解的方式讲清姓名学结构，并说明如何把“打分”转化为更实用的取名决策。',
    keywords: '三才五格,五格剖象,姓名学基础,姓名测试,名字打分',
    hero: '三才五格是什么？姓名学基础与常见问题',
    primaryTo: '/tool/name-test',
    primaryText: '立即姓名测试'
  },
  {
    slug: 'nan-bao-bao-ming-zi',
    title: '男宝宝名字推荐_取名思路与注意事项_天机命理',
    description: '男宝宝名字推荐：提供更系统的取名思路（音韵、寓意、结构与五行），并可使用宝宝起名工具生成更多备选。',
    keywords: '男宝宝名字,男孩起名,宝宝起名,男孩名字推荐,取名技巧',
    hero: '男宝宝名字推荐：取名思路与注意事项',
    primaryTo: '/tool/baby-name',
    primaryText: '生成男宝宝名字'
  },
  {
    slug: 'nv-bao-bao-ming-zi',
    title: '女宝宝名字推荐_温柔好听有寓意_天机命理',
    description: '女宝宝名字推荐：提供温柔、好听、有寓意的取名思路，并可使用宝宝起名工具快速生成备选名字组合。',
    keywords: '女宝宝名字,女孩起名,宝宝起名,女孩名字推荐,取名技巧',
    hero: '女宝宝名字推荐：温柔好听有寓意',
    primaryTo: '/tool/baby-name',
    primaryText: '生成女宝宝名字'
  },
  {
    slug: 'dian-pu-qu-ming',
    title: '店铺取名_门店起名思路与避坑_天机命理',
    description: '店铺取名：从定位、行业属性、音韵记忆与数理角度梳理命名思路，帮助你起一个更好传播的店名。',
    keywords: '店铺取名,店名大全,门店起名,品牌命名,公司起名',
    hero: '店铺取名：门店起名思路与避坑',
    primaryTo: '/tool/company-name',
    primaryText: '生成店铺名字'
  },
  {
    slug: 'ming-zi-ji-xiong',
    title: '名字吉凶怎么看_姓名测试打分的正确打开方式_天机命理',
    description: '名字吉凶怎么看？解释姓名测试打分的正确使用方式，避免“只看分数”的误区，让结果更能指导实际选择。',
    keywords: '名字吉凶,姓名测试,名字打分,测名字,姓名学',
    hero: '名字吉凶怎么看？姓名测试打分的正确打开方式',
    primaryTo: '/tool/name-test',
    primaryText: '立即测名字'
  },
].map((x) =>
  makeZhLandingRoute({
    path: `/zhuanti/${x.slug}`,
    name: `zhuanti-${x.slug}`,
    title: x.title,
    description: x.description,
    keywords: x.keywords,
    landing: {
      heroTitle: x.hero,
      intro: '起名/测名更适合做“筛选决策”，而不是迷信单一分数。结合发音、寓意、结构与个人需求，结果会更可靠。',
      highlights: ['清晰的取名思路与流程', '常见误区与避坑', '可直接跳转工具生成/测评'],
      faqs: [
        { q: '只看分数靠谱吗？', a: '不建议。更重要的是：是否顺口好记、寓意是否合适、结构是否协调，以及与个人需求是否匹配。' },
        { q: '起名需要提供哪些信息？', a: '宝宝起名一般需要出生日期与性别；公司/店铺起名需要行业与偏好风格。' },
      ],
      primaryCta: { text: x.primaryText, to: x.primaryTo },
      secondaryCta: { text: '查看工具箱', to: '/tools' },
      related: [
        { title: '五行查询', description: '先查五行属性再选用字方向。', to: '/tool/wuxing' },
        { title: '八字排盘', description: '起名常配合八字做参考。', to: '/paipan' },
        { title: '大师咨询', description: '需要更专业定制可咨询大师。', to: '/master' },
      ]
    }
  })
)

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
  ...baziTopicRoutes,
  ...dreamTopicRoutes,
  ...namingTopicRoutes,
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
  const hasCustomMeta = !!(to.meta?.title || to.meta?.description || to.meta?.keywords)
  if (seoKey || hasCustomMeta) {
    console.log('🔍 设置SEO:', { seoKey, hasCustomMeta });
    setSEO(seoKey || 'home', {
      title: to.meta?.title,
      description: to.meta?.description,
      keywords: to.meta?.keywords
    });
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
