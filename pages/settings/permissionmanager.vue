<template>
  <view class="container" :style="themeStyle">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="var(--md-sys-color-on-primary)" size="" type="left" @click="back"/>
        <text class="title">权限管理</text>
        <uni-icons class="icon-right" color="#00000000" size="" type="loop" @click=""/>
      </view>
    </material-nav-bar>

    <scroll-view scroll-y="true" class="scroll-table">

      <view class="section-title">基础运行权限</view>
      <material-list background-color="var(--md-sys-color-surface)" color="var(--md-sys-color-on-surface)">

        <material-list-cell rightIcon @click="handlePermission('Audio')">
          <view class="cell-content">
            <text>麦克风 (环境音防沉迷)</text>
            <text class="status-text" :class="{ 'status-on': status.isAudioOn }">
              {{ status.isAudioOn ? '已授权' : '去授权' }}
            </text>
          </view>
        </material-list-cell>

        <material-list-cell rightIcon @click="handlePermission('Notification')">
          <view class="cell-content">
            <text>通知权限 (前台服务保活)</text>
            <text class="status-text" :class="{ 'status-on': status.isNotificationOn }">
              {{ status.isNotificationOn ? '已授权' : '去授权' }}
            </text>
          </view>
        </material-list-cell>

        <material-list-cell rightIcon @click="handlePermission('Storage')">
          <view class="cell-content">
            <text>存储空间 (日志与配置保存)</text>
            <text class="status-text" :class="{ 'status-on': status.isStorageOn }">
              {{ status.isStorageOn ? '已授权' : '去授权' }}
            </text>
          </view>
        </material-list-cell>

        <material-list-cell rightIcon @click="handlePermission('ExactAlarm')">
          <view class="cell-content">
            <text>精确闹钟 (定时唤醒与心跳)</text>
            <text class="status-text" :class="{ 'status-on': status.isExactAlarmOn }">
              {{ status.isExactAlarmOn ? '已授权' : '去授权' }}
            </text>
          </view>
        </material-list-cell>

      </material-list>


      <view class="section-title">高级系统权限</view>
      <material-list background-color="var(--md-sys-color-surface)" color="var(--md-sys-color-on-surface)">

        <material-list-cell rightIcon @click="handlePermission('UsageStats')">
          <view class="cell-content">
            <text>应用使用情况 (识别当前运行App)</text>
            <text class="status-text" :class="{ 'status-on': status.isUsageStatsOn }">
              {{ status.isUsageStatsOn ? '已授权' : '去授权' }}
            </text>
          </view>
        </material-list-cell>

        <material-list-cell rightIcon @click="handlePermission('Overlay')">
          <view class="cell-content">
            <text>悬浮窗 (桌面挂件/全局提示)</text>
            <text class="status-text" :class="{ 'status-on': status.isOverlayOn }">
              {{ status.isOverlayOn ? '已授权' : '去授权' }}
            </text>
          </view>
        </material-list-cell>

        <material-list-cell rightIcon @click="handlePermission('InstallPackage')">
          <view class="cell-content">
            <text>安装未知应用 (App增量更新)</text>
            <text class="status-text" :class="{ 'status-on': status.isInstallPackageOn }">
              {{ status.isInstallPackageOn ? '已授权' : '去授权' }}
            </text>
          </view>
        </material-list-cell>

      </material-list>


      <view class="section-title">核心保活配置 (需跳转系统设置)</view>
      <material-list background-color="var(--md-sys-color-surface)" color="var(--md-sys-color-on-surface)">

        <material-list-cell rightIcon @click="handleSpecialPermission('Accessibility')">
          <view class="cell-content">
            <text>无障碍服务 (行为阻断与精准识别)</text>
            <text class="status-text" :class="{ 'status-on': status.isAccessibilityOn }">
              {{ status.isAccessibilityOn ? '已开启' : '去开启' }}
            </text>
          </view>
        </material-list-cell>

        <material-list-cell rightIcon @click="handleSpecialPermission('BatteryOpt')">
          <view class="cell-content">
            <text>允许后台运行 (忽略电池优化)</text>
            <text class="status-text" :class="{ 'status-on': status.isBatteryOptIgnored }">
              {{ status.isBatteryOptIgnored ? '已允许' : '去允许' }}
            </text>
          </view>
        </material-list-cell>

      </material-list>

    </scroll-view>
  </view>
</template>

<script>
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import { SXData } from "@/components/material-uni/sx";

// 假设原生的 PermissionsManager 插件暴露如下
const pmPlugin = {};

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    MaterialListCell, MaterialList, MaterialNavBar
  },
  data() {
    return {
      // 使用对象统一管理状态，方便渲染
      status: {
        isAudioOn: false,
        isNotificationOn: false,
        isStorageOn: false,
        isExactAlarmOn: false,
        isUsageStatsOn: false,
        isOverlayOn: false,
        isInstallPackageOn: false,
        isAccessibilityOn: false,
        isBatteryOptIgnored: false
      }
    }
  },
  onLoad() {
    this.refreshAllStatus();
  },
  onShow() {
    // 从系统设置页返回时必须刷新
    this.refreshAllStatus();
  },
  methods: {
    back() {
      uni.navigateBack();
    },

    // 统一拉取最新权限状态
    refreshAllStatus() {
      if (!pmPlugin) return;

      // 常规权限检查
      this.status.isAudioOn = pmPlugin.checkRecordAudio();
      this.status.isNotificationOn = pmPlugin.checkNotification();
      this.status.isStorageOn = pmPlugin.checkStorage();
      this.status.isExactAlarmOn = pmPlugin.checkExactAlarm();

      // 高级权限检查
      this.status.isUsageStatsOn = pmPlugin.checkUsageStats();
      this.status.isOverlayOn = pmPlugin.checkOverlayWindow();
      this.status.isInstallPackageOn = pmPlugin.checkRequestInstallPackage();

      // 特殊系统配置检查
      this.status.isAccessibilityOn = pmPlugin.isAccessibilitySettingsOn("com.feifan.keepalive.AppUsageManager");
      this.status.isBatteryOptIgnored = pmPlugin.isIgnoringBatteryOptimizations();
    },

    // 处理可以直接回调的权限申请
    handlePermission(type) {
      const statusKey = `is${type}On`;
      // 如果已经授权，提示用户去系统设置关闭（Android无法代码收回已授普通权限）
      if (this.status[statusKey]) {
        uni.showToast({ title: '已授权，修改请前往系统设置', icon: 'none' });
        return;
      }

      // 动态调用原生插件的申请方法 (例如 requestAudio, requestStorage 等)
      const requestMethodName = `request${type}`;
      if (pmPlugin && typeof pmPlugin[requestMethodName] === 'function') {
        pmPlugin[requestMethodName]((success) => {
          this.status[statusKey] = success;
          if (success) {
            uni.showToast({ title: '授权成功', icon: 'none' });
          }
        });
      }
    },

    // 处理必须跳系统设置的特殊权限
    handleSpecialPermission(type) {
      if (type === 'Accessibility') {
        if (this.status.isAccessibilityOn) return uni.showToast({ title: '已开启', icon: 'none' });

        uni.showModal({
          title: '开启无障碍服务',
          content: '请在接下来的系统设置中找到本应用并开启，以保证监控服务准确识别前台App。',
          success: (res) => {
            if (res.confirm && pmPlugin) pmPlugin.requestAccessibilityPermission();
          }
        });
      }
      else if (type === 'BatteryOpt') {
        if (this.status.isBatteryOptIgnored) return uni.showToast({ title: '已允许后台运行', icon: 'none' });

        uni.showModal({
          title: '允许后台运行',
          content: '为了防止系统在息屏时杀掉服务，请在接下来的页面中选择“无限制”或“允许后台运行”。',
          success: (res) => {
            if (res.confirm && pmPlugin) pmPlugin.requestIgnoreBatteryOptimizations();
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
}

.scroll-table {
  /* 高度依然维持原样，由于公式没变，这个是对的 */
  height: calc(100vh - var(--status-bar-height) - sx(15));
}

/* 区块标题 */
.section-title {
  /* 原本的 16px 边距对应 sx(5)，8px 对应 sx(2.5) */
  padding: sx(5) sx(5) sx(2.5);
  /* 原本的 14px 字号对应 sx(4.2) */
  font-size: sx(4.2);
  color: var(--md-sys-color-primary);
  font-weight: bold;
}

/* 列表行内 Flex 布局 */
.cell-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

/* 右侧状态文本样式，默认暗淡色 */
.status-text {
  /* 原本的 12px 字号对应 sx(3.6) */
  font-size: sx(3.6);
  color: var(--md-sys-color-outline);
  /* 原本的 8px 边距对应 sx(2.5) */
  margin-right: sx(2.5);
}

/* 状态高亮 (已授权时变成主色) */
.status-on {
  color: var(--md-sys-color-primary);
}
</style>