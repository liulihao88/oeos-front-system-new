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

/**
 * 池配置
 */
// 池配置列表
export function getPoolList() {
  return request('storage/standard/pool/summaries')
}

// 根据类型获取组件列表
export function getComponentsList(type) {
  return request(`storage/standard/component/components?type=${type}`)
}

// 保存池配置
export function savePool(data) {
  return request('storage/standard/pool', 'put', { data })
}

// 测试
export function testPool(id) {
  return request(`storage/standard/pool/${id}/status/all`)
}

// 删除池
export function deletePool(id) {
  return request(`storage/standard/pool/${id}`, 'delete')
}

/**
 * 组件配置
 */
// 组件配置列表
export function getSummariesList() {
  return request('storage/standard/component/summaries')
}

// 组件详情
export function getSummariesDetail(id) {
  return request(`storage/standard/component/${id}`)
}

// 组件类型列表
export function getCompTypeList() {
  return request('common/support/storages', { type: 'common' })
}

// 事件中心列表
export function getCenterOptions() {
  return request('storage/internal/datacenters')
}

// mapping列表
export function getMappingList() {
  return request('common/support/mappingpatterns', { type: 'common' })
}

// 删除组件
export function deleteComponent(id) {
  return request(`storage/standard/component/${id}`, 'delete')
}

// 保存组件
export function saveComponent(data) {
  return request('storage/standard/component', 'put', { data: data })
}

// 测试组件
export function testComponent(id) {
  return request(`storage/standard/component/${id}/status`)
}
