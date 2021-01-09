<template>
    <div>
        <div class="head">
            <div style="margin-top:8px">编辑</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createSuppliers">确认</el-button>
                <!-- <el-button type="primary" v-if="status === 'create'">确认并创建</el-button> -->
            </div>
        </div>
        <div style="height:20px" />
        <div class="info-content">
              <el-form label-width="125px" :model="form" ref="formName">
                  <el-row>
                    <el-col :span="8">
                        <el-form-item label="用户" prop="userId">
                          <el-select
                            v-model="form.userId"
                            filterable
                            disabled
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
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="主要拣货分区" prop="firstPickareaId">
                        <el-select v-model="form.firstPickareaId" placeholder="请选择主要拣货分区">
                          <el-option v-for="(ele, idx) in firstPickareaIdArr" :key="idx" :label="'['+ ele.code + ']' + ele.name" :value="ele.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="主要任务类型" prop="firstTaskTypeList">
                          <el-checkbox-group v-model="form.firstTaskTypeList">
                            <el-checkbox label="PALLET">整托</el-checkbox>
                            <el-checkbox label="CASE">整箱</el-checkbox>
                            <el-checkbox label="SPLIT">拆零</el-checkbox>
                          </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="辅助拣货分区" prop="secondPickareaId">
                        <el-select v-model="form.secondPickareaId" placeholder="请选择主要拣货分区">
                          <el-option v-for="(ele, idx) in secondPickareaIdArr" :key="idx" :label="'['+ ele.code + ']' + ele.name" :value="ele.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="辅助任务类型" prop="secondTaskTypeList">
                          <el-checkbox-group v-model="form.secondTaskTypeList">
                            <el-checkbox label="PALLET">整托</el-checkbox>
                            <el-checkbox label="CASE">整箱</el-checkbox>
                            <el-checkbox label="SPLIT">拆零</el-checkbox>
                          </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
              </el-form>
        </div>
    </div>
</template>

<script>
// import { mapGetters } from "vuex";
import PersonnelbindService from "@/api/service/PersonnelbindService";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  data() {
      return {
        PermIds: PermIds,
        status: '', // 页面状态
        id: '', 
        firstPickareaIdArr: [],
        secondPickareaIdArr: [],
        userAll: [],
        loading: false,
        form: {
          firstPickareaId: "",
          secondPickareaId: "",
          userId: '',
          id: '',
          firstTaskTypeList: [],
          secondTaskTypeList: []
        },
        editData: []
      }
    },
    computed: {
      ...mapGetters(["hasPermission", "workingOrg"])
    },
    methods: {
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
      },
      createSuppliers() {
         this.$refs['formName'].validate((valid) => {
          if (valid) {
              this.form.id = this.$route.query.id;
              if (this.form.firstPickareaId === this.form.secondPickareaId) {
                this.$message.error("助拣货分区 不能等于 主拣货分区");
                return false;
              }
              PersonnelbindService.updateSupplier(this.form)
              .then((res) => {
                this.$message.success("更新成功");
                this.$store.dispatch("tagsView/delView", this.$route);
                this.$router.go(-1)
              })
              .catch((err) => {
                if (err) this.$message.error("更新失败" + err.message)
              })
          }
        })
      },
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1);
      },
      getDetail() {
        const id = this.$route.query.id;
        PersonnelbindService.getSuppliersDetail(id)
        .then((res) => {
            this.form.firstPickareaId = res.firstPickarea.id;
            this.form.secondPickareaId = res.secondPickarea.id;
            this.form.secondTaskTypeList = res.secondTaskTypeList;
            this.form.firstTaskTypeList = res.firstTaskTypeList;
            this.form.firstTaskType = res.firstTaskType;
            this.form.userId = res.userId;
        })
        .catch((err) => {
          if (err) this.$message.error("获取信息失败" + err.message)
        })
      }
    },
    created() {
      this.editData = JSON.parse(decodeURIComponent(this.$route.query.addData));
      this.getDetail();
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
        console.log(res);
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
