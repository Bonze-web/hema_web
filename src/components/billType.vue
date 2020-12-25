<template>
  <div>
    <div>
      <div class="loss-title">
        <div>{{ billTitle }}</div>
        <div>
          <el-button type="primary" @click="createlossType" size="mini">+新建</el-button>
          <el-button  @click="goBack" size="mini">返回</el-button>
        </div>
      </div>
      <div>
        <el-table
          :data="billListData"
          style="width: 100%;text-align:center"
        >
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="status" label="说明"></el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="removeType(scope.row.id, scope.row.version)">删除</el-button>
              <el-button size="mini" type="text" @click="editType">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div>
      <el-dialog title="新建" :visible.sync="dialogFormVisible" append-to-body>
        <el-form :model="form" :rules="createRules" ref="form">
          <el-form-item label="损耗类型" label-width="120px" prop="billName">
            <el-input v-model="form.billName" maxlength="32" placeholder="请输入单据类型的名称" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="说明"  label-width="120px">
            <textarea v-model="form.remark" maxlength="200" autocomplete="off"></textarea>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelType">取 消</el-button>
          <el-button type="primary" @click="subType">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="编辑" :visible.sync="dialogFormEdit" append-to-body>
        <el-form :model="editForm" :rules="createRules" ref="editForm">
          <el-form-item label="损耗类型" label-width="120px" prop="billName">
            <el-input v-model="editForm.billName" maxlength="32" placeholder="请输入单据类型的名称" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="说明"  label-width="120px">
            <textarea v-model="editForm.remark" maxlength="200" autocomplete="off"></textarea>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEditType">取 消</el-button>
          <el-button type="primary" @click="subEditType">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import BillTypeService from '@/api/service/BillTypeService'

export default {
  data() {
    return {
      billListData: this.billList, // 单据类型列表
      dialogFormEdit: false,
      dialogFormVisible: false,
      form: {
        lossType: this.lossType,
        remark: '',
        billName: ''
      },
      editForm: {
        id: '',
        remark: '',
        billName: '',
        version: ''
      },
      createRules: {
        billName: [
          { required: true, message: '请输入单据类型的名称', trigger: 'blur'}
        ]
      }
    };
  },
  props: {
    billTitle: String,
    hasRemark: String,
    lossType: String,
    billList: Array
  },
  methods: {
    getlossTypeList() {
      
    },
    goBack() {
      this.$emit('goBack')
    },
    editType(id) {
      BillTypeService.getTypeDatail(id)
      .then((res) => {
        this.editForm = res
        this.dialogFormEdit = true
      })
      .catch((err) => {
        this.$message.error('编辑失败' + err.message)
      })
    },
    cancelEditType() {
      this.dialogFormEdit = false
      this.editForm = {
        id: '',
        remark: '',
        billName: '',
        version: ''
      }
    },
    subEditType() {
      BillTypeService.updateType(this.editForm)
      .then((res) => {
        this.$message.success('编辑成功')
        this.$emit('getAlllossType')
      })
      .catch((err) => {
        this.$message.error('编辑失败' + err.message)
      })
    },
    removeType(id, version) {
      this.$confirm('此操作将删除该类型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BillTypeService.removeType(id, version)
          .then((res) => {
            this.message.success('删除成功')
            this.$emit('getAlllossType')
          })
          .catch((err) => {
            this.$message.error('删除失败' + err.message)
          })
        })
    },
    createlossType() {
      this.dialogFormVisible = true
    },
    cancelType() {
      this.dialogFormVisible = false
      this.form = {
        lossType: '',
        remark: '',
        billName: ''
      }
    },
    subType() {
      const _this = this
      this.$refs.form.validate(valid => {
        if (valid) {
          BillTypeService.createlossType(_this.form)
          .then((res) => {
            console.log(res)
            _this.$emit('getAlllossType')
            _this.dialogFormVisible = false
            _this.$message.success('新建成功')
          })
          .catch((err) => {
            _this.$message.error('新建失败' + err.message)
          })
        }
      })
    }
  },
  watch: {
  }
};
</script>

<style lang="scss" scoped>
.loss-title{
  display: flex;
  justify-content: space-between;
}
/deep/ .el-table td, .el-table th.is-leaf {
  text-align: center;
}
/deep/ .el-table th, .el-table tr  {
  text-align: center !important;
}
/deep/ .el-dialog{
      width: 600px;
    }
</style>