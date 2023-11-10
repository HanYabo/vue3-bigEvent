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
                        <el-button type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加文章分类对话框 -->
        <el-dialog title="新增分类" v-model="centerDialogVisible" width="30%" @close="closeDialog">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
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
import { getArticleCatesAPI } from '@/api'

const cateList = ref([])

const centerDialogVisible = ref(false)

// 新增文章分类对象
const addForm = ref({
    name: '',
    alias: '',
    is_delete: 0
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
    console.log('ok')
    centerDialogVisible.value = false
}

// 修改文章分类
const editArticleCate = (val) => {
    console.log(val)
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
  