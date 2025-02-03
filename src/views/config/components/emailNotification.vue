<script setup lang="ts">
import { ref, getCurrentInstance, computed } from 'vue'
const { proxy } = getCurrentInstance()
import useCacheResponse from '@/store/cacheResponse'
const cacheResponse = useCacheResponse()

import { getLog, saveLog, syslogTest, syslogReset } from '@/api/configApi.ts'

cacheResponse.fetchServiceList()
cacheResponse.fetchEventList()

const TYPE = 'email'
const formRef = ref(null)
const form = ref({})
const rules = {
  apps: [proxy.validate('请选择')],
  levels: [proxy.validate('请选择')],
  protcol: [proxy.validate('请选择')],
  host: [proxy.validate('ip')],
  port: [proxy.validate('port')],
  sendUser: [proxy.validate()],
  sendPassword: [proxy.validate()],
  receiveUser: [proxy.validate()],
  templateTitle: [proxy.validate()],
  templateBody: [proxy.validate()],
}
const save = async () => {
  await proxy.validForm(formRef)
  let sendForm = proxy.clone(form)
  revertAll(sendForm, 'apps')
  revertAll(sendForm, 'levels')
  saveLog(sendForm, TYPE)
  proxy.$toast('保存成功')
  init()
}
const test = async () => {
  await proxy.validForm(formRef)
  await syslogTest(form.value, TYPE)
  proxy.$toast('测试成功')
}
const reset = async () => {
  await proxy.confirm('重置后, 信息设置将清空')
  await syslogReset(TYPE)
  form.value = {}
  proxy.$toast('重置成功')
  init()
}

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
      <el-form-item label="支持邮件通知" prop="enable">
        <el-switch v-model="form.enable" />
      </el-form-item>
      <div class="c-form-title">服务器设置</div>

      <el-row>
        <el-form-item label="" prop="host">
          <o-input v-model="form.host" :disabled="!form.enable" title="服务器地址" />
        </el-form-item>
        <el-form-item label="是否支持tls" prop="isTls">
          <el-switch v-model="form.isTls" :disabled="!form.enable" class="mrl2" />
        </el-form-item>
        <el-form-item label="" prop="port">
          <o-input v-model="form.port" :disabled="!form.enable" title="端口" class="ml" />
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="" prop="protcol">
          <o-select
            v-model="form.protcol"
            :disabled="!form.enable"
            type="simple"
            title="协议"
            :options="['SMTP']"
            style="height: 32px"
          />
        </el-form-item>
        <el-form-item label="" prop="sendUser">
          <o-input v-model="form.sendUser" :disabled="!form.enable" title="用户名" class="mlr" />
        </el-form-item>
        <el-form-item label="" prop="sendPassword">
          <o-input v-model="form.sendPassword" :disabled="!form.enable" title="密码/授权码" class="ml" />
        </el-form-item>
      </el-row>

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

      <div class="c-form-title">信息设置</div>
      <g-warning content="信息设置填写必读" type="icon" />
      <div>
        一、用户可自定义信息内容发送 ; 二、可添加模板字符（服务端将根据模板解析适配内容）, 以下示例为模板字段 : 1、
        {service} ，将会解析匹配的 服务名称 2、 {level} ，将会解析匹配的 消息等级 3、 {message} ，将会解析匹配的
        消息内容 4、 {date} ，将会解析匹配的 发送时间
      </div>

      <el-form-item label="接收人信箱" prop="receiveUser">
        <o-input v-model="form.receiveUser" :disabled="!form.enable" />
      </el-form-item>
      <el-form-item label="标题" prop="templateTitle">
        <o-input v-model="form.templateTitle" :disabled="!form.enable" />
      </el-form-item>
      <el-form-item label="正文" prop="templateBody">
        <o-input v-model="form.templateBody" type="textarea" :disabled="!form.enable" />
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" :disabled="!form.enable" @click="test">测试</el-button>

      <el-button type="primary" :disabled="!form.enable" @click="reset">重置</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
