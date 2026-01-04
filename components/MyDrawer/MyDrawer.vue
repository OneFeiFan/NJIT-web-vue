<template>
  <Drawer :value="opened" @onClose="onClose">
    <view class="menu">
      <touch-ripple class="wrap"
                    color="var(--md-sys-color-on-tertiary)"
                    backgroundColor="var(--md-sys-color-tertiary)">
        <status-bar/>
          <view class="container">
            <image src="@/static/logo.png" class="logo"/>
            <text class="text">你的门户<br/>Made By OneFeiFan</text>
          </view>
      </touch-ripple>
      <scroll-view scroll-y="true" class="scroll-table">
        <material-list color="var(--md-sys-color-on-surface)">
          <material-list-cell rightIcon @click="jump(`share`)">
            <text>分享</text>
          </material-list-cell>
          <!--          <material-list-cell rightIcon @click="jump(`editcurriculums`)">-->
          <!--            <text>编辑课表</text>-->
          <!--          </material-list-cell>-->
          <material-list-cell rightIcon @click="jump(`classroom`)">
            <text>空教室查询</text>
          </material-list-cell>
          <!--          <material-list-cell rightIcon @click="jump(`evaluate`)" color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250" backgroundColor="var(--md-sys-color-surface-container)">-->
          <!--            <text>快速评价</text>-->
          <!--          </material-list-cell>-->
          <material-list-cell rightIcon @click="jump(`scores`)">
            <text>成绩查询</text>
          </material-list-cell>

          <material-list-cell rightIcon @click="jump(`academicprogress`)">
            <text>学业进度</text>
          </material-list-cell>
                    <material-list-cell rightIcon @click="jump(`test`)">
                      <text>测试</text>
                    </material-list-cell>
          <!--  #ifdef APP-PLUS  -->
          <material-list-cell rightIcon @click="jump(`usermanager`)">
            <text>用户管理</text>
          </material-list-cell>
          <material-list-cell rightIcon @click="jump(`WifiAuthenticator`)">
            <text>WIFI认证</text>
          </material-list-cell>
          <material-list-cell rightIcon @click="jump(`killyiban`)">
            <text>易班签到</text>
          </material-list-cell>
          <!--   #endif   -->
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
  height: 100vh;
  background: var(--md-sys-color-surface);
  display: flex;
  flex-direction: column;

  .container {
    background: #ffffff00;
    height: calc(100% - var(--status-bar-height));
    width: 100%;
    padding: sx(5);
    box-sizing: border-box;
    display: flex;
  }

  .logo {
    height: sx(15);
    width: sx(15);
  }

  .text {
    font-size: sx(4);
    font-weight: bold;
  }

  /* 竖屏样式 */
  @media (orientation: portrait) {
    .wrap {
      flex: 0.2;
    }
    .container {
      flex-direction: column;
      justify-content: space-around;
    }
    .scroll-table {
      flex: 0.8;
      overflow: hidden;
    }
  }

  /* 横屏样式 */
  @media (orientation: landscape) {
    .wrap {
      flex: 0.3;
    }
    .container {
      flex-direction: row;
      align-items: center;

      .text {
        margin-left: sx(4);
      }
    }
    .scroll-table {
      flex: 0.7;
      overflow: hidden;
    }
  }
}
</style>