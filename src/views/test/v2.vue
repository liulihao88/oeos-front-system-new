<template>
  <basic-layout title="微标配置" class="audit-setUp-box">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :colon="false"
    >
      <div class="form-inner-box">
        <div class="top-item item">
          <g-title title="品牌个性化配置" />
          <div class="f-st-ed">
            <div class="f-1">
              <a-form-model-item ref="brandTitle" label="网络名称" prop="brandTitle">
                <a-input v-model="form.brandTitle" allowClear />
              </a-form-model-item>
              <a-form-model-item ref="favariteIcon" label="网站图标" prop="favariteIcon">
                <g-upload-image v-model:image="form.favariteIcon" />
              </a-form-model-item>
            </div>
            <div class="f-1">
              <a-form-model-item ref="brandImage" label="品牌图标" prop="brandImage">
                <g-upload-image v-model:image="form.brandImage" />
              </a-form-model-item>
            </div>
          </div>
        </div>
        <div class="item">
          <g-title title="系统管理登录界面个性化" />
          <a-form-model-item ref="systemManagementTitle" label="标题" prop="systemManagementTitle">
            <a-input v-model="form.systemManagementTitle" allowClear />
          </a-form-model-item>
          <a-form-model-item ref="systemManagementImage" label="商标" prop="systemManagementImage">
            <g-upload-image v-model:image="form.systemManagementImage" />
          </a-form-model-item>
        </div>
        <div class="item">
          <g-title title="租户管理登录界面个性化" />
          <a-form-model-item ref="tenantManagementTitle" label="标题" prop="tenantManagementTitle">
            <a-input v-model="form.tenantManagementTitle" allowClear />
          </a-form-model-item>
          <a-form-model-item ref="tenantManagementImage" label="商标" prop="tenantManagementImage">
            <g-upload-image v-model:image="form.tenantManagementImage" />
          </a-form-model-item>
        </div>
      </div>

      <a-form-model-item class="m-l-24">
        <a-button type="primary" @click="save">保存</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">初始化</a-button>
      </a-form-model-item>
    </a-form-model>
  </basic-layout>
</template>
<script>
import { setFavIcon } from '@/utils/baseFunc.js'

export default {
  data() {
    return {
      datas: {},
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      form: {
        name: '',
      },
      rules: {
        brandImage: [this.mRequired()],
        brandTitle: [this.mRequired()],
        systemManagementTitle: [this.mRequired()],
        systemManagementImage: [this.mRequired()],
        tenantManagementTitle: [this.mRequired()],
        tenantManagementImage: [this.mRequired()],
        favariteIcon: [this.mRequired()],
      },
    }
  },
  created() {
    console.log(Math.random())
    this.setTitleCommonType(['系统配置', '微标配置'], [true, true], 'scheduling')
    this.init()
  },
  methods: {
    async init() {
      let res = await this.$req({
        url: 'logo',
        baseURL: '/v1/admin/common',
      })
      this.form = res
      this.$g.setStorage('oeos-settings', res)
      this.$store.commit('logo/changeSettings', res)
    },
    async resetForm() {
      let res = await this.$req({
        url: 'ui/logo/reset',
        method: 'put',
      })
      this.form = res
      this.$toast('重置成功')
      await this.init()
      // this.$router.go(0)
      // this.$store.commit('news/refreshRouter')
    },
    async save() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.form.updateTime = this.form.updateTime ?? +new Date()
          await this.$req({
            url: 'ui/logo',
            method: 'put',
            data: this.form,
          })
          this.$toast('保存成功')
          await this.init()

          // this.$router.go(0)
          // this.$store.commit('news/refreshRouter')
        } else {
          this.$toast('表单校验有误, 请检查', 'e')
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.form-inner-box {
  display: flex;
  flex-wrap: wrap;
  padding: 16px;

  .item {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: calc(50% - 16px);
    padding: 12px;
    // justify-content: space-between;
    margin: 8px;
    background-color: #fff;
    border: 1px solid #f1f1f4;
    border-radius: 6px;
    box-shadow: 0 3px 4px 0 rgb(0 0 0 / 3%);
  }

  .top-item {
    width: calc(100% - 16px);
  }
}

::v-deep .ant-form-item label {
  width: 100px !important;
  text-align-last: justify !important;
}

::v-deep .ant-form-item-required::before {
  position: absolute;
  top: 14px;
  left: -14px;
}
</style>
