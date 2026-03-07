<template>
  <view :style="themeStyle" class="container">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
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
    <my-swipe class="swipe" ref="swiper" :default-index="week" :loop="true" @change="changeSwipe">
      <my-swipe-item v-for="(w, index) in weeks" :key="w">
        <timetable
            :courses="timetableData"
            :otherCourses="other"
            :thisWeek="w"
            :timetableType="timeSlots"
            :weekStartDate="weekStartDate"
            @handleLongPressCourse="editCourse"
            @handleLongPressEmpty="addCourse"
            @handleTapCourse="showDetail">
        </timetable>
      </my-swipe-item>
    </my-swipe>
    <view class="float-btn">
      <material-button v-if="hiddenCourses.length > 0" background-color="var(--md-sys-color-primary-container)"
                       color="var(--md-sys-color-on-primary-container)"
                       shape="rounded"
                       size="large" @click="showHiddenManager = true">
        <zui-svg-icon :color="getColor('--md-sys-color-on-primary-container')" :height="mx(6.5)" :width="mx(6.5)"
                      collection="material-filled"
                      icon="visibility_off"/>
      </material-button>
    </view>
    <welcome :visible="showWelcome" @close="showWelcome = false"></welcome>
    <!-- 2. 引入隐藏管理弹窗 -->
    <hidden-course-dialog :list="hiddenCourses" :visible="showHiddenManager" @close="showHiddenManager = false"
                          @restore="handleRestoreFromManager"/>
    <course-dialog :courses="dialog.courses" :mode="dialog.mode" :time-info="dialog.timeInfo" :visible="dialog.visible"
                   @add="navigateToAdd" @close="dialog.visible = false" @delete="confirmDelete" @edit="navigateToEdit"/>
    <MyDrawer :opened="isDrawerOpen" @onClose="isDrawerOpen = false"/>
    <sv-intercept-back :beforeIntercept="()=>{isDrawerOpen = false; showHiddenManager = false; dialog.visible = false }" :show="isDrawerOpen || showHiddenManager || dialog.visible"/>
    <material-tab-bar color="var(--md-sys-color-outline)"/>
  </view>
</template>

<script>
//#ifdef H5
import {http} from "@/static/util/request";
//#endif
import Timetable from '@/components/lpx-timetable/lpx-timetable'
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialTabBar from "@/components/material-uni/material-tab-bar/material-tab-bar.vue";
import MySwipe from "@/components/material-uni/my-swipe/my-swipe.vue";
import {mx, SXData} from "@/components/material-uni/sx";
import CourseDialog from '@/components/lpx-timetable/coursedialog.vue';
import HiddenCourseDialog from '@/components/lpx-timetable/hiddendialog.vue';
import MaterialButton from "@/components/material-uni/material-button/material-button.vue";
import MySwipeItem from "@/components/material-uni/my-swipe/my-swipe-item.vue";
import Welcome from "@/pages/curriculums/welcome.vue";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    Welcome, MySwipeItem, MaterialButton, HiddenCourseDialog, CourseDialog, MaterialTabBar, Timetable, MySwipe, MaterialNavBar
  },
  data() {
    return {
      isDrawerOpen: false,
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
      weekStartDate: '-1',
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
      showWelcome: false, // 控制欢迎页显示
    };
  },
  onLoad() {
    uni.$on('refreshTimetable', () => {
      this.update(true)
    })
  },
  onShow() {
    if (this.weekStartDate !== '-1') {
      this.update(false)
    }
  },
  mounted() {
    setTimeout(() => {
      this.weekStartDate = '2025-02-17'
      this.update(false)
    })
  },
  methods: {
    mx,
    update(forceRefresh) {
      if (forceRefresh) {
        uni.showLoading({
          title: '尝试刷新课表'
        });
      }
      // #ifdef APP-PLUS
      let res = this.$manager.getDate()
      if (res !== "{}") {
        let value = JSON.parse(res)
        this.week = value.currentWeek - 1; //第一周的index为0
        this.weekStartDate = value.startDate
      }


      this.$manager.getCurriculum(forceRefresh).then(value => {
        if (Object.keys(value).length > 0) {
          this.timetableData = Object.freeze(value.validTimeCourses);
          this.other = Object.freeze(value.nullTimeCourses);
          this.hiddenCourses = Object.freeze(value.hiddenCourses || []);
          let welcome = uni.getStorageSync("welcome")
          if(welcome === undefined || welcome === null || welcome !== "1.2.5"){
            this.showWelcome = true;
            uni.setStorageSync("welcome", "1.2.5")
          }
        }
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


      // console.log(result)
      // #endif

      // #ifdef H5
      http.post("/getDateData").then(res => {
        this.week = res.data.currentWeek - 1; //第一周的index为0
        this.weekStartDate = res.data.startDate
      }).catch(res => {
        console.log(res)
      })
      let postData = {}
      if (forceRefresh) {
        postData.forceRefresh = forceRefresh
      }
      http.post("/getCurriculum", postData).then(res => {
        if (forceRefresh) {
          setTimeout(() => {
            uni.showToast({
              title: '成功',
              duration: 2000
            });
          }, 500)
        }
        this.other = res.data.nullTimeCourses
        this.timetableData = res.data.validTimeCourses
        this.hiddenCourses = res.data.hiddenCourses || [];
        let welcome = uni.getStorageSync("welcome")
        if(welcome === undefined || welcome === null || welcome !== "1.2.5"){
          this.showWelcome = true;
          uni.setStorageSync("welcome", "1.2.5")
        }
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
      // #endif
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
            // #ifdef APP-PLUS
            let result = this.$manager.deleteCourse(params)
            if (Object.keys(result).length > 0 && result.code === 200) {
              this.update(true)
            } else {
              console.error(result)
              uni.showToast({title: "删除失败"})
            }
            // #endif
            // #ifdef H5
            http.post("/course/delete", params).then(res => {
              this.update(true)
              console.log(res)
            }).catch(res => {
              console.log(res)
            })
            // #endif
          }
        }
      });
    },
    async handleRestoreFromManager(item) {
      // 调用后端恢复接口
      uni.showLoading({title: '恢复中'});
      // #ifdef APP-PLUS
      let result = this.$manager.restoreCourse({
        courseId: item.id,
        day: item.day,
        start: item.start // 这里依然需要 day 和 start 做精准恢复
      })
      if (Object.keys(result).length > 0 && result.code === 200) {
        uni.showToast({title: '恢复成功', icon: 'none'});
        this.update(true)
      } else {
        console.error(result)
        uni.showToast({title: "恢复失败"})
      }
      // #endif
      try {
        //#ifdef H5
        http.post('/course/restore', {
          courseId: item.id,
          day: item.day,
          start: item.start // 这里依然需要 day 和 start 做精准恢复
        }).then(res => {
          this.update(true)
        }).catch(res => {
          uni.showToast({title: res.data});
        })
        // #endif
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
    },
    todayWeekIndex() {
      let weekIndex = new Date().getDay() - 1
      if (weekIndex === -1) {
        weekIndex = 6
      }
      return weekIndex
    }
  }
};
</script>

<style lang="scss">
.container {
  height: 100vh;
  background-color: var(--md-sys-color-surface);
  display: flex;
  flex-direction: column;

  .swipe{
    flex: 1;
    overflow: hidden;
  }
}

.float-btn {
  position: fixed;
  bottom: sx(25); // 根据你的 TabBar 高度调整
  right: sx(6);
  z-index: 5;
}
</style>