import { injectIpcRenderer } from './tools/eventIpc'
import { injectIpcAxios } from './tools/requestConvert'
import { injectIpcVersion } from './tools/version'

console.log('preload...')

injectIpcRenderer()
injectIpcAxios()
injectIpcVersion()
