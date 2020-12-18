<template>
  <el-dialog title="选择广告页" :visible.sync="dialogVisible" width="40%" center>
    <el-table :data="adsData" height="500">
      <el-table-column property="date" label="广告图">
        <template slot-scope="scope">
          <img class="ads-img" :src="scope.row.content[0].url || scope.row.content[0].imgs[0].url || scope.row.content[0].imgs[0].imageUrl" />
        </template>
      </el-table-column>
      <el-table-column property="name" label="广告名"></el-table-column>
      <el-table-column property="address" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="checkAds(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import AdsService from "@/api/service/AdsService";

export default {
  data() {
    return {
      dialogVisible: false,
      selectGiftcardLoading: false,
      adsData: [],
      tenant: ""
    };
  },
  props: ["visible"],
  methods: {
    /* 选择广告页 */
    checkAds(val) {
      // 将选择结果抛出
      var baseUrl = window.location.href.split("#")[0];
      var reg = new RegExp("https");
      if (!reg.test(baseUrl)) {
        baseUrl = baseUrl.replace("http", "https");
      }

      var obj = {
        id: val.id,
        name: val.name,
        linkUrl: baseUrl + "#/advertShow?id=" + val.id + this.tenant
      };
      this.$emit("selectResult", obj);
      this.dialogVisible = false;
    },
    /* 查询广告页列表 */
    handleQuery() {
      AdsService.query(1, 0)
        .then(res => {
          this.adsData = [];
          if (res.records && res.records.length > 0) {
            res.records.forEach(item => {
              const content = JSON.parse(item.content)
              
              this.adsData.push({
                name: item.name,
                id: item.id,
                content: content
              });
            });
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 获取SAAS租户信息
    getSaasTenant() {
      if (process.env.PRJ === "SAAS") {
        var tenant = localStorage.getItem("_tenant_");
        if (tenant) {
          this.tenant = "&tenant=" + tenant;
        }
      }
    }
  },
  created() {
    this.getSaasTenant();
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
.ads-img {
  width: 70px;
  height: 70px;
}
</style>
