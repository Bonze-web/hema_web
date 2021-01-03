<template>
    <div class="table-index _table-index">        
        <div class="select-head">
            <el-form ref="form" style="display:flex;flex-wrap:wrap;" :model="form" label-width="100px" label-position="right">
                <el-form-item label="仓库作业单">
                    <!-- 输入仓库作业单的id,方便后面的查找,查找和一开始获取数据的接口是同一个 -->
                    <el-input type='text' placeholder="请输入代码/名称" v-model="form.billNumber" class="input-width"></el-input>
                    <!-- <el-input type='text' placeholder="请输入名称" v-model="form.name" class="input-width"></el-input> -->
                </el-form-item>
                <el-form-item label="所属区域编码">
                    <el-input type='text' placeholder="请输入所属区域编码" v-model="form.blockCode" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="所属网格仓">
                    <el-input type='text' placeholder="请输入所属网格仓" v-model="form.frontDcInfo" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="门店信息">
                    <el-input type='text' placeholder="请输入门店信息" v-model="form.storeInfo" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="仓库信息">
                    <el-input type='text' placeholder="请输入仓库信息" v-model="form.wrhInfo" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="外部单号">
                    <el-input type='text' placeholder="请输入外部单号" v-model="form.sourceSubBillId" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="是否测试单">
                    <el-select v-model="form.status" placeholder="请选择状态">
                      <el-option label="是" :value="true"></el-option>
                      <el-option label="否" :value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择状态">
                    <el-option label="初始" value="INITIAL"></el-option>
                    <el-option label="进行中" value="RUNNING"></el-option>
                    <el-option label="已完成" value="FINISHED"></el-option>
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
            <router-link :to="{ path: '/storageinfo/wharf/add', query:{ status: 'create'} }">
            <!-- <span v-if="child.meta&&child.meta.title" :title="child.meta.title">{{child.meta.title}}</span> -->
            <el-button style="margin:18px 10px" type="primary" size="mini"  v-if="hasPermission(PermIds.WMS_DOCK_CREATE) && workingOrg.type === 'DC'">新建</el-button>
            </router-link>
          </el-row>
            <el-table
                :data="suppliersData"
                style="width: 100%"
            >
                <el-table-column prop="billNumber" label="盘点单号">
                    <template slot-scope="scope">
                        <router-link style="color:#409EFF" :to="{ path: '/storageinfo/wharf/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.billNumber }}111</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="sourceSubBillId" label="外部单号">
                    <template slot-scope="scope">
                        <router-link style="color:#409EFF" :to="{ path: '/storageinfo/wharf/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.sourceSubBillId }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="blockCode" label="所属区块编码">
                   <template slot-scope="scope">
                        {{ scope.row.blockCode }}
                    </template>
                </el-table-column>
                <el-table-column prop="frontDcCode" label="所属网格仓">
                    <template slot-scope="scope">
                        {{ '[' + scope.row.frontDcCode + ']' + scope.row.frontDcName }}
                    </template>
                </el-table-column>
                <el-table-column prop="frontDcCode" label="门店">
                    <template slot-scope="scope">
                        {{ '[' + scope.row.storeCode + ']' + scope.row.storeName }}
                    </template>
                </el-table-column>
                <el-table-column prop="isTest" label="是否测试单">
                    <template slot-scope="scope">
                        {{ scope.row.isTest }}
                    </template>
                </el-table-column>
                <el-table-column prop="wrhCode" label="仓库">
                    <template slot-scope="scope">
                        {{ '[' + scope.row.wrhCode + ']' + scope.row.wrhName }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" >
                  <template slot-scope="scope">
                    {{ scope.row.status | suppliersStatus }}
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
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  data() {
      return {
        PermIds: PermIds,
        suppliersId: '',
        page: 1,
        pageSize: 10,
        totalCount: 0,
        form: {
          billNumber: '',
          blockCode: '',
          status: '',
          distDateEnd: '',
          distDateStart: '',
          frontDcInfo: '',
          isTest: '',
          searchCount: true,
          sourceSubBillId: '',
          storeInfo: '',
          wrhInfo: ''
        },
        suppliersData: [],
        multipleSelection: [] // 选择的列表
      }
  },
  computed: {
       ...mapGetters(["hasPermission", "workingOrg"])
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
      statusChange: function(command) {
      // 修改仓库状态
      const _this = this;
      this.$confirm('此操作将改变仓库作业单状态,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(command);
        if (command[2] === "IDLE") {
          WharfService.openSuppliers(command[0], command[1], command[2])
          .then((res) => {
            console.log(res);
            _this.$message.success("休闲状态修改成功")
            _this.getSuppliersList();
          })
          .catch((err) => {
            if (err === "") {
              _this.$message.success("休闲状态修改成功")
            } else {
              _this.$message.error("休闲状态修改失败" + err.message)
            }
            _this.getSuppliersList();
          })
        } else if (command[2] === "USING") {
            WharfService.openSuppliers(command[0], command[1], command[2])
            .then((res) => {
              _this.$message.success("使用中状态修改成功")
              _this.getSuppliersList();
            }).catch((err) => {
              if (err === "") {
                _this.$message.success("使用中状态修改成功")
              } else {
                _this.$message.error("使用中状态修改失败" + err.message)
              }
              _this.getSuppliersList();
            })
        } else if (command[2] === "STOP") {
          WharfService.openSuppliers(command[0], command[1], command[2])
          .then((res) => {
            _this.$message.success("停用状态修改成功")
            _this.getSuppliersList();
          })
          .catch((err) => {
              if (err === "") {
                _this.$message.success("停用状态修改成功")
              } else {
                _this.$message.error("停用状态修改失败" + err.message)
              }
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
          codeEqOrNameLike: '',
          status: ''
        }
      },
      // 向后台请求数据,这里是查询功能和一开始就调取数据列表
      getSuppliersList: function() {
       // 请求仓库作业单的数据
        const _this = this;    
        // 将当前组件的实例记录起来，这些都是我在data中自己写的数据
        const data = {
          codeEqOrNameLike: this.form.codeEqOrNameLike,
          codeEquals: this.form.codeEqOrNameLike || null,
          page: this.page,
          pageSize: this.pageSize,
          searchCount: true,
          nameLike: this.form.nameOrCode || null,
          statusEquals: this.form.status || null
        }
        // 获取数据,然后将自己组件中的数据发送到后台
        WharfService.getSuppliersList(data)
        .then((res) => {
          // 初始化自己定义的数据
          _this.suppliersData = [];
          // 将总数,赋值给自己定义的变量
          // res = {
          //   records: [{
          //       totalCount: 10,
          //       id: "1341338404906762241",
          //       code: '0001',
          //       name: 'yang',
          //       version: 9999999999999,
          //       usages: ['发货']
          //     }]
          // }
          _this.totalCount = res.totalCount;
          for (var i = 0; i < res.records.length; i++) {
            console.log(i);
            // 数组循环后,将过去到的值,全部放在suppliersData这个数组中,我要模拟数据也要使用这个数组
            const obj = {
              // 仓库作业单的id
              id: res.records[i].id,
              // 代码
              code: res.records[i].code,
              name: res.records[i].name,
              // codeEqOrNameLike: res.records[i].codeEqOrNameLike,
              version: res.records[i].version,
              // 用途
              usages: res.records[i].usages,
              status: res.records[i].status,
              dcId: res.records[i].dcId
            }
            // if (obj.status === "IDLE") {
            //   obj.status = "空闲"
            // } else if (obj.status === "USING") {
            //   obj.status = "使用中"
            // } else if(obj.status === "STOP") {
            //   obj.status = "停用"
            // }
            // 获取数据后,存到自己的数组里面
            _this.suppliersData.push(obj);
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
        case "IDLE":
          return "空闲"
        case "USING":
          return "使用中"
        case "STOP":
          return '停用';
      }
    },
    purposeChange(val) {
      var str = "";
      for (let i = 0; i < val.length; i++) {
        switch (val[i]) {
          case "RECEIVE":
            if (i < val.length - 1) {
              str += "收货,";
              break
            } else {
              str += "收货";
              break
            }
          case "OUT":
            if (i < val.length - 1) {
              str += "出货,";
              break
            } else {
              str += "出货";
              break
            }
          case "RETURN":
            if (i < val.length - 1) {
              str += "退货,";
              break
            } else {
              str += "退货";
              break
            }
        }
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