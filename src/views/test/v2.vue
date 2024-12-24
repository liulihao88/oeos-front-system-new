<template>
  <div>
    <g-drawer
      v-model:visible="isShow"
      width="1000"
      :title="isEdit ? `编辑组件(${type})` : `新增组件(${type})`"
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

        <a-form-model-item v-if="type === 'S3CompatibleStorage'" label="配额" prop="quota">
          <div class="f-bt">
            <g-input v-model:value="form.quota" class="w-150" />
            <a-radio-group v-model="form.quotaUnit">
              <a-radio-button value="GB">GB</a-radio-button>
              <a-radio-button value="TB">TB</a-radio-button>
              <a-radio-button value="PB">PB</a-radio-button>
            </a-radio-group>
          </div>
        </a-form-model-item>
        <a-form-model-item v-if="type !== 'InternalDSeriesStorage'" label="端点" prop="endpoint">
          <g-input v-model:value="form.endpoint" />
        </a-form-model-item>
        <a-form-model-item v-if="type !== 'InternalDSeriesStorage'" label="桶名称" prop="bucketName">
          <g-input v-model:value="form.bucketName" />
        </a-form-model-item>

        <a-form-model-item v-if="type !== 'InternalDSeriesStorage'" label="端口" prop="port">
          <g-input v-model:value="form.port" v-number />
        </a-form-model-item>
        <a-form-model-item v-if="type !== 'InternalDSeriesStorage'" label="启用SSL">
          <a-switch v-model="form.enableSSL" active-color="#13ce66" inactive-color="#ff4949" />
        </a-form-model-item>
        <a-form-model-item v-if="type !== 'InternalDSeriesStorage'" label="accessKey" prop="ak">
          <g-input v-model:value="form.ak" />
        </a-form-model-item>
        <a-form-model-item v-if="type !== 'InternalDSeriesStorage'" label="secretKey" :prop="isEdit ? '' : 'sk'">
          <g-input v-model:value="form.sk" />
        </a-form-model-item>
        <a-form-model-item v-if="type !== 'InternalDSeriesStorage'" label="签名类型" prop="signerType">
          <g-select v-model="form.signerType" :options="signOptions" placeholder="请选择" />
        </a-form-model-item>
        <a-form-model-item
          v-if="type !== 'S3CompatibleStorage' && type !== 'InternalDSeriesStorage' && type !== 'HCPSSeriesStorage'"
          label="MAPI主机"
          prop="mapiHost"
        >
          <g-input v-model:value="form.mapiHost" />
        </a-form-model-item>
        <a-form-model-item
          v-if="type !== 'S3CompatibleStorage' && type !== 'InternalDSeriesStorage' && type !== 'HCPSSeriesStorage'"
          label="MAPI端口"
          prop="mapiPort"
        >
          <g-input v-model:value="form.mapiPort" v-number />
        </a-form-model-item>
        <a-form-model-item v-if="type === 'InternalDSeriesStorage'" label="数据中心名称" prop="dcname">
          <g-select
            v-model="form.dcname"
            :customLabel="customLabel"
            style="width: 100%"
            :options="dcOptions"
            val="name"
            label="name"
          />
        </a-form-model-item>

        <a-form-model-item v-if="type === 'HCPSSeriesStorage'" label="用户名" prop="username">
          <g-input v-model:value="form.username" />
        </a-form-model-item>
        <a-form-model-item v-if="type === 'HCPSSeriesStorage'" label="密码" :prop="isEdit ? '' : 'password'">
          <g-input v-model:value="form.password" />
        </a-form-model-item>
        <a-form-model-item v-if="type === 'HCPSSeriesStorage'" label="API版本号" prop="apiVersion">
          <g-input v-model:value="form.apiVersion" />
        </a-form-model-item>

        <a-form-model-item label="描述">
          <a-input v-model="form.description" type="textarea" />
        </a-form-model-item>
      </a-form-model>
    </g-drawer>
  </div>
</template>

<script>
/**
let obj = {
		"name": "D节点存储层",
		"type": "DSeriesStorage",
		"readOnly": true,
		"quota": 1,
		"quotaUnit": "TB",
		"deviceClass": "",
		"storageDeviceID": "",
		"endpoint": "datacenter.oeoshost:19000",
		"bucketName": "dtspace1",
		"port": -1,
		"enableSSL": false,
		"ak": "datacenteradmin",
		"sk": "datacenteradmin",
		"signerType": "v4",
		"supportBatchDelete":false,
		"deleteThread":10,
		"mapiHost": "127.0.0.1",
		"mapiPort": 9093
		"description": null,
	}

  dcname: ''
 */
export default {
  name: 'BlueCache',
  components: {},
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String, // S3CompatibleStorage, DSeriesStorage, InternalDSeriesStorage, HCPSSeriesStorage
      default: '',
    },
    locationOptions: {
      type: Array,
    },
  },
  data() {
    return {
      signOptions: [
        { label: 'Default', value: 'Default' },
        { label: 'Signature Version 4', value: 'V4' },
        { label: 'Signature Version 2', value: 'V2' },
      ],
      dcOptions: [],
      optionsRadio: [
        { text: 'GB', value: 'GB' },
        { text: 'TB', value: 'TB' },
        { text: 'PB', value: 'PB' },
      ],
      originForm: {},
      form: {
        quotaUnit: 'GB',
        signerType: 'V4',
        mappingPattern: '',
      },
      rules: {
        apiVersion: [this.mBlurRequired()],
        name: [this.mBlurRequired()],
        quota: [this.mBlurRequired()],
        endpoint: [this.mBlurRequired()],
        bucketName: [this.mBlurRequired()],
        port: [this.mBlurRequired()],
        enableSSL: [this.mBlurRequired()],
        ak: [this.mBlurRequired()],
        username: [this.mBlurRequired()],
        password: [this.mBlurRequired()],
        sk: [this.mBlurRequired()],
        signerType: [this.mBlurRequired('请选择')],
        mapiHost: [this.mBlurRequired()],
        mapiPort: [this.mBlurRequired()],
        dcname: [this.mBlurRequired('请选择')],
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
    this.getDataCenters()
  },
  mounted() {},
  methods: {
    customLabel(item) {
      console.log(`item`, item)
      return `名称: ${item.name}, 状态: ${item.statusTitle}, 总容量: ${this.$g.formatBytes(
        item.totalSpace,
      )}, 已用容量: ${this.$g.formatBytes(item.usedSpace)}`
    },
    async getDataCenters() {
      let res = await this.$req({
        url: 'storage/internal/datacenters',
      })
      console.log(`res`, res)
      this.dcOptions = res
      // if (this.$dev) {
      //   this.dcOptions = this.dcOptions.map((v) => {
      //     v.name = '123'
      //     return v
      //   })
      // }
    },
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
