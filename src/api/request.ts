import Axios from 'axios'
// import followRedirects from 'follow-redirects'

// import message from '@/render/messageRender'
// import loadingRender from '@/render/loadingRender'

import { ImbaRequest } from 'imba-request'
import { useUserStore } from '@/store/user'

const env = import.meta.env

const axios = Axios.create({
  baseURL: env.VITE_GLOB_API_URL,
  timeout: 3000 * 10,
})

const http = new ImbaRequest(axios, {
  /**
   * 缓存&SWR 是否开启
   * 默认 true
   */
  cacheBool: true,
  /**
 * 缓存&SWR 缓存时间 默认分单位 mm
 * 默认 -1
 */
  cacheTime: 1,
  /**
 * 缓存&SWR 缓存单位 mm | ss
 * 默认 mm
 */
  cacheUnit: 'mm',
  /**
  * 是否重复请求合并
  * 默认 true
  */
  repeatMergeBool: true,
  /**
  * 是否请求错误后重试
  * 默认 true
  */
  retryBool: true,
  /**
 * 请求重试错误次数
 * 默认 2
 */
  retryCount: 2,
  /**
 * 重试内时间定位 单位秒
 * 默认 5
 */
  retryInterval: 5,
  /**
 * 分页字段设置
 */
  pageKey: ['page', 'size'],
  /**
* 打印API接口地址是否MD5化
*/
  printMD5: false,
  /**
 * 是否开启打印请求数据
 */
  printConsole: true,
})

const errorMsg = async (msg = '服务器开小差了~') => {
  console.error(msg)
  // message.send(msg, 'error').hide()
}

const loginOut = () => {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

// 请求拦截器
axios.interceptors.request.use((config) => {
  console.log('%c [ config ]-28', 'font-size:14px; background:#41b883; color:#ffffff;', config)
  const userStore = useUserStore()
  const token = userStore.token
  if (token) config.headers.Authorization = `bearer ${token}`
  return config
},
)

// 响应拦截器
axios.interceptors.response.use((response) => {
  const { status, data, config } = response

  // loadingRender.close()

  if (status === 401) {
    loginOut()
    return false
  }

  if (status === 200) {
    if (data.code === 0 || data?.msg === 'success') return data.data
  }

  if ((data && data?.code < 0) || data?.msg === 'error') {
    errorMsg(data.msg)
    return false
  }

  return false
},
(error) => {
  // 对响应错误做点什么
  const err = error.toString()
  console.error('response error', err)
  const { message } = error.response?.data || {}

  // loadingRender.close()

  if (err.includes('code 400')) {
    errorMsg(message || '400 error')
    return Boolean(false)
  }

  if (err.includes('code 500')) {
    errorMsg(message || '500 error')
    return Boolean(false)
  }

  if (err.includes('code 503')) {
    errorMsg(message || '503 error')
    return Boolean(false)
  }

  if (err.includes('code 401')) {
    errorMsg(message || '401 error')
    loginOut()
    return Boolean(false)
  }

  if (err.includes('code 403')) {
    // 服务器错误信息回应
    errorMsg(message || '403 error')
    return Boolean(false)
  }

  if (err.includes('Error')) {
    errorMsg(message || '网络异常')
    return Boolean(false)
  }

  return Promise.reject(error)
})

export default http
