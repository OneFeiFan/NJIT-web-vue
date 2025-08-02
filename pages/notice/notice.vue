<template>
  <view class="container" :style="[getTheme(),SXData]">
    <material-nav-bar>
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
    <MyDrawer :opened="isDrawerOpen" @onClose="isDrawerOpen = false"/>
    <sv-intercept-back
        :show="menu"
        :beforeIntercept="closeMenu"
    />
    <material-tab-bar/>
  </view>
</template>

<script>

import ZeroMarkdownView from "@/uni_modules/zero-markdown-view/components/zero-markdown-view/zero-markdown-view.vue";
import UniLink from "@/uni_modules/uni-link/components/uni-link/uni-link.vue";
import MaterialTabBar from "@/components/material-uni/material-tab-bar/material-tab-bar.vue";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import SvInterceptBack from "@/uni_modules/sv-intercept-back/components/sv-intercept-back/sv-intercept-back.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import TouchRipple from "@/components/material-uni/ripple/component.vue";
import Drawer from "@/components/material-uni/drawer/drawer.vue";
import {SXData} from "@/components/material-uni/sx";
import {getTheme} from "@/components/material-uni/colors";
import StatusBar from "@/components/material-uni/status-bar/status-bar.vue";


export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    StatusBar,
    Drawer,
    MaterialList,
    MaterialListCell,
    SvInterceptBack,
    UniIcons, MaterialNavBar, MaterialTabBar, UniLink, ZeroMarkdownView, TouchRipple
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
    getTheme,
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
</style>
