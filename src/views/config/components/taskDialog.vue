<script setup lang="ts">
import { ref, getCurrentInstance, computed } from 'vue'
import { saveTask, scheduleType, deleteTask, modifyTask } from '@/api/configApi.ts'

const { proxy } = getCurrentInstance()
const emits = defineEmits(['success'])

const props = defineProps({
  scheduleId: {
    type: String,
    required: true,
  },
})

const timeMap = {
  Mon: '星期一',
  Tue: '星期二',
  Wed: '星期三',
  Thu: '星期四',
  Fri: '星期五',
  Sat: '星期六',
  Sun: '星期日',
}

const isShow = ref(false)
const form = ref({})
const originForm = ref({})
const isEdit = ref(false)
const commonOptions: any = ref([])
const details = ref({})
const globalSetting = ref()
const weekValue = ref([])

async function init() {
  let res = await scheduleType()
  commonOptions.value = res.filter((v) => v.name === '垃圾回收')
  form.value.commandID = commonOptions.value[0].value
  form.value.taskName = commonOptions.value[0].name
  originForm.value = proxy.clone(form.value)
}
init()
const open = (taskObj = '') => {
  form.value = proxy.clone(originForm)
  weekValue.value = []
  if (taskObj) {
    form.value.taskName = taskObj.taskName
    form.value.commandID = taskObj.commandID
    details.value = taskObj
    let [key, value] = taskObj.daytime.split(' ')
    form.value[key] = value
    isEdit.value = true
  } else {
    isEdit.value = false
    globalSetting.value = ''
    details.value = {}
  }
  isShow.value = true
}
function transObjToArr() {
  let res = Object.entries(form.value)
    .filter(([key, value]) => {
      return key !== 'commandID' && key !== 'taskName' && value
    })
    .map(([key, value]) => {
      return `${key} ${value}`
    })
  return res
}

const timeChange = (value) => {
  if (isEdit.value) {
    Object.keys(timeMap).forEach((v) => {
      if (value !== v) {
        form.value[v] = ''
      }
    })
  }
}

const updateGlobalSetting = () => {
  Object.keys(timeMap).forEach((v) => {
    if (weekValue.value.length === 0 || weekValue.value.some((val) => val === v)) {
      form.value[v] = globalSetting.value
    }
  })
}

const confirm = async () => {
  let daytimes = transObjToArr()
  if (proxy.isEmpty(daytimes)) {
    return proxy.$toast('执行时间必选', 'e')
  }
  let sendForm = {
    commandID: form.value.commandID,
    taskName: form.value.taskName,
    scheduleId: props.scheduleId,
    daytimes: daytimes,
  }
  await saveTask(props.scheduleId, sendForm)
  proxy.$toast('保存成功')
  isShow.value = false
  emits('success')
}

const cancel = () => {
  isShow.value = false
}

const deleteTaskHandler = async () => {
  await deleteTask(props.scheduleId, details.value.taskId)
  proxy.$toast('删除成功')
  isShow.value = false
  emits('success')
}

const modify = async () => {
  let getTimeValue = ''
  Object.keys(timeMap).forEach((v) => {
    if (form.value[v]) {
      getTimeValue = `${v} ${form.value[v]}`
    }
  })
  if (!getTimeValue) {
    return proxy.$toast('执行时间必选', 'e')
  }
  let sendData = {
    commandID: form.value.commandID,
    daytime: getTimeValue,
    scheduleId: props.scheduleId,
    taskId: details.value.taskId,
    taskName: form.value.taskName,
  }
  await modifyTask(props.scheduleId, sendData)
  isShow.value = false
  proxy.$toast('修改成功')
  emits('success')
}

const title = computed(() => {
  if (isEdit.value) {
    return `编辑任务(${details.value.taskName})`
  } else {
    return '新建任务'
  }
})

defineExpose({
  open,
})
</script>

<template>
  <div>
    <o-dialog ref="dialogRef" v-model="isShow" :title="title" @confirm="confirm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
        <div class="c-form-title">任务名称</div>
        <el-form-item label="名称" prop="commandID">
          <o-radio v-model="form.commandID" :options="commonOptions" label="name" />
        </el-form-item>

        <div class="c-form-title f-st-ct">
          <div>执行时间</div>
          <span class="ml">
            <g-warning type="icon" content="新建任务成功后, 在日程表中点击该任务可再次编辑" />
          </span>
        </div>
        <el-form-item v-if="!isEdit" label="统一设置" prop="">
          <div>
            <el-time-picker v-model="globalSetting" value-format="HH:mm:ss" />
            <el-button type="primary" class="ml" @click="updateGlobalSetting">更新</el-button>
            <o-checkbox
              v-model="weekValue"
              multiple
              :options="Object.entries(timeMap).map(([value, label]) => ({ value, label }))"
            />
          </div>
        </el-form-item>
        <template v-for="(key, value, index) in timeMap" :key="index">
          <el-form-item :label="key" :prop="value">
            <el-time-picker v-model="form[value]" value-format="HH:mm:ss" @change="timeChange(value, index)" />
          </el-form-item>
        </template>
      </el-form>

      <template v-if="isEdit" #footer>
        <el-button type="info" @click="cancel">取消</el-button>
        <el-button @click="deleteTaskHandler">删除</el-button>
        <el-button type="primary" @click="modify">修改</el-button>
      </template>
    </o-dialog>
  </div>
</template>
