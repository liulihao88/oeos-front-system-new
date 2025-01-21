<script setup lang="ts">
import { ref, getCurrentInstance, computed } from 'vue'
const { proxy } = getCurrentInstance()
import useCacheResponse from '@/store/cacheResponse'
const cacheResponse = useCacheResponse()

import { getLog, saveLog, syslogTest, syslogReset } from '@/api/configApi.ts'

cacheResponse.fetchServiceList()
cacheResponse.fetchEventList()

const TYPE = 'snmp'

const formRef = ref(null)
const form = ref({
  server: {},
})
const rules = {
  apps: [proxy.validate('请选择')],
  levels: [proxy.validate('请选择')],
  'server.host': [proxy.validate('ip')],
  'server.port': [proxy.validate('port')],
  'server.organizationOID': [proxy.validate()],
  'server.messageOID': [proxy.validate()],
}
const save = async () => {
  await proxy.validForm(formRef)
  let sendForm = proxy.clone(form)
  revertAll(sendForm, 'apps')
  revertAll(sendForm, 'levels')
  saveLog(sendForm, TYPE)
  proxy.$toast('保存成功')
  init(TYPE)
}
const test = async () => {
  let testData = {
    host: form.value.server.host,
    port: form.value.server.port,
    organizationOID: form.value.server.organizationOID,
    messageOID: form.value.server.messageOID,
  }
  await syslogTest(testData, TYPE)
  proxy.$toast('测试成功')
}
const reset = async () => {
  await proxy.confirm('重置后, 信息设置将清空')
  await syslogReset(TYPE)
  form.value = {
    server: {},
  }
  proxy.$toast('重置成功')
}

const testDisabled = computed(() => {
  const { server } = form.value
  return !server.host || !server.port || !server.organizationOID || !server.messageOID
})
async function init() {
  let res = await getLog(TYPE)
  form.value = res
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
      <el-form-item label="启用SNMP" prop="enable">
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
          <el-form-item label="" prop="server.host" class="">
            <o-input v-model="form.server.host" title="ip地址" :disabled="!form.enable" />
          </el-form-item>
          <el-form-item label="" prop="server.port" class="mlr2">
            <o-input v-model="form.server.port" title="端口号" :disabled="!form.enable" />
          </el-form-item>
          <el-form-item label="" prop="server.organizationOID">
            <o-input v-model="form.server.organizationOID" title="组织OID" :disabled="!form.enable" class="mr2" />
          </el-form-item>
          <el-form-item label="" prop="server.messageOID">
            <o-input v-model="form.server.messageOID" title="消息OID" :disabled="!form.enable" />
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
