<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>文章列表</span>
                <el-divider></el-divider>
            </div>
            <!-- 搜索区域 -->
            <div class="search-box">
                <el-form :inline="true">
                    <el-form-item label="文章分类">
                        <el-select placeholder="请选择分类" size="small">
                            <el-option></el-option>
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
                <el-button type="primary" size="small" class="btn-pub">发表文章</el-button>
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
        <el-dialog title="发表文章" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose" @close="closeFn">
            <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
                <el-form-item label="文章标题" prop="title">
                    <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="文章分类" prop="cate_id">
                    <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%">
                        <el-option v-for="obj in fenleiList" :label="obj.cate_name" :key="obj.id"
                            :value="obj.id"></el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="文章内容" prop="content">
                    <quill-editor @blur="wenzhangFn" class="ql-editor" v-model="pubForm.content"></quill-editor>
                </el-form-item>
                <el-form-item label="文章封面" prop="cover_img">
                    <!-- 用来显示封面的图片 -->
                    <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
                    <br />
                    <!-- 文件选择框，默认被隐藏 -->
                    <input type="file" @change="coverFn" style="display: none;" accept="image/*" ref="iptFileRef" />
                    <!-- 选择封面的按钮 -->
                    <el-button type="text" @click="xuanzetupianFn">+ 选择封面</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
                    <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
            <h1 class="title">{{ artDetail.title }}</h1>

            <div class="info">
                <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
                <span>发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
                <span>所属分类：{{ artDetail.cate_name }}</span>
                <span>状态：{{ artDetail.state }}</span>
            </div>

            <!-- 分割线 -->
            <el-divider></el-divider>

            <!-- 文章的封面 -->
            <img v-if="artDetail.cover_img" :src="'http://big-event-vue-api-t.itheima.net' + artDetail.cover_img" alt="" />

            <!-- 文章的详情 -->
            <div v-html="artDetail.content" class="detail-box"></div>
        </el-dialog>
    </div>
</template>
  
<script setup>

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
   