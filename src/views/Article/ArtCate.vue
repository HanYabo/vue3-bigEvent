<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix header-box">
                <span>文章分类</span>
                <el-button type="primary" size="default" @click="centerDialogVisible = true">添加分类</el-button>
            </div>
            <el-divider></el-divider>
            <el-table :data="cateList" style="width: 100%" border stripe>
                <el-table-column type="index" label="序号" width="100"></el-table-column>
                <el-table-column prop="name" label="分类名称"></el-table-column>
                <el-table-column prop="alias" label="分类别名"></el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="editArticleCate(scope.row)">修改</el-button>
                        <el-button type="danger" size="small" @click="deleteArticleCate(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加文章分类对话框 -->
        <el-dialog title="新增分类" v-model="centerDialogVisible" width="30%" @close="closeDialog">
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="addForm.name" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="分类别名" prop="alias">
                    <el-input v-model="addForm.alias" minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="addArticleCate">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import { getArticleCatesAPI, addArticleCateAPI, deleteArticleCateByIdAPI } from '@/api'
import { ElMessage } from 'element-plus'

const cateList = ref([])

const centerDialogVisible = ref(false)

// 新增文章分类对象
const addForm = ref({
    name: '',
    alias: ''
})

// 标签对象
const addFormRef = ref(null)

// 规则对象
const addFormRules = ref({
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
    ],
    alias: [
        { required: true, message: '请输入分类别名', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
    ]
})

// 获取文章分类
const getArticleCates = async () => {
    const { data: res } = await getArticleCatesAPI()
    cateList.value = res.data
}

// 添加文章分类
const addArticleCate = () => {
    addFormRef.value.validate(async valid => {
        if(valid) {
            // 校验成功，调用接口
            const { data: res } = await addArticleCateAPI(addForm.value)
            if(res.status === 0) {
                ElMessage({
                    message: '新增文章分类成功！',
                    type:'success'
                })
                await getArticleCates()
            }else {
                ElMessage({
                    message: res.message,
                    type: 'error'
                })
            }
        }else {
            return false
        }
        // 不要写在validate外面，不然会引起@close事件，从而导致form清空，导致进不去validate
        centerDialogVisible.value = false
    })
}

// 修改文章分类
const editArticleCate = (val) => {
    console.log(val)
}

// 删除文章分类
const deleteArticleCate = async (item) => {
    const { data: res } = await deleteArticleCateByIdAPI(item)
    if(res.status === 0) {
        ElMessage({
            message: '删除文章分类成功！',
            type: 'success'
        })
        // 删除成功后，调用接口获取最新文章分类
        await getArticleCates()
    }else {
        ElMessage({
            message: res.message,
            type: 'error'
        })
    }
    
}

// 关闭对话框
const closeDialog = () => {
    addFormRef.value.resetFields()
}

// 取消按钮
const cancel = () => {
    addFormRef.value.resetFields()
    centerDialogVisible.value = false
}

onMounted(() => {
    getArticleCates()
})
</script>
  
<style lang="less" scoped>
.header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>
  