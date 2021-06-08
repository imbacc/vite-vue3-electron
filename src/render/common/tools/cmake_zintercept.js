/**
 * 拦截请求
 */
import axios from 'axios'
import { env } from '@common/config/cfg.js'

const BASE_API = env.VITE_GLOB_API_URL
const http = axios.create({
	baseURL: BASE_API, // url = base url + request url
	timeout: 9000
})

const error_msg = (msg = '网络异常') => {
	// element notice
	console.log(msg)
}
const record = {}

// 请求拦截器
http.interceptors.request.use(
	(config) => {
		// 在发送请求之前做些什么

		if (config.data && config.data._rollback) {
			if (record[config.url]) return Promise.reject(new Error(`_roolback_${config.url}`))
			record[config.url] = true
		}

		let token = localStorage.getItem('token') || false
		if (token) config.headers['Authorization'] = ''

		// console.log("【config】 " + JSON.stringify(config))

		return config
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error)
	}
)

// 响应拦截器
http.interceptors.response.use(
	(response) => {
		// console.log("【response】 " + response)

		if (response.status === 401) {
			// removeToken
			window.location = '/login'
			return
		}
		const res = response.data
		if (res.status === 401) {
			error_msg('401 error')
			return Boolean(false)
		}

		if (res.status === 503) {
			error_msg('503 error')
			return Boolean(false)
		}

		if (res.data && res.data.error) {
			error_msg('请求失败', res.data.error)
			return Boolean(false)
		}

		return res
	},
	(error) => {
		// 对响应错误做点什么
		const err = error.toString()

		// 回滚中断请求
		if (err.indexOf('_roolback_') !== -1) {
			const key = err.replace('_roolback_', '')
			delete record[key]
			return Boolean(false)
		}

		if (err.indexOf('code 500') !== -1) {
			error_msg('500 error')
			return Boolean(false)
		}

		if (err.indexOf('code 503') !== -1) {
			error_msg('503 error')
			return Boolean(false)
		}

		if (err.indexOf('code 401') !== -1) {
			error_msg('401 error')
			return Boolean(false)
		}

		if (err.indexOf('code 422') !== -1) {
			// 服务器错误信息回应
			error_msg(error.response && error.response.data && error.response.data.error, '')
			return Boolean(false)
		}

		if (error.toString().indexOf('Error') !== -1) {
			error_msg('网络异常')
			return Boolean(false)
		}

		return Promise.reject(error)
	}
)

export default http
