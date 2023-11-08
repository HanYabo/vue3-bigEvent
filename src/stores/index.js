import { defineStore } from 'pinia'

export const useTokenStore = defineStore('tokenStore', {
    state: () => {
        return {
            token: '', // token字符串
            userinfo: {} // 用户信息对象
        }
    },
    getters: {

    },
    actions: {
        // 保存token
        updateToken(val) {
            this.token = val
        },
        // 更新用户信息
        updateUserInfo(info) {
            this.userinfo = info
        }
    },
    // 开启持久化
    persist: true
})
