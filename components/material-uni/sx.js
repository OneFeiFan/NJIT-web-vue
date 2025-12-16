let SXData = ""

const SXData_ = {
    baseRatio:1,
    "--base-ratio": 1
}

function mx(value) {
    return SXData_.baseRatio * value + 'px';
}
function mxValue(value) {
    return SXData_.baseRatio * value;
}

function refresh() {
    const {height, width} = uni.getSystemInfoSync().safeArea;
    SXData_.baseRatio = Math.sqrt(width + height)/10;
    SXData_["--base-ratio"] = SXData_.baseRatio;
    let str = "";
    for (let key in SXData_) {
        str += `${key}: ${SXData_[key]}; `;
    }
    SXData = str;
}

uni.onWindowResize(refresh)
refresh();

export {
    mx,
    mxValue,
    SXData
}