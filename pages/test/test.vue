<template>
  <view class="container" :style="themeStyle">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="var(--md-sys-color-on-primary)" size="" type="left"
                   @click="back"/>
        <text class="title">闹钟管理</text>
        <uni-icons class="icon-right" color="#00000000" size="" type="loop" @click=""/>
      </view>
    </material-nav-bar>
    <view class="wrap">
      <!-- 预览与操作面板 -->
      <material-card
          background-color="var(--md-sys-color-primary-container)"
          color="var(--md-sys-color-on-primary-container)"
      >
        <view class="preview-inner">
          <text class="preview-header">今日闹钟状态</text>

          <view class="preview-content" v-if="alarmStatus">
            <text class="status-label" v-if="!config.alarmEnabled">闹钟功能已关闭</text>
            <block v-else>
              <text class="time-display">
                {{ formatTime(alarmStatus.suggestedWakeUpHour, alarmStatus.suggestedWakeUpMinute) }}
              </text>
              <text class="reason-text">{{ alarmStatus.alarmLabel || alarmStatus.reason }}</text>
            </block>
          </view>
          <view class="preview-content" v-else>
            <text class="reason-text">正在评估数据...</text>
          </view>

          <view class="action-btn-wrap">
            <material-button
                type="filled"
                size="large"
                shape="pill"
                color="var(--md-sys-color-on-primary)"
                background-color="var(--md-sys-color-primary)"
                :disabled="!canTriggerAlarm || isSetting"
                @click="handleSetAlarm"
                style="width: 100%;"
            >
              {{ isSetting ? '调起中...' : '立即确认闹钟' }}
            </material-button>
          </view>
        </view>
      </material-card>

      <!-- 常规配置 -->
      <material-card color="var(--md-sys-color-outline)">
        <view class="card-inner">
          <text class="card-title">基础规则</text>

          <view class="list-item">
            <view class="item-main">
              <text class="item-title">启用智能闹钟计算</text>
              <text class="item-desc">关闭后，决策引擎将不再干预起床时间</text>
            </view>
            <switch :checked="config.alarmEnabled" color="#42b983" @change="onToggleEnabled"/>
          </view>

          <view class="list-item column-item" :class="{ 'disabled-item': isSliderDisabled }">
            <view class="item-main">
              <text class="item-title">上课前缓冲时间 ({{ config.preClassBufferMinutes }} 分钟)</text>

              <text class="item-desc" v-if="!config.alarmEnabled">智能闹钟已关闭，该设置暂不生效</text>
              <text class="item-desc" v-else-if="alarmStatus && alarmStatus.alarmType === 'noClass'">
                明日无课，将使用无课日默认时间
              </text>
              <text class="item-desc" v-else-if="alarmStatus && alarmStatus.alarmType === 'override'">
                已开启单次覆盖，该设置暂不生效
              </text>
              <text class="item-desc" v-else>闹钟时间 = 第一节课开始时间 - 缓冲时间</text>
            </view>

            <slider
                class="slider"
                :value="config.preClassBufferMinutes"
                :min="60"
                :max="120"
                :step="5"
                :activeColor="isSliderDisabled ? 'var(--md-sys-color-surface-variant)' : '#42b983'"
                :disabled="isSliderDisabled"
                @change="onBufferChange"
            />
          </view>

          <view class="list-item">
            <view class="item-main">
              <text class="item-title">无课日默认起床时间</text>
              <text class="item-desc">当明天没有安排课程时的托底配置</text>
            </view>
            <picker mode="time" :value="noClassTimeStr" @change="onNoClassTimeChange">
              <view class="picker-value">{{ noClassTimeStr }}</view>
            </picker>
          </view>
        </view>
      </material-card>

      <!-- 特殊干预配置 -->
      <material-card color="var(--md-sys-color-outline)">
        <view class="card-inner">
          <text class="card-title">单次强制覆盖</text>
          <text class="section-desc">应对特殊情况（如赶车、考试），仅在指定日期生效，优先级别最高。</text>

          <view class="list-item">
            <text class="item-title">目标日期</text>
            <picker mode="date" :value="config.oneTimeOverrideDate || todayDate" @change="onOverrideDateChange">
              <view class="picker-value">{{ config.oneTimeOverrideDate || '未设置' }}</view>
            </picker>
          </view>

          <view class="list-item" v-if="config.oneTimeOverrideDate">
            <text class="item-title">起床时间</text>
            <picker mode="time" :value="overrideTimeStr" @change="onOverrideTimeChange">
              <view class="picker-value">{{ overrideTimeStr }}</view>
            </picker>
          </view>

          <view class="clear-btn-wrap" v-if="config.oneTimeOverrideDate">
            <material-button type="text" size="small" color="var(--md-sys-color-error)" @click="handleClearOverride">
              清除特殊闹钟
            </material-button>
          </view>
        </view>
      </material-card>
    </view>
  </view>
</template>

<script>
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import MaterialButton from "@/components/material-uni/material-button/material-button.vue";
import MaterialNavBar from "../../components/material-uni/material-nav-bar/material-nav-bar.vue";
import UniIcons from "../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue";

export default {
  components: {
    UniIcons,
    MaterialNavBar,
    MaterialCard,
    MaterialButton
  },
  data() {
    return {
      config: {
        preClassBufferMinutes: 60,
        noClassWakeUpHour: 8,
        noClassWakeUpMinute: 0,
        oneTimeOverrideHour: 0,
        oneTimeOverrideMinute: 0,
        oneTimeOverrideDate: '',
        alarmEnabled: true
      },
      alarmStatus: null,
      isSetting: false
    };
  },
  computed: {
    noClassTimeStr() {
      return this.formatTime(this.config.noClassWakeUpHour, this.config.noClassWakeUpMinute);
    },
    overrideTimeStr() {
      return this.formatTime(this.config.oneTimeOverrideHour, this.config.oneTimeOverrideMinute);
    },
    todayDate() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    },
    canTriggerAlarm() {
      return this.config.alarmEnabled && this.alarmStatus && this.alarmStatus.canSetAlarm;
    },
    isSliderDisabled() {
      if (!this.config.alarmEnabled) return true;
      if (!this.alarmStatus) return true;
      if (this.alarmStatus.alarmType === 'noClass' || this.alarmStatus.alarmType === 'override') {
        return true;
      }
      return false;
    }
  },
  onShow() {
    this.syncData();
  },
  methods: {
    back() {
      uni.navigateBack();
    },
    formatTime(h, m) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      return `${hh}:${mm}`;
    },

    async syncData() {
      const localConfig = this.$manager.getWakeUpConfigData();
      if (localConfig) {
        this.config = Object.assign(this.config, localConfig);
      }
      this.refreshPreview();
    },
    async refreshPreview() {
      this.alarmStatus = await this.$manager.getAlarmStatusAsync();
    },

    executeSave() {
      const c = this.config;
      const success = this.$manager.saveConfigFull(
          c.preClassBufferMinutes,
          c.noClassWakeUpHour, c.noClassWakeUpMinute,
          c.oneTimeOverrideHour, c.oneTimeOverrideMinute, c.oneTimeOverrideDate,
          c.alarmEnabled
      );
      if (success) {
        uni.showToast({title: '已保存', icon: 'none'});
        this.refreshPreview();
      } else {
        uni.showToast({title: '保存失败', icon: 'none'});
      }
    },

    onToggleEnabled(e) {
      this.config.alarmEnabled = e.detail.value;
      this.executeSave();
    },
    onBufferChange(e) {
      this.config.preClassBufferMinutes = e.detail.value;
      this.executeSave();
    },
    onNoClassTimeChange(e) {
      const parts = e.detail.value.split(':');
      this.config.noClassWakeUpHour = parseInt(parts[0], 10);
      this.config.noClassWakeUpMinute = parseInt(parts[1], 10);
      this.executeSave();
    },

    onOverrideDateChange(e) {
      const targetDate = e.detail.value;
      this.config.oneTimeOverrideDate = targetDate;
      if (this.config.oneTimeOverrideHour === 0 && this.config.oneTimeOverrideMinute === 0) {
        this.config.oneTimeOverrideHour = 6;
        this.config.oneTimeOverrideMinute = 0;
      }
      this.handleOverrideSave();
    },
    onOverrideTimeChange(e) {
      const parts = e.detail.value.split(':');
      this.config.oneTimeOverrideHour = parseInt(parts[0], 10);
      this.config.oneTimeOverrideMinute = parseInt(parts[1], 10);
      this.handleOverrideSave();
    },
    handleOverrideSave() {
      const success = this.$manager.setOneTimeOverrideSync(
          this.config.oneTimeOverrideHour,
          this.config.oneTimeOverrideMinute,
          this.config.oneTimeOverrideDate
      );
      if (success) {
        uni.showToast({title: '特权闹钟已设置', icon: 'none'});
        this.refreshPreview();
      }
    },
    handleClearOverride() {
      const success = this.$manager.clearOneTimeOverrideSync();
      if (success) {
        this.config.oneTimeOverrideDate = '';
        this.config.oneTimeOverrideHour = 0;
        this.config.oneTimeOverrideMinute = 0;
        uni.showToast({title: '已清除', icon: 'none'});
        this.refreshPreview();
      }
    },

    async handleSetAlarm() {
      if (this.isSetting || !this.canTriggerAlarm) return;
      this.isSetting = true;
      const result = await this.$manager.requestSetAlarmAsync();

      if (result) {
        console.log("Alarm Intent Fired:", result);
      } else {
        uni.showToast({title: '无法唤起系统闹钟', icon: 'none'});
      }

      setTimeout(() => {
        this.isSetting = false;
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: var(--md-sys-color-surface);

}

.wrap{
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: sx(4);
  gap: sx(4);
}

.card-inner {
  padding: sx(5);
}

.card-title {
  font-size: sx(4.5);
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
  margin-bottom: sx(2);
  display: block;
}

.section-desc {
  font-size: sx(3.2);
  color: var(--md-sys-color-outline);
  margin-bottom: sx(4);
  display: block;
  line-height: 1.4;
}

/* 列表项布局：恢复为您最开始高内聚的 Flex 结构，以支持变高内容 */
.list-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: sx(4) 0;
  border-bottom: 1px solid color-mix(in srgb, var(--md-sys-color-secondary) 50%, transparent); /* 从 material-list-cell 借用的底边线颜色逻辑 */
}

.list-item:last-child {
  border-bottom: none;
}

.column-item {
  flex-direction: column;
  align-items: flex-start;
}

/* 文本层级 */
.item-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-right: sx(4);
}

.item-title {
  font-size: sx(4);
  color: var(--md-sys-color-on-surface);
  font-weight: 500;
}

.item-desc {
  font-size: sx(3.2);
  color: var(--md-sys-color-outline);
  margin-top: sx(1.5);
  line-height: 1.4;
}

/* 交互组件 */
.slider {
  width: 100%;
  margin: sx(4) 0 sx(2) 0;
}

.picker-value {
  font-size: sx(3.8);
  color: var(--md-sys-color-primary);
  font-weight: 600;
}

.disabled-item {
  opacity: 0.5;
  pointer-events: none;
}

.clear-btn-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: sx(2);
}

/* 预览卡片定制 */
.preview-inner {
  padding: sx(6);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-header {
  font-size: sx(3.5);
  font-weight: bold;
  color: var(--md-sys-color-on-primary-container);
  opacity: 0.8;
  margin-bottom: sx(2);
}

.preview-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: sx(6);
}

.time-display {
  font-size: sx(16);
  font-weight: 900;
  color: var(--md-sys-color-on-primary-container);
  line-height: 1.2;
}

.status-label {
  font-size: sx(5.5);
  font-weight: bold;
  color: var(--md-sys-color-on-primary-container);
  margin: sx(4) 0;
}

.reason-text {
  font-size: sx(3.5);
  color: var(--md-sys-color-on-primary-container);
  opacity: 0.9;
  margin-top: sx(2);
  text-align: center;
}

.action-btn-wrap {
  width: 100%;
  display: flex;
}
</style>