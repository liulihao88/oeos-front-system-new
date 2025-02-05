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
    <g-warning content="修改寻址模式会导致原始对象无法正确读取，您确定需要修改吗？" />
    <g-warning
      content="修改寻址模式会导致原始对象无法正确读取，您确定需要修改吗？修改寻址模式会导致原始对象无法正确读取，您确定需要修改吗？修改寻址模式会导致原始对象无法正确读取，您确定需要修改吗？修改寻址模式会导致原始对象无法正确读取，您确定需要修改吗？"
    />
    <!-- <ScheduleChart :weeks="data" /> -->
  </div>
</template>
