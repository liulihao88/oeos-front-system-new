/**
import useCacheReqponse from "@/store/cacheResponse.ts";
const cacheResponse = useCacheReqponse()

 */
import { getComponentsList } from '@/api/storageApi.ts'

import { defineStore } from 'pinia'

const useCacheReqponse = defineStore('cache-response', {
  state: () => ({
    standardLists: [], // 标准存储池组件列表
    glacierLists: [], // 蓝光存储池组件列表
  }),
  getters: {
    dataLoaded: (state) => {
      return state.standardLists.length > 0 && state.glacierLists.length > 0
    },
  },
  actions: {
    async fetchComponentsList() {
      if (this.dataLoaded) {
        return [this.standardLists, this.glacierLists]
      }
      let res = await Promise.all([getComponentsList('Standard'), getComponentsList('Glacier')])
      this.standardLists = res[0]
      this.glacierLists = res[1]
      return [this.standardLists, this.glacierLists]
    },
  },
})

export default useCacheReqponse
