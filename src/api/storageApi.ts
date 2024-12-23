import request from '@/utils/request'

/**
 * 存储概览
 */
// 缓存概览列表
export function getCacheSummaries() {
  return request('storage/standard/cache/summaries')
}

/**
 * 存储层
 */
// 存储层列表
export function getSummaries() {
  return request('storage/standard/tier/summaries')
}

// 获取池列表
export function getPools() {
  return request('storage/standard/pool/pools')
}

// 新建存储层
export function saveTier(data) {
  return request('storage/standard/tier', 'put', { data: data })
}

// 删除存储层
export function deleteTier(name) {
  return request(`storage/standard/tier/${name}`, 'delete')
}
