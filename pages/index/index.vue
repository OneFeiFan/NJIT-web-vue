<template>
  <view class="content">
    <view class="header">
      <image class="headimg" src="@/static/headimg.png" mode="aspectFit"></image>
      <text class="des">
        {{ "Made by " }}
        <a data-v-57280228="" href="http://res.abeim.cn/api-qq?qq=3022504358" style="color: rgb(0, 0, 0);">OneFeiFan</a>
      </text>
      <text class="more">
        <uni-link href="https://gitee.com/OneFeiFan/u-coder-community" text="U-Coder社区" color="#007BFF"></uni-link>
        版权所有
      </text>
      <text class="more">
        感谢<a href="http://res.abeim.cn/api-qq?qq=2954104636" style="color: #007BFF">徐佬</a>开源
      </text>
    </view>
    <view class="body">
      <text class="sketch">
        南工程小助手和内网教务系统双双归西，于是突发奇想爆改了徐老的前端，直接做了个C/S架构合并的简陋玩意。
      </text>
    </view>
    <view class="footer">
      <zero-markdown-view :markdown="main" themeColor="#000" style="text-align: center"></zero-markdown-view>
      <zero-markdown-view :markdown="content" themeColor="#000"></zero-markdown-view>
    </view>
  </view>
</template>

<script>
import UniEasyinput from "@/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue";

export default {
  components: {UniEasyinput},
  data() {
    return {
      content: null,
      main: null,
    }
  },
  onLoad() {
    this.main = `#### 注意

**当你发现反复出现登录数据异常，而且登录验证码不显示的情况，请看看你的网络是否通畅，如果网络是正常的，试试点击”复位“按钮，还不正常的可以关闭APP重启。**

*只花了3天赶工的小玩意，不要对它抱有期望，不喜勿喷。*`
    this.content = `待添加功能：

* 手动编辑课表
* 同时间段多课程兼容

> 牙膏就是要一点点挤
`
  },
  methods: {}
}
</script>

<style lang="scss">
.content {
  height: calc(100vh - var(--status-bar-height) - var(--tabbar-height));
  width: 100vw;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 100rpx;
    margin-left: auto;
    margin-right: auto;

    .headimg {
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
    }

    .des {
      margin-top: 20rpx;
      font-size: larger;
    }

    .more {
      margin-top: 20rpx;
    }
  }

  .body {
    margin-top: 100rpx;
    width: 80%;
    margin-left: auto;
    margin-right: auto;

    .sketch {
      text-align: center;
    }
  }

}
</style>
