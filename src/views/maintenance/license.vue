<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import {
  getLicenceList,
  getLicenseCapacityinfo,
  downloadActivationCode,
  deleteLicense,
  importLicense,
} from '@/api/maintenanceApi'

const { proxy } = getCurrentInstance()

const fileName = ref()
const data = ref([])
const columns = [
  {
    label: '编号',
    prop: 'id',
  },
  {
    label: '状态',
    prop: 'stateTitle',
    width: 100,
    align: 'center',
  },
  {
    label: '类型',
    width: 100,
    align: 'center',
    prop: 'typeName',
  },
  {
    label: '授权类型',
    prop: 'authorizationTypeName',
    width: 100,
    align: 'center',
  },
  {
    label: '容量',
    width: 100,
    prop: 'capacity',

    filter: (val) => proxy.formatBytes(val),
  },
  {
    label: '过期时间',
    prop: 'expireDate',
    width: proxy.TIME_WIDTH,
    filter: (val) => proxy.formatTime(val),
  },
  {
    label: '发证日期',
    width: proxy.TIME_WIDTH,
    prop: 'publishDate',
    filter: (val) => proxy.formatTime(val),
  },
  {
    label: '导入日期',
    width: proxy.TIME_WIDTH,
    prop: 'importDate',
    filter: (val) => {
      if (!val) {
        return '-'
      }
      return proxy.formatTime(val)
    },
  },
  {
    label: '授权人',
    width: 100,
    prop: 'authorizer',
  },
  {
    label: '描述',
    prop: 'desc',
  },
  {
    key: 'operation',
    label: '操作',
    width: 80,
    align: 'center',
    btns: [
      {
        content: '删除',
        handler: deleteRow,
        comp: 'o-icon',
        disabled: (row) => {
          return row.authorizationType === 'BUILTIN'
        },
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
const details = ref({})
const isShowCode = ref(false)
const isShowPermit = ref(false)

const init = async () => {
  let res = await getLicenceList()
  console.log(`77 res`, res)
  data.value = res
}
init()
const infoInit = async () => {
  let res = await getLicenseCapacityinfo()
  console.log(`77 res`, res)
  details.value = res
}
infoInit()

async function deleteRow(row) {
  await deleteLicense(row.id)
  proxy.$toast('删除成功')
  init()
}
const genCode = () => {
  isShowCode.value = true
}
const importPermit = () => {
  isShowPermit.value = true
}
const downloadFile = async () => {
  let res = await downloadActivationCode()
  console.log(`25 res`, res)

  let filename = 'OCT激活码'
  let href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(res)
  proxy.downloadFile(href, filename)
}
const importQuotaPermit = () => {
  if (!fileName.value) {
    proxy.$toast('请先上传容量许可证文件', 'e')
    return
  }
  isShowPermit.value = false
}

const onChange = async (file, files) => {
  console.log(`14 file`, file)
  const formData = new FormData()
  formData.append('file', file.raw)
  await importLicense(formData)
  fileName.value = file.name
}
</script>

<template>
  <div>
    <div class="header mb2">
      <el-button type="primary" @click="genCode">生成激活码</el-button>
      <el-button type="primary" @click="importPermit">导入容量许可证</el-button>
    </div>
    <o-table ref="tableRef" :columns="columns" :data="data" height="calc(100vh - 300px)" />

    <div v-if="details.total" class="f w-100% mt2">
      <div class="w-100">对象存储区:</div>
      <g-capacity-progress class="w-100% f-1" :total="details.total" :used="details.used">
        已消耗容量/已授权容量
        {{ proxy.formatBytes(details.used) }} /
        {{ proxy.formatBytes(details.total) }}
      </g-capacity-progress>
    </div>

    <o-dialog ref="dialogRef" v-model="isShowCode" title="生成激活码">
      <o-title title="1. 点击下面按钮, 下载激活码文件" />
      <el-button type="primary" class="mtb" @click="downloadFile">下载激活码文件</el-button>

      <o-title title="2. 下载激活码文件后的操作" />
      <div>(1) 请把下载的激活码文件, 以电子邮件的方式发送到公司邮箱</div>
      <div>(2) 公司将在1个工作日内, 把容量许可证文件以邮件方式回复给您</div>
      <div>(3) 您把收到的容量许可证文件, 导入到本系统中</div>
    </o-dialog>

    <o-dialog ref="dialogRef" v-model="isShowPermit" title="上传容量许可证" @confirm="importQuotaPermit">
      <o-title title="点击下面按钮, 上传容量许可证文件, 并提交" />
      <g-upload :onChange="onChange" accept=".txt" class="mtb">
        <el-button type="primary">上传容量许可证</el-button>
      </g-upload>
      <div>容量许可证文件名称: {{ fileName }}</div>
    </o-dialog>
  </div>
</template>
