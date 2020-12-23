import axios from 'axios'
import {
  Loading,
  MessageBox
} from 'element-ui'
import store from '../store'
import {
  ACCESS_TOKEN_KEY,
  getToken
} from '@/utils/auth'

import {
  VERSION
} from '../../config/prod.env'

const APP_VERSION = 'backoffice-' + VERSION.replace(/\"/g, ''); // 当前应用版本
const API_VERSION = 'backoffice-0.0.5'; // 当前API版本
const OS_VERSION = 'backoffice-window10'; // 当前操作操作系统版本

var loading;
var hide_loading = true;

/**
 * 创建axios实例
 */
const request = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 600000 // 请求超时时间
})

/** 下一次请求不显示Loading */
request.hideLoadingOnce = function() {
  hide_loading = true;
}

/**
 * 是否隐藏Loading
 * 
 * @returns 
 */
function isHideLoading() {
  var b = hide_loading;
  hide_loading = false;
  return b;
}

/**
 * 设置拦截器: 请求拦截器
 */
request.interceptors.request.use(config => {
  if (process.env.PRJ === "SAAS") {
    var tenant = localStorage.getItem("_tenant_")
    if (tenant) {
      // request.setBaseURL("/" + tenant + config.baseURL);
      // console.log(config.url)
      // config.url = "/" + tenant + request.defaults.baseURL
      config.headers['tenant'] = tenant;
    }
  } else {
    config.headers['tenant'] = "hema";
  }
  if (!isHideLoading()) {
    loading = Loading.service();
  }
  if (store.getters.token) {
    config.headers[ACCESS_TOKEN_KEY] = getToken() // 让每个请求携带自定义token
  }
  config.headers['app-version'] = APP_VERSION;
  config.headers['api-version'] = API_VERSION;
  config.headers['os-version'] = OS_VERSION;
  let url = config.url
  // get参数编码
  if (config.method === 'get' && config.params) {
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] != null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
  }
  config.url = url
  return config
}, error => {
  loading && loading.close();
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
});

/**
 * 设置拦截器: 响应拦截器
 */
request.interceptors.response.use(
  response => {
    loading && loading.close();
    const res = response.data
    if (res && res.code === 0) {
      // 只有code===0才认为是正常返回
      return res.data
    }
    // 19: 非法token; 20: token过期
    if (res.code === 19 || res.code === 20) {
      MessageBox.confirm('会话超时，您的可以取消继续留在该页面，或者重新登录', '重新登录', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    }
    return Promise.reject(res)
  },

  error => {
    loading && loading.close();
    console.log(error)
    if (error.response && error.response.data) {
      try {
        var data = error.response.data;
        if (error.response.config.url.indexOf("/api/sys/user/login") >= 0 && (error.response.status === 400 || error.response.status === 403 || error.response.status === 500)) {
          data = {
            code: -1,
            message: "用户名或密码不正确"
          }
        } else {
          if (typeof (data) === 'string') {
            data = JSON.parse(error.response.data);
          }
        }
        return Promise.reject(data);
      } catch (e) {
        return Promise.reject({
          code: -1,
          message: "网络异常: " + error.response.data
        });
      }
    } else {
      return Promise.reject({
        code: -1,
        message: error
      })
    }
  }

)

export default request
