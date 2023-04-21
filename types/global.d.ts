import type Electron from 'electron'

export {}
declare global {
  export type keyof_CONVERT<T> = keyof T
  export type key_valueof_CONVERT<T> = { [key in keyof_CONVERT<T>]: key extends keyof_CONVERT<T> ? T[key] : never }

  interface Window {
    ipcRenderer: Electron.IpcRenderer
  }
}
