<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
const cc = ref(true)
</script>

<template>
  <div>
    <g-switch v-model="cc" active-text="开启管理控制1" />
  </div>
</template>
