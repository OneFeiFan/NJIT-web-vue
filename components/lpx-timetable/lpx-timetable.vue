<template>
  <sx class="timetable">
    <view class="header">
      <view class="header-item" v-for="(item,index) in week" :key="item"
            :style="{ color: todayWeekIndex === index ? '#4070FF' : 'unset' }">{{ item }}<br/>{{ getDateOfWeek(item) }}
      </view>
    </view>

    <view class="main">
      <scroll-view scroll-y="true" class="scroll-Y">
        <view class="row" v-for="(item,index) in timetableType" :key="index">
          <view class="time-item">
            {{ item.index }}<br/>{{ item.name.split('\n')[0] }}<br/>{{ item.name.split('\n')[1] }}
          </view>
        </view>

        <view class="course-container">
          <view class="week" v-for="(week, weekIndex) in courseData" :key="weekIndex">
            <view class="courseList" v-for="(course, courseIndex) in week" :key="courseIndex">
              <view @click="handleCourseClick(course, weekIndex, courseIndex)" class="course"
                    :style="{ height: course.length * (mxValue(18) - 1/course.length) + 'px','margin-top':courseIndex!==0? '1px' : '0px', background: course.background.backgroundColor,color: course.background.textColor }"
                    v-if="course.length > 0"> {{ course.name.split('!')[0] }}
<!--                <image v-if="!course.name.includes('!')" class="plus-icon" src="./md-sync.svg"></image>-->
                <uni-icons v-if="course.name.includes('!')" type="tune-filled" :size="mx(5)"  color="var(--md-sys-color-on-surface)"
                           class="plus-icon"/>
              </view>
            </view>
          </view>
        </view>
        <view class="other">
          <text class="text" v-for="(value, index) in other">{{index+1}}.{{" "}}{{value}}</text>
        </view>
      </scroll-view>
    </view>
  </sx>
</template>

<script>
import moment from 'moment';
import sx from "@/components/material-uni/sx.vue"
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
export default {
  mixins: [sx],
  name: 'Timetable',
  components:{
    UniIcons,
    sx
  },
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
      timeHeight:900,
      text2num: {
        '一': 1,
        '二': 2,
        '三': 3,
        '四': 4,
        '五': 5,
        '六': 6,
        '日': 7
      },
      allPalette: [...this.palette,
        {bg: 'var(--md-sys-color-on-tertiary-fixed)', text: 'var(--md-sys-color-tertiary-fixed)'},
        {bg: 'var(--md-sys-color-on-primary-container)', text: 'var(--md-sys-color-inverse-primary)'},
        {bg: 'var(--md-sys-color-primary-fixed-dim)', text: 'var(--md-sys-color-on-primary-fixed-variant)'},
        {bg: 'var(--md-sys-color-tertiary-container)', text: 'var(--md-sys-color-tertiary)'},
        {bg: 'var(--md-sys-color-on-surface-variant)', text: 'var(--md-sys-color-primary-fixed-dim)'},
        {bg: 'var(--md-sys-color-primary)', text: 'var(--md-sys-color-on-primary)'},
        {bg: 'var(--md-sys-color-surface-dim)', text: 'var(--md-sys-color-primary)'},
        {bg: 'var(--md-sys-color-tertiary)', text: 'var(--md-sys-color-on-tertiary)'},
        {bg: 'var(--md-sys-color-secondary)', text: 'var(--md-sys-color-on-secondary)'},
        {bg: 'var(--md-sys-color-on-primary-fixed)', text: 'var(--md-sys-color-primary-fixed)'},
        {bg: 'var(--md-sys-color-on-tertiary-container)', text: 'var(--md-sys-color-tertiary-container)'},
      ]
    }
  },
  computed: {
    courseData() {
      let course2color = {}
      let paletteIndex = 0
      const getBackgroundColor = (course) => {
        course = course.split('@')[0]
        if(course2color[course]){
          return course2color[course];
        }
        const colorObj = this.allPalette[paletteIndex % this.allPalette.length];
        course2color[course] = {
          backgroundColor: colorObj.bg,
          textColor: colorObj.text
        };
        paletteIndex++;
        if (paletteIndex >= this.allPalette.length) {
          paletteIndex = 0
        }
        return course2color[course];
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
              background: item === '' ? {backgroundColor: `none`, textColor: `none` } : getBackgroundColor(item)
            })
          }
          if (item === (listMerge[i][index - 1] || {}).name && item) {
            const sameIndex = (listMerge[i][index - 1] || {}).sameIndex
            if (sameIndex || sameIndex === 0) {
              listMerge[i][sameIndex].length++
              return listMerge[i].push({name: item, length: 0, sameIndex: sameIndex,background: item === '' ? {backgroundColor: `none`, textColor: `none` } : getBackgroundColor(item)})
            }
            listMerge[i][index - 1].length++
            return listMerge[i].push({name: item, length: 0, sameIndex: index - 1,background: item === '' ? {backgroundColor: `none`, textColor: `none` } : getBackgroundColor(item)})
          } else {
            return listMerge[i].push({
              name: item,
              length: 1,
              background: item === '' ? {backgroundColor: `none`, textColor: `none` } : getBackgroundColor(item)
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
  //background: white;
  //border: 1px solid #E4E7ED;
  //border-radius: 8rpx;

  $basewidth: calc(100vw - sx(12));
  $itemwidth: calc($basewidth / 7);
  $time-item-height: sx(18);

  .header {
    background-color: var(--md-sys-color-secondary-container);
    width: $basewidth;
    padding-left: sx(12);
    height: sx(8);
    display: flex;
    align-items: center;
    border-bottom: max(sx(0.25), 0.5px) dashed var(--md-sys-color-outline);

    .header-item {
      height: 100%;
      width: $itemwidth;
      font-size: sx(2.5);
      text-align: center;
    }
  }

  .main {
    background-color: var(--md-sys-color-primary-container);
    position: relative;
    height: calc(100vh - var(--status-bar-height) - sx(30));

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
        border-bottom: max(sx(0.25), 0.5px) dashed var(--md-sys-color-outline);
      }

      .time-item {
        height: 100%;
        width: sx(12);
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: sx(2.5);
        color: var(--md-sys-color-secondary);

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
          word-break: break-all;
          color: white;
          // overflow: hidden;

          .course {
            white-space: normal;
            border-radius: sx(2.5);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            overflow: hidden;
            width: 100%;
            font-size: sx(2.5);
            position: relative;
            padding: sx(2.5);
            box-sizing: border-box;
            /* 为加号定位提供基准 */
          }

          .plus-icon {
            position: absolute;
            top: sx(1);
            right: sx(1);
            //width: 32rpx;
            //height: 32rpx;
            //border-radius: 50%;
            //display: flex;
            //align-items: center;
            //justify-content: center;
            //font-size: 40rpx;
          }
        }
      }
    }
    .other {
      min-height: sx(30);
      width: 100vw;
      height: calc(100% - $time-item-height*11);
      color: var(--md-sys-color-on-primary-container);
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;
      white-space: normal;
      word-break: break-all;
      padding: sx(2.5);
      box-sizing: border-box;
      .text{
        margin-top: sx(2.5);
        &:first-child{
          margin-top: sx(0);
        }
        &:last-child{
          margin-bottom: sx(0);
        }
      }
    }
  }
}
</style>
