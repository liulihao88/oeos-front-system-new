<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
const img = ref('我并不会')
const content = `content both slotProps.root and additional props have the same keys but different values, the slotProps.root props will take precedence. This does not apply to classes or the style prop—they will be merged instead. <span class="code">额额额</span> <code>${img.value}</code>If both slotProps.root and additional props have the same keys but different values, the slotProps.root props will take precedence. This does not apply to classes or the style prop—they will be merged instead. <span class="code">额额额</span> <code>${img.value}</code>If both slotProps.root and additional props have the same keys but different values, the slotProps.root props will take precedence. This does not apply to classes or the style prop—they will be merged instead. <span class="code">额额额</span> <code>${img.value}</code>`
</script>

<template>
  <div>
    <g-warning width="1000" type="icon" content="content" />
    <g-warning width="1000" type="icon" :content="content" />
    <g-warning width="1000" :content="content" />
    <g-warning width="1000" type="info" :content="content" class="mt" />
  </div>
</template>

<style lang="scss" scoped></style>
