<template>
	<!-- mask-click="false" 配合代码逻辑，防止点击遮罩关闭 -->
	<uni-popup ref="WelcomeDialog" :mask-click="false" mask-background-color="#00000040" @change="maskChange">
		<material-card color="var(--md-sys-color-on-surface)" background-color="var(--md-sys-color-surface)"
			@click.stop>
			<view class="card">
				<!-- 标题栏 -->
				<view class="header">
					<view class="title-group">
						<uni-icons type="info-filled" size="24" color="var(--md-sys-color-primary)"></uni-icons>
						<text class="title">版本更新说明</text>
					</view>
					<!-- 倒计时提示 -->
					<!--        <text v-if="timeLeft > 0" class="timer-text">{{ timeLeft }}s</text>-->
				</view>

				<!-- 内容区域 -->
				<scroll-view class="content-container" scroll-y="true">
					<view class="intro-text">
						你好，希望你能够为我停留 10 秒钟。经过最近的一段时间开发，APP 加入并优化了以下功能：
					</view>

					<!-- 功能列表 -->
					<view class="feature-list">

						<view class="feature-item">
							<view class="icon-box">
								<uni-icons type="checkbox-filled" color="var(--md-sys-color-primary)"
									size="20"></uni-icons>
							</view>
							<view class="text-box">
								<text class="feat-title">易班签到</text>
								<text class="feat-desc">本次更新加入了易班签到功能，让校园生活更便捷。</text>
							</view>
						</view>

						<view class="feature-item">
							<view class="icon-box">
								<uni-icons type="settings-filled" color="var(--md-sys-color-primary)"
									size="20"></uni-icons>
							</view>
							<view class="text-box">
								<text class="feat-title">功能优化</text>
                <text class="feat-desc">编辑课表的教程移至“设置>FAQ”中。</text>
								<text class="feat-desc">上一版的课表编辑和 WiFi 一键认证的功能已完成体验优化。</text>
							</view>
						</view>

						<view class="feature-item">
							<view class="icon-box">
								<uni-icons type="calendar-filled" color="var(--md-sys-color-tertiary)"
									size="20"></uni-icons>
							</view>
							<view class="text-box">
								<text class="feat-title">桌面小组件（推荐）</text>
								<text class="feat-desc">藏在设置里的旧功能！通过调整大小，它可显示 2 或 4 门课，大大减少 APP 启动次数。</text>
							</view>
						</view>

						<view class="feature-item">
							<view class="icon-box">
								<uni-icons type="help-filled" color="var(--md-sys-color-secondary)"
									size="20"></uni-icons>
							</view>
							<view class="text-box">
								<text class="feat-title">FAQ 答疑</text>
								<text class="feat-desc">其余问题可以在设置的 FAQ 中获得回答，我会持续更新的。</text>
							</view>
						</view>

					</view>
				</scroll-view>

				<!-- 底部按钮 -->
				<view class="footer">
					<material-button class="action-btn"
						:background-color="canClose ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-variant)'"
						:color="canClose ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)'"
						shape="square" size="medium" :disabled="!canClose" @click="handleClose">
						{{ btnText }}
					</material-button>
				</view>
			</view>
		</material-card>
	</uni-popup>
</template>

<script>
	import {
		getTheme
	} from "@/components/material-uni/colors";
	import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
	import MaterialButton from "@/components/material-uni/material-button/material-button.vue";

	export default {
		components: {
			MaterialButton,
			MaterialCard
		},
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			duration: {
				type: Number,
				default: 10
			} // 默认强制阅读10秒
		},
		data() {
			return {
				timeLeft: 10,
				timer: null,
				canClose: false
			};
		},
		computed: {
			btnText() {
				if (!this.canClose) {
					return `请仔细阅读 (${this.timeLeft}s)`;
				}
				return "我已了解，开启体验";
			}
		},
		watch: {
			visible(val) {
				if (val) {
					this.$refs.WelcomeDialog.open("center");
					this.startTimer();
				} else {
					this.$refs.WelcomeDialog.close();
					this.clearTimer();
				}
			}
		},
		methods: {
			getTheme,
			startTimer() {
				this.timeLeft = this.duration;
				this.canClose = false;
				this.timer = setInterval(() => {
					this.timeLeft--;
					if (this.timeLeft <= 0) {
						this.canClose = true;
						this.clearTimer();
					}
				}, 1000);
			},
			clearTimer() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
			maskChange(e) {
				// 只有在允许关闭且是关闭动作时才触发 close
				if (!e.show && this.canClose) {
					this.$emit("close");
				}
				// 如果还没倒计时结束用户尝试点击遮罩，uni-popup 可能会尝试关闭，
				// 可以在这里强制重新 open，或者依赖 :mask-click="false" 属性
			},
			handleClose() {
				if (!this.canClose) return;
				this.$emit("close");
			}
		},
		beforeDestroy() {
			this.clearTimer();
		}
	}
</script>

<style lang="scss" scoped>
	// 复用你原有的响应式卡片大小逻辑
	@media (orientation: landscape) {
		.card {
			$height: calc((100vh - sx(30) - var(--status-bar-height) + sx(90)) / 2);
			max-height: calc(100vh - sx(30) - var(--status-bar-height));
			max-width: calc(100 / 80 * calc(100vh - sx(30) - var(--status-bar-height))); //稍微宽一点容纳文字
			height: $height;
			width: calc(100 / 80 * #{$height});
		}
	}

	@media (orientation: portrait) {
		.card {
			--test: 0px;
			$width: calc((90vw + sx(90)) / 2);
			//max-height: calc(calc(100vw - sx(15) - var(--test)) / 80 * 100);
			max-width: calc(100vw - sx(15) - var(--test));
			height: calc($width / 75 * 100);
			width: $width;
		}
	}

	.card {
		display: flex;
		flex-direction: column;
		padding: sx(6);
		box-sizing: border-box;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: sx(2);

		.title-group {
			display: flex;
			align-items: center;
			gap: sx(2);

			.title {
				font-size: sx(5.5);
				font-weight: 600;
				color: var(--md-sys-color-on-surface);
			}
		}

		.timer-text {
			font-size: sx(3.5);
			font-weight: bold;
			color: var(--md-sys-color-error); // 用醒目的颜色提示时间
			background-color: var(--md-sys-color-error-container);
			padding: sx(1) sx(2);
			border-radius: sx(2);
		}
	}

	.content-container {
		flex: 1;
		overflow: hidden;
		margin-bottom: sx(2);
	}

	.intro-text {
		font-size: sx(3.8);
		color: var(--md-sys-color-on-surface-variant);
		margin-bottom: sx(4);
		line-height: 1.5;
	}

	.feature-list {
		display: flex;
		flex-direction: column;
		gap: sx(3);
	}

	.feature-item {
		display: flex;
		align-items: flex-start;
		gap: sx(3);
		padding: sx(2);
		border-radius: sx(2);
		// 可选：给每个条目加个淡淡的背景
		// background-color: var(--md-sys-color-surface-container-low);

		.icon-box {
			margin-top: sx(0.5); // 图标微调对齐文字
		}

		.text-box {
			display: flex;
			flex-direction: column;

			.feat-title {
				font-size: sx(4);
				font-weight: 600;
				color: var(--md-sys-color-on-surface);
				margin-bottom: sx(0.5);
			}

			.feat-desc {
				font-size: sx(3.5);
				color: var(--md-sys-color-outline);
				line-height: 1.4;
			}
		}
	}

	.footer {
		display: flex;
		justify-content: center;
		//padding-top: sx(2);

		// 覆盖 material-button 的样式以使其填满
		.action-btn {
			width: 100%;
			// 如果 material-button 支持 width 属性最好，不支持可以用 deep 或者外层 flex 控制
		}
	}
</style>