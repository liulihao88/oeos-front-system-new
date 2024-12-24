<script setup lang="ts">
import { ref, getCurrentInstance, h } from 'vue'
import GWarning from '@/autoComponents/gWarning.vue'

import { saveComponent } from '@/api/storageApi'
import useCacheResponse from '@/store/cacheResponse'
const cacheResponse = useCacheResponse()

const { proxy } = getCurrentInstance()

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  locationOptions: {
    type: Array,
  },
})

const emits = defineEmits(['success'])

const formRef = ref(null)
const isShow = ref(false)
const isEdit = ref(false)
const originMappingPattern = ref('')
const form = ref({
  quotaUnit: 'GB',
  mappingPattern: '',
})
const originForm = ref({})
originForm.value = proxy.clone(form.value)

const rules = {
  name: [proxy.validate()],
  managementURL: [proxy.validate()],
  controllerHost: [proxy.validate()],
  volumeCode: [proxy.validate()],
  volumePath: [proxy.validate()],
  sharePointHost: [proxy.validate()],
  sharePointPort: [proxy.validate()],
  sharePointUser: [proxy.validate()],
  sharePointPassword: [proxy.validate()],
}

const confirm = async () => {
  await proxy.validForm(formRef)
  if (form.value.mappingPattern !== originMappingPattern.value) {
    await proxy.confirm('', {
      message: h(GWarning, {
        content: '修改寻址模式会导致原始对象无法正确读取，您确定需要修改吗？',
      }),
      customStyle: {
        maxWidth: '600px',
      },
      customClass: 'confirm-class',
      center: false,
      appendTo: '#blue-cache',
    })
  }
  await saveComponent(form.value)
  proxy.$toast('保存成功')
  emits('success')
  isShow.value = false
}

const editOpen = async (editItem) => {
  await cacheResponse.fetchDataCenter()
  isShow.value = true
  isEdit.value = true
  form.value = editItem
  originMappingPattern.value = editItem.mappingPattern
  formRef.value?.clearValidate()
}

const open = async (sendType) => {
  await cacheResponse.fetchDataCenter()
  isEdit.value = false
  form.value = proxy.clone(originForm.value)
  isShow.value = true
  form.value.type = sendType
  if (props.locationOptions.length > 0 && !form.value.mappingPattern) {
    originMappingPattern.value = props.locationOptions.filter((v) => v.value === 'Flat')[0].value
    form.value.mappingPattern = originMappingPattern.value
  }
  formRef.value?.clearValidate()
}

defineExpose({
  editOpen,
  open,
})
</script>

<template>
  <div>
    <o-dialog v-model="isShow" width="1000" :title="isEdit ? '编辑组件(蓝光)' : '新增组件(蓝光)'" @confirm="confirm">
      <el-form id="blue-cache" ref="formRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="组件类型" prop="type">
          <o-select
            v-model="form.type"
            :options="options"
            disabled
            value="value"
            :customLabel="(obj) => `${obj.name}(${obj.value})`"
          />
        </el-form-item>
        <el-form-item label="寻址模式" prop="mappingPattern">
          <!-- <a-radio-group v-model="form.mappingPattern">
            <span v-for="(v, i) in locationOptions" :key="i">
              <a-radio-button :value="v.value">{{ v.name }}</a-radio-button>
            </span>
          </a-radio-group> -->
          <o-radio v-model="form.mappingPattern" label="name" :options="props.locationOptions" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <o-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="管理URL" prop="managementURL">
          <o-input v-model="form.managementURL" />
        </el-form-item>
        <el-form-item label="蓝光主机" prop="controllerHost">
          <o-input v-model="form.controllerHost" />
        </el-form-item>
        <el-form-item v-if="isEdit" label="volumeId" prop="volumeId">
          <o-input v-model="form.volumeId" disabled />
        </el-form-item>
        <el-form-item label="卷池编码" prop="volumeCode">
          <o-input v-model="form.volumeCode" />
        </el-form-item>
        <el-form-item label="卷池路径" prop="volumePath">
          <o-input v-model="form.volumePath" />
        </el-form-item>
        <el-form-item label="数据池主机" prop="sharePointHost">
          <o-input v-model="form.sharePointHost" />
        </el-form-item>
        <el-form-item label="数据池名称">
          <o-input v-model="form.sharePointName" />
        </el-form-item>
        <el-form-item label="数据池端口" prop="sharePointPort">
          <o-input v-model="form.sharePointPort" v-number />
        </el-form-item>
        <el-form-item label="数据池用户" prop="sharePointUser">
          <o-input v-model="form.sharePointUser" />
        </el-form-item>
        <el-form-item label="数据池密码" :prop="isEdit ? '' : 'sharePointPassword'">
          <o-input v-model="form.sharePointPassword" type="password" />
        </el-form-item>

        <el-form-item label="挂载点">
          <o-input v-model="form.mountPoint" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <o-input v-model="form.description" type="textarea" />
        </el-form-item>
      </el-form>
    </o-dialog>
  </div>
</template>
