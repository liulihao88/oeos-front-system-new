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

// 调度配置 -> 计划任务
export function getSchedules() {
  return request('schedule/schedules')
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
