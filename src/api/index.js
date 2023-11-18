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
        url: '/self/artcate/cates',
        method: 'GET'
    })
}

// 新增文章分类接口
export const addArticleCateAPI = ({ name, alias }) => {
    return request({
        url: '/self/artcate/addcate',
        method: 'POST',
        data: {
            name: name,
            alias: alias
        }
    })
} 

// 删除文章分类接口
export const deleteArticleCateByIdAPI = ({ id }) => {
    return request({
        url: `/self/artcate/deletecate/${id}`,
        method: 'GET',
        params: {
            id: id
        }
    })
}

// 更新文章分类接口
export const updateArticleCateByIdAPI = ({ id, name, alias }) => {
    return request({
        url: '/self/artcate/updatecate',
        method: 'POST',
        data: {
            id: id,
            name: name,
            alias: alias
        }
    })
}

// 新增文章接口
export const uploadArticleCateAPI = data => {
    return request({
        url: '/self/article/add',
        method: 'POST',
        headers: {
            'Content-Type':'multipart/form-data'
        },
        data
    })
}

