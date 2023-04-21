import { contextBridge } from 'electron'
import Axios from 'axios'
import { http, https } from 'follow-redirects'

// 注入axios并代理转换
export const injectIpcAxios = () => {
  console.log('%c [ process.env ]-7', 'font-size:14px; background:#41b883; color:#ffffff;', process.env)

  const axios = Axios.create({
    baseURL: process.env.VITE_GLOB_API_URL,
    timeout: 3000 * 10,
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
  })

  contextBridge.exposeInMainWorld('ipcAxios', {
    ...axios,
    interceptors: {
      response: {
        use: axios.interceptors.response.use,
      },
      request: {
        use: axios.interceptors.request.use,
      },
    },
  })
}