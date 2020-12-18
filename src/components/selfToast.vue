<template>
    <div class="self-toast" v-if="toastText">
        <div class="inner-content">
            {{toastText}}
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: ["toastText"],
  watch: {
    toastText: function(val) {
      if (val !== "") {
        var self = this;
        setTimeout(function() {
          self.$emit("update:toastText", "");
        }, 2000);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.self-toast {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .inner-content {
    max-width: 250px;
    background: rgba(33, 33, 33, 0.8);
    padding: 15px;
    color: #fff;
    font-size: 14px;
    border-radius: 6px;
  }
}
</style>
