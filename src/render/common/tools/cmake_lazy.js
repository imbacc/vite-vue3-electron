/**
 * 懒加载 module js 抽离出来了 可以在其他地方使用
 * @param {*} fileName 文件名
 * @param {*} moduleFiles module文件夹下的*.js集合
 */
const lazyModule = (fileName, moduleFiles) => {
	return new Promise((resolve) => {
		let name = `./module/${fileName}.js`
		let module = moduleFiles[name]
		if (module && typeof module === 'function') {
			// 加载完替换懒加载函数 下次直接使用不再加载
			module().then((res) => resolve(res.default))
		} else {
			resolve(module && typeof module === 'object' ? module : false)
		}
	})
}

/**
 * 懒加载注册module
 * @param {*} registerName 注册名称
 * @param {*} lazyName: string | Array 文件名称 懒加载文件名
 */
const registerModule = (lazyName, lazyArray) => {
	// console.log('lazyName', lazyName)
	// console.log('lazyArray', lazyArray)
	return new Promise((resolve) => {
		if (Array.isArray(lazyName)) {
			// 多个文件名
			const asyncArr = []
			lazyName.forEach((name) => asyncArr.push(lazyModule(name, lazyArray)))
			Promise.allSettled(asyncArr).then((res) => {
				if (res && Array.isArray(res)) {
					const result = []
					res.forEach((r) => {
						let arr = Array.isArray(r.value)
						if (arr) result.push(...r.value)
						if (!arr) result.push(r.value)
					})
					resolve(result)
				}
			})
		} else {
			lazyModule(lazyName, lazyArray).then((res) => resolve(res))
		}
	})
}

export { lazyModule, registerModule }
