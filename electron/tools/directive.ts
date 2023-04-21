import type { BrowserWindow } from 'electron'
import { globalShortcut } from 'electron'

// 注册指令按键事件
export default (win: BrowserWindow) => {
  // 清除缓存数据 Ctrl + R刷新看效果
  globalShortcut.register('CmdOrCtrl+Shift+D', () => {
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
