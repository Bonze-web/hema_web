<template>
  <scroll-bar>
    <el-menu mode="vertical" unique-opened router :default-active="element.active" :collapse="isCollapse" text-color="#3F4156">
      <!-- background-color="#304156"
      text-color="#fff"
      active-text-color="#409EFF"-->
      <sidebar-item :routes="menuRouters"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import ScrollBar from "@/components/ScrollBar";

export default {
  data() {
    return {
      element: {
        active: ""
      }
    };
  },
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters(["sidebar", "menuRouters"]),
    routes() {
      return this.$router.options.routes;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    getSideBar() {
      if (this.$route.name === "Preview") {
        this.element.active = this.$route.path;
      } else {
        this.element.active =
          this.$route.matched.length > 1
            ? this.$route.matched[1].path
            : this.$route.matched[0].path;
      }
    }
  },
  mounted() {
    this.getSideBar();
  },
  watch: {
    $route(to, from) {
      this.getSideBar();
    }
  }
};
</script>
