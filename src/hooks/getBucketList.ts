/**
 *
 import useBucketList from '@/hooks/getBucketList.ts'
 const bucketList = useBucketList()
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getBucketOptions } from '@/api/bucketReview.ts'

const useGetBucketList = defineStore('getBucketList', {
  state: () => ({
    bucketOptions: [],
  }),
  actions: {
    async getBucketList() {
      console.log(`71 this.bucketOptions.length`, this.bucketOptions.length)
      if (this.bucketOptions.length === 0) {
        let res = await getBucketOptions()
        this.bucketOptions = res ?? []
      }
    },
    async update() {
      let res = await getBucketOptions()
      this.bucketOptions = res ?? []
    },
    clear() {
      this.bucketOptions = []
    },
  },
})

export default useGetBucketList
