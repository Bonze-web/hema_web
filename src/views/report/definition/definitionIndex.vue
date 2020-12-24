<template>
  <base-list>
    <div slot="header">
      <el-form ref="qryForm" label-position="right" :model="qryForm" label-width="80px" class="qry-form">
        <el-form-item label="报表名称:" prop="nameLikes">
          <el-input v-model="qryForm.nameLikes" placeholder="请输入报表名称，支持模糊匹配"></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="stateIn">
          <el-checkbox-group v-model="qryForm.stateIn">
            <el-checkbox v-for="item in reportStates" :key="item.value" :name="item.value" :label="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery">搜索</el-button>
          <el-button @click="resetForm('qryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div slot="body">
      <router-link to="/report/designer/add" v-if="hasPermission(PermIds.REPORT_DEFINITION_CREATE)">
        <el-button type="primary" icon="el-icon-plus">新增</el-button>
      </router-link>

      <el-table ref="msgTplConfigTable" :data="pageData.records" :model="pageData">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="报表名称" width="200"></el-table-column>
        <el-table-column prop="state" label="状态" width="100">
          <template slot-scope="scope">{{scope.row.state | filtStatus}}</template>
        </el-table-column>
        <el-table-column prop="pageable" label="是否支持分页" width="100">
          <template slot-scope="scope">{{scope.row.pageable | filtBoolean}}</template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="150"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="opt" fixed="right" label="操作" width="170">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleEdit(scope.row.id)" v-if="hasPermission(PermIds.REPORT_DEFINITION_UPDATE)">编辑</el-button>
            <el-button size="small" type="text" @click="handleDisable(scope.row.id)" v-if="scope.row.state == 'ONLINE' && hasPermission(PermIds.REPORT_DEFINITION_OFFLINE)">禁用</el-button>
            <el-button size="small" type="text" @click="handleEnable(scope.row.id)" v-if="scope.row.state == 'OFFLINE' && hasPermission(PermIds.REPORT_DEFINITION_ONLINE)">启用</el-button>
            <!-- <el-button size="small" type="text" @click="handleEdit(scope.row.id)" v-if="scope.row.state != 'OFFLINE'">查看</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <page-bar :page-data="pageData" @onreload="reload"></page-bar>
    </div>
  </base-list>
</template>

<script>
import BaseModule from "@/utils/baseModule";
import BaseList from "@/components/bill/baseList.vue";
import PageBar from "@/components/pagebar.vue";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";
import ReportService from "@/api/service/ReportService";

export default {
  extends: BaseModule,

  components: {
    "page-bar": PageBar,
    "base-list": BaseList
  },

  data: function() {
    return {
      qryForm: {
        nameLikes: "",
        stateIn: ["ONLINE", "OFFLINE"]
      },
      reportStates: [
        {
          value: "OFFLINE",
          label: "未提交"
        },
        {
          value: "ONLINE",
          label: "已提交"
        }
      ],
      pageData: {
        page: 1,
        pageSize: 10,
        pageCount: 1,
        recordCount: 5,
        records: []
      },
      currentRow: null,
      PermIds: PermIds
    };
  },

  computed: {
    ...mapGetters(["hasPermission", "workingOrg"])
  },

  filters: {
    filtStatus(val) {
      if (val === "ONLINE") {
        val = "已提交";
      } else if (val === "OFFLINE") {
        val = "未提交";
      }
      return val;
    },
    filtBoolean: function(val) {
      let res = "";
      if (val === true) {
        res = "是";
      } else if (val === false) {
        res = "否";
      }
      return res;
    }
  },

  methods: {
    /* 查看报表 */
    handleEdit(id) {
      this.$router.push({
        name: "ReportAdd",
        query: {
          id: id
        }
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

    /**
     * 作废促销单
     */
    onAbolish(id) {
      this.$confirm("是否确认作废促销单?", "提示", {
        type: "warning"
      });
    },

    /**
     * 启用报表
     */
    handleEnable(id) {
      const self = this;
      this.$confirm("是否要启用报表?", "提示", {
        type: "warning"
      })
        .then(() => {
          ReportService.online(id)
            .then(() => {
              self.$message({
                message: "操作成功！",
                type: "success"
              });
              self.reload();
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(err => {
          if (err !== "cancel") {
            this.$message.error(err.message);
          }
        });
    },
    /** 禁用报表 */
    handleDisable(id) {
      const self = this;
      this.$confirm("是否确认禁用报表?", "提示", {
        type: "warning"
      })
        .then(() => {
          ReportService.offline(id)
            .then(() => {
              self.$message({
                message: "操作成功！",
                type: "success"
              });
              self.reload();
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(err => {
          if (err !== "cancel") {
            this.$message.error(err.message);
          }
        });
    },
    /**
     * 加载促销单列表
     */
    reload(page = 1, pageSize = 10) {
      const opts = {
        ...this.qryForm
      };
      ReportService.query(page, pageSize, opts)
        .then(res => {
          this.pageData = res;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  },

  created() {
    this.reload();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.qry-form {
  max-width: 500px;
}
.el-pagination {
  float: right;
  margin-top: 15px;
}
.toolbar {
  margin: 10px 0;
}
</style>
