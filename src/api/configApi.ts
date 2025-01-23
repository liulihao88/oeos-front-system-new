import request from '@/utils/request'

/**
 * 任务配置
 */
// 获取任务类型
export function scheduleType() {
  return request('command/commands', { type: 'Tenant' })
}

// 获取任务名称列表
export function getSchedule() {
  return request('schedule/schedules')
}

// 获取任务名称下的任务详情
export function getScheduleTaskList(id) {
  return request(`schedule/${id}/task/list`)
}

// 删除任务
export function deleteSchedule(id) {
  return request(`schedule/${id}`, 'delete')
}

// 保存任务单
export function saveSchedule(data) {
  return request('schedule', 'put', { data })
}

/**
 * 新建任务
 * {
  "commandID": "C001",
  "taskName": "垃圾回收",
  "taskId": "",
  "scheduleId": "SCHED-1737619870889",
  "daytimes": [
    "Mon 02:00:00"
  ]
}
 */
export function saveTask(id, data) {
  return request(`schedule/${id}/task`, 'put', { data })
}

/**
 * 告警配置
 */
// 获取日志配置
export function getLog(type = 'syslog') {
  return request(`notify/${type}`)
}
// 保存日志配置
export function saveLog(data, type = 'syslog') {
  return request(`notify/${type}`, 'put', { data })
}
// 测试
export function syslogTest(data, type = 'syslog') {
  return request(`notify/${type}/test`, 'put', { data })
}
// 重置 notify/syslog/reset
export function syslogReset(type = 'syslog') {
  return request(`notify/${type}/reset`, 'put')
}

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
