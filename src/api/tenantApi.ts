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

// 基本信息
export function getTenantBasic(id) {
  return request(`tenant/${id}/config/basic`)
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

// 服务配置
export function getGateway(id) {
  return request(`tenant/${id}/config/gateway`)
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
