import request from '@/utils/request'

/**
 * 系统概览页
 */
// 获取iframe的oeos的url
// http://10.0.11.102:13000/d/oeos-dashboard-0/?kiosk&from=now-7d&to=now
export function getOeosUrl() {
  return request('info/overview-oeos-url')
}

// 获取iframe的node的url
// http://10.0.11.102:13000/d/oeos-dashboard-2/?kiosk&from=now-7d&to=now
export function getNodeUrl() {
  return request('info/overview-node-url')
}

// 获取hint
export function getHint() {
  return request('info/hint')
}

/**
 * 存储概览
 */

// 获取存储概览
export function getStorageUrl() {
  return request('info/overview-storage-url')
}
