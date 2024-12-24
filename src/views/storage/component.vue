<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { getSummariesList, getCompTypeList, getMappingList, getSummariesDetail } from '@/api/storageApi.ts'

import ComponentBaseCache from '@/views/storage/components/componentBaseCache.vue'

const { proxy } = getCurrentInstance()

const data = ref([])
const isTypeShow = ref(false)
const typeOptions = ref([])
const compType = ref()
const baseCacheRef = ref(null)
const locationOptions = ref([])
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
      },
      {
        content: '编辑',
        handler: editRow,
      },
      {
        content: '编辑',
        handler: deleteRow,
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
  console.log(`16 typeOptions.value `, typeOptions.value)
}
getTypeOptionsInit()
async function getMappingListInit() {
  let res = await getMappingList()
  locationOptions.value = res
}
getMappingListInit()
function testRow() {
  console.log('testRow')
}
async function editRow(row) {
  let res = await getSummariesDetail(row.id)
  compType.value = res.type
  if (res.type === 'OceanStorage') {
    // blueCacheRef.value.editOpen(res)
  } else {
    baseCacheRef.value.editOpen(res)
  }
}
function deleteRow() {
  console.log('deleteRow')
}
const newAdd = async () => {
  compType.value = ''
  isTypeShow.value = true
}

const confirm = async () => {
  if (!compType.value) {
    return proxy.$toast('请选择类型', 'e')
  }
  baseCacheRef.value.open(compType.value)
  isTypeShow.value = false
}
</script>

<template>
  <div>
    <div class="f-ed-ct mb">
      <el-button type="primary" @click="newAdd">新建组件</el-button>
    </div>

    <o-table ref="tableRef" :columns="columns" :data="data" />

    <o-dialog ref="dialogRef" v-model="isTypeShow" title="选择类型" @confirm="confirm">
      <o-radio v-model="compType" label="name" :options="typeOptions" />
    </o-dialog>

    <ComponentBaseCache
      ref="baseCacheRef"
      :locationOptions="locationOptions"
      :options="typeOptions"
      :type="compType"
      @success="init"
    />
  </div>
</template>
