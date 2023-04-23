import { autoUpdater, dialog } from 'electron'

export default (win, app) => {
  app.on('ready', () => {
    // 每次启动程序，就检查更新
    const iosPath = 'ios'
    const winPath = 'win'

    autoUpdater.setFeedURL({
      url: `http://127.0.0.1:9005/${process.platform === 'darwin' ? iosPath : winPath}`,
    })

    // 检测更新
    autoUpdater.checkForUpdates()

    // 监听'error'事件
    autoUpdater.on('error', (err) => {
      console.log(err)
      dialog.showErrorBox('应用报错', err.message)
    })

    // 监听'update-available'事件，发现有新版本时触发
    autoUpdater.on('update-available', () => {
      console.log('found new version')
    })

    // 默认会自动下载新版本，如果不想自动下载，设置autoUpdater.autoDownload = false
    // 监听'update-downloaded'事件，新版本下载完成时触发
    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox({
        type: 'info',
        title: '应用更新',
        message: '发现新版本，是否更新？',
        buttons: ['是', '否'],
      }).then((buttonIndex) => {
        if (buttonIndex.response === 0) { // 选择是，则退出程序，安装新版本
          autoUpdater.quitAndInstall()
          app.quit()
        }
      })
    })
  })
}
