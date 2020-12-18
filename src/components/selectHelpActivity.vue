<template>
  <el-dialog title="选择助力活动" :visible.sync="dialogVisible" width="45%" center>
    <div class="search-box">
      <el-input size="small" placeholder="请输入助力活动名称查询" prefix-icon="el-icon-search" v-model="searchValue" @keyup.enter.native="handleQuery"></el-input>
    </div>
    <div style="width: 100%;height:350px;margin-top:10px;">
      <el-scrollbar style="height:100%;">
        <el-table :data="helpActivityList" style="width: 100%;" v-loading="selectHelpActivityLoading">
          <el-table-column prop="name" label="助力送券活动名称"></el-table-column>
          <el-table-column prop="couponActivityName" label="券活动名称"></el-table-column>
          <el-table-column prop="onlyNewMbrJoin" label="是否仅限新用户参与">
            <template slot-scope="scope">
              <span>{{scope.row.onlyNewMbrJoin | filtOnlyNewMbrJoin}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods" label="操作">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="handleCheckHelpActivity(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>
<script>
import HelpActivityService from "@/api/service/HelpActivityService";

export default {
  data() {
    return {
      dialogVisible: false,
      selectHelpActivityLoading: false,
      searchValue: "",
      helpActivityList: []
    };
  },
  props: ["visible"],
  methods: {
    /* 选择助力活动 */
    handleCheckHelpActivity(val) {
      // 将选择结果抛出
      var obj = {
        id: val.id,
        name: val.name
      };
      this.$emit("selectResult", obj);
      this.dialogVisible = false;
    },
    /* 查询助力活动 */
    handleQuery() {
      this.selectHelpActivityLoading = true;
      var opts = {
        nameLike: this.searchValue ? this.searchValue : null,
        statusEquals: "SUBMITED"
      };
      HelpActivityService.query(1, 0, opts)
        .then(res => {
          this.selectHelpActivityLoading = false;
          if (res && res.records) {
            this.helpActivityList = res.records;
          }
        })
        .catch(err => {
          this.selectHelpActivityLoading = false;
          this.$message.error(err.message);
        });
    }
  },
  watch: {
    visible: function(val) {
      this.dialogVisible = val;
      if (val) {
        this.handleQuery();
      }
    },
    dialogVisible: function(val) {
      this.$emit("update:visible", val);
    }
  },
  filters: {
    filtOnlyNewMbrJoin: function(val) {
      if (val === "false" || val === false) {
        val = "否";
      } else {
        val = "是";
      }
      return val;
    }
  }
};
</script>
<style lang="scss" scoped>
.giftcard-img {
  width: 90px;
  height: 50px;
  margin-right: 10px;
  float: left;
  border-radius: 4px;
  overflow: hidden;
}
</style>
