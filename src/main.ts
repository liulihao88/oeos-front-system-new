import App from './App.vue'
import router from './router'
import { setupStore } from '@/store'
import { getPlatformConfig } from './config'
import { MotionPlugin } from '@vueuse/motion'
// import { useEcharts } from "@/plugins/echarts";
import { createApp, type Directive } from 'vue'
import { useElementPlus } from '@/plugins/elementPlus'
import { injectResponsiveStorage } from '@/utils/responsive'
import mitt from 'mitt'

import Table from '@pureadmin/table'
// import PureDescriptions from "@pureadmin/descriptions";

// 引入重置样式
import './style/reset.scss'
// 导入公共样式
import './style/index.scss'
// 一定要在main.ts中导入tailwind.css，防止vite每次hmr都会请求src/style/index.scss整体css文件导致热更新慢的问题
import './style/tailwind.css'
import 'element-plus/dist/index.css'
// 导入字体图标
import './assets/iconfont/iconfont.js'
import './assets/iconfont/iconfont.css'

import 'virtual:svg-icons-register'

const app = createApp(App)

import GDirectives from '@/directives/gDirectives.ts'
GDirectives(app)

// 自定义指令
import * as directives from '@/directives'
Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as { [key: string]: Directive })[key])
})

// 全局注册@iconify/vue图标库
import { IconifyIconOffline, IconifyIconOnline, FontIcon } from './components/ReIcon'
app.component('IconifyIconOffline', IconifyIconOffline)
app.component('IconifyIconOnline', IconifyIconOnline)
app.component('FontIcon', FontIcon)

// 全局注册按钮级别权限组件
import { Auth } from '@/components/ReAuth'
app.component('Auth', Auth)

// 全局注册vue-tippy
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'
import VueTippy from 'vue-tippy'
app.use(VueTippy)

// 全局注册oeos-components
import 'oeos-components/dist/style.css'
import OeosComponents, { utils } from 'oeos-components'
app.use(OeosComponents)

import * as localUtils from '@/utils/gFunc'
import * as globalData from '@/assets/globalData.ts'

// 引入全局组件
import globComps from '@/utils/autoImportComps.js'
app.use(globComps)
import * as echarts from 'echarts'

// 引入vChart
import VChart from 'vue-echarts'
app.component('vChart', VChart)

// 导入图片预览插件 v-viewer
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

import request from '@/utils/request'

Object.keys(utils).forEach((v) => {
  app.config.globalProperties[v] = utils[v]
})

Object.keys(localUtils).forEach((v) => {
  app.config.globalProperties[v] = localUtils[v]
})
Object.keys(globalData).forEach((v) => {
  app.config.globalProperties[v] = globalData[v]
})

app.config.globalProperties.$echarts = echarts
let $dev = import.meta.env.MODE === 'development'
app.config.globalProperties.$dev = utils.getStorage('system-$dev') ?? $dev
app.config.globalProperties.$test = location.hostname.startsWith('10.0.11.33') || location.hostname === 'localhost'
// app.config.globalProperties.$dev = false
app.config.globalProperties.$mitt = mitt()

getPlatformConfig(app).then(async (config) => {
  setupStore(app)
  app.use(router)
  await router.isReady()
  injectResponsiveStorage(app, config)
  app
    .use(MotionPlugin)
    .use(useElementPlus)
    .use(Table)
    .use(VueViewer, {
      defaultOptions: {
        zIndex: 3000,
      },
    })
  app.mount('#app')
})
