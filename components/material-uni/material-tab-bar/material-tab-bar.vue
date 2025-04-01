<template>
  <touch-ripple :color="color" :opacity="opacity" :duration="duration" :transition="transition"
                :style="{'height': '100rpx',position: 'fixed',left: '0',bottom: '0',width: '100%'}">
    <view class="material-tab-bar" :style="{'background-color': backgroundColor}">
      <view class="material-tab-bar-item" v-for="(value, key) in pages" @click="changePage(key)">
        <view class="wrap">
          <zui-svg-icon class="material-tab-bar-icon" width="40rpx" height="40rpx" :icon="value.icon"
                        :color="value.active ? tabActiveColor : tabInactiveColor"/>
          <text class="material-tab-bar-name" :style="{color:value.active ? tabActiveColor : tabInactiveColor}">{{ value.name }}</text>
        </view>
      </view>
    </view>
  </touch-ripple>
</template>

<script>
import zuiSvgIcon from "@/uni_modules/zui-svg-icon/components/zui-svg-icon/zui-svg-icon.vue";
import TouchRipple from "../ripple/component.vue";

export default {
  name: "material-tab-bar",
  components: {
    zuiSvgIcon,
    TouchRipple
  },
  props: {
    backgroundColor: {
      type: String,
      default: '#fff'
    },
    pages: {
      type: Object,
      default: () => ({})
    },
    color: {
      type: String,
      default: '#000'
    },
    opacity: {
      type: Number,
      default: "1"
    },
    duration: {
      type: Number,
      default: "500"
    },
    transition: {
      type: String,
      default: "ease"
    }
  },
  data() {
    return {
    }
  },
  created() {
    uni.hideTabBar();

  },
  mounted() {

  },
  install(Vue, options) {
    if (options) {
      let pages = {};
      options[0]['active'] = true;
      pages[options[0].page] = options[0];
      options.shift();
      for (let key in options) {
        pages[options[key].page]= options[key];
        pages[options[key].page]['active'] = false;
      }
      this.props.pages.default = () => pages;
    }
    Vue.component(this.name, this);
  },
  methods: {
    print1(value) {
      console.log(value);
    },
    changePage(index) {
      let pages = getCurrentPages();
      let page = pages[pages.length - 1];
      let currentPage = page.route;
      setTimeout(() => {
        if (currentPage !== index) {
          this.pages[currentPage].active = false;
          this.pages[index].active = true;
          uni.switchTab({
            url: `/${index}`
          });
        }
      },200);
    }
  }
}
</script>

<style scoped lang="scss">
.material-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 100rpx;
  width: 100%;
  display: flex;

  .material-tab-bar-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    .wrap {
      display: flex;
      flex-direction: column;

      .material-tab-bar-icon {
        width: 40rpx;
        height: 40rpx;
      }

      .material-tab-bar-name {
        font-size: 18rpx;
        color: #000;
      }
    }

  }
}
</style>
