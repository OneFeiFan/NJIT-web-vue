<template>
  <touch-ripple :color="color" :opacity="opacity" :duration="duration" :transition="transition" :background-color="backgroundColor">
    <view class="material-list-cell" @click="handleClick">
      <view class="left-text" :style="{'color': fontColor}" v-if="showLeftText">
        <slot></slot>
      </view>
      <slot v-else></slot>
      <view class="right-icon" v-if="rightIcon">
        <uni-icons type="right" size="" :color="fontColor"/>
        <!--        <zui-svg-icon icon="md-keyboard_arrow_right" :color="_colorMap[fontColor.split('var(')[1].split(')')[0]]"></zui-svg-icon>-->
      </view>
<!--      <view class="ripple-fix" v-if="!rightIcon"></view>-->
    </view>
  </touch-ripple>
</template>

<script>
import TouchRipple from "../ripple/component.vue";
import zuiSvgIcon from "@/uni_modules/zui-svg-icon/components/zui-svg-icon/zui-svg-icon.vue";
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import {DEFAULT_RIPPLE_PROPS} from "@/components/material-uni/ripple/config";

export default {
  name: "material-list-cell",
  components: {
    UniIcons,
    zuiSvgIcon,
    TouchRipple
  },
  props: {
    rightIcon: {
      type: Boolean,
      default: false
    },
    showLeftText: { // 新增的prop来控制left-text是否显示
      type: Boolean,
      default: true
    },
    fontColor: {
      type: String,
      default: "var(--md-sys-color-on-surface)"
    },
    ...DEFAULT_RIPPLE_PROPS
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
.material-list-cell {
  background-color: #ffffff00;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: sx(15);
  border-bottom: max(sx(0.25), 0.5px) solid var(--md-sys-color-outline-variant);

  .left-text {
    font-size: sx(5);
    margin-left: sx(6.5);
  }

  .right-icon {
    margin-right: sx(6.5);
    font-size: sx(5);
  }

  .ripple-fix {
    width: 0;
    height: 0;
  }
}
</style>
