<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { getLogo, saveLogo, resetLogo } from '@/api/configApi.ts'

const { proxy } = getCurrentInstance()

const formRef = ref(null)
const form = ref({})
const rules = {
  brandImage: [proxy.validate()],
  brandTitle: [proxy.validate()],
  systemManagementTitle: [proxy.validate()],
  systemManagementImage: [proxy.validate()],
  tenantManagementTitle: [proxy.validate()],
  tenantManagementImage: [proxy.validate()],
  favariteIcon: [proxy.validate()],
}
const save = async () => {
  await proxy.validForm(formRef)
  await saveLogo(form.value)
  proxy.success('保存成功')
  init()
}

const reset = async () => {
  await proxy.validForm(formRef)
  let res = await resetLogo()
  proxy.success('重置成功')
  init()
}

async function init() {
  let res = await getLogo()
  form.value = res
}
</script>

<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-row class="w-100% mb2">
        <el-col :span="24">
          <div class="c-box p-24">
            <o-title title="品牌个性化配置" b="16" />
            <div class="f-st-ed">
              <div class="f-1">
                <el-form-item label="网络名称" prop="brandTitle">
                  <o-input v-model="form.brandTitle" />
                </el-form-item>
                <el-form-item label="网络图标" prop="favariteIcon">
                  <o-input v-model="form.favariteIcon" />
                </el-form-item>
              </div>
              <div class="f-1 p-24">
                <el-form-item label="品牌图标" prop="brandImage">
                  <o-input v-model="form.brandImage" />
                </el-form-item>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="16" class="m-b-24">
        <el-col :span="12">
          <div class="c-box p-24">
            <o-title title="系统管理登录界面个性化" b="16" />
            <el-form-item label="标题" prop="systemManagementTitle">
              <o-input v-model="form.systemManagementTitle" />
            </el-form-item>
            <el-form-item label="商标" prop="systemManagementImage">
              <o-input v-model="form.systemManagementImage" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="c-box p-24">
            <o-title title="系统管理登录界面个性化" b="16" />
            <el-form-item label="标题" prop="systemManagementTitle">
              <o-input v-model="form.systemManagementTitle" />
            </el-form-item>
            <el-form-item label="商标" prop="systemManagementImage">
              <o-input v-model="form.systemManagementImage" />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="c-box">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button style="margin-left: 10px" @click="reset">初始化</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
