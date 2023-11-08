import axios from 'axios'
import { useTokenStore } from '../stores'
const tokenStore = useTokenStore()
const instance = axios.create({
    baseURL: 'http://127.0.0.1:8080'
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

// 
export default instance