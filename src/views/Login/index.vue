<script setup>
import { ref } from 'vue'
import { loginAPI } from '../../api/index'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useTokenStore } from '../../stores'
// pinia仓库对象
const tokenStore = useTokenStore()
// 表单校验
const loginRef = ref(null)

const router = useRouter()
const form = ref({
  username: '',
  password: ''
})

// 规则验证对象
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
const login = () => {
  loginRef.value.validate(async valid => {
    if (valid) {
      const { data: res } = await loginAPI(form.value)
      if (res.status === 0) {
        ElMessage({
          message: '登录成功！',
          type: 'success'
        })
        // 将token存入到仓库
        tokenStore.updateToken(res.token)
        // 跳转页面
        router.push('/layout')
      } else {
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
// 跳转到注册页面
const goRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 标题盒子 -->
      <div class="title-box"></div>
      <!-- 表单区域 -->
      <el-form :model="form" :rules="rules" ref="loginRef">
        <el-form-item prop="username">
          <el-input v-model="form.username" type="text" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" class="btn-login">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="info" @click="goRegister">去注册</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login-container {
  height: 100vh;
  background: url('../../assets/images/login_bg.jpg');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
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

.btn-login {
  width: 100%;
}

</style>