<template>
  <div>
    <iframe name="ifm_Test" :src="iframe.src + rpt + '&_cuid=' + user.id + '&_coid=' + user.workingOrg.id" width="100%" :height="iframe.height" scrolling="yes" frameborder="0" @load="load"></iframe>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  components: {},

  props: {
    rpt: {
      type: String,
      default: "Vue!"
    }
  },

  computed: {
    ...mapGetters(["user"])
  },

  data() {
    return {
      iframe: {
        src: "/newretail-ureport/ureport/preview?_i=1&_u=db:",
        loaded: false,
        height: "200px"
      }
    };
  },

  watch: {
    rpt: function() {
      console.log("报表换了: " + this.rpt);
    }
  },

  methods: {
    load() {
      this.iframe.loaded = true;
      this.iframe.height = window.screen.height - 160 + "px";
    }
  },

  mounted() {
    this.iframe.src = "/newretail-ureport/ureport/preview?_i=1&_u=db:";
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
iframe {
  width: 1px;
  min-width: 100%;
  min-height: 200px;
}
</style>