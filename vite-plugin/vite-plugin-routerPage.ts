import routerPages from 'vite-plugin-pages'

// 案例文件夹格式
// src/pages/users/[id].vue -> /users/:id (/users/one)
// src/pages/[user]/settings.vue -> /:user/settings (/one/settings)
// 可在页面追加
// <route>
// {
//   name: "name-override",
//   meta: {
//     requiresAuth: false
//   }
// }
// < /route>

function camelCase(str: string) {
  // 将字符串分割成单词数组
  const words = str.split(/[\s_-]+/)

  // 将第一个单词小写化，保留其他单词的首字母大写
  let result = words[0].toLowerCase()
  for (let i = 1, j = words.length; i < j; i++) {
    const word = words[i]
    result += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  }

  return result
}

export default () => {
  return routerPages({
    extendRoute(route, parent) {
      route.name = `${route.name}`.includes('-') ? camelCase(route.name) : route.name
      return route
    },
    dirs: [
      { dir: 'src/views/test', baseRoute: '' },
    ],
    pagesDir: 'src/views',
    extensions: ['vue'],
  })
}
