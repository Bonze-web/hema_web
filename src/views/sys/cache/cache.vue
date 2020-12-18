<template>
  <!-- <iframe :src="iframe.src" width="100%" :height="iframe.height" frameborder="0" scrolling="yes" @load="load"></iframe> -->
  <div class="cache-index">
    <div class="top-box">
      <span>缓存监控</span>
    </div>
    <div class="cache-content">
      <el-button
        @click="clearCache"
        v-if="hasPermission(PermIds.SYS_MONITOR_CACHE)"
      >清除缓存</el-button>
      <el-dialog
        title="温馨提示"
        :visible.sync="dialogVisible"
        width="300px"
      >
        <span>是否要清除缓存？</span>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handleClearCache"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import CacheService from "@/api/service/CacheService";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  components: {},

  data() {
    return {
      iframe: {
        loaded: false,
        height: "200px",
        src: ""
      },
      dialogVisible: false,
      PermIds: PermIds
    };
  },
  computed: {
    ...mapGetters(["hasPermission", "workingOrg"])
  },
  mounted() {
    this.prj = process.env.PRJ;
    var url = "/newretail/smartcache/backoffice.html";
    if (this.prj === "SAAS") {
      var tenant = localStorage.getItem("_tenant_");
      if (tenant) {
        url = "/" + tenant + url;
      }
    }
    this.iframe.src = url;
  },

  methods: {
    load: function() {
      this.iframe.loaded = true;
      this.iframe.height = window.screen.height - 180 + "px";
    },
    /**
     * 清除缓存点击操作
     */
    clearCache: function() {
      this.dialogVisible = true;
    },
    /**
     * 清除缓存
     */
    handleClearCache: function() {
      this.dialogVisible = false;
      CacheService.clearCache()
        .then(res => {
          this.$message({
            message: "清除缓存成功",
            type: "success"
          });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  },

  created() {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
iframe {
  width: 1px;
  min-width: 100%;
  min-height: 200px;
}
.cache-index {
  // background-color: #ebeff3;
  min-width: 800px;
  > div {
    margin-bottom: 15px;
    border-radius: 8px;
    background-color: #ffffff;
    padding: 15px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .top-box {
    span {
      font-size: 20px;
      line-height: 32px;
    }
    .el-button {
      float: right;
      margin-left: 10px;
    }
  }
  .cache-content {
    height: 320px;
  }
}
</style>