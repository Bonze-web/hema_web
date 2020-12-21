<template>
    <div>
        <router-link :to="{ path: '/basicinfo/category/edit', query:{ status: 'create'} }">
            <!-- <span v-if="child.meta&&child.meta.title" :title="child.meta.title">{{child.meta.title}}</span> -->
            <el-button style="float:right;margin:18px 10px" type="primary">新建类别</el-button>
        </router-link>
        
        <div class="select-head">
            <el-form ref="form" style="display:flex" :model="form" label-width="80px" label-position="right">
                <el-form-item label="类别">
                    <el-input type='text' placeholder="请输入类别编号/名称" v-model="form.nameOrCode" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="上级类别">
                    <el-input type='text' placeholder="请输入上级类别编号/名称" v-model="form.parentEquals" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择状态">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="启用" value="enabled"></el-option>
                      <el-option label="禁用" value="disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">立即搜索</el-button>
                    <el-button  @click="clearInput">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="height:20px" />
        <div>
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
                        <router-link style="color:#409EFF" :to="{ path: '/basicinfo/category/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.code }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="anotherName" label="上级类别">
                  <template slot-scope="scope">
                    {{ scope.row.anotherName ? scope.row.anotherName : "<空>" }}
                  </template>
                </el-table-column>
                <el-table-column prop="level" label="级别">
                  <template slot-scope="scope">
                    {{ scope.row.level | categoryLevel }}
                  </template>
                </el-table-column>
                <el-table-column
                fixed="right"
                label="状态"
                width="200">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        active-color="#13ce66"
                        active-text="启用"
                        @change="statusChange(scope.row.status, scope.row.id)"
                        inactive-color="#eee">
                    </el-switch>
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
        mbrInfo: {}, // 卖家详情
        reason: '', // 拒绝理由
        sellerId: '', // 卖家Id
        dialogFormVisible: false, // 填写拒绝理由
        page: 1,
        pageSize: 10,
        totalCount: 0,
        form: {
          nameOrCode: '',
          status: '',
          parentEquals: ''
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
          this.getCateGoryQuery()
        }
      })
      },
      statusChange: function(status, id) {
        // 修改供应商状态
        console.log(status)
        if (!status) {
          BasicService.closeCategory(id)
          .then((res) => {
            this.getCateGoryQuery()
          })
          .catch((err) => {
            this.$message.error("禁用失败" + err)
            this.getCateGoryQuery()
          })
        } else {
          BasicService.openCategory(id)
          .then((res) => {
            this.getCateGoryQuery()
          })
          .catch((err) => {
            this.$message.error("启用失败" + err)
            this.getCateGoryQuery()
          })
        }
      },
      clearInput: function() {
        this.form = {
          nameOrCode: '',
          status: ''
        }
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
          parentIdEquals: this.form.parentEquals
        }
        BasicService.getCateGoryQuery(data)
        .then((res) => {
          _this.suppliersData = []
          console.log(res)
          this.totalCount = res.totalCount
          for (const item in res.records) {
            // 处理商品类别数据
            const obj = {
              id: res.records[item].id,
              code: res.records[item].code,
              name: res.records[item].name,
              status: res.records[item].status,
              sourceType: res.records[item].sourceType,
              level: res.records[item].level
            }
            if (obj.status === "enabled") {
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
        this.getRegistList(true)
      },
      handleSizeChange: function(e) {
        this.pageSize = Number(e)
        this.page = 1
        this.getRegistList(true)
      },
      allSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      }
  },
  created() {
    this.getCateGoryQuery()
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.box-title{
  width: 100px;
  text-align: right;
}
.input-width{
    width: 200px;
}
.select-head{
    background: #fff;
    padding: 15px 0 8px 0;
    border-radius: 12px;
    border: 1px #eee solid;
}
.info-box{
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  margin: 10px;
}
/deep/ .el-table td, .el-table th.is-leaf {
  text-align: center;
}
/deep/ .el-table th, .el-table tr  {
  text-align: center !important;
}
/deep/ .el-dialog{
  width: 600px;
}
</style>
