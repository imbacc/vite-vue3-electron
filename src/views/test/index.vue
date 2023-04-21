<template>
  <div>
    <router-link to="/about">
      About
    </router-link>
    |
    <router-link to="/action">
      Action
    </router-link>
    |
    <button v-auth="['test']" @click="alert">
      测试 directive v-auth
    </button>

    <button @click="auth">
      点我授权去Action
    </button>

    <button @click="loginOut">
      退出登录
    </button>
  </div>
</template>

<script setup lang="ts">
import ipcService from '@/tools/ipcService'

onMounted(() => {
  ipcService()
})

const authStore = useAuthStore()
const userStore = useUserStore()

const alert = () => {
  window.alert('能点')
}

const auth = () => {
  if (authStore.hasRouterAuth(['test'])) {
    window.alert('已经点过了')
    return
  }
  authStore.pushRouterAuth('test')
  window.location.reload()
}

const loginOut = () => {
  authStore.clear()
  userStore.loginOut()
}
</script>

<style></style>
