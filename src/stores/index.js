
import { defineStore } from 'pinia'

export const useTokenStore =  defineStore('tokenStore', {
    state: () => {
        return {
            token: '' // token字符串
        }
    },
    getters: {

    },
    actions: {
        // 保存token
        updateToken(val) {
            state.token = val
        }
    }

})