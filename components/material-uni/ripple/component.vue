<template>
  <view class="v-touch-ripple" :style="{'background-color': config.backgroundColor}" @longpress.stop="handleLongPress" @mousedown.stop="handleMouseDown" @mouseup.stop="handleMouseUp">
    <slot>

    </slot>
    <view class="ripples">
      <view
          v-for="(value, key) in ripples"
          :key="key"
          :id="key"
          class="ripple-item"
          :style="{
            opacity: value.opacity,
            top: `${value.top}px`,
            left: `${value.left}px`,
            width: `${value.size}px`,
            height: `${value.size}px`,
            transform: `scale(${value.scale})`,
            'background-color': config.color,
          }"
      />
    </view>
  </view>
</template>

<script>
import Vue from 'vue'
import {DEFAULT_CONFIG, DEFAULT_RIPPLE_PROPS} from './config'

export default {
  name: 'touch-ripple',
  props: {...DEFAULT_RIPPLE_PROPS},
  data() {
    return {
      element: null,
      ripples: {},
      lastRippleID: 0,
      state: {
        active: true,
        cleanWhenMouseUp: false
      },
      id: 0,
      size: 0,
      top: 0,
      left: 0,
      scale: 0,
    }
  },
  computed: {
    config() {
      const defaultConfig = {
        ...DEFAULT_CONFIG,
      }
      return {
        color: this.color ?? defaultConfig.color,
        opacity: this.opacity ?? defaultConfig.opacity,
        duration: this.duration ?? defaultConfig.duration,
        transition: this.transition ?? defaultConfig.transition,
        backgroundColor: this.backgroundColor ?? defaultConfig.backgroundColor,
        // keepLastRipple: this.keepLastRipple ?? defaultConfig.keepLastRipple
      }
    }
  },
  mounted() {
    this.element = this.$refs.element
  },
  methods: {
    clearRipples() {
      this.ripples = {}
    },
    getRippleSize(positionX, positionY) {
      return new Promise((resolve, reject) => {
        uni.createSelectorQuery().in(this).select(".v-touch-ripple")
            .boundingClientRect((data) => {
              if (data) {
                const {width, height} = data;
                const square = (x) => Math.pow(x, 2)
                const coordinates = [
                  [0, 0],
                  [width, 0],
                  [0, height],
                  [width, height]
                ].map((coordinate) => {
                  return Math.sqrt(square(coordinate[0] - positionX) + square(coordinate[1] - positionY))
                })
                const maxCoordinate = Math.max.apply({}, coordinates)
                const size = maxCoordinate * 2
                const left = positionX - size / 2
                const top = positionY - size / 2
                resolve({left, top, size: Math.ceil(size)})
              } else {
                reject(new Error("未找到元素"));
              }
            })
            .exec();
      });
    },
    handleLongPress(event) {
      event["clientX"] = event.changedTouches[0].clientX;
      event["clientY"] = event.changedTouches[0].clientY;
      this.handleMouseDown(event.changedTouches[0])
    },
    handleMouseDown(event) {
      this.state.active = true
      const {clientX: layerX, clientY: layerY} = event
      uni.createSelectorQuery().in(this).select(".v-touch-ripple")
          .boundingClientRect(async (data) => {
            const {top: innerY, left: innerX} = data
            const positionX = layerX - innerX
            const positionY = layerY - innerY
            const {size, left, top} = await this.getRippleSize(positionX, positionY)
            const id = Math.random();
            this.$set(this.ripples, id, {
              size,
              left,
              top,
              scale: 0,
              opacity: this.config.opacity,
              startTime: Date.now(),
              isActive: true
            })
            this.animateRipple(id);
          })
          .exec();
      if(event.type === "mousedown"){
        this.$emit("touch", event);
      }
    },
    animateRipple(id) {
      try {
        const ripple = this.ripples[id];
        if (!ripple.isActive) return;

        const elapsed = Date.now() - ripple.startTime;
        const duration = this.config.duration;

        if (elapsed < duration) {
          ripple.scale = this.easeOut(elapsed, 0, 1, duration);
          // ripple.opacity = this.easeOut(elapsed, 0, this.config.opacity, duration);
        } else {
          ripple.isActive = false;
          ripple.opacity = 0;
          setTimeout(() => {
            Vue.delete(this.ripples, id);
          }, this.config.duration); // 保持300ms的透明度过渡
        }
        //#ifdef H5
        requestAnimationFrame(() => this.animateRipple(id));
        //#endif
        //#ifdef APP-PLUS
        this.$nextTick(() => {
          this.animateRipple(id)
        });
        //#endif
      }catch (e) {
        console.error(e)
      }
    },
    easeOut(t, b, c, d) {
      t /= d;
      return -c * t * (t - 2) + b;
    },
    handleMouseUp(event) {
      this.state.active = false
      if (this.state.cleanWhenMouseUp) {
        this.clearRipples()
      }
      this.$emit("click", event)
    },
    beforeDestroy() {
      this.clearRipples()
    }
  },
}
</script>

<style lang="scss" scoped>
.v-touch-ripple {
  position: relative;
  overflow: hidden;
  //background-color: rgba(255, 255, 255, 0);

  :not(:last-child) {
    position: relative;
    z-index: 1;
  }

  > .ripples {
    z-index: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    overflow: hidden;
    pointer-events: none;

    > .ripple-item {
      display: block;
      position: absolute;
      border-radius: 50%;

      &.ripple-leave-to {
        opacity: 0 !important;
      }
    }
  }
}
</style>
