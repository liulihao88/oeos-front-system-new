<script setup lang="ts">
/** @使用方式
 <g-switch
    v-model="form.enableMetaDataInject"
    disabled
    active-text="开启管理控制1"
  ></g-switch>
*/
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
</script>

<template>
  <el-switch v-bind="$attrs" class="custom-switch" />
</template>

<style lang="scss" scoped>
:deep(.custom-switch .el-switch__label--right),
:deep(.el-switch__label--right) {
  order: 1; /* 将active-text放在左边 */
  margin-right: 8px;
  margin-left: 0;
  font-weight: 900;
}

.custom-switch {
  flex-direction: row-reverse; /* 反转子元素的顺序 */
  align-items: center;
  margin-right: 8px;
}

.custom-switch .el-switch__label--left {
  order: 2; /* 将inactive-text放在右边 */
}
</style>
