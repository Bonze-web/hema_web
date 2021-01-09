<template>
    <div>
        <div class="head">
            <div style="margin-top:8px">新建</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createSuppliers">确认</el-button>
                <!-- <el-button type="primary" v-if="status === 'create'">确认并创建</el-button> -->
            </div>
        </div>
        <div style="height:20px" />
        <div class="info-content">
              <el-form label-width="135px" :model="form" ref="formName" :rules="createRules">
                 <el-row>
                    <el-col :span="6">
                        <el-form-item label="用户" prop="userId">
                          <el-select
                            v-model="form.userId"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入关键词"
                            :remote-method="remoteMethod"
                            :loading="loading">
                          <el-option v-for="(ele, idx) in userAll" :key="idx" v-show="ele.disabled !== true" :label="ele.username" :value="ele.id"></el-option>
                          </el-select>
                        </el-form-item>
                    </el-col>
                 </el-row>
                <!-- <el-form-item label="用户" prop="userId">
                  <el-select v-model="form.userId" placeholder="请选择用户">
                    <el-option v-for="(ele, idx) in userAll" :key="idx" :disabled="ele.disabled" :label="ele.username" :value="ele.id"></el-option>
                  </el-select>
                </el-form-item> -->
                
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="主要拣货分区" prop="firstPickareaId">
                      <el-select v-model="form.firstPickareaId" placeholder="请选择主要拣货分区">
                        <el-option v-for="(ele, idx) in firstPickareaIdArr" :key="idx" :label="'['+ ele.code + ']' + ele.name" :value="ele.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="主要任务类型" prop="firstTaskTypeList">
                        <el-checkbox-group v-model="form.firstTaskTypeList">
                          <el-checkbox label="整托" value="PALLET"></el-checkbox>
                          <el-checkbox label="整箱" value="CASE"></el-checkbox>
                          <el-checkbox label="拆零" value="SPLIT"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="辅助拣货分区" prop="secondPickareaId">
                      <el-select v-model="form.secondPickareaId" placeholder="请选择主要拣货分区">
                        <el-option v-for="(ele, idx) in secondPickareaIdArr" :key="idx" :label="'['+ ele.code + ']' + ele.name" :value="ele.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="辅助任务类型" prop="secondTaskTypeList">
                        <el-checkbox-group v-model="form.secondTaskTypeList">
                          <el-checkbox label="整托" value="PALLET"></el-checkbox>
                          <el-checkbox label="整箱" value="CASE"></el-checkbox>
                          <el-checkbox label="拆零" value="SPLIT"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
        </div>
    </div>
</template>

<script>
import PersonnelbindService from "@/api/service/PersonnelbindService";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  data() {
      return {
        PermIds: PermIds,
        loading: false,
        status: '', // 页面状态
        id: '', 
        firstPickareaIdArr: [],
        secondPickareaIdArr: [],
        userAll: [],
        form: {
          firstPickareaId: "",
          secondPickareaId: "",
          userId: '',
          firstTaskTypeList: [],
          secondTaskTypeList: []
        },
        editData: [],
        createRules: {
          userId: [
            { required: true, message: '请选择用户', trigger: 'blur' }
          ],
          firstPickareaId: [
            { required: true, message: '请选择主要拣货分区', trigger: 'blur' }
          ],
          secondPickareaId: [
            { required: true, message: '请选择辅助拣货分区', trigger: 'blur' }
          ],
          firstTaskType: [
            { required: true, message: '请选择首要任务类型', trigger: 'blur' }
          ],
          firstTaskTypeList: [
            { required: true, message: '请选择首要任务类型', trigger: 'blur' }
          ],
          secondTaskTypeList: [
            { required: true, message: '请选择辅助任务类型', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters(["hasPermission", "workingOrg"])
    },
    methods: {
      createSuppliers() {
        this.$refs['formName'].validate((valid) => {
          if (valid) {
              if (this.form.firstPickareaId === this.form.secondPickareaId) {
                this.$message.error("助拣货分区 不能等于 主拣货分区");
                return false;
              }
              PersonnelbindService.createSuppliers(this.form)
              .then((res) => {
                  this.$message.success("创建成功");
                  this.$store.dispatch("tagsView/delView", this.$route);
                  this.$router.go(-1);
              })
              .catch((err) => {
                if (err) this.$message.error("获取信息失败" + err.message)
              })
          }
        })
      },
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      getDetail() {
        const id = this.$route.id;
        PersonnelbindService.getSuppliersDetail(id)
        .then((res) => {
            this.form.firstPickareaId = res.firstPickarea;
            this.form.secondPickareaId = res.secondPickarea;
        })
        .catch((err) => {
          if (err) this.$message.error("获取信息失败" + err.message)
        })
      },
      remoteMethod(query) {
          console.log(query);
          if (query !== '') {
            this.loading = true;
            PersonnelbindService.userQuery(query)
            .then((res) => {
              this.loading = false;
              res.records.forEach((ele, idx) => {
                  this.editData.forEach((item, index) => {
                      if (ele.id === item.userId) {
                          ele.disabled = true;
                      }
                  })
              })
              this.userAll = res.records;
            })
            .catch((err) => {
              if (err) this.$message.error("获取所有用户失败" + err.message);
            });
            // setTimeout(() => {
              
            //   this.options = this.list.filter(item => {
            //     return item.label.toLowerCase()
            //       .indexOf(query.toLowerCase()) > -1;
            //   });
            // }, 200);
          } else {
            this.userAll = [];
          }
      }
    },
    created() {
      this.editData = JSON.parse(decodeURIComponent(this.$route.query.addData));
      console.log(this.editData);
      PersonnelbindService.getPickareaQuery()
      .then((res) => {
          this.firstPickareaIdArr = res.records;
          this.secondPickareaIdArr = res.records;
      })
      .catch((err) => {
        if (err) this.$message.error("获取信息失败" + err.message);
      });
      PersonnelbindService.userQuery()
      .then((res) => {
        console.log(this.editData);
        res.records.forEach((ele, idx) => {
            this.editData.forEach((item, index) => {
                if (ele.id === item.userId) {
                    ele.disabled = true;
                }
            })
        })
        this.userAll = res.records;
      })
      .catch((err) => {
        if (err) this.$message.error("获取所有用户失败" + err.message);
      });
    },
    filters: {
        showFirstPickareaId(val) {
          return '[' + val.code + ']' + val.name;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.head{
    background: #fff;
    padding: 15px 12px;
    border-radius: 12px;
    border: 1px #eee solid;
    display: flex;
    justify-content: space-between;
}
.head-title{
    display: flex;
    justify-content: left;
}
.info-content{
    background: #fff;
    border-radius: 12px;
    padding: 15px 12px;
}
.info-box{
    margin: 4px 0;
    font-size: 12px;
    display: flex;
    justify-content: left;
}
.info-title{
    margin: 12px 0;
}
</style>
