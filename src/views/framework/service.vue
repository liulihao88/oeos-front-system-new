<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { getServiceStatus, serviceDetail, restartService, stopService, startService } from '@/api/frameworkApi.ts'

const { proxy } = getCurrentInstance()
const lists = ref([])
const isShow = ref(false)
const nowId = ref()

const statusData = [
  {
    label: '正常',
    value: 'Running',
    class: 'status-tag-z',
  },
  {
    label: '正在关闭',
    value: 'Stoping',
    class: 'status-tag-s',
  },
  {
    label: '关闭',
    value: 'Stoped',
    class: 'status-tag-s',
  },
  {
    label: '初始化',
    value: 'Initializing',
    class: 'status-tag-s',
  },
  {
    label: '正在启动',
    value: 'Starting',
    class: 'status-tag-s',
  },
  {
    label: '未知',
    value: 'Unknown',
    class: 'status-tag-y',
  },
  {
    label: '正在重启',
    value: 'Restarting',
    class: 'status-tag-s',
  },
  {
    label: '中断',
    value: 'Interrupting',
    class: 'status-tag-y',
  },
  {
    label: '等待',
    value: 'Pending',
    class: 'status-tag-w',
  },
]

const serveStatusData = [
  {
    label: '使用中',
    value: 'InService',
    class: 'status-tag-z',
  },
  {
    label: '停止运行',
    value: 'OutOfService',
    class: 'status-tag-s',
  },
  {
    label: '错误',
    value: 'Issue',
    class: 'status-tag-y',
  },
  {
    label: '准备',
    value: 'Standby',
    class: 'status-tag-w',
  },
  {
    label: '未知',
    value: 'Unknown',
    class: 'status-tag-y',
  },
  {
    label: '等待',
    value: 'Loading',
    class: 'status-tag-w',
  },
]

const data = ref([])
const columns = [
  {
    label: '服务器地址',
    prop: 'host',
    useSlot: true,
  },
  {
    label: '节点',
    prop: 'nodeId',
    width: 100,
    align: 'center',
  },
  {
    label: '服务端口',
    prop: 'servePorts',
    width: 100,
    align: 'center',
    filter: (val) => {
      return val.join(',') || '-'
    },
  },
  {
    label: '运行状态',
    prop: 'status',
    width: 100,
    align: 'center',
    useSlot: true,
  },
  {
    label: '伺服状态',
    prop: 'serveStatus',
    width: 100,
    align: 'center',
    useSlot: true,
  },
  {
    label: '伺服状态描述',
    prop: 'serveStatusDesc',
  },
  {
    label: '启动时间',
    prop: 'updateTime',
    width: proxy.TIME_WIDTH,
    filter: (val) => proxy.formatTimeByRule(val),
  },
  {
    label: '已运行时间',
    prop: 'upTime',
    filter: (val) => proxy.formatTimeByRule(val, 'uptime'),
  },
  {
    key: 'operation',
    label: '操作',
    width: 200,
    btns: [
      {
        content: '重启',
        comp: 'o-icon',
        attrs: {
          name: 'RefreshRight',
          content: '重启',
        },
        disabled: (row, scope) => {
          return row.status?.toUpperCase?.() !== 'RUNNING'
        },
        handler: (row) => operationHandler(row, 'restart'),
      },
      {
        content: '停止',
        comp: 'o-icon',
        attrs: {
          type: 'svg',
          name: 'stop',
          content: '停止',
          size: 20,
        },
        disabled: (row) => {
          return row.status?.toUpperCase?.() !== 'RUNNING'
        },
        handler: (row) => operationHandler(row, 'stop'),
      },
      {
        content: '启动',
        comp: 'o-icon',
        attrs: {
          type: 'svg',
          name: 'run',
          content: '启动',
        },
        disabled: (row) => {
          return row.status?.toUpperCase?.() !== 'STOPED'
        },
        handler: (row) => operationHandler(row, 'start'),
      },
    ],
  },
]

async function init() {
  let res = await getServiceStatus()
  lists.value = res
}
init()

const toDetail = async (row) => {
  let res = await serviceDetail(row.id)
  data.value = res
  nowId.value = row.id
  isShow.value = true
}

const operationHandler = async (row, type) => {
  if (type === 'restart') {
    await restartService(row.id, row.nodeId)
  } else if (type === 'stop') {
    await stopService(row.id, row.nodeId)
  } else if (type === 'start') {
    await startService(row.id, row.nodeId)
  }
}
</script>

<template>
  <div>
    <div class="list-box c-list-box">
      <div v-for="(v, i) in lists" :key="i" class="c-list-item cus-list-item" @click="toDetail(v)">
        <div class="list-header">{{ v.name }} ({{ v.id }})</div>
        <div class="list-main">
          <div>
            <span class="label">启动节点数量</span>
            <span class="value">{{ v.upServices }}({{ v.id }})</span>
          </div>
          <div>
            <span class="label">警告节点数量</span>
            <span class="value">{{ v.warnServices }}</span>
          </div>
          <div>
            <span class="label">启动节点数量</span>
            <span class="value">{{ v.errorServices }}</span>
          </div>
          <div>
            <span class="label">端口</span>
            <span class="value">{{ v.mapiPort }}</span>
          </div>
          <div class="f w-100%">
            <span class="label">描述</span>
            <span class="value">
              <o-tooltip :content="v.description" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <o-dialog v-model="isShow" :title="`S3网关服务${nowId}`" width="1200">
      <o-table ref="tableRef" :columns="columns" :data="data">
        <template #host="{ value, row }">
          {{ value }}
          <template v-if="row.currentNode === true">(当前节点)</template>
        </template>
        <template #status="{ value, row }">
          <el-tag>{{ statusData.find((val) => val.value === value).label }}</el-tag>
        </template>
        <template #serveStatus="{ value, row }">
          <el-tag>{{ serveStatusData.find((val) => val.value === value).label }}</el-tag>
        </template>
      </o-table>
    </o-dialog>
  </div>
</template>

<style lang="scss" scoped>
.list-box {
  background: #eef0f3;
  border-radius: 2px;

  .cus-list-item {
    height: 136px;
    font-size: 12px;
    cursor: pointer;
    background: #fff;
    border-top: 2px solid #7167e8;
    box-shadow: 0 0 8px 3px rgb(170 170 170 / 32%);

    .list-header {
      height: 32px;
      padding: 0 16px;
      font-size: 16px;
      line-height: 32px;
      color: #7167e8;
      background: #e8e7fb;
    }

    .list-main {
      padding: 8px 16px;

      .label {
        display: inline-block;
        width: 100px;
        min-width: 100px;
        color: #989ca5;
      }

      .value {
        width: calc(100% - 100px);
        color: #43404f;
      }
    }
  }
}
</style>
