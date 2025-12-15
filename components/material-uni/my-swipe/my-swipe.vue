<template>
  <view class="my-swipe"
        :prop="wxsState"
        :change:prop="ui.updateState"
        @touchstart="ui.onTouchStart"
        @touchmove="ui.onTouchMove"
        @touchend="ui.onTouchEnd">
    <view class="my-swipe__track">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'my-swipe',
  props: {
    defaultIndex: { type: Number, default: 0 },
    duration: { type: Number, default: 300 }, // 动画时长(ms)
    loop: { type: Boolean, default: true }     // 是否循环
  },
  data() {
    return {
      active: 0,
      items: [],     // 子组件列表
      timestamp: 0   // 用于强制触发 RenderJS 更新的时间戳
    };
  },
  computed: {
    // 传递给 RenderJS 的完整状态
    wxsState() {
      return {
        active: this.active,
        count: this.items.length,
        loop: this.loop,
        duration: this.duration,
        timestamp: this.timestamp
      };
    }
  },
  watch: {
    defaultIndex: {
      immediate: true,
      handler(val) {
        this.active = val;
        this.syncState();
      }
    },
    // Active 变化时，通知所有子组件判断是否需要懒加载
    active() {
      this.items.forEach(item => item.checkRender());
    }
  },
  methods: {
    bind(item) { this.items.push(item); this.syncState(); },
    unbind(item) { this.items = this.items.filter(i => i !== item); this.syncState(); },

    // 同步状态：确保 items 数量更新后再发给 RenderJS
    syncState() {
      this.$nextTick(() => {
        this.timestamp = Date.now();
        this.items.forEach(item => item.checkRender());
      });
    },

    // RenderJS 回调：滑动结束
    onRenderChange(index) {
      this.active = index;
      this.$emit('change', index);
    }
  }
}
</script>

<script module="ui" lang="renderjs">
export default {
  data() {
    return {
      state: {},          // 逻辑层传来的数据
      containerWidth: 0,  // 容器宽度
      startX: 0,          // 触摸起始 X
      startY: 0,          // 触摸起始 Y
      deltaX: 0,          // 滑动偏移量
      swiping: false      // 是否正在滑动
    }
  },
  methods: {
    // 逻辑层数据更新时触发
    updateState(newValue) {
      this.state = newValue;
      if (!this.containerWidth) {
        this.containerWidth = this.$el.getBoundingClientRect().width || 0;
      }
      this.renderItems(true); // true 表示允许动画
    },

    // 核心渲染逻辑
    renderItems(allowAnimation) {
      const { active, count, loop, duration } = this.state;
      if (!count || !this.containerWidth) return;

      const track = this.$el.querySelector('.my-swipe__track');
      if (!track || !track.children) return;
      const children = track.children;

      for (let i = 0; i < children.length; i++) {
        const item = children[i];
        const isCurrent = (i === active);

        // 1. 位置计算（处理循环轮播的偏移）
        let offset = (i - active) * this.containerWidth;
        if (loop && count > 1) {
          const halfTotalWidth = (count / 2) * this.containerWidth;
          if (offset > halfTotalWidth) offset -= count * this.containerWidth;
          else if (offset < -halfTotalWidth) offset += count * this.containerWidth;
        }

        // 2. 加上手势移动的距离
        const x = offset + (this.swiping ? this.deltaX : 0);

        // 3. 样式应用
        // 技巧：只有当前 active 的元素 relative 占位，撑开父容器高度
        // 其他元素 absolute 悬浮，不影响高度
        Object.assign(item.style, {
          position: isCurrent ? 'relative' : 'absolute',
          zIndex: isCurrent ? 1 : 0,
          width: '100%',
          left: 0,
          top: 0,
          transform: `translate3d(${x}px, 0, 0)`,
          // 滑动中或者是初次渲染，去掉 transition 防止迟滞
          transition: (this.swiping || !allowAnimation) ? 'none' : `transform ${duration}ms ease-out`,
          // 性能优化：移出屏幕太远的直接隐藏
          visibility: Math.abs(x) <= this.containerWidth ? 'visible' : 'hidden'
        });
      }
    },

    onTouchStart(event) {
      if (this.state.count <= 1) return;
      this.swiping = true;
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
      this.containerWidth = this.$el.getBoundingClientRect().width;
      this.deltaX = 0;
      this.renderItems(false); // 禁用动画，准备跟手
    },

    onTouchMove(event) {
      if (!this.swiping) return;
      const dx = event.touches[0].clientX - this.startX;
      const dy = event.touches[0].clientY - this.startY;

      // 垂直滚动拦截：如果 Y 轴移动大于 X 轴，则认为是浏览页面，不触发轮播
      if (Math.abs(dy) > Math.abs(dx)) return;

      event.preventDefault();
      this.deltaX = dx;
      this.renderItems(false);
    },

    onTouchEnd(event, ownerInstance) {
      if (!this.swiping) return;
      this.swiping = false;

      const dx = event.changedTouches[0].clientX - this.startX;
      const dy = event.changedTouches[0].clientY - this.startY;

      // 判定是否切换：滑动距离大于50px，且横向为主
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        let nextIndex = this.state.active;
        if (dx > 0) nextIndex--; // 右滑，看上一页
        else nextIndex++;        // 左滑，看下一页

        // 边界处理
        const count = this.state.count;
        if (this.state.loop) {
          if (nextIndex < 0) nextIndex = count - 1;
          if (nextIndex >= count) nextIndex = 0;
        } else {
          nextIndex = Math.max(0, Math.min(nextIndex, count - 1));
        }

        // 立即在 View 层更新 Active，保证无缝动画
        this.state.active = nextIndex;
        // 通知 Logic 层同步
        ownerInstance.callMethod('onRenderChange', nextIndex);
      }

      this.deltaX = 0;
      this.renderItems(true); // 恢复动画播放回弹或切换效果
    }
  }
}
</script>

<style scoped>
.my-swipe {
  display: flex;
  position: relative;
  width: 100%;
  transition: height 0.3s ease-out;
}
.my-swipe__track {
  display: flex;
  width: 100%;
  position: relative;
}
</style>