<template>
  <view class="mask" v-if="visible" @click="$emit('close')">
    <material-card class="card" @click.stop>
      
      <!-- 标题栏 -->
      <view class="header">
        <text class="title">已隐藏课程 ({{ list.length }})</text>
      </view>

      <!-- 列表区域 -->
      <scroll-view scroll-y="true" class="list-container" v-if="list.length > 0">
        <view class="course-item" v-for="(item, index) in list" :key="item.id + index">
          
          <!-- 左侧信息 -->
          <view class="info">
            <text class="course-name">{{ item.name }}</text>
            <view class="sub-info">
              <uni-icons type="person" size="12" color="var(--md-sys-color-outline)"></uni-icons>
              <text class="text">{{ item.teacher || '无教师' }}</text>
              <view class="dot"></view>
              <uni-icons type="calendar" size="12" color="var(--md-sys-color-outline)"></uni-icons>
              <!-- 关键：显示时间，帮用户回忆 -->
              <text class="text">{{ formatTime(item) }}</text>
            </view>
          </view>

          <material-button
              size="small"
              shape="square"
              font-color="var(--md-sys-color-on-primary-container)"
              background-color="var(--md-sys-color-primary-container)"
              @click="handleRestore(item)">恢复</material-button>

        </view>
      </scroll-view>

      <!-- 空状态 -->
      <view class="empty-state" v-else>
        <uni-icons type="checkbox-filled" size="48" color="var(--md-sys-color-surface-variant)"></uni-icons>
        <text class="empty-text">没有被隐藏的课程</text>
      </view>

    </material-card>
  </view>
</template>

<script>
import { getTheme } from "@/components/material-uni/colors";
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import MaterialButton from "@/components/material-uni/material-button/material-button.vue";

export default {
  components: {MaterialButton, MaterialCard, UniIcons },
  props: {
    visible: { type: Boolean, default: false },
    list: { type: Array, default: () => [] } // 接收所有 hiddenCourses
  },
  methods: {
    getTheme,
    
    formatTime(item) {
      const days = ['周一','周二','周三','周四','周五','周六','周日'];
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

<style scoped lang="scss">
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (orientation: landscape) {
  .card {
    $height: calc((100vh - sx(30) - var(--status-bar-height) + sx(90)) / 2);
    max-height: calc(100vh - sx(30) - var(--status-bar-height));
    max-width: calc(100 / 90 * calc(100vh - sx(30) - var(--status-bar-height)));
    height: $height;
    width: calc(100 / 90 * #{$height}); // 保持100:90的宽高比例
  }
}
@media (orientation: portrait) {
  .card {
    --test: 0px;
    $width: calc((90vw + sx(90)) / 2);
    max-height: calc(calc(100vw - sx(15) - var(--test)) / 90 * 100);
    max-width: calc(100vw - sx(15) - var(--test));
    height: calc($width / 90 * 100);
    width: $width;
  }
}
.card {
  padding: sx(5);
  border-radius: sx(3.5);
  display: flex;
  flex-direction: column;
  transform: scale(0.95);
  transition: all 0.25s cubic-bezier(0.2, 0, 0.2, 1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: sx(4);
  
  .title {
    font-size: sx(6);
    font-weight: 600;
    color: var(--md-sys-color-on-surface);
  }
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