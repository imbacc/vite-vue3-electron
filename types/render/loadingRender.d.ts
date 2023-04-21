import type { Component } from 'vue'

export interface CompRender_DTYPE {
	instance: Component | any
	option: { [key in string]: any }
	container: HTMLElement | null
}
