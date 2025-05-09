<template>
  <page-meta :page-style="theme"></page-meta>
  <view class="container">
    <!-- 头部控制栏 -->
    <material-nav-bar color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250" backgroundColor="var(--md-sys-color-surface-container)">
      <view class="nav-bar">
        <uni-icons type="bars" size="6vmin" @click="showMenu" color="var(--md-sys-color-on-surface)" class="icon-left"/>

        <picker class="title" @change="change" :value="week" :range="range">
          <view class="title">{{ range[week] }}</view>
        </picker>

        <uni-icons type="loop" size="6vmin" @click="update" class="icon-right" color="var(--md-sys-color-on-surface)" :class="{'rotate': loading}"/>
      </view>
    </material-nav-bar>
    <y-tabs v-model="week" :swipeable="true" :hide="true">
      <y-tab class="y-tab-virtual" v-for="(tab,index) in timetableData">
        <timetable :timetables="tab" :timetableType="timeSlots" :weekStartDate="weekStartDate" :thisWeek="index"
                   @courseClick="handleCourseClick"></timetable>
      </y-tab>
    </y-tabs>
    <smm-drawer ref="menu">
      <view class="menu">
        <touch-ripple color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250">
        <status-bar backgroundColor="var(--md-sys-color-on-tertiary-container)"></status-bar>
        <view class="menu-content">
          <view class="container">
            <image src="@/static/logo.png" class="logo"></image>
            <text class="text">你的门户<br/>Made By OneFeiFan</text>
          </view>
        </view>
        </touch-ripple>
        <material-list>
          <material-list-cell rightIcon @click="jump(`classroom`)" color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250" backgroundColor="var(--md-sys-color-surface-container)">
            <text>空教室查询</text>
          </material-list-cell>
<!--          <material-list-cell rightIcon @click="jump(`evaluate`)" color="var(&#45;&#45;md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250" backgroundColor="var(&#45;&#45;md-sys-color-surface-container)">-->
<!--            <text>快速评价</text>-->
<!--          </material-list-cell>-->
          <material-list-cell rightIcon @click="jump(`scores`)" color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250" backgroundColor="var(--md-sys-color-surface-container)">
            <text>成绩查询</text>
          </material-list-cell>
<!--          <material-list-cell rightIcon @click="jump(`curriculums_test`)" color="var(&#45;&#45;md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250" backgroundColor="var(&#45;&#45;md-sys-color-surface-container)">-->
<!--            <text>测试</text>-->
<!--          </material-list-cell>-->
          <material-list-cell rightIcon @click="jump(`usermanager`)" color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250" backgroundColor="var(--md-sys-color-surface-container)">
            <text>用户管理</text>
          </material-list-cell>
        </material-list>
      </view>
    </smm-drawer>
    <sv-intercept-back
        :show="menu"
        :beforeIntercept="closeMenu"
    />
    <material-tab-bar color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250" backgroundColor="var(--md-sys-color-surface-container)"/>
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
import StatusBar from "@/components/status-bar/status-bar.vue";
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
import SmmDrawer from "@/components/smm-drawer/smm-drawer.vue";
// #ifdef APP
import {DemoWidget} from "@/uni_modules/widget-demo";
// #endif
export default {
  components: {
    SmmDrawer,
    MaterialListCell,
    MaterialList,
    MaterialTabBar,
    MaterialNavBar,
    SvInterceptBack,
    UniIcons,
    YTab,
    YTabs,
    UniNavBar,
    StatusBar,
    UButton,
    UIcon,
    UniPopup,
    UniEasyinput,
    Timetable,
    TouchRipple
  },
  data() {
    return {
      menu: false,
      loading: false,
      app: false,
      check: null,
      wait: null,
      week: 0,
      timeSlots: [
        {
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
      schedules: [],
      weekStartDate: new Date('2025-02-17'),
      webviewJS: null,
	    demoWidget: null
    };
  },
  created() {
    // #ifdef APP-PLUS
    // #endif
  },
  onLoad() {
    this.week = this.calculateCurrentWeek()
    //#ifdef H5
    this.loadSchedule()
    // #endif
    try {
      let temp = uni.getStorageSync('curriculum');
      if (temp !== null && temp !== '') {
        this.schedules = temp;
        this.loadSchedule();
      }
    } catch (e) {
      console.error(e)
    }
  },
  onReady() {
    // #ifdef APP-PLUS
	this.demoWidget = new DemoWidget()
    // #endif
  },
  methods: {
    change(e) {
      this.week = e.detail.value;
    },
    showMenu() {
      this.menu = true;
      uni.hideTabBar({
        animation: true
      });
      this.$refs.menu.open();
    },
    closeMenu() {
      this.$refs.menu.close();
      // uni.showTabBar({
      //   animation: true
      // });
      this.menu = false;
    },
    jump(page) {
      console.log(page)
      this.menu = false;
      this.$refs.menu.close();
      // uni.showTabBar({
      //   animation: true
      // });
      setTimeout(() => {
        uni.navigateTo({
          url: `/pages/${page}/${page}`
        });
      }, 250);
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
      return Math.floor(diff / 7) + 1; // 计算周数
    },
    loadSchedule() {
      let temp = this.schedules
      //#ifdef H5
      temp = [[], [{
        "name": "形势与政策",
        "teacher": "苏红",
        "time": {"weekday": 4, "timeArray": [7, 8], "week": 1},
        "classroom": "西C302"
      }, {
        "name": "虚拟现实",
        "teacher": "陈钧",
        "time": {"weekday": 1, "timeArray": [1, 2], "week": 1},
        "classroom": "东A402"
      }, {
        "name": "虚拟现实",
        "teacher": "陈钧",
        "time": {"weekday": 3, "timeArray": [1, 2], "week": 1},
        "classroom": "东A402"
      }, {
        "name": "大学生职业发展与就业指导Ⅱ",
        "teacher": "黄玮",
        "time": {"weekday": 5, "timeArray": [5, 6], "week": 1},
        "classroom": "东202"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 2, "timeArray": [3, 4], "week": 1},
        "classroom": "西A302"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 4, "timeArray": [3, 4], "week": 1},
        "classroom": "西A302"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 1, "timeArray": [3, 4], "week": 1},
        "classroom": "西A101"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 3, "timeArray": [3, 4], "week": 1},
        "classroom": "西A202"
      }], [{
        "name": "形势与政策",
        "teacher": "苏红",
        "time": {"weekday": 4, "timeArray": [7, 8], "week": 2},
        "classroom": "西C302"
      }, {
        "name": "虚拟现实",
        "teacher": "陈钧",
        "time": {"weekday": 1, "timeArray": [1, 2], "week": 2},
        "classroom": "东A402"
      }, {
        "name": "虚拟现实",
        "teacher": "陈钧",
        "time": {"weekday": 3, "timeArray": [1, 2], "week": 2},
        "classroom": "东A402"
      }, {
        "name": "大学生职业发展与就业指导Ⅱ",
        "teacher": "黄玮",
        "time": {"weekday": 5, "timeArray": [5, 6], "week": 2},
        "classroom": "东202"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 2, "timeArray": [3, 4], "week": 2},
        "classroom": "西A302"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 4, "timeArray": [3, 4], "week": 2},
        "classroom": "西A302"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 1, "timeArray": [3, 4], "week": 2},
        "classroom": "西A101"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 3, "timeArray": [3, 4], "week": 2},
        "classroom": "西A202"
      }], [{
        "name": "形势与政策",
        "teacher": "苏红",
        "time": {"weekday": 4, "timeArray": [7, 8], "week": 3},
        "classroom": "西C302"
      }, {
        "name": "虚拟现实",
        "teacher": "陈钧",
        "time": {"weekday": 1, "timeArray": [1, 2], "week": 3},
        "classroom": "东A402"
      }, {
        "name": "虚拟现实",
        "teacher": "陈钧",
        "time": {"weekday": 3, "timeArray": [1, 2], "week": 3},
        "classroom": "东A402"
      }, {
        "name": "大学生职业发展与就业指导Ⅱ",
        "teacher": "黄玮",
        "time": {"weekday": 5, "timeArray": [5, 6], "week": 3},
        "classroom": "东202"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 2, "timeArray": [3, 4], "week": 3},
        "classroom": "西A302"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 4, "timeArray": [3, 4], "week": 3},
        "classroom": "西A302"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 1, "timeArray": [3, 4], "week": 3},
        "classroom": "西A101"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 3, "timeArray": [3, 4], "week": 3},
        "classroom": "西A202"
      }], [{
        "name": "形势与政策",
        "teacher": "苏红",
        "time": {"weekday": 4, "timeArray": [7, 8], "week": 4},
        "classroom": "西C302"
      }, {
        "name": "虚拟现实",
        "teacher": "陈钧",
        "time": {"weekday": 1, "timeArray": [1, 2], "week": 4},
        "classroom": "东A402"
      }, {
        "name": "虚拟现实",
        "teacher": "陈钧",
        "time": {"weekday": 3, "timeArray": [1, 2], "week": 4},
        "classroom": "东A402"
      }, {
        "name": "大学生职业发展与就业指导Ⅱ",
        "teacher": "黄玮",
        "time": {"weekday": 5, "timeArray": [5, 6], "week": 4},
        "classroom": "东202"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 2, "timeArray": [3, 4], "week": 4},
        "classroom": "西A302"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 4, "timeArray": [3, 4], "week": 4},
        "classroom": "西A302"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 1, "timeArray": [3, 4], "week": 4},
        "classroom": "西A101"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 3, "timeArray": [3, 4], "week": 4},
        "classroom": "西A202"
      }], [{
        "name": "形势与政策",
        "teacher": "苏红",
        "time": {"weekday": 4, "timeArray": [7, 8], "week": 5},
        "classroom": "西C302"
      }, {
        "name": "虚拟现实",
        "teacher": "陈钧",
        "time": {"weekday": 1, "timeArray": [1, 2], "week": 5},
        "classroom": "东A402"
      }, {
        "name": "虚拟现实",
        "teacher": "陈钧",
        "time": {"weekday": 3, "timeArray": [1, 2], "week": 5},
        "classroom": "东A402"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 2, "timeArray": [3, 4], "week": 5},
        "classroom": "西A302"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 4, "timeArray": [3, 4], "week": 5},
        "classroom": "西A302"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 1, "timeArray": [3, 4], "week": 5},
        "classroom": "西A101"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 3, "timeArray": [3, 4], "week": 5},
        "classroom": "西A202"
      }], [{
        "name": "形势与政策",
        "teacher": "苏红",
        "time": {"weekday": 4, "timeArray": [7, 8], "week": 6},
        "classroom": "西C302"
      }, {
        "name": "虚拟现实",
        "teacher": "陈钧",
        "time": {"weekday": 1, "timeArray": [1, 2], "week": 6},
        "classroom": "东A402"
      }, {
        "name": "虚拟现实",
        "teacher": "陈钧",
        "time": {"weekday": 3, "timeArray": [1, 2], "week": 6},
        "classroom": "东A402"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 2, "timeArray": [3, 4], "week": 6},
        "classroom": "西A302"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 4, "timeArray": [3, 4], "week": 6},
        "classroom": "西A302"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 1, "timeArray": [3, 4], "week": 6},
        "classroom": "西A101"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 3, "timeArray": [3, 4], "week": 6},
        "classroom": "西A202"
      }], [{
        "name": "虚拟现实",
        "teacher": "陈钧",
        "time": {"weekday": 1, "timeArray": [1, 2], "week": 7},
        "classroom": "东A402"
      }, {
        "name": "虚拟现实",
        "teacher": "陈钧",
        "time": {"weekday": 3, "timeArray": [1, 2], "week": 7},
        "classroom": "东A402"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 2, "timeArray": [3, 4], "week": 7},
        "classroom": "西A302"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 4, "timeArray": [3, 4], "week": 7},
        "classroom": "西A302"
      }], [{
        "name": "虚拟现实",
        "teacher": "陈钧",
        "time": {"weekday": 1, "timeArray": [1, 2], "week": 8},
        "classroom": "东A402"
      }, {
        "name": "虚拟现实",
        "teacher": "陈钧",
        "time": {"weekday": 3, "timeArray": [1, 2], "week": 8},
        "classroom": "东A402"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 2, "timeArray": [3, 4], "week": 8},
        "classroom": "西A302"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 4, "timeArray": [3, 4], "week": 8},
        "classroom": "西A302"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 1, "timeArray": [3, 4], "week": 8},
        "classroom": "西A101"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 3, "timeArray": [3, 4], "week": 8},
        "classroom": "西A302"
      }], [{
        "name": "计算机视觉",
        "teacher": "岳红原",
        "time": {"weekday": 2, "timeArray": [3, 4], "week": 9},
        "classroom": "南A209"
      }, {
        "name": "计算机视觉",
        "teacher": "岳红原",
        "time": {"weekday": 4, "timeArray": [1, 2], "week": 9},
        "classroom": "南A209"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 2, "timeArray": [3, 4], "week": 9},
        "classroom": "西A302"
      }, {
        "name": "人工智能",
        "teacher": "卢 阿丽",
        "time": {"weekday": 4, "timeArray": [3, 4], "week": 9},
        "classroom": "西A302"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 1, "timeArray": [3, 4], "week": 9},
        "classroom": "西A101"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 3, "timeArray": [3, 4], "week": 9},
        "classroom": "西A302"
      }], [{
        "name": "计算机视觉",
        "teacher": "岳红原",
        "time": {"weekday": 2, "timeArray": [1, 2], "week": 10},
        "classroom": "南A209"
      }, {
        "name": "计算机视觉",
        "teacher": "岳红原",
        "time": {"weekday": 4, "timeArray": [1, 2], "week": 10},
        "classroom": "南A209"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 2, "timeArray": [3, 4], "week": 10},
        "classroom": "西A302"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 4, "timeArray": [3, 4], "week": 10},
        "classroom": "西A302"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 1, "timeArray": [3, 4], "week": 10},
        "classroom": "西A101"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 3, "timeArray": [3, 4], "week": 10},
        "classroom": "西A302"
      }], [], [{
        "name": "计算机视觉",
        "teacher": "岳红原",
        "time": {"weekday": 2, "timeArray": [1, 2], "week": 12},
        "classroom": "南A209"
      }, {
        "name": "计算机视觉",
        "teacher": "岳红原",
        "time": {"weekday": 4, "timeArray": [1, 2], "week": 12},
        "classroom": "南A209"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 2, "timeArray": [3, 4], "week": 12},
        "classroom": "西A302"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 4, "timeArray": [3, 4], "week": 12},
        "classroom": "西A302"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 1, "timeArray": [3, 4], "week": 12},
        "classroom": "西A101"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 3, "timeArray": [3, 4], "week": 12},
        "classroom": "西A302"
      }], [{
        "name": "计算机视觉",
        "teacher": " 岳红原",
        "time": {"weekday": 2, "timeArray": [1, 2], "week": 13},
        "classroom": "南A209"
      }, {
        "name": "计算机视觉",
        "teacher": "岳红原",
        "time": {"weekday": 4, "timeArray": [1, 2], "week": 13},
        "classroom": "南A209"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 2, "timeArray": [3, 4], "week": 13},
        "classroom": "西A302"
      }, {
        "name": "人工智能",
        "teacher": "卢阿丽",
        "time": {"weekday": 4, "timeArray": [3, 4], "week": 13},
        "classroom": "西A302"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 1, "timeArray": [3, 4], "week": 13},
        "classroom": "西A101"
      }, {
        "name": "人机交互技术",
        "teacher": "徐 梦溪",
        "time": {"weekday": 3, "timeArray": [3, 4], "week": 13},
        "classroom": "西A302"
      }], [{
        "name": "计算机视觉",
        "teacher": "岳红原",
        "time": {"weekday": 2, "timeArray": [1, 2], "week": 14},
        "classroom": "南A209"
      }, {
        "name": "计算机视觉",
        "teacher": "岳红原",
        "time": {"weekday": 4, "timeArray": [1, 2], "week": 14},
        "classroom": "南A209"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 1, "timeArray": [3, 4], "week": 14},
        "classroom": "西A101"
      }, {
        "name": "人机交互技术",
        "teacher": "徐梦溪",
        "time": {"weekday": 3, "timeArray": [3, 4], "week": 14},
        "classroom": "西A302"
      }], [{
        "name": "计算机视觉",
        "teacher": "岳红原",
        "time": {"weekday": 2, "timeArray": [1, 2], "week": 15},
        "classroom": "南A209"
      }, {
        "name": "计算机视觉",
        "teacher": "岳红原",
        "time": {"weekday": 4, "timeArray": [1, 2], "week": 15},
        "classroom": "南A209"
      }], [{
        "name": "计算机视觉",
        "teacher": "岳红原",
        "time": {"weekday": 2, "timeArray": [1, 2], "week": 16},
        "classroom": "南A209"
      }, {
        "name": "计算机视觉",
        "teacher": "岳红原",
        "time": {"weekday": 4, "timeArray": [1, 2], "week": 16},
        "classroom": "南A209"
      }], [{
        "name": "计算机视觉",
        "teacher": "岳红原",
        "time": {"weekday": 2, "timeArray": [1, 2], "week": 17},
        "classroom": "南A209"
      }, {
        "name": "计算机视觉",
        "teacher": "岳红原",
        "time": {"weekday": 4, "timeArray": [1, 2], "week": 17},
        "classroom": "南A209"
      }]]
      // temp = [
      //   [],
      //   [
      //     {
      //       "name": "大学英语综合Ⅱ",
      //       "teacher": "王琳",
      //       "time": {
      //         "weekday": 5,
      //         "timeArray": [
      //           3,
      //           4
      //         ],
      //         "week": 4
      //       },
      //       "classroom": "文理B101"
      //     },
      //     {
      //       "name": "大学物理AⅠ",
      //       "teacher": "陈国强",
      //       "time": {
      //         "weekday": 2,
      //         "timeArray": [
      //           5,
      //           6
      //         ],
      //         "week": 4
      //       },
      //       "classroom": "西B302"
      //     },
      //     {
      //       "name": "大学物理AⅠ",
      //       "teacher": "陈国强",
      //       "time": {
      //         "weekday": 4,
      //         "timeArray": [
      //           5,
      //           6
      //         ],
      //         "week": 4
      //       },
      //       "classroom": "西B302"
      //     },
      //     {
      //       "name": "电路分析A",
      //       "teacher": "田丽鸿",
      //       "time": {
      //         "weekday": 1,
      //         "timeArray": [
      //           3,
      //           4
      //         ],
      //         "week": 4
      //       },
      //       "classroom": "西A102"
      //     },
      //     {
      //       "name": "电路分析A",
      //       "teacher": "田丽鸿",
      //       "time": {
      //         "weekday": 3,
      //         "timeArray": [
      //           1,
      //           2
      //         ],
      //         "week": 4
      //       },
      //       "classroom": "西A102"
      //     },
      //     {
      //       "name": "大学生职业发展规划",
      //       "teacher": "孙亮",
      //       "time": {
      //         "weekday": 4,
      //         "timeArray": [
      //           1,
      //           2
      //         ],
      //         "week": 4
      //       },
      //       "classroom": "经管D105"
      //     },
      //     {
      //       "name": "思想道德与法治",
      //       "teacher": "陆小云",
      //       "time": {
      //         "weekday": 2,
      //         "timeArray": [
      //           7,
      //           8
      //         ],
      //         "week": 4
      //       },
      //       "classroom": "东201"
      //     },
      //     {
      //       "name": "思想道德与法治",
      //       "teacher": "陆小云",
      //       "time": {
      //         "weekday": 5,
      //         "timeArray": [
      //           5,
      //           6
      //         ],
      //         "week": 4
      //       },
      //       "classroom": "西C301"
      //     },
      //     {
      //       "name": "高等数学AⅡ",
      //       "teacher": "李宇尘",
      //       "time": {
      //         "weekday": 1,
      //         "timeArray": [
      //           1,
      //           2
      //         ],
      //         "week": 4
      //       },
      //       "classroom": "东C402"
      //     },
      //     {
      //       "name": "高等数学AⅡ",
      //       "teacher": "李宇尘",
      //       "time": {
      //         "weekday": 3,
      //         "timeArray": [
      //           3,
      //           4
      //         ],
      //         "week": 4
      //       },
      //       "classroom": "东C402"
      //     },
      //     {
      //       "name": "高等数学AⅡ",
      //       "teacher": "李宇尘",
      //       "time": {
      //         "weekday": 5,
      //         "timeArray": [
      //           1,
      //           2
      //         ],
      //         "week": 4
      //       },
      //       "classroom": "东C402"
      //     },
      //     {
      //       "name": "大学物理实验AⅠ",
      //       "teacher": "周爱平",
      //       "time": {
      //         "weekday": 1,
      //         "timeArray": [
      //           5,
      //           6,
      //           7,
      //           8
      //         ],
      //         "week": 4
      //       },
      //       "classroom": "上课地点未定"
      //     },
      //     {
      //       "name": "羽毛球-Ⅱ",
      //       "teacher": "黄昕",
      //       "time": {
      //         "weekday": 4,
      //         "timeArray": [
      //           3,
      //           4
      //         ],
      //         "week": 4
      //       },
      //       "classroom": "体育中心辅馆羽毛球1"
      //     }
      //   ],
      //   [
      //     {
      //       "name": "大学英语综合Ⅱ",
      //       "teacher": "王琳",
      //       "time": {
      //         "weekday": 5,
      //         "timeArray": [
      //           3,
      //           4
      //         ],
      //         "week": 5
      //       },
      //       "classroom": "文理B101"
      //     },
      //     {
      //       "name": "大学物理AⅠ",
      //       "teacher": "陈国强",
      //       "time": {
      //         "weekday": 2,
      //         "timeArray": [
      //           5,
      //           6
      //         ],
      //         "week": 5
      //       },
      //       "classroom": "西B302"
      //     },
      //     {
      //       "name": "大学物理AⅠ",
      //       "teacher": "陈国强",
      //       "time": {
      //         "weekday": 4,
      //         "timeArray": [
      //           5,
      //           6
      //         ],
      //         "week": 5
      //       },
      //       "classroom": "西B302"
      //     },
      //     {
      //       "name": "电路分析A",
      //       "teacher": "田丽鸿",
      //       "time": {
      //         "weekday": 1,
      //         "timeArray": [
      //           3,
      //           4
      //         ],
      //         "week": 5
      //       },
      //       "classroom": "西A102"
      //     },
      //     {
      //       "name": "电路分析A",
      //       "teacher": "田丽鸿",
      //       "time": {
      //         "weekday": 3,
      //         "timeArray": [
      //           1,
      //           2
      //         ],
      //         "week": 5
      //       },
      //       "classroom": "西A102"
      //     },
      //     {
      //       "name": "大学生职业发展规划",
      //       "teacher": "孙亮",
      //       "time": {
      //         "weekday": 1,
      //         "timeArray": [
      //           5,
      //           6
      //         ],
      //         "week": 5
      //       },
      //       "classroom": "西C101"
      //     },
      //     {
      //       "name": "大学生职业发展规划",
      //       "teacher": "孙亮",
      //       "time": {
      //         "weekday": 4,
      //         "timeArray": [
      //           1,
      //           2
      //         ],
      //         "week": 5
      //       },
      //       "classroom": "经管D105"
      //     },
      //     {
      //       "name": "思想道德与法治",
      //       "teacher": "陆小云",
      //       "time": {
      //         "weekday": 2,
      //         "timeArray": [
      //           7,
      //           8
      //         ],
      //         "week": 5
      //       },
      //       "classroom": "东201"
      //     },
      //     {
      //       "name": "思想道德与法治",
      //       "teacher": "陆小云",
      //       "time": {
      //         "weekday": 5,
      //         "timeArray": [
      //           5,
      //           6
      //         ],
      //         "week": 5
      //       },
      //       "classroom": "西C301"
      //     },
      //     {
      //       "name": "高等数学AⅡ",
      //       "teacher": "李宇尘",
      //       "time": {
      //         "weekday": 1,
      //         "timeArray": [
      //           1,
      //           2
      //         ],
      //         "week": 5
      //       },
      //       "classroom": "东C402"
      //     },
      //     {
      //       "name": "高等数学AⅡ",
      //       "teacher": "李宇尘",
      //       "time": {
      //         "weekday": 3,
      //         "timeArray": [
      //           3,
      //           4
      //         ],
      //         "week": 5
      //       },
      //       "classroom": "东C402"
      //     },
      //     {
      //       "name": "高等数学AⅡ",
      //       "teacher": "李宇尘",
      //       "time": {
      //         "weekday": 5,
      //         "timeArray": [
      //           1,
      //           2
      //         ],
      //         "week": 5
      //       },
      //       "classroom": "东C402"
      //     },
      //     {
      //       "name": "MY 产品创意设计鉴赏与实践",
      //       "teacher": "包光旋",
      //       "time": {
      //         "weekday": 4,
      //         "timeArray": [
      //           9,
      //           10,
      //           11
      //         ],
      //         "week": 5
      //       },
      //       "classroom": "文理A315"
      //     },
      //     {
      //       "name": "羽毛球-Ⅱ",
      //       "teacher": "黄昕",
      //       "time": {
      //         "weekday": 4,
      //         "timeArray": [
      //           3,
      //           4
      //         ],
      //         "week": 5
      //       },
      //       "classroom": "体育中心辅馆羽毛球1"
      //     }
      //   ],
      //   [
      //     {
      //       "name": "大学英语综合Ⅱ",
      //       "teacher": "王琳",
      //       "time": {
      //         "weekday": 5,
      //         "timeArray": [
      //           3,
      //           4
      //         ],
      //         "week": 6
      //       },
      //       "classroom": "文理B101"
      //     },
      //     {
      //       "name": "大学物理AⅠ",
      //       "teacher": "陈国强",
      //       "time": {
      //         "weekday": 2,
      //         "timeArray": [
      //           5,
      //           6
      //         ],
      //         "week": 6
      //       },
      //       "classroom": "西B302"
      //     },
      //     {
      //       "name": "大学物理AⅠ",
      //       "teacher": "陈国强",
      //       "time": {
      //         "weekday": 4,
      //         "timeArray": [
      //           5,
      //           6
      //         ],
      //         "week": 6
      //       },
      //       "classroom": "西B302"
      //     },
      //     {
      //       "name": "电路分析A",
      //       "teacher": "田丽鸿",
      //       "time": {
      //         "weekday": 1,
      //         "timeArray": [
      //           3,
      //           4
      //         ],
      //         "week": 6
      //       },
      //       "classroom": "西A102"
      //     },
      //     {
      //       "name": "电路分析A",
      //       "teacher": "田丽鸿",
      //       "time": {
      //         "weekday": 3,
      //         "timeArray": [
      //           1,
      //           2
      //         ],
      //         "week": 6
      //       },
      //       "classroom": "西A102"
      //     },
      //     {
      //       "name": "人工智能导论",
      //       "teacher": "何睿清",
      //       "time": {
      //         "weekday": 1,
      //         "timeArray": [
      //           9,
      //           10
      //         ],
      //         "week": 6
      //       },
      //       "classroom": "经管D201"
      //     },
      //     {
      //       "name": "思想道德与法治",
      //       "teacher": "陆小云",
      //       "time": {
      //         "weekday": 2,
      //         "timeArray": [
      //           7,
      //           8
      //         ],
      //         "week": 6
      //       },
      //       "classroom": "东201"
      //     },
      //     {
      //       "name": "高等数学AⅡ",
      //       "teacher": "李宇尘",
      //       "time": {
      //         "weekday": 1,
      //         "timeArray": [
      //           1,
      //           2
      //         ],
      //         "week": 6
      //       },
      //       "classroom": "东C402"
      //     },
      //     {
      //       "name": "高等数学AⅡ",
      //       "teacher": "李宇尘",
      //       "time": {
      //         "weekday": 3,
      //         "timeArray": [
      //           3,
      //           4
      //         ],
      //         "week": 6
      //       },
      //       "classroom": "东C402"
      //     },
      //     {
      //       "name": "高等数学AⅡ",
      //       "teacher": "李宇尘",
      //       "time": {
      //         "weekday": 5,
      //         "timeArray": [
      //           1,
      //           2
      //         ],
      //         "week": 6
      //       },
      //       "classroom": "东C402"
      //     },
      //     {
      //       "name": "MY 产品创意设计鉴赏与实践",
      //       "teacher": "包光旋",
      //       "time": {
      //         "weekday": 4,
      //         "timeArray": [
      //           9,
      //           10,
      //           11
      //         ],
      //         "week": 6
      //       },
      //       "classroom": "文理A315"
      //     },
      //     {
      //       "name": "大学物理实验AⅠ",
      //       "teacher": "周爱平",
      //       "time": {
      //         "weekday": 1,
      //         "timeArray": [
      //           5,
      //           6,
      //           7,
      //           8
      //         ],
      //         "week": 6
      //       },
      //       "classroom": "上课地点未定"
      //     },
      //     {
      //       "name": "羽毛球-Ⅱ",
      //       "teacher": "黄昕",
      //       "time": {
      //         "weekday": 4,
      //         "timeArray": [
      //           3,
      //           4
      //         ],
      //         "week": 6
      //       },
      //       "classroom": "体育中心辅馆羽毛球1"
      //     }
      //   ]
      // ]
      //#endif
      for (let i = 1; i < temp.length; i++) {
        const weekCourses = temp[i];
        for (let j = 0; j < weekCourses.length; j++) {
          const course = weekCourses[j];
          const time = course.time;
          const courseTime = time.timeArray;
          const week = time.week;
          const weekday = time.weekday;
          const classroom = course.classroom;
          const name = course.name;
          for (let m = 0; m < courseTime.length; m++) {
            const value = name + '@' + classroom;
            if(this.timetableData[week][weekday - 1][courseTime[m] - 1].indexOf(value)==-1 && this.timetableData[week][weekday - 1][courseTime[m] - 1]!=''){
              this.$set(this.timetableData[week][weekday - 1], courseTime[m] - 1, (this.timetableData[week][weekday - 1][courseTime[m] - 1])+"!"+value)
              this.$set(this.timetableData[0][weekday - 1], courseTime[m] - 1, (this.timetableData[week][weekday - 1][courseTime[m] - 1])+"!"+value)
            }
            else{
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
      this.loading = false;
      uni.hideLoading();
      this.week = this.calculateCurrentWeek();
      clearTimeout(this.wait);
      // #ifdef APP
      this.demoWidget.createWidget(this.parseCourseSchedule(this.timetableData[this.week][this.todayWeekIndex()]))
      // #endif

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
        const endTime = this.timeSlots[endIndex].name.split('\n')[1];    // 取最后一节课的结束时间

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
    update() {
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
      this.$manager.getCurriculum().then(res=>{
        this.schedules = getCurriculumByUsernameAndPassword(JSON.parse(res));
        this.loadSchedule();
        uni.setStorageSync('curriculum', this.schedules)
      }).catch(res=>{
        console.log(res)
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

.menu {
  height: 100vh;
  width: 100%;
  background: var(--md-sys-color-surface);
  display: flex;
  flex-direction: column;

  .close-icon {
    margin-top: 20rpx;
    margin-left: auto;
    margin-right: 20rpx;
  }
}
.menu-content {
  background-color: var(--md-sys-color-tertiary);
  height: 280rpx;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .container{
    background-color: var(--md-sys-color-tertiary);
    width: calc(100% - 72rpx);
    height: calc(100% - 72rpx);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .logo{
      height: 100rpx;
      width: 100rpx;
    }
    .text{
      color: var(--md-sys-color-on-tertiary);
      font-weight: bold;
    }
  }
}
</style>