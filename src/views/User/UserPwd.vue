<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>重置密码</span>
            <el-divider />
        </div>
        <!-- 表单 -->
        <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdFormRef" label-width="100px">
            <el-form-item label="原密码" prop="oldPwd">
                <el-input v-model="pwdForm.oldPwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
                <el-input v-model="pwdForm.newPwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="rePwd">
                <el-input v-model="pwdForm.rePwd" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="resetPwd()">修改密码</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { resetPasswordAPI } from '@/api'
import { ElMessage } from 'element-plus'
import { useTokenStore } from '@/stores'
import { useRouter } from 'vue-router'

const router = useRouter()

const tokenStore = useTokenStore()

const pwdForm = ref({
    oldPwd: '',
    newPwd: '',
    rePwd: ''
})

// 新旧密码不能相同
const checkPwd = (rule, value, callback) => {
    if (value === pwdForm.value.oldPwd) {
        callback(new Error('新旧密码不能相同'))
    } else {
        callback() // 通过校验
    }
}

// 确认密码和新密码要一致
const repeatPwd = (rule, value, callback) => {
    if(value !== pwdForm.value.newPwd) {
        callback(new Error('两次输入的密码不相同'))
    }else {
        callback()
    }
}

// 重置密码
const resetPwd = () => {
    pwdFormRef.value.validate(async valid => {
        if(valid) {
            const { data: res } = await resetPasswordAPI(pwdForm.value)
            if(res.status === 0) {
                ElMessage({
                    message: '更新密码成功！',
                    type: 'success'
                })
                pwdFormRef.value.resetFields()
                // 重置密码
                tokenStore.updateToken('')
                tokenStore.updateUserInfo({})
                router.push('/login')
            }else {
                ElMessage({
                    message: res.message,
                    type: 'error'
                })
            }
        }else {
            return false // 表单拒绝提交
        }
    })
}

const reset = () => {
    pwdFormRef.value.resetFields()
}

// 标签对象
const pwdFormRef = ref(null)
// 规则对象
const pwdFormRules = ref({
    oldPwd: [
        { required: true, message: '请输入原密码', trigger: 'blur'},
        { pattern: /^\S{6,12}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur'}
    ],
    newPwd: [
        { required: true, message: '请输入新密码', trigger: 'blur'},
        { pattern: /^\S{6,12}$/, message: '密码长度必须是6-12位的非空字符串', trigger: 'blur'},
        { validator: checkPwd, trigger: 'blur'}
    ],
    rePwd: [
        { required: true, message: '请再次输入新密码', trigger: 'blur'},
        { pattern: /^\S{6,12}$/, message: '密码长度必须是6-12位的非空字符串', trigger: 'blur'},
        { validator: repeatPwd, trigger: 'blur'}
    ]
})
</script>

<style lang="less" scoped>
.el-form {
    width: 500px;
}
</style>
