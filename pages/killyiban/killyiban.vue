<template>
  <view class="login-container" :style="themeStyle+SXData">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="var(--md-sys-color-on-primary)" size="" type="left"
                   @click="back"/>
        <text class="title">添加易班账号</text>
        <uni-icons class="icon-right" color="#ffffff00" size="" type="loop" @click=""/>
      </view>
    </material-nav-bar>
    <view class="wrap">


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
          <material-list background-color="var(--md-sys-color-surface-container-low)"
                         color="var(--md-sys-color-on-surface)"
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
                <uni-icons :type="showPassword ? 'eye-filled' : 'eye-slash-filled'" class="suffix-icon"
                           color="var(--md-sys-color-on-surface-variant)"
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
  </view>
</template>

<script>
import {SXData} from '@/components/material-uni/sx';
import MaterialButton from "@/components/material-uni/material-button/material-button.vue";
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";

export default {
  components: {MaterialNavBar, MaterialListCell, MaterialList, MaterialCard, MaterialButton},
  computed: {
    SXData() {
      return SXData;
    },
  },
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      loading: false,
      rememberMe: false,
      error: '',
    };
  },
  onReady() {
    this.initRemember();
  },
  methods: {
    toggleRemember() {
      this.rememberMe = !this.rememberMe;
    },
    /** 读取本地记住的账号 */
    initRemember() {
      const saved = uni.getStorageSync('loginInfo');
      if (saved) {
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
    back(){
      uni.navigateBack()
    },
    /** 登录主流程（async/await） */
    async handleLogin() {
      if (!this.username || !this.password) {
        uni.showToast({
          title: '请输入账号和密码',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      this.error = '';
      this.loading = true;
      uni.showLoading({title: '验证中...'});
      this.$manager.initYiBan(this.username,this.password).then(res => {
        if(res.code === 200) {
          uni.setStorageSync('loginInfo', {
            username: this.username,
            password: this.password,
          });
          uni.showModal({
            title: '验证成功',
            content: `易班账号添加成功，现在可以回到桌面寻找"Kill易班"图标，使用易班签到功能。`,
            showCancel: false,
            success: () => {
              uni.navigateBack()
            }
          })
        }else {
          console.log(res);
          this.error = res.data;
        }
      }).catch(err => {
        this.error = err.message;
      }).finally(() => {
        this.loading = false;
        uni.hideLoading();
      });
    },
  }
};
</script>

<style scoped lang="scss">

/* 容器居中 */
.login-container {
  //display: flex;
  //justify-content: center;
  //align-items: center;
  height: 100vh;
  background: var(--md-sys-color-surface);
}

.wrap {
  display: flex;
  //flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - var(--status-bar-height) - sx(15));
}

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
