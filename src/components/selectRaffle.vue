<template>
  <el-dialog title="选择抽奖活动" :visible.sync="dialogVisible" width="45%" center>
    <div style="width: 100%;height:350px;margin-top:10px;">
      <el-scrollbar style="height:100%;">
        <el-table :data="raffleActivityList" style="width: 100%;" v-loading="selectRaffleActivityLoading">
          <el-table-column prop="name" label="活动名称" min-width="100px"></el-table-column>
          <el-table-column prop="raffleType" label="活动类别" min-width="160px">
            <template slot-scope="scope">
              <span>{{scope.row.raffleType | filtRaffleType}}</span>
            </template>
          </el-table-column>
          <el-table-column label="活动时间" min-width="200px">
            <template slot-scope="scope">
              <span>{{scope.row.startTime}}-{{scope.row.endTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="activityPrizeBalance" label="剩余总数量" min-width="100px">
            <template slot-scope="scope">
              <span>{{scope.row.activityPrizeBalance}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods" label="操作">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="handleCheckRaffleActivity(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>
<script>
import RaffleActivityService from "@/api/service/RaffleActivityService";

export default {
  data() {
    return {
      dialogVisible: false,
      selectRaffleActivityLoading: false,
      raffleActivityList: []
    };
  },
  props: ["visible"],
  methods: {
    handleCheckRaffleActivity(val) {
      // 将选择结果抛出
      var obj = {
        id: val.id,
        name: val.name
      };
      this.$emit("selectResult", obj);
      this.dialogVisible = false;
    },
    /* 查询积分抽奖活动 */
    handleQuery() {
      this.selectRaffleActivityLoading = true;
      var opts = {
        raffleActivityTypeEquals: "SCORE_RAFFLE",
        statusEquals: "NORMAL"
      };
      RaffleActivityService.query(1, 0, opts)
        .then(res => {
          this.selectRaffleActivityLoading = false;
          if (res && res.records) {
            this.raffleActivityList = res.records;
          }
        })
        .catch(err => {
          this.selectRaffleActivityLoading = false;
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
    filtRaffleType: function(val) {
      let res = "";
      if (val === "LHJ") {
        res = "老虎机";
      } else if (val === "POPUP_WINDOWS") {
        res = "弹窗抽奖";
      } else if (val === "DZP") {
        res = "积分抽奖";
      }
      return res;
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
