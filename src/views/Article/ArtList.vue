<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>文章列表</span>
                <el-divider />
            </div>
            <!-- 搜索区域 -->
            <div class="search-box">
                <el-form :inline="true">
                    <el-form-item label="文章分类">
                        <el-select placeholder="请选择分类" size="small">
                            <el-option v-for="item in cateList" :key="item.id" :label="item.name"
                                :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发布状态" style="margin-left: 15px">
                        <el-select placeholder="请选择状态" size="small">
                            <el-option label="已发布" value="已发布"></el-option>
                            <el-option label="草稿" value="草稿"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary">筛选</el-button>
                        <el-button type="info">重置</el-button>
                    </el-form-item>
                </el-form>
                <!-- 发表文章的按钮 -->
                <el-button type="primary" @click="showPubDialog">发表文章</el-button>
            </div>

            <!-- 文章表格区域 -->
            <el-table data="" style="width: 100%;" border stripe>
                <el-table-column label="文章标题" prop="title">
                    <template v-slot="scope">
                        <el-link type="primary"></el-link>
                    </template>
                </el-table-column>
                <el-table-column label="分类" prop="cate_name"></el-table-column>
                <el-table-column label="发表时间" prop="pub_date">
                    <template v-slot="scope">
                        <span></span>
                    </template>

                </el-table-column>
                <el-table-column label="状态" prop="state"></el-table-column>
                <el-table-column label="操作">
                    <template v-slot="{ row }">
                        <el-button type="danger" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <!-- <el-pagination @size-change="handleSizeChangeFn" @current-change="handleCurrentChangeFn"
                :current-page.sync="q.pagenum" :page-sizes="[2, 3, 5, 10]" :page-size.sync="q.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination> -->
        </el-card>
        <!-- 发表文章的 Dialog 对话框 -->
        <el-dialog title="发表文章" v-model="pubDialogVisible" fullscreen :before-close="handleClose" @close="dialogClose">
            <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
                <el-form-item label="文章标题" prop="title">
                    <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="文章分类" prop="cate_id">
                    <el-select placeholder="请选择分类" style="width: 100%" v-model="pubForm.cate_id">
                        <el-option v-for="item in cateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章内容" prop="content">
                    <!-- 富文本处理器 -->
                    <!-- TODO 此插件存在BUG，data改变后视图无法改变，且编辑器内容删除后残留<br>导致无法重新触发校验规则 -->
                    <richTextEditor v-model="pubForm.content" :toolBarConfig="toolBarConfig" @change="contentChange"></richTextEditor>
                </el-form-item>
                <el-form-item label="文章封面" prop="cover_img">
                    <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
                    <!-- 文件选择框 默认被隐藏 -->
                    <input type="file" style="display: none;" accept="image/*" ref="iptFileRef"
                        @change="changeCover($event)" />
                    <el-divider style="border-style: hidden; margin: 0"></el-divider>
                    <el-button type="text" @click="selectCover">+ 选择封面</el-button>
                </el-form-item>
                <el-form-item prop="state">
                    <el-button type="primary" @click="pubArticle('已发布')">发布</el-button>
                    <el-button type="info" @click="pubArticle('草稿')">保存草稿</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
  
<script setup>
// webpack会把图片变为一个base64字符串/在打包后的图片临时地址
import imgObj from '../../assets/images/cover.jpg'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, onMounted } from 'vue'
import { getArticleCatesAPI, uploadArticleCateAPI } from '@/api'


// 查询参数对象
const query = ref({
    pageNum: 1,
    pageSize: 2,
    cate_id: '',
    state: ''
})

// quill-editor配置项
const toolBarConfig = ref([
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['clean'],
    ['link', 'image', 'video']
])

const pubDialogVisible = ref(false)  // 控制发表文章的 Dialog 对话框是否显示

// 发表文章的表单对象
const pubForm = ref({
    title: '',
    cate_id: '',
    content: '',
    cover_img: '',
    state: ''
})

// 发表文章的表单验证规则对象
const pubFormRules = ref({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
    ],
    cate_id: [
        { required: true, message: '请选择文章标题', trigger: 'change' },
    ],
    content: [
        { required: true, message: '请输入文章内容', trigger: 'change' },
    ],
    cover_img: [
        { required: true, message: '请选择封面', trigger: 'blur' }
    ]
})

// 表单验证规则对象
const pubFormRef = ref(null)

// 分类列表对象
const cateList = ref([])

const iptFileRef = ref(null)

const imgRef = ref(null)

// 发表文章按钮点击事件
const showPubDialog = () => {
    pubDialogVisible.value = true
}

// 发表文章-对话框-关闭前的回调
const handleClose = async (done) => { // done的作用：调用才会放行让对话框关闭
    const confirmResult = await ElMessageBox.confirm(
        '此操作将会导致文章信息丢失，是否继续？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).catch(err => err)
    // 取消了关闭-阻止住，什么都不干
    if (confirmResult === 'cancel') return
    // 确认关闭
    done()
}

// 获取所有文章分类
const getArticleCates = async () => {
    const { data: res } = await getArticleCatesAPI()
    cateList.value = res.data
}

// 选择封面点击事件
const selectCover = () => {
    iptFileRef.value.click() // 用js模拟一次点击事件动作
}

// 选择封面文件
const changeCover = (e) => {
    const files = e.target.files
    if (files.length === 0) {
        // 用户没有选择图片，拿到选择的文件数组
        pubForm.value.cover_img = null
        // img要显示回默认的cover_img
        imgRef.value.setAttribute('src', imgObj)
    } else {
        // 用户选择图片，把文件直接保存到表单对象的属性中
        pubForm.value.cover_img = files[0]
        // 将图片文件，显示到img标签中
        const url = URL.createObjectURL(files[0])
        imgRef.value.setAttribute('src', url)
    }
    pubFormRef.value.validateField('cover_img')
}

// 表单中发布/（存为草稿）
const pubArticle = (str) => {
    pubForm.value.state = str // 保存到表单对象中

    // 校验
    pubFormRef.value.validate(async valid => {
        if (valid) {
            // 通过
            const fd = new FormData() // 准备一个表单数据对象的容器
            fd.append('title', pubForm.value.title)
            fd.append('cate_id', pubForm.value.cate_id)
            fd.append('content', pubForm.value.content)
            fd.append('cover_img', pubForm.value.cover_img)
            fd.append('state', pubForm.value.state)

            const { data: res } = await uploadArticleCateAPI(fd)
            if (res.status === 0) {
                ElMessage({
                    message: '发布文章成功！',
                    type: 'success'
                })
            } else {
                ElMessage({
                    message: res.message,
                    type: 'warning'
                })
            }
            // 关闭对话框
            pubDialogVisible.value = false
        } else {
            return false
        }
    })
}

// 富文本编辑器内容改变触发事件
const contentChange = () => {
    // TODO 富文本编辑器内容改变时重新校验存在Bug
    pubFormRef.value.validateField('content')
}

// 新增文章对话框关闭时，清空表单
const dialogClose = () => {
    pubFormRef.value.resetFields()
    // 手动重置img
    imgRef.value.setAttribute('src', imgObj)
}

onMounted(() => {
    getArticleCates()
})
</script>
  
<style lang="less" scoped>
.search-box {
    display: flex;
    justify-content: space-between;
    align-content: flex-start;
}

// 样式穿透
:deep(.ql-toolbar) {
    width: 100%;
}

:deep(.ql-container) {
    width: 100%;
    height: 400px;
}

.cover-img {
    width: 400px;
    height: 280px;
    object-fit: cover;
}

.el-pagination {
    margin-top: 15px;
}

.title {
    font-size: 24px;
    text-align: center;
    font-weight: normal;
    color: #000;
    margin: 0 0 10px 0;
}

.info {
    font-size: 12px;

    span {
        margin-right: 20px;
    }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
:deep(.detail-box) {
    img {
        width: 500px;
    }
}
</style>
   