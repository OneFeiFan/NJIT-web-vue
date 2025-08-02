<template>
  <view class="container" :style="[getTheme(),SXData]">
    <!-- 头部控制栏 -->
    <material-nav-bar color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250"
                      backgroundColor="var(--md-sys-color-surface-container)">
      <view class="nav-bar">
        <uni-icons type="left" size="" @click="back" color="var(--md-sys-color-on-surface)"
                   class="icon-left"/>

        <view class="title">空教室查询</view>

        <uni-icons type="loop" size="" @click="" class="icon-right"
                   color="rgba(255, 255, 255, 0)"/>
      </view>
    </material-nav-bar>
    <!-- 选择区 -->
    <view class="main">
      <view class="select" id="select">
        <material-list>
          <!--   日期选择区     -->
          <material-list-cell @click="openDatePicker" color="var(--md-sys-color-surface-container)" :opacity="0.4"
                              transition="ease-out" :duration="250"
                              backgroundColor="var(--md-sys-color-secondary-container)">
            <view class="list-content">
              <zui-svg-icon icon="md-event_available" :color="getColor('--md-sys-color-on-secondary-container')"/>
              <view>日期：{{ dateRange }}</view>
            </view>
          </material-list-cell>
          <material-list-cell @click="pickBuilding = true" color="var(--md-sys-color-surface-container)" :opacity="0.4"
                              transition="ease-out"
                              :duration="250" backgroundColor="var(--md-sys-color-secondary-container)">
            <view class="list-content">
              <zui-svg-icon icon="md-location" :color="getColor('--md-sys-color-on-secondary-container')"/>
              <view class="title">地点：{{ building }}</view>
            </view>
          </material-list-cell>
          <material-list-cell :showLeftText="false" color="var(--md-sys-color-surface-container)" :opacity="0.4"
                              transition="ease-out"
                              :duration="250" backgroundColor="var(--md-sys-color-secondary-container)">
            <view class="group">
              <woTag mult row :options="coursesList" @changeSelect="onChangeTagOne"
                     color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250"
                     backgroundColor="var(--md-sys-color-secondary)" fontColor="var(--md-sys-color-on-secondary)"
                     :activateStyle="{'background-color': 'var(--md-sys-color-primary)', 'color': 'var(--md-sys-color-on-primary)'}"/>
            </view>
          </material-list-cell>
        </material-list>
      </view>
      <scroll-view scroll-y="true" class="table-container">

        <view class="no-data" v-if="tableData.length <= 0">
          暂无数据
        </view>

        <uni-table ref="table" border stripe emptyText="">
          <slot v-for="(value, key) in tableData">
            <uni-tr>
              <uni-th class="table-color" align="center"></uni-th>
              <uni-th class="table-color" align="center">第{{ key }}周</uni-th>
              <uni-td class="table-color" align="center"></uni-td>
            </uni-tr>
            <uni-tr>
              <uni-th class="table-color" width="1" align="center">地点</uni-th>
              <uni-th class="table-color" width="1" align="center">教室</uni-th>
              <uni-th class="table-color" width="1" align="center">座位</uni-th>
            </uni-tr>


            <uni-tr v-for="(item, index) in value" :key="index">
              <uni-td class="table-color" align="center">{{ item.jxlmc }}</uni-td>
              <uni-td class="table-color" align="center">
                {{ item.cdmc }}
              </uni-td>
              <uni-td class="table-color" align="center">
                {{ item.zws }}
              </uni-td>
            </uni-tr>
          </slot>
        </uni-table>
      </scroll-view>
    </view>
    <v-md-date-range-picker :autoApply="false" showYearSelect ref="datePicker" @change="dateChange"/>
    <u-picker style="position: absolute;" :show="pickBuilding" @change="selectBuilding" :columns="buildings"
              @close="buildingConfirm" @confirm="buildingConfirm" @cancel="buildingConfirm"
              :closeOnClickOverlay="true"/>
<!--    <footer class="footer"/>-->
  </view>
</template>

<script>
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import {getClassroom} from "@/static/util/tool";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import zuiSvgIcon from "@/uni_modules/zui-svg-icon/components/zui-svg-icon/zui-svg-icon.vue";
import VMdDateRangePicker from '@/components/material-uni/material-date-range-picker/components/Picker.vue'
import WoTag from "@/components/material-uni/tag-list/tag-list.vue";
import UniTable from "@/uni_modules/uni-table/components/uni-table/uni-table.vue";
import UniTr from "@/uni_modules/uni-table/components/uni-tr/uni-tr.vue";
import UniTh from "@/uni_modules/uni-table/components/uni-th/uni-th.vue";
import UniTd from "@/uni_modules/uni-table/components/uni-td/uni-td.vue";
import UPicker from "@/uni_modules/uview-ui/components/u-picker/u-picker.vue";
import {mx, SXData} from "@/components/material-uni/sx"
import {getColor, getTheme} from "@/components/material-uni/colors";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    UPicker,
    UniTd,
    UniTh,
    UniTr,
    UniTable,
    WoTag,
    VMdDateRangePicker,
    zuiSvgIcon,
    MaterialList,
    MaterialListCell,
    MaterialNavBar, UniIcons
  },
  data() {
    return {
      pickBuilding: false,
      dateRange: "yyyy-mm-dd/yyyy-mm-dd",
      // weeksList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      // coursesList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      coursesList: [{
        value: 1,
        label: '第一节',
      },
        {
          value: 2,
          label: '第二节',
        },
        {
          value: 3,
          label: '第三节',
        },
        {
          value: 4,
          label: '第四节',
        },
        {
          value: 5,
          label: '第五节',
        },
        {
          value: 6,
          label: '第六节',
        },
        {
          value: 7,
          label: '第七节',
        },
        {
          value: 8,
          label: '第八节',
        },
        {
          value: 9,
          label: '第九节',
        },
        {
          value: 10,
          label: '第十节',
        },
        {
          value: 11,
          label: '第十一节',
        }],
      building: '东馆',
      // daysList: [1, 2, 3, 4, 5, 6, 7],
      buildings: [[
        "东馆",
        "西馆",
        "南馆",
        "信息楼",
        "经管楼",
        "文理楼",
        "设计楼",
        // "教学楼": "JXL001",
        // "北大活": "BDH001",
        // "图书馆": "TSG001",
        // "体育中心": "TY001",
        // "体育公园": "TYG001",
        "工程中心"
        // "科创中心": "KC001",
        // "实验楼": "SYL001",
        // "基础实验楼": "JCS001",
        // "江宁校区实验楼": "JN001",
        // "无楼号": "wlh",
        // "无": "W001"
      ]],
      buildingsMap: {
        "东馆": "DG001",
        "西馆": "XG001",
        "南馆": "NG001",
        "信息楼": "XXL001",
        "经管楼": "JGL001",
        "文理楼": "WLL001",
        "设计楼": "SJl001",
        // "教学楼": "JXL001",
        // "北大活": "BDH001",
        // "图书馆": "TSG001",
        // "体育中心": "TY001",
        // "体育公园": "TYG001",
        "工程中心": "GCZ001",
        // "科创中心": "KC001",
        // "实验楼": "SYL001",
        // "基础实验楼": "JCS001",
        // "江宁校区实验楼": "JN001",
        // "无楼号": "wlh",
        // "无": "W001"
      },
      num2text: {
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '日'
      },
      zcd: 0,
      jcd: 0,
      xqj: '',
      lh: 'DG001',
      // xnm: "",//学年，且取小的那个
      // xqm: "",//哪个学期1学期3，2学期12，3学期？16
      check: null,
      captchaImg: null,
      username: '',
      password: '',
      captcha: '',
      loading: false,
      heigth: 0,
      tableData: [],
      weekAndDay: {},
      footer: null
    }
  },
  onLoad() {
    // uni.onWindowResize(this.refreshScrollHeight)
  },
  onReady() {
    // this.footer = uni.createSelectorQuery().select('.footer')
    // this.refreshScrollHeight();
  },
  onShow() {
  },
  methods: {
    getColor,
    getTheme,
    refreshScrollHeight() {
      const {safeArea: {height}, windowHeight, deviceOrientation} = uni.getSystemInfoSync();
      const headerHeight = parseInt(mx(deviceOrientation === "landscape" ? 10.05 : 55.05));
      const derta = height - headerHeight - windowHeight;

      this.$nextTick(() => {
        this.footer.boundingClientRect((rect) => {
          this.heigth = derta + rect.top;
        }).exec();
      });
    },
    onChangeTagOne(e) {
      console.log(e)
      // [{"value":1,"label":"第一节"}]
      this.jcd = 0;
      for (let key in e) {
        this.jcd += Math.pow(2, e[key].value - 1);
      }
      console.log(this.jcd)
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
      if (this.lh === this.buildingsMap[this.building]) {
        return;
      }
      this.lh = this.buildingsMap[this.building];
      console.log(this.lh)
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
        console.log('请选择完整信息', this.xqj === '')
        this.tableData = [];
        return;
      }
      this.$manager.getEmptyClassrooms(this.dateRange, String(this.jcd), this.lh).then(res => {
        let data = JSON.parse(res);
        let result = {};
        for (let key in data) {
          result[key] = getClassroom(JSON.parse(data[key]));
        }
        this.tableData = result;
      })
    }
  }
}
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--md-sys-color-secondary-container);
}

.select {
  .list-content {
    display: flex;
    align-items: center;
    color: var(--md-sys-color-on-secondary-container);
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
  color: var(--md-sys-color-on-secondary-container);
  font-weight: bold;
}

.table-color {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.main {
  flex: 1;

  .table-container{
    height: calc(100vh - var(--status-bar-height) - sx(55));
  }
  @media (orientation: landscape) {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between; /* 根据需要调整 */

    .table-container{
      height: calc(100vh - var(--status-bar-height) - sx(10));
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

.footer {
  position: absolute;
  bottom: 0;
  height: 0;
}
</style>