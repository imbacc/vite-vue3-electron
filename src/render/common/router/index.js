import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { registerModule } from '@/common/tools/cmake_lazy.js'
import { set_router, get_router } from '@/common/store/lazy_store.js'

const routes = [
	{
		path: '/',
		component: () => import('@views/test/index.vue'),
		meta: {
			// auth: ['user']
			router: ['init_module', 'action_module', 'test_module']
		}
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@views/test/login.vue')
	},
	{
		path: '/401',
		name: '401',
		component: () => import('@views/error-page/401.vue')
	},
	{
		path: '/404',
		name: '404',
		component: () => import('@views/error-page/404.vue')
	}
]

const router = createRouter({
	history: createWebHashHistory() || createWebHistory(),
	routes
})

// vite自动导入
const moduleArray = import.meta.glob('./module/*.js')

/**
 * 注册router
 * @param {*} name: string | Array
 */
const registerRouter = (name) => {
	return new Promise((resovle) => {
		registerModule(name, moduleArray).then((res) => {
			res.forEach((r) => {
				let has = router.hasRoute(r.name) // 初始化加载过的不再重复加载
				if (!has) router.addRoute(r)
			})
			set_router(name)
			resovle(router)
		})
	})
}

// 懒加载 加载过的router
const initLzayRouter = () => {
	const lazyState = get_router()
	if (lazyState && Array.isArray(lazyState) && lazyState.length > 0) return registerRouter(lazyState)
	return Promise.resolve()
}

export { router, registerRouter, initLzayRouter }
