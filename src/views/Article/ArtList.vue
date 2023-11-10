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
                            <el-option v-for="item in cateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发布状态" style="margin-left: 15px">
                        <el-select placeholder="请选择状态" size="small">
                            <el-option label="已发布" value="已发布"></el-option>
                            <el-option label="草稿" value="草稿"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small">筛选</el-button>
                        <el-button type="info" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
                <!-- 发表文章的按钮 -->
                <el-button type="primary" size="small" class="btn-pub" @click="showPubDialog">发表文章</el-button>
            </div>

            <!-- 文章表格区域 -->
            <!-- <el-table data="" style="width: 100%;" border stripe>
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
            </el-table> -->
            <!-- 分页区域 -->
            <!-- <el-pagination @size-change="handleSizeChangeFn" @current-change="handleCurrentChangeFn"
                :current-page.sync="q.pagenum" :page-sizes="[2, 3, 5, 10]" :page-size.sync="q.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination> -->
        </el-card>
        <!-- 发表文章的 Dialog 对话框 -->
        <el-dialog title="发表文章" v-model="pubDialogVisible" fullscreen :before-close="handleClose">
            <el-form :model="pubForm" :rules="pubFormRules" ref="" label-width="100px">
                <el-form-item label="文章标题" prop="title">
                    <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="文章分类" prop="cate_id">
                    <el-select placeholder="请选择分类" style="width: 100%">
                        <el-option v-for="item in cateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章内容" prop="content">
                    <quill-editor class="ql-editor"></quill-editor>
                </el-form-item>
                <el-form-item label="文章封面" prop="cover_img">
                    <!-- 用来显示封面的图片 -->
                    <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="" />
                    <br />
                    <!-- 文件选择框，默认被隐藏 -->
                    <input type="file" style="display: none;" accept="image/*" ref="" />
                    <!-- 选择封面的按钮 -->
                    <el-button type="text">+ 选择封面</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">发布</el-button>
                    <el-button type="info">存为草稿</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
  
<script setup>
import { ElMessageBox } from 'element-plus'
import { ref, onMounted } from 'vue'
import { getArticleCatesAPI } from '@/api'
// 查询参数对象
const query = ref({
    pageNum: 1,
    pageSize: 2,
    cate_id: '',
    state: ''
})

const pubDialogVisible = ref(false)  // 控制发表文章的 Dialog 对话框是否显示

// 发表文章的表单对象
const pubForm = ref({
    title: '',
    cate_id: ''
})

// 发表文章的表单验证规则对象
const pubFormRules = ref({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
    ],
    cate_id: [
        { required: true, message: '请选择文章标题', trigger: 'blur' },
    ]
})

// 分类列表对象
const cateList = ref([])

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
onMounted(() => {
    getArticleCates()
})
</script>
  
<style lang="less" scoped>
.search-box {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .btn-pub {
        margin-top: 5px;
    }
}

::v-deep .ql-editor {
    min-height: 300px;
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
::v-deep .detail-box {
    img {
        width: 500px;
    }
}
</style>
   