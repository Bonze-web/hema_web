<template>
    <div class="table-index">        
        <div class="select-head">
            <el-form ref="form" style="display:flex" :model="form" label-width="120px" label-position="right">
                <el-form-item label="拣货分区设置">
                    <!-- 输入码头的id,方便后面的查找,查找和一开始获取数据的接口是同一个 -->
                    <el-input type='text' placeholder="请输入代码/名称" v-model="form.nameOrCode" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择状态">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="启用" value="OPEN"></el-option>
                    <el-option label="停用" value="COLOSED"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="onSubmit">立即搜索</el-button>
                    <el-button size="mini"  @click="clearInput">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="height:20px" />
        <div style="background:#fff">
          <el-row>
            <router-link :to="{ path: '/storageinfo/wharf/edit', query:{ status: 'create'} }">
            <!-- <span v-if="child.meta&&child.meta.title" :title="child.meta.title">{{child.meta.title}}</span> -->
            <el-button style="margin:18px 10px" type="primary" size="mini">新建</el-button>
            </router-link>
          </el-row>
            <el-table
                :data="suppliersData"
                style="width: 100%;text-align:center"
            >
                <!-- <el-table-column
                    type="selection"
                    width="55">
                </el-table-column> -->
                <el-table-column fixed prop="code" label="代码">
                    <template slot-scope="scope">
                        <router-link style="color:#409EFF" :to="{ path: '/storageinfo/wharf/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.code }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="dockerusage" label="用途">
                    <template slot-scope="scope">
                        {{ scope.row.dockerusage }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" >
                  <template slot-scope="scope">
                    {{ scope.row.status | sourceType }}
                  </template>
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作"
                width="200">
                  <template slot-scope="scope">
                    <el-button :disabled="scope.row.status" size="mini" type="text" @click="statusChange(scope.row.status, scope.row.id, scope.row.version)">启用</el-button>
                    <el-button :disabled="!scope.row.status" size="mini" type="text" @click="statusChange(scope.row.status, scope.row.id, scope.row.version)">禁用</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                fixed="right"
                label="编辑"
                width="200">
                  <template slot-scope="scope">
                      <router-link :to="{ path: '/storageinfo/wharf/edit', query:{ status: 'edit', id: scope.row.id} }">
                            <el-button size="mini" type="text">编辑</el-button>
                      </router-link>
                  </template>
                </el-table-column>
            </el-table>
            <!-- 下面这个是翻页 -->
            <el-pagination
                style="float:right"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="1"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
// 引入公共模块
import WharfService from "@/api/service/WharfService";
// import { mapGetters } from "vuex";

export default {
  data() {
      return {
        suppliersId: '',
        page: 1,
        pageSize: 10,
        totalCount: 0,
        form: {
          nameOrCode: '',
          status: ''
        },
        suppliersData: [],
        multipleSelection: [] // 选择的列表
      }
  },
  computed: {
  },
  methods: {
    // 搜索功能
      onSubmit: function() {
        this.page = 1;
        this.$refs.form.validate(result => {
          if (result) {
            this.getSuppliersList()
          }
        })
      },
      statusChange: function(status, id, version) {
        // 启用的状态
        console.log(status);
        if (status) {
          WharfService.closeSuppliers(id, version)
          .then((res) => {
            this.$message.success("禁用成功")
            this.getSuppliersList()
          })
          .catch((err) => {
            this.$message.error("禁用失败" + err)
            this.getSuppliersList()
          })
        } else {
          WharfService.openSuppliers(id, version)
          .then((res) => {
            this.$message.success("启用成功")
            this.getSuppliersList()
          })
          .catch((err) => {
            this.$message.error("启用失败" + err)
            this.getSuppliersList()
          })
        }
      },
      clearInput: function() {
        this.form = {
          nameOrCode: '',
          status: ''
        }
      },
      // 向后台请求数据,这里是查询功能和一开始就调取数据列表
      getSuppliersList: function(reset) {
       // 请求码头的数据
        const _this = this;    
        // 将当前组件的实例记录起来，这些都是我在data中自己写的数据
        const data = {
          page: this.page,
          pageSize: this.pageSize,
          searchCount: true,
          // 上面的不用修改，只要修改下面的两个地方
          codeOrNameEquals: this.form.nameOrCode,
          status: this.form.status
        }
        // 获取数据,然后将自己组件中的数据发送到后台
        WharfService.getSuppliersList(data)

        .then((res) => {
          // 初始化自己定义的数据
          _this.suppliersData = [];
          // 将总数,赋值给自己定义的变量
          this.totalCount = res.totalCount;
          for (const item in res.records) {
            // 数组循环后,将过去到的值,全部放在suppliersData这个数组中,我要模拟数据也要使用这个数组
            const obj = {
              // 码头的id
              id: res.records[item].id,
              // 代码
              code: res.records[item].code,
              name: res.records[item].name,
              // 用途
              dockerusage: res.records[item].dockerusage
              // anotherName: res.records[item].anotherName,
              // status: res.records[item].status,
              // address: res.records[item].address,
              // sourceType: res.records[item].sourceType,
              // version: res.records[item].version
            }
            if (obj.status === "OPEN") {
              obj.status = true
            } else {
              obj.status = false
            }
            // 获取数据后,存到自己的数组里面
            _this.suppliersData.push(obj)
          }
        })
      },
      // 这里是修改当前值的地方
      handleCurrentChange: function(e) {
        this.page = Number(e)
        this.getSuppliersList()
      },
      handleSizeChange: function(e) {
        this.pageSize = Number(e)
        this.page = 1
        this.getSuppliersList()
      }
  },
  created() {
    this.getSuppliersList();
  },
  filters: {
    sourceType(type) {
      switch (type) {
        case "HAND":
          return "手动创建"
        case "IMPORT":
          return "文件导入"
        default:
          return '未知';
      }
    },
    suppliersStatus(status) {
      switch (status) {
        case true:
          return "启用"
        case false:
          return "禁用"
        default:
          return '未知';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
</style>
<style lang="scss">
.table-index{
@import "src/styles/mixin.scss";
@include elTable;
}
</style>
