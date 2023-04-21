<template>
  <div>login user</div>
  <button @click="login">
    login
  </button>
</template>

<script setup lang="ts">
const router = useRouter()
const userStore = useUserStore()

const login = () => {
  userStore.setStoreCache({ token: 'vue3 token', userInfo: { username: 'imbacc', password: 'vite2vue3' } })
  router.replace({ path: '/' })
}
</script>
