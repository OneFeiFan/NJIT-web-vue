<template>
  <view :style="[theme,SXData]" class="content">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="var(--md-sys-color-on-primary)" size="" type="left"
                   @click="back"/>
        <text class="title">FAQ</text>
        <uni-icons class="icon-right" color="#00000000" size="" type="loop" @click=""/>
      </view>
    </material-nav-bar>
    <scroll-view scroll-y="true" class="scroll-table">
      <zero-markdown-view :markdown="content" themeColor="#000"/>
    </scroll-view>
  </view>
</template>

<script>
//#ifdef H5
import {http} from "@/static/util/request";
//#endif
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import {SXData} from "@/components/material-uni/sx";
import {getTheme} from "@/components/material-uni/colors";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {MaterialNavBar},
  data() {
    return {
      theme: {},
      content:  `<p align="center">不晓得为啥,没获取到数据QAQ</p>`
    }
  },
  onLoad() {
    this.refreshTheme();
    //#ifdef APP-PLUS
    uni.request({
      url: "https://gitee.com/OneFeiFan/fxxking-NJIT/raw/master/markdown.json",
      header: {
        "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
        "Accept": "*/*",
        "Host": "gitee.com",
        "Connection": "keep-alive"
      },
      success: (res) => {
        if(res.statusCode === 200){
          this.content = `${res.data.FAQ}`;
        }
      }
    });
    //#endif
    //#ifdef H5
    http.get("/gitee?url=https://gitee.com/OneFeiFan/fxxking-NJIT/raw/master/markdown.json")
        .then(res => {
          this.content = `${JSON.parse(res.data).FAQ}`;
        })
        .catch(err => {
          console.log(err);
        });
    //#endif
  },
  methods: {
    refreshTheme() {
      this.theme = getTheme()
    },
    back() {
      uni.navigateBack();
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
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);

  .scroll-table {
    flex: 1;
    overflow: hidden;
  }
}
</style>
