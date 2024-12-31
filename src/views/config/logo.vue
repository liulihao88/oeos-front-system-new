<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { getLogo, saveLogo, resetLogo } from '@/api/configApi.ts'

const { proxy } = getCurrentInstance()

const formRef = ref(null)
const form = ref({
  favariteIcon: '',
})
const rules = ref({
  brandImage: [proxy.validate('请选择')],
  brandTitle: [proxy.validate()],
  systemManagementTitle: [proxy.validate()],
  systemManagementImage: [proxy.validate('请选择')],
  tenantManagementTitle: [proxy.validate()],
  tenantManagementImage: [proxy.validate('请选择')],
  favariteIcon: [proxy.validate('请选择')],
})
const save = async () => {
  await proxy.validForm(formRef)
  await saveLogo(form.value)
  proxy.$toast('保存成功')
  init()
}

const reset = async () => {
  await proxy.validForm(formRef)
  await resetLogo()
  proxy.$toast('重置成功')
  init()
}

const changeFile = (itemName) => {
  console.log(`48 itemName`, itemName)
  formRef.value.validate()
}

async function init() {
  let res = await getLogo()
  form.value = res
}
init()
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
                  <g-upload-img v-model="form.favariteIcon" @changeFile="changeFile" />
                </el-form-item>
              </div>
              <div class="f-1 p-24">
                <el-form-item label="品牌图标" prop="brandImage">
                  <g-upload-img v-model="form.brandImage" @changeFile="changeFile" />
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
            <el-form-item label="标题" prop="tenantManagementTitle">
              <o-input v-model="form.tenantManagementTitle" />
            </el-form-item>
            <el-form-item label="商标" prop="tenantManagementImage">
              <g-upload-img v-model="form.tenantManagementImage" @changeFile="changeFile" />
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
              <g-upload-img v-model="form.systemManagementImage" @changeFile="changeFile" />
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
