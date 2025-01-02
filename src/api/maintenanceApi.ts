import request from '@/utils/request'

/**
 * 容量许可证
 */
// 获取容量许可证列表
export function getLicenceList() {
  return request('/license/list')
}

// 获取容量信息
export function getLicenseCapacityinfo() {
  return request('license/capacityinfo')
}

// 下载激活码文件
export function downloadActivationCode() {
  return request('license/activationcode')
}

// 删除许可证
export function deleteLicense(id) {
  return request(`license/delete/${id}`, 'delete')
}

// 上传容量许可证
export function importLicense(data) {
  return request('license/import', 'post', { data, headers: { 'Content-Type': 'multipart/form-data' } })
}
