<template>
  <base-list>
    <div slot="header">
      <el-form ref="qryForm" :model="qryForm" label-width="80px">
        <el-form-item label="appid" prop="appidEquals">
          <el-input v-model="qryForm.appidEquals" placeholder="请输入APPID" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="账户名称" prop="nameLike">
          <el-input v-model="qryForm.nameLike" placeholder="请输入账户名称" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="商户ID" prop="mchIdEquals">
          <el-input v-model="qryForm.mchIdEquals" placeholder="请输入商户ID" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery">搜索</el-button>
          <el-button @click="resetForm('qryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div slot="body">
      <el-row v-if="hasPermission(PermIds.WXA_ACCOUNT_CREATE)">
        <router-link to="/sys/acountIndex/createAcount">
          <el-button type="primary" icon="el-icon-plus">新增</el-button>
        </router-link>
      </el-row>

      <el-table :data="pageData.records" style="width: 100%" v-loading="listLoading" @selection-change="handleSelectionChange">
        <el-table-column prop="id" type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="appid" label="appid"></el-table-column>
        <el-table-column prop="asDefault" label="是否默认小程序">
          <template slot-scope="scope">{{scope.row.asDefault | filtBoolean}}</template>
        </el-table-column>
        <el-table-column prop="mchId" label="商户号"></el-table-column>
        <el-table-column label="操作" width="300" align="center" header-align="center">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)" v-if="hasPermission(PermIds.WXA_ACCOUNT_UPDATE)">编辑</el-button>
            <el-button size="small" type="text" @click="handleDelete(scope.row)" v-if="hasPermission(PermIds.WXA_ACCOUNT_DELETE)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <page-bar :page-data="pageData" @onreload="reload"></page-bar>
    </div>
  </base-list>
</template>

<script>
import BaseList from "@/components/bill/baseList.vue";
import pageBar from "@/components/pagebar.vue";
import WxaService from "@/api/service/WxaService";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  components: {
    "page-bar": pageBar,
    "base-list": BaseList
  },

  data() {
    return {
      currentRow: {},
      qryForm: {
        appidEquals: "",
        nameLike: "",
        mchIdEquals: ""
      },

      listLoading: false,

      pageData: {
        page: 1,
        pageSize: 10,
        pageCount: 1,
        recordCount: 5,
        records: []
      },

      PermIds: PermIds,
      isOpen: true
    };
  },

  computed: {
    ...mapGetters(["hasPermission", "user"])
  },

  methods: {
    message(type, msg) {
      this.$message({
        type: type,
        message: msg
      });
    },
    onQuery() {
      this.reload();
    },

    /**
     * 重置搜索框
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.onQuery();
    },

    handleSelectionChange(val) {},

    handleEdit(index, row) {
      this.$router.push({
        name: "CreateAcount",
        query: { id: row.id }
      });
    },
    handleDelete(val) {
      this.$confirm("此操作将删除该微信小程序账户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          WxaService.removeAccount(val.id)
            .then(res => {
              this.reload();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * 加载数据
     *
     * @param page 当前页码，默认为1
     * @param pageSize 每页记录数，默认为10
     */
    reload(page = 1, pageSize = 10) {
      WxaService.query(page, pageSize, this.qryForm)
        .then(data => {
          console.log(data, "11111");
          // this.pageData = data;
          this.pageData.records = [];
          this.pageData.page = data.data;
          this.pageData.pageSize = data.pageSize;
          this.pageData.pageCount = data.pageCount;
          this.pageData.recordCount = data.recordCount;
          data.records.forEach(item => {
            this.pageData.records.push(item);
          });
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    }
  },

  created() {
    this.reload();
  },
  mounted() {
    this.reload();
  },
  filters: {
    filtBoolean: function(val) {
      if (val === "true" || val === true) {
        val = "是";
      } else {
        val = "否";
      }
      return val;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-pagination {
  float: right;
  margin-top: 15px;
}
</style>
