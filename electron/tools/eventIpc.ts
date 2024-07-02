import type { ipcHandle_DTYPE, ipcHandleResult_DTYPE, ipcOn_KEY_DTYPE, ipcRenderOn_DTYPE } from '../../types/electron/types'

import { ipcMain, contextBridge, ipcRenderer, BrowserWindow } from 'electron'

console.time('inject')
// 注册响应事件,待render渲染进程来触发事件，渲染端用invoke触发 ipcHandleResult_DTYPE[T] extends Promise<ipcHandleResult_DTYPE[T]> ? Promise<ipcHandleResult_DTYPE[T]> : ipcHandleResult_DTYPE[T]
export const ipcHandle = <T extends keyof ipcHandle_DTYPE, R = ipcHandleResult_DTYPE[T]>(name: T, callback: ((params: ipcHandle_DTYPE[T]) => R)) => {
  const key = `${name}-request-electron`
  console.log('%c [ use electron event ]=', 'font-size:14px; background:#41b883; color:#ffffff;', key)
  ipcMain.handle(key, async (event, params: ipcHandle_DTYPE[T]) => await callback(params))
}

// 注册消息事件，渲染端用emit触发
export const ipcOn = <T extends keyof ipcOn_KEY_DTYPE>(name: T, callback: (params: ipcOn_KEY_DTYPE[T]) => void) => {
  const key = `${name}-notice-electron`
  console.log('%c [ use electron event ]=', 'font-size:14px; background:#41b883; color:#ffffff;', key)
  ipcMain.on(key, (event, params: ipcOn_KEY_DTYPE[T]) => callback(params))
}

let win = BrowserWindow?.getFocusedWindow()
// 触发渲染进程事件
export const ipcEmit = <T extends keyof ipcRenderOn_DTYPE>(name: T, params?: ipcRenderOn_DTYPE[T]) => {
  win = win ?? BrowserWindow.getFocusedWindow()
  const key = `${name}-notice-render`
  // console.log('%c [ emit render event ]=', 'font-size:14px; background:#41b883; color:#ffffff;', key)
  win?.webContents.send(key, params)
}

// 给render进程window注入通信 上下文隔离
export const injectIpcRenderer = () => {
  // 此处日志会在渲染层输出
  console.log('%c [ inject window IpcRenderer success! ]', 'font-size:14px; background:#41b883; color:#ffffff;')
  contextBridge.exposeInMainWorld('ipcRenderer', {
    // ...ipcRenderer,
    on: ipcRenderer.on,
    once: ipcRenderer.once,
    emit: ipcRenderer.emit,
    send: ipcRenderer.send,
    invoke: ipcRenderer.invoke,
  })
  // contextBridge.exposeInMainWorld('ipcRenderer', {
  //   // ...ipcRenderer,
  //   on: <T extends keyof ipcOn_KEY_DTYPE>(channel: T, listener: (params: ipcOn_KEY_DTYPE[T]) => void) => {
  //     return ipcRenderer.on(channel, (event, params) => listener(params))
  //   },
  //   once: <T extends keyof ipcOn_KEY_DTYPE>(channel: T, listener: (params: ipcOn_KEY_DTYPE[T]) => void) => {
  //     return ipcRenderer.once(channel, (event, params) => listener(params))
  //   },
  //   emit: <T extends keyof ipcOn_KEY_DTYPE>(channel: T, params: ipcOn_KEY_DTYPE[T]) => ipcRenderer.emit(channel, params),
  //   send: <T extends keyof ipcOn_KEY_DTYPE>(channel: T, params: ipcOn_KEY_DTYPE[T]) => ipcRenderer.send(channel, params),
  //   invoke: <T extends keyof ipcHandle_DTYPE>(channel: T, params: ipcHandle_DTYPE[T]) => ipcRenderer.invoke(channel, params),
  // })
  console.timeEnd('inject')
}
