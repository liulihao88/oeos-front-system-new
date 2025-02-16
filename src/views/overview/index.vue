<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { getOeosUrl, getNodeUrl, getHint } from '@/api/iframeApi.ts'
import globalSettings from '@/config/settings'

const { proxy } = getCurrentInstance()
const opcityClass = ref(false)
const variants = ref(['primary'])
const isDark = ref(false)
const isView = ref(false)

function countUrlFn(url) {
  let arr1 = url.split(':')
  let arr2 = arr1[2].split('/')
  let _url = ''
  arr2.forEach((item, index) => {
    if (index != 0) {
      _url += '/' + item
    }
  })
  let windowOrigin = import.meta.env.MODE === 'development' ? globalSettings.url : window.origin
  console.log(`08 windowOrigin`, windowOrigin)
  let originUrl = windowOrigin + '/monitor' + _url
  return originUrl
}

async function init() {
  let res = await Promise.all([getOeosUrl(), getNodeUrl()])
  let oeosUrl = countUrlFn(res[0])
  let nodeUrl = countUrlFn(res[1])
  let _iframe = document.querySelectorAll('iframe')
  _iframe[0].src = oeosUrl
  _iframe[1].src = nodeUrl
  opcityClass.value = true
  let hintRes = await getHint()
  if (hintRes.length) {
    proxy.$toast(hintRes[0].message, 'w')
  }
}
init()
</script>

<template>
  <div class="overview">
    <div class="overview-container">
      <div class="cover-box" />
      <iframe width="100%" name="grafaDOM" src="" class="top-iframe" />
      <div class="line-el" />
      <iframe id="bottomEl" width="100%" name="grafaDOM2" src="" class="bottom-iframe" />
    </div>
    <div v-if="!opcityClass" class="mask-box">
      <div class="mask" :class="isDark ? 'mask-dark' : ''" />
      <div v-if="!isView" class="font-box">
        <b-spinner
          v-for="variant in variants"
          :key="variant"
          style="width: 3rem; height: 3rem"
          class="mr-1 spinner"
          :variant="variant"
        />
        <span class="tips">数据正在加速赶来，请稍后~</span>
      </div>
      <div v-else class="font-box">
        <span class="tips">暂无数据</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cover-box {
  position: absolute;
  top: 0;
  left: 18px;
  z-index: 1;
  width: 100%;
  height: 50px;
  opacity: 0;
}

.card {
  box-shadow: none !important;
}

.opcity-class {
  opacity: 0;
}

.overview {
  position: relative;
  top: 0;
  display: none;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 97%;

  .font-box {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 101;
    width: 200px;
    height: 100px;
    transform: translate(-50%, -50%);

    .tips {
      position: absolute;
      top: 10px;
      left: 5rem;
      width: 300px;
    }
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 900px;
    background: #f5f5f5;

    &.mask-dark {
      background: #1e1e1e;
    }
  }

  iframe {
    border: none;
  }

  .overview-container {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden auto;

    .line-el {
      width: 98%;
      height: 0.1rem;
      margin: 0 auto;
      background: rgb(36 41 46 / 8%);
    }

    .top-iframe {
      height: 45rem;
    }

    .bottom-iframe {
      position: relative;
      width: 100%;
      height: 80rem;
    }
  }

  .custom-row:not(.custom-row.top) {
    flex: 1;
  }

  .custom-col {
    height: 100%;
    padding: 0;
  }

  .col-flex {
    display: flex;
    flex-direction: column;
  }

  .custom-col + .custom-col {
    padding-left: 1rem;
  }
}
</style>
