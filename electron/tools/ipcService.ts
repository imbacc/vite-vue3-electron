import { ipcOn, ipcEmit } from './eventIpc'

export default () => {
  ipcOn('test0', (event, args) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve('render进程可看到此消息回复,我会延迟100秒出现!')
      }, 100)
    })
  })

  ipcEmit('test1', '我来自electron进程通知test1!')
  ipcEmit('test2', { test: '我来自electron进程通知test2!' })
  ipcEmit('test3', ['我来自electron进程通知test3!'])
}