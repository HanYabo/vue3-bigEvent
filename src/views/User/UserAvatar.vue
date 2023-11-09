<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>更换头像</span>
        </div>
        <div>
            <!-- 图片，用来展示用户选择的头像 -->
            <img v-if="!avatar" class="the_img" src="../../assets/images/avatar.jpg" alt="" />
            <img v-else class="the_img" :src="avatar" alt="" />

            <!-- 按钮区域 -->
            <div class="btn-box">
                <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange($event)"/>
                <el-button type="primary" @click="chooseImg()"><el-icon><Plus /></el-icon>选择图片</el-button>
                <el-button type="success"><el-icon><Upload /></el-icon>上传头像</el-button>
            </div>
        </div>
    </el-card>
</template>

<script setup>
import { ref } from 'vue'
// 图片对象
const avatar = ref('')
// 标签对象
const iptRef = ref(null)
// 选择图片
const chooseImg = () => {
    iptRef.value.click()
}
// 选择图片确定
const onFileChange = (e) => { // e 原生事件对象
    const files = e.target.files // 拿到用户选择的文件数组
    if (files.length === 0) { 
        // 窗口打开但未选择图片
        avatar.value = ''
    } else {
        // 选择了文件（默认只能选择1个，如果多选需要给input添加额外原生属性）
        // img的src只能是链接地址或者相对路径地址
        // 或者是图片的base64字符串（而且字符串还必须是data:image/png;base64，图片转base64字符串）
        // 后端要求传过去的值为dataURL
        
        // 解决方法1： 文件 -> 内存临时地址（这个地址只能在js的内存中，不能发给后台）
        // 语法：URL.createObjectURL(文件)
        // 返回值：内存临时地址
        // avatar.value = URL.createObjectURL(files[0])

        // 解决方法2：文件 -> base64字符串（此字符串可以直接发给后端）
        // 1.创建FileReader对象
        const fr = new FileReader()
        // 2.将图片以DataURL格式读取
        fr.readAsDataURL(files[0])
        // 3.绑定事件，等待文件被读成base64字符串后触发onload回调函数
        fr.onload = e => {
            // 将结果赋值给avatar
            avatar.value = e.target.result
        }
    }
}
</script>

<style lang="less" scoped>
.btn-box {
    margin-top: 10px;
}

.preview {
    object-fit: cover;
}

.the_img {
    width: 350px;
    height: 350px;
}</style>
