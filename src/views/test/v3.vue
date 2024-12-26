<template>
  <div>
    <a-upload
      name="avatar"
      list-type="picture-card"
      class="avatar-uploader"
      accept="image/*"
      action=""
      :show-upload-list="false"
      :before-upload="beforeUpload"
      @change="handleChange"
    >
      <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="img-box" />
      <div v-else>
        <a-icon :type="loading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
  </div>
</template>
<script>
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img.originFileObj)
}
export default {
  props: {
    image: {
      type: String,
    },
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      loading: false,
      imageUrl: '',
    }
  },
  watch: {
    image: {
      handler(val) {
        this.imageUrl = val ?? ''
      },
      immediate: true,
    },
  },
  methods: {
    handleChange(file, fileList, event) {
      getBase64(file.file, (innerImageUrl) => {
        this.imageUrl = innerImageUrl
        this.$emit('update:image', this.imageUrl)
      })
    },
    beforeUpload(file) {
      return true
      console.log(`64 file`, file)
      let _this = this
      let img = new Image()
      let _URL = window.URL || window.webkitURL
      console.log(`21 _URL`, _URL)
      img.src = _URL.createObjectURL(file)
      let pixel = new Promise(function (resolve, reject) {
        img.onload = function () {
          /* 有时我们不能完全满足宽高比是相同的，
                	等比例缩放后的图片会有细微的比例差距
                	这时就要用到等比例缩放的方式来计算判断是否满足上传的要求*/
          // 固定宽与上传图片的宽比
          let widthRito = _this.width / img.width
          console.log(`38 widthRito`, widthRito)
          // 固定高与上传图片的高比
          let heightRito = _this.height / img.height
          // 缩放比列的计算，如果宽比小于高比取宽比，否则取高比
          let rito = widthRito < heightRito ? widthRito : heightRito
          // 得到缩放后图片的宽
          let currentWidth = img.width * rito
          // 得到缩放后图片的高
          let currentHeight = img.height * rito
          // 判断缩放后的宽高比是否会和固定的宽高比一样，
          //因为缩放后等到的宽高会有细微小数的差距，
          // 所以用四舍五入可以得到和固定的宽高相同
          // let valid = (Number(Number.parseFloat(currentWidth).toFixed()) / Number(Number.parseFloat(currentHeight).toFixed())) == _this.width/_this.height;

          /*直接根据上传图片宽高比是否满足固定宽高比*/
          // 判断图片比列是否满足_this.widthpx*_this.heightpx
          let valid = img.width / img.height == _this.width / _this.height
          console.log(`85 _this.width / _this.height`, _this.width / _this.height)
          console.log(`76 img.width / img.height`, img.width / img.height)
          console.log(`87 valid`, valid)
          // 满足条件调用promis的resolve，否则reject
          valid ? resolve() : reject()
        }
      }).then(
        () => {
          // 成功返回
          return file
        },
        () => {
          // 不成功返回promis的reject，在element中当返回promis的reject时也会停止上传
          _this.$message.error(`图片比列${this.width}*${this.height}`)
          return Promise.reject()
        },
      )
      return pixel
    },
  },
}
</script>
<style>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.img-box {
  width: 100%;
}
</style>
