import request from '@/utils/request'

/**
 * 存储概览
 */

// 缓存概览列表
export function getCommandList() {
  return request('command/status')
}
