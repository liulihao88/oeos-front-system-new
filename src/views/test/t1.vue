<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
// import { OTitle } from 'oeos-components'
const { proxy } = getCurrentInstance()
let obj = {
  name: 'andy',
  age: 18,
  height: 33,
  sex: 'male',
}

// 直接在对象字面量中使用解构
let newObj = { ...obj.name, ...obj.age }

console.log(newObj) // 输出: { name: 'andy', age: 18 }
</script>

<template>
  <div>
    <!-- <OTitle title="1632654743/incarnation_1/1001/data/backup_set_32_full_20240901/1/"></OTitle> -->
  </div>
</template>

<style lang="scss" scoped></style>
