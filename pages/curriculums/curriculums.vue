<template>
  <view class="container" :style="[theme,SXData]">
    <!-- 头部控制栏 -->
    <material-nav-bar>
      <view class="nav-bar">
        <uni-icons type="bars" size="" @click="isDrawerOpen = true" color="var(--md-sys-color-on-secondary-container)"
                   class="icon-left"/>

        <picker class="title" @change="change" :value="week" :range="range">
          <view class="title">{{ range[week] }}</view>
        </picker>

        <uni-icons type="loop" size="" @click="update(true)" class="icon-right"
                   color="var(--md-sys-color-on-secondary-container)"/>
      </view>
    </material-nav-bar>
    <myswiper ref="swiper" :default-index="calculateCurrentWeek()" @change="changeSwipe">
      <timetable v-for="(tab,index) in timetableData" :other="other" :timetables="tab" :timetableType="timeSlots"
                 :weekStartDate="weekStartDate" :thisWeek="index"
                 @courseClick="handleCourseClick"></timetable>
    </myswiper>
    <MyDrawer :opened="isDrawerOpen" @onClose="isDrawerOpen = false"/>
    <sv-intercept-back :show="isDrawerOpen" :beforeIntercept="()=>{isDrawerOpen = false}"/>
    <material-tab-bar/>
  </view>
</template>

<script>
import Timetable from '@/components/lpx-timetable/lpx-timetable'
import moment from 'moment';
import UniEasyinput from "@/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue";
import UniPopup from "@/uni_modules/uni-popup/components/uni-popup/uni-popup.vue";
import getCurriculumByUsernameAndPassword from "@/static/util/tool"
import UIcon from "@/uni_modules/uview-ui/components/u-icon/u-icon.vue";
import UButton from "@/uni_modules/uview-ui/components/u-button/u-button.vue";
import UniNavBar from "@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue";
import YTabs from "@/uni_modules/y-tabs/components/y-tabs/y-tabs.vue";
import YTab from "@/uni_modules/y-tabs/components/y-tab/y-tab.vue";
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import SvInterceptBack from "@/uni_modules/sv-intercept-back/components/sv-intercept-back/sv-intercept-back.vue";
import TouchRipple from "@/components/material-uni/ripple/component.vue";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialTabBar from "@/components/material-uni/material-tab-bar/material-tab-bar.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import Drawer from '@/components/material-uni/drawer/drawer.vue';
import StatusBar from "@/components/material-uni/status-bar/status-bar.vue";
import myswiper from "@/components/material-uni/swipe/swipe.vue";
import {SXData} from "@/components/material-uni/sx";
import {getTheme} from "@/components/material-uni/colors";
import MyDrawer from "@/components/MyDrawer/MyDrawer.vue";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    MyDrawer,
    myswiper,
    StatusBar,
    MaterialListCell,
    MaterialList,
    MaterialTabBar,
    MaterialNavBar,
    SvInterceptBack,
    UniIcons,
    YTab,
    YTabs,
    UniNavBar,
    UButton,
    UIcon,
    UniPopup,
    UniEasyinput,
    Timetable,
    TouchRipple,
    Drawer
  },
  data() {
    return {
      theme:{},
      isDrawerOpen: false,
      menu: false,
      loading: false,
      app: false,
      check: null,
      wait: null,
      week: 0,
      timeSlots: [{
        index: '1',
        name: '08:00\n08:45'
      },
        {
          index: '2',
          name: '08:55\n09:40'
        },
        {
          index: '3',
          name: '10:10\n10:55'
        },
        {
          index: '4',
          name: '11:05\n11:50'
        },
        {
          index: '5',
          name: '13:40\n14:25'
        },
        {
          index: '6',
          name: '14:35\n15:20'
        },
        {
          index: '7',
          name: '15:40\n16:25'
        },
        {
          index: '8',
          name: '16:35\n17:20'
        },
        {
          index: '9',
          name: '18:30\n19:15'
        },
        {
          index: '10',
          name: '19:25\n20:10'
        },
        {
          index: '11',
          name: '20:20\n21:05'
        }
      ],
      range: [
        "总课表",
        "第一周",
        "第二周",
        "第三周",
        "第四周",
        "第五周",
        "第六周",
        "第七周",
        "第八周",
        "第九周",
        "第十周",
        "第十一周",
        "第十二周",
        "第十三周",
        "第十四周",
        "第十五周",
        "第十六周",
        "第十七周",
        "第十八周",
        "第十九周",
      ],
      timetableData: Array.from({
            length: 20
          }, () =>
              Array.from({
                    length: 7
                  }, () =>
                      Array(11).fill("")
              )
      ),
      other: [],
      schedules: [],
      weekStartDate: new Date('2025-02-17'),
      webviewJS: null,
      systemInfo: uni.getSystemInfoSync()
    };
  },
  onReady() {
    this.week = this.calculateCurrentWeek()
    //#ifdef H5
    this.loadSchedule()
    // #endif

  },
  onShow() {
    this.theme = getTheme()
    this.weekStartDate = new Date(this.$manager.getSemesterStartDate());
    this.update(false)
  },
  methods: {
    getTheme,
    changeSwipe(newIndex, oldIndex) {
      this.week = newIndex;
      console.log(`swipe from ${oldIndex} to ${newIndex}`);
    },
    change(e) {
      this.week = e.detail.value;
      this.$refs.swiper.goto(this.week);
    },
    calculateCurrentWeek() {
      const today = new Date(); // 当前日期
      today.setHours(0, 0, 0, 0); // 重置时间部分

      const start = new Date(this.weekStartDate); // 学期开始日期
      start.setHours(0, 0, 0, 0); // 重置时间部分

      const momentDate1 = moment(start); // 使用 moment 处理学期开始日期
      const momentDate2 = moment(today); // 使用 moment 处理当前日期
      const diff = momentDate2.diff(momentDate1, 'days'); // 计算日期差（天数）
      if (diff < 0) {
        return 1;
      }
      if (Math.floor(diff / 7) + 1 > 19) {
        return 0;
      }
      return Math.floor(diff / 7) + 1; // 计算周数
    },
    loadSchedule() {
      // let temp = this.schedules
      //#ifdef H5
      let temp = [
        [],
        [{
          "name": "形势与政策",
          "teacher": "苏红",
          "time": {
            "weekday": 4,
            "courseTime": [7, 8],
            "week": 1
          },
          "classroom": "西C302"
        }, {
          "name": "虚拟现实",
          "teacher": "陈钧",
          "time": {
            "weekday": 1,
            "courseTime": [1, 2],
            "week": 1
          },
          "classroom": "东A402"
        }, {
          "name": "虚拟现实",
          "teacher": "陈钧",
          "time": {
            "weekday": 3,
            "courseTime": [1, 2],
            "week": 1
          },
          "classroom": "东A402"
        }, {
          "name": "大学生职业发展与就业指导Ⅱ",
          "teacher": "黄玮",
          "time": {
            "weekday": 5,
            "courseTime": [5, 6],
            "week": 1
          },
          "classroom": "东202"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 2,
            "courseTime": [3, 4],
            "week": 1
          },
          "classroom": "西A302"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 4,
            "courseTime": [3, 4],
            "week": 1
          },
          "classroom": "西A302"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 1,
            "courseTime": [3, 4],
            "week": 1
          },
          "classroom": "西A101"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 3,
            "courseTime": [3, 4],
            "week": 1
          },
          "classroom": "西A202"
        }],
        [{
          "name": "形势与政策",
          "teacher": "苏红",
          "time": {
            "weekday": 4,
            "courseTime": [7, 8],
            "week": 2
          },
          "classroom": "西C302"
        }, {
          "name": "虚拟现实",
          "teacher": "陈钧",
          "time": {
            "weekday": 1,
            "courseTime": [1, 2],
            "week": 2
          },
          "classroom": "东A402"
        }, {
          "name": "虚拟现实",
          "teacher": "陈钧",
          "time": {
            "weekday": 3,
            "courseTime": [1, 2],
            "week": 2
          },
          "classroom": "东A402"
        }, {
          "name": "大学生职业发展与就业指导Ⅱ",
          "teacher": "黄玮",
          "time": {
            "weekday": 5,
            "courseTime": [5, 6],
            "week": 2
          },
          "classroom": "东202"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 2,
            "courseTime": [3, 4],
            "week": 2
          },
          "classroom": "西A302"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 4,
            "courseTime": [3, 4],
            "week": 2
          },
          "classroom": "西A302"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 1,
            "courseTime": [3, 4],
            "week": 2
          },
          "classroom": "西A101"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 3,
            "courseTime": [3, 4],
            "week": 2
          },
          "classroom": "西A202"
        }],
        [{
          "name": "形势与政策",
          "teacher": "苏红",
          "time": {
            "weekday": 4,
            "courseTime": [7, 8],
            "week": 3
          },
          "classroom": "西C302"
        }, {
          "name": "虚拟现实",
          "teacher": "陈钧",
          "time": {
            "weekday": 1,
            "courseTime": [1, 2],
            "week": 3
          },
          "classroom": "东A402"
        }, {
          "name": "虚拟现实",
          "teacher": "陈钧",
          "time": {
            "weekday": 3,
            "courseTime": [1, 2],
            "week": 3
          },
          "classroom": "东A402"
        }, {
          "name": "大学生职业发展与就业指导Ⅱ",
          "teacher": "黄玮",
          "time": {
            "weekday": 5,
            "courseTime": [5, 6],
            "week": 3
          },
          "classroom": "东202"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 2,
            "courseTime": [3, 4],
            "week": 3
          },
          "classroom": "西A302"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 4,
            "courseTime": [3, 4],
            "week": 3
          },
          "classroom": "西A302"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 1,
            "courseTime": [3, 4],
            "week": 3
          },
          "classroom": "西A101"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 3,
            "courseTime": [3, 4],
            "week": 3
          },
          "classroom": "西A202"
        }],
        [{
          "name": "形势与政策",
          "teacher": "苏红",
          "time": {
            "weekday": 4,
            "courseTime": [7, 8],
            "week": 4
          },
          "classroom": "西C302"
        }, {
          "name": "虚拟现实",
          "teacher": "陈钧",
          "time": {
            "weekday": 1,
            "courseTime": [1, 2],
            "week": 4
          },
          "classroom": "东A402"
        }, {
          "name": "虚拟现实",
          "teacher": "陈钧",
          "time": {
            "weekday": 3,
            "courseTime": [1, 2],
            "week": 4
          },
          "classroom": "东A402"
        }, {
          "name": "大学生职业发展与就业指导Ⅱ",
          "teacher": "黄玮",
          "time": {
            "weekday": 5,
            "courseTime": [5, 6],
            "week": 4
          },
          "classroom": "东202"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 2,
            "courseTime": [3, 4],
            "week": 4
          },
          "classroom": "西A302"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 4,
            "courseTime": [3, 4],
            "week": 4
          },
          "classroom": "西A302"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 1,
            "courseTime": [3, 4],
            "week": 4
          },
          "classroom": "西A101"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 3,
            "courseTime": [3, 4],
            "week": 4
          },
          "classroom": "西A202"
        }],
        [{
          "name": "形势与政策",
          "teacher": "苏红",
          "time": {
            "weekday": 4,
            "courseTime": [7, 8],
            "week": 5
          },
          "classroom": "西C302"
        }, {
          "name": "虚拟现实",
          "teacher": "陈钧",
          "time": {
            "weekday": 1,
            "courseTime": [1, 2],
            "week": 5
          },
          "classroom": "东A402"
        }, {
          "name": "虚拟现实",
          "teacher": "陈钧",
          "time": {
            "weekday": 3,
            "courseTime": [1, 2],
            "week": 5
          },
          "classroom": "东A402"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 2,
            "courseTime": [3, 4],
            "week": 5
          },
          "classroom": "西A302"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 4,
            "courseTime": [3, 4],
            "week": 5
          },
          "classroom": "西A302"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 1,
            "courseTime": [3, 4],
            "week": 5
          },
          "classroom": "西A101"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 3,
            "courseTime": [3, 4],
            "week": 5
          },
          "classroom": "西A202"
        }],
        [{
          "name": "形势与政策",
          "teacher": "苏红",
          "time": {
            "weekday": 4,
            "courseTime": [7, 8],
            "week": 6
          },
          "classroom": "西C302"
        }, {
          "name": "虚拟现实",
          "teacher": "陈钧",
          "time": {
            "weekday": 1,
            "courseTime": [1, 2],
            "week": 6
          },
          "classroom": "东A402"
        }, {
          "name": "虚拟现实",
          "teacher": "陈钧",
          "time": {
            "weekday": 3,
            "courseTime": [1, 2],
            "week": 6
          },
          "classroom": "东A402"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 2,
            "courseTime": [3, 4],
            "week": 6
          },
          "classroom": "西A302"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 4,
            "courseTime": [3, 4],
            "week": 6
          },
          "classroom": "西A302"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 1,
            "courseTime": [3, 4],
            "week": 6
          },
          "classroom": "西A101"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 3,
            "courseTime": [3, 4],
            "week": 6
          },
          "classroom": "西A202"
        }],
        [{
          "name": "虚拟现实",
          "teacher": "陈钧",
          "time": {
            "weekday": 1,
            "courseTime": [1, 2],
            "week": 7
          },
          "classroom": "东A402"
        }, {
          "name": "虚拟现实",
          "teacher": "陈钧",
          "time": {
            "weekday": 3,
            "courseTime": [1, 2],
            "week": 7
          },
          "classroom": "东A402"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 2,
            "courseTime": [3, 4],
            "week": 7
          },
          "classroom": "西A302"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 4,
            "courseTime": [3, 4],
            "week": 7
          },
          "classroom": "西A302"
        }],
        [{
          "name": "虚拟现实",
          "teacher": "陈钧",
          "time": {
            "weekday": 1,
            "courseTime": [1, 2],
            "week": 8
          },
          "classroom": "东A402"
        }, {
          "name": "虚拟现实",
          "teacher": "陈钧",
          "time": {
            "weekday": 3,
            "courseTime": [1, 2],
            "week": 8
          },
          "classroom": "东A402"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 2,
            "courseTime": [3, 4],
            "week": 8
          },
          "classroom": "西A302"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 4,
            "courseTime": [3, 4],
            "week": 8
          },
          "classroom": "西A302"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 1,
            "courseTime": [3, 4],
            "week": 8
          },
          "classroom": "西A101"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 3,
            "courseTime": [3, 4],
            "week": 8
          },
          "classroom": "西A302"
        }],
        [{
          "name": "计算机视觉",
          "teacher": "岳红原",
          "time": {
            "weekday": 2,
            "courseTime": [3, 4],
            "week": 9
          },
          "classroom": "南A209"
        }, {
          "name": "计算机视觉",
          "teacher": "岳红原",
          "time": {
            "weekday": 4,
            "courseTime": [1, 2],
            "week": 9
          },
          "classroom": "南A209"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 2,
            "courseTime": [3, 4],
            "week": 9
          },
          "classroom": "西A302"
        }, {
          "name": "人工智能",
          "teacher": "卢 阿丽",
          "time": {
            "weekday": 4,
            "courseTime": [3, 4],
            "week": 9
          },
          "classroom": "西A302"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 1,
            "courseTime": [3, 4],
            "week": 9
          },
          "classroom": "西A101"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 3,
            "courseTime": [3, 4],
            "week": 9
          },
          "classroom": "西A302"
        }],
        [{
          "name": "计算机视觉",
          "teacher": "岳红原",
          "time": {
            "weekday": 2,
            "courseTime": [1, 2],
            "week": 10
          },
          "classroom": "南A209"
        }, {
          "name": "计算机视觉",
          "teacher": "岳红原",
          "time": {
            "weekday": 4,
            "courseTime": [1, 2],
            "week": 10
          },
          "classroom": "南A209"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 2,
            "courseTime": [3, 4],
            "week": 10
          },
          "classroom": "西A302"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 4,
            "courseTime": [3, 4],
            "week": 10
          },
          "classroom": "西A302"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 1,
            "courseTime": [3, 4],
            "week": 10
          },
          "classroom": "西A101"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 3,
            "courseTime": [3, 4],
            "week": 10
          },
          "classroom": "西A302"
        }],
        [],
        [{
          "name": "计算机视觉",
          "teacher": "岳红原",
          "time": {
            "weekday": 2,
            "courseTime": [1, 2],
            "week": 12
          },
          "classroom": "南A209"
        }, {
          "name": "计算机视觉",
          "teacher": "岳红原",
          "time": {
            "weekday": 4,
            "courseTime": [1, 2],
            "week": 12
          },
          "classroom": "南A209"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 2,
            "courseTime": [3, 4],
            "week": 12
          },
          "classroom": "西A302"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 4,
            "courseTime": [3, 4],
            "week": 12
          },
          "classroom": "西A302"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 1,
            "courseTime": [3, 4],
            "week": 12
          },
          "classroom": "西A101"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 3,
            "courseTime": [3, 4],
            "week": 12
          },
          "classroom": "西A302"
        }],
        [{
          "name": "计算机视觉",
          "teacher": " 岳红原",
          "time": {
            "weekday": 2,
            "courseTime": [1, 2],
            "week": 13
          },
          "classroom": "南A209"
        }, {
          "name": "计算机视觉",
          "teacher": "岳红原",
          "time": {
            "weekday": 4,
            "courseTime": [1, 2],
            "week": 13
          },
          "classroom": "南A209"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 2,
            "courseTime": [3, 4],
            "week": 13
          },
          "classroom": "西A302"
        }, {
          "name": "人工智能",
          "teacher": "卢阿丽",
          "time": {
            "weekday": 4,
            "courseTime": [3, 4],
            "week": 13
          },
          "classroom": "西A302"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 1,
            "courseTime": [3, 4],
            "week": 13
          },
          "classroom": "西A101"
        }, {
          "name": "人机交互技术",
          "teacher": "徐 梦溪",
          "time": {
            "weekday": 3,
            "courseTime": [3, 4],
            "week": 13
          },
          "classroom": "西A302"
        }],
        [{
          "name": "计算机视觉",
          "teacher": "岳红原",
          "time": {
            "weekday": 2,
            "courseTime": [1, 2],
            "week": 14
          },
          "classroom": "南A209"
        }, {
          "name": "计算机视觉",
          "teacher": "岳红原",
          "time": {
            "weekday": 4,
            "courseTime": [1, 2],
            "week": 14
          },
          "classroom": "南A209"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 1,
            "courseTime": [3, 4],
            "week": 14
          },
          "classroom": "西A101"
        }, {
          "name": "人机交互技术",
          "teacher": "徐梦溪",
          "time": {
            "weekday": 3,
            "courseTime": [3, 4],
            "week": 14
          },
          "classroom": "西A302"
        }],
        [{
          "name": "计算机视觉",
          "teacher": "岳红原",
          "time": {
            "weekday": 2,
            "courseTime": [1, 2],
            "week": 15
          },
          "classroom": "南A209"
        }, {
          "name": "计算机视觉",
          "teacher": "岳红原",
          "time": {
            "weekday": 4,
            "courseTime": [1, 2],
            "week": 15
          },
          "classroom": "南A209"
        }],
        [{
          "name": "计算机视觉",
          "teacher": "岳红原",
          "time": {
            "weekday": 2,
            "courseTime": [1, 2],
            "week": 16
          },
          "classroom": "南A209"
        }, {
          "name": "计算机视觉",
          "teacher": "岳红原",
          "time": {
            "weekday": 4,
            "courseTime": [1, 2],
            "week": 16
          },
          "classroom": "南A209"
        }],
        [{
          "name": "计算机视觉",
          "teacher": "岳红原",
          "time": {
            "weekday": 2,
            "courseTime": [1, 2],
            "week": 17
          },
          "classroom": "南A209"
        }, {
          "name": "计算机视觉",
          "teacher": "岳红原",
          "time": {
            "weekday": 4,
            "courseTime": [1, 2],
            "week": 17
          },
          "classroom": "南A209"
        }]
      ]
      for (let i = 1; i < temp.length; i++) {
        const weekCourses = temp[i];

        for (let j = 0; j < weekCourses.length; j++) {
          const course = weekCourses[j];
          const time = course.time;
          const courseTime = time.courseTime;
          const week = time.week;
          const weekday = time.weekday;
          const classroom = course.classroom;
          const name = course.name;

          for (let m = 0; m < courseTime.length; m++) {
            const value = name + '@' + classroom;
            if (this.timetableData[week][weekday - 1][courseTime[m] - 1].indexOf(value) == -1 && this.timetableData[week][weekday - 1][courseTime[m] - 1] != '') {
              this.$set(this.timetableData[week][weekday - 1], courseTime[m] - 1, (this.timetableData[week][weekday - 1][courseTime[m] - 1]) + "!" + value)
              this.$set(this.timetableData[0][weekday - 1], courseTime[m] - 1, (this.timetableData[week][weekday - 1][courseTime[m] - 1]) + "!" + value)
            } else {
              this.$set(this.timetableData[week][weekday - 1], courseTime[m] - 1, value)
              this.$set(this.timetableData[0][weekday - 1], courseTime[m] - 1, value)
            }
          }

          // for (let m = 0; m < courseTime.length; m++) {
          //   const value = name + '@' + classroom;
          //   this.$set(this.timetableData[week][weekday - 1], courseTime[m] - 1, value)
          //   this.$set(this.timetableData[0][weekday - 1], courseTime[m] - 1, value)
          // }
        }

      }
      //#endif
      this.weekStartDate = new Date(this.$manager.getSemesterStartDate());
      this.loading = false;
      uni.hideLoading();
      this.week = this.calculateCurrentWeek();
      this.$refs.swiper.goto(this.week);
      clearTimeout(this.wait);
    },
    todayWeekIndex() {
      let weekIndex = new Date().getDay() - 1
      if (weekIndex === -1) {
        weekIndex = 6
      }
      return weekIndex
    },
    parseCourseSchedule(courseArray) {
      const result = [];
      let i = 0;

      while (i < courseArray.length) {
        if (!courseArray[i] || courseArray[i] === "") {
          i++;
          continue;
        }

        // 解析当前课程信息
        const [course_name, location] = courseArray[i].split('@');
        let startIndex = i;
        let endIndex = i;

        // 检查后续连续时间段是否同一门课程
        while (endIndex + 1 < courseArray.length &&
        courseArray[endIndex + 1] === courseArray[i]) {
          endIndex++;
        }

        // 获取时间范围
        const startTime = this.timeSlots[startIndex].name.split('\n')[0]; // 取第一节课的开始时间
        const endTime = this.timeSlots[endIndex].name.split('\n')[1]; // 取最后一节课的结束时间

        result.push({
          course_name,
          location,
          "time": `${startTime}-${endTime}`
        });

        i = endIndex + 1;
      }

      return result;
    },
    handleCourseClick(e) {
      if (e.name === '' || e.classroom === '') {
        return;
      }
      uni.showModal({
        title: '详细信息',
        content: `${e.name}`
      });
    },
    update(refresh) {
      console.log('update')
      this.loading = true;
      uni.showLoading({
        title: '获取课表数据'
      });
      this.wait = setTimeout(() => {
        this.loading = false;
        uni.hideLoading();
        uni.showToast({
          title: '获取课表失败',
          icon: 'error',
          duration: 2000
        });
      }, 5000);
      this.$manager.getCurriculum(refresh).then(res => {
        let value = JSON.parse(res)

        if(value === {}){
          return
        }

        this.timetableData = JSON.parse(value.validTimeCourses);
        this.other = JSON.parse(value.nullTimeCourses);
        this.loadSchedule();
      }).catch(res => {
        this.timetableData = Array.from({
              length: 20
            }, () =>
                Array.from({
                      length: 7
                    }, () =>
                        Array(11).fill("")
                )
        )
      })
    }
  }
};
</script>

<style lang="scss">
.y-tabs__sticky {
  height: 0% !important;
}

$modal-width: 90vw;

.login-modal {
  width: $modal-width;
  height: $modal-width * 0.75;
  border-radius: 40rpx;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .wrap {
    display: flex;
    flex-direction: column;
    width: 90%;

    .input {
      margin-top: 20rpx;
    }
  }

  .captcha {
    display: flex;

    .captcha-img {
      margin-top: 20rpx;
      height: 70rpx;
      width: 200rpx;
    }
  }

  .btn-wrap {
    width: 100%;
    display: flex;

    .login-btn {
      margin-top: 20rpx;
      width: 45%;
      //height: 80rpx;
    }
  }
}

.container {
  //height: calc(100vh - var(--window-bottom) - var(--status-bar-height) - 44px);
  background: #f5f5f5;
}

.custom-style {
  witdh: 20rpx
}


</style>