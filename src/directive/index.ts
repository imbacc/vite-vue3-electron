import type { App } from 'vue'

interface res_DTYPE { default: (app: App) => void }
const modules = import.meta.glob('./module/*.ts', { eager: true }) as Record<string, res_DTYPE>

export default {
  install: (app: App) => {
    Object.values(modules).forEach((res) => {
      res.default(app)
    })
  },
}
