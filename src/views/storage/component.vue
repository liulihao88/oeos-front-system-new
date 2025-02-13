<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import {
  getSummariesList,
  getCompTypeList,
  getMappingList,
  getSummariesDetail,
  deleteComponent,
  testComponent,
} from '@/api/storageApi.ts'

import ComponentBaseCache from '@/views/storage/components/componentBaseCache.vue'
import ComponentBlueCache from '@/views/storage/components/componentBlueCache.vue'

const { proxy } = getCurrentInstance()

const data = ref([])
const typeOptions = ref([])
const compType = ref()
const baseCacheRef = ref(null)
const blueCacheRef = ref(null)
const locationOptions = ref([])
const testDetail = ref({})
const isShow = ref(false)
const columns = [
  {
    label: '存储组件ID',
    prop: 'id',
  },
  {
    label: '名字',
    prop: 'name',
  },
  {
    label: '类型',
    prop: 'typeTitle',
  },
  {
    label: '描述',
    prop: 'description',
  },
  {
    key: 'operation',
    label: '操作',
    btns: [
      {
        content: '测试',
        handler: testRow,
        comp: 'o-icon',
        attrs: {
          name: 'test',
          type: 'svg',
          content: '测试',
        },
      },
      {
        content: '编辑',
        handler: editRow,
        comp: 'o-icon',
        attrs: {
          name: 'edit',
          type: 'svg',
          content: '编辑',
        },
      },
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
async function init() {
  let res = await getSummariesList()
  data.value = res
}
init()
const getTypeOptionsInit = async () => {
  let res = (await getCompTypeList()) || []
  console.log(`52 res`, res)
  typeOptions.value = res.filter((v) => {
    return v.value !== 'RFAStorage' && v.value !== 'LocalStorage'
  })
}
getTypeOptionsInit()
async function getMappingListInit() {
  let res = await getMappingList()
  locationOptions.value = res
}
getMappingListInit()
async function testRow(row) {
  let res = await testComponent(row.id)
  testDetail.value = res
  isShow.value = true
}
async function editRow(row) {
  let res = await getSummariesDetail(row.id)
  compType.value = res.type
  if (res.type === 'OceanStorage') {
    blueCacheRef.value.editOpen(res)
  } else {
    baseCacheRef.value.editOpen(res)
  }
}
async function deleteRow(row) {
  await deleteComponent(row.id)
  proxy.$toast('删除成功')
  init()
}
const newAdd = async () => {
  compType.value = ''
  baseCacheRef.value.open()
}
</script>

<template>
  <div>
    <div class="f-ed-ct mb">
      <el-button type="primary" @click="newAdd">新建组件</el-button>
    </div>

    <o-table ref="tableRef" :columns="columns" :data="data" />

    <o-dialog ref="dialogRef" v-model="isShow" title="组件信息">
      <el-form ref="formRef" :model="testDetail" label-width="auto">
        <el-form-item label="组件存储ID" prop="id">
          <o-input v-model="testDetail.id" disabled />
        </el-form-item>
        <el-form-item label="状态" prop="statusTitle">
          <o-input v-model="testDetail.statusTitle" disabled />
        </el-form-item>
        <el-form-item label="容量比例" prop="">
          <template v-if="testDetail.totalSpace">
            <g-capacity-progress :total="testDetail.totalSpace" :used="testDetail.usedSpace">
              {{ proxy.formatBytes(testDetail.usedSpace) }} / {{ proxy.formatBytes(testDetail.totalSpace) }}
            </g-capacity-progress>
          </template>
        </el-form-item>
      </el-form>
    </o-dialog>

    <ComponentBaseCache
      ref="baseCacheRef"
      :locationOptions="locationOptions"
      :options="typeOptions"
      :type="compType"
      @success="init"
    />
    <ComponentBlueCache ref="blueCacheRef" :locationOptions="locationOptions" :options="typeOptions" @success="init" />
  </div>
</template>
