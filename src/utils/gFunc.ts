import { $toast, getStorage, isEmpty, formatTime, formatDurationTime } from 'oeos-components'
import settings from '@/config/settings.ts'
import { router } from '@/router/index.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isStringNumber, isNumber } from './types.js'

export function gDownload(item) {
  if (!item.bucket) {
    $toast('不是有效数据，不支持下载!', 'w')
    return false
  } else {
    if (item.bucket.length <= 0) {
      $toast('不是有效数据，不支持下载!', 'w')
    }
  }
  let getUrl = `/v1/admin/tenant/object/download` //接口
  let bucketName = item.bucket ? item.bucket : ''
  let objectKey = item.key ? item.key : ''
  let objectVersionID = item.version ? item.version : ''
  let dataUrl = `?bucket=${bucketName}&key=${encodeURIComponent(objectKey)}&version=${objectVersionID}`
  let baseUrl = import.meta.env.DEV ? settings.url : window.origin
  let _href = baseUrl + getUrl + dataUrl + `&Authorization=${getStorage('system-token')}`
  downloadFile(_href, objectKey)
}

export function downloadFile(url, filename = 'default') {
  const link = document.createElement('a')
  link.href = url
  link.download = filename || 'default'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function gDownloadAll(id) {
  let baseUrl = import.meta.env.DEV ? settings.url : window.origin
  let getUrl = `/v1/admin/tenant/object/download/batch`
  let _href = baseUrl + getUrl + `?id=${encodeURIComponent(id)}&Authorization=${getStorage('system-token')}`
  window.location.href = _href
}

export function gDownloadUrl(url) {
  let baseUrl = import.meta.env.DEV ? settings.url : window.origin

  let downloadUrl =
    baseUrl + url + (url.indexOf('?') === -1 ? '?' : '&') + `Authorization=${getStorage('system-token')}`
  window.location.href = downloadUrl
}

export function jump(path) {
  return router.push(path)
}

/**
 *
date: "YYYY-MM-DD"
datetime:"YYYY-MM-DD HH:mm:ss"
speed1s:"MB/s"
time:"HH:mm:ss"
uptime:"DD 天 HH 时 mm 分 ss 秒"
 */
export function formatTimeByRule(time, timeStr = 'datetime') {
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

export function isImage(str) {
  // 正则表达式匹配常见的图片文件扩展名
  const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|tif|tiff)$/i
  return imageRegex.test(str)
}

export function setFavIcon(icon) {
  let link = document.querySelector("link[rel*='icon']") || document.createElement('link')
  link.type = 'image/x-icon'
  link.rel = 'shortcut icon'
  link.href = icon
  document.getElementsByTagName('head')[0].appendChild(link)
}

/**
 * 将数字或字符串加小数点
 * 123 -> 123.00
 * 123.45678 -> 123.46
 * 123.32321KB -> 123.32KB
 * formatFixed(123,45, 2) -> 123.45
 * @param number
 * @param toFixed
 * @returns
 */
export function formatFixed(number, toFixed = 2) {
  // 提取数字部分、小数点和小数部分
  let matches = ('' + number).match(/^([\d,]+\.?\d+?)(\D+)?$/)
  if (!matches) {
    return number // 如果没有找到匹配，则返回原始输入
  }

  let numericString = Number(matches[1]).toFixed(toFixed) // 仅保留数字
  let unit = matches[2] || '' // 单位部分，如果没有则为空字符串

  // 拼接数字、小数点、小数部分和单位，并返回结果
  return `${numericString}${unit}`
}

export function formatImg(photoName, addPath = '', { basePath = 'assets/images' } = {}) {
  if (photoName.startsWith('http') || photoName.startsWith('https')) {
    return photoName
  }
  if (photoName.indexOf('.') === -1) {
    photoName = photoName + '.png'
  }
  const addLastSlash = addPath.endsWith('/') || !addPath ? addPath : `${addPath}/`
  const addLastBasePathSlash = basePath.endsWith('/') || !basePath ? basePath : `${basePath}/`
  let mergeSrc = `${addLastSlash}${photoName}`
  const finalImg = `${addLastBasePathSlash}${mergeSrc}`
  let res = new URL(`../${finalImg}`, import.meta.url).href
  return res
}

export function formatToFixed(number, fixed = 2) {
  // 提取数字部分、小数点和小数部分
  let matches = ('' + number).match(/^([\d,]+)(\.?)(\d+)?(\D+)?$/)
  if (!matches) {
    return number // 如果没有找到匹配，则返回原始输入
  }

  let numericString = matches[1].replace(/\D/g, '') // 仅保留数字
  let decimalString = matches[3] ? `.${matches[3]}` : '' // 小数部分，如果没有则为空字符串
  let unit = matches[4] || '' // 单位部分，如果没有则为空字符串
  let numTofixed = parseFloat(numericString + decimalString).toFixed(fixed)
  return `${numTofixed}${unit}`
}

export function confirm2(message, options) {
  const baseOptions = {
    title: '提示',
    draggable: true,
    showCancelButton: false,
    confirmButtonText: '确定',
  }
  let mergeOptions = Object.assign({}, baseOptions, options)
  return new Promise((r, j) => {
    const instance = ElMessageBox.confirm(message, mergeOptions)
      .then(() => {
        r(instance)
      })
      .catch(() => {
        j(instance)
      })
  })
}

/**
 * 判断obj2里的属性值跟obj1里的属性值是否保持一致 obj2里的属性, 要都包含在obj1里, 且obj2里的属性值要和obj1相等
 * @param obj1 原始对象类型
 * @param obj2 要对比的对象类型
 * @returns
 */
export function checkChanges(obj1: object, obj2: object) {
  let obj1Length = Object.keys(obj1).length
  let obj2Length = Object.keys(obj2).length
  if (obj1Length < obj2Length) {
    throw new Error('obj1 length is less than obj2')
  }
  let isChange = false
  let newObj = {}
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (obj2[key] !== obj1[key]) {
        isChange = true
      }
      newObj[key] = obj1[key]
    }
  }
  if (isChange) {
    return newObj
  }
  return isChange
}
