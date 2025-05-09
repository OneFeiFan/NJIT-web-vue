<template>
  <page-meta :page-style="theme"></page-meta>
  <view class="container">
    <material-nav-bar color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250"
                      backgroundColor="var(--md-sys-color-surface-container)">
      <view class="header">
        <uni-icons type="left" size="6vmin" @click="back" class="icon-left"/>
        <text class="title">用户管理</text>
        <uni-icons type="plusempty" size="6vmin" @click="login" class="icon-right"/>
      </view>
    </material-nav-bar>

    <scroll-view scroll-y="true" :style="{'height': scrollHeight + 'px'}">
      <view class="content">
        <material-card width="100%" height="20vmin" color="var(--md-sys-color-primary-fixed)" :opacity="0.4"
                       transition="ease-out" :duration="250"
                       backgroundColor="var(--md-sys-color-surface-container)" v-for="(user,index) in users"
                       :key="index" >
          <view class="user"
                :style="{backgroundColor: user.current? 'var(--md-sys-color-primary-container)':'var(--md-sys-color-surface-container-high)',color: user.current? 'var(--md-sys-color-on-primary-container)':'var(--md-sys-color-on-secondary-container)'}">
            <view class="data" @click="update(index)">
              <text class="id">{{ user.id }}</text>
              <text class="name">{{ user.name }}</text>
            </view>
            <view class="delete">
              <uni-icons class="icon" type="clear" size="8vmin"
                         :color="user.current?'var(--md-sys-color-on-primary-container)':'var(--md-sys-color-on-secondary-container)'"
                         @click="deleteUser(index)"/>
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

export default {
  components: {MaterialCard, MaterialNavBar},
  data() {
    return {
      users: [{}],
      scrollHeight: 0,
    }
  },
  onReady() {
    const systemInfo = uni.getSystemInfoSync();
    let dom = uni.createSelectorQuery().in(this);
    dom.select(".nav-bar").boundingClientRect()

    dom.exec((data) => {
      console.log(data[0].bottom)
      this.scrollHeight = systemInfo.windowHeight - data[0].bottom;
    })
  },
  onShow(){
    //#ifdef APP-PLUS
    this.users = JSON.parse(this.$manager.getAllUsers());

    
    //#endif
  },
  methods: {
    back() {
      uni.navigateBack();
    },
    login() {
      // this.$store

      if(this.users.length > 0) {
        uni.showModal({
          title: '提示',
          content: '继续操作会退出当前用户的登录状态，是否继续？',
          success: (res) => {
            if (res.confirm) {
              console.log(this.$manager, this.$store);
              this.$manager.startLogin();
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      }else{
        this.$manager.startLogin(false);
      }
    },
    update(index) {
      if (index <= this.users.length - 1 && !this.users[index].current) {
        uni.showModal({
          title: '提示',
          content: '这是一个模态弹窗',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      }
    },
    deleteUser(index) {
      console.log(index,this.users.length - 1)
      if (index <= this.users.length - 1) {
        uni.showModal({
          title: '提示',
          content: '确定删除该用户吗？',
          success:  (res) => {
            if (res.confirm) {
              this.$manager.deleteUser(this.users[index].id).then((res) => {
                this.users.splice(index, 1);
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
.header {
  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;
  //justify-content: center;


  .icon-left {
    margin-left: 6vmin;
    /* 调整这个值控制间距 */
    position: relative;
    //top: -6rpx
  }

  .rotate {
    animation: rotate 1s linear infinite;
    display: inline-block;
  }

  .icon-right {
    margin-right: 6vmin;
    /* 调整这个值控制间距 */
    position: relative;
    will-change: transform;
    //top: -6rpx
  }


  .title {
    margin: 0 auto;
    display: block;
    text-align: center;
    font-size: 5vmin;
    color: var(--md-sys-color-on-surface);
  }
}

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