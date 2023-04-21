import { ipcMain, contextBridge, ipcRenderer } from 'electron'

// 注册electron事件,待render进程来触发事件
export const ipcOn = (name: string, callback: Function) => {
  ipcMain.handle(`${name}-electron`, async (event, args) => {
    const result = await callback(event, args)
    // 这里return表示回复给render
    return result
  })
}

// 触发render注册的事件
export const ipcEmit = (name: string, args: any) => {
  ipcMain.handle(`${name}-electron`, () => args)
}

// 给render进程window注入 上下文隔离
export const injectIpcRenderer = () => {
  // 此处日志会在渲染层输出
  console.log('inject window IpcRenderer success!')
  contextBridge.exposeInMainWorld('ipcRenderer', {
    ...ipcRenderer,
    on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on(channel, listener),
    once: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.once(channel, listener),
    emit: (channel: string, args: any[]) => ipcRenderer.send(channel, args),
  })
}