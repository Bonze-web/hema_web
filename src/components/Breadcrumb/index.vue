<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if="item.meta.title">
        <span v-if="item.redirect==='noredirect'||index!==0" class="no-redirect">{{item.meta.title}}</span>
        <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb();
  },
  data() {
    return {
      levelList: null
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name);
      matched.forEach((ele, i) => {
        if (
          ele.components &&
          ele.components.default.name &&
          ele.components.default.name === "layout"
        ) {
          matched[i].redirect = "noredirect";
        }
      });
      const first = matched[0];
      if (first && first.name !== "dashboard" && first.name !== "Dashboard") {
        matched = [{ path: "/dashboard", meta: { title: "首页" } }].concat(
          matched
        );
      }
      this.levelList = matched;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 10px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
  .el-breadcrumb__inner {
    font-weight: normal;
  }
  .el-breadcrumb__inner,
  .el-breadcrumb__inner a {
    font-weight: normal !important;
  }
}
</style>
