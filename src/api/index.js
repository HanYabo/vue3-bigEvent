import request from '@/utils/request'

export const loginAPI = () => {
    return request({
        url: '/api/login',
        method: 'post',
        data: {
            username: 'admin',
            password: 'admin'
        }
    })
}