<template>
  <view>
    <smm-drawer ref="drawer">
      <view>
        <view class="listView">
          菜单
        </view>
        <view class="listView">
          我的收藏
        </view>
        <view class="listView">
          我的作品
        </view>
        <view class="listView">
          我的频道
        </view>
      </view>
    </smm-drawer>
    <view class="content" @click="openDrawer">
      Hello word
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      text: '首页',
      user: {
        name: 'smmMax',
        userId: '10010101',
        img: 'https://img.xjh.me/img/62973578_p15_master1200.jpg'
      },
      imgs: 'https://api.vvhan.com/static/img/background-1.png'
    }
  },
  methods: {
    openDrawer(e){
      this.$refs.drawer.open()
    }
  }
}
</script>

<style lang="scss">
.listView {
  position: relative;
  height: 120rpx;
  width: 100%;
  box-sizing: border-box;
  padding: 20rpx 30rpx;
  font-size: 35rpx;
  display: flex;
  align-items: center;
  border-bottom: 2rpx solid #ccc;

  &::after {
    content: '>';
    transform: rotate(90deg) scale(1, 2);
    font-size: 30rpx;
    position: absolute;
    right: 30rpx;
    top: 35%;
  }
}
</style>