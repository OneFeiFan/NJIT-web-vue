<template>
  <view class="login-container" :style="[theme, SXData]">
    <material-card class="login-box" background-color="var(--md-sys-color-surface-container)">

      <!-- Header -->
      <view class="login-header">
        <text class="login-title">欢迎登录</text>
      </view>

      <!-- 错误提示 -->
      <view v-if="error" class="error-message">
        <uni-icons class="icon-error" type="info-filled" size="" color="var(var(--md-sys-color-on-error-container))"/>
        <text>{{ error }}</text>
      </view>

      <!-- 表单 -->
      <view class="login-form">
        <!-- 账号 -->
        <view class="form-group">
          <text class="label">账号</text>
          <view class="input-wrapper">
            <uni-icons class="icon-user" type="person-filled" size="" color="var(--md-sys-color-on-surface)"/>
            <input
                class="input"
                v-model="username"
                type="text"
                placeholder="请输入账号"
                placeholder-style="{ color: '#bbb' }"
            />
          </view>
        </view>

        <!-- 密码 -->
        <view class="form-group">
          <text class="label">密码</text>
          <view class="input-wrapper">
            <uni-icons class="icon-lock" type="locked-filled" size="" color="var(--md-sys-color-on-surface)"/>
            <input
                v-if="showPassword"
                class="input"
                v-model="password"
                type="text"
                placeholder="请输入密码"
                placeholder-style="{ color: '#bbb' }"
            />
            <input
                v-else
                class="input"
                v-model="password"
                type="password"
                placeholder="请输入密码"
                placeholder-style="{ color: '#bbb' }"
            />
            <uni-icons class="icon-user" :type="showPassword ? 'eye-filled' : 'eye-slash-filled'" size=""
                       @click="showPassword = !showPassword" color="var(--md-sys-color-on-surface)"/>
          </view>
        </view>

        <!-- 记住我 -->
        <view class="form-options">
          <label class="remember-me">
            <checkbox v-if="!rememberMe" :checked="false" @click="rememberMe = true" color="var(--md-sys-color-on-surface)"/>
            <checkbox v-else :checked="true" @click="rememberMe = false" color="var(--md-sys-color-on-surface)"/>
            记住我
          </label>
        </view>

        <!-- 登录按钮 -->
        <material-button
            size="medium"
            color="var(--md-sys-color-on-primary"
            class="login-button"
            :disabled="loading"
            @click="handleLogin"
            backgroundColor="var(--md-sys-color-primary)"
        >
          <text v-if="loading">登录中...</text>
          <text v-else>登 录</text>
        </material-button>
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

export default {
  name: 'Login',
  components: {MaterialCard, MaterialButton},
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
    /** 读取本地记住的账号 */
    initRemember() {
      const saved = uni.getStorageSync('loginInfo');
      if(saved){
        if (!saved.password) {
          this.username = saved.username;
          this.password = '';  // 不自动填充密码
          this.rememberMe = false;  // 默认不记住密码
        }else{
          this.username = saved.username;
          this.password = saved.password;  // 不自动填充密码
          this.rememberMe = true;  // 默认不记住密码
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
        // this.error = '请输入账号和密码';
        uni.showToast({
          title: '请输入账号和密码',
          icon: 'error',
          duration: 2000
        });
        return;
      }

      this.error = '';
      this.loading = true;
      uni.showLoading({title: '登录中...'});

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
          uni.removeStorageSync('loginInfo');
          uni.setStorageSync('loginInfo', {
            username: this.username,
            password: this.password  // 存储密码
          });
        } else {
          uni.setStorageSync('loginInfo', {
            username: this.username,  // 只存储账号
            password: ''  // 密码置空
          });
        }
        // 登录成功后跳转
        uni.navigateBack();
      }).catch(err => {
        this.error = err.data;
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
  min-height: 100vh;
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
}

/* 登录框 */
.login-box {
  --test: 0px;
  $width: calc((90vw + sx(90)) / 2);
  max-width: calc(100vw - sx(15) - var(--test));
  width: $width;
  padding: sx(5);
  border-radius: sx(5);
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: sx(5);

  .login-title {
    font-size: sx(6);
    font-weight: 600;
  }
}

/* 错误提示 */
.error-message {
  display: flex;
  align-items: center;
  background: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  padding: sx(2.5);
  border-radius: sx(1.5);
  margin-bottom: sx(4);

  .icon-error {
    font-size: sx(6);
  }
}

.login-form {
  display: flex;
  align-items: center;
  flex-direction: column;

  /* 表单 */
  .form-group {
    width: 100%;
    margin-bottom: sx(6);

    .label {
      display: block;
      font-size: sx(5);
      margin-bottom: sx(2);
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      border: sx(0.5) solid var(--md-sys-color-outline);
      border-radius: sx(2);
      height: sx(10);

      .uni-input-placeholder {
        position: absolute;
      }

      .icon-user,
      .icon-lock {
        padding: sx(1);
        font-size: sx(6);
      }
    }
    .input {
      width: 100%;
      height: 100%;
      font-size: sx(4);
    }
  }

  /* 记住我 */
  .form-options {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: sx(4);

    .remember-me {
      display: flex;
      align-items: center;
      font-size: sx(5);
    }
  }
}


/* 登录按钮 */
.login-button {
  width: 50%;
  font-weight: 500;
}
</style>