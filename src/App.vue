<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import WsClient from "@/components/ws/WsClient";
// import BaiduYy from "@/components/baiduYy/BaiduYy";

export default {
  name: "app",
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    // showNotice(notice) {
    //   if (!notice || !notice.body) {
    //     return;
    //   }
    //   this.$notify({
    //     title: "通知",
    //     message: notice.body,
    //     position: "bottom-right",
    //     duration: 1000 * 60
    //   });
    //   BaiduYy.getVoiceUrl(notice.body).then(url => {
    //     var audio = new Audio(url);
    //     audio.src = url;
    //     function dial() {
    //       function ring() {
    //         audio.play();
    //       }
    //       ring();
    //       // 播放两遍
    //       setTimeout(ring, 2000);
    //     }
    //     dial();
    //   });
    // }
  },
  watch: {
    // 注释 WsClient BaiduYy
    // user(curVal, oldVal) {
    //   if (curVal) {
    //     WsClient.start(this.showNotice);
    //   } else {
    //     WsClient.disconnect();
    //   }
    // }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.el-message {
  top: 51px;
}
.search-box {
  .el-input--prefix .el-input__inner {
    border-radius: 20px;
  }
}
// element-ui警告弹框对移动端优化
@media screen and (max-width: 450px) {
  .el-message {
    min-width: 80%;
  }
}
</style>
<style>
textarea{
  resize:none;
  border:1px solid #DCDFE6;
  border-radius: 4px;
  width: 70%;
}
</style>

