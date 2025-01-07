<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { getOceanList, getMagazines, getDrivers } from '@/api/frameworkApi.ts'

const { proxy } = getCurrentInstance()

const isShow = ref(false)
const data = ref([])
const data1 = ref([])
const data2 = ref([])
const title = ref('')

const driveStatus = {
  0: '设备禁用',
  1: '启用',
  2: '空闲无盘',
  3: '空闲有盘',
  4: '刻录',
  5: '读取',
  6: '禁用',
  7: '扫描',
  8: '校验',
  9: '系统禁用',
}

const columns = [
  {
    label: '设备名',
    prop: 'name',
    handler: detailRow,
  },
  {
    label: '设备ID',
    prop: 'id',
  },
  {
    label: '型号',
    prop: 'model',
  },
  {
    label: '总容量',
    prop: 'totalCapacity',
    filter: (value) => {
      return proxy.formatBytes(value)
    },
  },
  {
    label: '已用容量',
    prop: 'usedCapacity',
    filter: (value) => {
      return proxy.formatBytes(value)
    },
  },
  {
    label: '地址',
    prop: 'controllerHostname',
  },
  {
    label: '盘匣数',
    prop: 'magazineCount',
    width: 100,
  },
  {
    label: '驱动器数',
    prop: 'driverCount',
    width: 100,
  },
  {
    key: 'operation',
    label: '操作',
    btns: [
      {
        content: '详情',
        handler: detailRow,
      },
      {
        content: '管理',
        handler: manageRow,
      },
    ],
  },
]

const columns1 = [
  {
    label: '盘匣编号',
    prop: 'id',
  },
  {
    label: '抽屉号',
    prop: 'location',
  },
  {
    label: '当前盘数',
    prop: 'currentDiscCount',
  },
  {
    label: '总盘数',
    prop: 'totalDiscCount',
  },
  {
    label: '已用盘数',
    prop: 'usedDiscCount',
  },
  {
    label: '空盘数',
    prop: 'freeDiscCount',
  },
  {
    label: '状态',
    prop: 'status',
  },
]

const columns2 = [
  {
    label: '光驱编号',
    prop: 'id',
  },
  {
    label: '类型',
    prop: 'driveType',
  },
  {
    label: 'SCSIAddr',
    prop: 'scsiAddress',
  },
  {
    label: '状态',
    prop: 'status',
    useSlot: true,
  },
]

async function init() {
  let res = await getOceanList()
  data.value = res
}
init()

async function detailRow(row) {
  let res = await Promise.all([getMagazines(row.id), getDrivers(row.id)])
  data1.value = res[0]
  data2.value = res[1]
  title.value = `${row.name}设备详情`
  isShow.value = true
}

function manageRow(row) {
  window.open(row.managementURL)
}
</script>

<template>
  <div>
    <o-table ref="tableRef" :columns="columns" :data="data" :showPage="false" />
    <o-dialog ref="dialogRef" v-model="isShow" :title="title" :fullscreen="true">
      <div class="mb2">
        <o-title title="盘匣列表">
          <el-tag class="ml">{{ data1.length }}</el-tag>
        </o-title>
        <o-table ref="tableRef" :columns="columns1" :data="data1" :showPage="false" />
      </div>
      <div>
        <o-title title="光驱列表">
          <el-tag class="ml">{{ data2.length }}</el-tag>
        </o-title>
        <o-table ref="tableRef" :columns="columns2" :data="data2" :showPage="false">
          <template #status="{ scope, row, value }">
            {{ driveStatus[value] }}
          </template>
        </o-table>
      </div>
    </o-dialog>
  </div>
</template>
