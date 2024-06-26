import process from 'node:process'

// 显示版本
export const injectIpcVersion = () => {
  window.addEventListener('DOMContentLoaded', () => {
    for (const dependency of ['chrome', 'node', 'electron']) {
      console.log(`%c [ ${dependency} ]`, 'font-size:14px; background:#41b883; color:#ffffff;', process.versions[dependency])
    }
  })
}
