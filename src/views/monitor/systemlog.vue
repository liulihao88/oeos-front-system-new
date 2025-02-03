<script setup lang="ts">
import { ref, getCurrentInstance, computed, onMounted, onUnmounted } from 'vue'
import LogRangeDate from '@/views/monitor/components/logRangeDate.vue'

const { proxy } = getCurrentInstance()
import { getLogList, startConnect, deleteLog } from '@/api/monitorApi'
import useCacheResponse from '@/store/cacheResponse'
const cacheResponse = useCacheResponse()

cacheResponse.fetchServiceList()
cacheResponse.fetchNodeList()

const data = ref([])
const timer = ref(null)
const columns = [
  {
    label: '任务',
    prop: 'name',
    width: 100,
  },
  {
    label: '收集文件',
    prop: 'collapseFile',
    useSlot: true,
  },
  {
    label: '启动时间',
    prop: 'startDatetime',
    width: proxy.TIME_WIDTH,
    filter: (val) => proxy.formatTimeByRule(val),
  },
  {
    label: '用时',
    prop: 'usedTime',
    width: 100,
    align: 'center',
    filter: (val, row) => {
      let usedTime = row.endDatetime - row.startDatetime
      return proxy.formatTimeByRule(usedTime, 'uptime')
    },
  },
  {
    label: '收集结果',
    prop: 'succeed',
    useSlot: true,
    width: 100,
    align: 'center',
  },
  {
    label: '文件大小',
    prop: 'size',
    filter: proxy.formatBytes,
    width: 100,
    align: 'center',
  },
  {
    label: '描述',
    prop: 'desctiption',
  },
  {
    label: '详情',
    prop: 'details',
  },
  {
    key: 'operation',
    label: '操作',
    btns: [
      {
        content: '下载',
      },
      {
        content: '删除',
        handler: deleteRow,
      },
    ],
  },
]
const form = ref({
  services: [],
  nodes: [],
  fromDatetime: '',
  toDatetime: '',
})
const serviceOptions = ref([])
const nodeOptions = ref([])

async function init() {
  let res = await getLogList()
  data.value = res
}
init()

const start = async () => {
  await startConnect(form.value)
  await init()
}
async function deleteRow(row) {
  await deleteLog(row.id)
  proxy.$toast('删除成功')
  init()
}

const collectDisabled = computed(() => {
  if (
    form.value.services?.length === 0 ||
    form.value.nodes?.length === 0 ||
    !form.value.fromDatetime ||
    !form.value.toDatetime
  ) {
    return true
  }
  return false
})

onMounted(() => {
  timer.value = setInterval(() => {
    init()
  }, 1000 * 5)
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<template>
  <div>
    <div class="f-bt-ct mb2">
      <div>
        <o-select
          v-model="form.services"
          :options="cacheResponse.serviceList"
          multiple
          title="服务列表"
          class="mr"
          width="350"
          label="name"
          collapse-tags
          collapse-tags-tooltip
        />
        <o-select
          v-model="form.nodes"
          :options="cacheResponse.nodeList"
          multiple
          title="节点列表"
          label="name"
          value="nodeId"
          width="350"
          class="mr"
          collapse-tags
          collapse-tags-tooltip
        />
        <LogRangeDate v-model:from="form.fromDatetime" v-model:to="form.toDatetime" width="350" />
      </div>
      <div class="f-st-ct" style="align-items: baseline">
        <g-warning type="icon" content="打包文件至多保存一天, 请尽快下载!" class="mr" />
        <el-button type="primary" :disabled="collectDisabled" @click="start">开始收集日志</el-button>
      </div>
    </div>
    <o-table ref="tableRef" :columns="columns" :data="data">
      <template #collapseFile="{ row }">
        <div>
          <span>服务:</span>
          <span>{{ row.condition.services.join(',') }}</span>
        </div>
        <div>
          <span>节点:</span>
          <span>{{ row.condition.nodes.join(',') }}</span>
        </div>
        <div>
          <span>起止时间:</span>
          <span>{{ row.condition.fromDatetime }} / {{ row.condition.toDatetime }}</span>
        </div>
      </template>
      <template #succeed="{ value }">
        <el-tag v-if="value === true">成功</el-tag>
        <el-tag v-else type="danger">失败</el-tag>
      </template>
    </o-table>
  </div>
</template>
