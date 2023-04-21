<script setup lang="ts">
const userStore = useUserStore()
</script>

<template>
  <a href="javascript:history.back(-1)">返回上一页</a>
  <div>
    <h1>{{ userStore }}</h1>
  </div>
</template>
