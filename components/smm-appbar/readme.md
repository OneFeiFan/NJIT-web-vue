#### 仿 flutter 样式的 应用顶部程序栏
在使用该组件之前，请将 uni-app 提供的 原生导航栏 进行隐藏；在 ``pages.json`` 中修改
```
{
	"pages": [{
		"style": {
			"navigationStyle": "custom"
		}
	}],
	"globalStyle": {

		"app-plus": {
			"titleNView": false //禁用原生导航栏 
		}
	}
}
```

目前 android 不支持图标插入，后续版本添加左右侧图标

#### 基本使用

因为顶部应用程序栏被迫使用了 ``fixed``定位，
因此内容区域请自行填充顶部被覆盖的 ``210rpx``区域


```
<template>
   <view>
    <smm-appbar text='首页'></smm-appbar>
	<view class="content">
		Hello word
	</view>
  </view>
</template>
<style lang="scss">
	.content {
		margin-top: 210rpx;
		background-color: #fff;
	}
</style>
```

##### 参数传递

|参数名|默认值|说明|
|:-|:-|:-|
|offsetTop|45px|顶部状态栏与应用程序栏之间的距离|
|text|'Home Page'|标题文字|
|TextSize|40rpx|标题大小|
|TextColor|#fff|标题文字颜色|
|appBarColor|#1e80f1|应用程序栏背景色|
|fullNotie|true|背景色是否填满上方间隔区域|

#### solt 插槽
使用 ``<template #slot:name>`` 进行对应操作

|插槽名|
|:-|
|left|
|right|

#### 事件向外
目前 1.0.0 版本仅实现效果，因此不提供 向外传递事件
建议使用 @click.native() 或自行修改 组件源代码 向外提供