<template>
  <view class="container" :style="themeStyle">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="#00000000" size="" type="bars" @click="isDrawerOpen = true" />
        <text class="title">个人中心</text>
        <uni-icons class="icon-right" color="#00000000" size="" type="loop" @click=""/>
      </view>
    </material-nav-bar>

    <scroll-view scroll-y="true" class="scroll-table">
      <view class="card-section">
        <material-card background-color="var(--md-sys-color-surface-container-low)" color="var(--md-sys-color-on-surface-variant)">
          <view class="user-card-inner">
            <view class="user-main">
              <text class="user-name">{{ userInfo.name }}</text>
              <text class="user-id">学号：{{ userInfo.id }}</text>
            </view>
            
            <view class="user-divider" />
            
            <view class="user-gpa-box">
              <text class="gpa-label">当前学分绩点</text>
              <text class="gpa-value">{{ userInfo.gpa }}</text>
            </view>
          </view>
        </material-card>
      </view>

      <view class="menu-section">
        <view class="menu-group-title">教务功能</view>
        <material-list background-color="var(--md-sys-color-surface)" color="var(--md-sys-color-on-surface)">
          <material-list-cell rightIcon @click="jump('exam')">
            <text>考试信息</text>
          </material-list-cell>
          <material-list-cell rightIcon @click="jump('classroom')">
            <text>空教室查询</text>
          </material-list-cell>
          <material-list-cell rightIcon @click="jump('academicprogress')">
            <text>学业进度</text>
          </material-list-cell>
          <material-list-cell rightIcon @click="jump('killyiban')">
            <text>易班签到</text>
          </material-list-cell>
          <material-list-cell rightIcon @click="jump('WifiAuthenticator')">
            <text>WIFI认证</text>
          </material-list-cell>
        </material-list>

        <view class="menu-group-title">账号与应用</view>
        <material-list background-color="var(--md-sys-color-surface)" color="var(--md-sys-color-on-surface)">
          <material-list-cell rightIcon @click="jump('usermanager')">
            <text>用户管理</text>
          </material-list-cell>
          <material-list-cell rightIcon @click="jump('share')">
            <text>分享</text>
          </material-list-cell>
          <material-list-cell rightIcon @click="jumpSetting">
            <text>设置</text>
          </material-list-cell>
        </material-list>
      </view>
    </scroll-view>

<!--    <my-drawer :opened="isDrawerOpen" @onClose="isDrawerOpen = false" />-->
    <sv-intercept-back :show="isDrawerOpen" :beforeIntercept="() => { isDrawerOpen = false }" />

    <material-tab-bar color="var(--md-sys-color-outline)" />
  </view>
</template>

<script>
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import MaterialTabBar from "@/components/material-uni/material-tab-bar/material-tab-bar.vue";
import MyDrawer from "@/components/MyDrawer/MyDrawer.vue";
import SvInterceptBack from "@/uni_modules/sv-intercept-back/components/sv-intercept-back/sv-intercept-back.vue";

export default {
  components: {
    MaterialNavBar,
    MaterialCard,
    MaterialList,
    MaterialListCell,
    MaterialTabBar,
    MyDrawer,
    SvInterceptBack
  },
  data() {
    return {
      isDrawerOpen: false,
      userInfo: {
        name: "请登录",
        id: "******",
        gpa: "-"
      }
    };
  },
  onShow() {
    // Tab页激活时隐藏原生全局导航栏
    uni.hideTabBar();
    this.loadActiveUser();
  },
  methods: {
    loadActiveUser() {
      let users = {};

      //#ifdef APP-PLUS
      if (this.$manager && this.$manager.getAllUsers) {
        try {
          users = JSON.parse(this.$manager.getAllUsers() || '{}');
        } catch (e) {
          console.error("解析用户数据失败", e);
        }
      }
      //#endif

      //#ifdef H5
      users = {
        "111": { "current": true, "name": "陆威帆", "gpa": "3.95" },
        "222": { "current": false, "name": "测试账户", "gpa": "3.13" }
      };
      //#endif

      // 遍历提取当前激活的用户
      let activeUser = { name: "", id: "", gpa: "" };
      for (const id in users) {
        if (users[id].current) {
          activeUser = {
            id: id,
            name: users[id].name,
            gpa: users[id].gpa
          };
          break;
        }
      }

      this.userInfo = activeUser;
    },
    jump(page) {
      uni.navigateTo({
        url: `/pages/${page}/${page}`
      });
    },
    jumpSetting() {
      uni.navigateTo({
        url: `/pages/settings/settings`
      });
    },
    handleShare() {
      // 分享功能具体的业务调用接口
      this.$emit('share');
    }
  }
};
</script>

<style lang="scss" scoped>

.container {
  height: 100vh;
  background-color: var(--md-sys-color-surface);
  display: flex;
  flex-direction: column;
}

.scroll-table {
  /* 高度精确计算：减去状态栏、导航栏(15)以及底部自定义Tab栏(15)的高度 */
  height: calc(100vh - var(--status-bar-height) - sx(30));
  box-sizing: border-box;
}

.card-section {
  padding: sx(6.5);
  
  .user-card-inner {
    display: flex;
    flex-direction: column;
    padding: sx(6.5);
    box-sizing: border-box;
  }

  .user-main {
    display: flex;
    flex-direction: column;
    margin-bottom: sx(4);

    .user-name {
      font-size: sx(8);
      font-weight: 700;
      color: var(--md-sys-color-on-surface);
      line-height: 1.2;
      margin-bottom: sx(1.5);
    }

    .user-id {
      font-size: sx(4);
      color: var(--md-sys-color-on-surface-variant);
    }
  }

  .user-divider {
    height: max(sx(0.25), 0.5px);
    background-color: color-mix(in srgb, var(--md-sys-color-outline-variant) 35%, transparent);
    margin-bottom: sx(4);
  }

  .user-gpa-box {
    display: flex;
    flex-direction: column;

    .gpa-label {
      font-size: sx(3.5);
      color: var(--md-sys-color-on-surface-variant);
      margin-bottom: sx(1);
    }

    .gpa-value {
      font-size: sx(9);
      font-weight: 700;
      color: var(--md-sys-color-primary);
      line-height: 1;
    }
  }
}

.menu-section {
  padding-bottom: sx(10);

  .menu-group-title {
    font-size: sx(3.5);
    font-weight: 700;
    color: var(--md-sys-color-on-surface-variant);
    padding: sx(4) sx(6.5) sx(2) sx(6.5);
  }
}
</style>