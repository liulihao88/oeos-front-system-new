import request from '@/utils/request'

/**
 * 审计日志
 */
// 获取审计设置配置
export function getAuditConfig() {
  return request('audit/config')
}

// 保存审计设置配置
export function saveAuditConfig(data) {
  return request('audit/config', 'put', { data })
}

/**
 * 徽标配置
 */

// 获取徽标列表
export function getLogo() {
  return request('common/logo', { type: 'common' })
}

// 保存徽标
export function saveLogo(data) {
  return request('ui/logo', 'put', { data })
}

// 初始化
export function resetLogo() {
  return request('ui/logo/reset', 'put')
}
