<script setup>
import { ref } from 'vue'
import { loginAPI } from '../../api/index'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const formRef = ref(null)
const router = useRouter()
const form = ref({
  username: '',
  password: ''
})

const rules = ref({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ]
})

// 登录
const login = () => {
  formRef.value.validate(async valid => {
    if (valid) {
      const res = await loginAPI(form.value)
      if (res.data.status === 0) {
        ElMessage({
          message: '登录成功！',
          type: 'success'
        })
        // 跳转页面
        router.push('/home')
      } else {
        ElMessage({
          message: res.data.message,
          type: 'error'
        })
      }
    }else {
      return false;
    }
  })
}
// 注册
const goRegister = () => {
  router.push('/register')
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
        <el-form-item class="btn-login">
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
        <el-form-item class="btn-register">
          <el-link type="info" @click="goRegister">去注册</el-link>
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

.btn-login {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  justify-content: center;
  align-items: center;
}

.btn-register {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}
</style>