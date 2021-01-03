<template>
    <div class="table-index _table-index">        
        <div class="select-head">
            <el-form ref="form" style="display:flex;flex-wrap:wrap" :model="form" label-width="110px" label-position="right">
                <el-form-item label="用户">
                    <el-input type='text' placeholder="请输入代码/名称" v-model="form.usernameLikes" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="主要拣货分区">
                    <el-input type='text' placeholder="请输入代码/名称" v-model="form.firstCodeOrNameLikes" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="辅助拣货分区">
                    <el-input type='text' placeholder="请输入代码/名称" v-model="form.secondCodeOrNameLikes" class="input-width"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
                    <el-button size="mini"  @click="clearInput">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="height:20px" />
        <div style="background:#fff">
          <el-row>
            <router-link :to="{ path: '/storageinfo/personnelbind/add', query:{ status: 'create', addData : addData} }">
              <!-- <span v-if="child.meta&&child.meta.title" :title="child.meta.title">{{child.meta.title}}</span> -->
              <el-button style="margin:18px 10px" type="primary" size="mini" v-if="hasPermission(PermIds.WMS_USER_PICKAREA_CREATE) && workingOrg.type === 'DC'">新建</el-button>
            </router-link>
            <el-button style="margin:18px 10px" type="primary" size="mini" @click="dailyRecord = true">工作日志</el-button>
          </el-row>
          <el-table
              :data="suppliersData"
              style="width: 100%;text-align:center"
          >
              <!-- <el-table-column
                  type="selection"
                  width="55">
              </el-table-column> -->
              <el-table-column prop="code" label="用户代码">
                  <template slot-scope="scope">
                      <span>{{ scope.row.userId }}</span>
                  </template>
              </el-table-column>
              <el-table-column prop="username" label="用户姓名">
                <template slot-scope="scope">
                      {{ scope.row.username}}
                  </template>
              </el-table-column>
              <el-table-column label="主要拣货分区">
                  <template slot-scope="scope">
                      {{ '[' + scope.row.firstPickareaCode + ']' + scope.row.firstPickareaName}}
                  </template>
              </el-table-column>
              <el-table-column label="主要拣货范围">
                  <template slot-scope="scope">
                      {{ scope.row.firstBinscope }}
                  </template>
              </el-table-column>
              <el-table-column label="辅助拣货分区">
                  <template slot-scope="scope">
                      {{ '[' + scope.row.secondPickareaCode + ']' + scope.row.secondPickareaName }}
                  </template>
              </el-table-column>
              <el-table-column label="辅助拣货范围">
                  <template slot-scope="scope">
                      {{ scope.row.secondBinscope }}
                  </template>
              </el-table-column>
              <el-table-column label="首选拣货任务类型">
                  <template slot-scope="scope">
                      {{ scope.row.firstTaskType | stockTypeChange }}
                  </template>
              </el-table-column>
              <el-table-column
              label="操作"
              v-if="hasPermission(PermIds.WMS_USER_PICKAREA_UPDATE) && workingOrg.type === 'DC'"
              >
                <template slot-scope="scope">
                    <!-- <div style="color:#409EFF;cursor:pointer" @click="deleteChange(scope.row.id, scope.row.version)">编辑</div>
                    <div style="color:#409EFF;cursor:pointer" @click="deleteChange(scope.row.id, scope.row.version)">删除</div> -->
                  <el-button size="mini" type="text" v-if="hasPermission(PermIds.WMS_USER_PICKAREA_UPDATE)" @click="editChange(scope.row.id)">编辑</el-button>
                  <el-button size="mini" type="text" v-if="hasPermission(PermIds.WMS_USER_PICKAREA_DELETE)" @click="deleteChange(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
              <!-- <el-table-column
              label="编辑">
                <template slot-scope="scope">
                    <router-link :to="{ path: '/storageinfo/wharf/edit', query:{ status: 'edit', id: scope.row.id} }">
                          <el-button size="mini" type="text">编辑</el-button>
                    </router-link>
                </template>
              </el-table-column> -->
          </el-table>
          <!-- 下面这个是翻页 -->
          <el-pagination
              style="float:right:padding-bottom:10px;"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="1"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount">
          </el-pagination>
        </div>
        <el-dialog title="工作日志" :visible.sync="dailyRecord" class="shuttle-box" style="margin-top: 7vh">
          <system-log :modular="'USER_PICKAREA'"></system-log>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dailyRecord = false">取 消</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
// 引入公共模块
import PersonnelbindService from "@/api/service/PersonnelbindService";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";
import systemLog from "@/components/systemLog.vue"

export default {
  data() {
      return {
        dailyRecord: false,
        PermIds: PermIds,
        suppliersId: '',
        page: 1,
        pageSize: 10,
        totalCount: 0,
        form: {
          usernameLikes: '',
          firstCodeOrNameLikes: '',
          secondCodeOrNameLikes: '',
          searchCount: true
        },
        suppliersData: [],
        multipleSelection: [], // 选择的列表
        addData: []
      }
  },
  computed: {
    ...mapGetters(["hasPermission", "workingOrg"])
  },
  methods: {
      editChange(id) {
        const arr = JSON.stringify(this.suppliersData);
        this.$router.push({name: 'PersonnelbindEdit', query: {id: id, editData: encodeURIComponent(arr)}});
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
              PersonnelbindService.deleteData(id)
              .then((res) => {
                _this.$message.success("删除成功")
                _this.getSuppliersList();
              }).catch((err) => {
                console.log(err);
                if (err === "") {
                  _this.$message.success("删除成功")
                } else {
                  _this.$message.error("删除失败" + err.message)
                }
                _this.getSuppliersList();
              })
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
            this.getSuppliersList()
          }
        })
      },
      clearInput: function() {
        this.form = {
          usernameLikes: '',
          firstCodeOrNameLikes: '',
          secondCodeOrNameLikes: '',
          searchCount: true
        }
      },
      // 向后台请求数据,这里是查询功能和一开始就调取数据列表
      getSuppliersList: function(reset) {
        // 请求码头的数据
        const _this = this;    
        // 将当前组件的实例记录起来，这些都是我在data中自己写的数据
        this.form.page = this.page;
        this.form.pageSize = this.pageSize;
        // 获取数据,然后将自己组件中的数据发送到后台
        PersonnelbindService.getSuppliersList(this.form)
        .then((res) => {
          // 初始化自己定义的数据
          _this.suppliersData = res.records;
          _this.totalCount = res.totalCount;
          _this.addData = encodeURIComponent(JSON.stringify(_this.suppliersData));
        })
        .catch((err) => {
          if (err) _this.$message.error("获取信息失败" + err.message)
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
  components: {
    "system-log": systemLog
  },
  created() {
    this.getSuppliersList();
  },
  filters: {
    stockTypeChange(type) {
      switch (type) {
        case "CASE":
          return "整箱"
        case "SPLIT":
          return "拆零"
      }
    },
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
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getSuppliersList();
    })
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.shuttle-box {
  margin-top: -10vh !important;
  /deep/ .el-dialog {
    min-width: 700px;
    width: 70%;
  }
}
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
