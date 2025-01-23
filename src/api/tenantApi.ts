import request from '@/utils/request'

// 租户列表
/**
 *
 [
  {
    "name": "liu",
    "value": "T04"
  },
  {
    "name": "zhou",
    "value": "T01"
  },
  {
    "name": "song",
    "value": "T03"
  },
  {
    "name": "yuan",
    "value": "T02"
  }
]
 */
export function getTenants() {
  return request('tenant/tenants')
}

// 获取租户状态
export function getTenantStatus(id) {
  return request(`tenant/${id}/status`)
}

// 激活租户 tenant/T03/active
export function activeTenant(id) {
  return request(`tenant/${id}/active`, 'put')
}

// 停服 tenant/T04/deactive
export function deactiveTenant(id) {
  return request(`tenant/${id}/deactive`, 'put')
}

// 删除租户 tenant/T06
export function deleteTenant(id) {
  return request(`tenant/${id}`, 'delete')
}

// 获取租户使用量
export function getTenantUsage(id) {
  return request(`tenant/${id}/usage`)
}

// 基本信息
export function getTenantBasic(id) {
  return request(`tenant/${id}/config/basic`)
}

// 基本信息 -> 保存基本信息
/**
 * aliasName description name
 */
export function modifyBasic(id, data) {
  return request(`tenant/${id}/config/basic`, 'put', { data })
}

// 基本信息 -> 修改密码 superUser superUserPassword
export function modifyPwd(id, data) {
  return request(`tenant/${id}/reset/superuser`, 'put', { data })
}

// 调度配置 -> 计划任务列表
export function getSchedules() {
  return request('schedule/schedules')
}
// 调度配置 -> 计划任务详情
export function getTenantPlan(id) {
  return request(`tenant/${id}/config/plan`)
}
// 调度配置 -> 分片删除天数
export function tenantGc(id) {
  return request(`tenant/${id}/config/gc`)
}

// 调度配置 -> 修改任务计划 scheduleId
export function modifyPlan(id, data) {
  return request(`tenant/${id}/config/plan`, 'put', { data })
}

// 调度配置 -> 修改分片删除天数 maxMultipartRetainDays
export function modifyGc(id, data) {
  return request(`tenant/${id}/config/gc`, 'put', { data })
}

// 存储配置 -> 可用存储列表
export function getTiers() {
  return request('storage/standard/tier/tiers')
}

// 存储配置 -> 配额
export function getTenantQuota(id) {
  return request(`tenant/${id}/config/quota`)
}

// 存储配置 -> 默认主存储
export function getTenantStorage(id) {
  return request(`tenant/${id}/config/storage`)
}

// 存储配置 -> 修改可用存储
//accessibleStorages: ['STANDARD_STORAGE1', 'STANDARD_STORAGE2', 'GLACIER_STORAGE1'],   defaultStorage: 'STANDARD_STORAGE1'

export function modifyStorage(id, data) {
  return request(`tenant/${id}/config/storage`, 'put', { data })
}

// 存储配置 -> 修改配额 quota, quotaUnit
export function modifyQuota(id, data) {
  return request(`tenant/${id}/config/quota`, 'put', { data })
}

// 服务配置
export function getGateway(id) {
  return request(`tenant/${id}/config/gateway`)
}

// 服务配置 -> 修改服务配置信息 enableAutoRestore: true, gatewayS3HttpPort:"9009",gatewayS3HttpsPort:4431,maxMergableObjectSize:1,
export function modifyGateway(id, data) {
  return request(`tenant/${id}/config/gateway`, 'put', { data })
}

// 租户对象信息
export function getTenantHistogram(id) {
  return request(`tenant/${id}/histogram`)
}

/**
 * 保存
 * {
  "tenant": "",
  "quota": "1.0",
  "quotaUnit": "GB",
  "description": "desc",
  "storagePoolId": "",
  "scheduleId": "INNERSCHEDULE0",
  "cachePolicy": "",
  "maxMultipartRetainDays": 7,
  "gatewayS3HttpPort": "-1",
  "gatewayS3HttpsPort": "-1",
  "aliasName": "andy1",
  "name": "andy",
  "superUser": "admin",
  "maxMergableObjectSize": 0,
  "enableAutoRestore": false,
  "superUserPassword": "kG6/svk66K1KSF+ulvb6aHSEpY+b/YZkN/qwvYfy/Y/oEhUN00F/IDxhynTNvUU9EpBaSmhIoqzw7GDcbFdZwA==",
  "accessibleStorages": [
    "STANDARD_STORAGE1",
    "STANDARD_STORAGE2",
    "GLACIER_STORAGE1",
    "GLACIER_STORAGE2",
    "GLACIER_STORAGE3",
    "GLACIER_STORAGE4",
    "GLACIER_STORAGE4in1",
    "GLACIER_STORAGE_R0"
  ],
  "defaultStorage": "STANDARD_STORAGE1",
  "otherName": "andy1"
}
 */
export function saveTenant(data) {
  return request('tenant', 'post', { data })
}
