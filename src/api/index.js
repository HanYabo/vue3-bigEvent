import request from '@/utils/request'

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

export const registerAPI = (form) => {
    return request({
        url: '/api/register',
        method: 'POST',
        data: {
            username: username,
            password: password
        }
    })
}