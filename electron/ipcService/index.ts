import path from 'node:path'
import process from 'node:process'

import { dialog, shell, BrowserWindow } from 'electron'
import { ipcHandle, ipcOn, ipcEmit } from '../tools/eventIpc'
import { useDownloadFile } from '../tools/download'
import { dirList } from './dirList'
import { setCache, getCache } from 'imba-cache'

const dev = process.env.NODE_ENV === 'development'
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

export default (win: BrowserWindow) => {
  // 循环触发客户端通知
  setInterval(() => {
    ipcEmit('renderTest', { msg: `来自主进程=${new Date().getTime()}` })
  }, 3000)

  // ipcHandle是请求事件
  ipcHandle('dirList', async (params) => {
    const cache = getCache(params.pathStr) as string[]
    if (cache) return cache
    const result = await dirList(params.pathStr)
    setCache(params.pathStr, result, 1)
    return result
  })

  ipcHandle('test1', () => '我来自electron进程通知test1!')
  ipcHandle('test2', () => ({ test: '我来自electron进程通知test2!' }))
  ipcHandle('test3', () => ['我来自electron进程通知test3!'])

  ipcHandle('test0', (params) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve('延迟1000ms，来自主进程的消息!')
      }, 1000)
    })
  })

  // ipcOn是通知事件

  ipcOn('notice', (params) => {
    // console.log('主进程收到通知, 中文乱码!', params)
    console.log('%c [ get electron notice ]=', 'font-size:14px; background:#41b883; color:#ffffff;', params)
  })

  ipcOn('showMsg', (params) => {
    dialog.showMessageBox(win, { message: params.msg || 'showMsg' })
  })

  ipcOn('openUrl', (params) => {
    shell.openExternal(params.url)
  })

  ipcOn('downloadFile', (params) => {
    useDownloadFile(params)
  })

  // New window example arg: new windows url
  ipcOn('openWin', (params) => {
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
      childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${params.url}`)
    } else {
      childWindow.loadFile(path.join(__dirname, '../render/index.html'), { hash: params.hash })
    }
  })
}
