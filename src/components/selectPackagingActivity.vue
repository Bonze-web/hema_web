<template>
  <el-dialog title="选择打包一口价活动" :visible.sync="dialogVisible" width="45%" center>
    <div class="search-box">
      <el-input size="small" placeholder="请输入打包一口价活动名称查询" prefix-icon="el-icon-search" v-model="searchValue" @keyup.enter.native="handleQuery"></el-input>
    </div>
    <div style="width: 100%;height:350px;margin-top:10px;">
      <el-scrollbar style="height:100%;">
        <el-table :data="helpActivityList" style="width: 100%;" v-loading="selectActivityLoading">
          <el-table-column prop="name" label="活动名称"></el-table-column>
          <el-table-column prop="labelName" label="促销规则"></el-table-column>
          <el-table-column label="活动时间" min-width="160">
            <template slot-scope="scope">{{scope.row.startTime}}~{{scope.row.endTime}}</template>
          </el-table-column>
          <el-table-column prop="status" label="活动状态" min-width="80">
            <template slot-scope="scope">{{scope.row.status | filtStatus}}</template>
          </el-table-column>
          <el-table-column prop="goods" label="操作">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="handleCheckPackagingActivity(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>
<script>
import PackagingActivityService from "@/api/service/PackagingActivityService";

export default {
  data() {
    return {
      dialogVisible: false,
      selectActivityLoading: false,
      searchValue: "",
      helpActivityList: []
    };
  },
  props: ["visible"],
  methods: {
    /* 选择助力活动 */
    handleCheckPackagingActivity(val) {
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
      this.selectActivityLoading = true;
      var opts = {
        activityNameLike: this.searchValue ? this.searchValue : null,
        statusEquals: "STARTED"
      };
      PackagingActivityService.query(1, 0, opts)
        .then(res => {
          this.selectActivityLoading = false;
          if (res && res.records) {
            this.helpActivityList = res.records;
          }
        })
        .catch(err => {
          this.selectActivityLoading = false;
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
    filtStatus: function(val) {
      let res = "";
      if (val === "CREATED") {
        res = "未开始";
      } else if (val === "STARTED") {
        res = "进行中";
      } else if (val === "FINISHED") {
        res = "已结束";
      } else if (val === "DELETED") {
        res = "已作废";
      }
      return res;
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
