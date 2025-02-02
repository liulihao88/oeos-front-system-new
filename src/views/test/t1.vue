<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
import ScheduleChart from '@/views/config/components/scheduleChart.vue'

const data = ref([
  {
    scheduleId: 'SCHED-1737619870889',
    taskId: 'T002',
    taskName: '垃圾回收T002',
    randomLaunchWaiting: 0,
    commandID: 'C001',
    daytime: 'Tue 02:04:00',
  },
])
</script>

<template>
  <div>
    <div>test/t11111.vue</div>
    <ScheduleChart :weeks="data" />
  </div>
</template>
