<template>
  <view :style="[theme,SXData]" class="container">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="var(--md-sys-color-on-primary)" size="" type="left"
                   @click="back"/>
        <text class="title">WIFI认证</text>
        <uni-icons class="icon-right" color="#ffffff00" size="" type="loop"/>
      </view>
    </material-nav-bar>
    <material-list backgroundColor="var(--md-sys-color-surface)" color="var(--md-sys-color-on-surface)">
      <material-list-cell :rightIcon="false" :showLeftText="false" >
        <view class="content">
          <text>开启WIFI认证</text>
          <async-switch :checked="hasWidget" @change="switchChange"/>
          <!--          <switch v-else :checked="false" @change="switchChange"/>-->
        </view>
      </material-list-cell>

      <material-list-cell :rightIcon="false" :showLeftText="false">
        <view class="content">
          <text>悬浮窗权限：必要</text>
          <async-switch :checked="canOverlay" @change="switchPermission"/>
          <!--          <switch v-else :checked="false" @change="switchPermission"/>-->
        </view>
      </material-list-cell>

      <material-list-cell v-if="hasWidget" :showLeftText="false" backgroundColor="var(--md-sys-color-primary-container)"
                          color="var(--md-sys-color-surface-container)"
                          @click="pickType = true">
        <view class="content">
          <view class="title">类型：{{ typeName }}</view>
        </view>
      </material-list-cell>
    </material-list>
    <view class="tips">
      <text>
        第一次使用本功能？
        <br>
        <uni-link href="https://www.bilibili.com/video/BV1KiHVzQEDr/" text="你最好看看教程——我是说点这里！"/>
      </text>
    </view>
    <u-picker :closeOnClickOverlay="true" :columns="typeNames" :show="pickType" style="position: absolute;"
              @cancel="typeConfirm" @change="selectType" @close="typeConfirm"
              @confirm="typeConfirm"/>
  </view>
</template>

<script>
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import UniEasyinput from "@/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue";
import UniPopup from "@/uni_modules/uni-popup/components/uni-popup/uni-popup.vue";
import UniNavBar from "@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue";
import UniTable from "@/uni_modules/uni-table/components/uni-table/uni-table.vue";
import UniTr from "@/uni_modules/uni-table/components/uni-tr/uni-tr.vue";
import UniTd from "@/uni_modules/uni-table/components/uni-td/uni-td.vue";
import UniTh from "@/uni_modules/uni-table/components/uni-th/uni-th.vue";
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
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
    AsyncSwitch,
    MaterialListCell, MaterialList,
    MaterialNavBar,
    MaterialCard, UniTh, UniTd, UniTr, UniTable, UniNavBar, UniPopup, UniEasyinput, UniIcons
  },
  data() {
    return {
      theme: {},
      pickType: false,
      typeNames: [[
        "校园网",
        "移动",
        "电信"
      ]],
      typesMap: {
        "校园网": "",
        "移动": "@cmcc",
        "电信": "@telecom"
      },
      typeName: "校园网",
      typeId: "",
      hasWidget: false,
      canOverlay: false
    }
  },
  onShow() {
    // #ifdef APP-PLUS
    this.canOverlay = this.$manager.checkOverlayWindowPermission()
    this.hasWidget = this.$manager.isWifiAuthWidgetAlreadyCreated()
    this.typeId = this.$manager.getWifiAuthTupe()
    console.log(this.typeId)
    if (this.typeId) {
      for (let key in this.typesMap) {
        console.log(key, this.typeId, this.typesMap[key] === this.typeId)
        if (this.typesMap[key] === this.typeId) {
          this.typeName = key
          break
        }
      }
    }
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
    selectType({value}) {
      this.typeName = value[0];
    },
    typeConfirm() {
      this.pickType = false;
      if (this.typeId === this.typesMap[this.typeName]) {
        return;
      }
      this.typeId = this.typesMap[this.typeName];
      this.$manager.setWifiAuthTupe(this.typeId)
      // this.getClassRoom();
    },
    back() {
      uni.navigateBack();
    },
    switchPermission() {
      if (this.canOverlay == false) {
        this.$manager.requestOverlayWindowPermission().then(() => {
          this.canOverlay = true;
        }).catch(() => {
          this.canOverlay = false;
        })
      }
    },
    switchChange() {
      console.log(this.hasWidget)
      if (this.hasWidget == false) {
        let wait = new Promise((resolve, reject) => {
          uni.showModal({
            title: '警告',
            content: '使用此功能需要开启软件的本地密码储存权限，请确认是否开启？如果你不想开启，请关点击"取消"。\n注意：本功能的开关并不会影响本地密码的储存，如果您在确认使用此功能时还未开启本地密码的储存，请稍后去"设置-安全管理"中开启,并设法重新登录一次账号。',
            success: (res) => {
              if (res.confirm) {
                resolve(true)
              } else if (res.cancel) {
                reject(false)
              }
            },
            fail: (res) => {
              reject(res)
            }
          });
        });
        wait.then(() => {
          // #ifdef APP-PLUS
          let res = this.$manager.createWifiAuthWidget()
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
                this.hasWidget = true;
                this.$manager.goHome()
              }
            });
          } else if (value.state === "need_permission") {
            uni.showModal({
              title: '提示',
              showCancel: false,
              content: "当前系统大概率为小米系统，需要手动授予桌面快捷方式权限，请授权后重试？",
              success: (res) => {
                this.$manager.getWifiAuthWidgetPermission()
              }
            });
          }
          // #endif
        }).catch((err) => {
          this.hasWidget = false
          return
        })
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