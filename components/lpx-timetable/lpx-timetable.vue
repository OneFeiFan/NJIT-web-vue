<template>
  <view class="timetable">
    <view class="header">
      <view class="header-item" v-for="(item,index) in week" :key="item"
            :style="{ color: todayWeekIndex === index ? '#4070FF' : 'unset' }">{{ item }}<br/>{{ getDateOfWeek(item) }}
      </view>
    </view>

    <view class="main">
      <scroll-view scroll-y="true" class="scroll-Y">
        <view class="row" v-for="(item,index) in timetableType" :key="index">
          <view class="time-item">
            {{ item.index }}<br/>{{ item.name }}
          </view>
        </view>

        <view class="course-container">
          <view class="week" v-for="(week, weekIndex) in courseData" :key="weekIndex">
            <view class="courseList" v-for="(course, courseIndex) in week" :key="courseIndex">
              <view @click="handleCourseClick(course, weekIndex, courseIndex)" class="course"
                    :style="{ height: (course.length * 142) + 'rpx', background: course.backgroundColor }"
                    v-if="course.length > 0"> {{ course.name.split('!')[0] }}
                <image v-if="course.name.includes('!')" class="plus-icon" src="./md-sync.svg"></image>
              </view>
            </view>
          </view>
        </view>
        <view class="other">
          <text class="text" v-for="(value, index) in other">{{index+1}}.{{value}}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Timetable',
  props: {
    weekStartDate: {
      type: Date,
      default: () => {
        return new Date('2000-01-01')
      }
    },
    timetableType: {
      type: Array,
      default: () => {
        return [
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
      }
    },
    thisWeek: {
      type: Number | String,
      default: 1
    },
    week: {
      type: Array,
      default: () => {
        return ['一', '二', '三', '四', '五', '六', '日']
      }
    },
    timetables: {
      type: Array,
      default: () => {
        return []
      }
    },
    palette: {
      type: Array,
      default: () => {
        return []
      }
    },
    other: {
      type: Array,
      default: () => {
        return ["暂无其他消息"]
      }
    }
  },
  data() {
    return {
      text2num: {
        '一': 1,
        '二': 2,
        '三': 3,
        '四': 4,
        '五': 5,
        '六': 6,
        '日': 7
      },
      allPalette: [...this.palette, '#f05261', '#48a8e4', '#ffd061', '#52db9a', '#70d3e6', '#52db9a', '#3f51b5', '#f3d147', '#4adbc3', '#673ab7', '#f3db49', '#76bfcd', '#b495e1', '#ff9800', '#8bc34a']
    }
  },
  computed: {
    courseData() {
      let course2color = {}
      // 为数据标记背景颜色的函数
      let paletteIndex = 0
      const getBackgroundColor = (course) => {
        if(course2color[course]){
          return course2color[course];
        }
        const backgroundColor = this.allPalette[paletteIndex];
        course2color[course] = backgroundColor;
        paletteIndex++
        if (paletteIndex >= this.allPalette.length) {
          paletteIndex = 0
        }
        return backgroundColor
      }

      // 合并
      const listMerge = []
      this.timetables.forEach(function (list, i) {
        if (!listMerge[i]) {
          listMerge[i] = []
        }
        list.forEach(function (item, index) {
          if (!index) {
            return listMerge[i].push({
              name: item,
              length: 1,
              backgroundColor: item === '' ? 'none' : getBackgroundColor(item)
            })
          }
          if (item === (listMerge[i][index - 1] || {}).name && item) {
            const sameIndex = (listMerge[i][index - 1] || {}).sameIndex
            if (sameIndex || sameIndex === 0) {
              listMerge[i][sameIndex].length++
              return listMerge[i].push({name: item, length: 0, sameIndex: sameIndex})
            }
            listMerge[i][index - 1].length++
            return listMerge[i].push({name: item, length: 0, sameIndex: index - 1})
          } else {
            return listMerge[i].push({
              name: item,
              length: 1,
              backgroundColor: item === '' ? 'none' : getBackgroundColor(item)
            })
          }
        })
      })
      return listMerge
    },
    todayWeekIndex() {
      let weekIndex = new Date().getDay() - 1
      if (weekIndex === -1) {
        weekIndex = 6
      }
      return weekIndex
    }
  },
  methods: {
    getDateOfWeek(y) {
      let x = this.thisWeek;
      if (x == 0) {
        return ''
      }
      y = this.text2num[y];
      // startDate 是第一周的周一日期，格式为 'YYYY-MM-DD'
      let date = new Date(this.weekStartDate);
      // 计算第 x 周的周一的日期
      date.setDate(date.getDate() + (x - 1) * 7);
      // 调整到第 x 周的周 y 的日期，y 的范围是 1（周一）到 7（周日）
      date.setDate(date.getDate() + y - 1);

      // 格式化为 'YYYY-MM-DD' 的字符串
      // let year = date.getFullYear();
      let month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
      let day = String(date.getDate()).padStart(2, '0');

      return `${month}/${day}`;
    },
    handleCourseClick(course, weekIndex, courseIndex) {
      console.log(course)
      const data = {
        index: courseIndex + 1,
        length: course.length,
        week: this.week[weekIndex],
        weekIndex: weekIndex,
        name: course.name
      }
      console.log(`星期${data.week}; 第${data.index}节课; 课程名:${data.name}; 课节:${data.length}`)
      console.log(data)
      this.$emit('courseClick', data)
    }
  }
}
</script>

<style scoped lang="scss">
.timetable {
  background: white;
  border: 1px solid #E4E7ED;
  border-radius: 8rpx;

  $basewidth: calc(100vw - 100rpx);
  $itemwidth: calc($basewidth / 7);
  $time-item-height: 142rpx;

  .header {
    background-color: var(--md-sys-color-secondary-container);
    width: $basewidth;
    padding-left: 100rpx;
    height: 70rpx;
    display: flex;
    align-items: center;

    .header-item {
      height: 100%;
      width: $itemwidth;
      font-size: 24rpx;
      text-align: center;
    }
  }

  .main {
    position: relative;
    height: calc(100vh - 70rpx - 44px - 100rpx - var(--status-bar-height) - 2px);

    .scroll-Y {
      height: 100%;
    }

    .row {
      background-color: var(--md-sys-color-secondary-container);
      height: $time-item-height;
      position: relative;

      &:after {
        content: '';
        height: 0;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-bottom: 1rpx dashed var(--md-sys-color-outline);
      }

      .time-item {
        height: 100%;
        width: 100rpx;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        color: var(--md-sys-color-secondary);

      }
    }

    .course-container {
      position: absolute;
      top: 0;
      left: 100rpx;
      width: $basewidth;
      display: flex;

      .week {
        width: $itemwidth;
        display: flex;
        flex-direction: column;

        .courseList {
          word-break: break-all;
          color: white;
          // overflow: hidden;

          .course {
            border-radius: 10rpx;
            display: flex;
            align-items: center;
            text-align: center;
            overflow: hidden;
            width: 100%;
            font-size: 28rpx;
            position: relative;
            /* 为加号定位提供基准 */
          }

          .plus-icon {
            position: absolute;
            top: 4rpx;
            right: 4rpx;
            width: 32rpx;
            height: 32rpx;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40rpx;
          }
        }
      }
    }
    .other {
      background-color: var(--md-sys-color-primary-container);
      min-height: 200rpx;
      width: 100%;
      color: var(--md-sys-color-on-primary-container);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .text{
        margin-top: 20rpx;
        &:last-child{
          margin-bottom: 20rpx;
        }
      }
    }
  }
}
</style>
