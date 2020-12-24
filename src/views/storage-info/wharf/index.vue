<template>
    <div class="table-index">        
        <div class="select-head">
            <el-form ref="form" style="display:flex" :model="form" label-width="60px" label-position="right">
                <el-form-item label="码头">
                    <!-- 输入码头的id,方便后面的查找,查找和一开始获取数据的接口是同一个 -->
                    <el-input type='text' placeholder="请输入代码/名称" v-model="form.codeEqOrNameLike" class="input-width"></el-input>
                    <!-- <el-input type='text' placeholder="请输入名称" v-model="form.name" class="input-width"></el-input> -->
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择状态">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="空闲" value="IDLE"></el-option>
                    <el-option label="使用中" value="USING"></el-option>
                    <el-option label="停用" value="STOP"></el-option>
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
            <el-button style="margin:18px 10px" type="primary" size="mini">新建</el-button>
            </router-link>
          </el-row>
            <el-table
                :data="suppliersData"
                style="width: 100%"
            >
                <!-- <el-table-column
                    type="selection"
                    width="55">
                </el-table-column> -->
                <el-table-column prop="code" label="代码">
                    <template slot-scope="scope">
                        <router-link style="color:#409EFF" :to="{ path: '/storageinfo/wharf/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.code }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="usages" label="用途">
                    <template slot-scope="scope">
                        {{ scope.row.usages | purposeChange}}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" >
                  <template slot-scope="scope">
                    <!-- {{scope.row.status}} -->
                    {{ scope.row.status | suppliersStatus }}
                  </template>
                </el-table-column>
                <el-table-column
                label="操作">
                  <template slot-scope="scope">
                    <!-- <div class="status-chnage-box">
                        <el-button size="mini" type="text" @click="statusChange(scope.row.status, scope.row.id, scope.row.version)">修改状态</el-button>
                        
                    </div> -->
                    
                    <!-- <el-button :disabled="scope.row.status" size="mini" type="text" @click="statusChange(scope.row.status, scope.row.id, scope.row.version)">休闲</el-button>
                    <el-button :disabled="!scope.row.status" size="mini" type="text" @click="statusChange(scope.row.status, scope.row.id, scope.row.version)">使用中</el-button>
                    <el-button :disabled="!scope.row.status" size="mini" type="text" @click="statusChange(scope.row.status, scope.row.id, scope.row.version)">停用</el-button> -->
                    <el-dropdown :hide-on-click="true" trigger="click" @command="statusChange" placement="bottom">
                      <span class="el-dropdown-link" style="color:#409EFF; font-size:12px;padding:7px 0;">
                        设置状态
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :disabled="scope.row.status=='IDLE'" :command="[scope.row.id, scope.row.version, 'IDLE']">休闲</el-dropdown-item>
                        <el-dropdown-item :disabled="scope.row.status=='USING'" :command="[scope.row.id, scope.row.version, 'USING']">使用中</el-dropdown-item>
                        <el-dropdown-item :disabled="scope.row.status=='STOP'" :command="[scope.row.id, scope.row.version, 'STOP']">停用</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
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
          // code: '',
          // name: '',
          codeEqOrNameLike: '',
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
      statusChange: function(command) {
      // 修改仓库状态
      const _this = this;
      this.$confirm('此操作将改变码头状态,是否继续?', '提示', {
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
              _this.$message.error("休闲状态修改失败" + err)
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
                _this.$message.error("使用中状态修改失败" + err)
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
                _this.$message.error("停用状态修改失败" + err)
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
       // 请求码头的数据
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
          console.log(res.records);
          for (var i = 0; i < res.records.length; i++) {
            console.log(i);
            // 数组循环后,将过去到的值,全部放在suppliersData这个数组中,我要模拟数据也要使用这个数组
            const obj = {
              // 码头的id
              id: res.records[i].id,
              // 代码
              code: res.records[i].code,
              name: res.records[i].name,
              // codeEqOrNameLike: res.records[i].codeEqOrNameLike,
              version: res.records[i].version,
              // 用途
              usages: res.records[i].usages,
              status: res.records[i].status
              
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
  }
};
</script>

<style lang="scss" scoped>
// @import "src/styles/mixin.scss";
// /deep/ .el-table .cell{
//       line-height: 32px !important;
// }
.table-index .el-table .cell {
  padding:  7px 0;
}
</style>
<style lang="scss">
.table-index{
@import "src/styles/mixin.scss";
@include elTable;
}

</style>
