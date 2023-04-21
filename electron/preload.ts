import { injectIpcRenderer } from './tools/eventIpc'

console.log('preload...')

injectIpcRenderer()

// 显示版本内容
window.addEventListener('DOMContentLoaded', () => {
  for (const dependency of ['chrome', 'node', 'electron']) {
    console.log(`%c [ ${dependency} ]`, 'font-size:14px; background:#41b883; color:#ffffff;', process.versions[dependency])
  }
})
