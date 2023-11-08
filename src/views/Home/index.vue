<template>
    <div>
        <div class="container-fluid">
            <el-row class="spannel_list" :gutter="10">
                <el-col :sm="6" :xs="12">
                    <div class="spannel">
                        <em>10015</em><span>篇</span>
                        <b>总文章数</b>
                    </div>
                </el-col>
                <el-col :sm="6" :xs="12">
                    <div class="spannel scolor01">
                        <em>123</em><span>篇</span>
                        <b>日新增文章数</b>
                    </div>
                </el-col>
                <el-col :sm="6" :xs="12">
                    <div class="spannel scolor02">
                        <em>35</em><span>条</span>
                        <b>评论总数</b>
                    </div>
                </el-col>
                <el-col :sm="6" :xs="12">
                    <div class="spannel scolor03">
                        <em>123</em><span>条</span>
                        <b>日新增评论数</b>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="charts-container">
            <div class="gragh_pannel">
                <Echarts :option="optionOne" style="width: 1200px;"></Echarts>
            </div>
            <div class="gragh_pannel">
                <Echarts :option="optionTwo"></Echarts>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import * as echarts from 'echarts';
const optionOne = ref({
    title: {
        text: '月新增文章数',
        left: 'center',
        top: '10'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['新增文章'],
        top: '40'
    },
    toolbox: {
        show: true,
        feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
        }
    },
    calculable: true,
    xAxis: [
        {
            name: '日',
            type: 'category',
            boundaryGap: false,
            data: ['2023-11-01', '2023-11-10', '2023-11-20', '2023-11-30']
        }
    ],
    yAxis: [
        {
            name: '月新增文章数',
            type: 'value'
        }
    ],
    series: [
        {
            name: '新增文章',
            type: 'line',
            smooth: true,
            itemStyle: { normal: { areaStyle: { type: 'default' }, color: '#f80' }, lineStyle: { color: '#f80' } },
            data: [120, 132, 101, 134, 90, 230, 210]
        }],
    areaStyle: {

    },
    grid: {
        show: true,
        x: 50,
        x2: 50,
        y: 80,
        height: 220
    }
})
const optionTwo = ref({
    title: {
        text: '分类文章数量比',
        left: 'center',
        top: '10'
    },
    tooltip: {
        trigger: 'item'
    },
    toolbox: {
        show: true,
        x: 'center',
        top: 35,
        feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
                show: true,
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            restore: { show: true },
            saveAsImage: { show: true }
        }
    },
    legend: {
        top: '65',
        left: 'center'
    },
    series: [
        {
            top: '60',
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                { value: 1048, name: '奇趣事' },
                { value: 735, name: '会生活' },
                { value: 580, name: '爱旅行' },
                { value: 484, name: '趣美味' },
            ]
        }
    ]

})
</script>

<style lang="less" scoped>
.spannel_list {
    margin-top: 20px;
}

.spannel {
    height: 100px;
    overflow: hidden;
    text-align: center;
    position: relative;
    background-color: #fff;
    border: 1px solid #e7e7e9;
    margin-bottom: 20px;
}

.spannel em {
    font-style: normal;
    font-size: 50px;
    line-height: 50px;
    display: inline-block;
    margin: 10px 0 0 20px;
    font-family: 'Arial';
    color: #83a2ed;
}

.spannel span {
    font-size: 14px;
    display: inline-block;
    color: #83a2ed;
    margin-left: 10px;
}

.spannel b {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    line-height: 24px;
    background: #e5e5e5;
    color: #333;
    font-size: 14px;
    font-weight: normal;
}

.scolor01 em,
.scolor01 span {
    color: #6ac6e2;
}

.scolor02 em,
.scolor02 span {
    color: #5fd9de;
}

.scolor03 em,
.scolor03 span {
    color: #58d88e;
}

.gragh_pannel {
    width: 100%;
    height: 350px;
    border: 1px solid #e7e7e9;
    background-color: #fff !important;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.column_pannel {
    margin-bottom: 20px;
    height: 400px;
    border: 1px solid #e7e7e9;
    background-color: #fff !important;
}
.charts-container {
    display: flex;
    justify-content: space-between;
}

</style>
