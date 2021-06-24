var fs = null,
	disk = null,
	exec = null,
	iconv = null

const { join } = require('path')

// 显示log
const log = async (...args) => console.log(...args)

module.exports = (ipcMain) => {
	// 事件触发
	const ipc_on = async (name, fun) => {
		ipcMain.on(name, async (event, args) => {
			log(`on ${name} -> reply ${name}-render`)
			const res = await fun(event, args)
			event.reply(`${name}-render`, res) // 回复xxx-render
		})
	}

	// 获取文件夹列表
	const fs_files = (_path, system_name) => {
		fs = fs || require('fs')

		system_name = system_name || [
			'Boot',
			'bootmgr',
			'BOOTNXT',
			'Documents and Settings',
			'Recovery',
			'System Volume Information',
			'PerfLogs'
		]

		let fs_list = []
		try {
			fs_list = fs.readdirSync(_path)
		} catch (error) {
			return '读取目录失败'
		}
		// console.log('fs_list=', fs_list)
		const file_list = []
		const filter_list = fs_list.filter((f) => f.indexOf('.sys') === -1 && f.indexOf('$') === -1 && !system_name.includes(f))
		filter_list.forEach((name) => {
			let file_obj = {
				label: name,
				path: `${_path}/${name}`,
				len: 0
			}
			let file_dir = file_obj.path
			try {
				let stats = fs.statSync(file_dir)
				if (stats && stats.isDirectory()) {
					file_obj.id = file_list.length + 1
					file_list.push(file_obj)
				}
			} catch (error) {}
		})
		// console.log('file_list=', file_list)
		return file_list
	}

	// 执行CMD命令 自定义名称回复
	const cmd_exec = async (event, path, bat, name) => {
		console.log('bat=', bat)
		let stats = fs.statSync(path)
		if (!stats || !stats.isDirectory()) return
		exec(bat, { encoding: 'buffer' }, (err, out) => {
			if (err) {
				event.reply(name, iconv.decode(err, 'cp936'))
				return
			}
			event.reply(name, iconv.decode(out, 'cp936'))
		})
	}

	// 磁盘列表
	ipc_on('disk-list', (event, args) => {
		disk = disk || require('diskinfo')

		let disk_list = []
		let return_bg = (number) => parseInt((number / 1024 / 1024 / 1024).toFixed(0))

		return new Promise((resovle) => {
			disk.getDrives((err, drivesAll) => {
				drivesAll.forEach((drive) => {
					const { mounted, blocks, used, available, capacity } = drive
					disk_list.push({
						name: `${mounted.replace(':', '')}`,
						mounted: `${mounted}/`, //盘符号
						total: return_bg(blocks), //总量
						used: return_bg(used), //已使用
						available: return_bg(available), //可用
						capacity: capacity, //使用率
						bfb: parseInt(`${capacity.replace('%', '')}`)
					})
				})
				resovle(disk_list)
			})
		})
	})

	// 文件列表
	ipc_on('file-list', (event, args) => {
		const path = args?.path || 'C:'
		return new Promise((resovle) => resovle(fs_files(path)))
	})

	// 删除文件夹
	ipc_on('del-list', (event, args) => {
		exec = exec || require('child_process').exec
		iconv = iconv || require('iconv-lite')

		let path_list = args?.path_list || []

		return new Promise((resovle) => {
			if (path_list.length > 0) {
				for (const { path, label } of path_list) {
					cmd_exec(event, path, `del /q /s /f "${path}/*.*"`, 'cmd-reply')
					cmd_exec(event, path, `rd /q /s "${path}"`, 'cmd-reply')
				}
				resovle(true)
			} else {
				resovle(false)
			}
		})
	})

	// 复制文件夹
	ipc_on('copy-list', (event, args) => {
		exec = exec || require('child_process').exec
		iconv = iconv || require('iconv-lite')

		let path_list = args?.path_list || []
		let cur_path = args?.cur_path || 'C://'

		return new Promise((resovle) => {
			if (path_list.length > 0) {
				path_list.forEach((min) =>
					cmd_exec(event, min.path, `echo D | xcopy /e /c /f /y "${min.path}" "${cur_path}/${min.label}"`, 'cmd-reply')
				)
				resovle(true)
			} else {
				resovle(false)
			}
		})
	})
}
