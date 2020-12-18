<template>
  <div class="module">
    <!-- <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened">
    </hamburger>
    <breadcrumb></breadcrumb> -->
    <transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut" appear>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.module {
  // padding: 5px;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
}
</style>