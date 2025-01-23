<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
import BucketNumPie from '@/views/tenant/component/bucketNumPie.vue'
const data = ref([])
let obj = {
  inCount: {
    '<1024B': 100001,
    '1K-1MB': 0,
    '1MB-10MB': 0,
    '10MB-50MB': 272,
    '50MB-100MB': 0,
    '100MB-500MB': 0,
    '500MB-1GB': 0,
    '1GB-5GB': 0,
    '>5GB': 0,
  },
  inSize: {
    '<1024B': 449414,
    '1K-1MB': 0,
    '1MB-10MB': 0,
    '10MB-50MB': 2852126992,
    '50MB-100MB': 0,
    '100MB-500MB': 0,
    '500MB-1GB': 0,
    '1GB-5GB': 0,
    '>5GB': 0,
  },
  updatetime: 0,
}
getBucketHistogram()
async function getBucketHistogram(bucketName = 'space') {
  data.value = Object.entries(obj.inCount).map(([name, value]) => {
    return { value: value === 0 ? null : value, name: name }
  })
}
getBucketHistogram()
</script>

<template>
  <div>
    <div>test/t2.vue</div>
    <BucketNumPie :data="data" />
  </div>
</template>
