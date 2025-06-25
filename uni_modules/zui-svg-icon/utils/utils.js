const _screenWidth = uni.getSystemInfoSync().screenWidth;
/**
 * rpx 单位转换为 px
 *
 * @param {number | string} rpx 待转换的数值
 * @returns number|string
 */
export const rpx2px = (rpx, unit = false) => {
  if (typeof rpx !== 'number' && typeof rpx !== 'string') {
    console.error('rpx 参数必须是数字或字符串类型');
    return unit ? '0px' : 0;
  }

  try {
    if (typeof uni.rpx2px === "function") {
      const px = uni.rpx2px(Number.parseFloat(rpx));
      return unit ? `${px}px` : px;
    } else {
      const px = uni.upx2px(Number.parseFloat(rpx));
      return unit ? `${px}px` : px;
    }
  } catch (e) {
    console.error('rpx2px 转换失败:', e);
    const px = (_screenWidth * Number.parseFloat(rpx)) / 750;
    return unit ? `${px}px` : px;
  }
}
