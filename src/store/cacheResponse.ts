/**
import useCacheResponse from "@/store/cacheResponse";
const cacheResponse = useCacheResponse()

 */
import { getComponentsList, getCenterOptions } from '@/api/storageApi.ts'

import { defineStore } from 'pinia'

const useCacheResponse = defineStore('cache-response', {
  state: () => ({
    standardLists: [], // 标准存储池组件列表
    glacierLists: [], // 蓝光存储池组件列表

    dataCenterLists: [], // 数据中心列表
  }),
  getters: {
    dataLoaded: (state) => {
      return state.standardLists.length > 0 && state.glacierLists.length > 0
    },
  },
  actions: {
    async fetchComponentsList() {
      if (this.dataLoaded) {
        return
      }
      let res = await Promise.all([getComponentsList('Standard'), getComponentsList('Glacier')])
      this.standardLists = res[0]
      this.glacierLists = res[1]
    },
    async fetchDataCenter() {
      console.log(`79 this.dataCenterLists`, this.dataCenterLists)
      if (this.dataCenterLists.length > 0) {
        return this.dataCenterLists
      }
      let res = await getCenterOptions()
      this.dataCenterLists = res
    },
  },
})

export default useCacheResponse
