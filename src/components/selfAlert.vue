<template>
    <div class="self-alert" v-if="text">
        <div class="alert-content">
            <div class="inner-text">{{text}}</div>
            <div class="btn-box">
                <button class="alert-cancel" @click="handleCancel">取消</button>
                <button class="alert-confirm" @click="handleConfirm">确认</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      text: this.alertText
    };
  },
  props: ["alertText"],
  methods: {
    handleCancel() {
      this.text = "";
      this.$emit("update:alertText", "");
      this.$emit("handleCancel");
    },
    handleConfirm() {
      this.text = "";
      this.$emit("update:alertText", "");
      this.$emit("handleConfirm");
    }
  },
  watch: {
    alertText: function(val) {
      if (val) {
        this.text = val;
      } else {
        this.text = "";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.self-alert {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba($color: #000, $alpha: 0.5);
  .alert-content {
    width: 240px;
    background: #fff;
    border-radius: 10px;
    text-align: center;
    font-size: 14px;
    overflow: hidden;
    .inner-text {
      padding: 30px 20px;
      line-height: 24px;
      border-bottom: 10px solid #f1f1f1;
    }
    .btn-box {
      width: 100%;
      height: 44px;
      position: relative;
      button {
        width: 50%;
        height: 100%;
        border: none;
        outline: none;
        background: #fff;
        padding: 0px;
        margin: 0px;
        float: left;
      }
      .alert-confirm {
        background: #00a055;
        color: #fff;
      }
    }
  }
}
</style>

