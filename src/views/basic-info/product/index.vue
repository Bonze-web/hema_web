<template>
  <div class="product-index">
    <div class="select-head">
      <el-form ref="form" style="display:flex" :model="form" label-width="80px" label-position="right">
        <el-form-item label="商品">
          <el-input type="text" placeholder="请输入代码/名称" v-model="form.codeOrNameOrBarcodeLike" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-input type="text" placeholder="请输入代码/名称" v-model="form.categoryCodeOrNameLike" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.statusEquals" placeholder="请选择状态">
            <el-option label="全部" value></el-option>
            <el-option label="启用" value="ON"></el-option>
            <el-option label="禁用" value="OFF"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="mini">立即搜索</el-button>
          <el-button @click="clearInput" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div style="height:20px" />
    <div style="background:#fff">
      <el-row>
        <!-- <router-link :to="{ path: '/basicinfo/product/add', query:{ status: 'create'} }">
          <el-button style="margin:18px 10px" type="primary" size="mini">新建</el-button>
        </router-link>-->
        <el-button style="margin:18px 10px" size="mini" v-if="hasPermission(PermIds.PRODUCT_PRODUCT_ENABLE) && workingOrg.type=== 'GROUP'" @click="batchChangeStatus('ON')">启用</el-button>
        <el-button style="margin:18px 10px" size="mini" v-if="hasPermission(PermIds.PRODUCT_PRODUCT_DISABLE) && workingOrg.type === 'GROUP'" @click="batchChangeStatus('OFF')">禁用</el-button>
      </el-row>
      <el-table :data="productList" style="width: 100%;text-align:center" @selection-change="allSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="code" label="代码">
          <template slot-scope="scope">
            <router-link style="color:#409EFF" :to="{ path: '/basicinfo/product/edit', query:{ status: 'read', id: scope.row.id} }">
              <span>{{ scope.row.code }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="spec" label="规格"></el-table-column>
        <el-table-column prop="categoryName" label="类别"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.status" size="mini" type="text" @click="statusChange(scope.row)" v-if="hasPermission(PermIds.PRODUCT_PRODUCT_ENABLE) && workingOrg.type === 'GROUP'">启用</el-button>
            <el-button :disabled="!scope.row.status" size="mini" type="text" @click="statusChange(scope.row)" v-if="hasPermission(PermIds.PRODUCT_PRODUCT_DISABLE) && workingOrg.type === 'GROUP'">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="height20"></div>

      <el-pagination style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>
  </div>
</template>

<script>
import ProductService from "@/api/service/ProductService";
import { mapGetters } from "vuex";
import PermIds from "@/api/permissionIds";

export default {
  data() {
    return {
      PermIds: PermIds,
      suppliersId: "",
      page: 1,
      pageSize: 10,
      totalCount: 0,
      form: {
        codeOrNameOrBarcodeLike: "",
        categoryCodeOrNameLike: "",
        statusEquals: ""
      },
      productList: [],
      multipleSelection: [] // 选择的列表
    };
  },
  computed: {
    ...mapGetters(["hasPermission", "workingOrg"])
  },
  methods: {
    onSubmit: function() {
      this.page = 1;
      this.$refs.form.validate(result => {
        if (result) {
          this.queryProduct();
        }
      });
    },
    batchChangeStatus: function(type = "ON") {
      var ids = [];
      this.multipleSelection.forEach(ele => {
        ids.push(ele.id);
      });
      this.$confirm("此操作将改变商品状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (type === "OFF") {
            ProductService.batchOff(ids)
              .then(res => {
                this.$message.success("禁用成功");
                this.queryProduct();
              })
              .catch(err => {
                this.$message.error("禁用失败" + err.message);
                this.queryProduct();
              });
          } else {
            ProductService.batchOn(ids)
              .then(res => {
                this.$message.success("启用成功");
                this.queryProduct();
              })
              .catch(err => {
                this.$message.error("启用失败" + err.message);
                this.queryProduct();
              });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    statusChange: function(val) {
      this.$confirm("此操作将改变商品状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const id = val.id;
          if (val.status) {
            ProductService.off(id)
              .then(res => {
                this.$message.success("禁用成功");
                this.queryProduct();
              })
              .catch(err => {
                this.$message.error("禁用失败" + err.message);
                this.queryProduct();
              });
          } else {
            ProductService.on(id)
              .then(res => {
                this.$message.success("启用成功");
                this.queryProduct();
              })
              .catch(err => {
                this.$message.error("启用失败" + err.message);
                this.queryProduct();
              });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    clearInput: function() {
      this.form = {
        codeOrNameOrBarcodeLike: "",
        categoryCodeOrNameLike: "",
        statusEquals: ""
      };
    },
    queryProduct: function(reset) {
      // 获取供应商列表
      window.addEventListener("pageshow", this.onShow);
      const _this = this;
      const opts = {
        categoryCodeOrNameLike: this.form.categoryCodeOrNameLike,
        codeOrNameOrBarcodeLike: this.form.codeOrNameOrBarcodeLike,
        statusEquals: this.form.statusEquals
      };
      ProductService.query(this.page, this.pageSize, opts).then(res => {
        _this.productList = [];
        this.totalCount = res.totalCount;
        if (res.records.length > 0) {
          res.records.forEach(item => {
            const obj = {
              ...item
            };
            if (item.status === "ON") {
              obj.status = true;
            } else {
              obj.status = false;
            }
            _this.productList.push(obj);
          });
        }
      });
    },
    handleCurrentChange: function(e) {
      this.page = Number(e);
      this.queryProduct(true);
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e);
      this.page = 1;
      this.queryProduct(true);
    },
    allSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    }
  },
  created() {
    this.queryProduct();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.queryProduct();
    });
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case true:
          return "启用";
        case false:
          return "禁用";
        default:
          return "未知";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.product-index {
  @include elTable;
  .height20 {
    height: 20px;
  }
}
</style>
<style lang="scss">
.product-index {
  @import "src/styles/mixin.scss";
  @include elTable;
  .el-table tr,
  .el-table th {
    height: 32px !important;
    // line-height: 32px !important;
  }
}
</style>