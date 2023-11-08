import request from '@/utils/request'

export const loginAPI = (form) => {
    return request({
        url: '/api/login',
        method: 'POST',
        data: {
            username: form.username,
            password: form.password
        }
    })
}

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