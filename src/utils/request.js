import axios from 'axios'
import { useTokenStore } from '../stores'
import { ElMessage } from 'element-plus'
import router from '@/router'
const tokenStore = useTokenStore()

export const baseURL = 'http://127.0.0.1:8080/'
const instance = axios.create({
    baseURL: baseURL
})

// 请求拦截器
instance.interceptors.request.use((config) => {
    // 在请求之前会触发一次

    // 在发起时,统一携带请求头和token值
    // 判断,登录页面和注册页面,仓库中有无token,并且登录接口和注册接口也不需要携带token
    if(tokenStore.token) {
        config.headers.Authorization = tokenStore.token
    }
    return config
},(error) => {
    // 请求发起前的代码,如果有异常报错,会直接进入这里
    // 返回一个拒绝状态的Promise对象
    return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use((response) => {
    // 成功回调
    return response
},(error) => {
    // 响应状态码为4xx, 5xx 时触发失败回调
    if(error.response.status === 401) {
        // token过期
        // 清除仓库数据
        tokenStore.updateToken('')
        tokenStore.updateUserInfo({})
        // 跳转登录页面
        ElMessage({
            message: '登录过期,请重新登录！',
            type: 'info',
            duration: 2000
        })
        router.push('/login')
    }
    return Promise.reject(error)
})
export default instance