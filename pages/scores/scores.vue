<template>
  <view class="container" :style="[theme,SXData]">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="var(--md-sys-color-on-primary)" size="" type="left"
                   @click="back"/>
        <text class="title">成绩查询</text>
        <uni-icons class="icon-right" color="#00000000" size="" type="loop" @click=""/>
      </view>
    </material-nav-bar>

    <view class="select-bar">
      <material-button
          background-color="var(--md-sys-color-primary-container)"
          color="var(--md-sys-color-on-primary-container)"
          shape="square"
          size="small">
        <picker :range="yearOptions" mode="selector" @change="onYearChange">
          <view class="select-item">学年：{{ selectedYear || '请选择' }}</view>
        </picker>
      </material-button>
      <material-button
          background-color="var(--md-sys-color-primary-container)"
          color="var(--md-sys-color-on-primary-container)"
          shape="square"
          size="small">
        <picker :range="termOptions" mode="selector" @change="onTermChange">
          <view class="select-item">学期：{{ selectedTerm || '请选择' }}</view>
        </picker>
      </material-button>
      <material-button
          background-color="var(--md-sys-color-primary-container)"
          color="var(--md-sys-color-on-primary-container)"
          shape="square"
          size="small"
          @click="update(true)">查询
      </material-button>
    </view>
    <scroll-view scroll-y="true" class="scroll-table">
      <view style="gap: 10px;display: flex;flex-direction: column;">
      <slot v-for="(item, index) in tableData">
        <view class="content">
          <material-card
              :backgroundColor="item.jd === `0.00` ? 'var(--md-sys-color-tertiary-container)':'var(--md-sys-color-primary-container)'"
              :color="item.jd === `0.00`?'var(--md-sys-color-on-tertiary-container)':'var(--md-sys-color-on-primary-container)'">
            <view class="card-content" @click="getDetail(item.jxb_id,item.xnm,item.xqm,item.kcmc)">
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
      </view>
    </scroll-view>

    <uni-popup ref="detail" type="center" :mask-click="false">
      <material-card background-color="var(--md-sys-color-surface-container-high)"
                     color="var(--md-sys-color-on-surface)">
        <view class="md-dialog-surface">
          <!-- 1. 弹窗标题 (Dialog Title) -->
          <view class="dialog-header">
            <text class="dialog-title">{{ className }}</text>
          </view>

          <!-- 2. 内容区域：使用列表代替表格 (Dialog Content) -->
          <view v-if="!detail || detail.length === 0" class="empty-state">
            <text>暂无更多数据</text>
          </view>

          <view v-else class="score-list">
            <view v-for="(item, index) in detail" :key="index" class="score-item">
              <!-- 左侧：分项名称与比例 -->
              <view class="item-main">
                <text class="item-name">{{ item.scoreItem }}</text>
                <view class="item-meta">
                  <uni-icons type="pie" size="12" color="var(--md-sys-color-on-surface-variant)"/>
                  <text class="meta-text">占比 {{ item.percentage }}</text>
                </view>
              </view>

              <!-- 右侧：具体分数 -->
              <view class="item-score-wrapper">
                <text class="score-value">{{ item.score }}</text>
                <text class="score-label">分</text>
              </view>
            </view>
          </view>
          <view class="dialog-actions">
            <material-button shape="square" size="medium" background-color="#ffffff00"
                             color="var(--md-sys-color-on-surface)" @click="cancel">
              确 认
            </material-button>
          </view>
      </view>
      </material-card>
    </uni-popup>

  </view>
</template>

<script>
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import {mx, SXData} from "@/components/material-uni/sx";
import {getTheme} from "@/components/material-uni/colors";
//#ifdef H5
import {http} from "@/static/util/request";
//#endif
import MaterialButton from "@/components/material-uni/material-button/material-button.vue";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    MaterialButton, MaterialNavBar, MaterialCard
  },
  data() {
    return {
      theme: {},
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
      yearOptions: ['2026-2027', '2025-2026', '2024-2025', '2023-2024', '2022-2023', '2021-2022', '2020-2021', '2019-2020'], // 学年选项
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
    refreshTheme() {
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
      if (forceRefresh) {
        uni.showLoading({
          title: '尝试刷新成绩'
        });
      }
      const year = this.selectedYear.split('-')[0];
      const term = this.selectedTerm === '' ? '' : this.selectedTerm === '第一学期' ? '3' : '12';
      // #ifdef APP-PLUS
      this.$manager.getSorces(year, term, forceRefresh).then(res => {
        this.tableData = JSON.parse(res).data;
        this.tableData = this.tableData.reverse()
      }).catch(err => {
        console.error(err)
        // uni.hideLoading();
        uni.showToast({
          title: '获取成绩失败',
          icon: 'error',
          duration: 2000
        });
      }).finally(() => {
        uni.hideLoading();
      })
      //#endif

      // #ifdef H5
      http.post("/getAllSorces", {xnm: year, xqm: term, forceRefresh}).then(res => {
        if (forceRefresh) {
          setTimeout(() => {
            uni.showToast({
              title: '成功',
              duration: 2000
            });
          }, 500)
        }
        this.tableData = res.data;
        this.tableData = this.tableData.reverse()
      }).catch(res => {
        console.log(res)
        if (forceRefresh) {
          setTimeout(() => {
            uni.showToast({
              title: '失败',
              icon: "error",
              duration: 2000
            });
          }, 500)
        }
      }).finally(() => {
        uni.hideLoading()
      })
      // #endif
    },
    getDetail(id, xnm, xqm, kcmc) {
      uni.showLoading({
        title: '加载详细信息'
      });
      this.className = kcmc;
      // #ifdef APP-PLUS
      this.$manager.getSorcesDetail(id, xnm, xqm, kcmc).then(res => {
        console.log(res)
        if (res.code === 200) {
          uni.hideLoading();
          this.detail = res.data;
          this.$refs.detail.open('center');
        }else{
          console.error(res.message)
          uni.showToast({
            title: '获取成绩失败',
            icon: 'error',
            duration: 2000
          });
        }
        // this.detail = JSON.parse(res)

        // uni.hideLoading();
        // this.$refs.detail.open('center');
      }).catch(err => {
        console.error(err)
        uni.showToast({
          title: '获取成绩失败',
          icon: 'error',
          duration: 2000
        });
      })
      //#endif
      // #ifdef H5
      http.post("/getSorcesDetail", {classId: id, schoolYear: xnm, semester: xqm, courseName: kcmc}).then(res => {
        if (res.code === 200) {
          uni.hideLoading();
          this.detail = res.data;
          this.$refs.detail.open('center');
        } else {
          uni.showToast({
            title: '获取成绩失败',
            icon: 'error',
            duration: 2000
          });
        }
        console.log(res)
      }).catch(res => {
        console.error(res)
        uni.showToast({
          title: '获取成绩失败',
          icon: 'error',
          duration: 2000
        });
      })
      // #endif
    }
  }
}
</script>

<style lang="scss">
.container{
  height: 100vh;
  background-color: var(--md-sys-color-surface);
}
.select-bar {
  display: flex;
  height: sx(10);
  align-items: center;
  padding-left: sx(2.5);
  gap: sx(2.5);

  .select-item {
    //margin-left: sx(2.5);

  }

  .query-btn {
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }
}

.scroll-table {
  height: calc(100vh - sx(25) - var(--status-bar-height));

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

.md-dialog-surface {
  width: 85vw; /* 移动端常见宽度 */
  max-width: 320px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: sx(4);
  box-sizing: border-box;
}

/* 标题区域 */
.dialog-header {

  .dialog-title {
    display: block;
    font-size: 20px; /* Headline 6 */
    font-weight: 500;
    margin-bottom: 4px;
  }
}

/* 空状态 */
.empty-state {
  padding: 20px 0;
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 14px;
}

/* 列表样式 */
.score-list {
  display: flex;
  flex-direction: column;
}

.score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--md-sys-color-outline-variant); /* 细分割线 */

  &:last-child {
    border-bottom: none;
  }

  /* 左侧文字 */
  .item-main {
    display: flex;
    flex-direction: column;

    .item-name {
      font-size: 16px; /* Subtitle 1 */
      margin-bottom: 4px;
    }

    .item-meta {
      display: flex;
      align-items: center;

      .meta-text {
        font-size: 12px; /* Caption */
        color: var(--md-sys-color-on-surface-variant);
        margin-left: 4px;
      }
    }
  }

  /* 右侧分数 */
  .item-score-wrapper {
    display: flex;
    align-items: baseline;

    .score-value {
      font-size: 24px; /* Headline 5 */
      font-weight: 500;
      color: var(--md-sys-color-primary); /* 重点数据使用主色 */
    }

    .score-label {
      font-size: 12px;
      margin-left: 2px;
      color: var(--md-sys-color-on-surface-variant);
    }
  }
}

/* 底部按钮区域 */
.dialog-actions {
  display: flex;
  justify-content: flex-end; /* 按钮靠右 */
}
</style>