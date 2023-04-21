export const ipcRenderer = window?.ipcRenderer
console.log('%c [ window.ipcRenderer ]', 'font-size:14px; background:#41b883; color:#ffffff;', ipcRenderer)

// ipc发送触发回调
export const ipcEmit = (name: string, ...args: any[]) => {
  return new Promise((resolve) => {
    ipcRenderer?.invoke(`${name}-electron`, ...args).then(resolve)
  })
}
