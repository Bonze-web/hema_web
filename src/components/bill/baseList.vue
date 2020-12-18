<template>
  <div class="base-list">

    <imp-panel v-if="title || $slots.header">
      <div slot="header" class="header">
        <slot name="header"></slot>
      </div>
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
  name: "BaseList2",

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
  }
};
</script>

<style lang="scss">
.base-list {
  .el-form-item {
    &:last-child {
      margin-bottom: 0;
    }
  }

  .body {
    .el-table {
      margin-top: 10px;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg-color: #ffffff;

.base-list {
  > div {
    margin-bottom: 30px;
    border-radius: 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .header {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    background-color: $bg-color;
  }

  .body {
    overflow: hidden;
    padding: 10px;
    background-color: $bg-color;
  }
}
</style>

