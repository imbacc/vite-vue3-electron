import { app, BrowserWindow, globalShortcut } from 'electron'
import { join } from 'path'
import directive from './tools/directive'
import ipcService from './tools/ipcService'

const dev = process.env.NODE_ENV === 'development'
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

const createWindow = () => {
  // 可以创建多个渲染进程
  const win: BrowserWindow | null = new BrowserWindow({
    width: 800,
    height: 600,
    x: 1000,
    y: 225,
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false,
      preload: './preload.js',
      contextIsolation: true,
      nodeIntegrationInWorker: true, // 多线程
    },
  })

  global.win = win

  globalShortcut.register('CommandOrControl+F12', () => {
    // 开发者模式
    win.webContents.openDevTools()
  })

  // 全屏
  win.maximize()

  if (dev) {
    // 开发环境
    win.loadURL('http://localhost:3900/')

    // 开发者模式
    win.webContents.openDevTools()
    // cra 默认的打包目录是 build，我们生产环境需要这么引入

    // 指令
    directive(win)

    // 置顶
    // win.setAlwaysOnTop(true)
  } else {
    // 生产环境
    win.loadFile(join(__dirname, '../render/index.html'))
  }

  // show
  win.show()

  // 渲染进程中的web页面可以加载本地文件
  // win.loadFile('index.html')

  win.on('closed', () => {
    win.destroy()
  })
}

app.whenReady().then(() => {
  createWindow()
  ipcService()

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

// 主进程向渲染进程发送消息，'did-finish-load':当导航完成时发出事件，onload 事件也完成
// win.webContents.on('did-finish-load', () => {
// win.webContents.send('msg', '消息来自主进程')
// })

// 渲染进程 接收
// const { ipcRenderer } = require('electron')
// ipcRenderer.on('msg', (event, message) => {
// console.log(message) // 消息来自主进程
// })

// -------------------

// 渲染进程主动向主进程发送消息
// const {ipcRenderer} = require('electron')
// ipcRenderer.send('indexMsg','消息来自渲染进程')

// 主进程 接收
// const {ipcMain} = require('electron')
// ipcMain.on('indexMsg',(event,msg) => {
//     console.log(msg) //消息来自渲染进程
// })

// ---------------------

// 主进程
// global.sharedObject = {
// user: ''
// }

// // 渲染进程之间通信 渲染进程一
// const { remote } = require('electron')
// remote.getGlobal('sharedObject').user = 'xmanlin'

// // 渲染进程之间通信 渲染进程二
// const { remote } = require('electron')
// console.log(remote.getGlobal('sharedObject').user)
