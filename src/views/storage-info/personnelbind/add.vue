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
              <el-form label-width="110px" :model="form">
                <el-form-item label="用户">
                  <el-select v-model="form.userId" placeholder="请选择用户">
                    <el-option v-for="(ele, idx) in userAll" :key="idx" :label="ele.username" :value="ele.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="主要拣货分区">
                    <el-select v-model="form.firstPickareaId" placeholder="请选择主要拣货分区">
                      <el-option v-for="(ele, idx) in firstPickareaIdArr" :key="idx" :label="'['+ ele.code + ']' + ele.name" :value="ele.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="辅助拣货分区">
                  <el-select v-model="form.secondPickareaId" placeholder="请选择主要拣货分区">
                    <el-option v-for="(ele, idx) in secondPickareaIdArr" :key="idx" :label="'['+ ele.code + ']' + ele.name" :value="ele.id"></el-option>
                  </el-select>
                </el-form-item>
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
        form: {
          firstPickareaId: "",
          secondPickareaId: "",
          userId: ''
        }
      }
    },
    computed: {
      ...mapGetters(["hasPermission", "workingOrg"])
    },
    methods: {
      createSuppliers() {
        PersonnelbindService.createSuppliers(this.form)
        .then((res) => {
            this.$message.success("创建成功");
            this.$store.dispatch("tagsView/delView", this.$route);
            this.$router.go(-1)
        })
        .catch((err) => {
          if (err) this.$message.error("获取信息失败" + err.message)
        })
      },
      back: function() {
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
      }
    },
    created() {
      PersonnelbindService.getPickareaQuery()
      .then((res) => {
        console.log(res.records);
          this.firstPickareaIdArr = res.records;
          this.secondPickareaIdArr = res.records;
      })
      .catch((err) => {
        if (err) this.$message.error("获取信息失败" + err.message);
      });
      PersonnelbindService.userQuery()
      .then((res) => {
        console.log(res);
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
