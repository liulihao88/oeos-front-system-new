import request from '@/utils/request'

/**
 * 服务日志
 */

// 获取服务列表
export function getServiceOptions() {
  return request('common/support/apps', { type: 'common' })
}

// 获取节点列表
export function getNodeOptions() {
  return request('node/status')
}

// 获取日志列表
export function getLogList() {
  return request('log')
}

// 开始收集日志
export function startConnect(data) {
  return request('log/pack', 'put', { data })
}

// 删除日志
export function deleteLog(id) {
  return request(`log/${id}`, 'delete')
}

/**
 * 系统事件
 */

// 获取租户列表
export function getTenant() {
  return request('tenant/tenants')
}

// 获取系统事件列表
export function getEventList(data) {
  return request(`event/query?id=${data.id}`, 'put', { data: data, resolve: 'data' })
}

// 获取事件等级
export function getLevels() {
  return request('common/support/levels', { type: 'common' })
}

// 标记
// 标记确认->Awarded 确认解决->Solved  取消解决->Ignored
export function markEvent(id, type) {
  return request(`event/mark/${id}/${type}`, 'put')
}

// 删除事件
export function deleteEvent(id) {
  return request(`event/delete/${id}`, 'delete')
}

// 导出事件
export function exportEvent(data) {
  return request(`event/query/export?id=${data.id}`, 'put', { data: data, customResponse: true, responseType: 'blob' })
}
