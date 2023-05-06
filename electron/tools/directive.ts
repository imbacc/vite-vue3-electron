import type { BrowserWindow } from 'electron'
import { globalShortcut } from 'electron'

// 注册指令按键事件
export default (win: BrowserWindow) => {
  // 开发者 ctrl+F12
  globalShortcut.register('CommandOrControl+F12', () => {
    // 开发者模式
    win.webContents.openDevTools()
  })

  // 清除数据缓存并刷新 ctrl+R
  globalShortcut.register('CmdOrCtrl+Shift+F5', () => {
    if (win) {
      win.webContents.session.clearStorageData({
        storages: [
          'cookies',
          'appcache',
          'filesystem',
          'indexdb',
          'localstorage',
          'shadercache',
          'websql',
          'serviceworkers',
          'cachestorage',
        ],
      }).then(() => win.reload())
    }
  })
}
