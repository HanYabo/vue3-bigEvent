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
                        <el-select placeholder="请选择分类" v-model="query.cate_id">
                            <el-option v-for="item in cateList" :key="item.id" :label="item.name"
                                :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发布状态" style="margin-left: 15px">
                        <el-select placeholder="请选择状态" v-model="query.state">
                            <el-option label="已发布" value="已发布"></el-option>
                            <el-option label="草稿" value="草稿"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="screenCategory">筛选</el-button>
                        <el-button type="info" @click="resetCategory">重置</el-button>
                    </el-form-item>
                </el-form>
                <!-- 发表文章的按钮 -->
                <el-button type="primary" @click="showPubDialog">发表文章</el-button>
            </div>

            <!-- 文章表格区域 -->
            <el-table :data="artList" style="width: 100%;" border stripe>
                <el-table-column label="文章标题" prop="title">
                    <template #default="scope">
                        <el-link type="primary" @click="showArtDetail(scope.row.id)">{{ scope.row.title }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="分类" prop="cate_name">
                </el-table-column>
                <el-table-column label="发表时间" prop="pub_date">
                    <template #default="scope">
                        <span>{{ $formatDate(scope.row.pub_date) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="state"></el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination v-model:current-page="query.pagenum" v-model:page-size="query.pagesize"
                :page-sizes="[2, 3, 5, 10]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
                    <richTextEditor v-model="pubForm.content" :toolBarConfig="toolBarConfig" @change="contentChange"
                        ref="quillRef"></richTextEditor>
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

        <!-- 查看文章详情的对话框 -->
        <el-dialog title="文章预览" v-model="detailVisible" width="80%">
            <h1 class="title">{{ artDetail.title }}</h1>

            <div class="info">
                <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
                <span>发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
                <span>所属分类：{{ artDetail.cate_name }}</span>
                <span>状态：{{ artDetail.state }}</span>
            </div>
            <!-- 分割线 -->
            <el-divider></el-divider>
            <!-- 文章封面 -->
            <img v-if="artDetail.cover_img" :src="BASEURL + artDetail.cover_img" alt="文章封面" class="cover"/>
            <!-- 文章详情 -->
            <div v-html="artDetail.content" class="detail-box"></div>
        </el-dialog>
    </div>
</template>
  
<script setup>
// webpack会把图片变为一个base64字符串/在打包后的图片临时地址
import imgObj from '../../assets/images/cover.jpg'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, onMounted } from 'vue'
import { getArticleCatesAPI, uploadArticleCateAPI, getArticleListAPI, getArticleDetailAPI } from '@/api'
import { baseURL } from '@/utils/request'

// 查询参数对象
const query = ref({
    pagenum: 1,
    pagesize: 2,
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

// 文章列表对象
const artList = ref([])
// 总数据条数
const total = ref(0)

const iptFileRef = ref(null)

const imgRef = ref(null)

// 富文本编辑器ref对象
const quillRef = ref(null)

// 文章详情对话框控制对象
const detailVisible = ref(false)

// 文章详情对象
const artDetail = ref({})

// 基地址
const BASEURL = baseURL


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

// 获取文章列表
const getArticleList = async () => {
    const { data: res } = await getArticleListAPI(query.value)
    if (res.status === 0) {
        artList.value = res.data
        total.value = res.total
    } else {
        ElMessage({
            message: res.message,
            type: 'warning'
        })
    }
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
            // 刷新文章列表
            getArticleList()
        } else {
            return false
        }
    })
}

// 富文本编辑器内容改变触发事件
const contentChange = () => {
    // TODO vue3-quill-editor富文本编辑器内容改变时重新校验存在Bug
    pubFormRef.value.validateField('content')
}

// 新增文章对话框关闭时，清空表单
const dialogClose = () => {
    pubFormRef.value.resetFields()
    // 手动重置img 
    imgRef.value.setAttribute('src', imgObj)
}

// 分页-每页条数改变触发
const handleSizeChange = (sizes) => {
    query.value.pagesize = sizes
    query.value.pagenum = 1
    getArticleList()
}

// 当前页码改变时触发
const handleCurrentChange = (nowPage) => {
    query.value.pagenum = nowPage
    getArticleList()
}

// 筛选文章分类按钮点击事件
const screenCategory = () => {
    query.value.pagenum = 1
    query.value.pagesize = 2
    getArticleList()
}

// 重置文章分类按钮点击事件
const resetCategory = () => {
    query.value.pagenum = 1
    query.value.pagesize = 2
    query.value.cate_id = ''
    query.value.state = ''
    getArticleList()
}

// 获取文章详情
const showArtDetail = async (id) => {
    detailVisible.value = true
    const { data: res } = await getArticleDetailAPI(id)
    artDetail.value = res.data
}

onMounted(() => {
    getArticleCates()
    getArticleList()
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

.cover {
    max-width: 100%;
    height: auto;
    // 图片居中
    display: block;
    margin: 0 auto;
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
:deep(.detail-box) {
    img {
        width: 500px;
    }
}
</style>
   