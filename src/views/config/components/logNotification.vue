<script setup lang="ts">
import { ref, getCurrentInstance, computed } from 'vue'
const { proxy } = getCurrentInstance()
import useCacheResponse from '@/store/cacheResponse'
const cacheResponse = useCacheResponse()

import { getLog, saveLog, syslogTest, syslogReset } from '@/api/configApi.ts'

cacheResponse.fetchServiceList()
cacheResponse.fetchEventList()

const formRef = ref(null)
const form = ref({
  servers: {},
})
const rules = {
  apps: [proxy.validate('请选择')],
  levels: [proxy.validate('请选择')],
  'servers.host': [proxy.validate('ip')],
  'servers.port': [proxy.validate('port')],
  'servers.protocol': [proxy.validate('请选择')],
}
const save = async () => {
  await proxy.validForm(formRef)
  let sendForm = proxy.clone(form)
  revertAll(sendForm, 'apps')
  revertAll(sendForm, 'levels')
  sendForm.servers = [sendForm.servers]
  saveLog(sendForm)
  proxy.$toast('保存成功')
  init()
}
const test = async () => {
  console.log(`81 form.value.servers`, form.value.servers)
  let testData = {
    host: form.value.servers.host,
    port: form.value.servers.port,
    protocol: form.value.servers.protocol,
  }
  await syslogTest(testData)
  proxy.$toast('测试成功')
}
const reset = async () => {
  await proxy.confirm('重置后, 信息设置将清空')
  await syslogReset()
  form.value = {
    servers: {},
  }
  proxy.$toast('重置成功')
}

const testDisabled = computed(() => {
  const { servers } = form.value
  return !servers.host || !servers.port || !servers.protocol
})
async function init() {
  let res = await getLog()
  form.value = res
  form.value.servers = res.servers[0]
  parseAll(form.value, 'apps')
  parseAll(form.value, 'levels')
}
init()

function parseAll(attr, label) {
  const map = {
    apps: 'serviceList',
    levels: 'eventList',
  }
  if (attr[label].length === 1 && attr[label][0] === '*') {
    attr[label] = cacheResponse[map[label]].map((v) => v.value)
  }
}
function revertAll(attr, label) {
  const map = {
    apps: 'serviceList',
    levels: 'eventList',
  }
  if (attr[label].length === cacheResponse[map[label]].length) {
    attr[label] = ['*']
  }
}
</script>

<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
      <el-form-item label="启用Syslog" prop="enable">
        <el-switch v-model="form.enable" />
      </el-form-item>
      <el-form-item label="服务名称" prop="apps">
        <o-select
          v-model="form.apps"
          :disabled="!form.enable"
          :options="cacheResponse.serviceList"
          multiple
          label="name"
          width="100%"
        />
      </el-form-item>
      <el-form-item label="事件等级" prop="levels">
        <o-select
          v-model="form.levels"
          width="100%"
          multiple
          :disabled="!form.enable"
          :options="cacheResponse.eventList"
          label="name"
        />
      </el-form-item>
      <el-form-item label="服务器设置" prop="" required>
        <el-row>
          <el-form-item label="" prop="servers.host" class="">
            <o-input v-model="form.servers.host" title="ip地址" :disabled="!form.enable" />
          </el-form-item>
          <el-form-item label="" prop="servers.port" class="mlr2">
            <o-input v-model="form.servers.port" title="端口号" :disabled="!form.enable" />
          </el-form-item>
          <el-form-item label="" prop="servers.protocol">
            <o-select
              v-model="form.servers.protocol"
              title="连接模式"
              type="simple"
              :options="['TCP', 'UDP']"
              :disabled="!form.enable"
            />
          </el-form-item>
        </el-row>
      </el-form-item>
    </el-form>
    <g-warning content="添加服务器前，需测试该服务器是否可用" type="icon" />
    <div>
      <el-button type="primary" @click="save">保存</el-button>

      <el-button type="primary" :disabled="testDisabled || !form.enable" @click="test">测试</el-button>

      <el-button type="primary" :disabled="!form.enable" @click="reset">重置</el-button>
    </div>
  </div>
</template>
