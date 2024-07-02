export interface ipcHandle_DTYPE {
  dirList: { pathStr: string }
  test0: { aa: string }
  test1: { aa: number }
  test2: { bb: boolean }
  test3: { cc: unknown }
}

export interface ipcHandleResult_DTYPE {
  dirList: string[]
  test1: string
  test2: { test: string }
  test3: string[]
  test0: string
}

export interface ipcOn_KEY_DTYPE {
  notice: { msg: string }
  showMsg: { msg: string }
  openUrl: { url: string }
  downloadFile: downloadParams_DTYPE
  openWin: { url: string, hash: string }
}

export interface ipcRenderOn_DTYPE {
  renderTest: { msg: string }
}

export interface downloadParams_DTYPE {
  fileURL: string
  fileName: string
  fileSuffix: string
}
