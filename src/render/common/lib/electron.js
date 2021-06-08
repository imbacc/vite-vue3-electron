import electron from 'electron'
// import Store from 'electron-store'

console.log('electron=', electron)
// Configuration name causes hot updates to be slow | 传递 name 后会导致热更新很慢
// console.log('electron-store', new Store({ name: 'electron-vue' }))
// console.log('electron-store', new Store())

// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
// ipcRenderer.on('asynchronous-reply', (event, arg) => {
// 	console.log(arg) // prints "pong"
// })
// ipcRenderer.send('asynchronous-message', 'ping')
