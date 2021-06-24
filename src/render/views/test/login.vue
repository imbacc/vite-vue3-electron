<template>
	<div>login user</div>
	<button @click="login">login</button>
</template>

<script setup>
//setup 方式书写 实验阶段正式环境不建议
import { useRouter } from 'vue-router'
import { set_cache, set_state } from '@common/store/user_store.js'

const { replace } = useRouter()

const login = () => {
	set_cache('token', 'vue3 token')
	set_cache('user_info', { username: 'imbacc', password: 'vite2vue3' })
	set_state('is_login_page', false)

	replace({ path: '/' })
	// registerRouter(['init_module', 'action_module', 'test_module']).then((router) => {
	// 	router.replace({ path: '/' })
	// })
}
</script>
