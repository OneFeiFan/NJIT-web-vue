function getBaseRatio() {
    const sys = uni.getSystemInfoSync();
    const base = (0.4 * sys.windowWidth) + (0.6 * sys.windowHeight);
    return base / 190;
}

export function mx(value) {
    return (getBaseRatio() * value) + 'px';
}

export function mxValue(value) {
    return getBaseRatio() * value;
}