<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { getStorageUrl } from '@/api/iframeApi.ts'
import globalSettings from '@/config/settings'

const { proxy } = getCurrentInstance()
const isOk = ref(false)

function countUrlFn(url) {
  let arr1 = url.split(':')
  let arr2 = arr1[2].split('/')
  let _url = ''
  arr2.forEach((item, index) => {
    if (index != 0) {
      _url += '/' + item
    }
  })
  let windowOrigin = proxy.$dev ? globalSettings.url : window.origin
  let originUrl = windowOrigin + '/monitor' + _url
  return originUrl
}

async function init() {
  let res = await getStorageUrl()
  let storageUrl = countUrlFn(res)
  isOk.value = true
  var iframe = document.querySelector('iframe')
  iframe.src = storageUrl
}
init()
</script>

<template>
  <div class="overviwe-page oBox-iframe">
    <iframe width="100%" name="grafaDOM" src="" style="height: 100%" />
    <div v-if="!isOk" class="mask-el">数据加载中...</div>
  </div>
</template>

<style lang="scss" scoped>
.overviwe-page {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;

  iframe {
    border: none;
  }

  .mask-el {
    position: absolute;
    top: 20px;
    left: 0;
    width: 100%;
    height: calc(100vh - 166px);
    line-height: calc(100vh - 166px);
    color: #ccc;
    text-align: center;
    vertical-align: middle;
    background: #fff;
  }
}

.oBox-iframe {
  .basic-layout-title {
    padding: 0 !important;
  }
}
</style>
