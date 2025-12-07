<template>
  <view :style="[theme,SXData]" class="container">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="var(--md-sys-color-on-primary)" size="" type="left"
                   @click="back"/>
        <text class="title">增量更新</text>
        <uni-icons class="icon-right" color="#ffffff00" size="" type="loop"/>
      </view>
    </material-nav-bar>
    <material-list backgroundColor="var(--md-sys-color-surface)" color="var(--md-sys-color-on-surface)">
      <material-list-cell :rightIcon="false" :showLeftText="false">
        <view class="content">
          <text>增量更新</text>
          <async-switch :checked="isSmartUpate" @change="switchChange"/>
        </view>
      </material-list-cell>
    </material-list>
  </view>
</template>

<script>
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import {SXData} from "@/components/material-uni/sx";
import {getTheme} from "@/components/material-uni/colors";
import AsyncSwitch from "@/components/helang-asyncSwitch/helang-asyncSwitch.vue";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    AsyncSwitch, MaterialListCell, MaterialList, MaterialNavBar,
  },
  data() {
    return {
      theme: {},
      isSmartUpate: false,
    }
  },
  onShow() {
    // #ifdef APP-PLUS
    this.isSmartUpate = this.$manager.isSmartUpdate()
    // #endif
  },
  onLoad() {
    this.refreshTheme()
  },
  onResize() {

  },
  onReady() {

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
    switchChange() {
      // console.log(e.detail.value)
      this.$manager.setSmartUpdate(!this.isSmartUpate)
      setTimeout(() => {
        this.isSmartUpate = this.$manager.isSmartUpdate()
      })
    }
  }
}
</script>

<style lang="scss">
.container {
  background-color: var(--md-sys-color-surface);
  height: 100vh;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-left: sx(6.5);
  margin-right: sx(6.5);
  font-size: sx(5);
}

.tips {
  margin-top: sx(6.5);
  margin-left: sx(6.5);
  margin-right: sx(6.5);
  font-size: sx(4);
  color: var(--md-sys-color-on-tertiary-container);
}

</style>