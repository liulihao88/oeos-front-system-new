<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { getServiceStatus } from '@/api/framework.ts'

const { proxy } = getCurrentInstance()
const lists = ref([])

async function init() {
  let res = await getServiceStatus()
  lists.value = res
}
init()
</script>

<template>
  <div>
    <div>framework/service.vue</div>
  </div>
</template>
