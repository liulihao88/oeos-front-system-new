<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
import { getCacheSummaries } from '@/api/storageApi.ts'

const data = ref([])
const columns = [
  {
    label: '缓存层ID',
    prop: 'id',
  },
  {
    label: '磁盘容量',
    prop: 'totalSpace',
    filter: (val) => proxy.formatBytes(val),
    width: 100,
  },
  {
    label: '已用容量',
    prop: 'usedSpace',
    filter: (val) => proxy.formatBytes(val),
    width: 100,
  },
  {
    label: '使用容量比例',
    prop: 'percentage',
    useSlot: true,
  },
  {
    label: '状态',
    prop: 'status',
    useSlot: true,
    width: 100,
    align: 'center',
  },
]

const init = async () => {
  let res = await getCacheSummaries()
  data.value = res
}
init()
</script>

<template>
  <div>
    <o-table ref="tableRef" :columns="columns" :data="data">
      <template #percentage="{ row }">
        <g-capacity-progress :total="row.totalSpace" :used="row.usedSpace">
          {{ proxy.formatBytes(row.usedSpace) }} / {{ proxy.formatBytes(row.totalSpace) }}
        </g-capacity-progress>
      </template>
      <template #status="{ value }">
        <el-tag v-if="value.toUpperCase() === 'HEALTH'">正常</el-tag>
        <el-tag v-else type="danger">异常</el-tag>
      </template>
    </o-table>
  </div>
</template>
