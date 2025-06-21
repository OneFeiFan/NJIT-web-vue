<template>
  <page-meta :page-style="theme"></page-meta>
  <view class="container">
    <material-nav-bar id="nav-bar" color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250"
                      backgroundColor="var(--md-sys-color-surface-container)">
      <view class="nav-bar">
        <uni-icons type="left" size="6vmin" @click="back" class="icon-left"/>
        <text class="title">用户管理</text>
        <uni-icons type="plusempty" size="6vmin" @click="login" class="icon-right"/>
      </view>
    </material-nav-bar>

    <scroll-view scroll-y="true" :style="{'height': scrollHeight + 'px'}">
      <view class="content">
        <material-card width="100%" height="20vmin" color="var(--md-sys-color-primary-fixed)" :opacity="0.4"
                       transition="ease-out" :duration="250"
                       backgroundColor="var(--md-sys-color-surface-container)" v-for="(user, id) in users"
                       :key="id">
          <view class="user"
                :style="{backgroundColor: user.current? 'var(--md-sys-color-primary-container)':'var(--md-sys-color-surface-container-high)',color: user.current? 'var(--md-sys-color-on-primary-container)':'var(--md-sys-color-on-secondary-container)'}">
            <view class="data" @click="update(id)">
              <text class="id">{{ id }}{{"  "}}GPA:{{ user.gPA }}</text>
              <text class="name">{{ user.name }}</text>
            </view>
            <view class="delete">
              <uni-icons class="icon" type="clear" size="8vmin"
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

export default {
  components: {UniIcons, MaterialCard, MaterialNavBar},
  data() {
    return {
      users: {
        "0":{}
      },
      scrollHeight: 0,
    }
  },
  onReady() {
    const systemInfo = uni.getSystemInfoSync();
    let dom = uni.createSelectorQuery().in(this);
    dom.select("#nav-bar").boundingClientRect()

    dom.exec((data) => {
      this.scrollHeight = systemInfo.windowHeight - data[0].bottom;
    })
  },
  onResize(){
    const systemInfo = uni.getSystemInfoSync();
    let dom = uni.createSelectorQuery().in(this);
    dom.select("#nav-bar").boundingClientRect()

    dom.exec((data) => {
      this.scrollHeight = systemInfo.windowHeight - data[0].bottom;
    })
  },
  onShow(){
    //#ifdef APP-PLUS
    this.users = JSON.parse(this.$manager.getAllUsers());
    console.log(this.users);
    
    //#endif
  },
  methods: {
    back() {
      uni.navigateBack();
    },
    login() {
      // this.$store

      if(Object.keys(this.users).length > 0) {
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
      }else{
        this.$manager.startLogin(false);
      }
    },
    update(id) {
      if (this.users[id] && !this.users[id].current) {
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
      }
    },
    deleteUser(id) {
      if (this.users[id]) {
        uni.showModal({
          title: '提示',
          content: '确定删除该用户吗？',
          success:  (res) => {
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

.content {
  padding: 2.5vmin;

  .card {
    margin-top: 3vmin;

    &:first-child {
      margin-top: 0;
    }
  }
}

.user {
  padding: 2.5vmin;
  box-sizing: border-box;
  height: 100%;
  background-color: var(--md-sys-color-surface-container-high);
  display: flex;
  justify-content: space-between;
  color: var(--md-sys-color-on-secondary-container);

  .data {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: 5vmin;
    font-weight: bold;
  }

  .delete {
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1 / 1; /* 宽度和高度相等 */

    .icon {
      padding: 1.5vmin;
    }
  }
}
</style>