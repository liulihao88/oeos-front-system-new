<script setup lang="ts">
import { computed, unref } from 'vue'
import { isUrl } from '@pureadmin/utils'
import { menuType } from '@/layout/types'

const props = defineProps<{
  to: menuType
}>()

const isExternalLink = computed(() => isUrl(props.to.tip))
const getLinkProps = (item: menuType) => {
  if (isExternalLink.value) {
    return {
      href: item.tip,
      target: '_blank',
      rel: 'noopener',
    }
  }
  return {
    to: item,
  }
}
</script>

<template>
  <component :is="isExternalLink ? 'a' : 'router-link'" v-bind="getLinkProps(to)">
    <slot />
  </component>
</template>
