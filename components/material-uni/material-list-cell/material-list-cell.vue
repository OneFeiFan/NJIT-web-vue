<template>
  <touch-ripple :color="color" :opacity="opacity" :duration="duration" :transition="transition">
    <view class="material-list-cell" :style="{'background-color': backgroundColor}" @click="handleClick">
      <view class="left-text" :style="{'color': fontColor}" v-if="showLeftText">
        <slot></slot>
      </view>
      <slot v-else></slot>
      <view class="right-icon" v-if="rightIcon">
        <zui-svg-icon icon="md-keyboard_arrow_right" :color="_colorMap[fontColor.split('var(')[1].split(')')[0]]"></zui-svg-icon>
      </view>
      <view class="ripple-fix" v-if="!rightIcon"></view>
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
    rightIcon:{
      type:Boolean,
      default:false
    },
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
    showLeftText: { // 新增的prop来控制left-text是否显示
      type: Boolean,
      default: true
    },
    fontColor: {
      type: String,
      default: "var(--md-sys-color-on-surface)"
    }
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
  height: 15vmin;
  border-bottom: 0.25vmin solid var(--md-sys-color-outline);
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left-text{
    margin-left: 5vmin;
    font-size: 4vmin;
  }
  .right-icon{
    margin-right: 34rpx;
  }
  .ripple-fix{
    width: 0;
    height: 0;
  }
}
</style>
