<template>
  <iframe :src="iframe.src" width="1200px" :height="iframe.height" frameborder="0" scrolling="yes" @load="load"></iframe>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      iframe: {
        loaded: false,
        height: "200px",
        src: ""
      }
    };
  },

  mounted() {
    this.prj = process.env.PRJ;
    var url = "/newretail/druid/index.html";
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
    }
  },

  created() {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
iframe {
  min-height: 200px;
}
</style>