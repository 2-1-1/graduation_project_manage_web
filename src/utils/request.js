import axios from 'axios'
import {
  Message
} from 'element-ui'
import Router from '@/router'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: 'api',
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    if (error.response.status === 401) {
      Message.error(data.message)
      Router.push({ path: '/' })
      location.reload(true)
    } else {
      if (data.message) {
        Message.error(data.message)
      } else {
        Message.error('系统错误')
      }
    }
  }
  return Promise.reject(error)
}

// response interceptor
request.interceptors.response.use((response) => {
  if (!response.data || ((!response.data.code || response.data.code !== 200) && !(response.data instanceof Blob))) {
    if (response.data && response.data.message) {
      Message.error(response.data.message)
      throw new Error(response.data.message)
    } else {
      Message.error('系统错误')
      throw new Error('系统错误')
    }
  }
  return response.data
}, errorHandler)

const requestSimple = (method, url, data, config) => {
  let newData = { data: data }
  if (method === 'get') {
    newData = { params: data }
  }
  return request({ method: method, url: url, ...newData, ...config })
}

export default requestSimple
