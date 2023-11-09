<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>重置密码</span>
        </div>
        <!-- 表单 -->
        <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdFormRef" label-width="100px">
            <el-form-item label="原密码" prop="oldPwd">
                <el-input type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
                <el-input type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="rePwd">
                <el-input type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">修改密码</el-button>
                <el-button>重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup>
import { ref } from 'vue'

const pwdForm = ref({
    oldPwd: '',
    newPwd: '',
    rePwd: ''
})
// 标签对象
const pwdFormRef = ref(null)
// 规则对象
const pwdFormRules = ref({
    oldPwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { pattern: /^\S{6,12}$/, message: '密码长度必须是6-12位的非空字符串', trigger: 'blur' }
    ],
    newPwd: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { pattern: /^\S{6,12}$/, message: '密码长度必须是6-12位的非空字符串', trigger: 'blur' },
        { validator: samePwd, trigger: 'blur' }
    ],
    rePwd: [
        { required: true, message: '请再次确认新密码', trigger: 'blur' },
        { pattern: /^\S{6,12}$/, message: '密码长度' }
    ],
})
</script>

<style lang="less" scoped>
.el-form {
    width: 500px;
}
</style>
