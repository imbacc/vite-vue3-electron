<template>
	<div>
		<h1>{{ msg }}</h1>
		<h1>inject num = {{ num }}</h1>
	</div>
</template>

<script>
import { watchEffect, defineComponent, toRefs } from 'vue'

import { useState } from '@common/provide/num.js'

export default defineComponent({
	props: {
		msg: String
	},
	setup() {
		const { num } = toRefs(useState())
		watchEffect(() => console.log(`watchEffect num: ${num}`))

		return {
			num
		}
	}
})
</script>
