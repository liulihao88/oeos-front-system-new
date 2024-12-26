<script setup lang="ts">
import { ref, getCurrentInstance, watch } from 'vue'
import { getAuditConfig, saveAuditConfig } from '@/api/configApi.ts'

const { proxy } = getCurrentInstance()
const form = ref({})

const init = async () => {
  let res = await getAuditConfig()
  form.value = res
}
init()

const save = async () => {
  if (!form.value.keepDays) {
    return proxy.$toast('审计日志保留天数请输入正确数值', 'e')
  }
  await saveAuditConfig(form.value)
  proxy.$toast('保存成功')
}

watch(
  form.value.keepDays,
  (val) => {
    console.log(`55 val`, val)
    if (val > 0 && val < 180) {
      form.value.keepDays = 180
    }
  },
  {
    immediate: true,
    deep: true,
  },
)
const keepDaysChange = () => {
  if (form.value.keepDays > 0 && form.value.keepDays < 180) {
    form.value.keepDays = 180
  }
}
</script>

<template>
  <div>
    <div>
      <span>设置审计日志保留天数(最短默认 180 天, 设置为 0 表示永久保存):</span>
      <el-input-number v-model="form.keepDays" :min="0" :disabled="!form.enable" @blur="keepDaysChange" />
    </div>

    <div>
      <span class="mr">同意开启如下审计功能:</span>
      <el-switch v-model="form.enable" />
    </div>

    <div>
      <div>1、 系统用户登录及退出的日志审计。</div>
      <div>2、 系统数据的备份及恢复的日志审计。</div>
      <div>3、 桶的创建、修改、删除、配置的日志审计。</div>
      <div>4、 调度的新增，修改，删除配置的日志审计。</div>
      <div>5、 组、用户数据安全内容的创建、修改、删除的日志审计。</div>
      <div>6、 存储的新增、修改、删除配置的日志审计。</div>
      <div>7、 系统参数的配置，修改的日志审计。</div>
    </div>

    <el-button type="primary" @click="save">保存</el-button>
  </div>
</template>
