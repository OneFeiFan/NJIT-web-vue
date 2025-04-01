<template>
  <touch-ripple :color="color" :opacity="opacity" :duration="duration" :transition="transition">
    <view class="material-list-cell" :style="{'background-color': backgroundColor}" @click="handleClick">
      <view class="left-text">
        <slot></slot>
      </view>
      <view class="right-icon">
        <zui-svg-icon icon="md-keyboard_arrow_right" :color='`var(--md-sys-color-on-surface)`'></zui-svg-icon>
      </view>
    </view>
  </touch-ripple>
</template>

<script>
import TouchRipple from "../ripple/component.vue";
import zuiSvgIcon from "@/uni_modules/zui-svg-icon/components/zui-svg-icon/zui-svg-icon.vue";
export default {
  name: "material-list-cell",
  components: {
    zuiSvgIcon,
    TouchRipple
  },
  props: {
    backgroundColor: {
      type: String,
      default: '#fff'
    },
    color: {
      type: String,
      default: '#000'
    },
    opacity: {
      type: Number,
      default: 1
    },
    duration: {
      type: Number,
      default: 500
    },
    transition: {
      type: String,
      default: "ease"
    },
  },
  methods: {
    handleClick(e) {
      setTimeout(() => {
      this.$emit('click', e);
      }, 200);
    }
  }
}
</script>

<style scoped lang="scss">
.material-list-cell{
  width: 100%;
  height: 120rpx;
  border-bottom: 2rpx solid var(--md-sys-color-outline);
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left-text{
    margin-left: 36rpx;
    font-size: 32rpx;
    color: var(--md-sys-color-on-surface);
  }
  .right-icon{
    margin-right: 34rpx;
  }
}
</style>