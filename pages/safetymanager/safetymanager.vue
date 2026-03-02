<template>
  <view class="container" :style="themeStyle">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="var(--md-sys-color-on-primary)" size="" type="left"
                   @click="back"/>
        <text class="title">安全管理</text>
        <uni-icons class="icon-right" color="#00000000" size="" type="loop" @click=""/>
      </view>
    </material-nav-bar>
    <material-list background-color="var(--md-sys-color-surface)" color="var(--md-sys-color-on-surface)">
      <material-list-cell :rightIcon="false" :showLeftText="false">
        <view class="content">
          <text>储存用户密码</text>
          <async-switch :checked="isStoragePassword" @change="switchChange"/>
        </view>
      </material-list-cell>
    </material-list>
  </view>
</template>

<script>
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import {SXData} from "@/components/material-uni/sx";
import AsyncSwitch from "@/components/helang-asyncSwitch/helang-asyncSwitch.vue";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    AsyncSwitch, MaterialListCell, MaterialList, MaterialNavBar, MaterialCard
  },
  data() {
    return {
      isStoragePassword: false,
    }
  },
  onShow() {
    // #ifdef APP-PLUS
    this.isStoragePassword = this.$manager.isPasswordStorageEnabled()
    // #endif
  },
  onLoad() {
  },
  onResize() {

  },
  onReady() {

  },
  methods: {
    back() {
      uni.navigateBack();
    },
    switchChange() {
      // #ifdef APP-PLUS
      this.$manager.setPasswordStorageEnabled(!this.isStoragePassword)
      setTimeout(() => {
        this.isStoragePassword = this.$manager.isPasswordStorageEnabled()
      })
      // #endif
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
  color: var(--md-sys-color-on-surface);
}

.tips {
  margin-top: sx(6.5);
  margin-left: sx(6.5);
  margin-right: sx(6.5);
  font-size: sx(4);
  color: var(--md-sys-color-on-tertiary-container);
}

</style>