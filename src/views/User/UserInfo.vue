<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>基本资料</span>
            <el-divider />
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
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { useTokenStore } from '@/stores'
import { getUserInfoAPI, updateUserInfoAPI } from '@/api'
import { ElMessage } from 'element-plus';
const tokenStore = useTokenStore()
const userForm = ref({
    username: tokenStore.getUsername,
    nickname: '',
    email: ''
})
const userFormRef = ref(null)
// 校验规则
const userFormRules = ref({
    nickname: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' },
        // 正则匹配1-10位非空字符串
        { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位非空字符串', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ]
})
// 修改资料提交
const submit = () => {
    // 校验表单数据是否合法
    userFormRef.value.validate(async valid => {
        if (valid) {
            // 验证成功
            // 调用更新接口
            // 更新接口需要传id，从tokenStore中读取用户的id，添加到userForm中
            userForm.value.id = tokenStore.userinfo.id
            const { data: res } = await updateUserInfoAPI(userForm.value)
            // 成功提示
            if (res.status === 0) {
                ElMessage({
                    message: '更新用户信息成功！',
                    type: 'success'
                })
            } else {
                ElMessage({
                    message: '更新用户信息失败！',
                    type: 'error'
                })
            }
            // 获取更新后的用户信息，将新信息存入到pinia中
            const { data: result } = await getUserInfoAPI()
            tokenStore.updateUserInfo(result.data)
        } else {
            // 校验失败 拒绝表单请求
            return false
        }
    })
}
// 重置
const reset = () => {
    // 清空表单（调用element-plus的resetFields方法）
    userFormRef.value.resetFields()
}
</script>

<style lang="less" scoped>
.el-form {
    width: 500px;
}
</style>
