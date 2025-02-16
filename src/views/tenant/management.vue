<script setup lang="ts">
import { ref, getCurrentInstance, computed } from 'vue'
import BucketNumPie from '@/views/tenant/component/bucketNumPie.vue'
import UsedPie from '@/views/tenant/component/usedPie.vue'

import {
  activeTenant,
  deactiveTenant,
  deleteTenant,
  getTenantUsage,
  getTenants,
  getTenantStatus,
  getSchedules,
  getTiers,
  saveTenant,
  getTenantBasic,
  getTenantPlan,
  tenantGc,
  getTenantQuota,
  getTenantStorage,
  getGateway,
  getTenantHistogram,
  modifyBasic,
  modifyPwd,
  modifyPlan,
  modifyGc,
  modifyStorage,
  modifyQuota,
  modifyGateway,
} from '@/api/tenantApi.ts'
import { encryptionPassword } from '@/api/login.ts'
import { TENANT_STATUS, QUOTA_UNIT } from '@/assets/globalData.ts'
import { checkChanges } from '@/utils/gFunc.ts'
import { pick } from 'lodash-es'

const { proxy } = getCurrentInstance()
const searchValue = ref('')
const tableRef = ref(null)
const formRef = ref(null)
const data = ref([])
const originData = ref([])
const selectRow = ref({})
const planOptions = ref([])
const storageOptions = ref([])
const admin = proxy.getStorage('system-sysdomain')
const autoAssignment = ref(true)
const selectedRows = ref({})
const superUser = ref(admin.loginName)
const baseObj = ref({})
const planObj = ref({})
const quotaObj = ref({})
const storageObj = ref({})
const gatewayObj = ref({})
const objectNumData = ref([])
const spaceObj = ref({})
const gcObj = ref({})
const isEdit = ref(false)

const columns = [
  {
    label: '租户',
    prop: 'name',
  },
  {
    label: '状态',
    prop: 'status',
    useSlot: true,
  },
  {
    key: 'operation',
    label: '操作',
    maxBtns: 5,
    width: 210,
    btns: [
      {
        content: '激活',
        handler: activeRow,
        comp: 'o-icon',
        attrs: {
          name: 'active',
          type: 'svg',
          content: '激活',
        },
      },
      {
        content: '停服',
        handler: deactiveRow,
        comp: 'o-icon',
        attrs: {
          name: 'stop',
          type: 'svg',
          content: '停服',
        },
      },
      {
        content: '删除',
        handler: deleteRow,
        comp: 'o-icon',
        attrs: {
          name: 'delete',
          type: 'svg',
          content: '删除',
        },
        reConfirm: !proxy.$dev,
      },
      {
        content: '跳转',
        handler: jumpRow,
        comp: 'o-icon',
        attrs: {
          name: 'jump',
          type: 'svg',
          content: '跳转',
        },
      },
    ],
  },
]
const form = ref({
  quotaUnit: 'GB',
  accessibleStorages: [],
  maxMultipartRetainDays: 7,
  quotaUnit: 'TB',
})
const originForm = ref()
originForm.value = proxy.clone(form)
const rules = computed(() => {
  return {
    name: [proxy.validate()],
    aliasName: [proxy.validate()],
    superUserPassword: [
      !isEdit.value && proxy.validate(),
      proxy.validate('length', { max: 40, min: 8, required: false }),
    ],
    scheduleId: [proxy.validate('请选择')],
    maxMultipartRetainDays: [proxy.validate()],
    accessibleStorages: [proxy.validate('请选择')],
    quotaUnit: [proxy.validate()],
    maxMergableObjectSize: [proxy.validate()],
    gatewayS3HttpPort: autoAssignment.value ? [] : [proxy.validate('port')],
    defaultStorage: [proxy.validate()],
  }
})

const devForm = computed(() => {
  return {
    name: proxy.uuid('name'),
    aliasName: proxy.uuid('aliasName'),
    superUserPassword: proxy.uuid('adminadmin'),
    scheduleId: proxy.uuid(planOptions.value),
    accessibleStorages: [storageOptions.value[0].value],
    defaultStorage: storageOptions.value[0].value,
    quota: 1,
    maxMergableObjectSize: 1000,
    gatewayS3HttpPort: '',
  }
})

const refresh = () => {}
const newAdd = () => {
  reset()
  form.value = proxy.clone(originForm)
  console.log(`62 devForm.value`, devForm.value)
  if (proxy.$dev) {
    form.value = Object.assign(form.value, devForm.value)
  }
}
const saveModify = async () => {
  let baseForm = checkChanges(form.value, baseObj.value)
  if (baseForm) {
    await modifyBasic(selectedRows.value.value, baseForm)
  }
  if (form.value.superUserPassword) {
    let genPwd = await encryptionPassword(form.value.superUserPassword)
    let sendObj = {
      superUserPassword: genPwd[0],
      superUser: superUser.value,
    }
    await modifyPwd(selectedRows.value.value, sendObj)
  }
  let planForm = checkChanges(form.value, planObj.value)
  if (planForm) {
    await modifyPlan(selectedRows.value.value, planForm)
  }
  let gcForm = checkChanges(form.value, gcObj.value)
  if (gcForm) {
    await modifyGc(selectedRows.value.value, gcForm)
  }
  let storageForm = checkChanges(form.value, storageObj.value)
  if (storageForm) {
    await modifyStorage(selectedRows.value.value, storageForm)
  }
  let quotaForm = checkChanges(form.value, quotaObj.value)
  if (quotaForm) {
    let newQuotaForm = pick(quotaForm, ['quota', 'quotaUnit'])
    await modifyQuota(selectedRows.value.value, newQuotaForm)
  }
  let gatewayForm = checkChanges(form.value, gatewayObj.value)
  if (gatewayForm) {
    await modifyGateway(selectedRows.value.value, gatewayForm)
  }
  proxy.$toast('修改成功')
}
const save = async () => {
  await proxy.validForm(formRef)
  if (isEdit.value) {
    saveModify()
    return
  }
  const copyForm = proxy.clone(form)
  let genPwd = await encryptionPassword(form.value.superUserPassword)
  copyForm.superUserPassword = genPwd[0]
  if (autoAssignment.value) {
    copyForm.gatewayS3HttpPort = -1
  }
  copyForm.superUser = superUser.value
  await saveTenant(copyForm)
  proxy.$toast('保存成功')
}

const handleCurrentChange = async (currentRow, oldCurrentRow) => {
  if (proxy.notEmpty(currentRow)) {
    selectRow.value = currentRow
    isEdit.value = true
    selectedRows.value = currentRow
    proxy.setStorage('system-tenant-id', currentRow.value)
    let id = currentRow.value
    let res = await Promise.all([
      getTenantBasic(id),
      getTenantPlan(id),
      getTenantQuota(id),
      getTenantStorage(id),
      getGateway(id),
      tenantGc(id),
      getTenantHistogram(id),
      getTenantUsage(id),
    ])

    baseObj.value = res[0]
    planObj.value = res[1]
    quotaObj.value = res[2]
    storageObj.value = res[3]
    gatewayObj.value = res[4]
    gcObj.value = res[5]
    objectNumData.value = Object.entries(res[6].inCount).map(([name, value]) => {
      return { value: value === 0 ? null : value, name: name, size: res[6].inSize[name] }
    })
    spaceObj.value = res[7]

    form.value = {
      ...res[0],
      ...res[1],
      ...res[2],
      ...res[3],
      ...res[4],
      ...res[5],
    }
  }
}

const reset = () => {
  selectRow.value = {}
  baseObj.value = {}
  planObj.value = {}
  gcObj.value = {}
  storageObj.value = {}
  quotaObj.value = {}
  gatewayObj.value = {}
  selectedRows.value = {}
  objectNumData.value = []
  spaceObj.value = {}
  isEdit.value = false
  tableRef.value.$refs.tableRef.setCurrentRow(null)
}

const _handleRowClick = () => {
  let clickIdx = 0
  let localTenantId = proxy.getStorage('system-tenant-id') || ''
  if (data.value.length === 0) {
    reset()
    return
  }
  if (localTenantId) {
    let taskNameIdx = data.value.findIndex((item) => {
      return item.name === localTenantId
    })
    clickIdx = taskNameIdx === -1 ? 0 : taskNameIdx
  }
  tableRef.value.$refs.tableRef.setCurrentRow(data.value[clickIdx])
}

async function init() {
  let res = await getTenants()
  data.value = res
  originData.value = res
  const detailsResp = []
  for (let i = 0; i < data.value.length; i++) {
    detailsResp.push(getTenantStatus(data.value[i].value))
  }
  let res2 = await Promise.all(detailsResp)
  console.log(`89 res2`, res2)
  data.value = data.value.map((item, index) => {
    return {
      ...item,
      ...res2[index],
    }
  })
  _handleRowClick()
}
init()

async function infoInit() {
  let res = await Promise.all([getSchedules(), getTiers()])
  planOptions.value = res[0]
  storageOptions.value = res[1]
}
infoInit()

async function activeRow(row) {
  await activeTenant(row.value)
  proxy.$toast('操作成功')
}
async function deactiveRow(row) {
  await deactiveTenant(row.value)
  proxy.$toast('操作成功')
}
async function deleteRow(row) {
  await deleteTenant(row.value)
  proxy.$toast('操作成功')
}
const accessibleChange = () => {
  form.value.defaultStorage = ''
}
const searchHandler = () => {
  if (!searchValue.value) {
    data.value = proxy.clone(originData.value)
    restoreHighLight()
    return
  }
  data.value = originData.value.filter((item) => {
    return item.name.includes(searchValue.value)
  })
  restoreHighLight()
}

function jumpRow(item) {
  let origin = location.origin
  let tenantUrl = ''
  if (proxy.$dev) {
    let deletePortOrigin = origin.replace(/:\d+$/, ':')
    tenantUrl = deletePortOrigin + '8848/tenant/login?tenantValue=' + item.value
  } else {
    let deletePortOrigin = origin.replace(/:\d+$/, ':')
    tenantUrl = deletePortOrigin + '8008/tenant/login?tenantValue=' + item.value
  }
  window.open(tenantUrl)
}

async function restoreHighLight() {
  let matchRow = data.value.find((item) => {
    return item.value === selectRow.value.value
  })
  if (matchRow) {
    tableRef.value.$refs.tableRef.setCurrentRow(matchRow)
  }
}
const title = computed(() => {
  return proxy.isEmpty(selectedRows.value)
    ? '新建租户'
    : `租户-[${selectedRows.value.name}]=[${selectedRows.value.value}]`
})
const outOfServiceDisabled = computed(() => {
  if (isEdit.value) {
    if (selectedRows.value.status !== 'OutOfService') {
      return true
    }
    return false
  }
  return false
})
const spaceContent = computed(() => {
  return `已使用：${proxy.formatBytes(spaceObj.value.usedSpace)}，<br>总容量：${proxy.formatBytes(spaceObj.value.totalSpace)},<br/> 对象数量: ${spaceObj.value.objectCount},<br> 对象大小: ${proxy.formatBytes(spaceObj.value.objectSize)},<br> 使用级别: ${spaceObj.value.usageLevel}`
})
</script>

<template>
  <div class="box">
    <el-row :gutter="16" class="h-100%">
      <el-col :span="6" class="h-100%">
        <div class="left c-box h-100%">
          <div class="left-top f-bt-ct mb2">
            <o-input v-model="searchValue" v-throttle.300="searchHandler" title="租户名" width="200" class="mr" />
            <div class="f">
              <el-button icon="el-icon-refresh" @click="refresh">刷新</el-button>
              <el-button icon="el-icon-plus" type="primary" @click="newAdd">新建</el-button>
            </div>
          </div>

          <o-table
            ref="tableRef"
            :columns="columns"
            :data="data"
            :showPage="false"
            :showIndex="false"
            height="100%"
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <template #status="{ value, row }">
              <div class="w-95%">
                <el-tag v-if="value === 'InService'">{{ TENANT_STATUS[value] }}</el-tag>
                <el-tag v-else-if="value === 'Issue'" type="danger">{{ TENANT_STATUS[value] }}</el-tag>
                <el-tag v-else type="info">{{ TENANT_STATUS[value] }}</el-tag>
              </div>
            </template>
          </o-table>
        </div>
      </el-col>
      <el-col :span="12" class="h-100%">
        <div class="main c-box h-100%">
          <div class="main-header">
            <o-title :title="title">
              <el-button type="primary" class="ml2" icon="el-icon-save" @click="save">保存</el-button>
            </o-title>
          </div>
          <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <div class="c-form-title">基本配置</div>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="名称" prop="name">
                  <o-input v-model="form.name" :min="3" :max="30" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="别名" prop="aliasName">
                  <o-input v-model="form.aliasName" :min="3" :max="30" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="管理员" prop="superUser">
                  <o-input v-model="superUser" disabled width="100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="密码" prop="superUserPassword">
                  <o-input v-model="form.superUserPassword" width="100%" placeholder="8-40位字符组合、特殊字符可选" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="描述" prop="description">
              <o-input v-model="form.description" type="textarea" />
            </el-form-item>

            <div class="c-form-title">调度配置</div>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="计划任务" prop="scheduleId">
                  <o-select v-model="form.scheduleId" :options="planOptions" label="name" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分片删除天数" prop="maxMultipartRetainDays">
                  <el-input-number v-model="form.maxMultipartRetainDays" :min="0" />
                </el-form-item>
              </el-col>
            </el-row>

            <div class="c-form-title">存储配置</div>
            <el-row :gutter="16">
              <el-col :span="24">
                <el-form-item label="可用存储" prop="accessibleStorages">
                  <o-select
                    v-model="form.accessibleStorages"
                    multiple
                    width="100%"
                    :options="storageOptions"
                    label="name"
                    collapse-tags
                    collapse-tags-tooltip
                    :max-collapse-tags="3"
                    @change="accessibleChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="默认主存储" prop="defaultStorage">
                  <o-select
                    v-model="form.defaultStorage"
                    width="100%"
                    :disabled="form.accessibleStorages.length === 0"
                    :options="form.accessibleStorages"
                    type="simple"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="配额" prop="quota">
                  <div class="f-bt-ct w-100%">
                    <el-input-number v-model="form.quota" :min="0" :precision="1" style="width: 120px" />
                    <o-radio v-model="form.quotaUnit" :options="QUOTA_UNIT" showType="button" />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <div class="c-form-title">服务配置</div>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="最大合并大小" prop="maxMergableObjectSize">
                  <o-input v-model="form.maxMergableObjectSize" :disabled="outOfServiceDisabled">
                    <template #suffix>kb</template>
                  </o-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="S3-HTTP端口" prop="gatewayS3HttpPort">
                  <div class="f-st-ct">
                    <o-input
                      v-model="form.gatewayS3HttpPort"
                      class="mr"
                      :disabled="isEdit ? outOfServiceDisabled : autoAssignment"
                    />
                    <el-checkbox v-if="!isEdit" v-model="autoAssignment">自动分配</el-checkbox>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="自动解冻" prop="enableAutoRestore">
              <div class="f-st-tp">
                <el-switch v-model="form.enableAutoRestore" :disabled="outOfServiceDisabled" />
                <o-warning type="icon" style="padding: 0; padding-left: 8px" content="读取对象时自动触发对象解冻任务" />
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="6" class="h-100%">
        <div class="right h-100%">
          <BucketNumPie :data="objectNumData" class="f-1 bg-white mb2" />
          <o-tooltip :content="spaceContent" raw-content class="f-1">
            <UsedPie class="f-1 bg-white" type="used" :used="spaceObj.usedSpace" :total="spaceObj.totalSpace" />
          </o-tooltip>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.box {
  height: calc(100vh);
}

.left {
  // background: #fff;
  // padding: 0 16px;
}

.main {
  // background: #fff;
  // padding: 0 16px;
}

.right {
  display: flex;
  flex-direction: column;
}
</style>
