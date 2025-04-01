<template>
  <view class="material-list">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: "material-list",
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
}
</script>

<style scoped lang="scss">
.material-list{
  width: 100%;
  height: auto;
}
</style>