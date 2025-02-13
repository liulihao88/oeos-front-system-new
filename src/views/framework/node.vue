<script setup lang="ts">
import { ref, getCurrentInstance, onUnmounted } from 'vue'
import { getNodeList, restartNode, shutdownNode } from '@/api/frameworkApi'

const { proxy } = getCurrentInstance()
const form = ref({
  nodeId: '',
  serveStatus: '',
})
const selections = ref([])
const isShow = ref(false)
const warningText = ref('')
const confirmText = ref('')
const nodeIds = ref([])

const nodeOptions = [
  { value: 'Stoped', label: '关闭' },
  { value: 'InService', label: '使用中' },
  { value: 'Stoping', label: '正在关闭' },
  { value: 'Unknown', label: '未知' },
  { value: 'Initializing', label: '初始化' },
  { value: 'Starting', label: '正在启动' },
  { value: 'Restarting', label: '正在重启' },
  { value: 'Interrupting', label: '中断' },
  { value: 'Pending', label: '等待' },
]

const data = ref([])
const originData = ref([])
const timer = ref(null)
const columns = [
  {
    type: 'selection',
  },
  {
    label: '节点ID',
    prop: 'nodeId',
  },
  {
    label: '节点名称',
    prop: 'name',
  },
  {
    label: '节点类型',
    prop: 'type',
    width: 100,
  },
  {
    label: '启动时间',
    prop: 'startTime',
    width: proxy.TIME_WIDTH,
    align: 'center',
    filter: (val) => proxy.formatTimeByRule(val),
  },
  {
    label: '伺服状态',
    prop: 'serveStatus',
    useSlot: true,
    width: 100,
  },
  {
    label: '伺服状态描述',
    prop: 'description',
  },
  {
    label: '运行时长',
    prop: 'upTime',
    width: 200,
    align: 'center',
    filter: (val) => proxy.formatTimeByRule(val, 'upTime'),
  },
  {
    key: 'operation',
    label: '操作',
    width: 120,
    btns: [
      {
        content: '重启',
        handler: restoreRow,
        disabled: true,
        comp: 'o-icon',
        attrs: {
          name: 'RefreshRight',
          content: '重启',
        },
        // disabled: (row) => {
        //   return row.serveStatus !== 'InService'
        // },
      },
      {
        content: '关闭',
        handler: closeRow,
        comp: 'o-icon',
        attrs: {
          name: 'close',
          content: '关闭',
        },
        // disabled: (row) => {
        //   return row.serveStatus !== 'InService'
        // },
      },
    ],
  },
]

const filterTable = () => {
  data.value = originData.value
    .filter((v) => {
      return v.nodeId.toLowerCase().includes(form.value.nodeId.toLowerCase())
    })
    .filter((v) => {
      if (!form.value.serveStatus) {
        return true
      }
      return v.serveStatus === form.value.serveStatus
    })
}

async function init() {
  let res = await getNodeList()
  originData.value = res
  filterTable()
}
init()
// timer.value = setInterval(() => {
//   init()
// }, 30000)

const _open = (text, rowsArr) => {
  warningText.value = text
  isShow.value = true
  let num = 1
  nodeIds.value = rowsArr.map((v) => v.nodeId)
  confirmText.value = num + 's'
  let timer = setInterval(() => {
    num--
    confirmText.value = num + 's'
    if (num === 0) {
      clearInterval(timer)
      confirmText.value = '已阅读警告'
    }
  }, 1000)
}

function restoreRow(row) {
  _open('重启', [row])
}

function closeRow(row) {
  _open('关闭', [row])
}

const restoreAll = () => {
  let validNodeRow = selections.value.filter((v) => v.serveStatus === 'InService')
  if (validNodeRow.length === 0) {
    proxy.$toast('无可重启的节点', 'e')
  }
  _open('重启', validNodeRow)
}

const closeAll = () => {
  let validNodeRow = selections.value.filter((v) => v.serveStatus === 'InService')
  if (validNodeRow.length === 0) {
    proxy.$toast('无可重启的节点', 'e')
  }
  _open('关闭', validNodeRow)
}

const selectionChange = (val, ...a) => {
  selections.value = val
}

const confirm = async () => {
  if (warningText.value === '关闭') {
    await shutdownNode({ nodeIds: nodeIds.value.join(',') })
  } else {
    await restartNode({ nodeIds: nodeIds.value.join(',') })
  }
  proxy.$toast('操作成功')
  isShow.value = false
}

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<template>
  <div>
    <div class="header f-bt-ct mb2">
      <div class="l f-st-ct">
        <o-input
          v-model="form.nodeId"
          v-throttle="filterTable"
          title="节点ID查询"
          class="mr"
          placeholder="节点ID查询"
          @clear="filterTable"
        />
        <o-select v-model="form.serveStatus" :options="nodeOptions" title="状态" @change="filterTable" />
      </div>
      <div class="r">
        <el-button type="primary" :disabled="selections.length === 0" @click="restoreAll">重启</el-button>
        <el-button type="primary" :disabled="selections.length === 0" @click="closeAll">关闭</el-button>
      </div>
    </div>

    <div class="main">
      <o-table
        ref="tableRef"
        :columns="columns"
        :data="data"
        height="calc(100vh - 244px)"
        :showPage="false"
        @selection-change="selectionChange"
      >
        <template #serveStatus="{ scope, row }">
          <el-tag v-if="row.serveStatus === 'InService'">
            {{ nodeOptions.find((v) => v.value === row.serveStatus).label }}
          </el-tag>
          <el-tag v-else type="danger">{{ nodeOptions.find((v) => v.value === row.serveStatus).label }}</el-tag>
        </template>
      </o-table>
    </div>

    <o-dialog
      ref="dialogRef"
      v-model="isShow"
      title="警告"
      :confirmText="confirmText"
      :confirmAttrs="{
        loading: confirmText !== '已阅读警告',
      }"
      @confirm="confirm"
    >
      <span class="cl-red bold">
        {{ warningText }}
      </span>
      节点将会
      <span class="cl-red bold">{{ warningText }} {{ nodeIds.join(',') }}</span>
      服务, 导致服务中断!
    </o-dialog>
  </div>
</template>
