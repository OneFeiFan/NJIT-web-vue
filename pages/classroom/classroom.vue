<template>
  <page-meta :page-style="theme"></page-meta>
  <view class="container">
    <!-- 头部控制栏 -->
    <material-nav-bar color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250"
                      backgroundColor="var(--md-sys-color-surface-container)">
      <view class="nav-bar">
        <uni-icons type="left" size="6vmin" @click="back" color="var(--md-sys-color-on-surface)" class="icon-left"/>
        <text class="title">空教室查询</text>
        <uni-icons type="loop" size="6vmin" class="icon-right" color="var(--md-sys-color-surface-container)"/>
      </view>
    </material-nav-bar>
    <!-- 选择区 -->
    <view class="select" id="select">
      <material-list>
    <!--   日期选择区     -->
        <material-list-cell @click="openDatePicker" color="var(--md-sys-color-primary-fixed)" :opacity="0.4"
                            transition="ease-out" :duration="250"
                            backgroundColor="var(--md-sys-color-secondary-container)">
          <view class="list-content">
            <zui-svg-icon icon="md-event_available" :color="_colorMap['--md-sys-color-on-secondary-container']"/>
            <view>日期：{{ dateRange }}</view>
          </view>
        </material-list-cell>
        <material-list-cell @click="pickBuilding = true" color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out"
                            :duration="250" backgroundColor="var(--md-sys-color-secondary-container)">
          <view class="list-content">
            <zui-svg-icon icon="md-location" :color="_colorMap['--md-sys-color-on-secondary-container']"/>
              <view class="title">地点：{{building}}</view>
          </view>
        </material-list-cell>
        <material-list-cell :showLeftText="false" color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out"
                            :duration="250" backgroundColor="var(--md-sys-color-secondary-container)">
          <view class="group">
            <woTag mult row :options="coursesList" @changeSelect="onChangeTagOne"/>
          </view>
        </material-list-cell>
      </material-list>
    </view>
    <scroll-view scroll-y="true" class="scroll-table" :style="{'height': heigth + 'px'}">

      <uni-table ref="table" border stripe emptyText="暂无更多数据">
        <slot v-for="(value, key) in tableData" >
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
    <v-md-date-range-picker :autoApply="false" showYearSelect ref="datePicker" @change="dateChange"/>
    <u-picker :show="pickBuilding" @change="selectBuilding" :columns="buildings" @close="buildingConfirm" @confirm="buildingConfirm" @cancel="buildingConfirm" :closeOnClickOverlay="true"/>
  </view>
</template>

<script>
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import getCurriculumByUsernameAndPassword, {calculateCurrentWeek, getClassroom} from "@/static/util/tool";
import UniEasyinput from "@/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue";
import UniPopup from "@/uni_modules/uni-popup/components/uni-popup/uni-popup.vue";
import UniNavBar from "@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue";
import StatusBar from "@/components/status-bar/status-bar.vue";
import UniTable from "@/uni_modules/uni-table/components/uni-table/uni-table.vue";
import UniTr from "@/uni_modules/uni-table/components/uni-tr/uni-tr.vue";
import UniTd from "@/uni_modules/uni-table/components/uni-td/uni-td.vue";
import UniTh from "@/uni_modules/uni-table/components/uni-th/uni-th.vue";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import zuiSvgIcon from "@/uni_modules/zui-svg-icon/components/zui-svg-icon/zui-svg-icon.vue";
import VMdDateRangePicker from '@/components/material-uni/material-date-range-picker/components/Picker.vue'
import moment from 'moment';
import WoTag from "@/uni_modules/wo-tag/components/wo-tag/wo-tag.vue";
import UPicker from "@/uni_modules/uview-ui/components/u-picker/u-picker.vue";

export default {
  components: {
    UPicker,
    WoTag,
    VMdDateRangePicker,
    zuiSvgIcon,
    MaterialList,
    MaterialListCell,
    MaterialNavBar, UniTh, UniTd, UniTr, UniTable, StatusBar, UniNavBar, UniPopup, UniEasyinput, UniIcons
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
      tableData: {},
      weekAndDay:{

      }
    }
  },
  onLoad() {
  },
  onReady() {
    // this.update();
    const systemInfo = uni.getSystemInfoSync();
    let dom = uni.createSelectorQuery().in(this);
    dom.select("#select").boundingClientRect()

    dom.exec((data) => {
      this.heigth = systemInfo.windowHeight - data[0].bottom;
    })
  },
  onResize(){
    const systemInfo = uni.getSystemInfoSync();
    let dom = uni.createSelectorQuery().in(this);
    dom.select("#select").boundingClientRect()

    dom.exec((data) => {
      console.log(data[0].bottom)
      this.heigth = systemInfo.windowHeight - data[0].bottom;
    })
  },
  onShow() {
  },
  methods: {
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
      if(this.lh === this.buildingsMap[this.building]){
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
      this.$manager.getEmptyClassrooms(this.dateRange,String(this.jcd),this.lh).then(res=>{
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
.container{
  height: 100vh;
  background-color: var(--md-sys-color-surface-container);
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
.table-color{
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}
.nav-bar {
  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;
  //justify-content: center;


  .icon-left {
    margin-left: 6vmin;
    /* 调整这个值控制间距 */
    position: relative;
    //top: -6rpx
  }

  .rotate {
    animation: rotate 1s linear infinite;
    display: inline-block;
  }

  .icon-right {
    margin-right: 6vmin;
    /* 调整这个值控制间距 */
    position: relative;
    will-change: transform;
    //top: -6rpx
  }


  .title {
    margin: 0 auto;
    display: block;
    text-align: center;
    font-size: 5vmin;
    color: var(--md-sys-color-on-surface);
  }
}
</style>