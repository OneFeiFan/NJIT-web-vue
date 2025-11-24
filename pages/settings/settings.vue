<template>
  <view class="container" :style="[theme,SXData]">
    <material-nav-bar background-color="var(--md-sys-color-primary)">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="var(--md-sys-color-on-primary)" size="" type="left"
                   @click="back"/>
        <text class="title">设置</text>
        <uni-icons class="icon-right" color="#00000000" size="" type="loop" @click=""/>
      </view>
    </material-nav-bar>
    <scroll-view scroll-y="true" class="scroll-table">
      <material-list>
        <material-list-cell rightIcon @click="jump(`widget`)">
          <text>小部件管理</text>
        </material-list-cell>
        <material-list-cell rightIcon @click="jump(`safetymanager`)">
          <text>安全管理</text>
        </material-list-cell>
        <!--#ifdef APP-PLUS-->
        <material-list-cell
            rightIcon
            @click="jump(`smartupdate`)">
          <text>增量更新</text>
        </material-list-cell>
        <!--#endif-->
        <material-list-cell rightIcon @click="jump(`dev`)">
          <text>监督我开发</text>
        </material-list-cell>

        <material-list-cell rightIcon @click="jump(`faq`)">
          <text>FAQ</text>
        </material-list-cell>

        <material-list-cell rightIcon @click="jump(`privacy`)">
          <text>隐私政策</text>
        </material-list-cell>

        <material-list-cell rightIcon @click="jump(`about`)">
          <text>关于</text>
        </material-list-cell>

      </material-list>
    </scroll-view>

  </view>
</template>

<script>
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
    MaterialListCell, MaterialList, MaterialNavBar, MaterialCard,
  },
  data() {
    return {
      theme: {},
    }
  },
  onLoad() {
    this.refreshTheme()
  },
  methods: {
    refreshTheme() {
      this.theme = getTheme()
    },
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
  background-color: var(--md-sys-color-surface);
}

.scroll-table {
  height: calc(100vh - var(--status-bar-height) - sx(15));

  .color-red {
    color: red;
  }
}
</style>