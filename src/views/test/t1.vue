<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
</script>

<template>
  <div>
    <o-svg name="restart" />
    你好
    <o-svg name="download" />
  </div>
</template>
