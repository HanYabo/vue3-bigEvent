import request from '@/utils/request'
import { useTokenStore } from '@/stores'
const tokenStore = useTokenStore()

// 登录用户接口
export const loginAPI = ({ username, password }) => {
    return request({
        url: '/api/login',
        method: 'POST',
        data: {
            username: username,
            password: password
        }
    })
}

// 注册用户接口
export const registerAPI = (form) => {
    return request({
        url: '/api/register',
        method: 'POST',
        data: {
            username: form.username,
            password: form.password
        }
    })
}

// 获取用户信息接口
export const getUserInfoAPI = () => {
    return request({
        url: '/self/userinfo',
        method: 'GET',
    })
}

