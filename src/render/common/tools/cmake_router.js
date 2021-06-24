import { router, initLzayRouter, registerRouter } from '@common/router/index.js'
import { get_router } from '@/common/store/lazy_store.js'
import { configure, start, done } from 'nprogress'
import { state } from '@common/store/user_store.js'

configure({ showSpinner: false })

// 跳过
const jump_list = ['/ddd']
//检查权限
const user_role = () => [...state.user_role]
// 检查登录
const check_login = () => state.token
// 懒加载路由
const router_lazy = (meta_router, next) => {
	if (!meta_router) {
		next()
		return
	}
	// console.log('meta_router', meta_router)
	const loca_router = get_router()
	const filter_router = meta_router.filter((router) => !loca_router.includes(router))
	// console.log('loca_router', loca_router)
	// console.log('filter_router', filter_router)
	if (filter_router.length > 0) {
		registerRouter(filter_router).then(() => next())
	} else {
		// console.log('没有可以注册的路由')
		next()
	}
}

// ...前置守卫
router.beforeEach(({ path, matched, fullPath }, from, next) => {
	start()
	if (path === '/login' || jump_list.includes(path)) {
		next()
		done()
		return
	}

	if (!check_login()) {
		next('/login')
		done()
		return
	}

	const matched_meta = matched && matched[0] && matched[0].meta
	const meta_auth = matched_meta?.auth
	const meta_router = matched_meta?.router

	// 判断是否有权限
	if (meta_auth) {
		console.log('meta_auth', meta_auth)
		console.log('user_role()', user_role())
		const auth_some = meta_auth.some((min) => user_role().includes(min))
		console.log('auth_some', auth_some)
		if (!auth_some) {
			console.log('没有权限!')
			next('/401')
			return
		}
	}

	if (meta_router) {
		router_lazy(meta_router, next)
	} else {
		next()
	}

	// let time = setTimeout(() => {
	// 	clearTimeout(time)
	// 	next()
	// }, 0)
})

// ...后置钩子
router.afterEach((to, from) => {
	done()
})

export { router, initLzayRouter }
