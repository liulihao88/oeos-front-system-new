<template>
  <div>
    <div class="f-fe">
      <b-button class="m-b-20 tr f" variant="primary" size="sm" @click="add">新增组件</b-button>
    </div>
    <a-table :columns="columns" :data-source="datas" :pagination="false" bordered style="background-color: #fff">
      <template v-slot:action="text, record">
        <span>
          <a-button class="oct-iconfont-btn-box mr" size="small" type="link" @click="testComp(record)">测试</a-button>
          <a-button
            type="link"
            variant="primary"
            size="small"
            :disabled="record.readOnly === true"
            @click="edit(record)"
          >
            编辑
          </a-button>
          <a-button
            class="oct-iconfont-btn-box ml"
            size="small"
            type="link"
            variant="outline-primary"
            :disabled="record.readOnly === true"
            @click="remove(record)"
          >
            删除
          </a-button>
        </span>
      </template>
    </a-table>

    <g-dialog v-model:visible="isDialogShow" title="选择类型1" :footer="null">
      <a-form-model ref="dialogFormRef" :model="dialogForm" :rules="dialogRules" v-bind="mLayout()">
        <a-form-model-item label="组件类型" prop="type">
          <!-- <a-select v-model="dialogForm.type" placeholder="请选择" @change="handleDialogOK">
            <a-select-option v-for="(v, i) in options" :key="i" :value="v.value">
              {{ v.label }}
            </a-select-option>
          </a-select> -->
          <g-select v-model="dialogForm.type" :options="options" :customLabel="customLabel" @change="handleDialogOK" />
        </a-form-model-item>
      </a-form-model>
    </g-dialog>

    <g-dialog v-model:visible="isTestShow" title="组件信息" :footer="null" @ok="isTestShow = false">
      <a-form-model ref="dialogFormRef" :model="testForm" v-bind="mLayout()">
        <a-form-model-item label="存储组件ID">
          <div>{{ testForm.id }}</div>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <div>{{ testForm.statusTitle }}</div>
        </a-form-model-item>
        <a-form-model-item label="容量比例">
          <div class="progress-box po-r t-10">
            <Progress :capacity="testForm.totalSpace" :usedCapacity="testForm.usedSpace" />
          </div>
        </a-form-model-item>
      </a-form-model>
    </g-dialog>

    <BlueCache ref="blueCacheRef" :options="options" :locationOptions="locationOptions" @success="init" />
    <BaseCache
      ref="baseCacheRef"
      :options="options"
      :type="dialogForm.type || editType"
      :locationOptions="locationOptions"
      @success="init"
    />
  </div>
</template>

<script>
import BlueCache from '@/views/apps/storage/component/blueCache.vue'
import BaseCache from '@/views/apps/storage/component/baseCache.vue'

export default {
  name: 'T1',
  components: {
    BlueCache,
    BaseCache,
  },
  props: {},
  data() {
    return {
      columns: [
        {
          dataIndex: 'id',
          key: 'id',
          title: '存储组件ID',
        },
        {
          title: '名字',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '类型',
          dataIndex: 'typeTitle',
          key: 'typeTitle',
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: '操作',
          key: 'action',
          width: 400,
          scopedSlots: { customRender: 'action' },
        },
      ],
      testForm: {},
      options: [],
      datas: [],
      isDialogShow: false,
      isShow: false,
      isTestShow: false,
      dialogForm: {},
      editType: '',
      locationOptions: [],
      dialogRules: {
        type: [
          {
            required: true,
            message: '请选择类型',
            trigger: ['blur', 'change'],
          },
        ],
      },
    }
  },
  computed: {},
  watch: {},
  created() {
    this.init()
    this.getCompList()
    this.setTitleCommonType(['存储管理', '组件配置', ''], [true, true, ''], 'storage')
  },
  mounted() {},
  methods: {
    customLabel(obj) {
      return `${obj.name}(${obj.value})`
    },
    async getCompList() {
      let res = await this.$req({
        url: 'support/storages',
        baseURL: '/v1/admin/common',
      })
      this.options = res || []
      this.options = this.options.filter((v) => {
        return v.value !== 'RFAStorage' && v.value !== 'LocalStorage'
      })

      let locationRes = await this.$req({
        url: 'support/mappingpatterns',
        baseURL: '/v1/admin/common',
      })
      this.locationOptions = locationRes || []
    },
    async testComp(item) {
      let res = await this.$req({
        url: `storage/standard/component/${item.id}/status`,
      })
      this.isTestShow = true
      this.testForm = res
    },
    add() {
      this.dialogForm = {}
      this.isDialogShow = true
    },
    async handleDialogOK(val) {
      if (val) {
        this.isDialogShow = false
        if (this.dialogForm.type === 'OceanStorage') {
          this.$refs.blueCacheRef.open(this.dialogForm.type)
        } else {
          this.$refs.baseCacheRef.open(this.dialogForm.type)
        }
      }
    },
    async init() {
      this.datas = await this.$req({
        url: 'storage/standard/component/summaries',
      })
      console.log(`this.datas`, this.datas)
    },
    async edit(v) {
      let res = await this.$req({
        url: `storage/standard/component/${v.id}`,
      })
      this.editType = res.type
      if (res.type === 'OceanStorage') {
        this.$refs.blueCacheRef.editOpen(res)
      } else {
        this.$refs.baseCacheRef.editOpen(res)
      }
    },
    async remove(v, i) {
      await this.$req({
        url: `storage/standard/component/${v.id}`,
        method: 'delete',
      })
      this.$toast('删除成功')
      this.init()
    },
  },
}
</script>
<style scoped lang="scss">
.cache-component-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.c-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  background-color: #fff;
  border: 1px solid #f1f1f4;
  border-radius: 6px;
  box-shadow: 0 3px 4px 0 rgb(0 0 0 / 3%);
}

.c-list-item {
  position: relative;
  box-sizing: border-box;
  width: 24%;
  height: 200px;
  margin-top: 16px;
}

.c-list-item:not(:nth-child(4n)) {
  margin-right: calc(4% / 3);
}

.edit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  // width: 40px;
}
</style>
