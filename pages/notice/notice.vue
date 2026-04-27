<template>
  <view class="container" :style="themeStyle">
    <material-nav-bar :background-color="currentModeConfig.bgColor" :color="currentModeConfig.onBgColor">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="--md-sys-color-on-primary" size="" type="bars"
                   @click="isDrawerOpen = true"/>
        <text class="title">健康</text>
        <uni-icons class="icon-right" color="#00000000" size="" type="loop" @click=""/>
      </view>
    </material-nav-bar>

    <scroll-view scroll-y="true" class="main-scroll">
      <view class="dashboard-wrapper">

        <view class="hero-section" :style="{ backgroundColor: currentModeConfig.bgColor }">
          <view class="hero-header">
            <view class="mode-info">
              <text class="hero-title" :style="{ color: currentModeConfig.onBgColor }">{{
                  currentModeConfig.name
                }}
              </text>
              <view class="hero-subtitle" :style="{ color: currentModeConfig.onBgColor, opacity: 0.8 }">
                <text>系统综合评分</text>
              </view>
            </view>
            <view class="mode-switch-btn" @click="showModeSelector = true"
                  :style="{ backgroundColor: currentModeConfig.onBgColor + '20' }">
              <text class="switch-text" :style="{ color: currentModeConfig.onBgColor }">切换策略</text>
              <uni-icons type="loop" :color="currentModeConfig.onBgColor" size="14"></uni-icons>
            </view>
          </view>

          <view class="score-display">
            <text class="score-number" :style="{ color: currentModeConfig.onBgColor }">{{ dashboardData.overallScore }}</text>
          </view>
        </view>

        <material-card color="var(--md-sys-color-outline)" v-if="dashboardData.actionableInsight.show || dashboardData.actionableInsight.message">
          <view class="card-inner">
            <view class="section-title-wrap">
              <uni-icons type="info" :color="alertTheme.color" size="18"></uni-icons>
              <text class="section-title">{{ dashboardData.actionableInsight.title }}</text>
            </view>
            <view class="causal-box"
                  :style="{ backgroundColor: alertTheme.bgColor, borderColor: alertTheme.color }">
              <text class="causal-action">系统已自动生成以下作息与行为约束策略。</text>
              <text class="causal-reason" :style="{ color: alertTheme.color }">
                {{ dashboardData.actionableInsight.message }}
              </text>
            </view>
          </view>
        </material-card>

        <material-card color="var(--md-sys-color-outline)">
          <view class="card-inner">
            <text class="section-title">教务压力时间轴映射</text>
            <text class="section-desc">基于次日排课动态计算的入睡红线</text>

            <view class="timeline-container">
              <view class="timeline-item" v-for="(course, index) in dashboardData.timeline.courses" :key="index">
                <view class="timeline-dot" style="background-color: var(--md-sys-color-outline);"></view>
                <view class="timeline-content">
                  <text class="tl-time">{{ course.time }}</text>
                  <view class="tl-card">
                    <text class="tl-title">{{ course.name }}</text>
<!--                    <text class="tl-tag" v-if="course.hard">高优/硬核</text>-->
                  </view>
                </view>
              </view>

              <view class="timeline-item active-node">
                <view class="timeline-dot pulse-dot" :style="{ backgroundColor: currentModeConfig.color }"></view>
                <view class="timeline-content">
                  <text class="tl-time text-primary">今晚策略</text>
                  <view class="tl-card highlight-card"
                        :style="{ borderColor: currentModeConfig.color, backgroundColor: currentModeConfig.color + '10' }">
                    <text class="tl-title" :style="{ color: currentModeConfig.color }">
                      建议最晚入睡：{{ dashboardData.timeline.targetSleepTime }}
                    </text>
                    <text class="tl-desc">为保证明日状态，干预时间已偏移 {{ dashboardData.timeline.offset }} 分钟</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </material-card>

        <material-card color="var(--md-sys-color-outline)">
          <view class="card-inner">
            <text class="section-title">今日认知与体力能量池</text>
            <text class="section-desc">专注度与运动达标率</text>

            <view class="energy-module">
              <view class="energy-row">
                <view class="energy-label">
                  <text>脑力专注 (B_cost)</text>
                  <text class="energy-val">{{ dashboardData.rawStats.focusRate }}%</text>
                </view>
                <view class="energy-pool-track">
                  <view class="energy-liquid"
                        :style="{ width: dashboardData.rawStats.focusRate + '%', backgroundColor: 'var(--md-sys-color-primary)' }"></view>
                  <view class="energy-drain" v-if="(100 - dashboardData.rawStats.focusRate) > 0"
                        :style="{ width: (100 - dashboardData.rawStats.focusRate) + '%' }"></view>
                </view>
                <text class="drain-hint" v-if="dashboardData.rawStats.distractionMins > 0">违规摸鱼流失 {{ dashboardData.rawStats.distractionMins }} 分钟</text>
              </view>

              <view class="energy-row">
                <view class="energy-label">
                  <text>体力状态 (P_state)</text>
                  <text class="energy-val"
                        :style="{ color: dashboardData.factors.physicalState < 50 ? 'var(--md-sys-color-error)' : 'inherit' }">
                    {{ dashboardData.factors.physicalState }}%
                  </text>
                </view>
                <view class="energy-pool-track">
                  <view class="energy-liquid"
                        :style="{ width: dashboardData.factors.physicalState + '%', backgroundColor: dashboardData.factors.physicalState < 50 ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-tertiary)' }">
                  </view>
                </view>
                <text class="drain-hint">昨夜深睡及今日步数综合换算</text>
              </view>
            </view>
          </view>
        </material-card>

        <view class="list-section">
          <material-list color="var(--md-sys-color-outline)">
            <material-list-cell :showLeftText="false" :rightIcon="false">
              <view class="custom-list-content">
                <text class="cell-label">昨夜推算睡眠</text>
                <text class="cell-value">{{ dashboardData.rawStats.sleepDurationStr }}</text>
              </view>
            </material-list-cell>
            <material-list-cell :showLeftText="false" :rightIcon="false">
              <view class="custom-list-content">
                <text class="cell-label">今日有效步数</text>
                <text class="cell-value">{{ dashboardData.rawStats.steps }} 步 (目标:{{ dashboardData.rawStats.targetSteps }})</text>
              </view>
            </material-list-cell>
            <material-list-cell :showLeftText="false" :rightIcon="false">
              <view class="custom-list-content">
                <text class="cell-label">非学习App前台驻留</text>
                <text class="cell-value">{{ dashboardData.rawStats.distractionMins }} 分钟</text>
              </view>
            </material-list-cell>
          </material-list>
        </view>

      </view>
    </scroll-view>

    <MyDrawer :opened="isDrawerOpen" @onClose="isDrawerOpen = false"/>
    <sv-intercept-back :show="isDrawerOpen" :beforeIntercept="()=>{isDrawerOpen = false}"/>

    <material-tab-bar color="var(--md-sys-color-outline)"/>

    <view class="mode-sheet" v-if="showModeSelector" @click="showModeSelector = false">
      <view class="sheet-content" @click.stop>
        <text class="sheet-title">预测推演：切换系统干预模式</text>
        <view class="mode-options">
          <view class="mode-option"
                v-for="(config, modeKey) in staticModeConfigs" :key="modeKey"
                @click="switchMode(modeKey)"
                :class="{ 'is-active': dashboardData.currentMode === modeKey }">
            <view class="mode-color-dot" :style="{ backgroundColor: config.color }"></view>
            <view class="mode-text">
              <text class="m-name">{{ config.name }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
//#ifdef H5
//#endif
import MaterialTabBar from "@/components/material-uni/material-tab-bar/material-tab-bar.vue";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import SvInterceptBack from "@/uni_modules/sv-intercept-back/components/sv-intercept-back/sv-intercept-back.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import {SXData} from "@/components/material-uni/sx";
import MyDrawer from "@/components/MyDrawer/MyDrawer.vue";
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";

export default {
  components: {
    MaterialCard,
    MyDrawer, MaterialList, MaterialListCell, SvInterceptBack, MaterialNavBar, MaterialTabBar
  },
  computed: {
    SXData() {
      return SXData;
    },
    // 将后端当前模式映射到 UI 颜色配置
    currentModeConfig() {
      return this.staticModeConfigs[this.dashboardData.currentMode] || this.staticModeConfigs['BALANCE_MODE'];
    },
    // 根据后端的 alert level 动态计算警告框颜色
    alertTheme() {
      const level = this.dashboardData.actionableInsight.level;
      if (level === 'critical') {
        return { color: 'var(--md-sys-color-error)', bgColor: 'var(--md-sys-color-error-container)' };
      } else if (level === 'warning') {
        // 使用一个橙色或原色作为 warning
        return { color: 'var(--md-sys-color-primary)', bgColor: 'var(--md-sys-color-primary-container)' };
      } else {
        // info 级别用平稳的三级色
        return { color: 'var(--md-sys-color-tertiary)', bgColor: 'var(--md-sys-color-tertiary-container)' };
      }
    }
  },
  data() {
    return {
      isDrawerOpen: false,
      showModeSelector: false,

      // UI 主题映射字典（静态）
      staticModeConfigs: {
        'SCHOLAR_MODE': {
          name: '学习冲刺模式',
          color: 'var(--md-sys-color-error)',
          bgColor: 'var(--md-sys-color-error-container)',
          onBgColor: 'var(--md-sys-color-on-error-container)'
        },
        'HEALTH_MODE': {
          name: '健康活力模式',
          color: 'var(--md-sys-color-primary)',
          bgColor: 'var(--md-sys-color-primary)',
          onBgColor: 'var(--md-sys-color-on-primary)'
        },
        'BALANCE_MODE': {
          name: '劳逸结合模式',
          color: 'var(--md-sys-color-tertiary)',
          bgColor: 'var(--md-sys-color-tertiary)',
          onBgColor: 'var(--md-sys-color-on-tertiary)'
        }
      },

      // 后端真实数据结构兜底（避免渲染空指针）
      dashboardData: {
        currentMode: "BALANCE_MODE",
        overallScore: 0,
        factors: { focusCost: 0, physicalState: 0, courseStress: 0 },
        actionableInsight: { show: false, level: "info", title: "数据加载中", message: "" },
        timeline: { targetSleepTime: "--:--", offset: "0", courses: [] },
        rawStats: { sleepDurationStr: "--", steps: 0, targetSteps: 6000, focusRate: 100, distractionMins: 0 }
      }
    }
  },
  onShow() {
    // #ifdef APP-PLUS
    this.$manager.refreshSleepData().finally(() => {
      this.$manager.getDashboardInsight().then(res => {
        console.log("获取到底层决策数据:", res);
        if(res !== null){
          // 直接覆盖响应式数据，页面会自动更新
		  console.log(res)
          this.dashboardData = res;
        }
      }).catch(err => {
        console.error("获取底层决策数据失败", err);
      });
    })
    // #endif
  },
  methods: {
    switchMode(modeKey) {
      this.showModeSelector = false;
      uni.showToast({title: '决策引擎重新推演中...', icon: 'none'});

      // #ifdef APP-PLUS
      if (this.$manager && typeof this.$manager.switchAppMode === 'function') {
        this.$manager.switchAppMode(modeKey)
        this.$manager.getDashboardInsight().then(res => {
          if(res !== null){
            this.dashboardData = res;
            uni.showToast({title: '策略切换成功', icon: 'success'});
          }
        }).catch(err => {
          uni.showToast({title: '底层引擎同步失败', icon: 'error'});
        });
      }
      // #endif
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-color: var(--md-sys-color-surface);
}

/* 关键高度计算：避开 StatusBar、NavBar(约sx(15))、以及底部的 TabBar(约sx(15)) */
.main-scroll {
  flex: 1;
  height: calc(100vh - var(--status-bar-height) - sx(30));
  background-color: var(--md-sys-color-surface-variant); /* 保持卡片底色区分度 */
}

.dashboard-wrapper {
  padding: sx(4);
  display: flex;
  flex-direction: column;
  gap: sx(4);
  padding-bottom: sx(8);
}

/* === Hero === */
.hero-section {
  padding: sx(6);
  border-radius: sx(6);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 sx(1) sx(3) rgba(0, 0, 0, 0.1);
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.hero-title {
  font-size: sx(6);
  font-weight: bold;
  display: block;
  margin-bottom: sx(1);
}

.hero-subtitle {
  font-size: sx(3.5);
}

.mode-switch-btn {
  display: flex;
  align-items: center;
  padding: sx(1.5) sx(3);
  border-radius: sx(4);
  transition: opacity 0.3s;
}

.switch-text {
  font-size: sx(3.5);
  margin-right: sx(1);
  font-weight: 500;
}

.score-display {
  margin-top: sx(6);
}

.score-number {
  font-size: sx(14);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -1px;
}

/* === Cards === */
.card-inner {
  padding: sx(5);
}

.section-title-wrap {
  display: flex;
  align-items: center;
  margin-bottom: sx(3);
  gap: sx(2);
}

.section-title {
  font-size: sx(4);
  font-weight: bold;
  color: var(--md-sys-color-on-surface);
}

.section-desc {
  font-size: sx(3.2);
  color: var(--md-sys-color-outline);
  margin-bottom: sx(4);
  display: block;
}

.causal-box {
  padding: sx(4);
  border-radius: sx(3);
  //border-left: sx(1) solid;
  transition: all 0.4s ease;
}

.causal-reason {
  font-size: sx(3.8);
  font-weight: 600;
  line-height: 1.5;
  display: block;
  margin-bottom: sx(2);
}

.causal-action {
  font-size: sx(3.2);
  color: var(--md-sys-color-on-surface-variant);
}

/* === Timeline === */
.timeline-container {
  padding-top: sx(2);
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  position: relative;
  padding-bottom: sx(6);
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: sx(1.5);
  top: sx(4);
  bottom: 0;
  width: sx(0.5);
  background-color: var(--md-sys-color-surface-variant);
  transform: translateX(-50%);
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-item.active-node::before {
  background-color: transparent;
}

.timeline-dot {
  width: sx(3);
  height: sx(3);
  border-radius: 50%;
  position: relative;
  z-index: 2;
  margin-top: sx(1);
}

.pulse-dot {
  box-shadow: 0 0 0 sx(1) var(--md-sys-color-surface), 0 0 0 sx(2) inherit;
}

.timeline-content {
  margin-left: sx(4);
  flex: 1;
}

.tl-time {
  font-size: sx(3.2);
  color: var(--md-sys-color-outline);
  margin-bottom: sx(1);
  display: block;
  font-weight: bold;
}

.tl-time.text-primary {
  color: var(--md-sys-color-primary);
}

.tl-card {
  background-color: var(--md-sys-color-surface-variant);
  padding: sx(3);
  border-radius: sx(2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.highlight-card {
  border: 1px solid;
  flex-direction: column;
  align-items: flex-start;
}

.tl-title {
  font-size: sx(3.6);
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
}

.tl-desc {
  font-size: sx(3.2);
  color: var(--md-sys-color-on-surface-variant);
  margin-top: sx(1.5);
}

.tl-tag {
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  padding: sx(1) sx(2);
  font-size: sx(2.8);
  border-radius: sx(1);
}

/* === Energy === */
.energy-module {
  display: flex;
  flex-direction: column;
  gap: sx(5);
}

.energy-row {
  display: flex;
  flex-direction: column;
}

.energy-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: sx(2);
  font-size: sx(3.6);
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
}

.energy-pool-track {
  height: sx(3.5);
  background-color: var(--md-sys-color-surface-variant);
  border-radius: sx(2);
  overflow: hidden;
  display: flex;
  position: relative;
  box-shadow: inset 0 sx(0.5) sx(1) rgba(0, 0, 0, 0.05);
}

.energy-liquid {
  height: 100%;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: sx(2);
}

.energy-drain {
  height: 100%;
  background: repeating-linear-gradient(45deg, var(--md-sys-color-error), var(--md-sys-color-error-container) 10px, transparent 10px, transparent 20px);
  border-radius: 0 sx(2) sx(2) 0;
  opacity: 0.8;
}

.drain-hint {
  font-size: sx(3);
  color: var(--md-sys-color-outline);
  margin-top: sx(1.5);
  text-align: right;
}

/* === List Cell Override === */
.custom-list-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 sx(6.5);
  box-sizing: border-box;
}

.cell-label {
  font-size: sx(4);
  color: var(--md-sys-color-on-surface);
}

.cell-value {
  font-size: sx(4);
  font-weight: 500;
  color: var(--md-sys-color-outline);
}

/* === Mode Sheet === */
.mode-sheet {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.sheet-content {
  background-color: var(--md-sys-color-surface);
  width: 100%;
  border-radius: sx(6) sx(6) 0 0;
  padding: sx(6);
  padding-bottom: calc(sx(6) + env(safe-area-inset-bottom));
}

.sheet-title {
  font-size: sx(4.5);
  font-weight: bold;
  margin-bottom: sx(4);
  display: block;
  color: var(--md-sys-color-on-surface);
}

.mode-options {
  display: flex;
  flex-direction: column;
  gap: sx(3);
}

.mode-option {
  display: flex;
  align-items: center;
  padding: sx(4);
  border-radius: sx(3);
  background-color: var(--md-sys-color-surface-variant);
  transition: background-color 0.2s;
}

.mode-option.is-active {
  border: 2px solid var(--md-sys-color-primary);
}

.mode-color-dot {
  width: sx(4);
  height: sx(4);
  border-radius: 50%;
  margin-right: sx(4);
}

.m-name {
  font-size: sx(4);
  font-weight: 500;
  display: block;
  color: var(--md-sys-color-on-surface);
}

.m-preview {
  font-size: sx(3.2);
  color: var(--md-sys-color-outline);
  margin-top: sx(1);
  display: block;
}
</style>