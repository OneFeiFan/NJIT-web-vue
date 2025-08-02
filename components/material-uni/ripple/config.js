
  const DEFAULT_RIPPLE_PROPS = {
    backgroundColor: {
      type: String,
      default: undefined
    },
    color: {
      type: String,
      default: undefined
    },
    opacity: {
      type: Number,
      default: undefined
    },
    duration: {
      type: Number,
      default: undefined
    },
    transition: {
      type: String,
      default: undefined
    }
  }

const DEFAULT_CONFIG = {
  color: '#fff',
  opacity: 0.3,
  duration: 380,
  transition: 'ease-out',
  backgroundColor: '#9b4ab6'
}

function updateRippleConfig(newConfig) {
  if (typeof newConfig !== 'object') {
    throw new Error('参数必须是一个对象');
  }

  for (let key in newConfig) {
    if (DEFAULT_CONFIG.hasOwnProperty(key)) {
      DEFAULT_CONFIG[key] = newConfig[key];
    } else {
      console.warn(`键 ${key} 不在 DEFAULT_CONFIG 中`);
    }
  }
}

export {
  DEFAULT_CONFIG,
  DEFAULT_RIPPLE_PROPS,
  updateRippleConfig
}