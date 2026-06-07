<template>
  <view class="container" :style="themeStyle">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons color="var(--md-sys-color-on-primary)" size="" type="left" @click="back" class="icon-left"/>
        <view class="title">考试安排</view>
        <uni-icons class="icon-right" color="#00000000" size="" type="loop" @click=""/>
      </view>
    </material-nav-bar>

    <scroll-view scroll-y="true" class="exam-list-container">

      <view class="no-data" v-if="groupedExamsArray.length === 0">
        <text>暂无考试安排</text>
      </view>

      <view class="semester-group" v-for="(group, groupIndex) in groupedExamsArray" :key="groupIndex">

        <view class="semester-header">
          <text>{{ group.title }}</text>
        </view>

        <view class="exam-card-wrapper" v-for="(exam, index) in group.list" :key="index">
          <material-card background-color="var(--md-sys-color-surface-container-low)" color="var(--md-sys-color-on-surface-variant)">
            <view class="exam-card-inner">

              <view class="exam-header">
                <view class="exam-type">{{ exam.ksfs }}</view>
                <text class="exam-course">{{ exam.kcmc }}</text>
              </view>

              <view class="exam-time-box">
                <zui-svg-icon icon="schedule" collection="material-filled" :color="getColor('--md-sys-color-on-surface-variant')" :width="mx(4.5)" :height="mx(4.5)"/>
                <text class="exam-time-text">{{ exam.kssj }}</text>
              </view>

              <view class="exam-divider"></view>

              <view class="exam-location-seat">
                <view class="info-block">
                  <text class="info-label">考场地点</text>
                  <text class="info-value location">{{ exam.cdmc }}</text>
                </view>

                <view class="vertical-divider"></view>

                <view class="info-block">
                  <text class="info-label">座位号</text>
                  <text class="info-value seat-number">{{ exam.zwh }}</text>
                </view>
              </view>

            </view>
          </material-card>
        </view>

      </view>
    </scroll-view>
  </view>
</template>

<script>
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import zuiSvgIcon from "@/uni_modules/zui-svg-icon/components/zui-svg-icon/zui-svg-icon.vue";
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import { mx, getColor, SXData } from "@/components/material-uni/sx";

export default {
  components: {
    MaterialNavBar,
    MaterialCard,
    zuiSvgIcon,
    UniIcons
  },
  computed: {
    SXData() {
      return SXData;
    },
    // 核心逻辑：将一维数组按“学年-学期”进行分组，并按时间倒序排列
    groupedExamsArray() {
      const groups = {};

      this.rawExamData.forEach(exam => {
        // 构造友好的展示标题，如 "2023-2024学年 第1学期"
        const semesterTitle = `${exam.xnmc}学年 第${exam.xqmmc}学期`;

        // 构造排序权重 Key (例如: 2023年的第1学期 -> "2023_1")
        // 使用 xnm (学年开头年份) 和 xqmmc (学期代码) 组合
        const sortKey = `${exam.xnm}_${exam.xqmmc}`;

        if (!groups[sortKey]) {
          groups[sortKey] = {
            title: semesterTitle,
            sortKey: sortKey,
            list: []
          };
        }
        groups[sortKey].list.push(exam);
      });

      // 将对象转为数组，并根据 sortKey 降序排列 (保证最新学期在最上方)
      return Object.values(groups).sort((a, b) => {
        return b.sortKey.localeCompare(a.sortKey);
      });
    }
  },
  data() {
    return {
      rawExamData: [
        {
            "xh_id": "******",
            "ksfs": "？？",
            "bj": "-------",
            "zwh": "0",
            "ksmc": "？？？？？",
            "kssj": "？？？？？",
            "cdmc": "未知",
            "kcmc": "暂无数据",
            "xnmc": "？？？？-****",
            "xnm": "----",
            "xqmmc": "？"
        }
      ]
    };
  },
  onLoad(){
    this.update()
  },
  methods: {
    mx,
    getColor,
    back() {
      uni.navigateBack();
    },
    update() {
      // if (forceRefresh) {
        uni.showLoading({
          title: '请优先以授课老师安排准'
        });
      // }
      // const year = this.selectedYear.split('-')[0];
      // const term = this.selectedTerm === '' ? '' : this.selectedTerm === '第一学期' ? '3' : '12';
      this.$manager.getAllExam().then(res => {
        console.log(res)
        this.rawExamData = res.items;
        // this.tableData = this.tableData.reverse()
      }).catch(err => {
        console.error(err)
        // uni.hideLoading();
        uni.showToast({
          title: '获取信息失败',
          icon: 'error',
          duration: 2000
        });
      }).finally(() => {
        uni.hideLoading();
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--md-sys-color-surface);
}

/* 滚动区样式 */
.exam-list-container {
  height: calc(100vh - var(--status-bar-height) - sx(15));
}

/* 暂无数据提示 */
.no-data {
  display: flex;
  justify-content: center;
  padding-top: sx(20);
  color: var(--md-sys-color-on-surface-variant);
  font-size: sx(4.5);
}

.semester-group {
  margin-bottom: sx(2);
}

/* 吸顶的学期标题 */
.semester-header {
  position: sticky;
  top: 0;
  z-index: 10;
  /* 带有半透明毛玻璃效果，防止卡片滚过时穿透 */
  background-color: rgba(249, 249, 255, 0.95);
  backdrop-filter: blur(4px);
  padding: sx(4) sx(6.5) sx(2) sx(6.5);

  text {
    font-size: sx(3.5);
    font-weight: 700;
    color: var(--md-sys-color-on-surface-variant);
  }
}

.exam-card-wrapper {
  padding: sx(2) sx(4);
}

/* 去除蓝色边缘后的纯净卡片内部包裹层 */
.exam-card-inner {
  display: flex;
  flex-direction: column;
  padding: sx(5);
  // 【已移除】之前这里的 border-left 属性
}

/* 顶部：课程与类型胶囊 */
.exam-header {
  display: flex;
  align-items: center;
  margin-bottom: sx(3);

  .exam-type {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: sx(0.5) sx(2);
    margin-right: sx(2.5);
    border-radius: sx(1.5);
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    font-size: sx(3);
    font-weight: 600;
  }

  .exam-course {
    font-size: sx(4.8);
    font-weight: 700;
    color: var(--md-sys-color-on-surface);
  }
}

/* 中部：考试时间 */
.exam-time-box {
  display: flex;
  align-items: center;
  margin-bottom: sx(4);

  .exam-time-text {
    margin-left: sx(1.5);
    font-size: sx(3.8);
    font-family: monospace; // 强制数字使用等宽字体对齐
    color: var(--md-sys-color-on-surface-variant);
  }
}

/* 极浅色横向分割线 */
.exam-divider {
  height: max(sx(0.25), 0.5px);
  background-color: color-mix(in srgb, var(--md-sys-color-outline-variant) 30%, transparent);
  margin-bottom: sx(3);
}

/* 底部：地点与座位 (Flex绝对居中布局) */
.exam-location-seat {
  display: flex;
  align-items: center;

  .info-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .vertical-divider {
    width: max(sx(0.25), 0.5px);
    height: sx(10);
    background-color: color-mix(in srgb, var(--md-sys-color-outline-variant) 30%, transparent);
  }

  .info-label {
    font-size: sx(3);
    color: var(--md-sys-color-on-surface-variant);
    margin-bottom: sx(1);
  }

  .info-value {
    font-size: sx(4.5);
    color: var(--md-sys-color-on-surface);
    font-weight: 600;

    /* 座位号使用主色调超大字号进行锚点强调 */
    &.seat-number {
      font-size: sx(8);
      color: var(--md-sys-color-primary);
      line-height: 1;
      font-family: monospace;
    }
  }
}
</style>