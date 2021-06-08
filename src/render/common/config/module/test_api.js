import { METHOD } from '../cfg.js'

// 模块api
export default {
	get_test: 'test/get_test',
	get_test222: ['test/get_test/:id', METHOD.GET],
	get_test333: ['test/get_test/three', METHOD.POST]
}
