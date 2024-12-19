import request from '@/utils/request'

/**
 * 节点列表
 * @param config
 * @returns
 */
// 获取节点列表
export function getNodeList() {
  return request('node/status')
}

// 重启列表
export function restartNode(params) {
  return request('node/restart', 'put', {
    params,
  })
}

// 关闭列表
export function shutdownNode(params) {
  return request('node/shutdown', 'put', {
    params,
  })
}
