<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { getCatalog } from '@/api/monitorApi.ts'

import useCacheResponse from '@/store/cacheResponse'
const cacheResponse = useCacheResponse()

cacheResponse.fetchGetCategorys()
cacheResponse.fetchTenantList()

const form = ref({
  beginDatetime: '',
  endDatetime: '',
  pageNumber: 1,
  pageSize: 30,
  catalog: '',
  source: '',
})
const dateRange = ref([])

const { proxy } = getCurrentInstance()
const data = ref([])
const total = ref(0)
const columns = [
  {
    label: '用户名',
    prop: 'requestPrincipal',
    width: 100,
  },
  {
    label: '租户名',
    prop: 'source',
    width: 100,
    filter: (val) => {
      return cacheResponse.tenantList.find((item) => item.value === val)?.name || '-'
    },
  },
  {
    label: '时间',
    prop: 'datetime',
    align: 'center',
    filter: (val) => proxy.formatTimeByRule(val),
    width: proxy.TIME_WIDTH,
  },
  {
    label: '访问IP',
    prop: 'clientAddress',
    width: 150,
    // align: 'center',
  },
  {
    label: '分类',
    prop: 'auditCategory',
    width: 100,
    align: 'center',
    filter: (val) => {
      return cacheResponse.auditCategorysList.find((item) => item.value === val).name
    },
  },
  {
    label: '详情',
    prop: 'message',
  },
]

async function init() {
  let res = await getCatalog(form.value)
  console.log(`49 res`, res)
  data.value = res.page
  total.value = res.total
}
init()

const dateChange = (val) => {
  if (!val) {
    form.value.beginDatetime = ''
    form.value.endDatetime = ''
  } else {
    form.value.beginDatetime = val[0]
    form.value.endDatetime = val[1]
  }
  init()
}
</script>

<template>
  <div>
    <div class="mb2">
      <o-select
        v-model="form.catalog"
        :options="cacheResponse.auditCategorysList"
        title="分类"
        class="mr"
        label="name"
        @change="init"
      />
      <o-select
        v-model="form.source"
        :options="cacheResponse.tenantList"
        title="租户"
        label="name"
        class="mr"
        @change="init"
      />
      <o-date-range
        v-model="dateRange"
        title="选择日期范围"
        format="YYYY-MM-DD"
        width="400"
        value-format="YYYY-MM-DD"
        @change="dateChange"
      />
    </div>
    <o-table ref="tableRef" :columns="columns" :total="total" :data="data" height="calc(100vh - 240px)" />
  </div>
</template>
