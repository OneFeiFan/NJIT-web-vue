<template>
  <view class="container" :style="themeStyle">
    <material-nav-bar background-color="var(--md-sys-color-surface)" color="var(--md-sys-color-on-surface)">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="var(--md-sys-color-on-surface)" size="" type="left" @click="back"/>
        <text class="title">守护看板</text>
        <uni-icons class="icon-right" color="#00000000" size="" type="loop" @click=""/>
      </view>
    </material-nav-bar>

    <scroll-view scroll-y="true" class="main-scroll">
      <view class="dashboard-wrapper">

        <view class="hero-card" :style="{ backgroundColor: currentMode.color }" @click="showModeSelector = true">
          <view class="hero-content">
            <view class="hero-header">
              <text class="hero-title">{{ currentMode.name }}</text>
              <view class="switch-btn">
                <text class="switch-text">切换模式</text>
                <uni-icons type="right" color="#FFFFFF" size="14"></uni-icons>
              </view>
            </view>
            <text class="hero-desc">{{ currentMode.desc }}</text>

            <view class="hero-stats">
              <text class="stats-number">4</text>
              <text class="stats-unit">h</text>
              <text class="stats-number">20</text>
              <text class="stats-unit">m</text>
              <text class="stats-label">今日已稳定守护</text>
            </view>
          </view>
        </view>

        <view class="data-grid">

          <material-card>
            <view class="card-inner">
              <text class="card-title">应用活跃成分 (前台)</text>
              <view class="progress-item">
                <view class="progress-label">
                  <text>学习/效率</text>
                  <text>60%</text>
                </view>
                <u-line-progress :percentage="60" :activeColor="currentMode.color" :showText="false" height="8"></u-line-progress>
              </view>
              <view class="progress-item">
                <view class="progress-label">
                  <text>社交沟通</text>
                  <text>30%</text>
                </view>
                <u-line-progress :percentage="30" activeColor="var(--md-sys-color-outline)" :showText="false" height="8"></u-line-progress>
              </view>
              <view class="progress-item">
                <view class="progress-label">
                  <text>影音娱乐</text>
                  <text>10%</text>
                </view>
                <u-line-progress :percentage="10" activeColor="var(--md-sys-color-surface-variant)" :showText="false" height="8"></u-line-progress>
              </view>
            </view>
          </material-card>

          <material-card>
            <view class="card-inner">
              <text class="card-title">近期阻断记录</text>
              <view class="log-list">
                <view class="log-item">
                  <view class="log-dot" :style="{ backgroundColor: currentMode.color }"></view>
                  <view class="log-info">
                    <text class="log-time">14:20</text>
                    <text class="log-action">尝试打开 抖音，已阻断</text>
                  </view>
                </view>
                <view class="log-item">
                  <view class="log-dot" :style="{ backgroundColor: currentMode.color }"></view>
                  <view class="log-info">
                    <text class="log-time">10:05</text>
                    <text class="log-action">离开学习工具超过阈值，已提醒</text>
                  </view>
                </view>
                <view class="log-item">
                  <view class="log-dot" style="background-color: var(--md-sys-color-outline);"></view>
                  <view class="log-info">
                    <text class="log-time">08:30</text>
                    <text class="log-action">进入智能守护模式</text>
                  </view>
                </view>
              </view>
            </view>
          </material-card>

          <material-card>
            <view class="card-inner">
              <text class="card-title">昨夜睡眠简报</text>
              <view class="sleep-overview">
                <view class="sleep-time-box">
                  <view class="sleep-duration-wrap">
                    <text class="sleep-number">7</text><text class="sleep-unit">h</text>
                    <text class="sleep-number">20</text><text class="sleep-unit">m</text>
                  </view>
                  <text class="sleep-span">23:45 - 07:05</text>
                </view>

                <view class="sleep-divider"></view>

                <view class="sleep-status-box">
                  <view class="sleep-status-val-wrap">
                    <text class="sleep-number" :style="{ color: currentMode.color }">0</text>
                    <text class="sleep-unit">次</text>
                  </view>
                  <text class="sleep-status-label">违规亮屏</text>
                </view>
              </view>
            </view>
          </material-card>

        </view>
      </view>
    </scroll-view>

    <u-action-sheet
        :show="showModeSelector"
        :actions="modeList"
        title="选择守护模式"
        @close="showModeSelector = false"
        @select="onModeSelect">
    </u-action-sheet>

  </view>
</template>

<script>
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import { SXData } from "@/components/material-uni/sx";

export default {
  components: {
    MaterialNavBar, MaterialCard
  },
  computed: {
    SXData() { return SXData; },
    currentMode() {
      return this.modeList.find(m => m.id === this.activeModeId) || this.modeList[0];
    }
  },
  data() {
    return {
      showModeSelector: false,
      activeModeId: 'smart',
      modeList: [
        {
          id: 'smart',
          name: '智能守护模式',
          desc: '温和防沉迷，根据应用分类智能调节监控频率',
          color: 'var(--md-sys-color-primary)'
        },
        {
          id: 'focus',
          name: '深度专注模式',
          desc: '高压警戒，离开学习应用或移动设备立即触发阻断',
          color: '#F57C00'
        },
        {
          id: 'relaxed',
          name: '宽松记录模式',
          desc: '仅做后台数据记录，不做任何打断和提醒',
          color: 'var(--md-sys-color-outline)'
        }
      ]
    }
  },
  methods: {
    back() {
      uni.navigateBack();
    },
    onModeSelect(item) {
      this.activeModeId = item.id;
      uni.showToast({ title: `已切换至${item.name}`, icon: 'none' });
      this.showModeSelector = false;
    }
  }
}
</script>

<style lang="scss">
.container {
  background-color: var(--md-sys-color-surface-variant);
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-scroll {
  flex: 1;
  height: calc(100vh - var(--status-bar-height) - sx(15));
}

.dashboard-wrapper {
  padding: sx(5);
  display: flex;
  flex-direction: column;
  gap: sx(5);
}

/* ================= Hero Card 样式 ================= */
.hero-card {
  border-radius: sx(4);
  transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 sx(1) sx(3) rgba(0,0,0,0.2);
}

.hero-content {
  padding: sx(6) sx(6) sx(8) sx(6);
  color: #FFFFFF;
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: sx(2);
}

.hero-title {
  font-size: sx(6);
  font-weight: bold;
}

.switch-btn {
  display: flex;
  align-items: center;
  background-color: rgba(255,255,255,0.2);
  padding: sx(1.5) sx(3);
  border-radius: sx(5);
}

.switch-text {
  font-size: sx(3.6);
  margin-right: sx(1);
}

.hero-desc {
  font-size: sx(3.6);
  opacity: 0.9;
  display: block;
  margin-bottom: sx(6);
}

.hero-stats {
  display: flex;
  align-items: baseline;
}

.stats-number {
  font-size: sx(10);
  font-weight: bold;
  line-height: 1;
}

.stats-unit {
  font-size: sx(4.2);
  margin: 0 sx(2) 0 sx(1);
  opacity: 0.9;
}

.stats-label {
  font-size: sx(3.6);
  margin-left: sx(2);
  opacity: 0.8;
}

/* ================= 响应式 Grid 数据看板区 ================= */
.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(sx(90), 1fr));
  gap: sx(5);
}

.card-inner {
  padding: sx(5);
}

.card-title {
  font-size: sx(4.2);
  font-weight: bold;
  color: var(--md-sys-color-on-surface);
  margin-bottom: sx(4);
  display: block;
}

/* 进度条与日志样式 */
.progress-item {
  margin-bottom: sx(3);
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: sx(3.6);
  color: var(--md-sys-color-outline);
  margin-bottom: sx(1.5);
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: sx(3);
}

.log-item {
  display: flex;
  align-items: flex-start;
}

.log-dot {
  width: sx(2.5);
  height: sx(2.5);
  border-radius: 50%;
  margin-top: sx(1.2);
  margin-right: sx(3);
  transition: background-color 0.4s ease;
}

.log-info {
  display: flex;
  flex-direction: column;
}

.log-time {
  font-size: sx(3.6);
  font-weight: bold;
  color: var(--md-sys-color-on-surface);
}

.log-action {
  font-size: sx(3.6);
  color: var(--md-sys-color-outline);
  margin-top: sx(0.5);
}

/* ================= 全新：睡眠状态卡片样式 ================= */
.sleep-overview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: sx(2) 0;
}

.sleep-time-box, .sleep-status-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sleep-time-box {
  flex: 1;
}

.sleep-status-box {
  flex: 0.8;
  align-items: flex-end; /* 靠右对齐 */
}

.sleep-duration-wrap, .sleep-status-val-wrap {
  display: flex;
  align-items: baseline;
}

.sleep-number {
  font-size: sx(8);
  font-weight: bold;
  color: var(--md-sys-color-on-surface);
  transition: color 0.4s ease; /* 违规次数可随主题变色 */
}

.sleep-unit {
  font-size: sx(3.6);
  margin: 0 sx(1);
  color: var(--md-sys-color-outline);
}

.sleep-span {
  font-size: sx(3.6);
  color: var(--md-sys-color-outline);
  margin-top: sx(1.5);
  letter-spacing: 0.5px;
}

.sleep-status-label {
  font-size: sx(3.6);
  color: var(--md-sys-color-outline);
  margin-top: sx(1.5);
}

.sleep-divider {
  width: 1px;
  height: sx(12);
  background-color: var(--md-sys-color-surface-variant);
  margin: 0 sx(4);
}
</style>