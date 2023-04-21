import type { authStore_DTYPE } from '#/store/auth'

import { getCacheLoca } from 'imba-cache'

const WHITELIST = ['/login', '/401', '/404']

const pushValue = (_this: any, page: string | Array<string>, key: keyof authStore_DTYPE) => {
  const list: Array<string> = []
  if (typeof page === 'string') {
    list.push(page)
  } else {
    for (const key of page) {
      if (list.includes(key)) continue
      list.push(key)
    }
  }
  list.unshift(..._this[key])
  useSetStoreCache(_this, { [key]: list })
}

export const useAuthStore = defineStore('auth', {
  state: (): authStore_DTYPE => {
    return {
      // 路由白名单
      whiteIgnoreList: getCacheLoca('whiteIgnoreList') || WHITELIST,
      // 路由权限
      routerAuthList: getCacheLoca('routerAuthList') || [],
      // 粒度权限
      meshAuthList: getCacheLoca('meshAuthList') || [],
    }
  },
  getters: {
    hasWhiteIgnore(state) {
      return (path: string) => state.whiteIgnoreList.includes(path)
    },
    hasRouterAuth(state) {
      return (list: Array<string>) => list.some((s) => state.routerAuthList.includes(s))
    },
    hasMeshAuth(state) {
      return (list: Array<string>) => list.some((s) => state.meshAuthList.includes(s))
    },
  },
  actions: {
    setStoreCache(params: Partial<key_valueof_CONVERT<authStore_DTYPE>>) {
      useSetStoreCache(this, params)
    },
    clear() {
      useClearStore(this)
      this.whiteIgnoreList = WHITELIST
    },
    pushWhiteIgnore(page: string | Array<string>) {
      pushValue(this, page, 'whiteIgnoreList')
    },
    pushRouterAuth(auth: string | Array<string>) {
      pushValue(this, auth, 'routerAuthList')
    },
    pushMeshAuth(auth: string | Array<string>) {
      pushValue(this, auth, 'meshAuthList')
    },
  },
})
