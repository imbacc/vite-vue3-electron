import App from './App.vue'

import direct from '@/directive/index'
import { createPinia } from 'pinia'
import { loadRouterMode } from '@/router/index'

// 全局样式
import 'uno.css'
import 'nprogress/nprogress.css'

const setup = async () => {
  const app = createApp(App)
  const store = createPinia()
  const router = await loadRouterMode()
  app.use(store)
  app.use(router)
  app.use(direct)
  app.mount('#app')
}

setup()

// 全局 property
// app.config.globalProperties.xx = 'xx'

// 处理错误
// app.config.errorHandler = (err, vm, info) => {
//   // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
// }

//
// 全局注册组件
// app.component('component-a', {
// mounted() {
// console.log(this.foo) // 'bar'
// }
// })

// 全局注册组件指令
// app.directive('focus', {
// mounted() {
// el => el.focus()
// }
//   mounted: el => el.focus()
// })
