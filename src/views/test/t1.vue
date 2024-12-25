<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
import LogRangeDate from '@/views/monitor/components/logRangeDate.vue'

const from = ref()
const to = ref()
</script>

<template>
  <div>
    {{ from }}???===
    {{ to }}
    <LogRangeDate v-model:from="from" v-model:to="to" />
  </div>
</template>
