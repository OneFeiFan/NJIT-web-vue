<template>
  <view class="container" :style="themeStyle">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons color="var(--md-sys-color-on-primary)" size="" type="left" @click="back" class="icon-left"/>
        <view class="title">空教室查询</view>
        <view class="icon-right"></view>
      </view>
    </material-nav-bar>

    <view class="main">
      <view class="select" id="select">
        <material-list background-color="var(--md-sys-color-surface)" color="var(--md-sys-color-on-secondary-container)">
          <material-list-cell @click="openDatePicker">
            <view class="list-content">
              <zui-svg-icon icon="event_available" collection="material-filled" :color="getColor('--md-sys-color-on-secondary-container')"/>
              <view class="filter-text">日期：{{ dateRange }}</view>
            </view>
          </material-list-cell>
          <material-list-cell @click="pickBuilding = true">
            <view class="list-content">
              <zui-svg-icon icon="location_on" collection="material-filled" :color="getColor('--md-sys-color-on-secondary-container')"/>
              <view class="filter-text">地点：{{ building }}</view>
            </view>
          </material-list-cell>
          <material-list-cell :showLeftText="false">
            <view class="group">
              <woTag mult row :options="coursesList" @changeSelect="onChangeTagOne"
                     color="var(--md-sys-color-on-secondary)"
                     backgroundColor="var(--md-sys-color-secondary)"
                     :activateStyle="{'background-color': 'var(--md-sys-color-primary)', 'color': 'var(--md-sys-color-on-primary)'}"/>
            </view>
          </material-list-cell>
        </material-list>
      </view>

      <scroll-view scroll-y="true" class="table-container">

        <view class="no-data" v-if="Object.keys(tableData).length <= 0">
          <text>当前时段暂无空教室</text>
        </view>

        <view class="week-card-group" v-for="(value, key) in tableData" :key="key">
          <material-card background-color="var(--md-sys-color-surface-container-low)">
            <view class="week-card-inner">

              <view class="week-title">
                <text>第 {{ key }} 周</text>
              </view>

              <view class="md3-table">
                <view class="md3-thead">
                  <view class="md3-th align-left">地点</view>
                  <view class="md3-th align-center">教室</view>
                  <view class="md3-th align-center">余座</view> </view>

                <view class="md3-tr" v-for="(item, index) in value" :key="index">
                  <view class="md3-td align-left">{{ item.jxlmc }}</view>
                  <view class="md3-td align-center">{{ item.cdmc }}</view>
                  <view class="md3-td align-center">
                    <view class="seat-chip" :class="{'is-full': Number(item.zws) < 10}">
                      {{ item.zws }}
                    </view>
                  </view>
                </view>
              </view>

            </view>
          </material-card>
        </view>
      </scroll-view>
    </view>

    <v-md-date-range-picker :autoApply="false" showYearSelect ref="datePicker" @change="dateChange"/>
    <u-picker style="position: absolute;" :show="pickBuilding" @change="selectBuilding" :columns="buildings"
              @close="buildingConfirm" @confirm="buildingConfirm" @cancel="buildingConfirm"
              :closeOnClickOverlay="true"/>
  </view>
</template>

<script>
//#ifdef H5
import {http} from "@/static/util/request";
//#endif
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import {getClassroom} from "@/static/util/tool";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import zuiSvgIcon from "@/uni_modules/zui-svg-icon/components/zui-svg-icon/zui-svg-icon.vue";
import VMdDateRangePicker from '@/components/material-uni/material-date-range-picker/components/Picker.vue'
import WoTag from "@/components/material-uni/tag-list/tag-list.vue";
import UPicker from "@/uni_modules/uview-ui/components/u-picker/u-picker.vue";
import {SXData} from "@/components/material-uni/sx"

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    UPicker,
    WoTag,
    VMdDateRangePicker,
    zuiSvgIcon,
    MaterialList,
    MaterialListCell,
    MaterialNavBar,
    UniIcons
  },
  data() {
    return {
      pickBuilding: false,
      dateRange: "yyyy-mm-dd/yyyy-mm-dd",
      coursesList: [
        {value: 1, label: '第一节'}, {value: 2, label: '第二节'},
        {value: 3, label: '第三节'}, {value: 4, label: '第四节'},
        {value: 5, label: '第五节'}, {value: 6, label: '第六节'},
        {value: 7, label: '第七节'}, {value: 8, label: '第八节'},
        {value: 9, label: '第九节'}, {value: 10, label: '第十节'},
        {value: 11, label: '第十一节'}
      ],
      building: '东馆',
      buildings: [["东馆", "西馆", "南馆", "信息楼", "经管楼", "文理楼", "设计楼", "工程中心"]],
      buildingsMap: {
        "东馆": "DG001", "西馆": "XG001", "南馆": "NG001",
        "信息楼": "XXL001", "经管楼": "JGL001", "文理楼": "WLL001",
        "设计楼": "SJl001", "工程中心": "GCZ001",
      },
      jcd: 0,
      lh: 'DG001',
      tableData: {}
    }
  },
  methods: {
    onChangeTagOne(e) {
      this.jcd = 0;
      for (let key in e) {
        this.jcd += Math.pow(2, e[key].value - 1);
      }
      this.getClassRoom();
    },
    dateChange(array) {
      this.dateRange = array[0].format('YYYY-MM-DD') + '/' + array[1].format('YYYY-MM-DD');
      this.getClassRoom()
    },
    openDatePicker(e) {
      this.$refs.datePicker.open()
    },
    buildingConfirm() {
      this.pickBuilding = false;
      if (this.lh === this.buildingsMap[this.building]) return;
      this.lh = this.buildingsMap[this.building];
      this.getClassRoom();
    },
    selectBuilding({value}) {
      this.building = value[0];
    },
    back() {
      uni.navigateBack();
    },
    getClassRoom() {
      if (this.lh === '' || this.jcd === 0 || this.dateRange === 'yyyy-mm-dd/yyyy-mm-dd') {
        this.tableData = {};
        return;
      }
      // #ifdef APP-PLUS
      this.$manager.getEmptyClassrooms(this.dateRange, String(this.jcd), this.lh).then(res => {
        let result = {};
        for (let key in res) {
          result[key] = getClassroom(res[key]);
        }
        this.tableData = result;
      })
      // #endif
      // #ifdef H5
      http.post("/getEmptyClassrooms", {
        dateRange: this.dateRange,
        coursePeriod: String(this.jcd),
        buildingId: this.lh
      }).then(res => {
        if(res.code === 200) {
          let result = {};
          for (let key in res.data) {
            result[key] = getClassroom(res.data[key]);
          }
          this.tableData = result;
        }
      }).catch(err => {
        console.error('获取空教室数据失败:', err);
        this.tableData = {};
      })
      // #endif
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--md-sys-color-surface);
}

.select {
  .list-content {
    display: flex;
    align-items: center;
  }
  .filter-text {
    margin-left: sx(2);
    font-size: sx(4.5);
    color: var(--md-sys-color-on-surface);
  }
  .group {
    width: 100%;
  }
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--md-sys-color-on-surface-variant);
  font-size: sx(4.5);
  font-weight: 500;
}

.main {
  flex: 1;

  .table-container {
    height: calc(100vh - var(--status-bar-height) - sx(60));
  }

  /* === MD3 风格表格设计 === */
  .week-card-group {
    padding: sx(4) sx(4) 0 sx(4);
  }

  .week-card-inner {
    display: flex;
    flex-direction: column;
    padding-bottom: sx(2);
    // 左侧强调线
    border-left: sx(1.5) solid var(--md-sys-color-primary);
  }

  .week-title {
    padding: sx(4) sx(4) sx(2) sx(4);
    font-size: sx(4.5);
    font-weight: 700;
    color: var(--md-sys-color-primary);
  }

  .md3-table {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .md3-thead {
    display: flex;
    align-items: center;
    padding: sx(2) sx(4);
    border-bottom: max(sx(0.25), 0.5px) solid var(--md-sys-color-outline-variant);
  }

  .md3-tr {
    display: flex;
    align-items: center;
    padding: sx(3) sx(4);
    // 极浅色分割线
    border-bottom: max(sx(0.25), 0.5px) solid color-mix(in srgb, var(--md-sys-color-outline-variant) 30%, transparent);

    // 偶数行微弱斑马纹
    &:nth-child(even) {
      background-color: color-mix(in srgb, var(--md-sys-color-surface-variant) 15%, transparent);
    }

    &:last-child {
      border-bottom: none;
    }
  }

  /* 基础单元格：升级为 Flex 布局以保证多端绝对水平+垂直居中 */
  .md3-th, .md3-td {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .md3-th {
    font-size: sx(3.5);
    font-weight: 600;
    color: var(--md-sys-color-on-surface-variant);
  }

  .md3-td {
    font-size: sx(4);
    color: var(--md-sys-color-on-surface);
  }

  /* 对齐辅助类：改用 flex 轴线对齐 */
  .align-left { justify-content: flex-start; }
  .align-center { justify-content: center; }
  .align-right { justify-content: flex-end; }

  /* 状态胶囊 */
  .seat-chip {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: sx(8);
    padding: sx(0.5) sx(2);
    border-radius: sx(2);
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    font-family: monospace;
    font-weight: 600;
    font-size: sx(3.5);

    // 告急状态（余座小于 10 时变红）
    &.is-full {
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
    }
  }

  /* 横屏适配 */
  @media (orientation: landscape) {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .table-container {
      height: calc(100vh - var(--status-bar-height) - sx(15));
    }

    .select {
      width: 50%;
      height: 100%;
    }

    scroll-view {
      flex: 1;
    }
  }
}
</style>