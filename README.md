# vite2-vue3-electron

vite2 <https://vitejs.dev>
vue3 <https://v3.cn.vuejs.org>
electron12  <https://cloud.tencent.com/developer/doc/1070> <https://www.electronjs.org>

`yarn install` `yarn run v-dev -> yarn run e-dev` `建议使用yarn`
`yarn run v-dev` `先启动vite编译vue3...`
`yarn run e-dev` `再启动electron编译webview...`

```
 ├── node_modules                      依赖包
 ├── mock                              mock
 ├── public                            从未在源代码中引用(例如robots.txt)
 ├── vite-plugin                       vite插件
 ├── src                               源代码
 ├── ├── electron                      win入口
 ├── ├── render                        view入口
 │   │      ├── assets                        静态资源
 │   │      ├── common
 │   │      │     ├── config                  配置信息
 │   │      │     │      │── module           api模块配置
 │   │      │     │      │── index.js         api公共配置
 │   │      │     │      │── cfg.js           全局配置设定
 │   │      │     ├── provide                 vue3特性抽离 provide 和 inject
 │   │      │     ├── lib                     js包
 │   │      │     ├── router                  路由页面配置
 │   │      │     │      ├── module           router模块配置
 │   │      │     │      ├── index.js         router配置入口
 │   │      │     ├── store                   状态管理配置
 │   │      │     │      ├── module           vuex模块配置
 │   │      │     │      ├── index.js         vuex配置入口
 │   │      │     ├── tools                   工具
 │   │      │     │      ├── cmake_cache.js   缓存数据时间设定
 │   │      │     │      ├── cmake_lazy.js    懒加载js module
 │   │      │     │      ├── cmake_router.js  路由拦截
 │   │      │     │      ├── cmake_tools.js   自定义工具
 │   │      │     │      ├── cmake_zintercept.js   请求封装
 │   │      │     │      ├── cmake_zrequest.js     请求和响应拦截
 │   │      │     │── components              组件
 │   │      │     │── styles                  全局样式
 │   │      │     │── views                   页面入口
 │   │      │     │── App.vue                 app.vue
 │   │      │     │── main.js                 入口
 ├── .env                        默认配置
 ├── .env.development            开发配置
 ├── .env.production             线上配置
 ├── package.json                依赖包及配置信息文件
 ├── vite.config.js              vite配置文件
```
