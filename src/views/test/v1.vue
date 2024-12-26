<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { preview } from 'vue3-preview-image' // 使用setup组合式api时引入方法调用
import { uploadFileApi } from '@/api/globalApi.ts'
import { Plus, ZoomIn, Delete } from '@element-plus/icons-vue'
const fileValue = ref('')
const props = defineProps({
  url: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    default: '',
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['update:modelValue', 'update:imgPath'])
const loading = ref(false)
const imgUrl = ref(props.url)
watch(
  () => [props.url, props.modelValue],
  (newVal) => {
    imgUrl.value = newVal[0] || newVal[1]
    dynamicSetImgDom()
  },
  { deep: true, immediate: true },
)
const imgRef = ref()
function dynamicSetImgDom() {
  const img = new Image()
  img.src = imgUrl.value
  img.onload = () => {
    let nowImg = imgRef.value
    if (img.width > img.height) {
      nowImg.style.width = '100%'
    } else {
      nowImg.style.height = '100%'
    }
  }
}

const resFile = ref({})
function onChange(file, fileList) {
  if (file.size / 1024 / 1024 > 2) {
    ElMessage.error('上传图片最大不能超过2m')
    return false
  }
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = () => {
    // 将base64数据保存到上传数据中
    let base64Url = reader.result
    let sendData = {
      file: {
        content: base64Url,
        filename: file.raw.name,
        size: file.raw.size,
        type: file.raw.type,
      },
    }
    loading.value = true
    uploadFileApi(sendData)
      .then((res) => {
        imgUrl.value = URL.createObjectURL(file.raw)
        dynamicSetImgDom()
        fileValue.value = file
        emit('update:modelValue', imgUrl.value)
        emit('update:imgPath', res.file.path)
        resFile.value = res.file
      })
      .catch((err) => {})
      .finally(() => (loading.value = false))
  }
}
function resetData() {
  imgUrl.value = ''
  fileValue.value = ''
  resFile.value = {}
  emit('update:modelValue', '')
  emit('update:imgPath', '')
}
function removeImg() {
  resetData()
}
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('Avatar picture size can not exceed 10MB!')
    return false
  }
  return true
}
defineExpose({
  fileValue,
  resetData,
  imgUrl,
  resFile,
})

/** @使用方式
<g-req-upload-image
	url="https://hspreview.oss-cn-beijing.aliyuncs.com/face/2a9f7f04123c7c6a9c77a17a2a901cfa.jpeg"
	v-model:imgPath="form.imgPath"
></g-req-upload-image>
*/
</script>

<template>
  <div class="">
    <el-upload
      v-loading="loading"
      class=""
      action="#"
      v-bind="$attrs"
      drag
      :auto-upload="false"
      :show-file-list="false"
      accept=".jpg,.jpeg,.png,.tif"
      :on-change="onChange"
      :before-upload="beforeAvatarUpload"
      name="file"
      list-type="picture-card"
    >
      <div v-if="imgUrl" class="download-img-box f-ar">
        <img ref="imgRef" mode="aspectFit" :src="imgUrl" class="avatar" />
        <div class="mask">
          <el-icon
            class="preview-img-zoom"
            :size="30"
            :class="{ 'only-zoom': !props.showDelete }"
            @click.stop="preview(imgUrl)"
          >
            <ZoomIn color="white" />
          </el-icon>
          <el-icon v-if="props.showDelete" :size="30" class="preview-img-delete" @click.stop="removeImg">
            <Delete color="white" />
          </el-icon>
        </div>
      </div>
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </div>
</template>

<style scoped lang="scss">
:deep(.ep-upload-dragger) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.download-img-box {
  position: relative;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 100%;
  border: 1px solid rgb(224 224 224 / 100%);

  &:hover {
    .mask {
      opacity: 1;
    }
  }

  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgb(0 0 0 / 60%);
    border-radius: 4px;
    opacity: 0;
    transition: all 0.2s ease-out;
  }

  img {
    object-fit: contain;
  }

  .preview-img-zoom {
    position: absolute;
    right: calc(50% + 5px);
    bottom: calc(50% - 15px);
    width: 30px;
    height: 30px;
  }

  .only-zoom {
    right: calc(50% - 15px);
  }

  .preview-img-delete {
    position: absolute;
    right: calc(50% - 35px);
    bottom: calc(50% - 15px);
    width: 30px;
    height: 30px;
  }
}

:deep(.ep-upload-dragger) {
  padding: 0;
  border: none;
  outline: none;
}

:deep(.ep-upload--picture-card) {
  border: none;
}
</style>
