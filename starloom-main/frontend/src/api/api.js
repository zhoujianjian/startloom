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
