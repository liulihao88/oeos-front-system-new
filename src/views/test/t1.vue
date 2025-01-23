<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
import { checkChanges } from '@/utils/gFunc.ts'

let form = {
  name: 'andy',
  age: 18,
}
let t1 = {
  name: 'andy',
}

let t2 = {
  name: 'andy2',
}

let res = checkChanges(form, t1)
let res2 = checkChanges(form, t2)
console.log(`08 res2`, res2)

let o = {
  quota: '3.2 TB',
  totalSpace: 3518437261312,
  usedSpace: 2852476133,
  name: null,
  objectCount: 100273,
  objectSize: 2852476133,
  usageLevel: 'SUFFICIENT',
}

let res3 = proxy.formatBytes(o.usedSpace)
console.log(`14 res3`, res3)
</script>

<template>
  <div>
    <div>test/t1.vue</div>
  </div>
</template>
