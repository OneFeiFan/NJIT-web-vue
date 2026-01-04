import Vue from 'vue';

// 1. 使用 Vue.observable 创建响应式对象
const state = Vue.observable({
    baseRatio: 1,
    styleStr: '--base-ratio: 1;'
});

// 2. 核心算法：几何平均 + 姿态修正
function refresh() {
    // 获取系统信息
    const sys = uni.getSystemInfoSync();
    // 优先使用 window 尺寸，但在某些安卓机上键盘弹起会影响 windowHeight
    // 如果想要更稳，可以使用 screenWidth/screenHeight (如果不受软键盘影响的话)
    // 这里先用 window 举例
    const w = sys.windowWidth;
    const h = sys.windowHeight;

    // 算法A：几何平均（面积逻辑），反映屏幕体量
    const geometricMean = Math.sqrt(w * h);

    // 算法B：姿态修正（横屏惩罚）
    let weighting = 1;
    if (w > h) {
        // 横屏时：因为高度紧缺，必须显著减小单位
        // 这里的逻辑是：屏幕越扁(h/w越小)，系数越小
        // 举例：16:9横屏 -> sqrt(9/16) = 0.75
        // 举例：21:9带鱼屏 -> sqrt(9/21) = 0.65
        weighting = Math.pow(h / w, 0.1);
        // weighting = (1 + Math.sqrt(h / w)) / 2;
    }
    const ratio = (geometricMean * weighting) / 175; // 这里按你习惯的 /10 或者 /100 调整

    // 更新响应式数据
    state.baseRatio = ratio;
    state.styleStr = `--base-ratio: ${ratio};`;

    console.log(`[SX] w:${w} h:${h} ratio:${ratio.toFixed(2)}`);
}

uni.onWindowResize(refresh);

// 初始化执行一次
refresh();

// ================= 导出部分 =================

// 1. 供 JS 逻辑使用的计算函数 (非响应式返回值，是即时计算值)
export function mx(value) {
    return (state.baseRatio * value) + 'px';
}

export function mxValue(value) {
    return state.baseRatio * value;
}

// 2. 供 mixin 或组件使用的响应式对象
export const SXState = state;