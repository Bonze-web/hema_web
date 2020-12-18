<template>
  <el-dialog title="选择礼品卡" :visible.sync="dialogVisible" width="40%" center>
    <div style="width: 100%;height:350px;margin-top:10px;">
      <el-scrollbar style="height:100%;">
        <el-table :data="giftcardList" style="width: 100%;" v-loading="selectGiftcardLoading">
          <el-table-column prop="giftcard" label="礼品卡">
            <template slot-scope="scope">
              <img class="giftcard-img" :src="scope.row.imageUrl">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="handleSelectGiftcard(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>
<script>
import GiftCardService from "@/api/service/GiftCardService";

export default {
  data() {
    return {
      dialogVisible: false,
      selectGiftcardLoading: false,
      giftcardList: []
    };
  },
  props: ["visible"],
  methods: {
    /* 选择礼品卡 */
    handleSelectGiftcard(val) {
      // 将选择结果抛出
      var obj = {
        id: val.id,
        name: val.name
      }
      this.$emit("selectResult", obj);
      this.dialogVisible = false;
    },
    /* 查询礼品卡列表 */
    handleQuery() {
      this.selectGiftcardLoading = true;
      GiftCardService.queryList()
        .then(res => {
          this.selectGiftcardLoading = false;
          if (res && res.length > 0) {
            this.giftcardList = res;
          }
        })
        .catch(err => {
          this.selectGiftcardLoading = false;
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
