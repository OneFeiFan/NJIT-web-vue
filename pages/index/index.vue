<template>
   <page-meta :page-style="theme"></page-meta>
  <view class="content">
    <status-bar></status-bar>
    <view class="header">
      <image class="headimg" src="@/static/headimg.png" mode="aspectFit"></image>
      <text class="des">
        {{ "Made by " }}
        <a href="http://res.abeim.cn/api-qq?qq=3022504358" style="color: rgb(0, 0, 0);">OneFeiFan</a>
      </text>
      <text class="more">
        <uni-link href="https://gitee.com/OneFeiFan/u-coder-community" text="U-Coder社区" color="#007BFF"></uni-link>
        倾情奉献
      </text>
      <text class="more">
        感谢不愿透露姓名的神秘人开源前端
      </text>
    </view>
    <view class="footer">
      <zero-markdown-view :markdown="content" themeColor="#000"></zero-markdown-view>
      <fui-list>
        <fui-list-cell arrow @click="jump(`faq`)">
          <text>FAQ</text>
        </fui-list-cell>
        <fui-list-cell arrow @click="jump(`dev`)">
          <text>监督我开发</text>
        </fui-list-cell>
        <fui-list-cell arrow @click="jump(`privacy`)">
          <text>隐私政策</text>
        </fui-list-cell>
        <fui-list-cell arrow @click="jump(`about`)">
          <text>关于</text>
        </fui-list-cell>
      </fui-list>
    </view>
    <material-tab-bar color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250" backgroundColor="var(--md-sys-color-surface-container)"/>
  </view>
</template>

<script>

import ZeroMarkdownView from "@/uni_modules/zero-markdown-view/components/zero-markdown-view/zero-markdown-view.vue";
import FuiList from "@/components/fui-list/fui-list.vue";
import UniLink from "@/uni_modules/uni-link/components/uni-link/uni-link.vue";
import StatusBar from "@/components/status-bar/status-bar.vue";
import FuiListCell from "@/components/fui-list-cell/fui-list-cell.vue";
import MaterialTabBar from "@/components/material-uni/material-tab-bar/material-tab-bar.vue";

export default {
  components: {MaterialTabBar, FuiListCell, StatusBar, UniLink, FuiList, ZeroMarkdownView},
  data() {
    return {
      content: `<p align="center">不晓得为啥,没获取到数据QAQ</p>`,
      main: null,
    }
  },
  onLoad() {
    uni.request({
      url: "https://gitee.com/OneFeiFan/fxxking-NJIT/raw/master/markdown.json",
      header: {
        "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
        "Accept": "*/*",
        "Host": "gitee.com",
        "Connection": "keep-alive"
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.content = `${res.data.notice}`;
        }
      }
    });
  },
  methods: {
    jump(page) {
      uni.navigateTo({
        url: `/pages/${page}/${page}`
      });
    }
  }
}
</script>

<style lang="scss">
.content {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 60rpx;
    margin-left: auto;
    margin-right: auto;

    .headimg {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
    }

    .des {
      margin-top: 20rpx;
      font-weight: bold;
    }

    .more {
      margin-top: 20rpx;
    }
  }

  .body {
    //margin-top: 50rpx;
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .sketch {
      text-align: center;
    }
  }

}
</style>
