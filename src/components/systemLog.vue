<template>
  <div class="system-log-box">
    <el-table :data="logList" style="width: 100%;text-align:center">
      <el-table-column prop="createTime" label="操作时间" min-width="200"></el-table-column>
      <el-table-column prop="user" label="操作人" min-width="200"></el-table-column>
      <el-table-column prop="operation" label="事件" min-width="200"></el-table-column>
      <el-table-column prop="content" label="详情" min-width="300"></el-table-column>
    </el-table>
    <div class="height20"></div>
    <el-pagination style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
  </div>
</template>
<script>
import SysyemLogService from "@/api/service/SysyemLogService";

export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      totalCount: 0,
      logList: []
    };
  },
  props: ["modular", "id"],
  methods: {
    getSysLog() {
      const opts = {
        module: this.modular,
        id: this.id
      };
      SysyemLogService.query(this.page, this.pageSize, opts)
        .then(res => {
          this.totalCount = res.totalCount;
          this.logList = res.records;
        })
        .catch(err => {
          this.$message.error("查询日志失败" + err.message);
        });
    },
    handleCurrentChange: function(e) {
      this.page = Number(e);
      this.getSysLog(true);
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e);
      this.page = 1;
      this.getSysLog(true);
    }
  },
  mounted() {
    this.getSysLog();
  }
};
</script>
<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.system-log-box {
  @include elTable;
  .height20 {
    height: 20px;
  }
}
</style>
<style lang="scss">
@import "src/styles/mixin.scss";
.system-log-box {
  @include elTable;
  .el-table .cell {
    line-height: 32px !important;
  }
}
</style>