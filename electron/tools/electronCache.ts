import { setStorageGlobal } from 'imba-cache'

export default async () => {
  const res = await import('electron-store')
  const Store = res.default
  const store = new Store()
  setStorageGlobal({
    locaSync: store,
    setStorageSync: (key, val) => store.set(key, val),
    getStorageSync: (key) => store.get(key),
    removeStorageSync: (key) => store.delete(key),
  })
}
