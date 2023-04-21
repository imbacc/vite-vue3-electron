import type { emitterMap_DTYPE, emitterMapKey_DTYPE, emitterHandler_DTYPE } from '#/tools/mitt'

import mitt from 'mitt'
export const emitter = mitt()

const emitterMap: emitterMap_DTYPE = {}

export const onEmitEvent = (key: emitterMapKey_DTYPE, handler: emitterHandler_DTYPE) => {
  emitterMap[key] = handler
  emitter.off(key, handler)
  emitter.on(key, handler)
}

export const offEmitEvent = (key: emitterMapKey_DTYPE) => {
  emitter.off(key, emitterMap[key])
  delete emitterMap[key]
}

export const emitEmitEvent = (key: emitterMapKey_DTYPE) => {
  emitter.emit(key)
}
