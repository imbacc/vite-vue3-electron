import { reactive } from 'vue'

// 不可变量
const LOCA_ROUTER = 'lazyRouter'
const LOCA_STORE = 'lazyStore'
const CACHE_ROUTER = localStorage.getItem(LOCA_ROUTER) || []
const CACHE_STORE = localStorage.getItem(LOCA_STORE) || []

// reactive函数
const state = reactive({
	[LOCA_ROUTER]: CACHE_ROUTER,
	[LOCA_STORE]: CACHE_STORE
})

// set数据
const set_state = (key, val) => {
	let cur = get_state(key)
	state[key] = [...new Set([...cur, ...val])]
	localStorage.setItem(key, JSON.stringify(state[key]))
}

// get数据
const get_state = (key) => {
	const val = state[key]
	if (val) {
		try {
			return JSON.parse(val)
		} catch (error) {
			return val
		}
	}
}

export { LOCA_ROUTER, LOCA_STORE, set_state, get_state }
