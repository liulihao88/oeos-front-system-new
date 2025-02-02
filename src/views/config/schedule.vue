<script setup lang="ts">
import { ref, getCurrentInstance, computed } from 'vue'
import ScheduleChart from '@/views/config/components/scheduleChart.vue'
import TaskDialog from '@/views/config/components/taskDialog.vue'

import { deleteSchedule, getSchedule, getScheduleTaskList, saveSchedule, saveTask } from '@/api/configApi.ts'

const { proxy } = getCurrentInstance()
const searchValue = ref('')
const tableRef = ref(null)
const data = ref([])
const originData = ref([])
const selectRow = ref({})
const selectedRows = ref({})
const formRef = ref(null)
const list: any = ref([])
const nowEditRow = ref({})
const taskDialogRef = ref(null)

const isEdit = ref(false)
const isShow = ref(false)
const form = ref({})
const rules = {
  name: [proxy.validate()],
}

const columns = [
  {
    label: '人物单',
    prop: 'name',
  },
  {
    key: 'operation',
    label: '操作',
    width: 100,
    btns: [
      {
        content: '编辑',
        handler: editRow,
      },
      {
        content: '删除',
        handler: deleteRow,
      },
    ],
  },
]

const reset = () => {
  selectRow.value = {}
  isEdit.value = false
  tableRef.value.$refs.tableRef.setCurrentRow(null)
}
const newAdd = () => {
  nowEditRow.value = {}
  form.value = {}
  isShow.value = true
}
const addSchedule = async () => {
  taskDialogRef.value.open()
}

const handleCurrentChange = async (currentRow, oldCurrentRow) => {
  if (proxy.notEmpty(currentRow)) {
    selectRow.value = currentRow
    isEdit.value = true
    selectedRows.value = currentRow
    proxy.setStorage('schedule-id', currentRow.value)
    let res = await getScheduleTaskList(currentRow.value)
    list.value = res
  }
}

const _handleRowClick = () => {
  let clickIdx = 0
  let localScheduleId = proxy.getStorage('schedule-id') || ''
  if (data.value.length === 0) {
    reset()
    return
  }
  if (localScheduleId) {
    let taskNameIdx = data.value.findIndex((item) => {
      return item.name === localScheduleId
    })
    clickIdx = taskNameIdx === -1 ? 0 : taskNameIdx
  }
  tableRef.value.$refs.tableRef.setCurrentRow(data.value[clickIdx])
}

async function init() {
  let res = await getSchedule()
  data.value = res
  originData.value = res
  _handleRowClick()
}
init()

async function editRow(row) {
  isShow.value = true
  form.value.name = row.name
  nowEditRow.value = row
}

async function deleteRow(row) {
  await deleteSchedule(row.value)
  proxy.$toast('删除成功')
  init()
}

const searchHandler = () => {
  if (!searchValue.value) {
    data.value = proxy.clone(originData.value)
    restoreHighLight()
    return
  }
  data.value = originData.value.filter((item) => {
    return item.name.includes(searchValue.value)
  })
  restoreHighLight()
}

async function restoreHighLight() {
  let matchRow = data.value.find((item) => {
    return item.value === selectRow.value.value
  })
  if (matchRow) {
    tableRef.value.$refs.tableRef.setCurrentRow(matchRow)
  }
}
const title = computed(() => {
  return proxy.isEmpty(selectedRows.value)
    ? '新建租户'
    : `租户-[${selectedRows.value.name}]=[${selectedRows.value.value}]`
})

const scheduleEdit = (taskObj) => {
  taskDialogRef.value.open(taskObj)
}

const scheduleConfirm = async () => {
  await proxy.validForm(formRef)
  let sendForm = {
    scheduleName: form.value.name,
    schedultId: nowEditRow.value.value,
  }
  await saveSchedule(sendForm)
  isShow.value = false
  proxy.$toast('保存成功')
  init()
}
const taskTitle = computed(() => {
  if (proxy.isEmpty(nowEditRow.value)) {
    return '新建任务单'
  } else {
    return `编辑任务单-[${nowEditRow.value.name}]`
  }
})
</script>

<template>
  <div class="box">
    <el-row :gutter="16" class="h-100%">
      <el-col :span="6" class="h-100%">
        <div class="left c-box h-100%">
          <div class="left-top f-bt-ct mb2">
            <o-input v-model="searchValue" v-throttle.300="searchHandler" title="任务单" width="200" class="mr" />
            <div class="f">
              <el-button icon="el-icon-plus" type="primary" @click="newAdd">新建</el-button>
            </div>
          </div>

          <o-table
            ref="tableRef"
            :columns="columns"
            :data="data"
            :showPage="false"
            height="100%"
            highlight-current-row
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
      <el-col :span="18" class="h-100%">
        <div class="main c-box h-100%">
          <div class="main-header mb2">
            <o-title title="命令列表">
              <el-button type="primary" class="ml2" icon="el-icon-plus" @click="addSchedule">添加任务</el-button>
            </o-title>
          </div>
          <ScheduleChart :weeks="list" @edit="scheduleEdit" />
        </div>
      </el-col>
    </el-row>

    <o-dialog ref="dialogRef" v-model="isShow" :title="taskTitle" @confirm="scheduleConfirm">
      <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent>
        <el-form-item label="任务单名称" prop="name">
          <o-input v-model="form.name" v-focus />
        </el-form-item>
      </el-form>
    </o-dialog>

    <TaskDialog ref="taskDialogRef" :scheduleId="selectRow.value" @success="init" />
  </div>
</template>

<style lang="scss" scoped>
.box {
  height: calc(100vh);
}

.left {
  // background: #fff;
  // padding: 0 16px;
}

.main {
  // background: #fff;
  // padding: 0 16px;
}
</style>
