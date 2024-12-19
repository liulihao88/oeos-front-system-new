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

/**
 * 蓝光列表
 */
// 获取蓝光列表
export function getOceanList() {
  return request('storage/glacier/ocean/libraries')
}

// 获取盘匣列表
export function getMagazines(id) {
  return request(`storage/glacier/ocean/library/${id}/magazines`)
}

// 获取光驱列表
export function getDrivers(id) {
  return request(`storage/glacier/ocean/library/${id}/drivers`)
}

/**
 * 服务列表
 */
// 获取服务列表
export function getServiceStatus() {
  return request('service/status')
}
