import { app, BrowserWindow, globalShortcut } from 'electron'
import { join } from 'path'
import directive from './tools/directive'
import ipcService from './tools/ipcService'
import menuEvenet from './tools/menuEvent'

const dev = process.env.NODE_ENV === 'development'
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

const createWindow = () => {
  // 可以创建多个渲染进程
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    // autoHideMenuBar: true, // 隐藏菜单栏
    icon: join(__dirname, '../render/logo.png'),
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false,
      preload: join(__dirname, './preload.js'),
      contextIsolation: true,
      nodeIntegrationInWorker: true, // 多线程
    },
  })

  win.maximize()
  win.show()

  if (dev) {
    // 开发环境
    win.loadURL('http://localhost:3900/')

    // 开发者模式
    win.webContents.openDevTools()

    // 置顶
    // win.setAlwaysOnTop(true)
  } else {
    // 生产环境
    win.loadFile(join(__dirname, '../render/index.html'), {
    })
  }

  win.on('closed', () => {
    win.destroy()
  })

  return win
}

app.whenReady().then(() => {
  const win = createWindow()
  ipcService(win)
  menuEvenet(win)
  directive(win)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // app.on('browser-window-blur', (e) => {
  // console.log('blur')
  // })

  // app.on('browser-window-focus', (e) => {
  // console.log('focus')
  // })
})

// 所有窗户关闭时触发。
app.on('window-all-closed', () => {
  globalShortcut.unregisterAll()
  if (process.platform !== 'darwin') app.quit()
})

// 当所有窗口关闭且应用程序退出时触发。
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
