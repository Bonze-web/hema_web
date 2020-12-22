<template>
  <div :class="{'common-title':isFixed}" class="top-box">
    <!-- <router-link :to="backPath">
            <i class="el-icon-back"></i>返回
    </router-link>-->
    <a href="javascript:;" @click="handleCancel">
      <i class="el-icon-back"></i>返回
    </a>
    <i class="vertical-line"></i>
    <span>{{pageTitle}}</span>
    <el-button v-if="hasSave && saveSubmit === true" size="small" type="primary" @click="handleSaveAndSubmit" icon="el-icon-check">保存并提交</el-button>
    <el-button v-if="hasSubmit" size="small" type="primary" @click="handleSubmit">提交</el-button>
    <el-button v-if="hasSave" size="small" type="primary" @click="handleSave">保存</el-button>
    <el-button v-if="hasSave" size="small" @click="handleCancel">取消</el-button>
  </div>
</template>
<script>
export default {
  props: [
    "pageTitle",
    "backPath",
    "hasSubmit",
    "hasSave",
    "isFixed",
    "saveSubmit"
  ],
  methods: {
    handleSubmit() {
      this.$emit("handleSubmit");
    },
    handleSave() {
      this.$emit("handleSave");
    },
    handleSaveAndSubmit() {
      this.$emit("handleSaveAndSubmit");
    },
    handleCancel() {
      // this.$router.push({
      //   path: this.backPath
      // })
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.top-box {
  overflow: hidden;
  line-height: 32px;
  font-size: 18px;
  position: sticky;
  width: 100%;
  top: 50px;
  z-index: 99;
  box-shadow: rgb(241, 241, 241) 0px 7px 5px -5px;
  > span {
    font-size: 18px;
  }
  > a {
    font-size: 16px;
    color: #999999;
  }

  .el-button {
    float: right;
    margin-left: 10px;
  }
  .vertical-line {
    display: inline-block;
    height: 24px;
    width: 0px;
    margin: 0px 3px -5px;
    border-right: 1px solid #cecece;
  }
}
</style>

