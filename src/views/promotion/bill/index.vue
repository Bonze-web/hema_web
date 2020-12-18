<template>
  <base-list>
    <div slot="header">
      <el-form ref="qryForm" label-position="right" :model="qryForm" label-width="80px" class="qry-form">
        <el-form-item label="主题:" prop="subjectLike">
          <el-input v-model="qryForm.subjectLike" placeholder="请输入主题，支持模糊匹配"></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="stateIn">
          <el-checkbox-group v-model="qryForm.stateIn">
            <el-checkbox v-for="item in billStates" :key="item.value" :name="item.value" :label="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery">搜索</el-button>
          <el-button @click="resetForm('qryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div slot="body">
      <router-link to="/promotion/bill/add" v-if="hasPermission(PermIds.PROMOTION_BILL_CREATE)">
        <el-button type="primary" icon="el-icon-plus">新增</el-button>
      </router-link>

      <el-table ref="msgTplConfigTable" :data="pageData.records" :model="pageData">
        <el-table-column type="index" width="50">
        </el-table-column>

        <el-table-column prop="subject" label="主题" width="200">
        </el-table-column>

        <el-table-column prop="state" label="状态" width="100">
          <template slot-scope="scope">
            {{scope.row.state | formatState}}
          </template>
        </el-table-column>

        <el-table-column label="生效时间" width="195">
          <template slot-scope="scope">
            <span v-html="$options.filters.getTimeRange(scope.row)"></span>
          </template>
        </el-table-column>

        <el-table-column label="生效门店">
          <template slot-scope="scope">
            <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
              {{scope.row | getStores}}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="更新时间" width="150">
          <template slot-scope="scope">
            {{scope.row.updateTime | simpleDateTime}}
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" width="200">
        </el-table-column>

        <el-table-column prop="opt" fixed="right" label="操作" width="170">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="onEdit(scope.row.id)" v-if="scope.row.state == 'unsubmit' && hasPermission(PermIds.PROMOTION_BILL_UPDATE)">编辑</el-button>
            <el-button size="small" type="text" @click="onDelete(scope.row.id)" v-if="scope.row.state == 'unsubmit' && hasPermission(PermIds.PROMOTION_BILL_REMOVE)">删除</el-button>
            <el-button size="small" type="text" @click="onSubmit(scope.row.id)" v-if="scope.row.state == 'unsubmit' && hasPermission(PermIds.PROMOTION_BILL_SUBMIT)">提交</el-button>
            <el-button size="small" type="text" @click="onView(scope.row.id)" v-if="scope.row.state != 'unsubmit'">查看</el-button>
            <el-button size="small" type="text" @click="onCopy(scope.row.id)" v-if="hasPermission(PermIds.PROMOTION_BILL_CREATE)">复制</el-button>
            <el-button size="small" type="text" @click="onAbolish(scope.row.id)" v-if="scope.row.state == 'submit' && hasPermission(PermIds.PROMOTION_BILL_ABOLISH)">作废</el-button>
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
import * as Utils from "@/utils/index";
import * as DateUtil from "@/utils/dateUtil";
import * as BillUtils from "../utils/billUtils";
import PromotionService from "../service/service";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  extends: BaseModule,

  components: {
    "page-bar": PageBar,
    "base-list": BaseList
  },

  data: function() {
    return {
      qryForm: {
        subjectLike: "",
        stateIn: ["unsubmit", "submit"],
        orderField: "updateTime",
        orderDirection: "desc"
      },
      pageData: {
        page: 1,
        pageSize: 10,
        pageCount: 1,
        recordCount: 5,
        records: []
      },
      currentRow: null,
      billStates: BillUtils.BILL_STATES,
      PermIds: PermIds
    };
  },

  computed: {
    ...mapGetters(["hasPermission", "workingOrg"])
  },

  filters: {
    /**
     * 获取生效时间
     */
    getTimeRange(bill) {
      var trc = bill.precondition.conditions[0];
      var fmt = function(v) {
        return v ? DateUtil.formatDate(new Date(v)) : "";
      };
      var begin_str = fmt(trc.begin);
      var end_str = fmt(trc.end);
      return begin_str + (end_str ? "<br>~<br>" + end_str : "");
    },

    /**
     * 获取生效门店
     */
    getStores(bill) {
      var stores = bill.precondition.conditions[1].conditions[0].stores;
      if (stores.length <= 0) {
        return "<空>";
      }
      return stores
        .map(function(item) {
          return item.name;
        })
        .join(",");
    },

    /**
     * 获取生效业态
     */
    getBusiness(bill) {
      var business = bill.precondition.conditions[1].conditions[1].business;
      if (business.length <= 0) {
        return "<空>";
      }
      return business
        .map(function(item) {
          return item.name;
        })
        .join(",");
    },

    /**
     * 格式化单据状态
     */
    formatState(stateValue) {
      var state = BillUtils.BILL_STATES.find(st => st.value === stateValue);
      return state ? state.label : "未知";
    }
  },

  methods: {
    onEdit(id) {
      this.$router.push({
        name: "PromotionBillEdit",
        query: {
          id: id
        }
      });
    },

    onView(id) {
      this.$router.push({
        name: "PromotionBillView",
        query: {
          id: id
        }
      });
    },

    onDelete(id) {
      var self = this;
      this.$confirm("是否确认删除促销单?", "提示", {
        type: "warning"
      })
        .then(() => {
          return PromotionService.removeBillById(id);
        })
        .then(data => {
          self.reload();
          self.$message({
            message: "操作成功！",
            type: "success"
          });
        })
        .catch(err => {
          if (err !== "cancel") {
            Utils.showError(err);
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
      var self = this;
      this.$confirm("是否确认作废促销单?", "提示", {
        type: "warning"
      })
        .then(() => {
          return PromotionService.abolishBill(id);
        })
        .then(data => {
          self.reload();
          self.$message({
            message: "操作成功！",
            type: "success"
          });
        })
        .catch(err => {
          if (err !== "cancel") {
            Utils.showError(err);
          }
        });
    },

    /**
     * 提交促销单
     */
    onSubmit(id) {
      var self = this;
      this.$confirm("是否确认提交促销单?", "提示", {
        type: "warning"
      })
        .then(() => {
          return PromotionService.submitBill(id);
        })
        .then(data => {
          self.reload();
          self.$message({
            message: "操作成功！",
            type: "success"
          });
        })
        .catch(err => {
          if (err !== "cancel") {
            Utils.showError(err);
          }
        });
    },

    /** 
     * 复制单据
     */
    onCopy(id) {
      this.$router.push({
        name: "PromotionBillView",
        query: {
          id: id,
          action: 'copy'
        }
      });
    },

    /**
     * 加载促销单列表
     */
    reload(page = 1, pageSize = 10) {
      var self = this;
      PromotionService.queryBill(page, pageSize, this.qryForm)
        .then(data => {
          self.pageData = data;
        })
        .catch(error => {
          Utils.showError(error);
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
