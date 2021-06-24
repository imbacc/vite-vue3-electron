const { ipcRenderer } = electron

const log = async (...args) => console.log(...args)

// ipc发送触发回调
const ipc_send = (name, args) => {
	return new Promise((resolve) => {
		// 注册xxx-render 用于回复接受 简化成一个then
		ipcRenderer.once(`${name}-render`, (event, res) => {
			log(`${name}-render once=`, res)
			resolve(res)
		})
		ipcRenderer.send(name, args)
	})
}

// 一次触发
const ipc_once = (name) => {
	return new Promise((resolve) => {
		ipcRenderer.once(name, (event, res) => {
			log(`${name} once=`, res)
			resolve(res)
		})
	})
}

// 多次触发
const ipc_on = (name, resolve) => {
	ipcRenderer.on(name, (event, res) => {
		log(`${name} on=`, res)
		resolve(res)
	})
}

export { ipc_send, ipc_once, ipc_on }
