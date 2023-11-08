<script setup>
import { ref } from 'vue'
import { registerAPI } from '../../api/index'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus';
// 表单验证
const registerRef = ref(null) 
const router = useRouter()
const form = ref({
    username: '',
    password: ''
})

// 规则验证对象
const rules = ref({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    {pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10的字母数字组合', trigger: 'blur'}
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {pattern: /^[a-zA-Z0-9]{6,12}$/, message: '密码必须是6-12的非空字符', trigger: 'blur'}
  ]
})

// 登录
const goLogin = () => {
    router.push('/login')
}
// 跳转到注册页面
const register = () => {
    // 检验form对象是否合法，如果合法，调用registerAPI接口，如果不合法，拒绝表单提交
    registerRef.value.validate(async valid => {
        if (valid) {
            const { data: res } = await registerAPI(form.value)
            if(res.status === 0) {
                ElMessage({
                    message: '注册成功！',
                    type:'success'
                })
                router.push('/login')
            }else {
                ElMessage({
                    message: res.message,
                    type: 'error'
                })
            }
        }else {
            return false;
        }
    })
}
</script>

<template>
    <div class="reg-container">
        <div class="reg-box">
            <!-- 标题盒子 -->
            <div class="title-box"></div>
            <!-- 表单区域 -->
            <el-form :model="form" :rules="rules" ref="registerRef">
                <el-form-item prop="username">
                    <el-input v-model="form.username" type="text" placeholder="请输入账号" />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" type="password" placeholder="请输入密码" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="register" class="btn-register">注册</el-button>
                </el-form-item>
                <el-form-item>
                    <el-link type="info" @click="goLogin">去登录</el-link>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang="less" scoped>
.reg-container {
    height: 100vh;
    background: url('../../assets/images/login_bg.jpg');
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
}

.reg-box {
    width: 400px;
    height: 260px;
    background-color: #fff;
    border-radius: 3px;
    padding: 0 30px;
    box-sizing: border-box;
}

.title-box {
    height: 60px;
    background: url('../../assets/images/login_title.png') center no-repeat;
}

.btn-register {
  width: 100%;
}
</style>