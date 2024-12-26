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
