import { $toast, getStorage, isEmpty, formatTime, formatDurationTime } from 'oeos-components'
import settings from '@/config/settings.ts'
import { router } from '@/router/index.ts'

export function gDownload(item) {
  console.log(`34 item`, item)

  if (!item.bucket) {
    $toast('不是有效数据，不支持下载!', 'warn')
    return false
  } else {
    if (item.bucket.length <= 0) {
      $toast('不是有效数据，不支持下载!', 'warn')
    }
  }
  let getUrl = `/v1/admin/tenant/object/download` //接口
  let bucketName = item.bucket ? item.bucket : ''
  let objectKey = item.key ? item.key : ''
  let objectVersionID = item.version ? item.version : ''
  let dataUrl = `?bucket=${bucketName}&key=${encodeURIComponent(objectKey)}&version=${objectVersionID}`
  let baseUrl = import.meta.env.DEV ? settings.url : window.origin
  let _href = baseUrl + getUrl + dataUrl + `&Authorization=${getStorage('tenant-token')}`
  console.log(`41 _href`, _href)
  window.location.href = _href
}

export function gDownloadAll(id) {
  let baseUrl = import.meta.env.DEV ? settings.url : window.origin
  let getUrl = `/v1/admin/tenant/object/download/batch`
  let _href = baseUrl + getUrl + `?id=${encodeURIComponent(id)}&Authorization=${getStorage('tenant-token')}`
  window.location.href = _href
}

export function gDownloadUrl(url, params = {}) {
  let baseUrl = import.meta.env.DEV ? settings.url : window.origin
  const token = {
    Authorization: getStorage('tenant-token'),
  }
  const mergeParams = Object.assign(params, token)
  const queryString = Object.keys(mergeParams)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(mergeParams[key])}`)
    .join('&')
  console.log(`75 queryString`, queryString)
  let _href = baseUrl + url + '?' + queryString
  console.log(`37 _href`, _href)
  window.location.href = _href
}

export function jump(path) {
  return router.push(path)
}

export function isImage(fileName) {
  // 定义一个包含图片扩展名的数组
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'tif', 'webp']

  // 获取文件名的扩展名
  const extension = fileName.split('.').pop().toLowerCase()

  // 检查扩展名是否在图片扩展名数组中
  return imageExtensions.includes(extension)
}

export function parseTimeByRule(time, timeStr = 'datetime') {
  timeStr = timeStr.toLowerCase()
  if (isEmpty(time)) {
    return '-'
  }
  const rule = getStorage('tenant-time-rule') || {}
  const ruleValue = rule[timeStr]
  if (!ruleValue) {
    return time
  }
  if (timeStr === 'speed1s') {
    return time + ruleValue
  }
  let parseRuleFormat = ruleValue
    .replace('YYYY', '{y}')
    .replace('MM', '{m}')
    .replace('DD', '{d}')
    .replace('HH', '{h}')
    .replace('mm', '{i}')
    .replace('ss', '{s}')
  if (timeStr === 'uptime' || timeStr === 'time') {
    return formatDurationTime(time, parseRuleFormat)
  }
  return formatTime(time, parseRuleFormat)
}
