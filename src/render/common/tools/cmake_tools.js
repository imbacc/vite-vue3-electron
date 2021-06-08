var startTime = 0,
	timer = null

/**
 * 1为节流处理,2为防抖处理<br/>
 * @fun 第一个字段传方法
 * @type 传类型
 * @wait 传时间 毫秒为单位 1000ms = 1s
 */
export const dou_fun = (fun, type = 1, wait = 500) => {
	let _this = this,
		args = arguments
	if (type === 1) {
		let curTime = new Date().getTime()
		startTime = startTime == 0 ? curTime : startTime

		if (curTime - startTime > wait) {
			// 固定上一次操作离这一次操作间隔>1000ms，则发送一次。
			startTime = curTime
			console.log('节流处理...')
			fun(_this, args)
		}
	} else {
		if (timer) {
			clearTimeout(timer)
			timer = null
			console.log('重置防抖...')
			return
		}

		timer = setTimeout(() => {
			clearTimeout(timer)
			timer = null
			console.log('防抖处理...')
			fun(_this, args)
		}, wait)
	}
}

export const clone = (obj) => {
	let o = obj instanceof Array ? [] : {}
	for (let k in obj) o[k] = typeof obj[k] === Object ? clone(obj[k]) : obj[k]
	return o
}
