
// utils/request.js
import {baseUrl} from "@/static/urlConfig";

class Request {
  /**
   * 创建请求实例
   * @param {string} baseUrl - 基础URL
   */
  constructor(baseUrl = 'http://127.0.0.1:8080') {
    this.baseUrl = baseUrl
  }

  /**
   * 检查登录状态
   * @returns {boolean} 是否已登录
   */
  checkLogin() {
    const saved = uni.getStorageSync('loginInfo')
    if (!saved || !saved.username) {
      uni.showModal({
        title: '提示',
        content: '未登录,请登陆',
        success: function (res) {
          if (res.confirm) {
            uni.navigateTo({ url: '/pages/login/login' })
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
      return false
    }
    return true
  }

  /**
   * 发送请求
   * @param {string} url - 请求路径
   * @param {object} options - 请求选项
   * @param {string} [options.method='GET'] - 请求方法
   * @param {object} [options.data={}] - 请求数据
   * @param {object} [options.headers={}] - 请求头
   * @returns {Promise} 请求Promise
   */
  async request(url, options = {}) {
    // 检查登录状态
    if (!this.checkLogin()) {
      return Promise.reject(new Error('未登录'))
    }

    const saved = uni.getStorageSync('loginInfo')
    const defaultData = { studentId: saved.username }
    const mergedData = { ...defaultData, ...options.data }

    const fullUrl = `${this.baseUrl}${url}`

    return new Promise((resolve, reject) => {
      uni.request({
        url: fullUrl,
        method: options.method || 'GET',
        data: mergedData,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...options.headers
        },
        success: (res) => {
          if (res.data.code === 401) {
            uni.showModal({
              title: '提示',
              content: '登录过期,请重新登陆',
              success: function (res) {
                if (res.confirm) {
                  uni.navigateTo({ url: '/pages/login/login' })
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              }
            });
            reject(new Error('未授权'))
          } else if (res.data.code === 200) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        },
        fail: (err) => {
          uni.showToast({
            title: err.errMsg,
            icon: 'error',
            duration: 2000
          });
          reject(err)
        }
      })
    })
  }

  /**
   * GET请求
   * @param {string} url - 请求路径
   * @param {object} [data={}] - 请求数据
   * @param {object} [headers={}] - 请求头
   * @returns {Promise} 请求Promise
   */
  get(url, data = {}, headers = {}) {
    return this.request(url, {
      method: 'GET',
      data,
      headers
    })
  }

  /**
   * POST请求
   * @param {string} url - 请求路径
   * @param {object} [data={}] - 请求数据
   * @param {object} [headers={}] - 请求头
   * @returns {Promise} 请求Promise
   */
  post(url, data = {}, headers = {}) {
    return this.request(url, {
      method: 'POST',
      data,
      headers
    })
  }
}

// 创建全局请求实例
export const http = new Request(baseUrl)
