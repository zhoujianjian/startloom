import request from './request';
export const mpcbot = async (data) => {
  return await request({ method: 'post', url: 'https://www.swftc.info/ai/mpcbot' ,data: data});
};

// 校验用户登录状态
export const checkLogin = async (data) => {
  return await request({ method: 'get', url: '/api/checkLogin' ,params: data});
};

// 用户登录 - 支持手机号/邮箱/微信号
export const userLogin = async (data) => {
  return await request({ method: 'post', url: '/api/userLogin' ,data: data});
};

// 简化注册 - 不需要验证码
export const simpleRegister = async (data) => {
  return await request({ method: 'post', url: '/api/simpleRegister' ,data: data});
};

// 获取邮件验证码
export const sendEmailCode = async (data) => {
  return await request({ method: 'post', url: '/api/sendEmailCode' ,data: data});
};

// 用户注册
export const register = async (data) => {
  return await request({ method: 'post', url: '/api/register' ,data: data});
};

// 用户登出
export const loginOut = async (data) => {
  return await request({ method: 'get', url: '/api/loginOut' ,params: data});
};

// 获取忘记密码邮件验证码
export const sendCodeResetPassword = async (data) => {
  return await request({ method: 'post', url: '/api/sendEmailCode4ResetPassword' ,data: data});
};

// 获取忘记密码单独校验邮件验证码
export const checkEmailCodeResetPassword = async (data) => {
  return await request({ method: 'post', url: '/api/checkEmailCode4ResetPassword' ,data: data});
};

// 重置密码
export const resetPassword = async (data) => {
  return await request({ method: 'post', url: '/api/resetPassword' ,data: data});
};



//获取聊天记录列表
export const getMsgGroupList = async (data) => {
  return await request({ method: 'get', url: '/api/chat/getMsgGroupList' ,params: data});
};

//获取聊天记录内容
export const getMessageList = async (data) => {
  return await request({ method: 'get', url: '/api/chat/getMessageList' ,params: data});
};

//删除聊天列表
export const delMsgGroupList = async (data) => {
  return await request({ method: 'post', url: '/api/chat/delMsgGroupList' ,data: data});
};



// 星座查询 星座运势 //√
export const xingzuoYunshi = async (data) => {
  return await request({ method: 'post', url: '/xingzuo/yunshi' ,data: data});
};

// 星座查询 生日花  //√
export const xingzuoShengrihua = async (data) => {
  return await request({ method: 'post', url: '/xingzuo/shengrihua' ,data: data});
};

// 星座查询 生日密码 // √
export const xingzuoShengrimima  = async (data) => {
  return await request({ method: 'post', url: '/xingzuo/shengrimima' ,data: data});
};

// 星座查询 生日书  // √
export const xingzuoShengrishu  = async (data) => {
  return await request({ method: 'post', url: '/xingzuo/shengrishu' ,data: data});
};

// 星座查询 星座查询  // √
export const xingzuoChaxun  = async (data) => {
  return await request({ method: 'post', url: '/xingzuo/chaxun' ,data: data});
};

// 生肖查询 √
export const shengxiaoQuery  = async (data) => {
  return await request({ method: 'post', url: '/shengxiao/query' ,data: data});
};

// 生肖运势 √
export const shengxiaoYunshi  = async (data) => {
  return await request({ method: 'post', url: 'shengxiao/yunshi' ,data: data});
};

// 星座排行获取文章列表 
export const xingzuoRankingList  = async (data) => {
  return await request({ method: 'post', url: '/xingzuo/ranking' ,data: data});
};

// 星座排行获取文章列表 
export const xingzuoRankingGet  = async (data) => {
  return await request({ method: 'post', url: '/xingzuo/ranking/get' ,data: data});
};

// 星座排行 文章检索 
export const xingzuoRankingQuestion  = async (data) => {
  return await request({ method: 'post', url: '/xingzuo/ranking/question' ,data: data});
};

// 测试出轨对象
export const xingzuoChugui  = async (data) => {
  return await request({ method: 'post', url: '/xingzuo/chugui' ,data: data});
};

// 星座血型性格
export const xingzuoXuexing  = async (data) => {
  return await request({ method: 'post', url: '/xingzuo/xuexing' ,data: data});
};

// 星座 48星区
export const queryConstellations48  = async (data) => {
  return await request({ method: 'post', url: '/xingzuo/48' ,data: data});
};

// 星座 下降星座
export const xingzuoXiajiang  = async (data) => {
  return await request({ method: 'post', url: '/xingzuo/xiajiang' ,data: data});
};

// 星座 上升星座
// export const xingzuoXiajiang  = async (data) => {
//   return await request({ method: 'post', url: '/xingzuo/xiajiang' ,data: data});
// };

// 星座 月亮星座
export const xingzuoYueliang  = async (data) => {
  return await request({ method: 'post', url: '/xingzuo/yueliang' ,data: data});
};

// gpt接口综合
export const GPTChat  = async (data) => {
  return await request({ method: 'post', url: '/chat' ,data: data});
};

// 分享聊天记录
export const setUserSharechat  = async (data) => {
  return await request({ method: 'post', url: '/api/user' ,data: data});
};

// 获取聊天记录
export const getUserSharechat = async (data) => {
  return await request({ method: 'get', url: '/api/user' ,params: data});
};

// 删除聊天记录
export const usermsgDelete  = async (data) => {
  return await request({ method: 'post', url: '/api/user/msg/del' ,data: data});
};

// 获取会员卡列表信息
export const payCardInfo  = async (data) => {
  return await request({ method: 'get', url: '/api/pay/card/info' ,params: data});
};

// 获取用户会员信息  
export const payAccount  = async (data) => {
  return await request({ method: 'get', url: '/api/pay/account' ,params: data});
};

//  chat接口改造
export const v1chat  = async (data) => {
  return await request({ method: 'post', url: '/v1/chat' ,data: data});
};

// ============ VIP会员相关接口 ============

// 获取会员套餐列表
export const getVipPlans = async () => {
  return await request({ method: 'get', url: '/api/vip/plans' });
};

// 获取会员权益对比表
export const getVipBenefits = async () => {
  return await request({ method: 'get', url: '/api/vip/benefits' });
};

// 获取用户会员信息
export const getVipInfo = async () => {
  return await request({ method: 'get', url: '/api/vip/info' });
};

// 创建VIP订单
export const createVipOrder = async (data) => {
  return await request({ method: 'post', url: '/api/vip/order/create', data: data });
};

// 支付VIP订单
export const payVipOrder = async (data) => {
  return await request({ method: 'post', url: '/api/vip/order/pay', data: data });
};

// 获取用户订单列表
export const getVipOrders = async () => {
  return await request({ method: 'get', url: '/api/vip/orders' });
};

// ============ 用户留言相关接口 ============

// 提交留言
export const submitFeedback = async (data) => {
  return await request({ method: 'post', url: '/api/feedback/submit', data: data });
};

// 获取用户留言列表
export const getFeedbackList = async (data) => {
  return await request({ method: 'get', url: '/api/feedback/list', params: data });
};

// 删除留言
export const deleteFeedback = async (data) => {
  return await request({ method: 'post', url: '/api/feedback/delete', data: data });
};

// ============ 支付相关接口 ============

// 获取支付选项
export const getPaymentOptions = async () => {
  return await request({ method: 'get', url: '/api/payment/options' });
};

// 创建支付订单
export const createPayOrder = async (data) => {
  return await request({ method: 'post', url: '/api/payment/create', data: data });
};

// 用户确认已支付
export const confirmPayment = async (data) => {
  return await request({ method: 'post', url: '/api/payment/confirm', data: data });
};

// ============ 支付管理接口（管理员） ============

// 获取待确认订单
export const getPendingOrders = async () => {
  return await request({ method: 'get', url: '/api/payment/admin/pending' });
};

// 管理员确认订单
export const adminConfirmOrder = async (data) => {
  return await request({ method: 'post', url: '/api/payment/admin/confirm', data: data });
};

// 获取支付配置
export const getPaymentConfig = async () => {
  return await request({ method: 'get', url: '/api/payment/admin/config' });
};

// 更新支付配置
export const updatePaymentConfig = async (data) => {
  return await request({ method: 'post', url: '/api/payment/admin/config', data: data });
};


// ============ 文章/学习课堂相关接口 ============

// 获取首页聚合数据
export const getArticleHome = async () => {
  return await request({ method: 'get', url: '/api/article/home' });
};

// 获取文章列表（分页）
export const getArticleList = async (data) => {
  return await request({ method: 'get', url: '/api/article/list', params: data });
};

// 获取文章详情
export const getArticleDetail = async (id) => {
  return await request({ method: 'get', url: `/api/article/detail/${id}` });
};

// 获取上一篇/下一篇文章
export const getArticleNav = async (id, categoryId) => {
  return await request({ method: 'get', url: `/api/article/nav/${id}`, params: { categoryId } });
};

// 获取推荐文章
export const getRecommendArticles = async (limit = 6) => {
  return await request({ method: 'get', url: '/api/article/recommend', params: { limit } });
};

// 获取热门文章
export const getHotArticles = async (limit = 10) => {
  return await request({ method: 'get', url: '/api/article/hot', params: { limit } });
};

// 获取最新文章
export const getLatestArticles = async (limit = 10) => {
  return await request({ method: 'get', url: '/api/article/latest', params: { limit } });
};

// 获取相关文章
export const getRelatedArticles = async (id, categoryId, limit = 5) => {
  return await request({ method: 'get', url: `/api/article/related/${id}`, params: { categoryId, limit } });
};

// 获取分类树
export const getCategoryTree = async () => {
  return await request({ method: 'get', url: '/api/article/categories/tree' });
};

// 获取所有分类
export const getAllCategories = async () => {
  return await request({ method: 'get', url: '/api/article/categories' });
};

// 获取子分类
export const getChildCategories = async (parentId) => {
  return await request({ method: 'get', url: `/api/article/categories/${parentId}/children` });
};

// 获取所有标签
export const getAllTags = async () => {
  return await request({ method: 'get', url: '/api/article/tags' });
};

// 获取热门标签
export const getHotTags = async (limit = 20) => {
  return await request({ method: 'get', url: '/api/article/tags/hot', params: { limit } });
};

// ============ 大师服务配置接口 ============

// 获取大师服务配置（服务列表+系统配置）
export const getMasterServiceConfig = async () => {
  return await request({ method: 'get', url: '/api/master/config' });
};

// 创建大师服务订单
export const createMasterOrder = async (data) => {
  return await request({ method: 'post', url: '/api/master/order/create', data: data });
};
