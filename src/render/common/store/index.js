import { createStore } from 'vuex'
import { registerModule } from '@/common/tools/cmake_lazy.js'
import { LOCA_STORE, set_state, get_state } from '@/common/provide/lazy_state.js'

import user_vuex from './module/user_vuex.js' // 初始化 user_vuex

// 也可以弃用store,利用reactive特性来实现全局状态管理
const store = createStore({
	state: {
		title: 'i am title'
	},
	mutations: {
		/**
		 * @param {Object} info
		 * 0是状态属性名称
		 * 1是赋予状态属性的值
		 */
		set_vuex(state, info) {
			state[info[0]] = info[1]
		}
	},
	actions: {},
	modules: {
		user_vuex
	}
})

// vite自动导入
const moduleArray = import.meta.glob('./module/*.js')

/**
 * 注册store
 * @param {*} name: string | Array
 */
const registerStore = (name) => {
	return new Promise((resovle) => {
		registerModule(name, moduleArray).then((res) => {
			res.forEach((r, idx) => {
				let cur_name = name[idx]
				let has = store.hasModule(cur_name) // 初始化加载过的不再重复加载
				if (!has) store.registerModule(cur_name, r)
			})
			set_state(LOCA_STORE, Array.isArray(name) ? name : [name])
			resovle(store)
		})
	})
}

// 懒加载 加载过的store
const initLzayStore = () => {
	const lazyState = get_state(LOCA_STORE)
	if (lazyState && Array.isArray(lazyState) && lazyState.length > 0) return registerStore(lazyState)
	return Promise.resolve()
}

export { store, registerStore, initLzayStore }
