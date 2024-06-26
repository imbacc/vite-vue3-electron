import type { SaveDialogSyncOptions } from 'electron'

import { app, dialog } from 'electron'
import buffer from 'node:buffer'
import fs from 'node:fs'
import http from 'node:http'
import https from 'node:https'

// 获取下载文件和保存路径
const downloadFile = async (url: string, savePath: string) => {
  const protocol = url.startsWith('https') ? https : http

  const request = protocol.get(url, (response) => {
    if (response.statusCode !== 200) {
      console.error(`Failed to download file: ${response.statusMessage}`)
      return
    }

    const file = fs.createWriteStream(savePath)
    response.pipe(file)
    // file.on('finish', () => console.log('File Downloaded!'))
  })

  request.on('error', (error) => console.error(error))
}

const selectSavePath = (fileName = '', fname = '所有文件', extensions = ['*']) => {
  const options: SaveDialogSyncOptions = {
    title: '保存文件',
    defaultPath: `${app.getPath('downloads')}${fileName}`,
    buttonLabel: '保存',
    filters: [
      { name: fname, extensions },
    ],
    properties: ['createDirectory'],
  }

  return dialog.showSaveDialogSync(options)
}

// 调用下载文件函数，并将其保存到用户指定的路径下
const saveUrlAsFile = (fileURL: string, fileName = '', fname = '所有文件', extensions = ['*']) => {
  const savePath = selectSavePath(fileName, fname, extensions)

  if (savePath) {
    downloadFile(fileURL, savePath)
  }
}

const saveBlobAsFile = async (blobURL: any, fileName = '', fname = '所有文件', extensions = ['*']) => {
  const response = await fetch(blobURL)
  const arrayBuffer = await response.arrayBuffer()

  const savePath = selectSavePath(fileName, fname, extensions)
  if (savePath) {
    fs.writeFile(savePath, buffer.Buffer.from(arrayBuffer), (err) => {
      if (err) console.error(err)
    })
  }
}

interface params_DTYPE {
  fileURL: string
  fileName: string
  fileSuffix: string
}

export const useDownloadFile = ({ fileURL, fileName, fileSuffix }: params_DTYPE) => {
  const idx1 = fileURL.lastIndexOf('/')
  const idx2 = fileURL.lastIndexOf('.')
  const name = fileName || (idx1 === -1 ? '' : fileURL.substring(idx1, idx2))
  const suffix = fileSuffix || (idx2 === -1 ? '' : fileURL.substring(idx2))
  if (fileURL) saveUrlAsFile(fileURL, name, suffix, [suffix.replace('.', '')])
}
