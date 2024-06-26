import type { _RouteLocationBase, RouteRecordRaw, Router } from 'vue-router'

// 初始化路由状态
export const initMetaState = ref(false)

// 本地路由和meta配置
export const addLocalRouterList = async (router: Router, pages: RouteRecordRaw[]) => {
  const metaList: Partial<_RouteLocationBase>[] = [
    {
      path: '/child/ddd',
      meta: {
        auth: ['ddd'],
      },
    },
    {
      name: 'action',
      meta: {
        auth: ['qqq', 'test'],
      },
    },
  ]

  return await addAsyncRouterList(router, pages, () => Promise.resolve(metaList))
}

export const addAsyncRouterList = async (router: Router, pages: RouteRecordRaw[], metaPro: () => Promise<Partial<_RouteLocationBase>[]>) => {
  const metaList = await metaPro()

  for (const page of pages) {
    const find = metaList.find((f) => (f.name && f.name === page.name) || (f.path && f.path === page.path))
    if (!find) {
      router.addRoute(page)
      continue
    }
    page.meta = Object.assign(page.meta || {}, find.meta)
    router.addRoute(page)
  }

  return pages
}
