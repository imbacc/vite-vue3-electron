//全局状态
const state = {
	test: 'test'
}

//同步方法
const mutations = {
	/**
	 * @param {Object} info
	 * 0是状态属性名称
	 * 1是赋予状态属性的值
	 */
	set_vuex(state, [key, val]) {
		state[key] = val
		console.log('key', val)
	}
}

//get方法
const getters = {}

//异步方法
const actions = {}

export default {
	namespaced: true,
	state,
	mutations,
	getters,
	actions
}
