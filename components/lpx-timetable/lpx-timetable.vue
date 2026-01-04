<template>
  <view class="timetable">
    <!-- 顶部星期栏 -->
    <view class="header app-is-resizing">
      <view class="header-item" v-for="(item, index) in week" :key="item"
            :style="{ color: todayWeekIndex === index ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-on-surface-variant)' }">
        {{ item }}<br/>{{ getDateOfWeek(item) }}
      </view>
    </view>

    <!-- 课表主体 -->
    <view class="main">
      <scroll-view scroll-y="true" class="scroll-Y app-is-resizing">

        <!-- 背景网格行（包含左侧时间） -->
        <view class="row" v-for="(item, index) in timetableType" :key="index">
          <view class="time-item">
            {{ item.index }}<br/>{{ item.name.split('\n')[0] }}<br/>{{ item.name.split('\n')[1] }}
          </view>
        </view>

        <!-- 课程容器层 -->
        <view class="course-container">
          <!-- 遍历每一天 (weekColumn 代表这一天的渲染队列) -->
          <view v-if="courses.length>0" class="week" v-for="(weekColumn, dayIndex) in renderData" :key="dayIndex">
            <!-- 遍历这一天的每一个块 -->
            <view class="courseList" v-for="(slot, slotIndex) in weekColumn" :key="slotIndex">

              <!-- 情况1：有课程 -->
              <touch-ripple
                  v-if="slot.type === 'course'"
                  @click="handleTapCourse(slot.courses)"
                  @longpress="handleLongPressCourse(slot.courses)"
                  class="course"
                  :backgroundColor="slot.style.backgroundColor"
                  :color="slot.style.textColor"
                  :style="{
                    // 动态高度：(节数 * 单节高度) - 间隙
                    height: (slot.duration * mxValue(18) - mxValue(0.6)) + 'px',
                    // 间隙补到 margin-bottom，形成视觉分割
                    marginBottom: mxValue(0.6) + 'px',
                  }"
              >
                <view class="course">
                  <!-- 课程内容布局 -->
                  <view class="course-content">
                    <text class="course-name">{{ slot.displayCourse.name }}</text>
                    <text v-if="slot.displayCourse.room" class="course-room">@{{ slot.displayCourse.room }}</text>
                  </view>

                  <!-- 冲突角标 -->
                  <view v-if="slot.conflictCount > 0" class="conflict-badge">
                    <uni-icons color="currentColor" :size="mx(3.5)" type="tune-filled"/>
                  </view>
                </view>

              </touch-ripple>

              <!-- 情况2：空白占位符 -->
              <touch-ripple
                  v-else-if="slot.type === 'empty'"
                  background-color="var(--md-sys-color-surface)"
                  color="var(--md-sys-color-on-surface)"
                  class="course placeholder"
                  @longpress="handleLongPressEmpty(dayIndex, slot.realNodeIndex)"
                  :style="{ height: mxValue(18) + 'px' }"
              />
              <!-- 情况3：跳过（被合并的格子） -->
              <view v-else-if="slot.type === 'skip'" style="display: none;"/>
            </view>
          </view>
        </view>

        <!-- 底部其他课程 (无时间课程) -->
        <view class="other" v-if="otherCourses && otherCourses.length">
          <text class="text" v-for="(course, index) in otherCourses" :key="course.id || index">
            {{ index + 1 }}.{{ " " }}{{ course.name }}<br>{{ "\t\t\t\t教师：" }}{{ course.teacher }}
          </text>
        </view>

      </scroll-view>
    </view>
  </view>
</template>

<script>
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import {mx, mxValue, SXData} from "@/components/material-uni/sx";
import TouchRipple from "@/components/material-uni/ripple/component.vue";

export default {
  name: 'Timetable',
  components: {TouchRipple, UniIcons},
  props: {
    weekStartDate: {type: String, default: '2025-02-17'},
    courses: {type: Array, default: () => []},
    otherCourses: {type: Array, default: () => []},
    thisWeek: {type: [Number, String], default: 1},
    timetableType: {
      type: Array,
      default: () => [
        {index: '1', name: '08:00\n08:40'},
        {index: '2', name: '08:50\n09:30'},
        {index: '3', name: '09:40\n10:20'},
        {index: '4', name: '10:30\n11:10'},
        {index: '5', name: '11:20\n12:00'},
        {index: '6', name: '14:00\n14:40'},
        {index: '7', name: '15:50\n16:30'},
        {index: '8', name: '16:40\n17:20'},
        {index: '9', name: '17:30\n18:10'},
        {index: '10', name: '19:00\n19:40'},
        {index: '11', name: '20:50\n21:30'},
        {index: '12', name: '21:40\n22:20'}
      ]
    },
    week: {type: Array, default: () => ['一', '二', '三', '四', '五', '六', '日']},
    palette: {type: Array, default: () => []}
  },
  data() {
    return {
      text2num: {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 7},
      colorIndex: 0,
      // 颜色缓存
      courseColorMap: {},
      // 20组精心挑选的 MD3 配色方案
      defaultPalette: [
        {bg: 'var(--md-sys-color-primary)', text: 'var(--md-sys-color-on-primary)'},
        {bg: 'var(--md-sys-color-primary-container)', text: 'var(--md-sys-color-on-primary-container)'},
        {bg: 'var(--md-sys-color-secondary)', text: 'var(--md-sys-color-on-secondary)'},
        {bg: 'var(--md-sys-color-secondary-container)', text: 'var(--md-sys-color-on-secondary-container)'},
        {bg: 'var(--md-sys-color-tertiary)', text: 'var(--md-sys-color-on-tertiary)'},
        {bg: 'var(--md-sys-color-tertiary-container)', text: 'var(--md-sys-color-on-tertiary-container)'},
        {bg: 'var(--md-sys-color-error)', text: 'var(--md-sys-color-on-error)'},
        {bg: 'var(--md-sys-color-error-container)', text: 'var(--md-sys-color-on-error-container)'},
        {bg: 'var(--md-sys-color-inverse-surface)', text: 'var(--md-sys-color-inverse-on-surface)'},
        {bg: 'var(--md-sys-color-surface-variant)', text: 'var(--md-sys-color-on-surface-variant)'},
        {bg: 'var(--md-sys-color-primary-fixed-dim)', text: 'var(--md-sys-color-on-primary-fixed-variant)'},
        {bg: 'var(--md-sys-color-secondary-fixed-dim)', text: 'var(--md-sys-color-on-secondary-fixed-variant)'},
        {bg: 'var(--md-sys-color-tertiary-fixed-dim)', text: 'var(--md-sys-color-on-tertiary-fixed-variant)'},
        {bg: 'var(--md-sys-color-on-secondary-fixed)', text: 'var(--md-sys-color-secondary-fixed)'},
        {bg: 'var(--md-sys-color-primary-fixed)', text: 'var(--md-sys-color-on-primary-fixed)'},
        {bg: 'var(--md-sys-color-secondary-fixed)', text: 'var(--md-sys-color-on-secondary-fixed)'},
        {bg: 'var(--md-sys-color-tertiary-fixed)', text: 'var(--md-sys-color-on-tertiary-fixed)'},
        {bg: 'var(--md-sys-color-outline)', text: 'var(--md-sys-color-surface)'},
        {bg: 'var(--md-sys-color-inverse-primary)', text: 'var(--md-sys-color-on-primary-container)'},
        {bg: 'var(--md-sys-color-surface-container-highest)', text: 'var(--md-sys-color-primary)'}
      ]
    }
  },
  computed: {
    SXData: () => SXData,
    allPalette() {
      return [...this.palette, ...this.defaultPalette];
    },
    todayWeekIndex() {
      let weekIndex = new Date().getDay() - 1;
      return weekIndex === -1 ? 6 : weekIndex;
    },
    renderData() {
      const totalNodes = this.timetableType.length;
      const currentWeek = parseInt(this.thisWeek);
      const result = [];
      const coursesByDay = Array.from({length: 8}, () => []);

      // 1. 预筛选
      for (const course of this.courses) {
        if (course.weeks && course.weeks.includes(currentWeek)) {
          course.computedEnd = course.start + (course.step || 1) - 1;
          coursesByDay[course.day].push(course);
        }
      }

      // 2. 按天处理
      for (let day = 1; day <= 7; day++) {
        const dayColumn = [];
        const dayCourses = coursesByDay[day];
        const slots = new Array(totalNodes + 1).fill(null);

        // 3. 填充 slots
        for (const course of dayCourses) {
          for (let s = course.start; s <= course.computedEnd && s <= totalNodes; s++) {
            if (!slots[s]) slots[s] = [];
            slots[s].push(course);
          }
        }

        // 4. 生成渲染数据
        let i = 1;
        while (i <= totalNodes) {
          const conflictList = slots[i];

          // 空块
          if (!conflictList || conflictList.length === 0) {
            dayColumn.push({type: 'empty', realNodeIndex: i, duration: 1});
            i++;
            continue;
          }

          // 选出优先级最高的课（步长最短优先）
          let winner = conflictList[0];
          let minStep = winner.step || 1;
          if (conflictList.length > 1) {
            for (let j = 1; j < conflictList.length; j++) {
              const currentStep = conflictList[j].step || 1;
              if (currentStep < minStep) {
                minStep = currentStep;
                winner = conflictList[j];
              }
            }
          }

          // 计算合并跨度
          let actualDuration = 1;
          const maxSpan = Math.min(totalNodes - i + 1, winner.step || 1);

          for (let k = 1; k < maxSpan; k++) {
            const nextSlotList = slots[i + k];
            if (!nextSlotList || !nextSlotList.find(c => c.id === winner.id)) break;

            // 检查下一个节点的主导课程是否还是 winner
            let nextWinner = nextSlotList[0];
            let nextMinStep = nextWinner.step || 1;
            if (nextSlotList.length > 1) {
              for (let m = 1; m < nextSlotList.length; m++) {
                const s = nextSlotList[m].step || 1;
                if (s < nextMinStep) {
                  nextMinStep = s;
                  nextWinner = nextSlotList[m];
                }
              }
            }
            if (nextWinner.id !== winner.id) break;
            actualDuration++;
          }

          dayColumn.push({
            type: 'course',
            courses: conflictList,
            displayCourse: winner,
            conflictCount: conflictList.length - 1,
            duration: actualDuration,
            style: this.getCourseColor(winner.name)
          });

          i += actualDuration;
        }
        result.push(dayColumn);
      }
      return result;
    }
  },
  methods: {
    mx,  mxValue,
    getDateOfWeek(dayName) {
      if (!this.thisWeek) return '';
      const dayIndex = this.text2num[dayName];
      const date = new Date(this.weekStartDate);
      const diff = (this.thisWeek - 1) * 7 + (dayIndex - 1);
      date.setDate(date.getDate() + diff);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}/${day}`;
    },

    getCourseColor(courseName) {
      if (!this.courseColorMap[courseName]) {
        const index = this.colorIndex % this.allPalette.length;
        this.colorIndex++;
        this.courseColorMap[courseName] = {
          backgroundColor: this.allPalette[index].bg,
          textColor: this.allPalette[index].text
        };
      }
      return this.courseColorMap[courseName];
    },

    handleTapCourse(courses) {
      // setTimeout(() => {
      this.$emit('handleTapCourse', courses);
      // },250);
    },
    handleLongPressCourse(courses) {
      // setTimeout(() => {
      this.$emit('handleLongPressCourse', courses);
      // },250);
    },
    handleLongPressEmpty(dayIndex, nodeIndex) {
      // setTimeout(() => {
      this.$emit('handleLongPressEmpty', {dayIndex, nodeIndex});
      // },250);
    },
  }
}
</script>

<style scoped lang="scss">
.timetable {
  $basewidth: calc(100vw - sx(12));
  $itemwidth: calc($basewidth / 7);
  $time-item-height: sx(18);
  display: flex;
  flex-direction: column;

  .header {
    background-color: var(--md-sys-color-surface);
    width: $basewidth;
    padding-left: sx(12);
    height: sx(8);
    display: flex;
    align-items: center;
    // 改用阴影代替边框，更有 MD2/MD3 的悬浮感
    box-shadow: 0 sx(0.5) sx(0.75) rgba(0, 0, 0, 0.05);
    z-index: 10;
    position: relative;

    .header-item {
      height: 100%;
      width: $itemwidth;
      font-size: sx(2.4);
      font-weight: 500;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      //line-height: 1.2;
    }
  }

  .main {
    background-color: var(--md-sys-color-surface);
    position: relative;
    flex: 1;
    overflow: hidden;


    .scroll-Y {
      height: 100%;
    }

    .row {
      height: $time-item-height;
      position: relative;

      //&:after {
      //  content: '';
      //  height: 0;
      //  width: 100%;
      //  position: absolute;
      //  bottom: 0;
      //  left: 0;
      //  // 网格虚线颜色调淡
      //  border-bottom: 1px dashed var(--md-sys-color-outline-variant);
      //  opacity: 0.4;
      //}

      .time-item {
        background-color: var(--md-sys-color-surface-container-low);
        border-right: sx(0.1) solid var(--md-sys-color-outline-variant);
        height: 100%;
        width: sx(12);
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: sx(2.2);
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant);
        opacity: 0.85;
      }
    }

    .course-container {
      position: absolute;
      top: 0;
      left: sx(12);
      width: $basewidth;
      display: flex;

      .week {
        width: $itemwidth;
        display: flex;
        flex-direction: column;

        .courseList {
          width: 100%;
          // 由内部 .course 的 margin 控制间距，这里不设 padding

          .course {
            height: 100%;
            // === 布局核心：左右留白 + 圆角阴影 ===
            //width: 94%;
            margin-left: 3%; // 水平居中
            //box-sizing: border-box;
            border-radius: sx(2); // 适中的圆角

            // Material Elevation 1 阴影
            //box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.14);

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            //padding: 2px 3px;

            overflow: hidden;
            position: relative;
            //transition: box-shadow 0.2s;

            //&:active {
            //  // 点击态加深阴影
            //  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
            //}

            .course-content {
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
            }

            .course-name {
              white-space: normal;
              font-size: sx(2.4);
              font-weight: 700; // 粗体增加辨识度
              line-height: 1.15;
              margin-bottom: sx(0.5);
              display: flex;
              overflow: hidden;
            }

            .course-room {
              font-size: sx(2);
              opacity: 0.9;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 100%;
            }

            .conflict-badge {
              position: absolute;
              top: 0;
              right: 0;
              background: rgba(0, 0, 0, 0.2);
              border-bottom-left-radius: sx(2);
              padding: sx(0.5);
              display: flex;
            }

            &.placeholder {
              background: transparent;
              box-shadow: none;
              //pointer-events: none;
            }
          }
        }
      }
    }

    .other {
      min-height: sx(30);
      padding: sx(2.5);
      color: var(--md-sys-color-on-primary-container);

      .text {
        display: block;
        margin-bottom: sx(2.5);
      }
    }
  }
}
</style>