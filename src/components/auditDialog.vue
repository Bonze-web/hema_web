<template>
  <el-dialog title="审批" :visible.sync="dialogVisible" width="30%" center>
    <div>
      <el-form label-position="left" label-width="100px">
        <el-form-item label="是否通过：">
          <el-radio-group v-model="isPass">
            <el-radio :label="true">通过</el-radio>
            <el-radio :label="false">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核说明：" style="width: ;" v-if="hasRemark">
          <el-input type="textarea" :rows="2" placeholder="请输入备注" v-model="remark" maxlength="256" show-word-limit></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleEmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      isPass: true,
      remark: ""
    };
  },
  props: {
    hasRemark: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    handleEmit() {
      this.$emit("confirmAudit", {
        isPass: this.isPass,
        remark: this.remark
      });
    }
  },
  watch: {
    dialogVisible: function() {
      this.isPass = true;
      this.remark = "";
    }
  }
};
</script>

<style lang="scss" scoped>
</style>