<template>
    <div class="table-index">        
        <div class="select-head">
            <el-form ref="form" style="display:flex" :model="form" label-width="80px" label-position="right">
                <el-form-item label="类别">
                    <el-input type='text' clearable placeholder="请输入类别编号/名称" v-model="form.nameOrCode" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="上级类别">
                    <el-input type='text' clearable placeholder="请输入上级类别编号/名称" v-model="form.parentCodeEqualsOrNameLike" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择状态">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="启用" value="ON"></el-option>
                      <el-option label="禁用" value="OFF"></el-option>
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
            <router-link :to="{ path: '/basicinfo/category/add', query:{ status: 'create'} }">
                <!-- <span v-if="child.meta&&child.meta.title" :title="child.meta.title">{{child.meta.title}}</span> -->
                <el-button style="margin:18px 10px" type="primary" size="mini" v-if="hasPermission(PermIds.PRODUCT_CATEGORY_CREATE)">新建</el-button>
            </router-link>
          </el-row>
            <el-table
                :data="suppliersData"
                style="width: 100%;text-align:center"
                :row-style="{height: '16px',padding: '-4px'}"
            >
                <!-- <el-table-column
                    type="selection"
                    width="55">
                </el-table-column> -->
                <el-table-column prop="code" label="代码">
                    <template slot-scope="scope">
                        <router-link style="color:#409EFF" :to="{ path: '/basicinfo/category/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.code }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="anotherName" label="上级类别">
                  <template slot-scope="scope">
                    {{ scope.row.parentName ? '[' + scope.row.parentCode + ']' + scope.row.parentName : "&lt;空&gt;" }}
                  </template>
                </el-table-column>
                <el-table-column prop="level" label="级别">
                  <template slot-scope="scope">
                    {{ scope.row.level | categoryLevel }}
                  </template>
                </el-table-column>
                <el-table-column prop="anotherName" label="状态">
                  <template slot-scope="scope">
                    {{ scope.row.status | categoryStatus }}
                  </template>
                </el-table-column>
                <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button v-if="!scope.row.status" :disabled="!hasPermission(PermIds.PRODUCT_CATEGORY_ENABLE)" size="mini" type="text" @click="statusChange(scope.row.status, scope.row.id, scope.row.version)">启用</el-button>
                  <el-button v-if="scope.row.status" :disabled="!hasPermission(PermIds.PRODUCT_CATEGORY_DISABLE)" size="mini" type="text" @click="statusChange(scope.row.status, scope.row.id, scope.row.version)">禁用</el-button>
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
          nameOrCode: '',
          status: 'ON',
          parentCodeEqualsOrNameLike: ''
        },
        suppliersData: [],
        multipleSelection: [] // 选择的列表
      }
    },
  computed: {
    ...mapGetters(["hasPermission"])
  },
  methods: {
      onSubmit: function() {
        this.page = 1
        this.$refs.form.validate(result => {
        if (result) {
          this.getCateGoryQuery()
        }
      })
      },
      statusChange: function(status, id, version) {
        // 修改供应商状态
        this.$confirm('此操作将改变商品类别状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (status) {
          BasicService.closeCategory(id, version)
          .then((res) => {
            this.$message.success("禁用成功")
            this.getCateGoryQuery()
          })
          .catch((err) => {
            this.$message.error("禁用失败" + err.message)
            this.getCateGoryQuery()
          })
        } else {
          BasicService.openCategory(id, version)
          .then((res) => {
            this.$message.success("启用成功")
            this.getCateGoryQuery()
          })
          .catch((err) => {
            this.$message.error("启用失败" + err.message)
            this.getCateGoryQuery()
          })
        }
        })
      },
      clearInput: function() {
        this.form = {
          nameOrCode: '',
          status: 'ON'
        }
        this.getCateGoryQuery()
      },
      getCateGoryQuery: function(reset) {
        // 获取供应商列表
        const _this = this
        const data = {
          page: this.page,
          pageSize: this.pageSize,
          searchCount: true,
          codeOrNameLike: this.form.nameOrCode,
          statusEquals: this.form.status,
          parentCodeEqualsOrNameLike: this.form.parentCodeEqualsOrNameLike
        }
        BasicService.getCateGoryQuery(data)
        .then((res) => {
          _this.suppliersData = []
          console.log(res)
          _this.totalCount = res.totalCount
          for (const item in res.records) {
            // 处理商品类别数据
            const obj = {
              id: res.records[item].id,
              code: res.records[item].code,
              name: res.records[item].name,
              status: res.records[item].status,
              sourceType: res.records[item].sourceType,
              level: res.records[item].level,
              parentName: res.records[item].parentName,
              parentCode: res.records[item].parentCode
            }
            if (obj.status === "ON") {
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
        this.getCateGoryQuery()
      },
      handleSizeChange: function(e) {
        this.pageSize = Number(e)
        this.page = 1
        this.getCateGoryQuery()
      },
      allSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      }
  },
  created() {
    this.getCateGoryQuery()
  },
  beforeRouteEnter(to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.getCateGoryQuery(0);
      })
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
    categoryLevel(level) {
      switch (level) {
        case "one":
          return "一级"
        case "two":
          return "二级"
        case "three":
          return "三级"
        case "four":
          return "四级"
        default:
          return '未知';
      }
    },
    categoryStatus(status) {
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