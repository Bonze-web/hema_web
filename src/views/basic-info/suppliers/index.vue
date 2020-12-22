<template>
    <div class="table-index">        
        <div class="select-head">
            <el-form ref="form" style="display:flex" :model="form" label-width="60px" label-position="right">
                <el-form-item label="供应商">
                    <el-input type='text' placeholder="请输入供应商编号/名称" v-model="form.nameOrCode" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择状态">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="启用" value="OPEN"></el-option>
                    <el-option label="禁用" value="COLOSED"></el-option>
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
            <router-link :to="{ path: '/basicinfo/suppliers/edit', query:{ status: 'create'} }">
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
                        <router-link style="color:#409EFF" :to="{ path: '/basicinfo/suppliers/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.code }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="anotherName" label="简称"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column prop="sourceType" label="来源方式" >
                  <template slot-scope="scope">
                    {{ scope.row.sourceType | sourceType }}
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
          status: ''
        },
        suppliersData: [],
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
          this.getSuppliersList()
        }
      })
      },
      statusChange: function(status, id, version) {
        // 修改供应商状态
        this.$confirm('此操作将改变供应商状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (status) {
          BasicService.closeSuppliers(id, version)
          .then((res) => {
            this.$message.success("禁用成功")
            this.getSuppliersList()
          })
          .catch((err) => {
            this.$message.error("禁用失败" + err.message)
            this.getSuppliersList()
          })
        } else {
          BasicService.openSuppliers(id, version)
          .then((res) => {
            this.$message.success("启用成功")
            this.getSuppliersList()
          })
          .catch((err) => {
            this.$message.error("启用失败" + err.message)
            this.getSuppliersList()
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
          nameOrCode: '',
          status: ''
        }
      },
      getSuppliersList: function(reset) {
        // 获取供应商列表
        const _this = this
        const data = {
          page: this.page,
          pageSize: this.pageSize,
          searchCount: true,
          codeOrNameEquals: this.form.nameOrCode,
          status: this.form.status
        }
        BasicService.getSuppliersList(data)
        .then((res) => {
          _this.suppliersData = []
          console.log(res)
          this.totalCount = res.totalCount
          for (const item in res.records) {
            // 处理供应商数据
            const obj = {
              id: res.records[item].id,
              code: res.records[item].code,
              name: res.records[item].name,
              anotherName: res.records[item].anotherName,
              status: res.records[item].status,
              address: res.records[item].address,
              sourceType: res.records[item].sourceType,
              version: res.records[item].version
            }
            if (obj.status === "OPEN") {
              obj.status = true
            } else {
              obj.status = false
            }
            _this.suppliersData.push(obj)
          }
        })
      },
      handleCurrentChange: function(e) {
        this.page = Number(e)
        this.getSuppliersList(true)
      },
      handleSizeChange: function(e) {
        this.pageSize = Number(e)
        this.page = 1
        this.getSuppliersList(true)
      },
      allSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      }
  },
  created() {
    this.getSuppliersList()
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
