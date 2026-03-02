<template>
  <uni-popup ref="HiddenDialog" mask-background-color="#ffffff00" @change="maskChange">
    <material-card color="var(--md-sys-color-on-surface)" @click.stop>
      <view class="card">
        <!-- 标题栏 -->
        <view class="header">
          <text class="title">已隐藏课程 ({{ list.length }})</text>
        </view>

        <!-- 列表区域 -->
        <scroll-view v-if="list.length > 0" class="list-container" scroll-y="true">
          <view v-for="(item, index) in list" :key="item.id + index" class="course-item">

            <!-- 左侧信息 -->
            <view class="info">
              <text class="course-name">{{ item.name }}</text>
              <view class="sub-info">
                <uni-icons color="var(--md-sys-color-outline)" size="12" type="person"></uni-icons>
                <text class="text">{{ item.teacher || '无教师' }}</text>
                <view class="dot"></view>
                <uni-icons color="var(--md-sys-color-outline)" size="12" type="calendar"></uni-icons>
                <!-- 关键：显示时间，帮用户回忆 -->
                <text class="text">{{ formatTime(item) }}</text>
              </view>
            </view>

            <material-button background-color="var(--md-sys-color-primary-container)"
                             color="var(--md-sys-color-on-primary-container)" shape="square" size="small"
                             @click="handleRestore(item)">恢复
            </material-button>

          </view>
        </scroll-view>

        <!-- 空状态 -->
        <view v-else class="empty-state">
          <uni-icons color="var(--md-sys-color-surface-variant)" size="48" type="checkbox-filled"></uni-icons>
          <text class="empty-text">没有被隐藏的课程</text>
        </view>
      </view>
    </material-card>
  </uni-popup>
</template>

<script>
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import MaterialButton from "@/components/material-uni/material-button/material-button.vue";

export default {
  components: {
    MaterialButton,
    MaterialCard
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    } // 接收所有 hiddenCourses
  },
  watch: {
    visible(val) {
      if (val) {
        this.$refs.HiddenDialog.open("center");
      } else {
        this.$refs.HiddenDialog.close();
      }
    }
  },
  methods: {
    maskChange(e) {
      if (!e.show) {
        this.$emit("close");
      }
    },
    formatTime(item) {
      const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      const dayStr = days[item.day - 1] || '未知';
      // 假设 step 默认为1，如果有step字段更好
      const endNode = item.start + (item.step || 1) - 1;
      return `${dayStr} ${item.start}-${endNode}节`;
    },

    handleRestore(item) {
      this.$emit('restore', item);
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  padding: sx(5);
  box-sizing: border-box;
  height: sx(110);
  width: sx(100);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: sx(4);

  .title {
    font-size: sx(6);
    font-weight: 600;
  }
}

.list-container {
  flex: 1;
  overflow: hidden;
}

.course-item {
  background-color: var(--md-sys-color-surface-container-low);
  padding: sx(3) sx(4);
  border-radius: sx(3);
  margin-bottom: sx(3);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .info {
    //flex: 1;
    //margin-right: 12px;

    .course-name {
      font-size: sx(4);
      font-weight: 500;
      color: var(--md-sys-color-on-surface);
      margin-bottom: sx(1);
      display: block;
    }

    .sub-info {
      display: flex;
      align-items: center;
      gap: sx(1);

      .text {
        font-size: sx(3.5);
        color: var(--md-sys-color-outline);
      }

      .dot {
        width: sx(1);
        height: sx(1);
        border-radius: 50%;
        background-color: var(--md-sys-color-outline);
        //margin: 0 2px;
      }
    }
  }
}

.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: sx(5);

  .empty-text {
    color: var(--md-sys-color-outline);
    font-size: sx(4.5);
  }
}
</style>