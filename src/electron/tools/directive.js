const clearObj = {
	storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage']
}

module.exports = (win, global, BrowserWindow) => {
	// 清除缓存数据 Ctrl + R刷新看效果
	global.register('CmdOrCtrl+Shift+D', () => {
		if (win) {
			win.webContents.session.clearStorageData(clearObj, () => {
				win.reload()
			})
		}
	})
}
