<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <!-- <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
    </div>-->
    <navbar></navbar>
    <div class="main-container">
      <sidebar class="sidebar-container"></sidebar>
      <tags-view />
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "@/views/layout/components";

export default {
  name: "layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    }
  },
  mounted() {
    const that = this;
    that.handleScroll();
    eventBus.$on("toggleSideBar", () => {
      setTimeout(() => {
        that.handleScroll();
      }, 300);
    });
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  top: 50px;
  height: 100%;
  width: 100%;
  padding: 0 50px 20px 50px;
  -webkit-transition: padding 0.28s;
  transition: padding 0.28s;
  background-color: $bodyBg;
}
</style>
