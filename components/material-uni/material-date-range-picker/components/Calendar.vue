<template>
  <table class="calendar-table">

    <thead class="header">
      <view colspan="5" class="month">
        {{ activeYear }}年{{ monthName }}
        <!-- select year start -->
<!--        <select class="yearselect" v-model="activeYear" v-if="picker.showYearSelect">-->
<!--          <option v-for="(year, index) in RangeOfYear" :value="year" :key="index">{{year}}</option>-->
<!--        </select>-->

        <!-- select year end -->
      </view>
      <view class="prev" @click="$emit('clickPrevMonth')">
        ＜
      </view>

      <view class="next" @click="$emit('clickNextMonth')">
        ＞
      </view>
    </thead>

    <view class="calendar-grid">
      <!-- 星期标题 -->
      <view
          v-for="(weekDay, dayIndex) in locale.daysOfWeek"
          :key="dayIndex"
          class="grid-header"
      >
        {{ weekDay }}
      </view>

      <!-- 日期单元格 -->
      <slot v-for="(dateRow, rowIndex) in calendar">
        <slot
            v-for="(date, dateIndex) in dateRow"
            name="date-slot"
        >
          <view
              class="grid-cell calendar-cell"
              :class="dayClass(date)"
              @click="$emit('dateClick', date)"
          >
            <view class="calendar-cell__content">
              {{ date | dateNum }}
            </view>
          </view>
        </slot>
      </slot>
    </view>
    <view class="button_wrap">
      <material-button
          type="text"
          size="small"
          fontColor="#000"
          color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250"
          @click="cancel"
      >
        取消
      </material-button>
      <material-button
          type="text"
          size="small"
          fontColor="#000"
          color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250"
          @click="clickApply"
          :disabled="isDisable"
      >
        确定
      </material-button>
    </view>
  </table>
</template>

<script>
import moment from 'moment';
import materialButton from "@/components/material-uni/material-button/material-button.vue";

function clean(momentDate) {
  if (momentDate !== null && momentDate.isValid()) {
    return momentDate.clone().hour(0).minute(0).second(0).millisecond(0);
  } else {
    // console.error('Invalid date provided:', momentDate);
    return null;
  }
}

function range(start = 0, end, step = 1) {
  const arr = [];
  start = +start;
  end = +end;
  for (let i = start; i <= end; i += step) {
    arr.push(i);
  }
  return arr;
}

export default {
  name: 'calendar',
  components: {materialButton},
  inject: ['picker'],
  props: {
    location: String,
    calendarMonth: moment,
    locale: Object,
    start: moment,
    end: moment,
  },
  methods: {
    cancel(e){
      this.$emit('clickCancel');
    },
    clickApply(e){
      this.$emit('clickApply');
    },
    dayClass(date) {
      const dt = date.clone();
      const cleanDt = clean(dt);
      const cleanToday = clean(moment());
      const cleanStart = clean(this.start);
      const cleanEnd = clean(this.end);

      return {
        off: dt.month() !== this.month,
        weekend: dt.isoWeekday() > 5,
        today: cleanDt.isSame(cleanToday),
        active: cleanDt.isSame(cleanStart) || cleanDt.isSame(cleanEnd),
        'in-range': (dt >= cleanStart && dt <= cleanEnd) ,
        'start-date': cleanDt.isSame(cleanStart),
        'end-date': cleanDt.isSame(cleanEnd),
      };
    },
  },
  computed: {
    isDisable(){
      return !(this.start!==null&&this.end!==null);
    },
    arrowLeftClass() {
      return 'arrow-left v-drp__css-icon';
    },
    arrowRightClass() {
      return 'arrow-right v-drp__css-icon';
    },
    month() {
      return this.calendarMonth.month();
    },
    monthName() {
      return this.locale.monthNames[this.month];
    },
    year() {
      return this.calendarMonth.year();
    },
    calendar() {
      if (!this.calendarMonth.isValid()) {
        console.error('Invalid calendarMonth provided:', this.calendarMonth);
        return [];
      }

      const calendarMonth = this.calendarMonth;
      const month = calendarMonth.month();
      const year = calendarMonth.year();
      const hour = calendarMonth.hour();
      const minute = calendarMonth.minute();
      const second = calendarMonth.second();
      const daysInMonth = moment([year, month]).daysInMonth();
      const firstDay = moment([year, month, 1]);
      const lastDay = moment([year, month, daysInMonth]);
      const lastMonth = moment(firstDay).subtract(1, 'month').month();
      const lastYear = moment(firstDay).subtract(1, 'month').year();
      const daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
      const dayOfWeek = firstDay.day();

      const calendar = [];
      calendar.firstDay = firstDay;
      calendar.lastDay = lastDay;

      for (let i = 0; i < 6; i++) {
        calendar[i] = [];
      }

      // 确定 6 * 7 日历中的第一天
      let startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
      if (startDay > daysInLastMonth) { startDay -= 7; }
      if (dayOfWeek === this.locale.firstDay) { startDay = daysInLastMonth - 6; }

      let curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);

      for (let i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = curDate.clone().add(24, 'hour')) {
        if (i > 0 && col % 7 === 0) {
          col = 0;
          row++;
        }
        calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
      }

      return calendar;
    },
    RangeOfYear() {
      if (!this.picker.showYearSelect) return [];

      const picker = this.picker;
      const maxYear = (picker.maxDate && picker.maxDate.year()) || picker.maxYear;
      const minYear = (picker.minDate && picker.minDate.year()) || picker.minYear;
      return range(minYear, maxYear, 1);
    },
    activeYear: {
      get() {
        return this.calendarMonth.year();
      },
      set(newYear) {
        if (!newYear) {
          console.error('Invalid newYear provided:', newYear);
          return;
        }

        const calendarMonth = moment([newYear, this.month]);
        if (!calendarMonth.isValid()) {
          console.error('Invalid calendarMonth created with newYear:', newYear);
          return;
        }

        this.$emit('clickYearSelect', {
          location: this.location,
          calendarMonth,
        });
      },
    },
  },
  filters: {
    dateNum(value) {
      if (!value.isValid()) {
        console.error('Invalid date provided to dateNum filter:', value);
        return '';
      }
      return value.date();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/components/calendar';
</style>
