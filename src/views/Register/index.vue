<script setup>
import { ref } from 'vue'
import { registerAPI } from '../../api/index'
import { useRouter } from 'vue-router'
const formRef = ref(null) 
const router = useRouter()
const form = ref({
    username: '',
    password: ''
})

const rules = ref({
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
    ]
})

// 登录
const goLogin = () => {
    router.push('/login')
}
// 注册
const register = () => {
    // 检验form对象是否合法，如果合法，调用registerAPI接口，如果不合法，拒绝表单提交
    formRef.value.validate(async valid => {
        if (valid) {
            const res = await registerAPI(form.value)
            console.log(res)
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
            <el-form :model="form" :rules="rules" ref="formRef">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="form.username" type="text" placeholder="请输入账号" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password" placeholder="请输入密码" />
                </el-form-item>
                <el-form-item class="btn-register">
                    <el-button type="primary" @click="register">注册</el-button>
                </el-form-item>
                <el-form-item class="btn-login">
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
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  justify-content: center;
  align-items: center;
}
.btn-login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

</style>