import { reactive } from 'vue'
import { set_cache_loca, get_cache_loca } from '@/common/tools/cmake_cache.js'

const TOKEN = localStorage.getItem('token') || false
const USER_INFO = get_cache_loca('user_info') || false
const USER_ROLE = get_cache_loca('user_role') || []

const state = reactive({
	token: TOKEN, // 用户token
	user_info: USER_INFO, // 用户信息
	user_role: USER_ROLE //用户角色权限
})

// 设置值
const set_state = (key, val) => (state[key] = val)

// 设置值并缓存到本地
const set_cache = (key, val) => {
	state[key] = val
	set_cache_loca(key, val)
}

// 设置追加用户权限
const set_role = (state, role) => {
	state.user_role = [...new Set([...state.user_role, ...role])]
	set_cache_loca('user_role', state.user_role)
}

// 退出登录操作
const set_logout = (state) => {
	state.token = ''
	state.user_info = false
	state.user_role = []
	localStorage.removeItem('token')
	localStorage.removeItem('user_info')
	localStorage.removeItem('user_role')
}

// 判断是否登录
const hasLogin = (state) => state.token || state.user_info || false

export { state, set_role, set_logout, set_state, set_cache }
