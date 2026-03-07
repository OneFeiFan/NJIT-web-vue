let cachedRatio = null;

function getBaseRatio() {
    if (cachedRatio !== null) {
        return cachedRatio;
    }

    const sys = uni.getSystemInfoSync();
    const base = (0.4 * sys.windowWidth) + (0.6 * sys.windowHeight);
    cachedRatio = base / 190;

    return cachedRatio;
}

export function mx(value) {
    return (getBaseRatio() * value) + 'px';
}

export function mxValue(value) {
    return getBaseRatio() * value;
}