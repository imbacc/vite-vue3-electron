import { reactive } from 'vue'

// 不可变量
const LOCA_ROUTER = 'lazyRouter'
const CACHE_ROUTER = localStorage.getItem(LOCA_ROUTER) || []

// reactive函数
const state = reactive({
	[LOCA_ROUTER]: CACHE_ROUTER
})

// set数据
const set_router = (val) => {
	let cur = get_router(LOCA_ROUTER)
	state[LOCA_ROUTER] = [...new Set([...cur, ...val])]
	localStorage.setItem(LOCA_ROUTER, JSON.stringify(state[LOCA_ROUTER]))
}

// get数据
const get_router = () => {
	const val = state[LOCA_ROUTER]
	if (val) {
		try {
			return JSON.parse(val)
		} catch (error) {
			return val
		}
	}
}

export { set_router, get_router }
