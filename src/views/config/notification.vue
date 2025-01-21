<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import LogNotification from '@/views/config/components/logNotification.vue'
import EmailNotification from '@/views/config/components/emailNotification.vue'
import SnmpNotification from '@/views/config/components/snmpNotification.vue'
import DingdingNotification from '@/views/config/components/dingdingNotification.vue'

const { proxy } = getCurrentInstance()
const navValue = ref('log')
const navOptions = ref([
  { label: '日志配置', value: 'log' },
  { label: 'SNMP配置', value: 'snmp' },
  { label: '电子邮件配置', value: 'email' },
  { label: '钉钉配置', value: 'dingding' },
])
</script>

<template>
  <div>
    <div>config/notification.vue</div>
    <o-tabs v-model="navValue" :options="navOptions" />

    <div v-if="navValue === 'log'">
      <LogNotification />
    </div>
    <div v-if="navValue === 'snmp'">
      <SnmpNotification />
    </div>
    <div v-if="navValue === 'email'">
      <EmailNotification />
    </div>
    <div v-if="navValue === 'dingding'">
      <DingdingNotification />
    </div>
  </div>
</template>
