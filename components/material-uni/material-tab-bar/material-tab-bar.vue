<template>
  <touch-ripple :color="color" :opacity="opacity" :duration="duration" :transition="transition"
                :background-color="backgroundColor" :style="{'box-shadow': shadow()}"
                style="position: fixed;bottom: 0;width: 100%; z-index: 5">
    <view class="material-tab-bar">
      <view class="material-tab-bar-item" v-for="(value, key) in pages" @click="changePage(key)">
        <view class="wrap">
          <zui-svg-icon v-if="value.active" :height="mx(6.5)" :width="mx(6.5)" class="material-tab-bar-icon"
                        collection="material-filled"
                        :icon="value.icon"
                        :color='getColor("--md-sys-color-primary")'/>
          <zui-svg-icon v-else :height="mx(6.5)" :width="mx(6.5)" class="material-tab-bar-icon"
                        collection="material-filled"
                        :icon="value.icon"
                        :color='getColor("--md-sys-color-outline")'/>
          <text class="material-tab-bar-name" :class="value.active ? '' : 'inactive'">
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
    shadow() {
      return `0 ${this.mx(-0.25)} ${this.mx(1)} rgba(0, 0, 0, 0.1)`;
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
      }, 200);
    }
  }
}
</script>

<style scoped lang="scss">
.material-tab-bar {
  width: 100%;
  display: flex;
  height: sx(15);
  border-top: sx(0.25) solid var(--md-sys-color-outline-variant);

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
        width: sx(6.5);
        height: sx(6.5);
      }

      .material-tab-bar-name {
        font-size: sx(3.5);
        color: var(--md-sys-color-primary);
      }

      .inactive {
        color: var(--md-sys-color-outline);
      }
    }
  }
}
</style>
