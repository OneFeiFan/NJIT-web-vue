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
    <myswiper ref="swiper" :default-index="week" @change="changeSwipe">
      <timetable v-for="(tab,index) in timetableData" :other="other" :timetables="tab" :timetableType="timeSlots"
                 :weekStartDate="weekStartDate" :thisWeek="index"
                 @courseClick="handleCourseClick"
                 :key="'timetable-'+index+'-'+theme['--md-sys-color-primary']"
      ></timetable>
    </myswiper>
    <MyDrawer :opened="isDrawerOpen" @onClose="isDrawerOpen = false"/>
    <sv-intercept-back :show="isDrawerOpen" :beforeIntercept="()=>{isDrawerOpen = false}"/>
    <material-tab-bar :update="theme['--md-sys-color-primary']"/>
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
import {http} from "@/static/util/request";

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
      temp:1
    };
  },
  onReady() {
    // this.week = this.calculateCurrentWeek()
    //#ifdef H5
    // this.loadSchedule()
    // #endif

  },
  onLoad() {
    this.refreshTheme()
    uni.$on('ThemeUpdate',this.refreshTheme)
  },
  onShow() {
	// this.refreshTheme()
  //   this.weekStartDate = new Date(this.$manager.getSemesterStartDate());
    this.update(false)
  },
  methods: {
    refreshTheme(){
      this.theme = getTheme()
    },
    changeSwipe(newIndex, oldIndex) {
      this.week = newIndex;
      console.log(`swipe from ${oldIndex} to ${newIndex}`);
    },
    change(e) {
      this.week = e.detail.value;
      this.$refs.swiper.goto(this.week);
    },
    // calculateCurrentWeek() {
    //   const today = new Date(); // 当前日期
    //   today.setHours(0, 0, 0, 0); // 重置时间部分
    //
    //   const start = new Date(this.weekStartDate); // 学期开始日期
    //   start.setHours(0, 0, 0, 0); // 重置时间部分
    //
    //   const momentDate1 = moment(start); // 使用 moment 处理学期开始日期
    //   const momentDate2 = moment(today); // 使用 moment 处理当前日期
    //   const diff = momentDate2.diff(momentDate1, 'days'); // 计算日期差（天数）
    //   if (diff < 0) {
    //     return 1;
    //   }
    //   if (Math.floor(diff / 7) + 1 > 19) {
    //     return 0;
    //   }
    //   return Math.floor(diff / 7) + 1; // 计算周数
    // },
    loadSchedule() {
      // let temp = this.schedules
      // http.post('/course/list', {
      //   semester: '2023-2024-1'
      // }).then(res => {
      //   console.log(res)
      // })
      // this.weekStartDate = new Date(this.$manager.getSemesterStartDate());
      // this.loading = false;
      // uni.hideLoading();
      // this.week = this.calculateCurrentWeek();
      // this.$refs.swiper.goto(this.week);
      // clearTimeout(this.wait);
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
    update(forceRefresh) {
      if(forceRefresh){
        uni.showLoading({
          title: '尝试刷新课表'
        });
      }

      http.post("/getDateData").
      then(res=>{
        this.week = res.data.currentWeek
        this.$refs.swiper.goto(this.week);
        this.weekStartDate = new Date(res.data.startDate)
      }).
      catch(res=>{
        console.log(res)
      })
      http.post("/getCurriculum",{forceRefresh}).
      then(res=>{
        if(forceRefresh){
          setTimeout(()=>{
            uni.showToast({
              title: '成功',
              duration: 2000
            });
          },500)
        }
        this.other = JSON.parse(res.data.nullTimeCourses)
        this.timetableData = JSON.parse(res.data.validTimeCourses)
      }).
      catch(res=>{
        if(forceRefresh){
          setTimeout(()=>{
            uni.showToast({
              title: '失败',
              icon:"error",
              duration: 2000
            });
          },500)
        }
        this.timetableData = Array.from({
              length: 20
            }, () =>
                Array.from({
                      length: 7
                    }, () =>
                        Array(11).fill("")
                )
        )
      }).
      finally(()=>{
        uni.hideLoading()
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


.container {
  //height: 100vh;
  //height: calc(100vh - var(--window-bottom) - var(--status-bar-height) - 44px);
  background: #f5f5f5;
}

.custom-style {
  witdh: 20rpx
}


</style>