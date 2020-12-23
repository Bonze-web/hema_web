<template>
<!--列表模板样式统一使用mini.scss,页面不同的样式可以自己写 -->
  <div class="table-index">
        头部位筛选搜索表单控件
        <!-- <div class="select-head">
            <el-form ref="form" style="display:flex" :model="form" label-width="80px" label-position="right">
                <el-form-item label="容器类型">
                    <el-input type='text' placeholder="请输入代码/名称" v-model="form.nameOrCode" class="input-width"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" size="mini">立即搜索</el-button>
                    <el-button  @click="clearInput" size="mini">重置</el-button>
                </el-form-item>
            </el-form>
        </div> -->
        
        <div style="height:20px" />
        <div style="background:#fff">
            新建按钮在列表左上角
          <!-- <el-row>
            <router-link :to="{ path: '/basicinfo/containertype/add', query:{ status: 'create'} }">
                <el-button style="margin:18px 10px" type="primary" size="mini">新建</el-button>
            </router-link>
          </el-row> -->

          列表使用elementtable控件，自定义内容增加需要按照开发规范中提到的控件使用相应的控件
            <!-- <el-table
                :data="dcData"
                style="width: 100%;text-align:center"
            >
                <el-table-column prop="code" label="代码">
                    <template slot-scope="scope">
                        <router-link style="color:#409EFF" :to="{ path: '/basicinfo/containertype/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.code }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="status" label="状态" >
                  <template slot-scope="scope">
                    {{ scope.row.status | dcStatus }}
                  </template>
                </el-table-column>
                <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button :disabled="scope.row.status" size="mini" type="text" @click="statusChange(scope.row.status, scope.row.id, scope.row.version)">启用</el-button>
                  <el-button :disabled="!scope.row.status" size="mini" type="text" @click="statusChange(scope.row.status, scope.row.id, scope.row.version)">禁用</el-button>
                </template>
                </el-table-column>
            </el-table> -->

            分页查询使用固定控件
            <!-- <el-pagination
                style="float:right"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="1"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination> -->
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style>

</style>