import { ipcEmit, ipcRenderer } from './eventIpc'

export default () => {
  if (!ipcRenderer) {
    console.warn('没有开启ipcRenderer 表示是浏览器环境!')
    return
  }
  ipcEmit('test0').then((res) => {
    console.log('%c [ test0 res ]-13', 'font-size:14px; background:#41b883; color:#ffffff;', res)
  })

  ipcEmit('test1').then((res) => {
    console.log('%c [ test1 res ]-9', 'font-size:14px; background:#41b883; color:#ffffff;', res)
  })

  ipcEmit('test2').then((res) => {
    console.log('%c [ test2 res ]-5', 'font-size:14px; background:#41b883; color:#ffffff;', res)
  })

  ipcEmit('test3').then((res) => {
    console.log('%c [ test3 res ]-5', 'font-size:14px; background:#41b883; color:#ffffff;', res)
  })
}