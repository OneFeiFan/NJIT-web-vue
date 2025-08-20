<template>
  <view class="container" :style="[getTheme(),SXData]">
    <material-nav-bar id="nav-bar">
      <view class="nav-bar">
        <uni-icons type="left" size="" @click="back" class="icon-left"/>
        <text class="title">用户管理</text>
        <uni-icons type="plusempty" size="" @click="login" class="icon-right"/>
      </view>
    </material-nav-bar>

    <scroll-view scroll-y="true" class="scroll-container">
      <view class="content">
        <material-card width="100%"
                       :color="user.current? 'var(--md-sys-color-on-primary)':'var(--md-sys-color-primary-fixed)'"
                       :backgroundColor="user.current? 'var(--md-sys-color-primary-container)':'var(--md-sys-color-surface-container)'"
                       v-for="(user, id) in users"
                       :key="user.id">
          <view class="user"
                :style="{color: user.current? 'var(--md-sys-color-on-primary-container)':'var(--md-sys-color-on-secondary-container)'}">
            <view class="data" @click="update(id)">
              <text class="id">{{ user.id }}{{ "  " }}GPA:{{ user.gpa }}</text>
              <text class="name">{{ user.name }}</text>
            </view>
            <view class="delete">
              <uni-icons class="icon" type="clear" :size="mx(10)"
                         :color="user.current?'var(--md-sys-color-on-primary-container)':'var(--md-sys-color-on-secondary-container)'"
                         @click="deleteUser(id)"/>
            </view>
          </view>
        </material-card>
      </view>
    </scroll-view>

  </view>
</template>

<script>
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import {mx, SXData} from "@/components/material-uni/sx";
import {getTheme} from "@/components/material-uni/colors";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {UniIcons, MaterialCard, MaterialNavBar},
  data() {
    return {
      users: {},
    }
  },
  onReady() {

  },
  onShow() {
    //#ifdef APP-PLUS
    this.users = JSON.parse(this.$manager.getAllUsers());
    // console.log(this.users);

    //#endif
  },
  methods: {
    mx,
    getTheme,
    back() {
      uni.navigateBack();
    },
    login() {
      // this.$store

      if (Object.keys(this.users).length > 0) {
        uni.showModal({
          title: '提示',
          content: '继续操作会退出当前用户的登录状态，是否继续？',
          success: (res) => {
            if (res.confirm) {
              this.$manager.startLogin(false);
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      } else {
        this.$manager.startLogin(false);
      }
    },
    update(id) {
      if (this.users[id] && !this.users[id].current) {
        setTimeout(() => {
          uni.showModal({
            title: '提示',
            content: '将会清空当前用户数据，是否继续？',
            success: (res) => {
              if (res.confirm) {
                this.$manager.setCurrentUser(id)
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
        }, 300);
      }
    },
    deleteUser(id) {
      if (this.users[id]) {
        setTimeout(() => {
          uni.showModal({
            title: '提示',
            content: '确定删除该用户吗？',
            success: (res) => {
              if (res.confirm) {
                this.$manager.deleteUser(id).then((res) => {
                  console.log(res)
                  this.$delete(this.users, id);
                }).catch((err) => {
                  console.log(err)
                });
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
        }, 300);
      }
    }
  }
}
</script>

<style lang="scss">
.container {
  height: 100vh;
  background-color: var(--md-sys-color-surface);
}

.scroll-container{
  height: calc(100vh - sx(10) - var(--status-bar-height));
}

.content {
  padding: sx(3);

  .card {
    margin-top: sx(4);

    &:first-child {
      margin-top: 0;
    }
  }
}

.user {
  padding: sx(3);
  box-sizing: border-box;
  height: 100%;
  background-color: #ffffff00;
  display: flex;
  justify-content: space-between;
  color: var(--md-sys-color-on-secondary-container);

  .data {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: sx(6.5);
    font-weight: bold;
  }

  .delete {
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1 / 1; /* 宽度和高度相等 */

    .icon {
      height: sx(15);
      width: sx(15);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>