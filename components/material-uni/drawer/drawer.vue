<template>
  <view>
    <view
        ref="drawerBg"
        class="drawer_bg"
        :style="drawerBgStyles"
        @click="handleBgClick"
        @touchstart.stop="onStart"
        @touchmove.stop="onMovedMobile"
        @touchend.stop="onEnd"
    />

    <view
        ref="drawer"
        class="drawer"
        :style="drawerStyles"
        @touchstart.stop="onStart"
        @touchmove.stop="onMovedMobile"
        @touchend.stop="onEnd"
    >
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: "drawer",
  props: {
    value: Boolean // 使用v-model控制是否打开
  },
  data() {
    return {
      width: 0,
      opened: false,
      drawerStarted: false,
      stateMoved: false,
      trx: 0,
      startX: 0,
      startY: 0, // 新增Y坐标
      correct: 0,
      speedSwipe: 0,
      startMoveTime: 0,
      transitionProp: "transition",
      transformProp: "transform",
      propPrefixCss: "",
      trZ: "translateZ(0)",
      // 新增样式相关的响应式数据
      drawerStyles: {
        transform: '',
        transition: '',
        opacity: 0.001
      },
      drawerBgStyles: {
        transition: '',
        opacity: 0.001,
        visibility: 'hidden'
      },
      isVerticalSwipe: null  // 新
    };
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this);
    query.select('.drawer').boundingClientRect(res => {
      this.width = res.width;
    }).exec();
    this.$watch("value", (val) => {
      val ? this.openDrawer() : this.closeDrawer();
    });
  },
  methods: {
    onStart(e) {
      if (!this.opened) {
        this.drawerStarted = false;
        return;
      }
      this.drawerStarted = true;
      this.startX = e.changedTouches[0].pageX;
      this.startY = e.changedTouches[0].pageY; // 新增Y坐标记录
      this.startMoveTime = new Date();
      this.correct = this.width + this.startX;
      this.isVerticalSwipe = null; // 新增滑动方向标志
    },
    onMovedMobile(e) {
      // 如果抽屉未打开，直接返回
      if (!this.opened || !this.drawerStarted) return;
      const currentX = e.changedTouches[0].pageX;
      const currentY = e.changedTouches[0].pageY;

      // 初始滑动方向判断（仅第一次移动时判断）
      if (this.isVerticalSwipe === null) {
        const dx = Math.abs(currentX - this.startX);
        const dy = Math.abs(currentY - this.startY);
        // 45度角分界线：如果dy/dx > 1则为垂直滑动
        this.isVerticalSwipe = dy > dx;
      }

      // 如果是垂直滑动，则阻止抽屉移动
      if (this.isVerticalSwipe) {
        return;
      }

      const moveX = this.opened ? this.startX - currentX : this.correct - currentX;
      this.move(moveX, e);
    },
    onEnd(e) {
      if (!this.drawerStarted) return;
      this.drawerStarted = false;
      this.stateMoved = false;

      const endX = e.changedTouches[0].pageX;
      const dt = (new Date() - this.startMoveTime);
      const dx = Math.abs(endX - this.startX);
      this.speedSwipe = ((this.width / 2) / (dx / dt)) / 1000;

      if (this.speedSwipe === Infinity) {
        this.opened ? this.openDrawer() : this.closeDrawer();
        return;
      }

      this.speedSwipe = Math.max(0.150, Math.min(this.speedSwipe, 0.5));
      const intent = (this.startX - endX) > 0;
      const threshold = this.width / 2.25;

      if (this.trx < threshold) {
        if (intent && this.speedSwipe < 0.4) {
          this.closeDrawer(this.speedSwipe);
        } else {
          this.openDrawer(this.speedSwipe);
        }
      } else {
        if (!intent && this.speedSwipe < 0.4) {
          this.openDrawer(this.speedSwipe);
        } else {
          this.closeDrawer(this.speedSwipe);
        }
      }
      this.trx = 0;
    },
    move(x, e) {
      x = Math.max(0, Math.min(x, this.width));
      if (!this.stateMoved) {
        this.stateMoved = true;
      }
      this.trx = x;
      const percent = 1 - x / this.width;
      this.transform(`translateX(-${x}px)`);
      this.drawerBgStyles.opacity = percent;
    },
    transform(value) {
      this.drawerStyles.transform = `${value} ${this.trZ}`;
    },
    setTransition(s) {
      this.drawerStyles.transition = `${this.propPrefixCss}transform ${s}s cubic-bezier(0.0, 0.0, 0.2, 1)`;
      this.drawerBgStyles.transition = `opacity ${s}s cubic-bezier(0.0, 0.0, 0.2, 1)`;
    },
    clearTransition() {
      this.drawerStyles.transition = 'none';
      this.drawerBgStyles.transition = 'none';
    },
    openDrawer(s = 0.225) {
      this.opened = true;
      this.setTransition(s);
      this.drawerStyles.opacity = 1;
      this.drawerBgStyles = {
        ...this.drawerBgStyles,
        opacity: 1,
        visibility: "visible"
      };
      this.transform("translateX(0)");
      this.$emit("input", true);
      setTimeout(() => {
        this.clearTransition();
      }, s * 1000);
    },
    closeDrawer(s = 0.225) {
      this.opened = false;
      this.setTransition(s);
      this.drawerBgStyles.opacity = 0.001;
      this.transform(`translateX(-${this.width}px)`);
      this.$emit("input", false);
      this.$emit("onClose", "抽屉已关闭"); // 添加新的emit调用
      setTimeout(() => {
        this.clearTransition();
        this.drawerStyles.opacity = 0.001;
        this.drawerBgStyles.visibility = "hidden";
      }, s * 1000);
    },
    toggleDrawer() {
      this.opened ? this.closeDrawer() : this.openDrawer();
    },
    handleBgClick() {
      this.closeDrawer();
    },
    onResize() {
      this.width = this.$refs.drawer.offsetWidth;
      if (!this.opened) {
        this.transform(`translateX(-${this.width}px)`);
      }
    }
  }
};
</script>

<style scoped>
//.rx_noselect {
//  -webkit-touch-callout: none;
//  -webkit-user-select: none;
//  -khtml-user-select: none;
//  -moz-user-select: none;
//  -ms-user-select: none;
//  user-select: none;
//}

.drawer_bg {
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.001;
  transform: translateZ(0);
  visibility: hidden;
  z-index: 99999999999;
}

.drawer {
  width: 70vmin;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  transform: translateX(-100%);
  background: white;
  position: fixed;
  z-index: 99999999999;
  opacity: 0.001;
  box-shadow: 3px 0 16px -3px rgba(0, 0, 0, 0.4);
}
</style>
