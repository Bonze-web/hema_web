<template>
    <div class="table-index _table-index">        
        <div class="select-head">
            <el-form ref="form" style="display:flex" :model="form" label-width="80px" label-position="right">
                <el-form-item label="拣货分区">
                    <!-- 输入码头的id,方便后面的查找,查找和一开始获取数据的接口是同一个 -->
                    <el-input type='text' placeholder="请输入代码/名称" v-model="form.codeOrNameEquals" class="input-width"></el-input>
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
            <router-link :to="{ path: '/storageinfo/sortdivision/add', query:{ status: 'create'} }">
              <el-button style="margin:18px 10px" type="primary" size="mini">新建</el-button>
            </router-link>
          </el-row>
            <el-table
                :data="suppliersData"
                style="width: 100%;text-align:center"
            >
                <el-table-column prop="code" label="代码">
                    <template slot-scope="scope">
                        <router-link style="color:#409EFF" :to="{ path: '/storageinfo/sortdivision/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.code }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="binScope" label="货位范围">
                    <template slot-scope="scope">
                        {{ scope.row.binScope }}
                    </template>
                </el-table-column>
                <el-table-column prop="stockType" label="存储类型">
                    <template slot-scope="scope">
                        {{ scope.row.stockType }}
                    </template>
                </el-table-column>
                <el-table-column prop="putawayRule" label="上架规则">
                    <template slot-scope="scope">
                        {{ scope.row.putawayRule }}
                    </template>
                </el-table-column>
                <el-table-column
                label="操作">
                  <template slot-scope="scope">
                      <div style="color:#409EFF;cursor:pointer" @click="deleteChange(scope.row.id, scope.row.version)">删除</div>
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
import SortdivisionService from "@/api/service/SortdivisionService";
// import { mapGetters } from "vuex";

export default {
  data() {
      return {
        suppliersId: '',
        page: 1,
        pageSize: 10,
        totalCount: 0,
        form: {
          codeOrNameEquals: ''
        },
        suppliersData: [],
        multipleSelection: [] // 选择的列表
      }
  },
  computed: {
  },
  methods: {
    open() {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
    // 删除按钮
    deleteChange(id, version) {
      const _this = this;
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 调用删除的接口,然后分页查询的接口重新渲染页面
          SortdivisionService.deleteData(id, version)
          .then((res) => {
            _this.$message.success("删除成功")
            _this.getSuppliersList();
          }).catch((err) => {
            if (err === "") {
              _this.$message.success("删除成功")
            } else {
              _this.$message.error("删除失败" + err.message)
            }
            _this.getSuppliersList();
          })
          // 调用删除的接口,然后分页查询的接口重新渲染页面
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 搜索功能
      onSubmit: function() {
        this.page = 1;
        this.$refs.form.validate(result => {
          if (result) {
            this.getSuppliersList();
          }
        })
      },
      statusChange: function(status, id, version) {
      // 修改仓库状态
      const _this = this;
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (status) {
          // 禁用
          SortdivisionService.closeSuppliers(id, version)
          .then((res) => {
            _this.$message.success("禁止用成功")
            _this.getSuppliersList();
          })
          .catch((err) => {
            _this.$message.error("禁用失败" + err)
            _this.getSuppliersList();
          })
        } else {
          // 启用
          SortdivisionService.openSuppliers(id, version)
          .then((res) => {
            _this.$message.success("启用成功")
            _this.getSuppliersList();
          })
          .catch((err) => {
            _this.$message.error("启用失败" + err)
            _this.getSuppliersList();
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })        
      })
    },
      clearInput: function() {
        this.form = {
          codeOrNameEquals: '',
          status: ''
        }
      },
      // 向后台请求数据,这里是查询功能和一开始就调取数据列表
      getSuppliersList: function(reset) {
       // 请求码头的数据
        const _this = this;    
        // 将当前组件的实例记录起来，这些都是我在data中自己写的数据
        const data = {
          codeOrNameEquals: this.form.codeOrNameEquals || null,
          page: this.page,
          pageSize: this.pageSize,
          searchCount: true
        }
        // 获取数据,然后将自己组件中的数据发送到后台
        SortdivisionService.getSuppliersList(data)
        .then((res) => {
          // 初始化自己定义的数据
          _this.suppliersData = [];
          _this.totalCount = res.totalCount;
          for (var i = 0; i < res.records.length; i++) {
            // 数组循环后,将过去到的值,全部放在suppliersData这个数组中,我要模拟数据也要使用这个数组
            // const obj = {
            //   // 码头的id
            //   id: res.records[i].id,
            //   // 代码
            //   code: res.records[i].code,
            //   name: res.records[i].name,
            //   version: res.records[i].version,
            //   status: res.records[i].status,
            //   orgId: res.records[i].orgId,
            //   binScope: res.records[i].binScope
            // }
            // 获取数据后,存到自己的数组里面
            _this.suppliersData.push(res.records[i]);
            // 将数组反向
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
     vm.getSuppliersList();
    })
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
    },
    purposeChange(val) {
      if (!val) return false;
      let str = '';
      for (let i = 0; i < val.length; i++) {
        str += val[i];
      }
        return str;
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
._table-index .el-table .cell{
  padding:  7px 0 !important;
}

</style>
