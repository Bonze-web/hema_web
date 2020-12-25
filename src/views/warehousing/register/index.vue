<template>
  <div class="table-index _table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="120px" label-position="right" >

        <el-form-item label="入库订单：">
          <el-input type="text" autofocus placeholder="请输入入库订单" v-model="form.barCodeLikes" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="司机联系方式：">
          <el-input type="text" placeholder="请输入司机联系方式" v-model="form.barCodeLikes" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="车辆号码：">
          <el-input type="text" placeholder="请输入车辆号码" v-model="form.barCodeLikes" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="状态：">
            <div class="input-width" >状态</div>
        </el-form-item>

        <el-form-item label="供应商：">
            <div class="input-width" >供应商</div>
        </el-form-item>

        <el-form-item label="要求送达时间：">
            <div class="input-width" >要求送达时间</div>
        </el-form-item>

        <el-form-item label="实际送达时间：">
            <div class="input-width" >{{time}}</div>
        </el-form-item>


        <el-form-item>
            <el-button type="primary" size="mini" @click="onSubmit" >到货登记</el-button>
        </el-form-item>
      </el-form>

      
    </div>
  </div>
</template>

<script>
import BasicService from "@/api/service/BasicService";

export default {
  data() {
    return {
      time: '',
      value1: '',
      listData: [], // 列表数据
      containerType: [], // 容器类型
      form: {
        barCodeLikes: '', // 条码
        useStatusEquals: '', // 状态
        positionCodeOrNameEquals: '', // 当前位置
        parentBarcodeLikes: '', // 父容器
        containerTypeCodeEquals: '', // 容器类型code值
        useNameOrCodeLikes: '' // 使用对象名称或者代码的值
      },
      page: 1,
      pageSize: 10,
      totalCount: 0
    };
  },
  computed: {
      
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val)
    },
    onSubmit: function() {
      const _this = this;
      this.page = 1;

      this.$refs.form.validate((result) => {
        if (result) {
          _this.quertOcntainer();
        }
      });
    },
    clearInput: function() {
      this.form = {
        barCodeLikes: '',
        useStatusEquals: '',
        positionCodeOrNameEquals: '',
        parentBarcodeLikes: '',
        containerTypeCodeEquals: '',
        useNameOrCodeLikes: ''
      };
    },
    quertOcntainer: function() {
      // 获取容器列表
      this.suppliersData = []

      const _this = this;

      const data = {
        page: this.page,
        pageSize: this.pageSize,
        barCodeLikes: this.form.barCodeLikes,
        useStatusEquals: this.form.useStatusEquals.toUpperCase(),
        positionCodeOrNameEquals: this.form.positionCodeOrNameEquals,
        parentBarcodeLikes: this.form.parentBarcodeLikes,
        containerTypeCodeEquals: this.form.containerTypeCodeEquals,
        useNameOrCodeLikes: this.form.useNameOrCodeLikes
      };

      BasicService.quertOcntainer(data).then((res) => {
        const records = res.records;

        this.totalCount = res.totalCount;

        console.log(records)

        _this.listData = records;
      }).catch(err => {
        this.$message.error("数据请求失败" + err.message)
      });
    },
    handleCurrentChange: function(e) {
      this.page = Number(e);
      this.quertOcntainer(true);
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e);
      this.page = 1;
      this.quertOcntainer(true);
    },
    getContainerType: function() {
      // 获取容器类型
      BasicService.getContainerTypeList({
        page: 1,
        pageSize: 0,
        statusEquals: 'ON'
      })
      .then(res => {
        this.containerType = res.records
      })
      .catch(err => {
        this.$message.error("获取容器类型失败" + err.message)
      })
    },
    printingBtn() {
      this.$message.error("打印功能还未开通")
    },
    getDateTime: function() {
      const data = new Date();
      const year = data.getFullYear();
      const moth = data.getMonth() + 1;
      const dat = data.getDate();
      const hos = data.getUTCHours();
      const mutes = data.getUTCMinutes();
      const secon = data.getUTCSeconds();

        function setZero(num) {
        if (num < 10) {
        num = '0' + num
        }
        return num
        }

        this.time = year + '-' + setZero(moth) + '-' + setZero(dat) + ' ' + setZero(hos) + ':' + setZero(mutes) + ':' + setZero(secon);
        }
    },
  created() {
    this.quertOcntainer();
    this.getContainerType() // 获容器类型
    
    setInterval(() => {
        this.getDateTime()
    }, 1000)
    // setTimeout(() => {
    //     let id = 'input'+this.form.id;
    // this.$refs[id].focus();
    // }, 500)
  },
//   beforeRouteEnter(to, from, next) {
//     next(vm => {
//       // 通过 `vm` 访问组件实例
//       vm.quertOcntainer(0);
//     })
//   },
  filters: {
    dcStatus(status) {
      switch (status) {
        case 'ON':
          return "已使用"
        case 'OFF':
          return "未使用"
        default:
          return '未知';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
</style>
<style lang="scss">
.table-index {
  @import "src/styles/mixin.scss";
  @include elTable;
}

._table-index .el-table .cell{
  padding: 7px 0;
}
</style>
