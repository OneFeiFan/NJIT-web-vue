<template>
  <uni-popup ref="CourseDialog" mask-background-color="#ffffff00" @change="maskChange">
    <material-card color="var(--md-sys-color-on-surface)" @click.stop>
      <view class="dialog-card">
        <!-- A. 多课程切换区 (冲突时显示) -->
        <view v-if="hasConflict" class="conflict-tabs">
          <scroll-view class="tabs-scroll" scroll-x="true" show-scrollbar="false">
            <view class="tabs-container">
              <material-button v-for="(c, index) in courses" :key="index"
                               :background-color="currentIndex === index ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-variant)'"
                               :color="currentIndex === index ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)'"
                               shape="square" size="small" @click="switchCourse(index)">
                <!-- 截断过长的课程名 -->
                {{ formatName(c.name) }}
              </material-button>
            </view>
          </scroll-view>
        </view>

        <!-- B. 标题区 (动态显示当前选中的课程) -->
        <view class="card-header">
          <text class="title">{{ displayTitle }}</text>
          <text class="subtitle">{{ displaySubtitle }}</text>
        </view>

        <!-- C. 内容区 -->
        <view class="card-content">
          <!-- 1. 有课程数据 -->
          <view v-if="currentCourse">
            <view class="info-row">
              <uni-icons color="var(--md-sys-color-primary)" size="18" type="location-filled"></uni-icons>
              <text class="info-text">{{ currentCourse.room || '未安排地点' }}</text>
            </view>
            <view class="info-row">
              <uni-icons color="var(--md-sys-color-primary)" size="18" type="person-filled"></uni-icons>
              <text class="info-text">{{ currentCourse.teacher || '未安排教师' }}</text>
            </view>
            <view class="info-row">
              <uni-icons color="var(--md-sys-color-primary)" size="18" type="calendar-filled"></uni-icons>
              <text class="info-text">{{ currentCourse.raw_weeks || "周次未知" }}</text>
            </view>

            <material-button
                :background-color="currentCourse.source === 1 ? 'var(--md-sys-color-tertiary-container)' : 'var(--md-sys-color-secondary-container)'"
                :color="currentCourse.source === 1 ? 'var(--md-sys-color-on-tertiary-container)' : 'var(--md-sys-color-on-secondary-container)'"
                shape="square" size="small">
              {{ currentCourse.source === 1 ? '本地手动添加' : '教务系统同步' }}
            </material-button>
          </view>

          <!-- 2. 空白格子 (添加模式) -->
          <view v-else>
            <view class="empty-tip">当前时段暂无课程</view>
          </view>
        </view>

        <!-- D. 操作栏 -->
        <view v-if="mode !== 'view'">
          <!-- 添加模式 -->
          <view v-if="mode === 'add'" class="card-actions">
            <material-button background-color="var(--md-sys-color-primary)"
                             color="var(--md-sys-color-surface)" size="small" @click="$emit('add')">添加
            </material-button>
          </view>

          <!-- 编辑模式 (针对当前选中的课程) -->
          <view v-else-if="mode === 'edit' && currentCourse" class="card-actions">
            <material-button background-color="#ffffff00" color="var(--md-sys-color-error)" size="small"
                             @click="$emit('delete', currentCourse)">删除
            </material-button>
            <view class="spacer"></view>
            <material-button background-color="#ffffff00" color="var(--md-sys-color-primary)" size="small"
                             @click="$emit('add')">添加
            </material-button>
            <material-button background-color="var(--md-sys-color-primary)"
                             color="var(--md-sys-color-surface)" size="small"
                             @click="$emit('edit', currentCourse)">编辑
            </material-button>
          </view>
        </view>

        <!-- 查看模式关闭 -->
        <view v-else class="card-actions">
          <material-button background-color="#ffffff00" color="var(--md-sys-color-primary)" size="small"
                           @click="$emit('close')">确定
          </material-button>
        </view>
      </view>
    </material-card>
  </uni-popup>
</template>

<script>
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import MaterialButton from "@/components/material-uni/material-button/material-button.vue";

export default {
  name: "CourseDialog",
  components: {
    MaterialButton, MaterialCard, UniIcons
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 接收整个数组，而不仅是单个对象
    courses: {
      type: Array,
      default: () => []
    },
    // 空白格子时的默认信息
    timeInfo: {
      type: Object,
      default: () => ({
        dayInt: '',
        nodeIndex: 0
      })
    },
    mode: {
      type: String,
      default: 'view'
    }
  },
  data() {
    return {
      currentIndex: 0 // 当前查看的是第几个课程
    };
  },
  watch: {
    // 每次打开弹窗或课程列表变化时，重置为第一个
    visible(val) {
      if (val) {
        this.currentIndex = 0;
        this.$refs.CourseDialog.open("center");
      } else {
        this.$refs.CourseDialog.close();
      }
    },
    courses() {
      this.currentIndex = 0;
    }
  },
  computed: {
    hasConflict() {
      return this.courses && this.courses.length > 1;
    },
    currentCourse() {
      if (!this.courses || this.courses.length === 0) return null;
      return this.courses[this.currentIndex];
    },
    displayTitle() {
      if (this.currentCourse) return this.currentCourse.name;
      return "暂无课程";
    },
    displaySubtitle() {
      const days = ['一', '二', '三', '四', '五', '六', '日'];
      if (this.currentCourse) {
        const c = this.currentCourse;
        const day = days[c.day - 1] || '';
        const end = c.start + (c.step || 1) - 1;
        return `星期${day} 第${c.start}-${end}节`;
      } else {
        return `星期${days[this.timeInfo.dayInt]} 第${this.timeInfo.nodeIndex}节`;
      }
    }
  },
  methods: {
    maskChange(e) {
      if (!e.show) {
        this.$emit("close");
      }
    },
    switchCourse(index) {
      this.currentIndex = index;
    },
    formatName(name) {
      if (name.length > 6) return name.substring(0, 5) + '..';
      return name;
    }
  }
};
</script>

<style lang="scss" scoped>
@media (orientation: landscape) {
  .dialog-card {
    $height: calc((100vh - sx(30) - var(--status-bar-height) + sx(90)) / 2);
    max-height: calc(100vh - sx(30) - var(--status-bar-height));
    max-width: calc(100 / 90 * calc(100vh - sx(30) - var(--status-bar-height)));
    //height: $height;
    width: calc(100 / 90 * #{$height}); // 保持100:90的宽高比例
  }
}

@media (orientation: portrait) {
  .dialog-card {
    --test: 0px;
    $width: calc((90vw + sx(90)) / 2);
    max-height: calc(calc(100vw - sx(15) - var(--test)) / 90 * 100);
    max-width: calc(100vw - sx(15) - var(--test));
    //height: calc($width / 90 * 100);
    width: $width;
  }
}

.dialog-card {
  padding: sx(5);
  box-sizing: border-box;

  // 冲突切换标签栏
  .conflict-tabs {
    margin-bottom: sx(3);

    .tabs-scroll {
      width: 100%;
      white-space: nowrap;

      .tabs-container {
        display: flex;
        gap: sx(2.5);
        padding: sx(1) sx(0.5); // 给 shadow 留空间
      }
    }
  }

  .card-header {
    display: flex;
    flex-direction: column;
    margin-bottom: sx(4);

    .title {
      font-size: sx(7);
      font-weight: 600;
      margin-bottom: sx(1);
      //line-height: 1.3;
    }

    .subtitle {
      font-size: sx(4);
      color: var(--md-sys-color-primary);
      font-weight: 500;
    }
  }

  .card-content {
    margin-bottom: sx(6);
    //min-height: 80px; // 防止切换时高度跳动过大

    .info-row {
      display: flex;
      align-items: flex-start; // 图标对齐第一行
      margin-bottom: sx(3);

      .info-text {
        margin-left: sx(4);
        font-size: sx(4);
        color: var(--md-sys-color-on-surface-variant);
        //line-height: 1.4;
      }
    }

    .empty-tip {
      color: var(--md-sys-color-outline);
      text-align: center;
      margin-top: sx(6);
    }
  }

  .card-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: sx(2.5); // 间距稍微调小一点

    .spacer {
      flex: 1;
    }
  }
}
</style>