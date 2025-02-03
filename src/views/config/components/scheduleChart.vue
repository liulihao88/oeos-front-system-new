<script setup lang="ts">
import { ref, watch } from 'vue'
// https://zunnzunn.github.io/vue-ganttastic/introduction.html
import { GGanttChart, GGanttRow } from '@infectoone/vue-ganttastic'
import { isEmpty, notEmpty, clone } from 'oeos-components'

const emits = defineEmits(['edit'])

const props = defineProps({
  weeks: {
    type: Array,
    required: true,
  },
})

const colorMap = ['#e96560', '#5ccfa3', '#77d6fa', '#f3953d', '#5ccfa3', '#f8bc45', '#f3953d']

const baseData = [
  {
    label: '星期一',
    dayOfWeek: 'Mon',
    dates: [],
  },
  {
    label: '星期二',
    dayOfWeek: 'Tue',
    dates: [],
  },
  {
    label: '星期三',
    dayOfWeek: 'Wed',
    dates: [],
  },
  {
    label: '星期四',
    dayOfWeek: 'Thu',
    dates: [],
  },
  {
    label: '星期五',
    dayOfWeek: 'Fri',
    dates: [],
  },
  {
    label: '星期六',
    dayOfWeek: 'Sat',
    dates: [],
  },
  {
    label: '星期日',
    dayOfWeek: 'Sun',
    dates: [],
  },
]

function translateValue(value) {
  const copyValue = clone(value)
  const copyBaseData = clone(baseData)
  let result = copyBaseData.map((v) => {
    copyValue.forEach((val) => {
      let [dayOfWeek, timeLabel] = val.daytime.split(' ')
      if (v.dayOfWeek === dayOfWeek) {
        v.dates.push({
          ...val,
          beginDate: timeLabel.split(':')[0] + ':00:00',
          endDate: timeLabel.split(':')[0] + ':59:59',
          timeLabel: timeLabel,
        })
      }
    })
    return v
  })
  return result
}
const context = ref([])

const editDetail = (bar, i = 0) => {
  emits('edit', bar.dates[i])
}

const parseContent = (bar, item) => {
  let showText = ''
  ;(bar.dates || []).forEach((v) => {
    if (bar.beginDate === v.beginDate) {
      showText += `${v.taskName}:<span class="cl-green ml">${v.timeLabel}</span><br>`
    }
  })
  return showText
}

watch(
  () => props.weeks,
  (val) => {
    const baseObj = {
      ganttBarConfig: {
        immobile: false,
        hasHandles: false,
        style: {
          fontSize: '12px',
        },
      },
    }
    if (isEmpty(val)) {
      context.value = baseData.map((v, i) => {
        let arr = []
        let obj = {
          ...baseObj,
          label: v.label,
          beginDate: '',
          endDate: '',
        }
        obj.ganttBarConfig.style.background = 'unset'
        arr.push(obj)
        return arr
      })
      return
    }

    let finalData = translateValue(val)
    context.value = finalData.map((v, i) => {
      let arr = []
      const cloneDates = clone(v.dates)
      if (v.dates.length === 0) {
        let obj = {
          ...baseObj,
          label: v.label,
          beginDate: '',
          endDate: '',
        }
        obj.ganttBarConfig.style.background = 'unset'
        arr.push(obj)
      } else {
        v.dates.forEach((val) => {
          let obj = clone(baseObj)
          obj.label = v.label
          obj.beginDate = val?.beginDate ?? ''
          obj.endDate = val?.endDate ?? ''
          obj.ganttBarConfig.label = v.dates.length === 1 ? '1' : v.dates.length
          obj.ganttBarConfig.style.background = colorMap[i]

          obj.dates = cloneDates
          arr.push(obj)
        })
      }
      return arr
    })
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>

<template>
  <g-gantt-chart
    chart-start="00:00:00"
    chart-end="23:59:00"
    precision="hour"
    date-format="HH:mm:ss"
    bar-start="beginDate"
    bar-end="endDate"
    grid
  >
    <template #upper-timeunit>
      <h1 />
    </template>
    <g-gantt-row
      v-for="(item, index) in context"
      :key="index"
      :bars="item"
      :label="item[0].label"
      highlight-on-hover
      :immobile="false"
      :hasHandles="false"
    >
      <template #bar-label="{ bar }">
        <template v-if="bar.dates?.filter((val) => val.beginDate === bar.beginDate).length == 1">
          <o-tooltip :content="parseContent(bar, item)" raw-content width="200" class="cp" @click="editDetail(bar)">
            {{ bar.dates?.filter((val) => val.beginDate === bar.beginDate).length }}
          </o-tooltip>
        </template>
        <template v-else>
          <el-dropdown trigger="click">
            {{ bar.dates?.filter((val) => val.beginDate === bar.beginDate).length }}
            <template #dropdown>
              <el-dropdown-menu>
                <template v-for="(v, i) in bar.dates?.filter((val) => val.beginDate === bar.beginDate)" :key="i">
                  <el-dropdown-item @click="editDetail(bar, i)">
                    {{ v.taskName }}
                    <span class="cl-green ml">{{ v.timeLabel }}</span>
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </template>
    </g-gantt-row>
  </g-gantt-chart>
</template>

<style lang="scss" scoped>
:deep(.g-timeaxis) {
  height: 40px;

  > .g-timeunits-container:first-child {
    display: none;
  }

  .g-timeunits-container {
    height: 100%;
  }
}

:deep(.g-gantt-row:last-child) {
  border-bottom: 2px solid #eaeaea;
}

:deep(.tooltip__text),
:deep(.el-tooltip__trigger),
:deep(.el-dropdown) {
  display: block;
  width: 100%;
  text-align: center;
}

:deep(.g-gantt-bar-label) {
  padding: 0;
}
</style>
