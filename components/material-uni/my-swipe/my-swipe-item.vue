<template>
  <view class="my-swipe-item">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'my-swipe-item',
  mounted() {
    if (this.$parent && this.$parent.bind) this.$parent.bind();
  },
  beforeDestroy() {
    if (this.$parent && this.$parent.unbind) this.$parent.unbind();
  }
}
</script>

<style scoped>
.my-swipe-item {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
}
</style>