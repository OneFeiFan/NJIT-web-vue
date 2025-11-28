<template>
  <view class="material-list">
    <slot></slot>
  </view>
</template>

<script>
import {DEFAULT_RIPPLE_PROPS} from "@/components/material-uni/ripple/config";

export default {
  name: "material-list",
  props: {
    ...DEFAULT_RIPPLE_PROPS
  },
  provide() {
    return {
      // 将当前 list 实例提供给子孙组件
      // 这里的名字 'materialList' 可以自己定，子组件接收时要对应
      materialList: this
    };
  }
}
</script>

<style scoped lang="scss">
.material-list{
  width: 100%;
  height: auto;
}
</style>