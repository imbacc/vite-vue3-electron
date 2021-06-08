import { store } from '..'
import { set_cache_loca, get_cache_loca } from '@/common/tools/cmake_cache.js'

const TOKEN = localStorage.getItem('token') || false
const USER_INFO = get_cache_loca('user_info') || false
const USER_ROLEFFF = get_cache_loca('user_role') || []

//全局状态
const state = {
	token: TOKEN, // 用户token
	user_info: USER_INFO, // 用户信息
	user_role: USER_ROLEFFF //用户角色权限
}

console.log(state)

//同步方法
const mutations = {
	/**
	 * @param {Object} info
	 * 0是状态属性名称
	 * 1是赋予状态属性的值
	 * 例 commit('set_vuex', ['token', '值'])
	 */
	set_vuex(state, [key, val]) {
		state[key] = val
		// console.log(state)
	},
	set_cache(state, [key, val]) {
		state[key] = val
		set_cache_loca(key, val)
	},
	set_role(state, role) {
		state.user_role = [...new Set([...state.user_role, ...role])]
		set_cache_loca('user_role', state.user_role)
	},
	set_logout(state) {
		state.token = ''
		state.user_info = false
		state.user_role = []
		localStorage.removeItem('token')
		localStorage.removeItem('user_info')
		localStorage.removeItem('user_role')
	}
}

//get方法
const getters = {
	// 用户是否登录
	hasLogin: (state) => state.token || state.user_info || false
}

//异步方法
const actions = {
	//检查是否登陆状态
	check_login({ commit, state, getters, rootState }) {
		// console.log(rootState)
		if (!getters.hasLogin) {
			commit('set_logout')
			return Promise.resolve(false)
		}
		return Promise.resolve(true)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	getters,
	actions
}
