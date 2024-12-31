<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
import globalLogoSettings from '@/config/settings.ts'
</script>

<template>
  <div>
    <img src="@/assets/images/notic.png" class="br-50% w-30" />
    <!-- {{ globalLogoSettings }} -->
    <img :src="globalLogoSettings.nativeLogo.brandImage" class="br-50% w-30" />
    <g-upload-img v-model="globalLogoSettings.nativeLogo.brandImage" />
  </div>
</template>
