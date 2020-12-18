<template>
  <div class="stepBox">
    <div v-for="(item, index) in steps" :key="index" class="stepItem" @click="handleStep(item)">
      <span class="stepNum">{{index + 1}}</span>
      <span>{{item.name}}</span>
      <span class="stepLine" v-if="index + 1 !== steps.length"></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    steps: Array
  },
  methods: {
    handleStep(item) {
      this.$emit('handleStep', item);
    }
  }
};
</script>

<style lang="scss" scoped>
.stepBox {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  .stepItem {
    display: flex;
    align-items: center;
    margin-right: 5px;
    cursor: pointer;
    font-size: 14px;
    > span {
      display: inline-block;
      color: #409eff;
      height: 20px;
      line-height: 20px;
      text-align: center;
    }
    .stepNum {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      color: #fff;
      background: #409eff;
      margin-right: 2px;
    }
    .stepLine {
      height: 1px;
      width: 40px;
      background: #409eff;
      margin: 0 5px;
    }
  }
}
</style>