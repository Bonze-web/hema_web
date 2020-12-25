<template>
  <div class="table-index" >
    <div class="select-head">
      <h3>请扫描订单号码</h3>
      <div class="text-wrap">
          <div class="item">
            <span>入库订单：</span>
            <el-input autofocus type="text" placeholder="请输入入库订单"></el-input>
          </div>
          <div class="item">
            <span>司机联系方式：</span>
            <el-input type="text" placeholder="请输入司机联系方式"></el-input>
          </div>
          <div class="item">
            <span>车辆号码：</span>
            <el-input type="text" placeholder="请输入车辆号码"></el-input>
          </div>
          <div class="item son-cls">
            <span>状态：</span>
            <div>状态</div>
          </div>
          <div class="item son-cls">
            <span>供应商：</span>
            <div>供应商</div>
          </div>
          <div class="item son-cls">
            <span>要求送达时间：</span>
            <div>要求送达时间</div>
          </div>
          <div class="item son-cls">
            <span>实际送达时间：</span>
            <div>{{ time }}</div>
          </div>
      </div>

      <el-button class="btn" type="primary" size="mini" @click="onSubmit" >到货登记</el-button>

    </div>
  </div>
</template>

<script>
// import BasicService from "@/api/service/BasicService";

export default {
  data() {
    return {
      time: '',
      value1: '',
      listData: [], // 列表数据
      containerType: [], // 容器类型
      createRules: {
          num: [
            { required: true, message: '请输入容器数量', trigger: 'blur' },
            { pattern: /^\d{1,6}(\.\d+)?$/, message: '请输入1-6之间的数字', trigger: 'change' }
          ],
          prefix: [
            { required: true, message: '请输入前缀', trigger: 'blur' },
            { required: true, max: 4, message: '请输入1-4为之间的数字', trigger: 'change' }
          ],
          startCode: [
            { required: true, message: '请输入起始条码段', trigger: 'blur' },
            { required: true, max: 12, message: '请输入1-12位之间的数字', trigger: 'change' }
          ]
        }
    };
  },
  computed: {
      
  },
  methods: {
    onSubmit: function() {
      const _this = this;
      this.page = 1;

      this.$refs.form.validate((result) => {
        if (result) {
          _this.quertOcntainer();
        }
      });
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
    setInterval(() => {
        this.getDateTime()
    }, 1000)
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
.table-index .select-head {
    background: #fff;
    padding: 15px 0 8px 0;
    border-radius: 12px;
    border: 1px #eee solid;
}

.select-head{
  & > h3 {
    text-align: center;
  }

  .btn{
    display: block;
    margin: 10px auto;
  }

  .text-wrap{
    display: flex;
    flex-direction: column;
    width: 400px;
    margin: 10px auto;

    .item{
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 13px;
      height: 30px;
      margin-bottom: 5px;

      &.son-cls{
        height: 22px;
      }

      span{
        width: 140px;
        text-align: right;
        margin-right: 4px;
      }

      div,input{
        flex: 1;
        color: #606266;
      }
    }
  }
}
</style>

