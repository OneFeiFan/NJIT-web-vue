<template>
  <view class="container" :style="themeStyle">
    <material-nav-bar background-color="var(--md-sys-color-surface)" color="var(--md-sys-color-on-surface)">
      <view class="nav-bar">
        <uni-icons color="var(--md-sys-color-on-surface)" size="24" type="bars" @click="isDrawerOpen = true" class="icon-left"/>
        <text class="title">智能决策</text>
        <view style="width: 24px;"></view> </view>
    </material-nav-bar>

    <scroll-view scroll-y="true" class="main-scroll">
      <view class="dashboard-wrapper">

        <view class="hero-section" :style="{ backgroundColor: currentModeConfig.bgColor }">
          <view class="hero-header">
            <view class="mode-info">
              <text class="hero-title" :style="{ color: currentModeConfig.onBgColor }">{{ currentModeConfig.name }}</text>
              <view class="hero-subtitle" :style="{ color: currentModeConfig.onBgColor, opacity: 0.8 }">
                <text>系统综合评分</text>
              </view>
            </view>
            <view class="mode-switch-btn" @click="showModeSelector = true" :style="{ backgroundColor: currentModeConfig.onBgColor + '20' }">
              <text class="switch-text" :style="{ color: currentModeConfig.onBgColor }">切换策略</text>
              <uni-icons type="loop" :color="currentModeConfig.onBgColor" size="14"></uni-icons>
            </view>
          </view>

          <view class="score-display">
            <text class="score-number" :style="{ color: currentModeConfig.onBgColor }">{{ activeData.score }}</text>
          </view>
        </view>

        <material-card>
          <view class="card-inner">
            <view class="section-title-wrap">
              <uni-icons type="info" color="var(--md-sys-color-primary)" size="18"></uni-icons>
              <text class="section-title">系统干预归因</text>
            </view>
            <view class="causal-box" :style="{ backgroundColor: activeData.alert.bgColor, borderColor: activeData.alert.color }">
              <text class="causal-reason" :style="{ color: activeData.alert.color }">
                {{ activeData.alert.reason }}
              </text>
              <text class="causal-action">系统已自动生成以下作息与行为约束策略。</text>
            </view>
          </view>
        </material-card>

        <material-card>
          <view class="card-inner">
            <text class="section-title">教务压力时间轴映射</text>
            <text class="section-desc">基于次日排课动态计算的入睡红线</text>

            <view class="timeline-container">
              <view class="timeline-item" v-for="(course, index) in activeData.timeline.courses" :key="index">
                <view class="timeline-dot" style="background-color: var(--md-sys-color-outline);"></view>
                <view class="timeline-content">
                  <text class="tl-time">{{ course.time }}</text>
                  <view class="tl-card">
                    <text class="tl-title">{{ course.name }}</text>
                    <text class="tl-tag" v-if="course.isHard">高优/硬核</text>
                  </view>
                </view>
              </view>

              <view class="timeline-item active-node">
                <view class="timeline-dot pulse-dot" :style="{ backgroundColor: currentModeConfig.color }"></view>
                <view class="timeline-content">
                  <text class="tl-time text-primary">今晚策略</text>
                  <view class="tl-card highlight-card" :style="{ borderColor: currentModeConfig.color, backgroundColor: currentModeConfig.color + '10' }">
                    <text class="tl-title" :style="{ color: currentModeConfig.color }">建议最晚入睡：{{ activeData.timeline.targetSleepTime }}</text>
                    <text class="tl-desc">为保证明日状态，干预时间已偏移 {{ activeData.timeline.offset }} 分钟</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </material-card>

        <material-card>
          <view class="card-inner">
            <text class="section-title">今日认知与体力能量池</text>
            <text class="section-desc">专注度与运动达标率</text>

            <view class="energy-module">
              <view class="energy-row">
                <view class="energy-label">
                  <text>脑力专注 (B_cost)</text>
                  <text class="energy-val">{{ activeData.energy.focus }}%</text>
                </view>
                <view class="energy-pool-track">
                  <view class="energy-liquid" :style="{ width: activeData.energy.focus + '%', backgroundColor: 'var(--md-sys-color-primary)' }"></view>
                  <view class="energy-drain" v-if="activeData.energy.drain > 0" :style="{ width: activeData.energy.drain + '%' }"></view>
                </view>
                <text class="drain-hint" v-if="activeData.energy.drain > 0">违规摸鱼流失 {{ activeData.energy.drain }}%</text>
              </view>

              <view class="energy-row">
                <view class="energy-label">
                  <text>体力状态 (P_state)</text>
                  <text class="energy-val" :style="{ color: activeData.energy.physical < 50 ? 'var(--md-sys-color-error)' : 'inherit' }">
                    {{ activeData.energy.physical }}%
                  </text>
                </view>
                <view class="energy-pool-track">
                  <view class="energy-liquid"
                        :style="{ width: activeData.energy.physical + '%', backgroundColor: activeData.energy.physical < 50 ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-tertiary)' }">
                  </view>
                </view>
                <text class="drain-hint">昨夜深睡及今日步数综合换算</text>
              </view>
            </view>
          </view>
        </material-card>

        <view class="list-section">
          <text class="section-title" style="padding-left: sx(2); margin-bottom: sx(2); display: block;">感知数据溯源</text>
          <material-list>
            <material-list-cell :showLeftText="false" :rightIcon="false">
              <view class="custom-list-content">
                <text class="cell-label">昨夜推算睡眠</text>
                <text class="cell-value">{{ activeData.raw.sleep }}</text>
              </view>
            </material-list-cell>
            <material-list-cell :showLeftText="false" :rightIcon="false">
              <view class="custom-list-content">
                <text class="cell-label">今日有效步数</text>
                <text class="cell-value">{{ activeData.raw.steps }} 步</text>
              </view>
            </material-list-cell>
            <material-list-cell :showLeftText="false" :rightIcon="false">
              <view class="custom-list-content">
                <text class="cell-label">非学习App前台驻留</text>
                <text class="cell-value">{{ activeData.raw.distraction }}</text>
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
                v-for="(mode, key) in modesData" :key="key"
                @click="switchMode(key)"
                :class="{ 'is-active': currentModeId === key }">
            <view class="mode-color-dot" :style="{ backgroundColor: mode.config.color }"></view>
            <view class="mode-text">
              <text class="m-name">{{ mode.config.name }}</text>
              <text class="m-preview">推演入睡红线: {{ mode.timeline.targetSleepTime }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

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
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";

export default {
  components: {
    MaterialCard,
    MyDrawer, MaterialList, MaterialListCell, SvInterceptBack, MaterialNavBar, MaterialTabBar
  },
  computed: {
    SXData() { return SXData; },
    activeData() { return this.modesData[this.currentModeId]; },
    currentModeConfig() { return this.activeData.config; },
    // themeStyle() { return `background-color: var(--md-sys-color-surface);`; }
  },
  data() {
    return {
      isDrawerOpen: false,
      showModeSelector: false,
      currentModeId: 'scholar', // 默认状态

      // 模拟多维数据字典，后续将被 onShow 中的真实底层数据覆盖
      modesData: {
        'scholar': {
          config: { name: '学霸冲刺模式', color: 'var(--md-sys-color-primary)', bgColor: 'var(--md-sys-color-primary)', onBgColor: 'var(--md-sys-color-on-primary)' },
          score: 88,
          alert: { reason: '检测到明日有核心专业课（高等数学），当前为学霸模式，对脑力储备要求极高。', color: 'var(--md-sys-color-primary)', bgColor: 'var(--md-sys-color-primary-container)' },
          timeline: {
            targetSleepTime: '23:30', offset: '30',
            courses: [ { time: '明日 08:00', name: '高等数学 (必修)', isHard: true }, { time: '明日 14:00', name: '大学物理实验', isHard: false } ]
          },
          energy: { focus: 85, drain: 10, physical: 60 },
          raw: { sleep: '6h 15m', steps: 4500, distraction: '12m' }
        },
        'health': {
          config: { name: '健康活力模式', color: 'var(--md-sys-color-error)', bgColor: 'var(--md-sys-color-error-container)', onBgColor: 'var(--md-sys-color-on-error-container)' },
          score: 52,
          alert: { reason: '严重警告：您的体力状态（P_state）已跌破基准线。系统强制启动睡眠保护！', color: 'var(--md-sys-color-error)', bgColor: 'var(--md-sys-color-error-container)' },
          timeline: {
            targetSleepTime: '22:15', offset: '-105',
            courses: [ { time: '明日 08:00', name: '高等数学 (必修)', isHard: true }, { time: '明日 14:00', name: '大学物理实验', isHard: false } ]
          },
          energy: { focus: 85, drain: 10, physical: 35 },
          raw: { sleep: '5h 10m', steps: 3200, distraction: '12m' }
        },
        'balance': {
          config: { name: '劳逸结合模式', color: 'var(--md-sys-color-tertiary)', bgColor: 'var(--md-sys-color-tertiary)', onBgColor: 'var(--md-sys-color-on-tertiary)' },
          score: 75,
          alert: { reason: '常规运行中。目前没有突出的课业压力或严重的体力透支，维持标准干预阈值。', color: 'var(--md-sys-color-tertiary)', bgColor: 'var(--md-sys-color-tertiary-container)' },
          timeline: {
            targetSleepTime: '23:00', offset: '0',
            courses: [ { time: '明日 08:00', name: '高等数学 (必修)', isHard: true }, { time: '明日 14:00', name: '大学物理实验', isHard: false } ]
          },
          energy: { focus: 70, drain: 15, physical: 80 },
          raw: { sleep: '7h 20m', steps: 6500, distraction: '25m' }
        }
      }
    }
  },
  onLoad() {},
  onShow() {
    // 页面显示时，主动向底层拉取当前真实的感知数据
    // #ifdef APP-PLUS
    if (this.$manager && typeof this.$manager.getDashboardInsight === 'function') {
      this.$manager.getDashboardInsight().then(res => {
        if (res.code === 200) {
          // 这里将底层返回的 JSON 直接覆盖至前端视图
          // this.currentModeId = res.data.currentModeId;
          // Object.assign(this.modesData[this.currentModeId], res.data.dashboardData);
        }
      }).catch(err => {
        console.error("获取底层决策数据失败", err);
      });
    }
    // #endif
  },
  methods: {
    switchMode(modeId) {
      // 1. 改变前端 UI 状态
      this.currentModeId = modeId;
      this.showModeSelector = false;
      uni.showToast({ title: '决策引擎已重新计算权重', icon: 'none' });

      // 2. 调用底层接口，实际切换 Core 的运行策略 (AppMode)
      // #ifdef APP-PLUS
      if (this.$manager && typeof this.$manager.switchAppMode === 'function') {
        // 映射前端 ID 到后端的 AppMode 枚举
        const modeEnumMap = {
          'scholar': 'SCHOLAR_MODE',
          'health': 'HEALTH_MODE',
          'balance': 'BALANCE_MODE'
        };

        this.$manager.switchAppMode(modeEnumMap[modeId]).then(res => {
          console.log("Android 底层策略切换成功", res);
          // 可以在这里重新触发一次 getDashboardInsight 获取最新推演数据
        }).catch(err => {
          uni.showToast({ title: '底层引擎同步失败', icon: 'error' });
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

.nav-bar {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding: 0 sx(4);
}
.title { font-size: sx(4.5); font-weight: 600; }

/* 关键高度计算：避开 StatusBar、NavBar(约sx(15))、以及底部的 TabBar(约sx(15)) */
.main-scroll {
  flex: 1;
  height: calc(100vh - var(--status-bar-height) - sx(30));
  background-color: var(--md-sys-color-surface-variant); /* 保持卡片底色区分度 */
}

.dashboard-wrapper { padding: sx(4); display: flex; flex-direction: column; gap: sx(4); padding-bottom: sx(8); }

/* === Hero === */
.hero-section { padding: sx(6); border-radius: sx(6); transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 sx(1) sx(3) rgba(0,0,0,0.1); }
.hero-header { display: flex; justify-content: space-between; align-items: flex-start; }
.hero-title { font-size: sx(6); font-weight: bold; display: block; margin-bottom: sx(1); }
.hero-subtitle { font-size: sx(3.5); }
.mode-switch-btn { display: flex; align-items: center; padding: sx(1.5) sx(3); border-radius: sx(4); transition: opacity 0.3s; }
.switch-text { font-size: sx(3.5); margin-right: sx(1); font-weight: 500;}
.score-display { margin-top: sx(6); }
.score-number { font-size: sx(14); font-weight: 900; line-height: 1; letter-spacing: -1px; }

/* === Cards === */
.card-inner { padding: sx(5); }
.section-title-wrap { display: flex; align-items: center; margin-bottom: sx(3); gap: sx(2); }
.section-title { font-size: sx(4); font-weight: bold; color: var(--md-sys-color-on-surface); }
.section-desc { font-size: sx(3.2); color: var(--md-sys-color-outline); margin-bottom: sx(4); display: block; }
.causal-box { padding: sx(4); border-radius: sx(3); border-left: sx(1) solid; transition: all 0.4s ease; }
.causal-reason { font-size: sx(3.8); font-weight: 600; line-height: 1.5; display: block; margin-bottom: sx(2); }
.causal-action { font-size: sx(3.2); color: var(--md-sys-color-on-surface-variant); }

/* === Timeline === */
.timeline-container { padding-top: sx(2); display: flex; flex-direction: column; }
.timeline-item { display: flex; position: relative; padding-bottom: sx(6); }
.timeline-item::before { content: ''; position: absolute; left: sx(1.5); top: sx(4); bottom: 0; width: sx(0.5); background-color: var(--md-sys-color-surface-variant); transform: translateX(-50%); }
.timeline-item:last-child::before { display: none; }
.timeline-item.active-node::before { background-color: transparent; }
.timeline-dot { width: sx(3); height: sx(3); border-radius: 50%; position: relative; z-index: 2; margin-top: sx(1); }
.pulse-dot { box-shadow: 0 0 0 sx(1) var(--md-sys-color-surface), 0 0 0 sx(2) inherit; }
.timeline-content { margin-left: sx(4); flex: 1; }
.tl-time { font-size: sx(3.2); color: var(--md-sys-color-outline); margin-bottom: sx(1); display: block; font-weight: bold; }
.tl-time.text-primary { color: var(--md-sys-color-primary); }
.tl-card { background-color: var(--md-sys-color-surface-variant); padding: sx(3); border-radius: sx(2); display: flex; justify-content: space-between; align-items: center; }
.highlight-card { border: 1px solid; flex-direction: column; align-items: flex-start; }
.tl-title { font-size: sx(3.6); font-weight: 500; color: var(--md-sys-color-on-surface); }
.tl-desc { font-size: sx(3.2); color: var(--md-sys-color-on-surface-variant); margin-top: sx(1.5); }
.tl-tag { background-color: var(--md-sys-color-error-container); color: var(--md-sys-color-on-error-container); padding: sx(1) sx(2); font-size: sx(2.8); border-radius: sx(1); }

/* === Energy === */
.energy-module { display: flex; flex-direction: column; gap: sx(5); }
.energy-row { display: flex; flex-direction: column; }
.energy-label { display: flex; justify-content: space-between; margin-bottom: sx(2); font-size: sx(3.6); font-weight: 500; color: var(--md-sys-color-on-surface); }
.energy-pool-track { height: sx(3.5); background-color: var(--md-sys-color-surface-variant); border-radius: sx(2); overflow: hidden; display: flex; position: relative; box-shadow: inset 0 sx(0.5) sx(1) rgba(0,0,0,0.05); }
.energy-liquid { height: 100%; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); border-radius: sx(2); }
.energy-drain { height: 100%; background: repeating-linear-gradient(45deg, var(--md-sys-color-error-container), var(--md-sys-color-error-container) 10px, transparent 10px, transparent 20px); border-radius: 0 sx(2) sx(2) 0; opacity: 0.8; }
.drain-hint { font-size: sx(3); color: var(--md-sys-color-outline); margin-top: sx(1.5); text-align: right; }

/* === List Cell Override === */
.custom-list-content {
  display: flex; justify-content: space-between; align-items: center; width: 100%;
  padding: 0 sx(6.5); box-sizing: border-box;
}
.cell-label { font-size: sx(4); color: var(--md-sys-color-on-surface); }
.cell-value { font-size: sx(4); font-weight: 500; color: var(--md-sys-color-outline); }

/* === Mode Sheet === */
.mode-sheet { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 100; display: flex; align-items: flex-end; }
.sheet-content { background-color: var(--md-sys-color-surface); width: 100%; border-radius: sx(6) sx(6) 0 0; padding: sx(6); padding-bottom: calc(sx(6) + env(safe-area-inset-bottom)); }
.sheet-title { font-size: sx(4.5); font-weight: bold; margin-bottom: sx(4); display: block; color: var(--md-sys-color-on-surface); }
.mode-options { display: flex; flex-direction: column; gap: sx(3); }
.mode-option { display: flex; align-items: center; padding: sx(4); border-radius: sx(3); background-color: var(--md-sys-color-surface-variant); transition: background-color 0.2s; }
.mode-option.is-active { border: 2px solid var(--md-sys-color-primary); }
.mode-color-dot { width: sx(4); height: sx(4); border-radius: 50%; margin-right: sx(4); }
.m-name { font-size: sx(4); font-weight: 500; display: block; color: var(--md-sys-color-on-surface); }
.m-preview { font-size: sx(3.2); color: var(--md-sys-color-outline); margin-top: sx(1); display: block; }
</style>