<template>
  <div>
    <span 
      v-for="(item, index) in types" 
      :key="index" 
      :style="{width: styles.width + 'px', height: styles.height + 'px', lineHeight: styles.height + 'px'}"
      :class="{'select-border': item.value === type, 'isDisabled': disabled}"
      @click="selectItem(item)">
      {{item.label}}
      <label :class="{'active': item.value === type}">
        <i class="el-icon-upload-success el-icon-check" v-if="item.value === type"></i>
      </label>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    defaultType: {
      type: String,
      default: 'CASH'
    },
    types: {
      type: Array,
      default: []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    styles: {
      type: Object,
      default: () => {
        return {
          width: 65,
          height: 40
        }
      }
    }
  },
  data() {
    return {
      type: this.defaultType
    }
  },
  methods: {
    selectItem(item) {
      if (this.disabled) {
        return false;
      }
      this.type = item.value;
      this.$emit('select', item);
    }
  }
}
</script>

<style lang="scss" scoped>
  span {
    display: inline-block;
    margin-right: 10px;
    border: 1px solid #DCDFE6;
    border-radius: 6px;
    text-align: center;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    color: #666;
  }
  span.select-border {
    background:#ecf5ff;
    border:1px solid #409EFF;
    color: #409EFF;
    label.active {
      display: block;
      position: absolute;
      right: -12px;
      top: -8px;
      width: 26px;
      height: 20px;
      background: #409EFF;
      text-align: center;
      line-height: 20px;
      transform: rotate(45deg);
      box-shadow: 0 1px 1px #ccc;
      i {
        font-size: 12px;
        margin-top: 10px;
        transform: rotate(-45deg);
        color: #fff;
      }
    }
  }
  span.isDisabled {
    background: #DCDFE6;
  }
</style>