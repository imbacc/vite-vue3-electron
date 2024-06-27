export const ipcRenderer = window?.ipcRenderer

// ipc响应触发,用于触发主进程返回响应内容
export const ipcInvoke = <T = any>(name: string, args?: T) => {
  return new Promise((resolve) => {
    const key = `${name}-request-electron`
    console.log('%c [ 渲染进程事件 ]=', 'font-size:14px; background:#41b883; color:#ffffff;', key)
    ipcRenderer?.invoke(key, args).then(resolve)
  })
}

// ipc消息触发，用于通知
export const ipcEmit = <T = any>(name: string, args?: T) => {
  return new Promise((resolve) => {
    const key = `${name}-notice-electron`
    console.log('%c [ 渲染进程事件 ]=', 'font-size:14px; background:#41b883; color:#ffffff;', key)
    ipcRenderer?.emit(key, args)
  })
}
