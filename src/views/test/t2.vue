<script setup lang="ts">
import { ref, getCurrentInstance, onUnmounted } from 'vue'
const { proxy } = getCurrentInstance()
import { getEventList, getLevels, markEvent, deleteEvent, exportEvent } from '@/api/monitorApi'

import useCacheResponse from '@/store/cacheResponse'

/**
 * {
  "levels": [
    "INFO",
    "WARN",
    "ERROR",
    "FATAL",
    "DEBUG"
  ],
  "beginDatetime": "2024-10-08",
  "endDatetime": "2024-10-11",
  "mark": "Awared",
  "pageNumber": 1,
  "pageSize": "30"
}
 */

const cacheResponse = useCacheResponse()
cacheResponse.fetchTenantList()
cacheResponse.fetchServiceList()
cacheResponse.fetchNodeList()

const dateRangeValue = ref([])
const searchForm = ref({
  beginDatetime: '',
  endDatetime: '',
  levels: [],
  mark: null,
  pageNumber: 1,
  pageSize: 30,
  apps: [],
  id: '',
  nodes: [],
})
const timer = ref(null)
const total = ref(0)
const levelOptions = ref([])
const statusOptions = ref([
  { label: '标记确认', value: 'Awared' },
  { label: '确认解决', value: 'Solved' },
  { label: '取消解决', value: 'Ignored' },
])
const data = ref([
  {
    name: 'andy',
  },
])
const columns = [
  {
    label: '事件信息',
    prop: 'message',
  },
  {
    label: '事件等级',
    prop: 'level',
    width: 100,
    align: 'center',
    useSlot: true,
  },
  {
    label: '服务',
    prop: 'appId',
    align: 'center',
    width: 100,
  },
  {
    label: '节点',
    prop: 'nodeId',
    align: 'center',
    width: 100,
  },
  {
    label: '发生时间',
    prop: 'datetime',
    width: proxy.TIME_WIDTH,
    align: 'center',
    filter: (val) => proxy.formatTimeByRule(val),
  },
  {
    label: '状态',
    prop: 'mark',
    align: 'center',
    width: 120,
    filter: (val) => {
      return statusOptions.value.find((v) => v.value === val)?.label || '-'
    },
  },
  {
    key: 'operation',
    label: '操作',
    maxBtns: 10,
    btns: [
      {
        content: '确认解决',
        handler: (row) => markRow(row, 'Solved'),
        comp: 'o-icon',
        attrs: {
          type: 'svg',
          content: '取消解决',
          name: 'run',
        },
      },
      {
        content: '取消解决',
        handler: (row) => markRow(row, 'Ignored'),
        comp: 'o-icon',
        disabled: true,
        attrs: {
          type: 'svg',
          content: '取消解决',
          name: 'run',
        },
      },
      {
        content: '删除',
        handler: deleteRow,
        comp: 'o-icon',
        reConfirm: !proxy.$dev,
        attrs: {
          type: 'svg',
          content: '删除',
          name: 'run2',
        },
      },
      {
        content: '删除',
        handler: deleteRow,
        comp: 'o-icon',
        disabled: true,
        reConfirm: !proxy.$dev,
        attrs: {
          type: 'svg',
          content: '删除',
          name: 'run2',
        },
      },
    ],
  },
]
const dateChange = (value) => {
  if (!value) {
    searchForm.value.beginDatetime = ''
    searchForm.value.endDatetime = ''
  } else {
    searchForm.value.beginDatetime = value[0]
    searchForm.value.endDatetime = value[1]
  }
  init()
}
const init = async () => {
  const copyForm = proxy.clone(searchForm.value)
  if (!copyForm.mark) {
    copyForm.mark = null
  }
  let res = await getEventList(copyForm)
  data.value = res.details.page
  total.value = res.details.total
}
const getLevelOptions = async () => {
  let res = await getLevels()
  levelOptions.value = res
}
const options = () => {}
async function markRow(row, type) {
  await markEvent(row.id, type)
  proxy.$toast('标记成功')
}
async function deleteRow(row) {
  await deleteEvent(row.id)
  proxy.$toast('删除成功')
}
const exportEventHandle = async () => {
  const copyForm = proxy.clone(searchForm.value)
  if (!copyForm.mark) {
    copyForm.mark = null
  }
  delete copyForm.pageNumber
  delete copyForm.pageSize
  let res = await exportEvent(copyForm)
  if (res.status === 200) {
    let data = res.data
    const url = URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = url
    link.download = '系统事件.xls'
    link.click()
  } else {
    proxy.$toast('导出失败', 'e')
  }
}

const parseLevelType = (level) => {
  const map = {
    INFO: 'success',
    WARN: 'warning',
    ERROR: 'danger',
    FATAL: 'danger',
    DEBUG: 'primary',
  }
  return map[level]
}
/**
[
  {
    "name": "信息",
    "value": "INFO"
  },
  {
    "name": "警告",
    "value": "WARN"
  },
  {
    "name": "错误",
    "value": "ERROR"
  },
  {
    "name": "致命",
    "value": "FATAL"
  },
  {
    "name": "调试",
    "value": "DEBUG"
  }
]
 * @param level
 */
const parseLevel = (level) => {
  let res = levelOptions.value.find((v) => v.value === level)?.name
  return res
}

getLevelOptions()

init()
timer.value = setInterval(() => {
  init()
}, 3000)

const update = (num, size) => {
  searchForm.value.pageNumber = num
  searchForm.value.pageSize = size
  init()
}

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<template>
  <div>
    <div class="top w-100% f-bt-ct m-b-16">
      <div class="f-1">
        <div class="f-st-ct mb">
          <o-select
            v-model="searchForm.id"
            :options="cacheResponse.tenantList"
            title="租户列表"
            width="30%"
            class="mr"
          />
          <o-select
            v-model="searchForm.apps"
            :options="cacheResponse.serviceList"
            multiple
            title="服务列表"
            class="mr"
            width="30%"
            label="name"
            collapse-tags
            collapse-tags-tooltip
          />
          <o-select
            v-model="searchForm.nodes"
            :options="cacheResponse.nodeList"
            multiple
            title="节点列表"
            label="name"
            value="nodeId"
            width="30%"
            class="mr"
            collapse-tags
            collapse-tags-tooltip
          />
        </div>
        <div class="f-st-ct">
          <o-select
            v-model="searchForm.levels"
            title="事件等级"
            :options="levelOptions"
            multiple
            label="name"
            placeholder="请选择事件等级"
            class="mr"
            width="30%"
            collapse-tags
            collapse-tags-tooltip
            @change="init"
          />
          <o-select
            v-model="searchForm.mark"
            title="状态"
            :options="statusOptions"
            placeholder="请选择状态"
            width="30%"
            class="mr"
            @change="init"
          />
          <o-date-range
            v-model="dateRangeValue"
            title="发生时间"
            width="30%"
            value-format="YYYY-MM-DD"
            @change="dateChange"
            @clear="dateChange"
          />
        </div>
      </div>
      <div class="w-100 f-ed-ct">
        <el-button type="primary" @click="exportEventHandle">导出</el-button>
      </div>
    </div>
    <o-table
      ref="tableRef"
      :columns="columns"
      height="calc(100vh - 250px)"
      :data="data"
      :total="total"
      :pageSize="searchForm.pageSize"
      @update="update"
    >
      <template #level="{ scope, row }">
        <el-tag :type="parseLevelType(row.level)" effect="dark">
          {{ parseLevel(row.level) }}
        </el-tag>
      </template>
    </o-table>
  </div>
</template>
