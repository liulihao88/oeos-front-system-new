<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
import ScheduleChart from '@/views/config/components/scheduleChart.vue'

// const weeks = ref([ { "scheduleId": "SCHED-1737619870889", "taskId": "T002", "taskName": "垃圾回收T002", "randomLaunchWaiting": 0, "commandID": "C001", "daytime": "Tue 02:04:00" }])
const weeks = ref([])
weeks.value = [
  {
    label: '星期一',
    dayOfWeek: 'MONDAY',
    dates: [
      {
        id: 'SCHED-15769',
        name: 'aaa',
        fromHH: 18,
        fromMM: 35,
        toHH: 19,
        toMM: 35,
        expressionKeyword: 'wpk:wp24h:',
        parseTimes: ['18:35', '19:35'],
      },
    ],
  },
  {
    label: '星期二',
    dayOfWeek: 'TUESDAY',
    dates: [],
  },
  {
    label: '星期三',
    dayOfWeek: 'WEDNESDAY',
    dates: [
      {
        id: 'SCHED-15769',
        name: 'aaa',
        fromHH: 18,
        fromMM: 35,
        toHH: 19,
        toMM: 35,
        expressionKeyword: 'wpk:wp24h:',
        parseTimes: ['18:35', '19:35'],
      },
      {
        id: 'SCHED-15769',
        name: 'aaa',
        fromHH: 19,
        fromMM: 40,
        toHH: 22,
        toMM: 35,
        expressionKeyword: 'wpk:wp24h:',
        parseTimes: ['19:40', '22:35'],
      },
    ],
  },
  {
    label: '星期四',
    dayOfWeek: 'THURSDAY',
    dates: [],
  },
  {
    label: '星期五',
    dayOfWeek: 'FRIDAY',
    dates: [],
  },
  {
    label: '星期六',
    dayOfWeek: 'SATURDAY',
    dates: [],
  },
  {
    label: '星期日',
    dayOfWeek: 'SUNDAY',
    dates: [],
  },
]
</script>

<template>
  <div>
    <div>test/t11111.vue</div>
    <ScheduleChart :weeks="weeks" />
  </div>
</template>
