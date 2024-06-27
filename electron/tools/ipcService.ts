import { dialog, shell, BrowserWindow } from 'electron'
import { ipcHandle, ipcHandleAsync, ipcOn } from './eventIpc'
import { useDownloadFile } from './download'
import path from 'node:path'
import process from 'node:process'

const dev = process.env.NODE_ENV === 'development'
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

export default (win: BrowserWindow) => {
  ipcOn('notice', (event, args) => {
    // console.log('主进程收到通知, 中文乱码!', args)
    console.log('%c [ get electron notice ]=', 'font-size:14px; background:#41b883; color:#ffffff;', args)
  })

  ipcHandleAsync('test0', (event, args) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve('延迟100ms，来自主进程的消息!')
      }, 100)
    })
  })

  // 返回给渲染进程 👇
  ipcHandle('test1', '我来自electron进程通知test1!')
  ipcHandle('test2', { test: '我来自electron进程通知test2!' })
  ipcHandle('test3', ['我来自electron进程通知test3!'])

  ipcHandle('showMsg', (event, args) => {
    dialog.showMessageBox(win, args || {})
  })

  ipcHandle('openUrl', (event, args) => {
    shell.openExternal(args.url)
  })

  ipcHandle('downloadFile', (event, args) => {
    useDownloadFile(args)
  })

  // New window example arg: new windows url
  ipcHandle('openWin', (_, arg) => {
    const childWindow = new BrowserWindow({
      webPreferences: {
        preload: path.join(__dirname, './preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
    })

    if (dev) {
      // 开发环境
      win.loadURL('http://localhost:3900/')
    } else {
      // 生产环境
      win.loadFile(path.join(__dirname, '../render/index.html'))
    }

    if (VITE_DEV_SERVER_URL) {
      childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
    } else {
      childWindow.loadFile(path.join(__dirname, '../render/index.html'), { hash: arg })
    }
  })
}
