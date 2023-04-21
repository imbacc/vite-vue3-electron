import type { UserConfig } from 'vite'
import type { ENV_DTYPE } from './types/vite-plugin/auto-env'

// import { rmSync } from 'node:fs'
import { resolve } from 'path'
import { loadEnv, defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'

// vue
import vue from '@vitejs/plugin-vue'
// icon 按需引入
import IconsPlugin from 'unplugin-icons/vite'
// 使用gzip或brotli来压缩资源
// import compressionPlugin from 'vite-plugin-compression'
// tsx写法
import vueTsx from '@vitejs/plugin-vue-jsx'
// 原子和属性css写法
import unocss from '@unocss/vite'

// env 环境
import envPlugin, { formatEnv } from './vite-plugin/vite-plugin-env'
// Vite 的按需组件自动导入
import autoImportPlugin from './vite-plugin/vite-plugin-auto-import'
// Vite 的按需组件自动导入
import componentsPlugin from './vite-plugin/vite-plugin-components'
// 自动导入路由 需要可以用
import routerPagePlugin from './vite-plugin/vite-plugin-routerPage'
// head cache
import headerCache from './vite-plugin/vite-plugin-cache'

import packageJson from './package.json'
import dayjs from 'dayjs'

const { dependencies, name, version } = packageJson
const __APP_INFO__ = {
  package: { dependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}

const config: UserConfig = {
  publicDir: 'public',

  base: './',

  // 编译
  build: {
    minify: 'esbuild',
    target: 'modules',
    outDir: 'dist/render',
    assetsDir: 'assets',
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    assetsInlineLimit: 4096,
    rollupOptions: {
      external: [
        'electron',
        'serialport',
        'sqlite3',
      ],
      output: {
        // chunks 做操作 注释将减少分割
        manualChunks: {
          'vue': ['vue', 'vue-router'],
          'imba-packages': ['imba-cache', 'imba-request'],
          'lodash-es': ['lodash-es'],
        },
      },
    },
  },

  define: {
    __VUE_OPTIONS_API__: false, // 明确不使用 options api
    __APP_INFO__: JSON.stringify(__APP_INFO__),
  },

  optimizeDeps: {
    include: ['nprogress', 'qs-stringify', 'axios', 'lodash-es', 'electron', 'path', 'dayjs'],
  },

  resolve: {
    // browserField: false,
    // mainFields: ['module', 'jsnext:main', 'jsnext'],
    alias: {
      '@': resolve(__dirname, 'src'),
      '#': resolve(__dirname, 'types'),
    },
  },

  // 插件
  plugins: [
    vue(),
    IconsPlugin(),
    autoImportPlugin(),
    componentsPlugin(),
    routerPagePlugin(),
    unocss(),
    vueTsx(),
  ],

  // 要将一些共享的全局变量传递给所有的Less样式
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/global.scss" as *;',
      },
    },
  },
}

export default defineConfig(({ command, mode }) => {
  // rmSync('dist-electron', { recursive: true, force: true })
  const VITE_ENV = formatEnv(loadEnv(mode, process.cwd())) as ENV_DTYPE
  const { VITE_GLOB_APP_TITLE, VITE_USE_MOCK, VITE_BUILD_GZIP } = VITE_ENV
  // console.log('command=', command)
  // console.log('mode=', mode)

  if (command === 'build' && mode === 'production') {
    // 编译环境配置
    // if (VITE_BUILD_GZIP) {
    //   config.plugins?.push(compressionPlugin({
    //     verbose: true,
    //     algorithm: 'gzip',
    //     ext: '.gz',
    //   }))
    // }
  } else {
    // 开发环境配置
    config.plugins?.push(headerCache())
    config.plugins?.push(envPlugin(VITE_ENV))
    if (VITE_USE_MOCK) {
      config.plugins?.push(viteMockServe({ mockPath: 'mock', supportTs: false }))
    }
  }

  return config
})
