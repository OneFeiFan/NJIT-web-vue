<template>
  <view class="container" :style="[theme,SXData]">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="var(--md-sys-color-on-primary)" size="" type="left"
                   @click="back"/>
        <text class="title">小部件管理</text>
        <uni-icons class="icon-right" color="#00000000" size="" type="loop" @click=""/>
      </view>
    </material-nav-bar>
    <material-list background-color="var(--md-sys-color-surface)" color="var(--md-sys-color-on-surface)">
      <material-list-cell :rightIcon="false" :showLeftText="false">
        <view class="content">
          <text>开启小部件</text>
          <async-switch :checked="hasWidget" @change="switchChange"/>
        </view>
      </material-list-cell>
    </material-list>
    <view class="tips">
      <text>
        为什么没法自动开启小部件？
        <br>
        不同手机厂商机制不同，比如小米系统需要手动授予桌面快捷方式权限。其他系统请自行尝试，存在不能自动创建小部件的情况，此时可以尝试在桌面手动创建小部件。
        <br>
        <uni-link href="https://www.baidu.cn" text="手动创建教程：点这儿"></uni-link>
      </text>
    </view>
  </view>
</template>

<script>
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import {SXData} from "@/components/material-uni/sx";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import {getTheme} from "@/components/material-uni/colors";
import AsyncSwitch from "@/components/helang-asyncSwitch/helang-asyncSwitch.vue";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    AsyncSwitch, MaterialListCell, MaterialList, MaterialNavBar
  },
  data() {
    return {
      theme:{},
      hasWidget: false,
    }
  },
  onShow() {
    // #ifdef APP-PLUS
    this.hasWidget = this.$manager.isWidgetAlreadyCreated()
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
      if (this.hasWidget === false) {
        // #ifdef APP-PLUS

        let res = this.$manager.createWidget()
        let value = JSON.parse(res)
        if (value.state === "error") {
          uni.showModal({
            title: '异常',
            showCancel: false,
            content: value.message,
            success: (res) => {

            }
          });
        } else if (value.state === "success") {
          uni.showModal({
            title: '提示',
            showCancel: false,
            content: value.message,
            success: (res) => {
              this.$manager.goHome()
            }
          });
        } else if (value.state === "need_permission") {
          uni.showModal({
            title: '提示',
            showCancel: false,
            content: "当前系统大概率为小米系统，需要手动授予桌面快捷方式权限，请授权后重试？",
            success: (res) => {
              this.$manager.getWidgetPermission()
            }
          });
        }

        // #endif
      } else {
        uni.showModal({
          title: '提示',
          showCancel: false,
          content: "安卓没有自动删除小部件的功能，请手动删除小部件。",
          success: (res) => {
            this.$manager.goHome()
          }
        });
      }
      // this.hasWidget = e.detail.value;
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