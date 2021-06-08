import { router, initLzayRouter, registerRouter } from '../router/index.js'
import { store, registerStore } from '../store/index.js'
import { LOCA_ROUTER, LOCA_STORE, get_state } from '../provide/lazy_state.js'
import { configure, start, done } from 'nprogress'

configure({ showSpinner: false })

// 跳过
const jump_list = ['/ddd']
//检查权限
const user_role = () => [...store.state.user_vuex.user_role]
// 检查登录
const check_login = () => store.state.user_vuex.token
// 懒加载状态
const store_lazy = (meta_store, next) => {
	if (!meta_store) {
		next()
		return
	}
	// console.log('meta_store', meta_store)
	const loca_store = get_state(LOCA_STORE)
	const filter_store = meta_store.filter((store) => !loca_store.includes(store))
	// console.log('loca_store', loca_store)
	// console.log('filter_store', filter_store)
	if (filter_store.length > 0) {
		registerStore(filter_store).then(() => next())
	} else {
		// console.log('没有可以注册的状态')
		next()
	}
}
// 懒加载路由
const router_lazy = (meta_router, next) => {
	if (!meta_router) {
		next()
		return
	}
	// console.log('meta_router', meta_router)
	const loca_router = get_state(LOCA_ROUTER)
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
	const meta_store = matched_meta?.store
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

	const return_next = () => {
		next()
		return
	}

	if (meta_store) {
		const next_router = () => router_lazy(meta_router, return_next)
		store_lazy(meta_store, next_router)
	} else if (meta_router) {
		const next_store = () => store_lazy(meta_store, return_next)
		router_lazy(meta_router, next_store)
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
