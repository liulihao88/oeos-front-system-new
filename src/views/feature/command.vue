<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
import { getCommandList } from '@/api/commandApi.ts'

const data = ref([])
const columns = [
  {
    label: '名称',
    prop: 'name',
  },
  {
    label: '执行节点',
    prop: 'name',
  },
  {
    label: '开始运行时间',
    prop: 'name',
  },
  {
    label: '运行时长',
    prop: 'name',
  },
  {
    label: '执行描述',
    prop: 'name',
  },
  {
    label: '命令执行状态',
    prop: 'name',
  },
  {
    key: 'operation',
    label: '操作',
    btns: [
      {
        content: '编辑',
      },
    ],
  },
]

async function init() {
  let res = await getCommandList()
  data.value = res
}
init()
</script>

<template>
  <div>
    <o-table ref="tableRef" :columns="columns" :data="data" />
  </div>
</template>
