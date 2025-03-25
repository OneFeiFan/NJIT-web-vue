<template>
  <view class="container">
    <status-bar></status-bar>
    <!-- 头部控制栏 -->
    <uni-nav-bar leftWidth="0" rightWidth="0" :border="false" background-color="rgb(248, 248, 248)">
      <view class="header">
        <uni-icons type="bars" size="50rpx" @click="showMenu" class="icon-left"/>
        <picker class="title" @change="change" :value="week" :range="range">
          <view class="title">{{ range[week] }}</view>
        </picker>
        <uni-icons type="loop" size="50rpx" @click="update" class="icon-right" :class="{'rotate': loading}"/>
      </view>
    </uni-nav-bar>

    <!--		<u-picker @cancel="show = false" @close="show = false" :show="show" :columns="weekdays" @confirm="localConfirm"-->
    <!--			title="请选择周次" closeOnClickOverlay ref="uPicker"></u-picker>-->


    <y-tabs v-model="week" :swipeable="true" :hide="true">
      <y-tab class="y-tab-virtual" v-for="(tab,index) in timetableData">
        <timetable :timetables="tab" :timetableType="timeSlots" :weekStartDate="weekStartDate" :thisWeek="index"
                   @courseClick="handleCourseClick"></timetable>
      </y-tab>
    </y-tabs>

    <uni-popup ref="loginModal" type="message" :mask-click="false">
      <view class="login-modal">
        <view class="wrap">
          <uni-easyinput class="input" v-model="username" placeholder="请输入账号"
                         @input="inputUserName"/>
          <uni-easyinput class="input" v-model="password" placeholder="请输入密码"
                         @input="inputPassWord"/>
          <view class="captcha">
            <uni-easyinput class="input" v-model="captcha" placeholder="请输入验证码" @input="inputCaptcha"/>
            <image class="captcha-img"
                   :src=captchaImg
                   mode="aspectFill" @click="updateCaptchaImg"/>
          </view>
          <view class="btn-wrap">
            <button class="login-btn" type="default" @click="cancel">取消</button>
            <button class="login-btn" type="primary" @click="login">登录</button>
          </view>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="menu" :mask-click="false">
      <view class="menu">
        <status-bar></status-bar>
        <uni-icons type="closeempty" size="50rpx" @click="closeMenu" class="close-icon"/>
        <fui-list>
          <fui-list-cell arrow @click="jump(`classroom`)">
            <text>空教室查询</text>
          </fui-list-cell>
          <fui-list-cell arrow @click="jump(`evaluate`)">
            <text>快速评价</text>
          </fui-list-cell>
          <fui-list-cell arrow @click="jump(`scores`)">
            <text>成绩查询</text>
          </fui-list-cell>
        </fui-list>
      </view>
    </uni-popup>
    <sv-intercept-back
        :show="menu"
        :beforeIntercept="closeMenu"
    />
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
import FuiListCell from "@/components/fui-list-cell/fui-list-cell.vue";

export default {
  components: {
    FuiListCell,
    UniIcons,
    YTab,
    YTabs,
    UniNavBar,
    StatusBar,
    UButton,
    UIcon,
    UniPopup,
    UniEasyinput,
    Timetable
  },
  data() {
    return {
      menu: false,
      loading: false,
      app: false,
      check: null,
      wait: null,
      loginPage: null,
      captchaImg: null,
      username: '',
      password: '',
      captcha: '',
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
                      Array(10).fill("")
              )
      ),
      schedules: [],
      weekStartDate: new Date('2025-02-17'),
      webviewJS: null
    };
  },
  created() {
    // #ifdef APP-PLUS
    this.loginPage = plus.webview.getWebviewById("webviewInside");
    plus.globalEvent.addEventListener('plusMessage', this.handlePostMessage)
    // this.loginPage.setStyle({
    //   top: 100,
    //   height: "30%",
    //   width: "100%"
    // })
    // var currentWebview = this.$scope.$getAppWebview(); //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
    // currentWebview.append(this.loginPage);

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
    this.loginPage.onerror = (e) => {
      uni.showToast({
        title: '加载失败',
        icon: 'error',
        duration: 2000
      });
    }
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
      this.$refs.menu.open("left");
    },
    closeMenu() {
      this.$refs.menu.close();
      uni.showTabBar({
        animation: true
      });
      this.menu = false;
    },
    jump(page) {
      this.menu = false;
      this.$refs.menu.close();
      uni.showTabBar({
        animation: true
      });
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
        "time": {"weekday": 2, "timeArray": [1, 2], "week": 9},
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
            this.$set(this.timetableData[week][weekday - 1], courseTime[m] - 1, value)
            this.$set(this.timetableData[0][weekday - 1], courseTime[m] - 1, value)
          }
        }
      }
      this.loading = false;
      uni.hideLoading();
      this.week = this.calculateCurrentWeek()
      clearTimeout(this.wait);
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
    inputUserName(e) {
      this.loginPage.evalJS(
          `document.querySelector("#mobileUsername").value = "${e}"`
      )
    },
    inputPassWord(e) {
      this.loginPage.evalJS(
          `document.querySelector("#mobilePassword").value = "${e}"`
      )
    },
    inputCaptcha(e) {
      this.loginPage.evalJS(
          `document.querySelector("#captchaResponse").value = "${e}"`
      )
    },
    getCaptchaImg() {
      this.loginPage.evalJS(`
            function getBase64FromImg(imgElement, type = 'image/png') {
              const canvas = document.createElement('canvas');
              canvas.width = imgElement.naturalWidth;
              canvas.height = imgElement.naturalHeight;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(imgElement, 0, 0);
              return canvas.toDataURL(type); // 返回完整的Base64字符串（包含MIME类型）
            }
            plus.webview.postMessageToUniNView({
              type: "CAPTCHAIMAGEBASE64",
              args: {
                data: getBase64FromImg(document.querySelector("#captchaImg"))
              }
            }, "__uniapp__service");
          `)
    },
    updateCaptchaImg() {
      this.loginPage.evalJS(
          `document.querySelector("#captchaImg").click();`
      );
      setTimeout(() => {
        // this.injectJS();
        this.getCaptchaImg();
      }, 500);

      console.log("updateCaptchaImg")
    },
    login() {
      if (this.username === '' || this.password === '' || this.captcha === '') {
        uni.showToast({
          title: '输入错误',
          icon: 'error',
          duration: 1000
        });
        return;
      }
      console.log('login')
      this.$refs.loginModal.close();
      this.captchaImg = null;
      this.captcha = '';
      this.username = '';
      this.password = '';
      uni.showLoading({
        title: '登录中'
      });

      // #ifdef APP-PLUS
      this.loginPage.onloaded = () => {
        this.loginPage.onloaded = () => {
        }
        uni.hideLoading();
        this.loading = false;
        setTimeout(() => {
          if (this.loginPage.getURL() !== "https://casb.njit.edu.cn/http/webvpn0ce64a2014465dfe87dac723232b20edd0da6675d44948234864a5c4ff77b278/new/index.html") {
            uni.hideLoading();
            uni.showToast({
              title: '登录失败',
              icon: 'error',
              duration: 2000
            });
            return;
          }
          uni.showToast({
            title: '登录成功，现在再点击刷新即可获取课表',
            icon: 'none',
            duration: 2000
          });
        }, 100)
      }
      this.loginPage.evalJS(
          'document.querySelector("#load").click();'
      )
      // #endif
    },
    update() {
      console.log('update')
      this.loading = true;
      uni.showToast({
        title: '验证信息',
        icon: 'loading',
        duration: 2000
      });
      this.loginPage.loadURL(`https://casb.njit.edu.cn/http/webvpnea5e00498bb033e68046c95dbdf6e09fbc127bea836184c80a0792b662ced92f/authserver/login?service=http://ehall.njit.edu.cn/login?service=http://ehall.njit.edu.cn/new/index.html&time=${Math.random()}`)
      this.loginPage.onloaded = () => {
        this.loginPage.onloaded = () => {
        }
        setTimeout(() => {
          if (this.loginPage.getURL() === "https://casb.njit.edu.cn/http/webvpn0ce64a2014465dfe87dac723232b20edd0da6675d44948234864a5c4ff77b278/new/index.html") {
            this.initJWXT();
            return;
          }
          uni.showToast({
            title: '请先登录',
            icon: 'error',
            duration: 2000
          });

          this.$refs.loginModal.open('center');
          this.getCaptchaImg();
        }, 100)
      }
    },
    initJWXT() {
      uni.showLoading({
        title: '加载教务信息'
      });
      this.check = setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '加载信息失败',
          icon: 'error',
          duration: 2000
        });
      }, 5000);
      this.loginPage.evalJS(
          `var myHeaders = new Headers();
                  myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
                  myHeaders.append("Accept", "*/*");
                  myHeaders.append("Host", "casb.njit.edu.cn");
                  myHeaders.append("Connection", "keep-alive");
                  var requestOptions = {
                     method: 'GET',
                     headers: myHeaders,
                     redirect: 'follow'
                  };
              fetch("https://casb.njit.edu.cn/http/webvpn0ce64a2014465dfe87dac723232b20edd0da6675d44948234864a5c4ff77b278/appShow?appId=5904538791462728", requestOptions)
                  .then(result => {
                    plus.webview.postMessageToUniNView({
                      type: "jwxtOK",
                      args: {}
                    }, "__uniapp__service");
                  })
                  .catch(error => {
                    plus.webview.postMessageToUniNView({
                      type: "jwxtBad",
                      args: {}
                    }, "__uniapp__service");
                  });`
      );
    },
    getTimeTable() {
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
      this.loginPage.evalJS(`
              var myHeaders = new Headers();
              myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
              myHeaders.append("Accept", "*/*");
              myHeaders.append("Host", "casb.njit.edu.cn");
              myHeaders.append("Connection", "keep-alive");
              var requestOptions = {
                 method: 'POST',
                 headers: myHeaders,
                 redirect: 'follow'
              };
              fetch("https://casb.njit.edu.cn/http/webvpn3e1a11b7208e283ab07ade5d2913fc13d6f6fe09d2dc7372db2a51a14aa4167a/jwglxt/kbcx/xskbqr_cxXskbqrIndex.html?doType=query&gnmkdm=N2158&enlink-vpn&xnm=2024&xqm=12&_search=false&nd=1725346567148&queryModel.showCount=200&queryModel.currentPage=1&queryModel.sortName=&queryModel.sortOrder=asc&time=1", requestOptions)
                  .then(response => response.text())
                  .then(result => {
                    plus.webview.postMessageToUniNView({
                      type: "GETTIMETABLE",
                      args: {
                        data: result
                      }
                    }, "__uniapp__service");
                  }).catch(error => console.log('error', error));`
      );
    },
    cancel() {
      this.$refs.loginModal.close();
    },
    handlePostMessage({data}) {
      // console.log(data)
      if (data.type === "subscribeHandler") {
        return
      }
      let {args} = data;
      if (data.type === "CAPTCHAIMAGEBASE64") {
        this.captchaImg = args.data;
      } else if (data.type === "jwxtOK") {
        clearTimeout(this.check);
        this.getTimeTable();
      } else if (data.type === "GETTIMETABLE") {
        this.schedules = getCurriculumByUsernameAndPassword(JSON.parse(args.data));
        this.loadSchedule();
        uni.setStorageSync('curriculum', this.schedules)
      }
    },
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

.header {
  height: 100%;
  width: 100%;
  background: #fff;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  //justify-content: center;


  .icon-left {
    margin-left: 50rpx;

    /* 调整这个值控制间距 */
    position: relative;
    //top: -6rpx
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .rotate {
    animation: rotate 1s linear infinite;
    display: inline-block;
  }

  .icon-right {
    margin-right: 50rpx;
    /* 调整这个值控制间距 */
    position: relative;
    will-change: transform;
    //top: -6rpx
  }

  .title {
    width: 50%;
    margin: 0 auto;
    display: block;
    text-align: center;
    font-size: 36rpx;
    color: #333;
  }
}

.menu {
  height: 100vh;
  width: 100vw;
  background: #fff;
  display: flex;
  flex-direction: column;

  .close-icon {
    margin-top: 20rpx;
    margin-left: auto;
    margin-right: 20rpx;
  }
}
</style>