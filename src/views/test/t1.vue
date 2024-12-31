<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
const img = ref('')
</script>

<template>
  <div>
    <g-upload-img v-model="img" />
    ??{{ img }}
  </div>
</template>
