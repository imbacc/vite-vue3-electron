import type { ipcHandle_DTYPE, ipcHandleResult_DTYPE, ipcOn_KEY_DTYPE, ipcRenderOn_DTYPE } from '#/electron/types'

// 已自动引入
export const ipcRenderer = window?.ipcRenderer

// ipc响应触发,用于触发主进程返回响应内容
export const ipcInvoke = <T extends keyof ipcHandle_DTYPE, R extends ipcHandleResult_DTYPE[T]>(name: T, params?: ipcHandle_DTYPE[T]): Promise<R extends infer R ? R : any> => {
  return new Promise((resolve, reject) => {
    const key = `${name}-request-electron`
    console.log('%c [ 渲染请求事件 ]=', 'font-size:14px; background:#41b883; color:#ffffff;', key)
    ipcRenderer?.invoke(key, params).then(resolve, reject)
  })
}

// ipc消息触发，用于通知
export const ipcEmit = <T extends keyof ipcOn_KEY_DTYPE>(name: T, params?: ipcOn_KEY_DTYPE[T]) => {
  const key = `${name}-notice-electron`
  console.log('%c [ 渲染通知事件 ]=', 'font-size:14px; background:#41b883; color:#ffffff;', key)
  ipcRenderer?.emit(key, params)
}

// 渲染端设置通知事件，服务端触发，需要在服务端触发前注册
export const ipcRenderOn = <T extends keyof ipcRenderOn_DTYPE>(name: T, callback: (params: ipcRenderOn_DTYPE[T]) => void) => {
  const key = `${name}-notice-render`
  console.log('%c [ 注册渲染通知事件 ]=', 'font-size:14px; background:#41b883; color:#ffffff;', key)
  ipcRenderer?.on(key, async (event, params: ipcRenderOn_DTYPE[T]) => await callback(params))
}
