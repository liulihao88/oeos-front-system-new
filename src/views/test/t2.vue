<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { getSchedules } from '@/api/tenantApi.ts'

const { proxy } = getCurrentInstance()
const form = ref({})
const formRef = ref(null)
const rules = {
  name: [proxy.validate()],
  age: [proxy.validate()],
}
const planOptions = ref([])

async function save() {
  await proxy.validForm(formRef)
}

async function infoInit() {
  let res = await Promise.all([getSchedules()])
  planOptions.value = res[0]
}
infoInit()
</script>

<template>
  <div class="c-new-box m-24">
    <o-title title="新建用户">
      <template #right>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </o-title>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
      <div class="c-form-title">基本信息</div>
      <el-row>
        <el-col :span="12" class="p-r-16">
          <el-form-item label="名称" prop="name">
            <o-input v-model="form.name" v-focus />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="别名" prop="age">
            <o-input v-model="form.age" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="p-r-16">
          <el-form-item label="密码" prop="password">
            <o-input v-model="form.password" v-focus />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="描述" prop="desc">
            <o-input v-model="form.desc" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="c-form-title">调度配置</div>
      <el-row>
        <el-col :span="12" class="p-r-16">
          <el-form-item label="计划任务" prop="planTask">
            <o-select v-model="form.planTask" :options="planOptions" label="name" />
          </el-form-item>
        </el-col>
        <el-col :span="12" />
      </el-row>
    </el-form>
  </div>
</template>

<style lang="scss" scoped></style>
