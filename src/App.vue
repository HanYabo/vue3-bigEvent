<script setup>
import { loginAPI } from './api/index'
const login = async () => {
  const res = await loginAPI()
  console.log(res)
}
</script>

<template>
  <div>
    <el-button type="primary" @click="login">登录</el-button>
  </div>
</template>

<style scoped>
</style>