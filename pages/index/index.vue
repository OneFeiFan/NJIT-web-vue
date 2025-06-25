<template>
  <page-meta :page-style="theme"></page-meta>
  <sx class="container">
    <material-nav-bar color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250"
                      backgroundColor="var(--md-sys-color-surface-container)">
      <view class="nav-bar">
        <uni-icons type="bars" size="" @click="isDrawerOpen = true" color="var(--md-sys-color-on-surface)"
                   class="icon-left"/>

        <view class="title">Hello 方正</view>

        <uni-icons type="loop" size="" @click="" class="icon-right"
                   color="rgba(255, 255, 255, 0)"/>
      </view>
    </material-nav-bar>

    <scroll-view scroll-y="true" class="scroll-view">

      <view class="notice-container">
        <view class="notice-card">
          <text class="title">通知</text>
          <text class="content">
            {{ noticeInformation }}
          </text>
        </view>
      </view>
    </scroll-view>
    <!--    <view class="header">-->
    <!--      <image class="headimg" src="@/static/headimg.png" mode="aspectFit"></image>-->
    <!--      <text class="des">-->
    <!--        {{ "Made by " }}-->
    <!--        <a href="http://res.abeim.cn/api-qq?qq=3022504358" style="color: rgb(0, 0, 0);">OneFeiFan</a>-->
    <!--      </text>-->
    <!--      <text class="more">-->
    <!--        <uni-link href="https://gitee.com/OneFeiFan/u-coder-community" text="U-Coder社区" color="#007BFF"></uni-link>-->
    <!--        倾情奉献-->
    <!--      </text>-->
    <!--      <text class="more">-->
    <!--        感谢不愿透露姓名的神秘人开源前端-->
    <!--      </text>-->
    <!--    </view>-->
    <!--    <view class="footer">-->
    <!--      <zero-markdown-view :markdown="content" themeColor="#000"></zero-markdown-view>-->
    <!--      <fui-list>-->
    <!--        <fui-list-cell arrow @click="jump(`faq`)">-->
    <!--          <text>FAQ</text>-->
    <!--        </fui-list-cell>-->
    <!--        <fui-list-cell arrow @click="jump(`dev`)">-->
    <!--          <text>监督我开发</text>-->
    <!--        </fui-list-cell>-->
    <!--        <fui-list-cell arrow @click="jump(`privacy`)">-->
    <!--          <text>隐私政策</text>-->
    <!--        </fui-list-cell>-->
    <!--        <fui-list-cell arrow @click="jump(`about`)">-->
    <!--          <text>关于</text>-->
    <!--        </fui-list-cell>-->
    <!--      </fui-list>-->
    <!--    </view>-->
    <Drawer :value="isDrawerOpen" @onClose="() => { isDrawerOpen = false }">
      <view class="menu" @click.stop="">
        <touch-ripple id="menu-top" color="var(--md-sys-color-primary-fixed)" :opacity="0.4"
                      transition="ease-out" :duration="250">
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
            <material-list-cell rightIcon @click="jump(`classroom`)"
                                color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out"
                                :duration="250" backgroundColor="var(--md-sys-color-surface-container)">
              <text>空教室查询</text>
            </material-list-cell>
            <!--          <material-list-cell rightIcon @click="jump(`evaluate`)" color="var(&#45;&#45;md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250" backgroundColor="var(&#45;&#45;md-sys-color-surface-container)">-->
            <!--            <text>快速评价</text>-->
            <!--          </material-list-cell>-->
            <material-list-cell rightIcon @click="jump(`scores`)" color="var(--md-sys-color-primary-fixed)"
                                :opacity="0.4" transition="ease-out" :duration="250"
                                backgroundColor="var(--md-sys-color-surface-container)">
              <text>成绩查询</text>
            </material-list-cell>
            <!--          <material-list-cell rightIcon @click="jump(`curriculums_test`)" color="var(&#45;&#45;md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250" backgroundColor="var(&#45;&#45;md-sys-color-surface-container)">-->
            <!--            <text>测试</text>-->
            <!--          </material-list-cell>-->
            <material-list-cell rightIcon @click="jump(`usermanager`)"
                                color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out"
                                :duration="250" backgroundColor="var(--md-sys-color-surface-container)">
              <text>用户管理</text>
            </material-list-cell>
            <material-list-cell rightIcon @click="jump(`settings`)"
                                color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out"
                                :duration="250" backgroundColor="var(--md-sys-color-surface-container)">
              <text>设置</text>
            </material-list-cell>
          </material-list>
        </scroll-view>
      </view>
    </Drawer>
    <sv-intercept-back
        :show="menu"
        :beforeIntercept="closeMenu"
    />
    <material-tab-bar id="tabbar" color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out"
                      :duration="250"
                      backgroundColor="var(--md-sys-color-surface-container)"/>
  </sx>
</template>

<script>

import ZeroMarkdownView from "@/uni_modules/zero-markdown-view/components/zero-markdown-view/zero-markdown-view.vue";
import FuiList from "@/components/fui-list/fui-list.vue";
import UniLink from "@/uni_modules/uni-link/components/uni-link/uni-link.vue";
// import StatusBar from "@/components/status-bar/status-bar.vue";
import FuiListCell from "@/components/fui-list-cell/fui-list-cell.vue";
import MaterialTabBar from "@/components/material-uni/material-tab-bar/material-tab-bar.vue";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import SvInterceptBack from "@/uni_modules/sv-intercept-back/components/sv-intercept-back/sv-intercept-back.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import TouchRipple from "@/components/material-uni/ripple/component.vue";
import Drawer from "@/components/material-uni/drawer/drawer.vue";
import sx from "@/components/material-uni/sx.vue"


export default {
  components: {
    sx,
    Drawer,
    MaterialList,
    MaterialListCell,
    SvInterceptBack,
    UniIcons, MaterialNavBar, MaterialTabBar, FuiListCell, UniLink, FuiList, ZeroMarkdownView, TouchRipple
  },
  data() {
    return {
      isDrawerOpen: false,
      content: `<p align="center">不晓得为啥,没获取到数据QAQ</p>`,
      main: null,
      menu: false,
      noticeInformation: '暂无信息',
      scrollHeight: 0,
      tabbar: null
    }
  },
  onLoad() {
    // uni.request({
    //   url: "https://gitee.com/OneFeiFan/fxxking-NJIT/raw/master/markdown.json",
    //   header: {
    //     // "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
    //     "Accept": "*/*",
    //     // "Host": "gitee.com",
    //     // "Connection": "keep-alive"
    //   },
    //   success: (res) => {
    //     if (res.statusCode === 200) {
    //       this.content = `${res.data.notice}`;
    //     }
    //   }
    // });
  },
  onResize() {
    // this.refreshScrollHeight()
  },
  onReady() {
    // this.tabbar = uni.createSelectorQuery().select('#tabbar')
    // this.refreshScrollHeight()
  },
  onShow() {
    this.$manager.getNoticeInformation().then(res => {
      this.noticeInformation = JSON.parse(res).data;
    })
  },
  methods: {
    refreshScrollHeight() {
      const systemInfo = uni.getSystemInfoSync();
      const windowHeight = systemInfo.windowHeight;
      const safeAreaHeight = systemInfo.safeArea.height;
      const navBar = parseInt(this.mx(10));
      const derta = safeAreaHeight - navBar - windowHeight;
      this.$nextTick(() => {
        this.tabbar.boundingClientRect((rect) => {
          this.scrollHeight = derta + rect.top;
        }).exec()
      })
    },
    jump(page) {
      this.isDrawerOpen = false;
      uni.navigateTo({
        url: `/pages/${page}/${page}`
      });
    },
    showMenu() {
      setTimeout(() => {
        const systemInfo = uni.getSystemInfoSync();
        let dom = uni.createSelectorQuery().in(this);
        dom.select("#menu-top").boundingClientRect()

        dom.exec((data) => {
          this.scrollHeight = systemInfo.windowHeight - data[0].bottom;
        })
      }, 200)

      this.menu = true;
      uni.hideTabBar({
        animation: true
      });
      this.$refs.menu.open();
    },
    closeMenu() {
      this.$refs.menu.close();
      // uni.showTabBar({
      //   animation: true
      // });
      this.menu = false;
    },
  }
}
</script>

<style lang="scss">
.container {
  height: 100vh;
  width: 100vw;
  background-color: var(--md-sys-color-surface);

  .scroll-view {
    height: calc(100vh - var(--status-bar-height) - sx(22));
  }
}

.notice-container {
  padding: sx(6.5);
  //background-color: #5ac725;
  .notice-card {
    width: 100%;
    background-color: var(--md-sys-color-secondary-container);
    box-sizing: border-box;
    color: var(--md-sys-color-on-secondary-container);
    display: flex;
    flex-direction: column;
    padding: sx(6.5);
    border-radius: sx(8);

    .title {
      font-size: sx(13);
      font-weight: bold;
    }

    .content {
      font-size: sx(6.5);
      margin-top: sx(6.5);
      font-weight: bold;
    }
  }
}

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
      background-color: var(--md-sys-color-tertiary);
      height: 35vmin;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .container {
        background-color: var(--md-sys-color-tertiary);
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
      background-color: var(--md-sys-color-tertiary);
      height: 20vmin;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .container {
        background-color: var(--md-sys-color-tertiary);
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
