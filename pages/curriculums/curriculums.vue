<template>
  <view :style="[theme,SXData]">
    <material-nav-bar :background-color="'var(--md-sys-color-primary)'">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="--md-sys-color-on-primary" size="" type="bars"
                   @click="isDrawerOpen = true"/>
        <picker :range="range" :value="week" class="title" @change="change">
          <view>{{ range[week] }}</view>
        </picker>
        <uni-icons class="icon-right" color="--md-sys-color-on-primary" size="" type="loop"
                   @click="update(true)"/>
      </view>
    </material-nav-bar>
    <my-swipe ref="swiper" :default-index="week" @change="changeSwipe">
      <timetable v-for="(week,index) in weeks" :key="'timetable-'+week+'-'+theme['--md-sys-color-primary']"
                 :courses="timetableData"
                 :otherCourses="other" :thisWeek="week" :timetableType="timeSlots"
                 :weekStartDate="weekStartDate" @handleLongPressCourse="editCourse"
                 @handleLongPressEmpty="addCourse"
                 @handleTapCourse="showDetail"></timetable>
    </my-swipe>
    <material-button v-if="hiddenCourses.length > 0" :background-color="'var(--md-sys-color-primary-container)'"
                     class="float-btn"
                     icon-only shape="rounded"
                     size="large" @click="showHiddenManager = true">
      <zui-svg-icon :color="getColor('--md-sys-color-on-primary-container')" :height="mx(6.5)" :width="mx(6.5)"
                    collection="material-filled"
                    icon="visibility_off"/>
    </material-button>
    <!-- 2. 引入隐藏管理弹窗 -->
    <hidden-course-dialog :list="hiddenCourses" :visible="showHiddenManager" @close="showHiddenManager = false"
                          @restore="handleRestoreFromManager"/>
    <course-dialog :courses="dialog.courses" :mode="dialog.mode" :time-info="dialog.timeInfo" :visible="dialog.visible"
                   @add="navigateToAdd" @close="dialog.visible = false" @delete="confirmDelete" @edit="navigateToEdit"/>
    <MyDrawer :opened="isDrawerOpen" @onClose="isDrawerOpen = false"/>
    <sv-intercept-back :beforeIntercept="()=>{isDrawerOpen = false}" :show="isDrawerOpen"/>
    <material-tab-bar :update="theme['--md-sys-color-primary']"/>
  </view>
</template>

<script>
import Timetable from '@/components/lpx-timetable/lpx-timetable'
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialTabBar from "@/components/material-uni/material-tab-bar/material-tab-bar.vue";
import MySwipe from "@/components/material-uni/my-swipe/my-swipe.vue";
import {mx, SXData} from "@/components/material-uni/sx";
import {getColor, getTheme} from "@/components/material-uni/colors";
import {http} from "@/static/util/request";
import CourseDialog from '@/components/lpx-timetable/coursedialog.vue';
import HiddenCourseDialog from '@/components/lpx-timetable/hiddendialog.vue';
import MaterialButton from "@/components/material-uni/material-button/material-button.vue";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    MaterialButton, HiddenCourseDialog, CourseDialog, MaterialTabBar, Timetable, MySwipe, MaterialNavBar
  },
  data() {
    return {
      theme: {},
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
      weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      timetableData: [],
      other: [],
      weekStartDate: new Date('2025-02-17'),
      dialog: {
        visible: false,
        mode: 'view',
        courses: [], // 改名：从 course 变为 courses
        timeInfo: {
          dayName: '',
          nodeIndex: 0
        }
      },
      hiddenCourses: [], // 后端返回的完整列表
      showHiddenManager: false, // 控制新弹窗显示
    };
  },
  onReady() {
    // #ifdef APP-PLUS
    console.log('app onReady')
    plus.navigator.closeSplashscreen()
    // #endif
    // this.week = this.calculateCurrentWeek()
  },
  onLoad() {
    this.refreshTheme()
    uni.$on('ThemeUpdate', this.refreshTheme)
    uni.$on('refreshTimetable', () => {
      this.update(true)
    })
  },
  onShow() {
    //#ifdef APP-PLUS
    this.weekStartDate = new Date(this.$manager.getSemesterStartDate());
    // #endif
    this.update(false)
  },
  methods: {
    getColor,
    mx,
    refreshTheme() {
      this.theme = getTheme()
    },
    update(forceRefresh) {
      if (forceRefresh) {
        uni.showLoading({
          title: '尝试刷新课表'
        });
      }

      http.post("/getDateData").then(res => {
        this.week = res.data.currentWeek - 1; //第一周的index为0
        this.$refs.swiper.goto(this.week);
        this.weekStartDate = new Date(res.data.startDate)
      }).catch(res => {
        console.log(res)
      })
      http.post("/getCurriculum", {
        forceRefresh
      }).then(res => {
        if (forceRefresh) {
          setTimeout(() => {
            uni.showToast({
              title: '成功',
              duration: 2000
            });
          }, 500)
        }
        console.log(res.data.hiddenCourses)
        this.other = res.data.nullTimeCourses
        this.timetableData = res.data.validTimeCourses
        this.hiddenCourses = res.data.hiddenCourses || [];
      }).catch(res => {
        if (forceRefresh) {
          setTimeout(() => {
            uni.showToast({
              title: '失败',
              icon: "error",
              duration: 2000
            });
          }, 500)
        }
        console.log(res)
      }).finally(() => {
        uni.hideLoading()
      })
    },
    showDetail(courses) {
      this.dialog.visible = true;
      this.dialog.mode = 'view';
      this.dialog.courses = courses;
      this.dialog.conflictCount = courses.length;
    },
    // 长按已有课程 -> 编辑模式
    editCourse(courses) {
      this.dialog.visible = true;
      this.dialog.mode = 'edit';
      this.dialog.courses = courses;
      this.dialog.conflictCount = courses.length;
    },
    // 长按空白区域 -> 添加模式
    addCourse(e) {
      this.dialog.courses = [];
      this.dialog.visible = true;
      this.dialog.mode = 'add';
      this.dialog.course = null;
      console.log(e)
      this.dialog.timeInfo = {
        dayInt: e.dayIndex,
        nodeIndex: e.nodeIndex
      };
    },
    navigateToAdd() {
      this.dialog.visible = false;
      uni.navigateTo({
        url: `/pages/courseeditor/editor?mode=create`
      });
    },
    // 4. 处理弹窗传出来的 Edit 事件
    navigateToEdit(targetCourse) { // 接收具体的 course
      this.dialog.visible = false;
      const courseStr = encodeURIComponent(JSON.stringify(targetCourse));
      uni.navigateTo({
        url: `/pages/courseeditor/editor?course=${courseStr}`
      });
    },
    // 5. 处理弹窗传出来的 Delete 事件
    confirmDelete(targetCourse) { // 接收具体的 course
      this.dialog.visible = false;
      const isSystem = targetCourse.source === 0;
      uni.showModal({
        title: '提示',
        content: isSystem ?
            `确认隐藏该时段的 "${targetCourse.name}" 吗？`
            :
            `确认删除 "${targetCourse.name}" 吗？`,
        success: (res) => {
          if (res.confirm) {
            const params = {
              courseId: targetCourse.id,
              isSystem
            };
            if (isSystem) {
              params.day = targetCourse.day;
              params.start = targetCourse.start;
            }
            http.post("/course/delete", params).then(res => {
              this.update(true)
              console.log(res)
            }).catch(res => {
              console.log(res)
            })
          }
        }
      });
    },
    async handleRestoreFromManager(item) {
      // 调用后端恢复接口
      uni.showLoading({title: '恢复中'});
      try {
        http.post('/course/restore', {
          courseId: item.id,
          day: item.day,
          start: item.start // 这里依然需要 day 和 start 做精准恢复
        }).then(res => {
          this.update(true)
        }).catch(res => {
          uni.showToast({title: res.data});
        })
      } catch (e) {
        console.log(e)
        uni.showToast({title: '恢复失败', icon: 'none'});
      }
    },
    changeSwipe(newIndex, oldIndex) {
      this.week = newIndex;
      // console.log(`swipe from ${oldIndex} to ${newIndex}`);
    },
    change(e) {
      this.week = e.detail.value;
      this.$refs.swiper.goto(this.week);
    },
    todayWeekIndex() {
      let weekIndex = new Date().getDay() - 1
      if (weekIndex === -1) {
        weekIndex = 6
      }
      return weekIndex
    },
  }
};
</script>

<style lang="scss">
.float-btn {
  position: fixed;
  bottom: sx(25); // 根据你的 TabBar 高度调整
  right: sx(6);

  //.badge {
  //  position: absolute;
  //  top: -5px;
  //  right: -5px;
  //  background-color: var(--md-sys-color-error);
  //  color: white;
  //  font-size: 10px;
  //  width: 18px;
  //  height: 18px;
  //  border-radius: 50%;
  //  display: flex;
  //  align-items: center;
  //  justify-content: center;
  //  font-weight: bold;
  //}
}
</style>