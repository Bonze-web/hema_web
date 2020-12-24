<template>
  <div class="dashboard-container"></div>
</template>

<script>
import pageBar from "@/components/pagebar.vue";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  name: "dashboard",
  data() {
    return {
      PermIds: PermIds
    };
  },
  computed: {
    ...mapGetters(["hasPermission", "workingOrg"])
  },
  methods: {
    
  },
  created() {
    window.document.title = process.env.TITLE;
  },
  mounted() {
   
  },
  components: {
    pageBar
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.dashboard {
  &-container {
    @include common;
    overflow: hidden;
    .content {
      width: 100%;
    }
  }
}

.btn-box {
  float: right;
}
</style>
