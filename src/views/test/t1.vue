<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
const img = ref('')
const content = `If both slotProps.root and additional props have the same keys but different values, the slotProps.root props will take precedence. This does not apply to classes or the style prop—they will be merged instead. <span class="code">你好</span> <code>我并不会</code>`
</script>

<template>
  <div>
    <g-warning :content="content" />
  </div>
</template>

<style lang="scss" scoped></style>
