<template>
  <div class="base-edit">

    <imp-panel v-if="title || $slots.header">
      <span slot="header" class="header">
        <span class="title" v-if="title">
          <el-button type="text" icon="el-icon-back" @click="goback">返回</el-button>
          <span class="separator-line"></span>
          <span v-text="title"></span>
        </span>
        <span class="toolbox" v-if="$slots.toolbox">
          <slot name="toolbox"></slot>
        </span>
      </span>
    </imp-panel>

    <imp-panel v-if="$slots.body">
      <div slot="body" class="body">
        <slot name="body"></slot>
      </div>
    </imp-panel>

  </div>
</template>

<script>
import Panel from "@/components/panel.vue";

export default {
  name: "BaseEdit",

  components: {
    "imp-panel": Panel
  },

  props: {
    widthBorder: {
      type: Boolean
    },
    title: {
      type: String
    }
  },

  methods: {
    goback() {
      this.$router.back(-1);
    }
  }
};
</script>

<style lang="scss">
.base-edit {
  .el-form-item {
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg-color: #ffffff;

.base-edit {
  // > div {
  //   margin-bottom: 30px;
  //   border-radius: 8px;
  //   &:last-child {
  //     margin-bottom: 0;
  //   }
  // }

  // .box-header {
  //   width: 100%;
  //   height: auto;
  //   // padding: 25px 40px;
  //   box-sizing: border-box;
  //   background-color: $bg-color;
  // }
  .header {
    .title .el-button--text {
      color: #606266;
    }

    .separator-line {
      height: 16px;
      width: 0;
      margin: 0 10px;
      border-left: 1px solid #dcdfe6;
    }

    .toolbox {
      float: right;
    }
  }

  .box-body {
    overflow: hidden;
    // padding: 15px;
    background-color: $bg-color;
    .grid-toolbar {
      margin-bottom: 20px;
    }
  }
}
</style>

