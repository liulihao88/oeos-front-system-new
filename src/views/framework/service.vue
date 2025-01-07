<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { getServiceStatus, serviceDetail, restartService, stopService, startService } from '@/api/frameworkApi.ts'

const { proxy } = getCurrentInstance()
const lists = ref([])
const isShow = ref(false)
const nowId = ref()

const statusData = [
  {
    label: '正常',
    value: 'Running',
    class: 'status-tag-z',
  },
  {
    label: '正在关闭',
    value: 'Stoping',
    class: 'status-tag-s',
  },
  {
    label: '关闭',
    value: 'Stoped',
    class: 'status-tag-s',
  },
  {
    label: '初始化',
    value: 'Initializing',
    class: 'status-tag-s',
  },
  {
    label: '正在启动',
    value: 'Starting',
    class: 'status-tag-s',
  },
  {
    label: '未知',
    value: 'Unknown',
    class: 'status-tag-y',
  },
  {
    label: '正在重启',
    value: 'Restarting',
    class: 'status-tag-s',
  },
  {
    label: '中断',
    value: 'Interrupting',
    class: 'status-tag-y',
  },
  {
    label: '等待',
    value: 'Pending',
    class: 'status-tag-w',
  },
]

const serveStatusData = [
  {
    label: '使用中',
    value: 'InService',
    class: 'status-tag-z',
  },
  {
    label: '停止运行',
    value: 'OutOfService',
    class: 'status-tag-s',
  },
  {
    label: '错误',
    value: 'Issue',
    class: 'status-tag-y',
  },
  {
    label: '准备',
    value: 'Standby',
    class: 'status-tag-w',
  },
  {
    label: '未知',
    value: 'Unknown',
    class: 'status-tag-y',
  },
  {
    label: '等待',
    value: 'Loading',
    class: 'status-tag-w',
  },
]

const data = ref([])
const columns = [
  {
    label: '服务器地址',
    prop: 'host',
    useSlot: true,
  },
  {
    label: '节点',
    prop: 'nodeId',
    width: 100,
    align: 'center',
  },
  {
    label: '服务端口',
    prop: 'servePorts',
    align: 'center',
    filter: (val) => {
      return val.join(',') || '-'
    },
  },
  {
    label: '运行状态',
    prop: 'status',
    align: 'center',
    useSlot: true,
  },
  {
    label: '伺服状态',
    prop: 'serveStatus',
    align: 'center',
    useSlot: true,
  },
  {
    label: '伺服状态描述',
    prop: 'serveStatusDesc',
  },
  {
    label: '启动时间',
    prop: 'updateTime',
    width: proxy.TIME_WIDTH,
    filter: (val) => proxy.formatTimeByRule(val),
  },
  {
    label: '已运行时间',
    prop: 'upTime',
    filter: (val) => proxy.formatTimeByRule(val, 'uptime'),
  },
  {
    key: 'operation',
    label: '操作',
    btns: [
      {
        content: '重启',
        disabled: (row) => {
          return row.status?.toUpperCase?.() !== 'RUNNING'
        },
        handler: (row) => operationHandler(row, 'restart'),
      },
      {
        content: '停止',
        disabled: (row) => {
          return row.status?.toUpperCase?.() !== 'RUNNING'
        },
        handler: (row) => operationHandler(row, 'stop'),
      },
      {
        content: '启动',
        disabled: (row) => {
          return row.status?.toUpperCase?.() !== 'STOPED'
        },
        handler: (row) => operationHandler(row, 'start'),
      },
    ],
  },
]

async function init() {
  let res = await getServiceStatus()
  lists.value = res
}
init()

const toDetail = async (row) => {
  let res = await serviceDetail(row.id)
  data.value = res
  nowId.value = row.id
  isShow.value = true
}

const operationHandler = async (row, type) => {
  if (type === 'restart') {
    await restartService(row.id, row.nodeId)
  } else if (type === 'stop') {
    await stopService(row.id, row.nodeId)
  } else if (type === 'start') {
    await startService(row.id, row.nodeId)
  }
}
</script>

<template>
  <div>
    <div v-for="(v, i) in lists" :key="i" @click="toDetail(v)">
      <div>{{ v.name }}</div>
    </div>

    <o-dialog v-model="isShow" :title="`S3网关服务${nowId}`" width="1200">
      <o-table ref="tableRef" :columns="columns" :data="data">
        <template #host="{ value, row }">
          {{ value }}
          <template v-if="row.currentNode === true">(当前节点)</template>
        </template>
        <template #status="{ value, row }">
          <el-tag>{{ statusData.find((val) => val.value === value).label }}</el-tag>
        </template>
        <template #serveStatus="{ value, row }">
          <el-tag>{{ serveStatusData.find((val) => val.value === value).label }}</el-tag>
        </template>
      </o-table>
    </o-dialog>
  </div>
</template>
