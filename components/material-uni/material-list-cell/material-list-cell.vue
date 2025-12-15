<template>
  <touch-ripple :color="getColor" :opacity="opacity" :duration="duration" :transition="transition" :background-color="background" @click="handleClick">
    <view class="material-list-cell">
      <view class="left-text" v-if="showLeftText">
        <slot></slot>
      </view>
      <slot v-else></slot>
      <view class="right-icon" v-if="rightIcon">
        <uni-icons type="right" size="" :color="getColor"/>
      </view>
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
    ...DEFAULT_RIPPLE_PROPS
  },
  computed:{
    getColor(){
      return this.color || this.materialList.color
    },
    background(){
      return this.backgroundColor || this.materialList.backgroundColor
    }
  },
  inject: {
    materialList: {
      from: 'materialList', // 对应父组件 provide 的 key
      default: null         // 默认为 null，防止子组件单独使用时报错
    }
  },
  methods: {
    handleClick(e) {
      this.$emit('click', e);
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
  border-bottom: max(sx(0.25), 0.5px) solid color-mix(in srgb, var(--md-sys-color-secondary) 50%, transparent);

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
