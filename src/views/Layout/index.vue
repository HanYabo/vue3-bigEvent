<template>
    <el-container class="main-container">
        <!-- 头部区域 -->
        <el-header>
            <!-- 左侧的 logo -->
            <img src="../../assets/images/logo.png" alt="" />
            <!-- 右侧的菜单 -->
            <el-menu class="el-menu-top" mode="horizontal" background-color="#23262E" text-color="#fff"
                active-text-color="#409EFF">
                <el-sub-menu index="1">
                    <template #title>
                        <!-- 头像 -->
                        <img src="../../assets/images/logo.png" alt="" class="avatar" />
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="1-1"><el-icon>
                            <Operation />
                        </el-icon>基本资料</el-menu-item>
                    <el-menu-item index="1-2"><el-icon>
                            <Camera />
                        </el-icon>更换头像</el-menu-item>
                    <el-menu-item index="1-3"><el-icon>
                            <Key />
                        </el-icon>重置密码</el-menu-item>
                </el-sub-menu>
                <el-menu-item index="2" @click="quit"><el-icon>
                        <SwitchButton />
                    </el-icon>退出</el-menu-item>
            </el-menu>
        </el-header>

        <el-container>
            <!-- 侧边栏区域 -->
            <el-aside width="200px">
                <!-- 侧边栏用户信息区 -->
                <div class="user-box">
                    <img v-if="tokenStore.getUserPic" :src="tokenStore.getUserPic" alt="">
                    <img src="../../assets/images/logo.png" alt="" v-else>
                    <span>欢迎{{ tokenStore.getNickname || tokenStore.getUsername}}</span>
                </div>
                <!-- 侧边栏导航区 -->
                <el-menu active-text-color="#ffd04b" background-color="#393d49" class="el-menu-vertical-demo"
                    default-active="home" text-color="#fff" @open="handleOpen" @close="handleClose" unique-opened router>
                    <el-menu-item index="home">
                        <el-icon>
                            <House />
                        </el-icon>
                        <span>首页</span>
                    </el-menu-item>
                    <el-sub-menu index="#">
                        <template #title>
                            <el-icon>
                                <Memo />
                            </el-icon>
                            <span>文章管理</span>
                        </template>
                        <el-menu-item index="2.1">
                            <el-icon>
                                <Management />
                            </el-icon>
                            <span>文章分类</span>
                        </el-menu-item>
                        <el-menu-item index="2.2">
                            <el-icon>
                                <Document />
                            </el-icon>
                            <span>文章列表</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="user">
                        <template #title>
                            <el-icon><User/></el-icon>
                            <span>个人中心</span>
                        </template>
                        <el-menu-item index="userinfo">
                            <el-icon><User/></el-icon>
                            <span>基本资料</span>
                        </el-menu-item>
                        <el-menu-item index="3.2">
                            <el-icon><Camera/></el-icon>
                            <span>更换头像</span>
                        </el-menu-item>
                        <el-menu-item index="3.3">
                            <el-icon><Key/></el-icon>
                            <span>重置密码</span>
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-aside>
            <el-container>
                <!-- 页面主体区域 -->
                <el-main>
                    <RouterView></RouterView>
                </el-main>
                <!-- 底部 footer 区域 -->
                <el-footer>© www.hikari.com MuY1eee</el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>
  
<script setup>
import { onMounted} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTokenStore } from '@/stores'
import { useRouter } from 'vue-router'
import { getUserInfoAPI } from '@/api'
const router = useRouter()
const tokenStore = useTokenStore()
const handleOpen = (key, keyPath) => {
    console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
    console.log(key, keyPath)
}

onMounted(async () => {
    // 当token存在时，再请求获取用户信息
    const { data: res } = await getUserInfoAPI()
    tokenStore.updateUserInfo(res.data)
    console.log(route.path)
})

const quit = () => {
    // 确认提示框
    ElMessageBox.confirm(
        '确认要退出吗?',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        // 清除token
        tokenStore.updateToken('')
        // 清除userinfo
        tokenStore.updateUserInfo({})
        // 强制跳转页面
        router.push('/login')
        ElMessage({
            type: 'success',
            message: '退出成功！',
        })
    })
        .catch(() => {
            // 退出失败
        })
}
</script>
  
<style lang="less" scoped>
.main-container {
    height: 100vh;

    .el-header,
    .el-aside {
        background-color: #23262e;
    }

    .el-header {
        padding: 0;
        display: flex;
        justify-content: space-between;
    }

    .el-main {
        overflow-y: scroll;
        height: 0;
        background-color: #f2f2f2;
    }

    .el-footer {
        background-color: #eee;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.avatar {
    border-radius: 50%;
    width: 35px;
    height: 35px;
    background-color: #fff;
    margin-right: 10px;
    object-fit: cover;
}


.user-box {
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    user-select: none;

    img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: #fff;
        margin-right: 15px;
        object-fit: cover;
    }

    span {
        color: white;
        font-size: 12px;
    }
}</style>
  