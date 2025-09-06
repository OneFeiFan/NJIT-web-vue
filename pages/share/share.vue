<template>
  <view class="container" :style="[theme,SXData]">
    <material-nav-bar>
      <view class="nav-bar">
        <uni-icons type="left" size="" @click="back" color="var(--md-sys-color-on-secondary-container)"
                   class="icon-left"/>
        <text class="title">分享软件</text>
        <uni-icons type="loop" size="" color="#ffffff00" class="icon-right"/>
      </view>
    </material-nav-bar>
    <view class="content">
      <material-card class="wrap">
        <text>
          觉得软件实用的话可以和同学分享一下哦。
        </text>
        <image src="@/static/qq.jpg" mode="widthFix">

        </image>
      </material-card>
    </view>
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

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    MaterialListCell, MaterialList,
    MaterialNavBar,
    MaterialCard, UniTh, UniTd, UniTr, UniTable, UniNavBar, UniPopup, UniEasyinput, UniIcons
  },
  data() {
    return {
      theme: {}
    }
  },
  onShow() {
  },
  onLoad() {
    this.refreshTheme()
  },
  methods: {
    refreshTheme() {
      this.theme = getTheme()
    },
    back() {
      uni.navigateBack();
    },
  }
}
</script>

<style lang="scss">
.container {
  background-color: var(--md-sys-color-primary-container);
  height: 100vh;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: calc(100% - sx(10) - var(--status-bar-height));
  margin-left: sx(6.5);
  margin-right: sx(6.5);
  font-size: sx(5);
  color: var(--md-sys-color-on-primary-container);

  .wrap {
    padding: sx(5);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
  }
}
</style>