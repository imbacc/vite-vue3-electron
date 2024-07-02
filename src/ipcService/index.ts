export default () => {
  if (!ipcRenderer) {
    console.warn('没有开启ipcRenderer 表示是浏览器环境!')
    return
  }

  // 去node控制台看消息
  ipcEmit('notice', { msg: 'render emit!' })

  ipcInvoke('test0').then((res) => {
    console.log('%c [ test0 res ]-13', 'font-size:14px; background:#41b883; color:#ffffff;', res)
  })

  ipcInvoke('test1').then((res) => {
    console.log('%c [ test1 res ]-9', 'font-size:14px; background:#41b883; color:#ffffff;', res)
  })

  ipcInvoke('test2').then((res) => {
    console.log('%c [ test2 res ]-5', 'font-size:14px; background:#41b883; color:#ffffff;', res)
  })

  ipcInvoke('test3').then((res) => {
    console.log('%c [ test3 res ]-5', 'font-size:14px; background:#41b883; color:#ffffff;', res)
  })

  // ipcInvoke('downloadFile', {
  //   fileURL: 'http://xxx.com/a.png',
  //   fileName: 'fileName',
  //   fileSuffix: 'png',
  // })

  // ipcInvoke('openUrl', 'http://www.baidu.com')

  // ipcInvoke('showMsg', { title: 'title', message: 'message' })
}
