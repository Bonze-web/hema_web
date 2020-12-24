<template>
  <iframe :src="iframe.src" width="100%" :height="iframe.height" scrolling="yes" frameborder="0" @load="load"></iframe>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      iframe: {
        loaded: false,
        height: "200px",
        src: "/newretail-ureport/ureport/designer"
      }
    };
  },

  methods: {
    load() {
      this.iframe.loaded = true;
      this.iframe.height = window.screen.height - 160 + "px";
    }
  },

  mounted() {
    this.iframe.src =
      "/newretail-ureport/ureport/designer";
  },

  created() {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>