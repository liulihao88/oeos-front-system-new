<template>
  <div>
    <g-drawer
      v-model:visible="isShow"
      width="1000"
      :title="isEdit ? '编辑组件(蓝光)' : '新增组件(蓝光)'"
      @ok="handleOk"
    >
      <a-form-model ref="formRef" :model="form" :rules="rules" v-bind="mLayout(4)">
        <a-form-model-item label="组件类型" prop="type">
          <g-select
            v-model="form.type"
            :options="options"
            disabled
            val="value"
            :customLabel="(obj) => `${obj.name}(${obj.value})`"
          />
        </a-form-model-item>
        <a-form-model-item label="寻址模式" prop="mappingPattern">
          <a-radio-group v-model="form.mappingPattern">
            <span v-for="(v, i) in locationOptions" :key="i">
              <a-radio-button :value="v.value">{{ v.name }}</a-radio-button>
            </span>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="名称" prop="name">
          <g-input v-model:value="form.name" />
        </a-form-model-item>
        <a-form-model-item label="管理URL" prop="managementURL">
          <g-input v-model:value="form.managementURL" />
        </a-form-model-item>
        <a-form-model-item label="蓝光主机" prop="controllerHost">
          <g-input v-model:value="form.controllerHost" />
        </a-form-model-item>
        <a-form-model-item v-if="isEdit" label="volumeId" prop="volumeId">
          <g-input v-model:value="form.volumeId" disabled />
        </a-form-model-item>
        <a-form-model-item label="卷池编码" prop="volumeCode">
          <g-input v-model:value="form.volumeCode" />
        </a-form-model-item>
        <a-form-model-item label="卷池路径" prop="volumePath">
          <g-input v-model:value="form.volumePath" />
        </a-form-model-item>
        <a-form-model-item label="数据池主机" prop="sharePointHost">
          <g-input v-model:value="form.sharePointHost" />
        </a-form-model-item>
        <a-form-model-item label="数据池名称">
          <g-input v-model:value="form.sharePointName" />
        </a-form-model-item>
        <a-form-model-item label="数据池端口" prop="sharePointPort">
          <g-input v-model:value="form.sharePointPort" v-number />
        </a-form-model-item>
        <a-form-model-item label="数据池用户" prop="sharePointUser">
          <g-input v-model:value="form.sharePointUser" />
        </a-form-model-item>
        <a-form-model-item label="数据池密码" :prop="isEdit ? '' : 'sharePointPassword'">
          <g-input v-model:value="form.sharePointPassword" type="password" />
        </a-form-model-item>

        <a-form-model-item label="挂载点">
          <g-input v-model:value="form.mountPoint" />
        </a-form-model-item>
        <a-form-model-item label="描述" prop="description">
          <g-input v-model:value="form.description" type="textarea" />
        </a-form-model-item>
      </a-form-model>
    </g-drawer>
  </div>
</template>

<script>
/**
let obj = {
		"name": "蓝光存储存储层（1）",
		"type": "OceanStorage",
		"readOnly": true,
		"managementURL":"http://10.0.11.104:8080/oss/index/index.do",
		"controllerHost": "http://10.0.11.104:8033",
		"volumeCode": "POOL-AAAAA",
		"volumePath": "/mnt/testraid5/ocean/user-dev/cache/POOL-AAAAA",
		"sharePointHost":"ffs://10.0.11.104",
		"sharePointPort": 21,
		"sharePointName":"/mnt/testraid5/ocean/user-dev/cache/POOL-AAAAA",
		"sharePointUser":"user-dev",
		"sharePointPassword":"password",
		"mountPoint":"/usr/local/oct/oeos/data/ocean/volume/POOL-AAAAA"
	}
 */
export default {
  name: 'BlueCache',
  components: {},
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    locationOptions: {
      type: Array,
    },
  },
  data() {
    return {
      optionsRadio: [
        { text: 'GB', value: 'GB' },
        { text: 'TB', value: 'TB' },
        { text: 'PB', value: 'PB' },
      ],
      originForm: {},
      form: {
        quotaUnit: 'GB',
        mappingPattern: '',
      },
      rules: {
        name: [this.mBlurRequired()],
        managementURL: [this.mBlurRequired()],
        controllerHost: [this.mBlurRequired()],
        volumeCode: [this.mBlurRequired()],
        volumePath: [this.mBlurRequired()],
        sharePointHost: [this.mBlurRequired()],
        sharePointPort: [this.mBlurRequired()],
        sharePointUser: [this.mBlurRequired()],
        sharePointPassword: [this.mBlurRequired()],
      },
      isShow: false,
      isEdit: false,
      originMappingPattern: '',
    }
  },
  computed: {},
  watch: {},
  created() {
    this.originForm = this.$g.clone(this.form)
  },
  mounted() {},
  methods: {
    async handleOk() {
      await this.mValidForm()
      if (this.form.mappingPattern !== this.originMappingPattern) {
        await this.mConfirm('修改寻址模式会导致原始对象无法正确读取，您确定需要修改吗？')
      }
      await this.$req({
        url: 'storage/standard/component',
        method: 'put',
        data: this.form,
      })
      this.$toast('保存成功')
      this.$emit('success')
      this.isShow = false
    },
    editOpen(editItem) {
      this.isShow = true
      this.isEdit = true
      this.form = editItem
      this.originMappingPattern = editItem.mappingPattern
      this.$refs.formRef?.clearValidate()
    },
    open(type) {
      this.isEdit = false
      this.form = this.$g.clone(this.originForm)
      this.isShow = true
      this.form.type = type
      if (this.locationOptions.length > 0 && !this.form.mappingPattern) {
        this.originMappingPattern = this.locationOptions.filter((v) => v.value === 'Flat')[0].value
        this.form.mappingPattern = this.originMappingPattern
      }
      this.$refs.formRef?.clearValidate()
    },
  },
}
</script>
<style scoped lang="scss"></style>
