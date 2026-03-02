import Vue from 'vue';

const staticThemes = {
    "blue": {
        "--md-sys-color-primary": "rgb(65 95 145)",
        "--md-sys-color-surface-tint": "rgb(65 95 145)",
        "--md-sys-color-on-primary": "rgb(255 255 255)",
        "--md-sys-color-primary-container": "rgb(214 227 255)",
        "--md-sys-color-on-primary-container": "rgb(40 71 119)",
        "--md-sys-color-secondary": "rgb(86 95 113)",
        "--md-sys-color-on-secondary": "rgb(255 255 255)",
        "--md-sys-color-secondary-container": "rgb(218 226 249)",
        "--md-sys-color-on-secondary-container": "rgb(62 71 89)",
        "--md-sys-color-tertiary": "rgb(112 85 117)",
        "--md-sys-color-on-tertiary": "rgb(255 255 255)",
        "--md-sys-color-tertiary-container": "rgb(250 216 253)",
        "--md-sys-color-on-tertiary-container": "rgb(87 62 92)",
        "--md-sys-color-error": "rgb(186 26 26)",
        "--md-sys-color-on-error": "rgb(255 255 255)",
        "--md-sys-color-error-container": "rgb(255 218 214)",
        "--md-sys-color-on-error-container": "rgb(147 0 10)",
        "--md-sys-color-background": "rgb(249 249 255)",
        "--md-sys-color-on-background": "rgb(25 28 32)",
        "--md-sys-color-surface": "rgb(249 249 255)",
        "--md-sys-color-on-surface": "rgb(25 28 32)",
        "--md-sys-color-surface-variant": "rgb(224 226 236)",
        "--md-sys-color-on-surface-variant": "rgb(68 71 78)",
        "--md-sys-color-outline": "rgb(116 119 127)",
        "--md-sys-color-outline-variant": "rgb(196 198 208)",
        "--md-sys-color-shadow": "rgb(0 0 0)",
        "--md-sys-color-scrim": "rgb(0 0 0)",
        "--md-sys-color-inverse-surface": "rgb(46 48 54)",
        "--md-sys-color-inverse-on-surface": "rgb(240 240 247)",
        "--md-sys-color-inverse-primary": "rgb(170 199 255)",
        "--md-sys-color-primary-fixed": "rgb(214 227 255)",
        "--md-sys-color-on-primary-fixed": "rgb(0 27 62)",
        "--md-sys-color-primary-fixed-dim": "rgb(170 199 255)",
        "--md-sys-color-on-primary-fixed-variant": "rgb(40 71 119)",
        "--md-sys-color-secondary-fixed": "rgb(218 226 249)",
        "--md-sys-color-on-secondary-fixed": "rgb(19 28 43)",
        "--md-sys-color-secondary-fixed-dim": "rgb(190 198 220)",
        "--md-sys-color-on-secondary-fixed-variant": "rgb(62 71 89)",
        "--md-sys-color-tertiary-fixed": "rgb(250 216 253)",
        "--md-sys-color-on-tertiary-fixed": "rgb(40 19 46)",
        "--md-sys-color-tertiary-fixed-dim": "rgb(221 188 224)",
        "--md-sys-color-on-tertiary-fixed-variant": "rgb(87 62 92)",
        "--md-sys-color-surface-dim": "rgb(217 217 224)",
        "--md-sys-color-surface-bright": "rgb(249 249 255)",
        "--md-sys-color-surface-container-lowest": "rgb(255 255 255)",
        "--md-sys-color-surface-container-low": "rgb(243 243 250)",
        "--md-sys-color-surface-container": "rgb(237 237 244)",
        "--md-sys-color-surface-container-high": "rgb(231 232 238)",
        "--md-sys-color-surface-container-highest": "rgb(226 226 233)"
    },
    "dark_blue": {
        "--md-sys-color-primary": "rgb(170 199 255)",
        "--md-sys-color-surface-tint": "rgb(170 199 255)",
        "--md-sys-color-on-primary": "rgb(10 48 95)",
        "--md-sys-color-primary-container": "rgb(40 71 119)",
        "--md-sys-color-on-primary-container": "rgb(214 227 255)",
        "--md-sys-color-secondary": "rgb(190 198 220)",
        "--md-sys-color-on-secondary": "rgb(40 49 65)",
        "--md-sys-color-secondary-container": "rgb(62 71 89)",
        "--md-sys-color-on-secondary-container": "rgb(218 226 249)",
        "--md-sys-color-tertiary": "rgb(221 188 224)",
        "--md-sys-color-on-tertiary": "rgb(63 40 68)",
        "--md-sys-color-tertiary-container": "rgb(87 62 92)",
        "--md-sys-color-on-tertiary-container": "rgb(250 216 253)",
        "--md-sys-color-error": "rgb(255 180 171)",
        "--md-sys-color-on-error": "rgb(105 0 5)",
        "--md-sys-color-error-container": "rgb(147 0 10)",
        "--md-sys-color-on-error-container": "rgb(255 218 214)",
        "--md-sys-color-background": "rgb(17 19 24)",
        "--md-sys-color-on-background": "rgb(226 226 233)",
        "--md-sys-color-surface": "rgb(17 19 24)",
        "--md-sys-color-on-surface": "rgb(226 226 233)",
        "--md-sys-color-surface-variant": "rgb(68 71 78)",
        "--md-sys-color-on-surface-variant": "rgb(196 198 208)",
        "--md-sys-color-outline": "rgb(142 144 153)",
        "--md-sys-color-outline-variant": "rgb(68 71 78)",
        "--md-sys-color-shadow": "rgb(0 0 0)",
        "--md-sys-color-scrim": "rgb(0 0 0)",
        "--md-sys-color-inverse-surface": "rgb(226 226 233)",
        "--md-sys-color-inverse-on-surface": "rgb(46 48 54)",
        "--md-sys-color-inverse-primary": "rgb(65 95 145)",
        "--md-sys-color-primary-fixed": "rgb(214 227 255)",
        "--md-sys-color-on-primary-fixed": "rgb(0 27 62)",
        "--md-sys-color-primary-fixed-dim": "rgb(170 199 255)",
        "--md-sys-color-on-primary-fixed-variant": "rgb(40 71 119)",
        "--md-sys-color-secondary-fixed": "rgb(218 226 249)",
        "--md-sys-color-on-secondary-fixed": "rgb(19 28 43)",
        "--md-sys-color-secondary-fixed-dim": "rgb(190 198 220)",
        "--md-sys-color-on-secondary-fixed-variant": "rgb(62 71 89)",
        "--md-sys-color-tertiary-fixed": "rgb(250 216 253)",
        "--md-sys-color-on-tertiary-fixed": "rgb(40 19 46)",
        "--md-sys-color-tertiary-fixed-dim": "rgb(221 188 224)",
        "--md-sys-color-on-tertiary-fixed-variant": "rgb(87 62 92)",
        "--md-sys-color-surface-dim": "rgb(17 19 24)",
        "--md-sys-color-surface-bright": "rgb(55 57 62)",
        "--md-sys-color-surface-container-lowest": "rgb(12 14 19)",
        "--md-sys-color-surface-container-low": "rgb(25 28 32)",
        "--md-sys-color-surface-container": "rgb(29 32 36)",
        "--md-sys-color-surface-container-high": "rgb(40 42 47)",
        "--md-sys-color-surface-container-highest": "rgb(51 53 58)",
    },
    "red":{},
    "dark_red":{},
    "xmas_red":{
        "--md-sys-color-primary": "rgb(144 74 69)",
        "--md-sys-color-surface-tint": "rgb(144 74 69)",
        "--md-sys-color-on-primary": "rgb(255 255 255)",
        "--md-sys-color-primary-container": "rgb(255 218 214)",
        "--md-sys-color-on-primary-container": "rgb(115 51 47)",
        "--md-sys-color-secondary": "rgb(119 86 83)",
        "--md-sys-color-on-secondary": "rgb(255 255 255)",
        "--md-sys-color-secondary-container": "rgb(255 218 214)",
        "--md-sys-color-on-secondary-container": "rgb(93 63 60)",
        "--md-sys-color-tertiary": "rgb(114 91 46)",
        "--md-sys-color-on-tertiary": "rgb(255 255 255)",
        "--md-sys-color-tertiary-container": "rgb(254 222 166)",
        "--md-sys-color-on-tertiary-container": "rgb(88 68 25)",
        "--md-sys-color-error": "rgb(186 26 26)",
        "--md-sys-color-on-error": "rgb(255 255 255)",
        "--md-sys-color-error-container": "rgb(255 218 214)",
        "--md-sys-color-on-error-container": "rgb(147 0 10)",
        "--md-sys-color-background": "rgb(255 248 247)",
        "--md-sys-color-on-background": "rgb(35 25 24)",
        "--md-sys-color-surface": "rgb(255 248 247)",
        "--md-sys-color-on-surface": "rgb(35 25 24)",
        "--md-sys-color-surface-variant": "rgb(245 221 219)",
        "--md-sys-color-on-surface-variant": "rgb(83 67 66)",
        "--md-sys-color-outline": "rgb(133 115 113)",
        "--md-sys-color-outline-variant": "rgb(216 194 191)",
        "--md-sys-color-shadow": "rgb(0 0 0)",
        "--md-sys-color-scrim": "rgb(0 0 0)",
        "--md-sys-color-inverse-surface": "rgb(57 46 45)",
        "--md-sys-color-inverse-on-surface": "rgb(255 237 235)",
        "--md-sys-color-inverse-primary": "rgb(255 179 172)",
        "--md-sys-color-primary-fixed": "rgb(255 218 214)",
        "--md-sys-color-on-primary-fixed": "rgb(59 9 8)",
        "--md-sys-color-primary-fixed-dim": "rgb(255 179 172)",
        "--md-sys-color-on-primary-fixed-variant": "rgb(115 51 47)",
        "--md-sys-color-secondary-fixed": "rgb(255 218 214)",
        "--md-sys-color-on-secondary-fixed": "rgb(44 21 19)",
        "--md-sys-color-secondary-fixed-dim": "rgb(231 189 184)",
        "--md-sys-color-on-secondary-fixed-variant": "rgb(93 63 60)",
        "--md-sys-color-tertiary-fixed": "rgb(254 222 166)",
        "--md-sys-color-on-tertiary-fixed": "rgb(38 25 0)",
        "--md-sys-color-tertiary-fixed-dim": "rgb(225 195 140)",
        "--md-sys-color-on-tertiary-fixed-variant": "rgb(88 68 25)",
        "--md-sys-color-surface-dim": "rgb(232 214 212)",
        "--md-sys-color-surface-bright": "rgb(255 248 247)",
        "--md-sys-color-surface-container-lowest": "rgb(255 255 255)",
        "--md-sys-color-surface-container-low": "rgb(255 240 239)",
        "--md-sys-color-surface-container": "rgb(252 234 232)",
        "--md-sys-color-surface-container-high": "rgb(246 228 226)",
        "--md-sys-color-surface-container-highest": "rgb(241 222 220)"
    },
    "dark_xmas_red":{
        "--md-sys-color-primary": "rgb(255 179 172)",
        "--md-sys-color-surface-tint": "rgb(255 179 172)",
        "--md-sys-color-on-primary": "rgb(87 30 26)",
        "--md-sys-color-primary-container": "rgb(115 51 47)",
        "--md-sys-color-on-primary-container": "rgb(255 218 214)",
        "--md-sys-color-secondary": "rgb(231 189 184)",
        "--md-sys-color-on-secondary": "rgb(68 41 39)",
        "--md-sys-color-secondary-container": "rgb(93 63 60)",
        "--md-sys-color-on-secondary-container": "rgb(255 218 214)",
        "--md-sys-color-tertiary": "rgb(225 195 140)",
        "--md-sys-color-on-tertiary": "rgb(64 45 4)",
        "--md-sys-color-tertiary-container": "rgb(88 68 25)",
        "--md-sys-color-on-tertiary-container": "rgb(254 222 166)",
        "--md-sys-color-error": "rgb(255 180 171)",
        "--md-sys-color-on-error": "rgb(105 0 5)",
        "--md-sys-color-error-container": "rgb(147 0 10)",
        "--md-sys-color-on-error-container": "rgb(255 218 214)",
        "--md-sys-color-background": "rgb(26 17 16)",
        "--md-sys-color-on-background": "rgb(241 222 220)",
        "--md-sys-color-surface": "rgb(26 17 16)",
        "--md-sys-color-on-surface": "rgb(241 222 220)",
        "--md-sys-color-surface-variant": "rgb(83 67 66)",
        "--md-sys-color-on-surface-variant": "rgb(216 194 191)",
        "--md-sys-color-outline": "rgb(160 140 138)",
        "--md-sys-color-outline-variant": "rgb(83 67 66)",
        "--md-sys-color-shadow": "rgb(0 0 0)",
        "--md-sys-color-scrim": "rgb(0 0 0)",
        "--md-sys-color-inverse-surface": "rgb(241 222 220)",
        "--md-sys-color-inverse-on-surface": "rgb(57 46 45)",
        "--md-sys-color-inverse-primary": "rgb(144 74 69)",
        "--md-sys-color-primary-fixed": "rgb(255 218 214)",
        "--md-sys-color-on-primary-fixed": "rgb(59 9 8)",
        "--md-sys-color-primary-fixed-dim": "rgb(255 179 172)",
        "--md-sys-color-on-primary-fixed-variant": "rgb(115 51 47)",
        "--md-sys-color-secondary-fixed": "rgb(255 218 214)",
        "--md-sys-color-on-secondary-fixed": "rgb(44 21 19)",
        "--md-sys-color-secondary-fixed-dim": "rgb(231 189 184)",
        "--md-sys-color-on-secondary-fixed-variant": "rgb(93 63 60)",
        "--md-sys-color-tertiary-fixed": "rgb(254 222 166)",
        "--md-sys-color-on-tertiary-fixed": "rgb(38 25 0)",
        "--md-sys-color-tertiary-fixed-dim": "rgb(225 195 140)",
        "--md-sys-color-on-tertiary-fixed-variant": "rgb(88 68 25)",
        "--md-sys-color-surface-dim": "rgb(26 17 16)",
        "--md-sys-color-surface-bright": "rgb(66 55 53)",
        "--md-sys-color-surface-container-lowest": "rgb(20 12 11)",
        "--md-sys-color-surface-container-low": "rgb(35 25 24)",
        "--md-sys-color-surface-container": "rgb(39 29 28)",
        "--md-sys-color-surface-container-high": "rgb(50 40 39)",
        "--md-sys-color-surface-container-highest": "rgb(61 50 49)"
    },
    "xmas_green":{
        "--md-sys-color-primary": "rgb(46 106 68)",
        "--md-sys-color-surface-tint": "rgb(46 106 68)",
        "--md-sys-color-on-primary": "rgb(255 255 255)",
        "--md-sys-color-primary-container": "rgb(177 241 193)",
        "--md-sys-color-on-primary-container": "rgb(18 81 46)",
        "--md-sys-color-secondary": "rgb(79 99 83)",
        "--md-sys-color-on-secondary": "rgb(255 255 255)",
        "--md-sys-color-secondary-container": "rgb(210 232 212)",
        "--md-sys-color-on-secondary-container": "rgb(56 75 60)",
        "--md-sys-color-tertiary": "rgb(58 100 111)",
        "--md-sys-color-on-tertiary": "rgb(255 255 255)",
        "--md-sys-color-tertiary-container": "rgb(190 234 246)",
        "--md-sys-color-on-tertiary-container": "rgb(33 76 87)",
        "--md-sys-color-error": "rgb(186 26 26)",
        "--md-sys-color-on-error": "rgb(255 255 255)",
        "--md-sys-color-error-container": "rgb(255 218 214)",
        "--md-sys-color-on-error-container": "rgb(147 0 10)",
        "--md-sys-color-background": "rgb(246 251 243)",
        "--md-sys-color-on-background": "rgb(24 29 24)",
        "--md-sys-color-surface": "rgb(246 251 243)",
        "--md-sys-color-on-surface": "rgb(24 29 24)",
        "--md-sys-color-surface-variant": "rgb(221 229 219)",
        "--md-sys-color-on-surface-variant": "rgb(65 73 66)",
        "--md-sys-color-outline": "rgb(113 121 113)",
        "--md-sys-color-outline-variant": "rgb(193 201 191)",
        "--md-sys-color-shadow": "rgb(0 0 0)",
        "--md-sys-color-scrim": "rgb(0 0 0)",
        "--md-sys-color-inverse-surface": "rgb(44 50 45)",
        "--md-sys-color-inverse-on-surface": "rgb(237 242 234)",
        "--md-sys-color-inverse-primary": "rgb(150 213 166)",
        "--md-sys-color-primary-fixed": "rgb(177 241 193)",
        "--md-sys-color-on-primary-fixed": "rgb(0 33 14)",
        "--md-sys-color-primary-fixed-dim": "rgb(150 213 166)",
        "--md-sys-color-on-primary-fixed-variant": "rgb(18 81 46)",
        "--md-sys-color-secondary-fixed": "rgb(210 232 212)",
        "--md-sys-color-on-secondary-fixed": "rgb(13 31 19)",
        "--md-sys-color-secondary-fixed-dim": "rgb(182 204 184)",
        "--md-sys-color-on-secondary-fixed-variant": "rgb(56 75 60)",
        "--md-sys-color-tertiary-fixed": "rgb(190 234 246)",
        "--md-sys-color-on-tertiary-fixed": "rgb(0 31 38)",
        "--md-sys-color-tertiary-fixed-dim": "rgb(162 206 218)",
        "--md-sys-color-on-tertiary-fixed-variant": "rgb(33 76 87)",
        "--md-sys-color-surface-dim": "rgb(215 219 212)",
        "--md-sys-color-surface-bright": "rgb(246 251 243)",
        "--md-sys-color-surface-container-lowest": "rgb(255 255 255)",
        "--md-sys-color-surface-container-low": "rgb(240 245 237)",
        "--md-sys-color-surface-container": "rgb(235 239 232)",
        "--md-sys-color-surface-container-high": "rgb(229 234 226)",
        "--md-sys-color-surface-container-highest": "rgb(223 228 220)"
    },
    "dark_xmas_green":{
        "--md-sys-color-primary": "rgb(150 213 166)",
        "--md-sys-color-surface-tint": "rgb(150 213 166)",
        "--md-sys-color-on-primary": "rgb(0 57 28)",
        "--md-sys-color-primary-container": "rgb(18 81 46)",
        "--md-sys-color-on-primary-container": "rgb(177 241 193)",
        "--md-sys-color-secondary": "rgb(182 204 184)",
        "--md-sys-color-on-secondary": "rgb(34 53 39)",
        "--md-sys-color-secondary-container": "rgb(56 75 60)",
        "--md-sys-color-on-secondary-container": "rgb(210 232 212)",
        "--md-sys-color-tertiary": "rgb(162 206 218)",
        "--md-sys-color-on-tertiary": "rgb(2 54 63)",
        "--md-sys-color-tertiary-container": "rgb(33 76 87)",
        "--md-sys-color-on-tertiary-container": "rgb(190 234 246)",
        "--md-sys-color-error": "rgb(255 180 171)",
        "--md-sys-color-on-error": "rgb(105 0 5)",
        "--md-sys-color-error-container": "rgb(147 0 10)",
        "--md-sys-color-on-error-container": "rgb(255 218 214)",
        "--md-sys-color-background": "rgb(16 21 16)",
        "--md-sys-color-on-background": "rgb(223 228 220)",
        "--md-sys-color-surface": "rgb(16 21 16)",
        "--md-sys-color-on-surface": "rgb(223 228 220)",
        "--md-sys-color-surface-variant": "rgb(65 73 66)",
        "--md-sys-color-on-surface-variant": "rgb(193 201 191)",
        "--md-sys-color-outline": "rgb(139 147 138)",
        "--md-sys-color-outline-variant": "rgb(65 73 66)",
        "--md-sys-color-shadow": "rgb(0 0 0)",
        "--md-sys-color-scrim": "rgb(0 0 0)",
        "--md-sys-color-inverse-surface": "rgb(223 228 220)",
        "--md-sys-color-inverse-on-surface": "rgb(44 50 45)",
        "--md-sys-color-inverse-primary": "rgb(46 106 68)",
        "--md-sys-color-primary-fixed": "rgb(177 241 193)",
        "--md-sys-color-on-primary-fixed": "rgb(0 33 14)",
        "--md-sys-color-primary-fixed-dim": "rgb(150 213 166)",
        "--md-sys-color-on-primary-fixed-variant": "rgb(18 81 46)",
        "--md-sys-color-secondary-fixed": "rgb(210 232 212)",
        "--md-sys-color-on-secondary-fixed": "rgb(13 31 19)",
        "--md-sys-color-secondary-fixed-dim": "rgb(182 204 184)",
        "--md-sys-color-on-secondary-fixed-variant": "rgb(56 75 60)",
        "--md-sys-color-tertiary-fixed": "rgb(190 234 246)",
        "--md-sys-color-on-tertiary-fixed": "rgb(0 31 38)",
        "--md-sys-color-tertiary-fixed-dim": "rgb(162 206 218)",
        "--md-sys-color-on-tertiary-fixed-variant": "rgb(33 76 87)",
        "--md-sys-color-surface-dim": "rgb(16 21 16)",
        "--md-sys-color-surface-bright": "rgb(53 58 53)",
        "--md-sys-color-surface-container-lowest": "rgb(10 15 11)",
        "--md-sys-color-surface-container-low": "rgb(24 29 24)",
        "--md-sys-color-surface-container": "rgb(28 33 28)",
        "--md-sys-color-surface-container-high": "rgb(38 43 38)",
        "--md-sys-color-surface-container-highest": "rgb(49 54 49)"
    }
};

export const themeStore = Vue.observable({
    currentThemeName: uni.getStorageSync("APP_THEME") || "blue", // 记录当前主题名，比如 "dark_blue"
    styleString: "", // 最终给页面用的 style 字符串
    cssVars: {}      // 具体的颜色对象
});

export const themeLogic = {

    // 初始化：App 启动时调用
    init() {
        // 恢复上次的主题
        const savedName = uni.getStorageSync("APP_THEME") || "blue";
        this.applyTheme(savedName);
    },

    applyTheme(themeName, customColors = null) {
        uni.setStorageSync("APP_THEME", themeName);
        themeStore.currentThemeName = themeName;
        // 处理圣诞彩蛋逻辑
        const today = new Date();
        const isXmasPeriod = today.getMonth() === 11 && (today.getDate() === 24 || today.getDate() === 25);

        // 如果是特定日期且随机选中，强制覆写 themeName
        if (isXmasPeriod && !customColors) {
            const isDarkMode = themeName.includes('dark');
            const christmasThemes = isDarkMode
                ? ["dark_xmas_red", "dark_xmas_green"]
                : ["xmas_red", "xmas_green"];
            themeName = christmasThemes[Math.floor(Math.random() * christmasThemes.length)];
        }

        // B. 获取颜色配置
        let vars = customColors;
        if (!customColors) {
            vars = staticThemes[themeName] || staticThemes["blue"];
        }
        themeStore.cssVars = vars;

        // 生成 style 字符串
        let styleStr = '';
        for (const [key, val] of Object.entries(vars)) {
            styleStr += `${key}:${val};`;
        }
        themeStore.styleString = styleStr;

        // if(customColors) {
        //     uni.setStorageSync("CUSTOM_THEME_COLORS", customColors);
        // }
        // this.updateNativeUI();
    },

    // 响应系统暗黑模式变化 (完美复刻你原来的逻辑)
    handleSystemChange(sysTheme) {
        let currentName = themeStore.currentThemeName;

        if (sysTheme === 'dark') {
            // 如果系统变黑，且当前不是黑，加上前缀
            if (!currentName.includes('dark')) {
                this.applyTheme("dark_" + currentName);
            }
        } else {
            // 如果系统变亮，去掉前缀
            this.applyTheme(currentName.replace('dark_', ''));
        }
    },

    // 供用户动态生成颜色使用的方法
    generateDynamicTheme(baseColor) {
    },

    updateNativeUI() {
    }
};

export function getColor(key) {
    // 安全判断：如果 key 没传，或者 store 里没有这个 key，返回默认值
    if (!key) return '';

    // 从响应式对象中取值
    // 如果取不到（比如拼写错误），返回一个显眼的颜色（如洋红色）方便调试，或者返回透明/黑色
    return themeStore.cssVars[key] || '#ff00ff';
}