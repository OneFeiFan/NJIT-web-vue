<template>
  <view :style="[theme,SXData]">
    <material-nav-bar>
      <view class="nav-bar">
        <uni-icons type="left" size="" @click="back" color="var(--md-sys-color-on-secondary-container)" class="icon-left"/>
        <text class="title">成绩查询</text>
        <uni-icons type="loop" size="" @click="" color="var(--md-sys-color-surface-container)" class="icon-right"/>
      </view>
    </material-nav-bar>
    <view class="select-bar">
      <picker mode="selector" :range="yearOptions" @change="onYearChange">
        <view class="select-item">学年：{{ selectedYear || '请选择' }}</view>
      </picker>
      <picker mode="selector" :range="termOptions" @change="onTermChange">
        <view class="select-item">学期：{{ selectedTerm || '请选择' }}</view>
      </picker>
      <view>
      <view class="select-item query-btn" @click="update(true)">查询</view>
      </view>
    </view>
    <scroll-view scroll-y="true" class="scroll-table">
      <slot v-for="(item, index) in tableData">
        <view class="content">
          <material-card width="100%" color="var(--md-sys-color-on-primary)"
                         :backgroundColor="item.jd === `0.00` ? 'var(--md-sys-color-tertiary-container)':'var(--md-sys-color-primary-container)'"
                         @click="getDetail(item.jxb_id,item.xnm,item.xqm,item.kcmc)">
            <view class="card-content"
                  :style="{color: item.jd === `0.00`?'var(--md-sys-color-on-tertiary-container)':'var(--md-sys-color-on-primary-container)'}">
              <view class="time">
                {{ item.xnmmc }}
                <uni-icons v-if="item.jd !== `0.00`" type="checkbox-filled" :size="mx(8)"
                           color="var(--md-sys-color-on-primary-container)" @click="update" class="icon-right"/>
                <uni-icons v-if="item.jd === `0.00`" type="clear" :size="mx(8)"
                           color="var(--md-sys-color-on-tertiary-container)" @click="update" class="icon-right"/>
              </view>
              <view class="name">
                {{ item.kcmc }}
              </view>
              <view class="score">
                成绩：{{ item.cj }}{{ " " }}学分：{{ item.xf }}
              </view>

              <view class="teacher">
                {{ item.jsxm }}
              </view>
            </view>
          </material-card>
        </view>

      </slot>

    </scroll-view>
    <uni-popup ref="detail">
      <view class="detail-modal" :mask-click="false">
        <view class="name">{{ className }}</view>
        <uni-table border stripe emptyText="暂无更多数据">
          <uni-tr>
            <uni-th width="1" align="center">成绩分项</uni-th>
            <uni-th width="1" align="center">成绩分项比例</uni-th>
            <uni-th width="1" align="center">成绩</uni-th>
          </uni-tr>
          <uni-tr v-for="(item, index) in detail" :key="index">
            <uni-td align="center">{{ item.scoreItem }}</uni-td>
            <uni-td align="center">{{ item.percentage }}</uni-td>
            <uni-td align="center">{{ item.score }}</uni-td>
          </uni-tr>
        </uni-table>
        <button class="ok" type="primary" @click="cancel">确认</button>
      </view>
    </uni-popup>
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
import {mx, SXData} from "@/components/material-uni/sx";
import {getTheme} from "@/components/material-uni/colors";
import {http} from "@/static/util/request";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    MaterialNavBar, MaterialCard, UniTh, UniTd, UniTr, UniTable, UniNavBar, UniPopup, UniEasyinput, UniIcons
  },
  data() {
    return {
      theme:{},
      className: 'test',
      detail: [],
      tableData: [{
        "kcgsmc": "",
        "xnmmc": "未知",
        "cj": "",
        "bfzcj": "",
        "jxb_id": "",
        "xf": "未知",
        "jsxm": "无任课教师",
        "xqm": "",
        "xnm": "2022",
        "kclbmc": "",
        "ksxz": "",
        "jd": "",
        "xqmmc": "",
        "kcmc": "请查询数据"
      }],
      yearOptions: ['2026-2027','2025-2026','2024-2025','2023-2024','2022-2023', '2021-2022', '2020-2021','2019-2020'], // 学年选项
      termOptions: ['第一学期', '第二学期'], // 学期选项
      selectedYear: '',
      selectedTerm: '',
    }
  },
  onReady() {
    this.update(false)
  },
  onLoad() {
    this.refreshTheme()
  },
  methods: {
    mx,
    refreshTheme(){
      this.theme = getTheme()
    },
    onYearChange(e) {
      this.selectedYear = this.yearOptions[e.detail.value];
    },
    onTermChange(e) {
      this.selectedTerm = this.termOptions[e.detail.value];
    },
    cancel() {
      this.$refs.detail.close();
    },
    back() {
      uni.navigateBack();
    },
    update(forceRefresh) {
      if(forceRefresh){
        uni.showLoading({
          title: '尝试刷新成绩'
        });
      }
      const year = this.selectedYear.split('-')[0];
      const term = this.selectedTerm === '第一学期' ? '3' : '12';
      http.post("/getAllSorces",{xnm:year,xqm:term,forceRefresh}).
      then(res=>{
        if(forceRefresh){
          setTimeout(()=>{
            uni.showToast({
              title: '成功',
              duration: 2000
            });
          },500)
        }
        this.tableData = res.data;
      }).
      catch(res=>{
        console.log(res)
        if(forceRefresh){
          setTimeout(()=>{
            uni.showToast({
              title: '失败',
              icon:"error",
              duration: 2000
            });
          },500)
        }
      }).
      finally(()=>{
        uni.hideLoading()
      })

      // this.$manager.getAllSorces(refresh).then(res => {
      //   this.tableData = JSON.parse(res).data;
      //   this.tableData = this.tableData.reverse()
      //   console.log(this.tableData)
      // }).catch(err => {
      //   console.error(err)
      //   // uni.hideLoading();
      //   uni.showToast({
      //     title: '获取成绩失败',
      //     icon: 'error',
      //     duration: 2000
      //   });
      // })
    },
    getDetail(id, xnm, xqm, kcmc) {
      // uni.showLoading({
      //   title: '加载详细信息'
      // });
      // this.className = kcmc;
      // this.$manager.getSorcesDetail(id, xnm, xqm, kcmc).then(res => {
      //   console.log(res)
      //   this.detail = JSON.parse(res)
      //
      //   uni.hideLoading();
      //   this.$refs.detail.open('center');
      // }).catch(err => {
      //   console.error(err)
      //   uni.hideLoading();
      //   uni.showToast({
      //     title: '获取成绩失败',
      //     icon: 'error',
      //     duration: 2000
      //   });
      // })
    }
  }
}
</script>

<style lang="scss">
.select-bar {
  display: flex;
  height: sx(10);
  background-color: var(--md-sys-color-surface-container);
  align-items: center;

  .select-item {
    flex: 1;
    height: 100%;
    margin-left: sx(2.5);
    padding: 0 sx(2.5);
    background-color: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
    border-radius: 8rpx;
    text-align: center;
  }

  .query-btn {
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }
}
//.select {
//  .group {
//    margin-top: 40rpx;
//    display: flex;
//
//    .select-scroll {
//      white-space: nowrap;
//      width: 100%;
//    }
//
//    .select-item {
//      display: inline-block;
//      width: 150rpx;
//      text-align: center;
//      border-right: #3a3a3a solid 1px;
//
//      &:first-child {
//        border-left: #3a3a3a solid 1px;
//      }
//
//      .text {
//        width: 100%;
//        text-align: center;
//        font-size: 40rpx;
//        color: #959595;
//      }
//    }
//
//    .active {
//      background-color: #cdcfd5;
//
//      .text {
//        color: #5489f5;
//      }
//    }
//  }
//}

.scroll-table {
  height: calc(100vh - sx(20) - var(--status-bar-height));

  .color-red {
    color: red;
  }
}

.btn-evaluate {
  //width: 30rpx;
  //height: 60rpx;
  font-size: 30rpx;
}

.detail-modal {
  border-radius: 20rpx;
  border: 1px #fff solid;
  background-color: #fff;
  width: 90vw;

  .name {
    height: 50rpx;
    width: 100%;
    font-size: 35rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ok {
    margin: 0 auto;
    width: 90%;
  }
}

.content {
  padding-left: sx(2.5);
  padding-right: sx(2.5);
  margin-top: sx(2.5);

  .card-content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    padding: sx(2.5);

    .time {
      display: flex;
      justify-content: space-between;
      font-size: sx(6.5);
      font-weight: bold;
    }

    .name {
      font-size: sx(6.5);
      font-weight: bold;
      display: inline-block;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .score {
      font-weight: bold;
    }

    .teacher {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>