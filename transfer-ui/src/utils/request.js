/*
 * @Descripttion:
 * @Author: lip
 * @Date: 2019-08-08 09:17:46
 * @LastEditors: lip
 */
/* eslint-disable no-multi-spaces */
/* eslint-disable no-mixed-spaces-and-tabs */
// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import lodash from 'lodash'
// eslint-disable-next-line no-multi-spaces
// eslint-disable-next-line no-unused-vars
import {  Message, Notification, Loading } from 'element-ui'

import config from '@/../public/staticConfig'

axios.defaults.withCredentials = true

axios.defaults.baseURL = config.config.BASE_URL

// ajax封装公共方法
// eslint-disable-next-line no-unused-vars
let loading
function startLoading() { // 使用Element loading-start 方法
  // eslint-disable-next-line no-undef
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0,0,0,0.5)'
  })
}
// eslint-disable-next-line no-unused-vars
function endLoading() { // 使用Element loading-close 方法
  // eslint-disable-next-line no-undef
  loading.close()
}

let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    // endLoading()
    lodash.debounce(endLoading, 300)()
  }
}
var url
// eslint-disable-next-line no-unused-vars
function GetRequest() {
  url = location.search // 获取url中"?"符后的字串
  // eslint-disable-next-line no-new-object
  var theRequest = new Object()
  if (url.indexOf('?') !== -1) {
    var str = url.substr(1)
    var strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
    }
  }
  return theRequest
}
function GetQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = location.href.slice(location.href.lastIndexOf('?')).substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

// 请求时的拦截器
axios.interceptors.request.use(config => {
  // 获取左侧列表和 待办事项不需要显示 loading
  if (config.url.replace(config.baseURL, '') !== '/certificateHomeApi/getBacklogData' &&
   config.url.replace(config.baseURL, '') !== '/getRouteTable' &&
   config.url.replace(config.baseURL, '') !== '/licenceUtils/signature' &&
   config.url.replace(config.baseURL, '') !== '/licenceCollectionApi/getCollectionMonitorData' &&
   config.url.replace(config.baseURL, '') !== '/licenceUtils/getSignatureQueue'
  ) {
    showFullScreenLoading()
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 请求完成后的拦截器
axios.interceptors.response.use(response => {
  if (response.headers.code_error_code === '302') {
    var codeUrl = response.headers.code_url + '?redirectUri=' + encodeURIComponent(window.location.href)
    window.location = codeUrl
  }
  if (response.headers.code_error_code === '303') {
	  if (response.headers.userinfojson) {
      localStorage.userInfoJson = response.headers.userinfojson // 当前登录的岗位信息存缓存
      localStorage.userInfoJson = decodeURIComponent(response.headers.operatordata)
    }
    window.location = decodeURIComponent(response.headers.redirect_uri)
    location.reload()
  }
  if (response.headers.code_error_code === '304') {
    window.location = decodeURIComponent(response.headers.redirect_uri)
    location.reload()
  }
  return response
}, error => {
// 这里我们把错误信息扶正, 后面就不需要写 catch 了
  return Promise.reject(error)
//  return Promise.resolve(error.response)
})

// 响应拦截器即异常处理
axios.interceptors.response.use(response => {
  tryHideFullScreenLoading()
  // response.data = mmm
  return response
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '错误请求'
        break
      case 401:
        err.message = '未授权，请重新登录'
        break
      case 403:
        err.message = '拒绝访问'
        break
      case 404:
        err.message = '请求错误,未找到该资源'
        break
      case 405:
        err.message = '请求方法未允许'
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器端出错'
        break
      case 501:
        err.message = '网络未实现'
        break
      case 502:
        err.message = '网络错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网络超时'
        break
      case 505:
        err.message = 'http版本不支持该请求'
        break
      default:
        err.message = `连接错误${err.response.status}`
    }
  } else {
    err.message = '连接到服务器失败'
    Message({
      message: err.message,
      type: 'warning'
    })
    tryHideFullScreenLoading()
  }
  // Notification({
  //   title: '警告',
  //   message: err.message,
  //   type: 'warning'
  // })
  Message({
    message: err.message,
    type: 'warning'
  })
  return Promise.resolve(err.response)
})

function checkStatus(response) {
  if (response.status === 200 || response.status === 304) {
    return response
  }
  return {
    data: {
      code: -404,
      message: response.statusText,
      data: response.statusText
    }
  }
}

function checkCode(res) {
  if (res.status !== 200) {
    Message({
      message: res.data.message,
      type: 'warning'
    })
    // Notification({
    //   title: '警告',
    //   message: res.data.message,
    //   type: 'warning'
    // })
  }
  return res
}

export default {
  // form提交
  post(url, data) {
    if (GetQueryString('code') && GetQueryString('redirectUri')) {
      url = url + '?code=' + GetQueryString('code') + '&redirectUri=' + encodeURIComponent(GetQueryString('redirectUri'))
    }
    return axios({
      method: 'post',
      url,
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      data: qs.stringify(data),
      traditional: true,
      timeout: 30000
    }).then(
      (response) => {
        if (!response.success && response.errorCode === '302') {
          var codeUrl = response.msg + '?redirectUri=' + encodeURIComponent(window.location.href)
          window.location = codeUrl
        } else if (response.success && response.errorCode === '200' && response.msg) {
          window.location = decodeURIComponent(data.msg)
        } else if (response.success && (response.errorCode === null || response.errorCode === 'undefined')) {
          endLoading()
          // console.log(1111)
        }
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  // json提交
  postJson(url, data) {
    if (GetQueryString('code') && GetQueryString('redirectUri')) {
      url = url + '?code=' + GetQueryString('code') + '&redirectUri=' + encodeURIComponent(GetQueryString('redirectUri'))
    }
    return axios({
      method: 'post',
      url,
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      data: data,
      traditional: true,
      timeout: 30000
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  // 导入文件专用  不设置超时时间
  importFile(url, data) {
    if (GetQueryString('code') && GetQueryString('redirectUri')) {
      url = url + '?code=' + GetQueryString('code') + '&redirectUri=' + encodeURIComponent(GetQueryString('redirectUri'))
    }
    return axios({
      method: 'post',
      url,
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      data: data,
      traditional: true
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  // get 请求
  get(url, params) {
    if (GetQueryString('code') && GetQueryString('redirectUri')) {
      url = url + '?code=' + GetQueryString('code') + '&redirectUri=' + encodeURIComponent(GetQueryString('redirectUri'))
    }
    return axios({
      method: 'get',
      url,
      params,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      crossDomain: true
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  // 导出
  download(url, params) {
    if (GetQueryString('code') && GetQueryString('redirectUri')) {
      url = url + '?code=' + GetQueryString('code') + '&redirectUri=' + encodeURIComponent(GetQueryString('redirectUri'))
    }
    return axios({
      method: 'get',
      url,
      params,
      timeout: 30000,
      responseType: 'blob'
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }

}

