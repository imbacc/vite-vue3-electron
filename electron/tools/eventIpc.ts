import type { BrowserWindow } from 'electron'

import { ipcMain, contextBridge, ipcRenderer } from 'electron'

console.time('inject')
// 注册响应事件,待render渲染进程来触发事件，渲染端用invoke触发
export const ipcHandleAsync = (name: string, callback: (...args: any) => void | Promise<any>) => {
  const key = `${name}-request-electron`
  console.log('%c [ use electron event Async ]=', 'font-size:14px; background:#41b883; color:#ffffff;', key)
  ipcMain.handle(key, async (event, args) => {
    const result = await callback(event, args)
    // 这里return表示回复给render
    return result
  })
}

// 注册响应事件，渲染端用invoke触发
export const ipcHandle = (name: string, args: any) => {
  const key = `${name}-request-electron`
  console.log('%c [ use electron event ]=', 'font-size:14px; background:#41b883; color:#ffffff;', key)
  ipcMain.handle(key, () => args)
}

// 注册消息事件，渲染端用emit触发
export const ipcOn = (name: string, callback: (...args: any) => void | Promise<any>) => {
  const key = `${name}-notice-electron`
  console.log('%c [ use electron event ]=', 'font-size:14px; background:#41b883; color:#ffffff;', key)
  ipcMain.on(key, callback)
}

// 给render进程window注入通信 上下文隔离
export const injectIpcRenderer = () => {
  // 此处日志会在渲染层输出
  console.log('%c [ inject window IpcRenderer success! ]', 'font-size:14px; background:#41b883; color:#ffffff;')
  contextBridge.exposeInMainWorld('ipcRenderer', {
    // ...ipcRenderer,
    on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on(channel, listener),
    once: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.once(channel, listener),
    emit: (channel: string, args: any[]) => ipcRenderer.send(channel, args),
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
  })
  console.timeEnd('inject')
}
