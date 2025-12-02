<template>
  <view class="login-container" :style="[theme, SXData]">
    <!-- MD2 风格通常 Card 圆角较小，阴影较深 -->
    <material-card background-color="var(--md-sys-color-surface-container-low)" class="login-box "
                   color="var(--md-sys-color-on-surface)">
      <view class="md2-card">

      <!-- 错误提示 -->
      <view v-if="error" class="error-message">
        <uni-icons class="icon-error" color="var(--md-sys-color-on-error-container)" size="18" type="info-filled"/>
        <text class="error-text">{{ error }}</text>
      </view>

      <!-- 表单 -->
      <view class="login-form">
        <material-list background-color="var(--md-sys-color-surface-container-low)" color="var(--md-sys-color-on-surface)"
                       style="display: contents;gap: 8px;">
          <material-list-cell :show-left-text="false">
            <view class="input-wrapper">
              <uni-icons class="prefix-icon" color="var(--md-sys-color-primary)" size="20" type="person-filled"/>
              <view class="input-content">
                <text class="floating-label">账号</text>
                <input v-model="username" class="input" placeholder="请输入账号"/>
              </view>
            </view>
          </material-list-cell>
          <material-list-cell :show-left-text="false">
            <view class="input-wrapper">
              <uni-icons class="prefix-icon" color="var(--md-sys-color-primary)" size="20" type="locked-filled"/>
              <view class="input-content">
                <text class="floating-label">密码</text>

                <input v-if="showPassword" v-model="password" class="input" placeholder="请输入密码" type="text"/>
                <input v-else v-model="password" class="input" placeholder="请输入密码" type="password"/>
              </view>
              <uni-icons :type="showPassword ? 'eye-filled' : 'eye-slash-filled'" class="suffix-icon" color="var(--md-sys-color-on-surface-variant)"
                         size="20" @click="showPassword = !showPassword"/>
            </view>
          </material-list-cell>
        </material-list>

        <!-- 记住我 -->
        <view class="form-options">
          <label class="remember-me" @click="toggleRemember">
            <!-- 使用 uni-icons 模拟 MD 风格 checkbox，或者原生 checkbox -->
            <view class="checkbox-wrapper">
              <uni-icons v-if="rememberMe" color="var(--md-sys-color-primary)" size="22" type="checkbox-filled"/>
              <uni-icons v-else color="var(--md-sys-color-outline)" size="22" type="circle"/>
            </view>
            <text class="remember-text">记住我</text>
          </label>
        </view>

        <!-- 登录按钮 -->
        <view class="button-area">
          <material-button
              :disabled="loading"
              backgroundColor="var(--md-sys-color-primary)"
              class="login-button"
              color="var(--md-sys-color-on-primary)"
              shape="square"
              size="large"
              @click="handleLogin"
          >
            <!-- MD2 按钮圆角通常较小 (4px) -->
            <text v-if="loading">登录中...</text>
            <text v-else>登 录</text>
          </material-button>
        </view>
      </view>
      </view>
    </material-card>
  </view>
</template>

<script>
import {getTheme} from '@/components/material-uni/colors';
import {SXData} from '@/components/material-uni/sx';
import MaterialButton from "@/components/material-uni/material-button/material-button.vue";
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import {baseUrl} from "@/static/urlConfig";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";

export default {
  name: 'Login',
  components: {MaterialListCell, MaterialList, MaterialCard, MaterialButton},
  computed: {
    SXData() {
      return SXData;
    },
  },
  data() {
    return {
      theme: {},          // 主题样式
      username: '',
      password: '',
      showPassword: false,
      loading: false,
      rememberMe: false,
      error: '',
    };
  },
  // uni‑app 生命周期：页面加载完成后执行
  onReady() {
    this.refreshTheme();
    this.initRemember();
  },
  methods: {
    toggleRemember() {
      this.rememberMe = !this.rememberMe;
    },
    /** 读取本地记住的账号 */
    initRemember() {
      const saved = uni.getStorageSync('loginInfo');
      if(saved){
        this.username = saved.username;
        if (saved.password) {
          this.password = saved.password;
          this.rememberMe = true;
        } else {
          this.password = '';
          this.rememberMe = false;
        }
      }
    },

    /** 刷新主题 */
    refreshTheme() {
      this.theme = getTheme();
    },

    /** 登录主流程（async/await） */
    async handleLogin() {
      if (!this.username || !this.password) {
        uni.showToast({
          title: '请输入账号和密码',
          icon: 'none', // MD 风格下 error 图标可能不适配，用 none 更稳妥
          duration: 2000
        });
        return;
      }

      this.error = '';
      this.loading = true;
      uni.showLoading({title: '登录中...'});

      // 保持原有逻辑不变
      let request = new Promise((resolve, reject) => uni.request({
            url: baseUrl+'/login',
            method: 'POST',
            data: {
              "studentId": this.username,
              "password": this.password
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: (res) => {
              if (res.data.code === 200) {
                resolve(res.data)
              } else {
                reject(res.data)
              }
            },
            fail: (res) => {
              reject(res)
            }
          })
      )

      request.then(res => {
        uni.showToast({
          title: '登录成功',
          duration: 2000
        });
        if (this.rememberMe) {
          uni.setStorageSync('loginInfo', {
            username: this.username,
            password: this.password  // 存储密码
          });
        } else {
          // 如果之前存了，现在不记住了，只存用户名或者清除
          uni.setStorageSync('loginInfo', {
            username: this.username,
            password: ''
          });
        }
        // 登录成功后跳转
        uni.navigateBack();
      }).catch(err => {
        // 错误处理逻辑不变，只展示文字
        this.error = (err && err.msg) ? err.msg : (typeof err === 'string' ? err : '登录失败，请检查网络');
      }).finally(() => {
        this.loading = false;
        uni.hideLoading();
      })
    },
  },
};
</script>

<style scoped lang="scss">

/* 容器居中 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: var(--md-sys-color-surface);
}

/* MD2 风格卡片 */
.md2-card {
  //--test: 0px;
  //$width: sx(200); // 稍微调宽一点
  max-width: 90vw; // 限制最大宽度，适配平板
  width: sx(100);
  padding: sx(4); // MD2 常见的 padding
}

/* 错误提示 */
.error-message {
  display: flex;
  align-items: center;
  background: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  padding: sx(3) sx(4);
  border-radius: sx(1);
  margin-bottom: sx(6);
  font-size: sx(3.5);

  .icon-error {
    margin-right: sx(3);
  }

  .error-text {
    flex: 1;
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: sx(5); // 表单间距

  .input-wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;

    .prefix-icon {
      margin-right: sx(3);
    }

    .suffix-icon {
      margin-left: sx(2);
    }

    .input-content {
      flex: 1;
      position: relative;
      height: 100%;
      display: flex;
      align-items: flex-end; // 输入框文字底部对齐
      padding-bottom: sx(2);

      .floating-label {
        position: absolute;
        left: 0;
        pointer-events: none;
        top: sx(1);
        font-size: sx(4);
        color: var(--md-sys-color-primary);
      }

      .input {
        width: 100%;
        background: transparent;
      }
    }
  }

  /* 记住我 */
  .form-options {
    margin-top: sx(1);

    .remember-me {
      display: flex;
      align-items: center;
      width: fit-content;

      .checkbox-wrapper {
        margin-right: sx(2);
        display: flex;
        align-items: center;
      }

      .remember-text {
        font-size: sx(4);
        //color: var(--md-sys-color-on-surface);
      }
    }
  }

  /* 按钮区域 */
  .button-area {
    display: flex;

    .login-button {
      width: 100%; // 移动端通常全宽
    }
  }
}
</style>
