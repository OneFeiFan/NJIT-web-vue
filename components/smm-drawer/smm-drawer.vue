<template>
  <uni-popup ref="drawer">
  <view  @touchstart="UseTouchstartTocloseBarFn"
        @touchmove="UseTouchmoveTocloseBarFn" @touchend="UseTouchendTocloseBarFn"
        :style="{'background-color':backgroundColor,transform: 'translateX(' + offsetX + 'px)'}">

    <view class="drawer" :class="{open:openType}"
          :style="{width:width+'rpx'}">
      <slot></slot>
    </view>
  </view>
  </uni-popup>
</template>

<script>
export default {
  name: "smm-drawer",
  data() {
    return {
      mask: false,
      offsetX: 0,
      isDragging: false,
      startX: 0,
      openType: false,
      bgColor: '',
      userImg: ''
    };
  },
  created() {
    // 动态计算初始偏移量（将rpx转换为px）
    this.offsetX = -this.rpx2px(this.width);
  },
  props: {
    backgroundColor: {
      type: String,
      default: '#fff'
    },
    // 侧标栏宽度
    width: {
      type: Number,
      default: 600
    },
    // 移动的距离
    moveDist: {
      type: Number,
      default: 100
    },
    // 触摸滑动的初始位置
    touchScope: {
      type: Number,
      default: 50
    },
    // 是否允许手指滑动拉开
    touch: {
      type: Boolean,
      default: true
    },
    // 是否开启用户栏目
    userHeaderSwitch: {
      type: Boolean,
      default: true
    },
    // 用户栏目背景
    userBackground: {
      type: String,
      default: 'green'
    },
    // 用户信息
    userInfo: {
      type: Object,
      default: function () {
        return {
          name: '用户',
          img: 'red',
          userId: '0000000'
        };
      }
    }
  },
  computed: {
    maskOpacity() {
      const fullWidth = this.rpx2px(this.width);
      return Math.min(0.2 * ((fullWidth + this.offsetX) / fullWidth), 0.2);
    }
  },
  watch: {
    userBackground: {
      immediate: true,
      handler(val) {
        this.bgColor = /.*\.(jpg|png|gif|jpeg|php)\s*$/.test(val) ? `url(${val})` : val;
      }
    },
    userInfo: {
      immediate: true,
      handler(val) {
        this.userImg = /.*\.(jpg|png|gif|jpeg|php)\s*$/.test(val.img) ? `url(${val.img})` : val.img;
      }
    },
    openType: {
      immediate: true,
      handler(val) {
        if (val) {
          this.mask = true;
        } else {
            this.mask = false;
        }
        this.$emit('update:open', val);
      }
    }
  },
  methods: {
    // 新增rpx转换方法，并添加错误处理
    rpx2px(rpx) {
      if (typeof rpx !== 'number') {
        console.error('rpx 参数必须是数字类型');
        return 0;
      }
      try {
        if(typeof  uni.rpx2px === "function"){
          return uni.rpx2px(rpx);
        }else {
          return uni.upx2px(rpx);
        }
      } catch (e) {
        console.error('rpx2px 转换失败:', e);
        return uni.upx2px(rpx);
      }
    },
    // 修改原有开关方法
    open() {
      this.mask = true;
      this.$refs.drawer.open("left");
        this.offsetX = 0;
        this.openType = true;
    },
    close(){
      this.closeDrawerFn()
    },
    closeDrawerFn() {
      if (this.openType) {
        this.$refs.drawer.close();
        this.offsetX = -this.rpx2px(this.width);
        this.openType = false;
      }
    },
    clickUserPicFn(e) {
      console.log('用户点击了头像');
      this.$emit('clickUserPic', e);
    },
    // 滑动关闭 - 用户手指按下时
    UseTouchstartTocloseBarFn(e) {
      this.startX = e.changedTouches[0].pageX;
      this.isDragging = true;
    },
    UseTouchmoveTocloseBarFn(e) {
      if (!this.isDragging) return;

      const currentX = e.changedTouches[0].pageX;
      const deltaX = currentX - this.startX;
      let newOffset = this.offsetX + deltaX;

      // 限制滑动范围
      newOffset = Math.min(newOffset, 0); // 不能超过完全打开状态
      newOffset = Math.max(newOffset, -this.rpx2px(this.width)); // 不能超过完全关闭状态

      this.offsetX = newOffset;
      this.startX = currentX;
    },
    // 滑动关闭 - 用户手指松开时
    UseTouchendTocloseBarFn(e) {
      this.isDragging = false;
      const endX = e.changedTouches[0].pageX;
      const deltaX = endX - this.startX;

      // 根据滑动速度判断关闭
      const shouldClose = deltaX < -20 || this.offsetX < -this.rpx2px(this.width) * 0.1;

      if (shouldClose) {
        this.closeDrawerFn();
      } else {
        // 恢复打开状态
        this.offsetX = 0;
        this.openType = true;
      }
    },
  }
}
</script>

<style lang="scss">
.drawerScope {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 100vh;
  transition: background 0.2s;
  background-color: transparent;

  .drawer {
    box-sizing: border-box;
    height: 100vh;
    background-size: contain !important;
    transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    &.open {
      box-shadow: 0px 0px 20px rgba(0, 0, 10, .3);
    }

    .drawer-item {
      width: 100%;
    }
  }
}
</style>
