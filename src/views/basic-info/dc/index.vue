<template>
    <div class="table-index">
        
        <div class="select-head">
            <el-form ref="form" style="display:flex" :model="form" label-width="80px" label-position="right">
                <el-form-item label="配送中心">
                    <el-input type='text' placeholder="请输入配送中心编号/名称" v-model="form.nameOrCode" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择状态">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="启用" value="ON"></el-option>
                    <el-option label="禁用" value="OFF"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="form.type" placeholder="请选择类型">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="中心仓" value="CENTER"></el-option>
                    <el-option label="网格仓" value="FRONT"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" size="mini">立即搜索</el-button>
                    <el-button  @click="clearInput" size="mini">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="height:20px" />
        <div style="background:#fff">
          <el-row>
            <router-link :to="{ path: '/basicinfo/dc/add', query:{ status: 'create'} }">
            <!-- <span v-if="child.meta&&child.meta.title" :title="child.meta.title">{{child.meta.title}}</span> -->
            <el-button style="margin:18px 10px" type="primary" size="mini">新建</el-button>
        </router-link>
          </el-row>
            <el-table
                :data="dcData"
                style="width: 100%;text-align:center"
            >
                <!-- <el-table-column
                    type="selection"
                    width="55">
                </el-table-column> -->
                <el-table-column prop="code" label="代码">
                    <template slot-scope="scope">
                        <router-link style="color:#409EFF" :to="{ path: '/basicinfo/dc/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.code }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="shortName" label="简称"></el-table-column>
                <el-table-column prop="type" label="类型" >
                  <template slot-scope="scope">
                    {{ scope.row.type | dcType }}
                  </template>
                </el-table-column>
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
            </el-table>
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
import BasicService from "@/api/service/BasicService";
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
          status: '',
          type: ''
        },
        dcData: [],
        multipleSelection: [] // 选择的列表
      }
    },
  computed: {
  },
  methods: {
      onSubmit: function() {
        this.page = 1
        this.$refs.form.validate(result => {
        if (result) {
          this.getDcList()
        }
      })
      },
      statusChange: function(status, id, version) {
        // 修改供应商状态
        console.log(status)
        const _this = this
        this.$confirm('此操作将改变物流中心仓库状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (status) {
          BasicService.closeDc(id, version)
          .then((res) => {
            _this.$message.success("禁用成功")
            _this.getDcList()
          })
          .catch((err) => {
            _this.$message.error("禁用失败" + err.message)
            _this.getDcList()
          })
        } else {
          BasicService.openDc(id, version)
          .then((res) => {
            _this.$message.success("启用成功")
            _this.getDcList()
          })
          .catch((err) => {
            _this.$message.error("启用失败" + err.message)
            _this.getDcList()
          })
        }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })         
        });
      },
      clearInput: function() {
        this.form = {
          nameOrCode: '',
          status: '',
          type: ''
        }
      },
      getDcList: function(reset) {
        // 获取配送中心列表
        const _this = this
        const data = {
          page: this.page,
          pageSize: this.pageSize,
          searchCount: true,
          nameOrCodeLike: this.form.nameOrCode,
          statusEquals: this.form.status,
          typeEquals: this.form.type
        }
        BasicService.getWrhQuery(data)
        .then((res) => {
          _this.dcData = []
          console.log(res)
          this.totalCount = res.totalCount
          for (const item in res.records) {
            // 处理供应商数据
            const obj = {
              id: res.records[item].id,
              code: res.records[item].code,
              name: res.records[item].name,
              type: res.records[item].type,
              status: res.records[item].status,
              shortName: res.records[item].shortName,
              version: res.records[item].version
            }
            if (obj.status === "ON") {
              obj.status = true
            } else {
              obj.status = false
            }
            _this.dcData.push(obj)
          }
        })
        .catch((err) => {
          this.$message.error('获取配送中心列表失败' + err.message)
        })
      },
      handleCurrentChange: function(e) {
        this.page = Number(e)
        this.getDcList(true)
      },
      handleSizeChange: function(e) {
        this.pageSize = Number(e)
        this.page = 1
        this.getDcList(true)
      },
      allSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      }
  },
  created() {
    this.getDcList()
  },
  beforeRouteEnter(to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.getDcList();
      })
    },
  filters: {
    dcType(type) {
      switch (type) {
        case "CENTER":
          return "中心仓"
        case "FRONT":
          return "网格仓"
        default:
          return '未知';
      }
    },
    dcStatus(status) {
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
