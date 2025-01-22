<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
// const crypto = require('crypto');

// function encryptText(text, secretKey) {
//   const iv = crypto.randomBytes(16); // 随机生成初始化向量
//   const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
//   let encrypted = cipher.update(text, 'utf8', 'base64');
//   encrypted += cipher.final('base64');
//   return `${iv.toString('base64')}:${encrypted}`;
// }

// const secretKey = crypto.randomBytes(32); // 生成一个随机的密钥
// const input = 'adminadmin';
// const encrypted = encryptText(input, secretKey);
// console.log(encrypted); // 输出加密后的字符串
</script>

<template>
  <div>
    <div>test/t1.vue</div>
  </div>
</template>
