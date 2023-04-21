<script setup lang="ts">
import { ref } from 'vue'

const bool = ref(false)

// ---function---
const message = (msg: any, type: any) => {
  console.log('msg', msg)
  console.log('type', type)
  bool.value = true
  console.error(`msg: ${msg} | type: ${type}`)
  // hide()
}

const hide = () => {
  bool.value = false
}
</script>

<template>
  <div v-show="bool" class="csc">
    csc 0731
  </div>
</template>

<style lang="scss" scoped>
.csc {
  font-size: 66px;
  background-image: url('http://p1.music.126.net/Dnf3d0vpTvaXhI4I4m1n3A==/109951163420050721.jpg');
  height: 600px;
  width: 600px;
  color: white;
}
</style>
