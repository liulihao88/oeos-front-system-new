<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
import { getInfoOverview } from '@/api/overviewApi.ts'
import {
  isUrl,
  isEqual,
  isNumber,
  debounce,
  isBoolean,
  getKeyList,
  storageLocal,
  deviceDetection,
} from '@pureadmin/utils'

getInfoOverview()
</script>

<template>
  <div>
    🏆
    <div>test/t1.vue</div>
  </div>
</template>
