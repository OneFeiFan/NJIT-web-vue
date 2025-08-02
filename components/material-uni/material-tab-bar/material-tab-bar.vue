<template>
  <touch-ripple :color="color" :opacity="opacity" :duration="duration" :transition="transition"
                :background-color="backgroundColor"
                style="position: fixed;bottom: 0;width: 100%;z-index: 999999999">
    <view class="material-tab-bar">
      <view class="material-tab-bar-item" v-for="(value, key) in pages" @click="changePage(key)">
        <view class="wrap">
          <zui-svg-icon class="material-tab-bar-icon" collection="material-filled" :width="mx(5)" :height="mx(5)"
                        :icon="value.icon"
                        :color="value.active ? tabActiveColor() : tabInactiveColor()"/>
          <text class="material-tab-bar-name" :style="{color:value.active ? tabActiveColor() : tabInactiveColor()}">
            {{ value.name }}
          </text>
        </view>
      </view>
    </view>
  </touch-ripple>
</template>

<script>
import zuiSvgIcon from "@/uni_modules/zui-svg-icon/components/zui-svg-icon/zui-svg-icon.vue";
import TouchRipple from "../ripple/component.vue";
import {DEFAULT_RIPPLE_PROPS} from "@/components/material-uni/ripple/config";
import {tabActiveColor, tabInactiveColor} from "@/components/material-uni/colors";
import {mx} from "@/components/material-uni/sx";

export default {
  name: "material-tab-bar",
  components: {
    zuiSvgIcon,
    TouchRipple
  },
  props: {
    pages: {
      type: Object,
      default: () => ({})
    },
    ...DEFAULT_RIPPLE_PROPS
  },
  data() {
    return {}
  },
  created() {
    uni.hideTabBar();
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
        pages[options[key].page] = options[key];
        pages[options[key].page]['active'] = false;
      }
      this.props.pages.default = () => pages;
    }
    Vue.component(this.name, this);
  },
  methods: {
    mx,
    tabInactiveColor,
    tabActiveColor,
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
      }, 200);
    }
  }
}
</script>

<style scoped lang="scss">
.material-tab-bar {
  background-color: #ffffff00;
  width: 100%;
  display: flex;
  height: sx(12);

  .material-tab-bar-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    .wrap {
      height: 80%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .material-tab-bar-icon {
        width: sx(5);
        height: sx(5);
      }

      .material-tab-bar-name {
        font-size: sx(3);
        color: #000;
      }
    }

  }
}
</style>
