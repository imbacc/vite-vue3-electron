import { createApp } from 'vue'
import App from './App.vue'

// router
import { router, initLzayRouter } from '@/common/tools/cmake_router.js'

// js
import { env, is_cdn } from '@/common/config/cfg.js'
import direct from '@common/directive/index.js' // 指令

// 全局样式
import 'nprogress/nprogress.css'
import '@/styles/index.scss'

const app = createApp(App)
Promise.allSettled([initLzayRouter()]).then(() => {
	app.use(direct)
	app.use(router)
	app.mount('#app')
})

console.log('import.meta.env', env)

// 全局 property
app.config.globalProperties.is_cdn = is_cdn

// dev工具
app.config.devtools = true

// 处理错误
// app.config.errorHandler = (err, vm, info) => {
//   // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
// }

//
// 全局注册组件
// app.component('component-a', {
// mounted() {
// 	console.log(this.foo) // 'bar'
// }
// })

// 全局注册组件指令
// app.directive('focus', {
// mounted() {
// 	el => el.focus()
// }
//   mounted: el => el.focus()
// })
