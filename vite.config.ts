import type { UserConfig } from 'vite'
import type { ENV_DTYPE } from './types/vite-plugin/auto-env'

// import { rmSync } from 'node:fs'
import process from 'node:process'
import { resolve } from 'node:path'
import { loadEnv, defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'

// electron
import electron from 'vite-plugin-electron/simple'
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
// api函数自动导入
import autoImportPlugin from './vite-plugin/vite-plugin-auto-import'
// 按需组件自动导入
import componentsPlugin from './vite-plugin/vite-plugin-components'
// 自动导入路由 需要可以用
import routerPagePlugin from './vite-plugin/vite-plugin-routerPage'

// naiveUi自动
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

import packageJson from './package.json'
import dayjs from 'dayjs'

const { dependencies, name, version } = packageJson
const __APP_INFO__ = {
  package: { dependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}

const config: UserConfig = {
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
    __VUE_PROD_DEVTOOLS__: false, // production 关闭 devtools
    __APP_INFO__: JSON.stringify(__APP_INFO__),
  },

  optimizeDeps: {
    include: ['nprogress', 'qs-stringify', 'axios', 'lodash-es', 'electron', 'dayjs'],
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
    Components({
      resolvers: [NaiveUiResolver()],
    }),
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

let initDefaultConfig = true

export const webConfig = ({ command, mode }) => {
  initDefaultConfig = false
  return defaultConfig({ command, mode })
}

export const defaultConfig = ({ command, mode }) => {
  // rmSync('dist-electron', { recursive: true, force: true })
  const VITE_ENV = formatEnv(loadEnv(mode, process.cwd())) as ENV_DTYPE
  const { VITE_GLOB_APP_TITLE, VITE_USE_MOCK, VITE_BUILD_GZIP } = VITE_ENV
  // console.log('command=', command)
  // console.log('mode=', mode)
  const isBuild = command === 'build' && mode === 'production'

  config.plugins?.push(envPlugin(VITE_ENV))

  if (initDefaultConfig) {
    config.plugins?.push(electron({
      main: {
        // Shortcut of `build.lib.entry`
        entry: 'electron/main.ts',
        // onstart({ startup }) {
        //   startup()
        // },
        vite: {
          build: {
            sourcemap: isBuild,
            minify: isBuild,
            outDir: 'dist/electron',
            rollupOptions: {
              // Some third-party Node.js libraries may not be built correctly by Vite, especially `C/C++` addons,
              // we can use `external` to exclude them to ensure they work correctly.
              // Others need to put them in `dependencies` to ensure they are collected into `app.asar` after the app is built.
              // Of course, this is not absolute, just this way is relatively simple. :)
              external: Object.keys('dependencies' in packageJson ? packageJson.dependencies : {}),
            },
          },
        },
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: 'electron/preload.ts',
        vite: {
          build: {
            sourcemap: isBuild ? 'inline' : undefined, // #332
            minify: isBuild,
            outDir: 'dist/electron',
            rollupOptions: {
              external: Object.keys('dependencies' in packageJson ? packageJson.dependencies : {}),
            },
          },
        },
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: {},
    }))
  }

  if (isBuild) {
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
    if (VITE_USE_MOCK) {
      config.plugins?.push(viteMockServe({ mockPath: 'mock' }))
    }
  }

  return config
}

export default defineConfig(defaultConfig)
