import type { _RouteLocationBase } from 'vue-router'

import { start, done } from 'nprogress'
import { pages, router } from '@/router/create'
import { addAsyncRouterList, addLocalRouterList, initMetaState } from '@/router/meta'

const env = import.meta.env

// configure({ showSpinner: false })

const sleep = () => {
  return new Promise<Partial<_RouteLocationBase>[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          name: 'about',
          meta: {
            auth: ['test'],
          },
        },
        {
          path: '/action',
          meta: {
            auth: ['test'],
          },
        },
      ])
    }, 500)
  })
}

const loadRouterMode = async () => {
  if (!initMetaState.value) {
    if (env.VITE_ROUTER_LOADER === 'local') {
      await addLocalRouterList(router, pages)
    } else {
      await addAsyncRouterList(router, pages, sleep)
    }
    initMetaState.value = true
  }
  return router
}

// ...前置
router.beforeEach(async ({ path, meta }, from, next) => {
  start()

  const userStore = useUserStore()
  const authStore = useAuthStore()

  // 白名单跳过
  if (authStore.hasWhiteIgnore(path)) {
    next()
    return
  }

  // 没有登陆
  if (!userStore.hasLogin) {
    next('/login')
    return
  }

  const metaAuth = meta.auth as Array<string>
  // 判断是否有权限
  if (metaAuth) {
    if (!authStore.hasRouterAuth(metaAuth)) {
      console.error(`${path} 没有权限!`)
      next('/401')
      return
    }
  }

  next()
})

// ...后置
router.afterEach((_to, _from) => {
  done()
})

// err
router.onError((err) => {
  console.log('err', err)
})

export {
  loadRouterMode,
  router,
}
