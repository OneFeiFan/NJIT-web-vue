<template>
  <Drawer :value="opened" @onClose="onClose">
    <view class="menu">
      <touch-ripple id="menu-top" color="var(--md-sys-color-primary-fixed)"
                    backgroundColor="var(--md-sys-color-tertiary)">
        <status-bar backgroundColor="var(--md-sys-color-on-tertiary-container)"></status-bar>
        <view class="menu-content">
          <view class="container">
            <image src="@/static/logo.png" class="logo"></image>
            <text class="text">你的门户<br/>Made By OneFeiFan</text>
          </view>
        </view>
      </touch-ripple>
      <scroll-view scroll-y="true" class="scroll-table">
        <material-list>
          <material-list-cell rightIcon @click="jump(`share`)">
            <text>分享</text>
          </material-list-cell>
          <material-list-cell rightIcon @click="jump(`editcurriculums`)">
            <text>编辑课表</text>
          </material-list-cell>
          <material-list-cell rightIcon @click="jump(`classroom`)">
            <text>空教室查询</text>
          </material-list-cell>
          <!--          <material-list-cell rightIcon @click="jump(`evaluate`)" color="var(&#45;&#45;md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250" backgroundColor="var(&#45;&#45;md-sys-color-surface-container)">-->
          <!--            <text>快速评价</text>-->
          <!--          </material-list-cell>-->
          <material-list-cell rightIcon @click="jump(`scores`)">
            <text>成绩查询</text>
          </material-list-cell>

          <material-list-cell rightIcon @click="jump(`academicprogress`)">
            <text>学业进度</text>
          </material-list-cell>
<!--          <material-list-cell rightIcon @click="jump(`test`)">-->
<!--            <text>测试</text>-->
<!--          </material-list-cell>-->
          <material-list-cell rightIcon @click="jump(`usermanager`)">
            <text>用户管理</text>
          </material-list-cell>
          <material-list-cell rightIcon @click="jump(`WifiAuthenticator`)">
            <text>WIFI认证</text>
          </material-list-cell>
          <material-list-cell rightIcon @click="jump(`settings`)">
            <text>设置</text>
          </material-list-cell>
        </material-list>
      </scroll-view>
    </view>
  </Drawer>
</template>


<script>
import StatusBar from "@/components/material-uni/status-bar/status-bar.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import Drawer from "@/components/material-uni/drawer/drawer.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import TouchRipple from "@/components/material-uni/ripple/component.vue";

export default {
  name: "MyDrawer",
  components: {TouchRipple, MaterialList, Drawer, MaterialListCell, StatusBar},
  props: {
    opened: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    aderror(e) {
      console.log(e)
    },
    closeAd() {
      console.log('closeAd')
    },
    onClose() {
      this.$emit("onClose");
    },
    jump(page) {
      console.log(page)
      this.$emit("onClose");
        uni.navigateTo({
          url: `/pages/${page}/${page}`
        });
    },
  }
}
</script>


<style scoped lang="scss">
.menu {

  /* 竖屏样式（默认） */
  @media (orientation: portrait) {
    height: 100vh;
    width: 100%;
    background: var(--md-sys-color-surface);
    display: flex;
    flex-direction: column;

    .scroll-table {
      height: calc(100% - 35vmin - var(--status-bar-height));
    }

    .menu-content {
      background-color: #ffffff00;
      height: 35vmin;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .container {
        background-color: #ffffff00;
        width: calc(100% - 7vmin);
        height: calc(100% - 7vmin);
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .logo {
          height: 15vmin;
          width: 15vmin;
        }

        .text {
          color: var(--md-sys-color-on-tertiary);
          font-weight: bold;
          font-size: 3.5vmin;
        }
      }
    }
  }

  /* 横屏样式（默认） */
  @media (orientation: landscape) {
    height: 100vh;
    width: 100%;
    background: var(--md-sys-color-surface);
    display: flex;
    flex-direction: column;

    .scroll-table {
      height: calc(100% - 20vmin - var(--status-bar-height));
    }

    .menu-content {
      background-color: #ffffff00;
      height: 20vmin;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .container {
        background-color: #ffffff00;
        width: calc(100% - 7vmin);
        height: calc(100% - 7vmin);
        display: flex;
        align-items: center;

        .logo {
          height: 12vmin;
          width: 12vmin;
        }

        .text {
          margin-left: 3.5vmin;
          color: var(--md-sys-color-on-tertiary);
          font-size: 3.5vmin;
          font-weight: bold;
        }
      }
    }
  }

  .close-icon {
    margin-top: 20rpx;
    margin-left: auto;
    margin-right: 20rpx;
  }

}
</style>