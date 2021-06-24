import { reactive } from 'vue'

const state = reactive({
	title: 'title',
	test: 'test',
	name: 'name'
})

// 设置值
const set_state = (key, val) => (state[key] = val)

export { state, set_state }
