<template>
  <view class="container" :style="[theme,SXData]">
    <material-nav-bar background-color="var(--md-sys-color-primary)">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="var(--md-sys-color-on-primary)" size="" type="left"
                   @click="back"/>
        <text class="title">安全管理</text>
        <uni-icons class="icon-right" color="#00000000" size="" type="loop" @click=""/>
      </view>
    </material-nav-bar>
    <material-list>
      <material-list-cell :rightIcon="false" :showLeftText="false">
        <view class="content">
          <text>储存用户密码</text>
          <switch :checked="isStoragePassword" @change="switchChange"/>
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
import {getTheme} from "@/components/material-uni/colors";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    MaterialListCell, MaterialList, MaterialNavBar, MaterialCard
  },
  data() {
    return {
      theme: {},
      isStoragePassword: false,
    }
  },
  onShow() {
    // #ifdef APP-PLUS
    this.isStoragePassword = this.$manager.isPasswordStorageEnabled()
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
    switchChange(e) {
      console.log(e.detail.value)
      this.$manager.setPasswordStorageEnabled(e.detail.value)
      if (e.detail.value) {
        // #ifdef APP-PLUS

        // let res = this.$manager.createWidget()
        // let value = JSON.parse(res)
        // if (value.state === "error") {
        //   uni.showModal({
        //     title: '异常',
        //     showCancel: false,
        //     content: value.message,
        //     success: (res) => {
        //
        //     }
        //   });
        // } else if (value.state === "success") {
        //   uni.showModal({
        //     title: '提示',
        //     showCancel: false,
        //     content: value.message,
        //     success: (res) => {
        //       this.$manager.goHome()
        //     }
        //   });
        // } else if (value.state === "need_permission") {
        //   uni.showModal({
        //     title: '提示',
        //     showCancel: false,
        //     content: "当前系统大概率为小米系统，需要手动授予桌面快捷方式权限，请授权后重试？",
        //     success: (res) => {
        //       this.$manager.getWidgetPermission()
        //     }
        //   });
        // }

        // #endif
      } else {
        // uni.showModal({
        //   title: '提示',
        //   showCancel: false,
        //   content: "安卓没有自动删除小部件的功能，请手动删除小部件。",
        //   success: (res) => {
        //     this.$manager.goHome()
        //   }
        // });
      }
      this.isStoragePassword = e.detail.value;
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