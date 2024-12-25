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
