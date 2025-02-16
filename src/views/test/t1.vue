<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
console.log(import.meta)
console.log(import.meta.env)
</script>

<template>
  <div>
    <o-svg name="restart" />
    你好
    <o-svg name="download" />
  </div>
</template>
