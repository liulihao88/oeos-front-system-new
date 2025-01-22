<script setup lang="ts">
import { ref, getCurrentInstance, computed, useAttrs } from 'vue'
import { processWidth } from 'oeos-components'
const { proxy } = getCurrentInstance()
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: '', // icon
  },
  width: {
    type: [String, Number],
    default: '100%',
  },
})
</script>

<template>
  <div
    :class="type === 'icon' ? 'icon-box' : type === 'info' ? 'info-box' : 'warning-box'"
    class="base-box"
    :style="{ ...processWidth(props.width) }"
    v-bind="$attrs"
  >
    <img v-if="type === ''" src="@/assets/images/notic.png" class="icon" />
    <o-icon v-else name="warning" :color="'var(--45)'" v-bind="$attrs" class="icon" size="16" />
    <slot name="content">
      <span class="warning-box__content" :class="type === 'icon' && 'cl-45 fs-14'" v-html="content" />
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.base-box {
  display: flex;
  align-items: baseline;
  min-height: 32px;
  padding: 0 8px;
  border: 1px solid #dfca9e;
  border-radius: 12px;

  .warning-box__content {
    margin-left: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #796551;
  }
}

.warning-box {
  background: #fffaf4;
  border: 1px solid #dfca9e;
}

.info-box {
  background: #f5f6f7;
  border: 1px solid var(--line);
}

.icon-box {
  border: none;
}

:deep(code) {
  padding: 2px;
  background-color: #e4e7eb;
  border-color: #c3cad2;
  border-radius: 4px;
}

.icon {
  position: relative;
  top: 2px;
  width: 16px;
  height: 16px;
  margin-right: 4px;
}
</style>
