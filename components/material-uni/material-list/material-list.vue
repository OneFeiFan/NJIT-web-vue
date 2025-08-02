<template>
  <view class="material-list">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: "material-list",
}
</script>

<style scoped lang="scss">
.material-list{
  width: 100%;
  height: auto;
}
</style>