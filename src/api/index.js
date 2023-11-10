import request from '@/utils/request'

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

// 重置密码接口
export const resetPasswordAPI = ({ oldPwd, newPwd }) => {
    return request({
        url: '/self/resetpwd',
        method: 'POST',
        data: {
            oldPwd: oldPwd,
            newPwd: newPwd
        }
    })
}

// 获取文章分类接口
export const getArticleCatesAPI = () => {
    return request({
        url: '/self/article/cates',
        method: 'GET'
    })
}

// 新增文章分类接口
export const addArticleCateAPI = ({ name, alias }) => {
    return request({
        url: '/self/article/addcate',
        method: 'POST',
        data: {
            name: name,
            alias: alias
        }
    })
} 

