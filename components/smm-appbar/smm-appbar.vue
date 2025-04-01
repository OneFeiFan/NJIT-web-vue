<template>
	<view class="appBar">
		<view class="offsetTop" :style="{height:offsetTop+'px',background:fullNotie?appBarColor:'transparent'}"></view>
		<view class="appBar-title" :style='{background:appBarColor}'>
			<slot name="left"></slot>
			<view class="appBar-title-text" :style="{color:TextColor,fontSize:TextSize+'rpx'}">{{text}}</view>
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "smm-appbar",
		data() {
			return {

			};
		},
		props: {
			offsetTop: {
				type: Number,
				default: 45
			},
			text:{
				type:String,
				default:'Home Page'
			},
			TextSize:{
				type: Number,
				default: 40
			},
			TextColor:{
				type:String,
				default:'#FFF'
			},
			appBarColor:{
				type:String,
				default:'#1e80f1'
			},
			// 是否延展到通知栏
			fullNotie:{
				type:Boolean,
				default:true
			}
		}
	}
</script>

<style lang="scss">
	@import url("icon.scss");
	.appBar {
		position: fixed;
		top: 0;
		left: 0;
		margin-bottom: 40rpx;
		width: 100%;
		box-shadow: 0rpx 0rpx 8rpx rgba(0, 0, 0, .8);

		.offsetTop {
			// background-color: transparent;
		}

		.appBar-title {
			display: flex;
			padding: 0 20rpx;
			justify-content: center;
			align-items: center;
			height: 120rpx;
			background-color: #1e80f1;

			.appBar-title-text {
				display: flex;
				justify-content: center;
				align-items: center;
				// font-size: 40rpx;
				height: 100%;
			}
		}
	}
</style>