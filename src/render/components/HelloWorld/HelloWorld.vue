<template>
	<div>
		<img alt="Vue logo" :src="logo" />
		<h1>{{ msg }}</h1>
		<button @click="value++">count is: {{ value }}</button>
		<p>
			Edit
			<code>components/HelloWorld.vue</code>
			to test hot module replacement.
		</p>
		<button @click="onclick(false)">onclick onclick onclick</button>
	</div>
</template>

<script>
import { reactive, toRefs, defineComponent } from 'vue'

export default defineComponent({
	props: {
		msg: String,
		logo: String
	},
	emit: ['call'],
	setup(props, { emit }) {
		console.log('props=', props)
		// ---reactive---
		const data = reactive({ value: 0 })

		// ---function---
		const onclick = (msg) => emit('call', msg)

		const refClick = () => {
			console.log('refclick...')
			fetch('/api/index/ddd')
				.then((res) => res.json())
				.then((res) => {
					console.log('/api/index/ddd', res)
				})
		}

		return {
			// ---reactive---
			...toRefs(data),
			// ---function---
			refClick,
			onclick
		}
	}
})
</script>
