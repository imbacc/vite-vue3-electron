import type { PluginOption } from 'vite'

export default (): PluginOption => {
  return {
    name: 'cache-middle-ware',
    configureServer: (server) => {
      server.middlewares.use((req, res, next) => {
        res.setHeader('Cache-control', 'max-age=60')
        res.setHeader('Last-Modified', new Date().toUTCString())
        next()
      })
    },
  }
}
