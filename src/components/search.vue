<template>
    <div class="search-component">
        <i class="el-icon-search"></i>
        <input type="text" placeholder="请输入搜索内容">
    </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.search-component {
  position: relative;
  display: inline-block;
  width: 100%;
  font-size: 13px;
  input {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 16px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 32px;
    line-height: 1;
    outline: 0;
    padding: 0 20px 0px 30px;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
  }
  input:focus {
    border-color: #409eff;
  }
  i {
    position: absolute;
    top: 0;
    left: 5px;
    -webkit-transition: all 0.3s;
    height: 100%;
    width: 25px;
    line-height: 32px;
    color: #c0c4cc;
    text-align: center;
    transition: all 0.3s;
    vertical-align: middle;
  }
}
</style>

