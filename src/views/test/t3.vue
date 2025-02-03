<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
const aa = ref('你好')
const cc = ref('我不好')
const options = ref([
  { label: '张三', value: 'z3' },
  { label: '李四', value: 'l4' },
  { label: '王五', value: 'w5' },
])
</script>

<template>
  <div>
    <div>test/t3.vue</div>
    <el-row>
      <el-col :span="6">
        <o-select v-model="aa" title="你好" :options="options" />
        <o-select v-model="aa" title="你好" :options="options" />
      </el-col>
      <el-col :span="6">
        <o-select v-model="aa" title="你321321好" :options="options" />
      </el-col>
      <el-col :span="6">
        <o-input v-model="cc" size="large" title="你好啊" />
      </el-col>
    </el-row>
  </div>
</template>
