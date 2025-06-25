<template>
  <uni-popup ref="dateRangePicker">
    <view class="mdrp__panel dropdown-menu show-calendar">
      <view class="wrapper">
        <view class="edit">
          <text class="time-range">{{ startText }} - {{ endText }}</text>
          <material-button
              type="text"
              size="small"
              fontColor="#000"
              color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250"
              @click="handleButtonClick"
              v-show="true"
          >
            test
          </material-button>
        </view>
        <view class="calendar-wrap">
          <calendar
              location="left"
              :calendar-month="leftCalendarMonth_"
              :locale="locale"
              :start="start_"
              :end="end_"
              @clickNextMonth="clickNextMonth"
              @clickPrevMonth="clickPrevMonth"
              @dateClick="dateClick"
              @clickYearSelect="clickYearSelect"
              @clickApply="clickApply"
              @clickCancel="cancel"
          ></calendar>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
import moment from 'moment';
import Calendar from './Calendar.vue';
import CalendarRanges from './Ranges.vue';
import DefaultActivator from './widgets/activator.vue';
import { defaultPresets } from '../constant';
import UniPopup from "@/uni_modules/uni-popup/components/uni-popup/uni-popup.vue";
import materialButton from "@/components/material-uni/material-button/material-button.vue";

export default {
  name: 'v-md-date-range-picker',
  components: { UniPopup, Calendar, CalendarRanges, DefaultActivator, materialButton },
  provide () {
    return {
      'picker': this,
    };
  },
  props: {
    startDate: {
      type: String,
      default: moment().format('YYYY-MM-DD'),
    },
    endDate: {
      type: String,
      default: moment().format('YYYY-MM-DD'),
    },
    presets: {
      type: Array,
      default () {
        return defaultPresets;
      },
    },
    opens: {
      type: String,
      default: 'left',
    },
    showCustomRangeLabel: {
      type: Boolean,
      default: false,
    },
    showYearSelect: {
      type: Boolean,
      default: false,
    },
    minYear: {
      type: String,
      default: moment().subtract(100, 'year').format('YYYY'),
    },
    maxYear: {
      type: String,
      default: moment().add(100, 'year').format('YYYY'),
    },
    autoApply: {
      type: Boolean,
      default: true,
    },
    showActivatorLabel: {
      type: Boolean,
      default: true,
    },
    showActivatorBar: {
      type: Boolean,
      default: true,
    },
    showPresets: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      locale: {
        direction: 'ltr',
        format: moment.localeData().longDateFormat('L'),
        separator: ' - ',
        applyLabel: 'Apply',
        cancelLabel: 'Cancel',
        weekLabel: 'W',
        customRangeLabel: 'Custom Range',
        daysOfWeek: [],
        monthNames: moment.monthsShort(),
        firstDay: moment.localeData().firstDayOfWeek(),
      },
      leftCalendarMonth_: null,
      rightCalendarMonth_: null,
      start_: null,
      end_: null,
      hoverStart_: null,
      hoverEnd_: null,
      cloneStart: null,
      cloneEnd: null,
      startText: 'YYYY-MM-DD',
      endText: 'YYYY-MM-DD',
      inRange: false,
      pickerVisible: false,
    };
  },
  created() {
    this.locale.daysOfWeek = this.rotateDaysOfWeek(moment.weekdaysMin(), this.locale.firstDay);
  },
  methods: {
    rotateDaysOfWeek(daysOfWeek, firstDay) {
      return daysOfWeek.slice(firstDay).concat(daysOfWeek.slice(0, firstDay));
    },
    initializeDates() {
      this.leftCalendarMonth_ = moment(this.startDate);
      this.rightCalendarMonth_ = moment(this.endDate).add(1, 'month');
      this.start_ = moment(this.startDate);
      this.end_ = moment(this.endDate);
      this.cloneStart = this.start_.clone();
      this.cloneEnd = this.end_.clone();
      this.updateTextField();
    },
    clickYearSelect ({ location, calendarMonth }) {
      this.safeSetDate(`${location}CalendarMonth_`, calendarMonth);
    },
    clickNextMonth () {
      this.safeSetDate('leftCalendarMonth_', this.leftCalendarMonth_.add(1, 'month'));
    },
    clickPrevMonth () {
      this.safeSetDate('leftCalendarMonth_', this.leftCalendarMonth_.subtract(1, 'month'));
    },
    dateClick (value) {
      if (this.inRange) {
        this.inRange = false;
        if (value.isBefore(this.start_)) {
          this.end_ = this.start_;
          this.start_ = value.clone();
        } else {
          this.end_ = value.clone();
        }
        if (this.autoApply) this.clickApply();
      } else {
        this.inRange = true;
        this.start_ = value.clone();
        this.end_ = value.clone();
      }
    },
    open() {
      this.$refs.dateRangePicker.open("center");
      this.initializeDates();
      this.resetDates();
    },
    resetDates() {
      this.start_ = null;
      this.end_ = null;
      this.startText = 'YYYY-MM-DD';
      this.endText = 'YYYY-MM-DD';
    },
    togglePicker () {
      let elm = this.$refs.defaultActivator && this.$refs.defaultActivator.$el;
      const slotActivator = this.$slots.input?.[0]?.elm;
      if (!elm && slotActivator && (slotActivator.querySelector('input') || slotActivator.querySelector('button'))) {
        elm = slotActivator;
      }

      this.pickerVisible = !!elm || !this.pickerVisible;
    },
    handleButtonClick() {
      console.log('Button clicked');
    },
    cancel () {
      this.inRange = false;
      this.$refs.dateRangePicker.close();
    },
    clickApply () {
      this.pickerVisible = false;
      this.updateTextField();
      this.cloneForCancelUsage();
      this.emitChange();
      this.$refs.dateRangePicker.close();
    },
    clickPreset (preset) {
      if (preset.label === this.locale.customRangeLabel) return;
      this.start_ = moment(preset.range[0]);
      this.end_ = moment(preset.range[1]);
      this.leftCalendarMonth_ = moment(preset.range[0]);
      if (this.autoApply) this.clickApply();
    },
    updateTextField () {
      if (!this.$slots.input) {
        this.startText = this.start_?.format(this.locale.format) || 'YYYY-MM-DD';
        this.endText = this.end_?.format(this.locale.format) || 'YYYY-MM-DD';
      }
    },
    cloneForCancelUsage () {
      if (this.start_ && this.end_) {
        this.cloneStart = this.start_.clone();
        this.cloneEnd = this.end_.clone();
      }
    },
    emitChange () {
      if (this.start_ && this.end_) {
        const start = this.start_.clone();
        const end = this.end_.clone();
        this.$emit('change', [start, end], [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')]);
      }
    },
    clickOutside () {
      if (this.pickerVisible) this.clickApply();
    },
    safeSetDate(location, date) {
      try {
        this[location] = date.clone();
      } catch (error) {
        console.error(`Error setting date in ${location}:`, error);
      }
    },
  },
  watch: {
    start_ (newValue) {
      if (!newValue || newValue.month() === this.end_?.month()) return;
      this.safeSetDate('leftCalendarMonth_', newValue);
    },
    end_ (newValue) {
      if (!newValue) return;
      this.updateTextField();
    },
    startDate (newValue) {
      this.safeSetDate('start_', moment(newValue));
      this.startText = moment(newValue).format(this.locale.format);
      this.safeSetDate('cloneStart', moment(newValue));
    },
    endDate (newValue) {
      this.safeSetDate('end_', moment(newValue));
      this.endText = moment(newValue).format(this.locale.format);
      this.safeSetDate('cloneEnd', moment(newValue));
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/components/picker';

.button_wrap {
  width: fit-content;
  margin-left: auto;
}
</style>