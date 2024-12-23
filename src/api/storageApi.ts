import request from '@/utils/request'

// 缓存概览列表
export function getCacheSummaries() {
  return request('storage/standard/cache/summaries')
}
