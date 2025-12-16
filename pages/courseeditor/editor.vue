<template>
  <view class="editor-container" :style="themeStyle+SXData">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons type="left" size="" @click="back" color="var(--md-sys-color-on-primary)"
                   class="icon-left"/>
        <text class="title">编辑课程</text>
        <uni-icons type="loop" size="" color="#ffffff00" class="icon-right"/>
      </view>
    </material-nav-bar>
    <view class="content">
      <!-- 1. 基础信息卡片 -->
      <material-card color="var(--md-sys-color-on-surface)">
        <material-list class="card form-item" color="var(--md-sys-color-on-surface)">
          <material-list-cell :show-left-text="false">
            <view class="form-item">
              <text class="label">课程名称</text>
              <input class="input" v-model="form.name" placeholder="请输入课程名称"/>
            </view>
          </material-list-cell>
          <material-list-cell :show-left-text="false">
            <view class="form-item">
              <text class="label">任课教师</text>
              <input class="input" v-model="form.teacher" placeholder="教师姓名 (可选)"/>
            </view>
          </material-list-cell>
          <material-list-cell :show-left-text="false">
            <view class="form-item">
              <text class="label">上课地点</text>
              <input class="input" v-model="form.room" placeholder="教室/地点 (可选)"/>
            </view>
          </material-list-cell>
        </material-list>
      </material-card>

      <!-- 2. 时间选择卡片 -->
      <view class="section-header">时间安排</view>
      <material-card class="picker-group" color="var(--md-sys-color-on-surface)">
        <material-list class="card" color="var(--md-sys-color-on-surface)">
          <material-list-cell :show-left-text="false">
            <!-- 星期选择 -->
            <picker mode="selector" :range="days" @change="onDayChange" :value="form.day - 1" style="width: 100%;">
              <view class="picker-row">
                <text class="picker-label">星期</text>
                <view class="picker-value">
                  {{ days[form.day - 1] }}
                  <uni-icons type="right" size="14" color="var(--md-sys-color-outline)"></uni-icons>
                </view>
              </view>
            </picker>
          </material-list-cell>

          <material-list-cell :show-left-text="false">
            <!-- 开始节次 -->
            <picker mode="selector" :range="nodes" @change="onStartChange" :value="form.start - 1" style="width: 100%;">
              <view class="picker-row">
                <text class="picker-label">开始节次</text>
                <view class="picker-value">
                  第 {{ form.start }} 节
                  <uni-icons type="right" size="14" color="var(--md-sys-color-outline)"></uni-icons>
                </view>
              </view>
            </picker>
          </material-list-cell>

          <material-list-cell :show-left-text="false">
            <!-- 持续节数 -->
            <picker mode="selector" :range="steps" @change="onStepChange" :value="form.step - 1" style="width: 100%;">
              <view class="picker-row">
                <text class="picker-label">持续时长</text>
                <view class="picker-value">
                  {{ form.step }} 节
                  <uni-icons type="right" size="14" color="var(--md-sys-color-outline)"></uni-icons>
                </view>
              </view>
            </picker>
          </material-list-cell>
        </material-list>
      </material-card>

      <!-- 3. 周次选择卡片 -->
      <view class="section-header row-between">
        <text>上课周次</text>
        <!-- 快速操作工具栏 -->
        <view class="quick-tools">
          <material-button
              size="small"
              shape="square"
              color="var(--md-sys-color-on-surface-variant)"
              background-color="var(--md-sys-color-surface-container-high)"
              @click="setWeeks('all')">
            全选
          </material-button>
          <material-button
              size="small"
              shape="square"
              color="var(--md-sys-color-on-surface-variant)"
              background-color="var(--md-sys-color-surface-container-high)"
              @click="setWeeks('odd')">
            单周
          </material-button>
          <material-button
              size="small"
              shape="square"
              color="var(--md-sys-color-on-surface-variant)"
              background-color="var(--md-sys-color-surface-container-high)"
              @click="setWeeks('even')">
            双周
          </material-button>
          <material-button
              size="small"
              shape="square"
              color="var(--md-sys-color-error)"
              background-color="var(--md-sys-color-error-container)"
              @click="setWeeks('clear')">
            清空
          </material-button>
        </view>
      </view>

      <material-card class="week-card" color="var(--md-sys-color-on-surface)">
        <view class="card  week-grid">
          <view v-for="i in 19" :key="i" class="week-item" :class="{ active: form.weeks.includes(i) }"
                @click="toggleWeek(i)">
            <text class="week-num">{{ i }}</text>
          </view>
        </view>
      </material-card>
      <material-button
          class="save-btn"
          size="medium"
          color="var(--md-sys-color-on-primary)"
          background-color="var(--md-sys-color-primary)"
          @click="submit">
        保存课程
      </material-button>
    </view>
  </view>
</template>

<script>
//#ifdef H5
import {http} from "@/static/util/request";
//#endif
import {SXData} from "@/components/material-uni/sx";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import MaterialButton from "@/components/material-uni/material-button/material-button.vue";

export default {
  components: {
    MaterialButton, MaterialList, MaterialListCell, MaterialCard, MaterialNavBar
  },
  computed: {
    SXData() {
      return SXData
    },
    steps() {
      const maxAvailable = 11 - this.form.start + 1; // 最大可安排节数
      return Array.from({
        length: Math.min(8, maxAvailable) // 保持最多8节但不超过可用节数
      }, (_, i) => `${i + 1} 节`);
    },
  },
  data() {
    return {
      // 基础数据源
      days: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      nodes: Array.from({
        length: 11
      }, (_, i) => `第 ${i + 1} 节`),
      // steps: Array.from({
      //   length: 8
      // }, (_, i) => `${i + 1} 节`), // 1-4节

      // 表单数据
      form: {
        id: "",
        name: "",
        teacher: "",
        room: "",
        day: 1, // 默认周一
        start: 1, // 默认第1节
        step: 2, // 默认2节
        weeks: [], // 默认不选
        source: 1 // 1=本地
      },

      // 编辑模式下的原始数据记录
      originalId: "",
      originalSource: 0,
      originalDay: 0, // 记录修改前的星期
      originalStart: 0 // 记录修改前的开始节次
    };
  },
  onLoad(options) {
    if (options.mode === 'create') {
    } else if (options.course) {
      // 2. 编辑模式
      try {
        const course = JSON.parse(decodeURIComponent(options.course));

        this.originalId = course.id;
        this.originalSource = course.source;
        this.originalDay = course.day;
        this.originalStart = course.start;
        // 复制数据
        this.form = {
          ...this.form, // 保底
          ...course,
          // 兼容后端可能传回的字段名差异
          weeks: course.weekList || course.weeks || []
        };

        // 如果是编辑系统课程，准备转为本地课程
        if (course.source === 0) {
          this.form.id = ""; // 清空ID，准备生成新UUID
          this.form.source = 1;
        }
      } catch (e) {
        console.error("解析课程数据失败", e);
      }
    }
  },
  methods: {
    // Picker 事件
    onDayChange(e) {
      this.form.day = e.detail.value + 1;
    },
    onStartChange(e) {
      this.form.start = e.detail.value + 1;
    },
    onStepChange(e) {
      this.form.step = e.detail.value + 1;
    },

    // 周次选择逻辑
    toggleWeek(i) {
      const index = this.form.weeks.indexOf(i);
      if (index > -1) {
        this.form.weeks.splice(index, 1);
      } else {
        this.form.weeks.push(i);
      }
      // 保持有序，方便查看
      this.form.weeks.sort((a, b) => a - b);
    },

    setWeeks(type) {
      if (type === 'clear') {
        this.form.weeks = [];
        return;
      }

      let newWeeks = [];
      for (let i = 1; i <= 19; i++) { // 假设最大20周
        if (type === 'all') newWeeks.push(i);
        else if (type === 'odd' && i % 2 !== 0) newWeeks.push(i);
        else if (type === 'even' && i % 2 === 0) newWeeks.push(i);
      }
      this.form.weeks = newWeeks;
    },
    generateRawWeeks(weeks) {
      if (!weeks || weeks.length === 0) return "";

      // 1. 排序
      const sorted = [...weeks].sort((a, b) => a - b);
      const result = [];
      let start = sorted[0];
      let prev = sorted[0];

      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] === prev + 1) {
          // 连续，继续
          prev = sorted[i];
        } else {
          // 断开，结算上一段
          if (start === prev) {
            result.push(`${start}`);
          } else {
            result.push(`${start}-${prev}`);
          }
          // 开启新一段
          start = sorted[i];
          prev = sorted[i];
        }
      }
      // 结算最后一段
      if (start === prev) {
        result.push(`${start}`);
      } else {
        result.push(`${start}-${prev}`);
      }
      console.log(weeks, result)
      return result.join(',') + "周"; // 生成如 "1-3,5周"
    },

    // 提交逻辑
    submit() {
      // 校验
      if (!this.form.name.trim()) {
        return uni.showToast({
          title: '请填写课程名称',
          icon: 'none'
        });
      }
      if (this.form.weeks.length === 0) {
        return uni.showToast({
          title: '请至少选择一周',
          icon: 'none'
        });
      }
      if (this.form.teacher.length === 0) {
        this.form.teacher = "未安排教师"
      }
      if (this.form.room.length === 0) {
        this.form.room = "未安排地点";
      }
      this.form.raw_weeks = this.generateRawWeeks(this.form.weeks);
      const maxStep = 11 - this.form.start + 1;
      // 如果当前节数超过新start的可用范围，自动截断
      if (this.form.step > maxStep) {
        this.form.step = maxStep;
      }
      let hideRule = null;
      // 只有当是编辑系统课程(source=0)且有ID时，才需要生成屏蔽规则
      if (this.originalSource === 0 && this.originalId) {
        hideRule = {
          id: this.originalId, // 屏蔽的课程ID
          day: this.originalDay, // 必须匹配的星期
          start: this.originalStart // 必须匹配的开始节次
        };
      }
      // 构造 Payload
      const payload = {
        course: JSON.stringify(this.form),
        // 如果是编辑系统课程，需要通知后端隐藏旧ID
        // hideId: (this.originalSource === 0 && this.originalId) ? this.originalId : null,
      };
      if (hideRule !== null) {
        payload.hideRule = JSON.stringify(hideRule)
      }

      //#ifdef APP-PLUS
      let result = this.$manager.saveCourse(payload)
      if(Object.keys(result).length > 0 && result.code === 200){
          uni.showToast({
            title: '保存成功'
          });
          setTimeout(() => {
            uni.navigateBack();
            uni.$emit('refreshTimetable'); // 通知上级页面刷新数据
          }, 800);
      }else{
        console.error("保存失败", result);
        uni.showToast({
          title: '失败'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 800);
      }
      //#endif

      // #ifdef H5
      http.post("/course/save", payload).then(res => {
        uni.showToast({
          title: '保存成功'
        });
        setTimeout(() => {
          uni.navigateBack();
          uni.$emit('refreshTimetable'); // 通知上级页面刷新数据
        }, 800);
      }).catch(res => {
        console.error("保存失败", res);
        uni.showToast({
          title: '失败'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 800);
      })
      // #endif
    },
    back() {
      uni.navigateBack();
    },
  }
};
</script>

<style scoped lang="scss">
.content {
  padding: sx(5);
}

.editor-container {
  background-color: var(--md-sys-color-surface);
  box-sizing: border-box;

  .section-header {
    color: var(--md-sys-color-primary);
    font-weight: 500;
    margin: sx(6) sx(1) sx(2);

    &.row-between {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  // 通用卡片样式
  .card {
    box-sizing: border-box;
    padding: sx(4);
    overflow: hidden;
  }

  // 表单项
  .form-item {
    width: 100%;

    .label {
      font-size: sx(4);
      margin-bottom: sx(1);
      display: block;
    }

    .input {
      font-size: sx(4);
    }
  }

  // Picker 样式
  .picker-group {
    //padding: 0; // 去除卡片默认内边距，由 row 自己控制

    .picker-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      //padding: 0 sx(4);
      font-size: sx(4);

      .picker-label {
        //color: var(--md-sys-color-on-surface);
      }

      .picker-value {
        color: var(--md-sys-color-primary);
        display: flex;
        align-items: center;
        gap: sx(1);
      }
    }
  }

  // 快速选择工具栏
  .quick-tools {
    display: flex;
    gap: sx(2);
  }

  // 周次网格
  .week-card {

    .week-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr); // 5列
      gap: sx(2);
      justify-items: center;

      .week-item {
        width: sx(12);
        height: sx(12);
        border-radius: 50%; // 圆形
        background-color: var(--md-sys-color-surface-variant);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;

        .week-num {
          font-size: sx(4);
          color: var(--md-sys-color-on-surface-variant);
          font-weight: 500;
        }

        // 选中状态
        &.active {
          background-color: var(--md-sys-color-primary);

          .week-num {
            color: var(--md-sys-color-on-primary);
          }
        }
      }
    }
  }

  // 保存按钮
  .save-btn {
    left: 50%;
    transform: translate(-50%);
    margin-top: sx(5);
  }
}
</style>