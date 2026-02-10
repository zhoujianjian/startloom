import axios from 'axios';
const baseUrl = import.meta.env.VITE_APP_BASE_API
const instance = axios.create({
  baseURL: baseUrl,
  timeout: 500000,
  dataType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
});

const pendingRequests = new Map();

const getUserToken = () => {
  const raw = localStorage.getItem('starloomAI-token');
  if (!raw) return '';
  if (raw.trim().startsWith('{')) {
    try {
      const obj = JSON.parse(raw);
      return obj.userToken || '';
    } catch (e) {
      return '';
    }
  }
  return raw;
};

const getRequestKey = (config) => {
  const { method, url, params, data } = config;
  return `${method}${url}${JSON.stringify(params)}${JSON.stringify(data)}`;
};

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = getUserToken();
    console.log('🚀 请求拦截器 - 发送请求:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      token: token ? token.substring(0, 20) + '...' : 'null',
      headers: config.headers,
      baseURL: config.baseURL
    });
    
    const requestKey = getRequestKey(config);
    if (pendingRequests.has(requestKey)) {
      const cancelSource = pendingRequests.get(requestKey);
      cancelSource.cancel(`Duplicate request cancelled: ${requestKey}`);
      pendingRequests.delete(requestKey);
    }

    const cancelSource = axios.CancelToken.source();
    config.cancelToken = cancelSource.token;
    pendingRequests.set(requestKey, cancelSource);
    return config;
  },
  (error) => {
    console.error('❌ 请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    console.log('📨 响应拦截器 - 收到响应:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    
    const requestKey = getRequestKey(response.config);
    pendingRequests.delete(requestKey);
    
    if(response.data.code == 4001){
      console.log('🔒 检测到4001状态码，清除登录状态');
      store.commit('setLoginStatus',false);
    }
    
    return response;
  },
  (error) => {
    console.error('❌ 响应拦截器错误:', {
      message: error.message,
      config: error.config ? {
        url: error.config.url,
        method: error.config.method
      } : 'no config',
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'no response',
      isCancel: axios.isCancel(error)
    });
    
    if (axios.isCancel(error)) {
      console.log(`⚠️ 请求被取消: ${error.message}`);
    } else if (error.response && error.response.status === 401) {
      console.log('🚫 401未授权错误，检查token状态');
      const token = localStorage.getItem('starloomAI-token');
      console.log('🔑 当前token状态:', {
        hasToken: !!token,
        token: token ? token.substring(0, 20) + '...' : 'null'
      });
    }

    return Promise.reject(error);
  }
);

const request = async ({ method, url, data = null, params = null }) => {
  console.log('🌐 发起API请求:', {
    method,
    url,
    hasData: !!data,
    hasParams: !!params
  });
  
  if(method.toLowerCase() == 'get'){
    params={...params,...{
      // sourceFlag: localStorage.getItem('sourceFlag'),
    }}
  }
  if(method.toLowerCase() == 'post'){
    data={...data,...{
      // sourceFlag: localStorage.getItem('sourceFlag'),
    }}
  }
  
  try {
    const token = getUserToken();
    console.log('🔑 请求前token状态:', {
      hasToken: !!token,
      token: token ? token.substring(0, 20) + '...' : 'null'
    });
    
    const response = await instance({
        method,
        url,
        data,
        params,
        headers:{
          'Authorization': token || '',
        }
      });
    
    console.log('✅ API请求成功:', {
      url,
      method,
      responseData: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('💥 API请求失败:', {
      url,
      method,
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return error;
  }
};

export default request;
