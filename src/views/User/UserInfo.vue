<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>基本资料</span>
        </div>
        <!-- 表单 -->
        <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="100px">
            <el-form-item label="登录名称" prop="username">
                <el-input v-model="userForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="userForm.nickname" minlength="1" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="用户邮箱" prop="email">
                <el-input v-model="userForm.email"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">提交修改</el-button>
                <el-button>重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { useTokenStore } from '@/stores'
const tokenSTore = useTokenStore()
const userForm = ref({
    username: tokenSTore.getUsername,
    password: '',
    email: ''
})
// 校验规则
const userFormRules = ref({
    nickname: [
        { required: true, message: '请输入用户昵称', trigger: 'blur'},
        // 正则匹配1-10位非空字符串
        { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位非空字符串', trigger: 'blur'}
    ],
    email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur'},
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ]
})

const submit = () => {
    // 校验表单数据是否合法
    userFormRef.value.validate(valid => {
        if(valid) {
            
        }
    })
}
</script>

<style lang="less" scoped>
.el-form {
    width: 500px;
}
</style>
