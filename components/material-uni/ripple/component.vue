<template>
  <view
      class="v-touch-ripple"
      :style="{ '--ripple-color': config.color, 'background-color': config.backgroundColor,'--opacity':config.opacity }"
      :data-duration="config.duration"
  >
    <view class="ripple-content" @click.stop="handleClick" @longpress.stop="handleLongPress">
      <slot></slot>
    </view>
    <!-- 给容器一个 class 或 id，方便 renderjs 查找 -->
    <view class="ripples-container"></view>
  </view>
</template>

<script>
import {DEFAULT_CONFIG, DEFAULT_RIPPLE_PROPS} from './config'

export default {
  name: 'touch-ripple',
  props: {...DEFAULT_RIPPLE_PROPS},
  // data 中不再需要 list，极度精简
  data() {
    return {}
  },
  computed: {
    config() {
      return {
        color: this.color || "var(--md-sys-color-error)",
        opacity: this.opacity || DEFAULT_CONFIG.opacity,
        duration: this.duration || DEFAULT_CONFIG.duration,
        backgroundColor: this.backgroundColor || DEFAULT_CONFIG.backgroundColor
      }
    }
  },
  methods: {
    // addRipple 和 removeRipple 方法都可以删除了，Logic 层不再关心波纹
    handleLongPress(e) {
      this.$emit("longpress", e);
    },
    handleClick(e) {
      setTimeout(() => {
        this.$emit(e.type || 'click', e)
      }, 200);
    }
  }
}
</script>

<script module="ui" lang="renderjs">
export default {
  data() {
    return {
      duration_: 600,
      rippleContainer: null
    }
  },
  mounted() {
    // 1. 缓存容器 DOM，避免每次查找
    this.rippleContainer = this.$ownerInstance.$el.querySelector(':scope > .ripples-container');

    // 2. 绑定原生事件
    this.$el.addEventListener('touchstart', this.handleTouchStart, {passive: true});

    this.duration_ = parseInt(this.$el.dataset.duration);
  },
  beforeDestroy() {
    if (this.$el) {
      this.$el.removeEventListener('touchstart', this.handleTouchStart);
    }
  },
  methods: {
    handleTouchStart(e) {
      // --- 防止事件穿透逻辑 ---
      if (e.__ripple_triggered || !this.rippleContainer) return;
      e.__ripple_triggered = true;
      // ----------------------

      let clientX, clientY;
      if (e.changedTouches && e.changedTouches[0]) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const rect = this.$el.getBoundingClientRect();
      if (!rect) return;

      const localX = clientX - rect.left;
      const localY = clientY - rect.top;

      // 计算半径
      const w = rect.width;
      const h = rect.height;
      const dists = [localX ** 2 + localY ** 2, (w - localX) ** 2 + localY ** 2, localX ** 2 + (h - localY) ** 2, (w - localX) ** 2 + (h - localY) ** 2];
      const size = Math.sqrt(Math.max(...dists)) * 2;
      // --- 核心改变：手动创建 DOM ---
      this.createRipple(localX, localY, Math.ceil(size));
    },

    createRipple(x, y, size) {
      // 1. 创建 span 元素
      const ripple = document.createElement('uni-view');

      // 2. 设置样式
      // 注意：Renderjs 环境下可以直接操作 style
      ripple.className = 'ripple-manual-item'; // 使用非 Scoped 的 class

      const style = ripple.style;
      style.width = style.height = `${size}px`;
      style.left = `${x - size / 2}px`;
      style.top = `${y - size / 2}px`;

      // 3. 插入 DOM
      this.rippleContainer.appendChild(ripple);

      // 4. 执行动画 (使用 Web Animations API 或者 requestAnimationFrame)
      // 这里使用简单的 requestAnimationFrame 来模拟之前的 ease 效果

      const startTime = Date.now();

      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / this.duration_, 1);
        const ease = progress * (2 - progress); // ease-out

        ripple.style.transform = `scale(${ease})`;
        // 如果需要淡出：ripple.style.opacity = (this.config.opacity) * (1 - progress);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // 5. 动画结束，移除 DOM
          ripple.remove();
        }
      };

      requestAnimationFrame(step);
    }
  }
}
</script>

<style lang="scss">
/*
  注意：这里不要加 scoped，或者使用 /deep/
  因为手动创建的元素不会带有 Vue 的 scoped data-v-xxx 属性
*/
.v-touch-ripple {
  position: relative;
  overflow: hidden;
  color: var(--ripple-color);

  .ripple-content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
  }

  .ripples-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
  }

  ::v-deep.ripple-manual-item {
    display: block;
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    /* 优化：强制开启 GPU 加速 */
    /*will-change: transform, opacity;*/
    /* 确保 transform 原点在中心 */
    transform-origin: center center;
    transform: scale(0);
    background-color: var(--ripple-color);
    opacity: var(--opacity);
  }
}
</style>
