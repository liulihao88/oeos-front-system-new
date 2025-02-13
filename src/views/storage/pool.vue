<script setup lang="ts">
import { ref, getCurrentInstance, computed } from 'vue'
const { proxy } = getCurrentInstance()
import { getPoolList, savePool, deletePool, testPool } from '@/api/storageApi.ts'

import useCacheResponse from '@/store/cacheResponse'
const cacheResponse = useCacheResponse()

const isShow = ref(false)
const data = ref([])
const options = ref([])
const form = ref({})
const originForm = ref({})
const typeRef = ref(null)
const componentsRef = ref(null)
const isShowTest = ref(false)
const testData = ref({})
originForm.value = proxy.clone(form.value)
const formRef = ref(null)
const editObject = ref({})
const rules = {
  name: [proxy.validate()],
  type: [proxy.validate('请选择')],
  storageComponents: [proxy.validate('请选择')],
}
const columns = [
  {
    label: '存储池ID',
    prop: 'id',
  },
  {
    label: '名称',
    prop: 'name',
  },
  {
    label: '类型',
    prop: 'typeTitle',
    width: 150,
    align: 'center',
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

const init = async () => {
  let res = await getPoolList()
  data.value = res
}
init()

async function testRow(row) {
  let res = await testPool(row.id)
  isShowTest.value = true
  testData.value = res
}
async function editRow(row) {
  await cacheResponse.fetchComponentsList()
  form.value = proxy.clone(row)
  if (row.type === 'StandardStoragePool') {
    options.value = cacheResponse.standardList
  } else if (row.type === 'GlacierStoragePool') {
    options.value = cacheResponse.glacierList
  }
  editObject.value = row
  isShow.value = true
}
async function deleteRow(row) {
  await proxy.confirm(
    '删除存储池会导致系统内保存的数据无法访问，存储池内存储组件的存储空间无法释放，确认删除该存储池吗？',
  )
  await deletePool(row.id)
  proxy.$toast('删除成功')
  init()
}
const devTest = async () => {
  if (proxy.$dev) {
    form.value.name = proxy.uuid()
    form.value.type = 'StandardStoragePool'
    await proxy.sleep(100)
    typeRef.value.$refs.selectRef.$emit('change', form.value.type)
    setTimeout(() => {
      componentsRef.value.$refs.selectRef.$emit('change', [proxy.uuid(options.value)])
    }, 500)
  }
}
const newAdd = async () => {
  await cacheResponse.fetchComponentsList()
  form.value = proxy.clone(originForm.value)
  isShow.value = true
  editObject.value = {}
  devTest()
}
const confirm = async () => {
  await proxy.validForm(formRef)
  await savePool(form.value)
  isShow.value = false
  init()
}

const typeChange = async (value) => {
  form.value.storageComponents = []
  if (value === 'StandardStoragePool') {
    options.value = cacheResponse.standardList
  } else if (value === 'GlacierStoragePool') {
    options.value = cacheResponse.glacierList
  }
}
const title = computed(() => {
  return Object.keys(editObject.value).length ? `池编辑(${editObject.value.id})` : '池新增'
})
</script>

<template>
  <div>
    <div class="f-ed-ct mb">
      <el-button type="primary" @click="newAdd">添加存储层</el-button>
    </div>
    <o-table ref="tableRef" :columns="columns" :data="data" height="calc(100vh - 244px)" />

    <o-dialog ref="dialogRef" v-model="isShow" :title="title" @confirm="confirm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="名字" prop="name">
          <o-input v-model="form.name" v-focus />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <o-select
            ref="typeRef"
            v-model="form.type"
            :options="[
              { label: '标准存储池', value: 'StandardStoragePool' },
              { label: '冰山存储池', value: 'GlacierStoragePool' },
            ]"
            @change="typeChange"
          />
        </el-form-item>
        <el-form-item label="组件列表" prop="storageComponents">
          <o-select
            ref="componentsRef"
            v-model="form.storageComponents"
            label="name"
            :options="options"
            multiple
            width="100%"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <o-input v-model="form.description" type="textarea" />
        </el-form-item>
      </el-form>
    </o-dialog>

    <o-dialog ref="dialogRef" v-model="isShowTest" title="组件信息">
      <el-form ref="formRef" :model="testData" label-width="auto">
        <el-form-item label="存储组件ID" prop="">
          {{ testData.substatus.map((v) => v.id).join(',') }}
        </el-form-item>
        <el-form-item label="状态" prop="">
          {{ testData.substatus[0].statusTitle }}
        </el-form-item>
        <el-form-item label="容量比例" prop="">
          <div v-if="testData.status" class="w-100%">
            <g-capacity-progress :total="testData.status.totalSpace" :used="testData.status.usedSpace">
              {{ proxy.formatBytes(testData.status?.usedSpace ?? 0) }} /
              {{ proxy.formatBytes(testData.status?.totalSpace ?? 0) }}
            </g-capacity-progress>
          </div>
        </el-form-item>
        <el-form-item label="健康组件数量" prop="">
          {{ testData.totalCount }}
        </el-form-item>
        <el-form-item label="异常组件数量" prop="">
          {{ testData.issueCount }}
        </el-form-item>
      </el-form>
    </o-dialog>
  </div>
</template>
