<template>
  <view class="mint-swipe">
    <!-- 轮播内容区域 -->
    <view v-if="$slots.default"
          class="mint-swipe-items-wrap"
          @touchstart="dragStart"
          @touchmove="dragMove"
          @touchend="dragEnd"
          :style="transitionStyle"
    >
      <slot></slot>
    </view>
    <view v-else class="empty-tip">暂无内容</view>
  </view>
</template>

<script>
import {mxValue} from "@/components/material-uni/sx";

export default {
  name: 'mt-swipe',
  props: {
    defaultIndex: {type: Number, default: 0},
    disabled: Boolean,
    continuous: {type: Boolean, default: true}
  },
  data() {
    return {
      currentIndex: 0,
      total: 0,
      dragStartX: 0,
      isDragging: false,
      transitionStyle: "transition: transform 0s ease;transform: translateX(0%) ",
      startY: 0, // 新增Y坐标记录
      isVerticalScroll: false, // 新增垂直滚动标志
    }
  },
  watch: {
    defaultIndex: {
      immediate: true,
      handler(val) {
        this.currentIndex = val
      }
    }
  },
  methods: {
    // 初始化轮播项
    initItems() {
      // 使用可选链操作符和空值合并
      this.total = this.$slots.default?.length || 0
      this.currentIndex = this.total > 0 ? Math.min(this.defaultIndex, this.total - 1) : 0
      this.transitionStyle = `transition: transform 0s ease;transform: translateX(${-this.currentIndex * 100}%)`
    },

    // 触摸开始
    dragStart(e) {
      if (this.disabled) return
      this.dragStartX = e.touches[0].pageX
      this.startY = e.touches[0].pageY // 记录起始Y坐标
      this.isDragging = true
      this.isVerticalScroll = false // 重置标志
    },
    // 触摸移动
    dragMove(e) {
      if (!this.isDragging && !this.isVerticalScroll) return

      // 计算XY轴移动距离
      const deltaX = e.touches[0].pageX - this.dragStartX
      const deltaY = e.touches[0].pageY - this.startY

      // 首次移动时判断滑动方向
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        this.isVerticalScroll = true
        this.isDragging = false
      }
      e.preventDefault() // 阻止水平滑动时的默认行为
    },

    // 触摸结束
    dragEnd(e) {
      this.isVerticalScroll = false;
      if(this.isDragging == false){
        return
      }
      const deltaX = e.changedTouches[0].pageX - this.dragStartX
      const deltaY = e.changedTouches[0].pageY - this.startY
      if (Math.abs(deltaX) > mxValue(15.5) && Math.abs(deltaX) > Math.abs(deltaY)) {
        deltaX > 0 ? this.prev() : this.next()
      }
      this.isDragging = false
    },

    // 上一页
    prev() {
      if (this.total <= 1) return
      const newIndex = this.currentIndex > 0
          ? this.currentIndex - 1
          : (this.continuous ? this.total - 1 : 0)
      this.switchTo(newIndex)
    },

    // 下一页
    next() {
      if (this.total <= 1) return
      const newIndex = this.currentIndex < this.total - 1
          ? this.currentIndex + 1
          : (this.continuous ? 0 : this.total - 1)
      this.switchTo(newIndex)
    },

    // 跳转到指定页
    goto(index) {
      if (index < 0 || index >= this.total) return
      this.switchTo(index)
    },

    // 执行切换
    switchTo(newIndex) {
      if (this.currentIndex === newIndex) return
      const oldIndex = this.currentIndex
      // 处理边界情况
      if (newIndex === 0 && oldIndex === this.total - 1) {
        this.currentIndex = 0
        this.transitionStyle = `transition:transform 0s ease;transform: translateX( ${-this.currentIndex * 100}%)`
      } else if (newIndex === this.total - 1 && oldIndex === 0) {
        this.immediateTransition = true
        this.currentIndex = this.total - 1
        this.transitionStyle = `transition:transform 0s ease;transform: translateX( ${-this.currentIndex * 100}%)`
      } else {
        this.currentIndex = newIndex
        this.transitionStyle = `transition:transform 0.3s ease;transform: translateX( ${-this.currentIndex * 100}%)`
      }
      this.$emit('change', this.currentIndex, oldIndex)
    }
  },

  mounted() {
    this.initItems()
  }
}
</script>

<style>
/* 保留原始样式，单位建议改为rpx */
.mint-swipe {
  overflow: hidden;
  position: relative;
  height: 100%;
}

.mint-swipe-items-wrap {
  position: relative;
  height: 100%;
  white-space: nowrap;
  display: flex;

  > * {
    flex-shrink: 0;
  }
}
</style>