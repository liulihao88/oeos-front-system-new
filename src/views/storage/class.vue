<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
import { getSummaries, getPools, saveTier, deleteTier } from '@/api/storageApi.ts'

const isShow = ref(false)
const data = ref([])
const options = ref([])
const form = ref({
  type: 'Pool',
})
const originForm = ref({})
originForm.value = proxy.clone(form.value)
const formRef = ref(null)
const rules = {
  tierName: [proxy.validate()],
  storageID: [proxy.validate('请选择')],
}
const columns = [
  {
    label: '名称',
    prop: 'name',
    useSlot: true,
  },
  {
    label: '映射存储池ID',
    prop: 'id',
    useSlot: true,
    width: 150,
    align: 'center',
  },
  {
    label: '配额',
    prop: 'quota',
    useSlot: true,
    width: 100,
  },
  {
    label: '状态',
    prop: 'statusTitle',
    width: 100,
    useSlot: true,
    align: 'center',
  },
  {
    label: '使用容量比例',
    prop: 'percentage',
    useSlot: true,
  },
  {
    label: '使用级别',
    prop: 'usageLevel',
    useSlot: true,
    width: 150,
    align: 'center',
  },
  {
    key: 'operation',
    label: '操作',
    width: 80,
    btns: [
      {
        content: '删除',
        handler: deleteRow,
        comp: 'o-icon',
        attrs: {
          name: 'delete',
          type: 'svg',
          content: '删除',
        },
        reConfirm: !proxy.$dev,
      },
    ],
  },
]

const init = async () => {
  let res = await getSummaries()
  data.value = res
}
init()

const getPoolsInit = async () => {
  let res = await getPools()
  options.value = res
}
getPoolsInit()

async function deleteRow(row) {
  await deleteTier(row.status.name)
  proxy.$toast('删除成功')
  init()
}
const devTest = () => {
  if (proxy.$dev) {
    form.value.tierName = proxy.uuid()
    form.value.storageID = proxy.uuid(options.value)
  }
}
const newAdd = () => {
  form.value = proxy.clone(originForm.value)
  isShow.value = true
  devTest()
}
const confirm = async () => {
  await proxy.validForm(formRef)
  await saveTier(form.value)
  isShow.value = false
  init()
}
const parseType = (status) => {
  console.log(`76 status`, status)
  return status?.status?.toUpperCase?.() === 'PROBABLY_HEALTH' || status?.status?.toUpperCase?.() === 'HEALTH'
    ? 'success'
    : 'danger'
}
</script>

<template>
  <div>
    <div class="f-ed-ct mb">
      <el-button type="primary" @click="newAdd">添加存储层</el-button>
    </div>
    <o-table ref="tableRef" :columns="columns" :data="data" height="calc(100vh - 244px)">
      <template #name="{ row }">
        {{ row.status.name }}
      </template>
      <template #id="{ row }">
        {{ row.substatus?.[0]?.id }}
      </template>
      <template #quota="{ row }">
        {{ row.substatus?.[0]?.quota }}
      </template>
      <template #statusTitle="{ row }">
        <el-tag :type="parseType(row.status)">
          {{ row.substatus?.[0]?.statusTitle }}
        </el-tag>
      </template>
      <template #percentage="{ value, row }">
        <g-capacity-progress :total="row.substatus?.[0]?.totalSpace ?? 0" :used="row.substatus?.[0]?.usedSpace ?? 0">
          {{ proxy.formatBytes(row.substatus?.[0]?.usedSpace ?? 0) }} /
          {{ proxy.formatBytes(row.substatus?.[0]?.totalSpace ?? 0) }}
        </g-capacity-progress>
      </template>
      <template #usageLevel="{ row }">
        <el-tag>
          {{ row.substatus?.[0]?.usageLevel }}
        </el-tag>
      </template>
    </o-table>

    <o-dialog ref="dialogRef" v-model="isShow" title="添加存储层" @confirm="confirm">
      <el-form ref="formRef" :model="form" :rules="rules">
        <el-form-item label="层名称" prop="tierName">
          <o-input v-model="form.tierName" v-focus />
        </el-form-item>
        <el-form-item label="池列表" prop="storageID">
          <o-select v-model="form.storageID" label="name" :options="options" />
        </el-form-item>
      </el-form>
    </o-dialog>
  </div>
</template>
