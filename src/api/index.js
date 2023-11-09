import request from '@/utils/request'
import { useTokenStore } from '@/stores'

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
export const registerAPI = ({ username, password }) => {
    return request({
        url: '/api/register',
        method: 'POST',
        data: {
            username: username,
            password: password
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

// 更新用户信息接口
export const updateUserInfoAPI = ({ id, nickname, email }) => {
    return request({
        url: '/self/userinfo',
        method: 'POST',
        data: {
            id: id,
            nickname: nickname,
            email: email,
        }
    })
}

// 更新用户头像接口
export const updateUserAvatarAPI = (avatar) => {
    return request({
        url: '/self/update/avatar',
        method: 'POST',
        data: {
            avatar: avatar, // base64字符串
        }
    })
}

