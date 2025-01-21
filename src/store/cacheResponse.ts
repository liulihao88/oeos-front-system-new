/**
import useCacheResponse from "@/store/cacheResponse";
const cacheResponse = useCacheResponse()

 */
import { getComponentsList, getCenterOptions } from '@/api/storageApi.ts'
import { getTenant, getServiceOptions, getNodeOptions, getCategorys, getLevels } from '@/api/monitorApi.ts'

import { defineStore } from 'pinia'

const useCacheResponse = defineStore('cache-response', {
  state: () => ({
    standardList: [], // 标准存储池组件列表
    glacierList: [], // 蓝光存储池组件列表

    dataCenterList: [], // 数据中心列表

    serviceList: [], // 服务列表
    nodeList: [], // 节点列表
    eventList: [], // 事件等级列表

    tenantList: [], // 租户列表

    auditCategorysList: [], // 分类列表
  }),
  getters: {
    dataLoaded: (state) => {
      return state.standardList.length > 0 && state.glacierList.length > 0
    },
  },
  actions: {
    async fetchComponentsList() {
      if (this.dataLoaded) {
        return
      }
      let res = await Promise.all([getComponentsList('Standard'), getComponentsList('Glacier')])
      this.standardList = res[0]
      this.glacierList = res[1]
    },
    async fetchDataCenter() {
      if (this.dataCenterList.length > 0) {
        return this.dataCenterList
      }
      let res = await getCenterOptions()
      this.dataCenterList = res
    },
    async fetchServiceList() {
      if (this.serviceList.length > 0) {
        return this.serviceList
      }
      let res = await getServiceOptions()
      this.serviceList = res
    },
    async fetchEventList() {
      if (this.eventList.length > 0) {
        return this.eventList
      }
      let res = await getLevels()
      this.eventList = res
    },
    async fetchNodeList() {
      if (this.nodeList.length > 0) {
        return this.nodeList
      }
      let res = await getNodeOptions()
      this.nodeList = res
    },
    async fetchTenantList() {
      if (this.tenantList.length > 0) {
        return this.tenantList
      }
      let res = await getTenant()
      this.tenantList = res
    },
    async fetchGetCategorys() {
      if (this.auditCategorysList.length > 0) {
        return this.auditCategorysList
      }
      let res = await getCategorys()
      this.auditCategorysList = res
    },
  },
})

export default useCacheResponse
