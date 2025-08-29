<template>
  <view class="container" :style="[theme,SXData]">
    <material-nav-bar id="nav-bar">
      <view class="nav-bar">
        <uni-icons type="left" size="" @click="back" color="var(--md-sys-color-on-secondary-container)" class="icon-left"/>
        <text class="title">设置</text>
        <uni-icons type="loop" size="" color="#ffffff00" class="icon-right"/>
      </view>
    </material-nav-bar>
    <scroll-view scroll-y="true" class="scroll-table">
      <material-list>
        <material-list-cell rightIcon @click="jump(`widget`)" color="var(--md-sys-color-on-primary)"
                            backgroundColor="var(--md-sys-color-primary-container)"
                            fontColor="var(--md-sys-color-on-primary-container)">
          <text>小部件管理</text>
        </material-list-cell>
        <material-list-cell rightIcon @click="jump(`safetymanager`)" color="var(--md-sys-color-on-primary)"
                            backgroundColor="var(--md-sys-color-primary-container)"
                            fontColor="var(--md-sys-color-on-primary-container)">
          <text>安全管理</text>
        </material-list-cell>
        <material-list-cell rightIcon @click="jump(`dev`)" color="var(--md-sys-color-on-primary)"
                            backgroundColor="var(--md-sys-color-primary-container)"
                            fontColor="var(--md-sys-color-on-primary-container)">
          <text>监督我开发</text>
        </material-list-cell>

        <material-list-cell rightIcon @click="jump(`faq`)" color="var(--md-sys-color-on-primary)"
                            backgroundColor="var(--md-sys-color-primary-container)"
                            fontColor="var(--md-sys-color-on-primary-container)">
          <text>FAQ</text>
        </material-list-cell>

        <material-list-cell rightIcon @click="jump(`privacy`)" color="var(--md-sys-color-on-primary)"
                            backgroundColor="var(--md-sys-color-primary-container)"
                            fontColor="var(--md-sys-color-on-primary-container)">
          <text>隐私政策</text>
        </material-list-cell>

        <material-list-cell rightIcon @click="jump(`about`)" color="var(--md-sys-color-on-primary)"
                            backgroundColor="var(--md-sys-color-primary-container)"
                            fontColor="var(--md-sys-color-on-primary-container)">
          <text>关于</text>
        </material-list-cell>

      </material-list>
    </scroll-view>

  </view>
</template>

<script>
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import UniEasyinput from "@/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue";
import UniPopup from "@/uni_modules/uni-popup/components/uni-popup/uni-popup.vue";
import UniNavBar from "@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue";
import UniTable from "@/uni_modules/uni-table/components/uni-table/uni-table.vue";
import UniTr from "@/uni_modules/uni-table/components/uni-tr/uni-tr.vue";
import UniTd from "@/uni_modules/uni-table/components/uni-td/uni-td.vue";
import UniTh from "@/uni_modules/uni-table/components/uni-th/uni-th.vue";
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import {SXData} from "@/components/material-uni/sx";
import {getTheme} from "@/components/material-uni/colors";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    MaterialListCell,
    MaterialList,
    MaterialNavBar,
    MaterialCard,
    UniTh,
    UniTd,
    UniTr,
    UniTable,
    UniNavBar,
    UniPopup,
    UniEasyinput,
    UniIcons
  },
  data() {
    return {
      theme:{},
    }
  },
  created() {
    // #ifdef APP-PLUS

    // this.$manager.createWidget()
    // #endif
  },
  onLoad() {

  },
  onShow() {
    this.theme = getTheme()
  },
  methods: {
    getTheme,
    jump(page) {
      // this.isDrawerOpen = false;
      uni.navigateTo({
        url: `/pages/${page}/${page}`
      });
    },
    back() {
      uni.navigateBack();
    },

  }
}
</script>

<style lang="scss">
.container {
  background-color: var(--md-sys-color-primary-container);
}

.scroll-table {
  height: calc(100vh - var(--status-bar-height) - sx(10));

  .color-red {
    color: red;
  }
}
</style>