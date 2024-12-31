<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      accept=".jpg,.jpeg,.png,.tif"
      :auto-upload="false"
      drag
      :show-file-list="false"
      @change="handleChange"
    >
      <div v-if="imgUrl" class="download-img-box f-ar-ct">
        <img ref="imgRef" mode="aspectFit" :src="imgUrl" class="avatar" />
        <div class="mask">
          <el-icon
            class="preview-img-zoom"
            :size="30"
            :class="{ 'only-zoom': !props.showDelete }"
            @click.stop="handlePictureCardPreview"
          >
            <el-icon-zoom-in color="white" />
          </el-icon>
          <el-icon v-if="props.showDelete" :size="30" class="preview-img-delete" @click.stop="removeImg">
            <el-icon-delete color="white" />
          </el-icon>
        </div>
      </div>
      <el-icon v-else class="avatar-uploader-icon h-100%"><el-icon-plus /></el-icon>
    </el-upload>

    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { UploadFile } from 'element-plus'

const emits = defineEmits(['update:modelValue', 'changeFile'])

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
})

const imgUrl = ref(props.modelValue)

const setBase64 = async (img) => {
  const reader = new FileReader()
  reader.readAsDataURL(img.raw)
  return new Promise((resolve, reject) => {
    reader.addEventListener('load', () => {
      return resolve(reader.result)
    })
  })
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const baseFile = ref()

const removeImg = () => {
  imgUrl.value = ''
  baseFile.value = ''
  emits('changeFile')
  emits('update:modelValue', '')
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = baseFile.value?.url || imgUrl.value
  dialogVisible.value = true
}

const handleChange = async (file) => {
  baseFile.value = file
  imgUrl.value = URL.createObjectURL(file.raw)
  let res = await setBase64(file)
  emits('update:modelValue', res)
  emits('changeFile')
}

watch(
  () => props.modelValue,
  (val) => {
    imgUrl.value = val
  },
  {
    immediate: true,
  },
)
</script>

<style lang="scss" scoped>
:deep(.el-upload-dragger) {
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
  border-radius: 6px;

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
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .preview-img-zoom {
    position: absolute;
    right: calc(50% + 15px);
    bottom: calc(50% - 15px);
    width: 20px;
    height: 20px;
  }

  .only-zoom {
    right: calc(50% - 15px);
  }

  .preview-img-delete {
    position: absolute;
    right: calc(50% - 35px);
    bottom: calc(50% - 15px);
    width: 20px;
    height: 20px;
  }
}

:deep(.el-upload-dragger) {
  padding: 0;
  border: none;
  outline: none;
}

:deep(.el-upload--picture-card) {
  border: none;
  border: 1px solid var(--line);
}
</style>
