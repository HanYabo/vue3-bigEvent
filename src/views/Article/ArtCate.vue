<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix header-box">
                <span>文章分类</span>
                <el-button type="primary" size="default" @click="addCateShowDialogBtn">添加分类</el-button>
            </div>
            <el-divider></el-divider>
            <el-table :data="cateList" style="width: 100%" border stripe>
                <el-table-column type="index" label="序号" width="100"></el-table-column>
                <el-table-column prop="name" label="分类名称"></el-table-column>
                <el-table-column prop="alias" label="分类别名"></el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="editCateShowDialogBtn(scope.row)">修改</el-button>
                        <el-button type="danger" size="small" @click="deleteArticleCate(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加文章分类对话框 -->
        <el-dialog :title="title" v-model="centerDialogVisible" width="30%" @close="closeDialog">
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
                    <el-button type="primary" @click="confirm">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
  
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { getArticleCatesAPI, addArticleCateAPI, deleteArticleCateByIdAPI, updateArticleCateByIdAPI } from '@/api'
import { ElMessage } from 'element-plus'

const cateList = ref([])

const centerDialogVisible = ref(false)

// 新增文章分类对象
const addForm = ref({
    name: '',
    alias: ''
})

// 标题对象
const title = ref('')

const isEdit = ref(false)
const editId = ref(0)

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

// 添加分类按钮
const addCateShowDialogBtn = () => {
    title.value = '添加分类'
    isEdit.value = false
    editId.value = 0
    centerDialogVisible.value = true
}

// 修改分类按钮
const editCateShowDialogBtn = (val) => {
    title.value = '修改分类'
    isEdit.value = true
    editId.value = val.id

    centerDialogVisible.value = true
    // 数据回显
    // 先点击修改，再点击添加分类，会产生添加分类中有数据回显的问题。这样的问题是因为el-dialog的懒渲染引起，数据被重置了，但是DOM没来得及渲染，导致DOM渲染的时候，数据又被赋值在表单中。
    // 因为数据更新是异步，DOM渲染是同步，异步先执行，所以回显的值会出现在el-dialog中。
    // 所以可以使用nextTick()这一函数来解决数据更新和DOM渲染不一致的问题。
    // 等待下一次DOM渲染这个时机我们要执行的操作。
    nextTick(() => {
        addForm.value.name = val.name
        addForm.value.alias = val.alias
    })
}

// 获取文章分类
const getArticleCates = async () => {
    const { data: res } = await getArticleCatesAPI()
    cateList.value = res.data
}

// 确认按钮功能
const confirm = () => {
    addFormRef.value.validate(async valid => {
        if (valid) {
            if (isEdit.value) {
                // 修改状态
                addForm.value.id = editId.value
                const { data: res } = await updateArticleCateByIdAPI(addForm.value)
                console.log(res)
                if (res.status === 0) {
                    ElMessage({
                        message: '修改文章分类成功！',
                        type: 'success'
                    })
                } else {
                    ElMessage({
                        message: res.message,
                        type: 'error'
                    })
                }
            } else {
                title.value = '新增分类'
                // 调用新增接口，新增文章分类
                const { data: res } = await addArticleCateAPI(addForm.value)
                if (res.status === 0) {
                    ElMessage({
                        message: '新增文章分类成功！',
                        type: 'success'
                    })
                } else {
                    ElMessage({
                        message: res.message,
                        type: 'error'
                    })
                }
            }
        } else {    
            return false
        }
        await getArticleCates()
        // 不要写在validate外面，不然会引起@close事件，从而导致form清空，导致进不去validate
        centerDialogVisible.value = false
    })
}

// 删除文章分类
const deleteArticleCate = async (item) => {
    const { data: res } = await deleteArticleCateByIdAPI(item)
    if (res.status === 0) {
        ElMessage({
            message: '删除文章分类成功！',
            type: 'success'
        })
        // 删除成功后，调用接口获取最新文章分类
        await getArticleCates()
    } else {
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
  