<template>
  <view class="container" :style="themeStyle">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons color="var(--md-sys-color-on-primary)" size="" type="bars" @click="isDrawerOpen = true"
                   class="icon-left"/>
        <view class="title">Hello 正方</view>
        <uni-icons class="icon-right" color="#00000000" size="" type="loop" @click=""/>
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
    <MyDrawer :opened="isDrawerOpen" @onClose="isDrawerOpen = false"/>
    <sv-intercept-back :show="isDrawerOpen" :beforeIntercept="()=>{isDrawerOpen = false}"/>
    <material-tab-bar color="var(--md-sys-color-outline)"/>
  </view>
</template>

<script>
//#ifdef H5
import {http} from "@/static/util/request";
//#endif
import MaterialTabBar from "@/components/material-uni/material-tab-bar/material-tab-bar.vue";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import SvInterceptBack from "@/uni_modules/sv-intercept-back/components/sv-intercept-back/sv-intercept-back.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import {SXData} from "@/components/material-uni/sx";
import MyDrawer from "@/components/MyDrawer/MyDrawer.vue";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    MyDrawer,
    MaterialList,
    MaterialListCell,
    SvInterceptBack,
    MaterialNavBar,
    MaterialTabBar
  },
  data() {
    return {
      isDrawerOpen: false,
      noticeInformation: '此功能因为某些原因下线。。。'
    }
  },
  onLoad() {
  },
  onShow() {
    // #ifdef APP-PLUS
    // this.$manager.getNoticeInformation().then(res => {
		// if (res.code === 200) {
		//   this.noticeInformation = res.data;
		// }else{
		// 	this.noticeInformation = "不晓得为啥,没获取到数据QAQ";
		// }
    // })
    // #endif

    // #ifdef H5
    http.get("/getNotice")
        .then(res => {
          if (res.code === 200) {
            this.noticeInformation = res.data;
          }else{
			this.noticeInformation = "获取失败";
		}
        })
        .catch(err => {
          console.log(err);
        });
    // #endif
  },
  methods: {
  }
}
</script>

<style lang="scss">
.container {
  height: 100vh;
  //width: 100vw;
  background-color: var(--md-sys-color-surface);

  .scroll-view {
    height: calc(100vh - var(--status-bar-height) - sx(30));
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
