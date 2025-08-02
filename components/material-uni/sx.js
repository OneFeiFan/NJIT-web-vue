const SXData = {
    baseRatio:1,
    "--base-ratio": 1
}

function mx(value) {
    return SXData.baseRatio * value + 'px';
}
function mxValue(value) {
    return SXData.baseRatio * value;
}

function refresh() {
    const {height, width} = uni.getSystemInfoSync().safeArea;
    SXData.baseRatio = Math.sqrt(width + height)/10;
    SXData["--base-ratio"] = SXData.baseRatio;
}

uni.onWindowResize(refresh)
refresh();

export {
    mx,
    mxValue,
    SXData
}