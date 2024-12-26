<script setup lang="ts">
/**
let obj = {
		"name": "D节点存储层",
		"type": "DSeriesStorage",
		"readOnly": true,
		"quota": 1,
		"quotaUnit": "TB",
		"deviceClass": "",
		"storageDeviceID": "",
		"endpoint": "datacenter.oeoshost:19000",
		"bucketName": "dtspace1",
		"port": -1,
		"enableSSL": false,
		"ak": "datacenteradmin",
		"sk": "datacenteradmin",
		"signerType": "v4",
		"supportBatchDelete":false,
		"deleteThread":10,
		"mapiHost": "127.0.0.1",
		"mapiPort": 9093
		"description": null,
	}

  dcname: ''
 */
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
  type: {
    type: String, // S3CompatibleStorage, DSeriesStorage, InternalDSeriesStorage, HCPSSeriesStorage
    default: '',
  },
  locationOptions: {
    type: Array,
  },
})

const emits = defineEmits(['success'])

const formRef = ref(null)

const signOptions = [
  { label: 'Default', value: 'Default' },
  { label: 'Signature Version 4', value: 'V4' },
  { label: 'Signature Version 2', value: 'V2' },
]
const isShow = ref(false)
const isEdit = ref(false)
const originMappingPattern = ref('')
const form = ref({
  quotaUnit: 'GB',
  signerType: 'V4',
  mappingPattern: '',
})
const originForm = ref({})
originForm.value = proxy.clone(form.value)

const rules = {
  apiVersion: [proxy.validate()],
  name: [proxy.validate()],
  quota: [proxy.validate()],
  endpoint: [proxy.validate()],
  bucketName: [proxy.validate()],
  port: [proxy.validate()],
  enableSSL: [proxy.validate()],
  ak: [proxy.validate()],
  username: [proxy.validate()],
  password: [proxy.validate()],
  sk: [proxy.validate()],
  signerType: [proxy.validate('请选择')],
  mapiHost: [proxy.validate()],
  mapiPort: [proxy.validate()],
  dcname: [proxy.validate('请选择')],
}

const customLabel = (item) => {
  return `名称: ${item.name}, 状态: ${item.statusTitle}, 总容量: ${proxy.formatBytes(
    item.totalSpace,
  )}, 已用容量: ${proxy.formatBytes(item.usedSpace)}`
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
      appendTo: '#highSettingsForm',
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
  formRef.value.clearValidate()
}

defineExpose({
  editOpen,
  open,
})
</script>

<template>
  <div>
    <o-dialog
      v-model="isShow"
      width="1000"
      :title="isEdit ? `编辑组件(${type})` : `新增组件(${type})`"
      @confirm="confirm"
    >
      <el-form id="highSettingsForm" ref="formRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="组件类型" prop="type">
          <o-select
            v-model="form.type"
            :options="options"
            disabled
            :customLabel="(obj) => `${obj.name}(${obj.value})`"
          />
        </el-form-item>
        <el-form-item label="寻址模式" prop="mappingPattern">
          <!-- <el-radio-group v-model="form.mappingPattern">
            <span v-for="(v, i) in locationOptions" :key="i" class="mr">
              <el-radio :value="v.value" class="mr">{{ v.name }}</el-radio>
            </span>
          </el-radio-group> -->
          <o-radio v-model="form.mappingPattern" :options="locationOptions" label="name" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <o-input v-model="form.name" />
        </el-form-item>

        <el-form-item v-if="type === 'S3CompatibleStorage'" label="配额" prop="quota">
          <div class="f-bt-ct">
            <o-input v-model="form.quota" class="w-150" />
            <el-radio-group v-model="form.quotaUnit">
              <el-radio value="GB">GB</el-radio>
              <el-radio value="TB">TB</el-radio>
              <el-radio value="PB">PB</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item v-if="type !== 'InternalDSeriesStorage'" label="端点" prop="endpoint">
          <o-input v-model="form.endpoint" />
        </el-form-item>
        <el-form-item v-if="type !== 'InternalDSeriesStorage'" label="桶名称" prop="bucketName">
          <o-input v-model="form.bucketName" />
        </el-form-item>

        <el-form-item v-if="type !== 'InternalDSeriesStorage'" label="端口" prop="port">
          <o-input v-model="form.port" v-number />
        </el-form-item>
        <el-form-item v-if="type !== 'InternalDSeriesStorage'" label="启用SSL">
          <el-switch v-model="form.enableSSL" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item v-if="type !== 'InternalDSeriesStorage'" label="accessKey" prop="ak">
          <o-input v-model="form.ak" />
        </el-form-item>
        <el-form-item v-if="type !== 'InternalDSeriesStorage'" label="secretKey" :prop="isEdit ? '' : 'sk'">
          <o-input v-model="form.sk" />
        </el-form-item>
        <el-form-item v-if="type !== 'InternalDSeriesStorage'" label="签名类型" prop="signerType">
          <o-select v-model="form.signerType" :options="signOptions" placeholder="请选择" />
        </el-form-item>
        <el-form-item
          v-if="type !== 'S3CompatibleStorage' && type !== 'InternalDSeriesStorage' && type !== 'HCPSSeriesStorage'"
          label="MAPI主机"
          prop="mapiHost"
        >
          <o-input v-model="form.mapiHost" />
        </el-form-item>
        <el-form-item
          v-if="type !== 'S3CompatibleStorage' && type !== 'InternalDSeriesStorage' && type !== 'HCPSSeriesStorage'"
          label="MAPI端口"
          prop="mapiPort"
        >
          <o-input v-model="form.mapiPort" v-number />
        </el-form-item>
        <el-form-item v-if="type === 'InternalDSeriesStorage'" label="数据中心名称" prop="dcname">
          <o-select
            v-model="form.dcname"
            :customLabel="customLabel"
            style="width: 100%"
            :options="cacheResponse.dataCenterList"
            value="name"
            label="name"
          />
        </el-form-item>

        <el-form-item v-if="type === 'HCPSSeriesStorage'" label="用户名" prop="username">
          <o-input v-model="form.username" />
        </el-form-item>
        <el-form-item v-if="type === 'HCPSSeriesStorage'" label="密码" :prop="isEdit ? '' : 'password'">
          <o-input v-model="form.password" />
        </el-form-item>
        <el-form-item v-if="type === 'HCPSSeriesStorage'" label="API版本号" prop="apiVersion">
          <o-input v-model="form.apiVersion" />
        </el-form-item>

        <el-form-item label="描述">
          <o-input v-model="form.description" type="textarea" />
        </el-form-item>
      </el-form>
    </o-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-overlay.is-message-box .el-overlay-message-box) {
  bottom: 20vh;
}
</style>
