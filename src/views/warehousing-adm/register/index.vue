<template>
  <div class="table-index" >
    <div class="select-head">
      <h3>请扫描订单号码</h3>
      <div class="text-wrap">
 
          <div class="item">
            <span>入库订单：</span>
            <el-input ref="focusinput" v-model="billNumber" @blur="iptBlur"  type="text" placeholder="请输入入库订单"></el-input>
          </div>
          <div class="item">
            <span>司机联系方式：</span>
            <el-input type="tel" maxlength="11" v-model="objDate.driverPhone" placeholder="请输入司机联系方式"></el-input>
          </div>
          <div class="item">
            <span>车牌号码：</span>
            <el-input type="text" v-model="objDate.carNumber" placeholder="请输入车辆号码"></el-input>
          </div>

          <div class="item son-cls">
            <span>状态：</span>
            <div>{{ getData.status | setStatus }}</div>
          </div>
          <div class="item son-cls">
            <span>供应商：</span>
            <div>{{ getData.vendorName }}</div>
          </div>
          <div class="item son-cls">
            <span>要求送达时间：</span>
            <div>{{ getData.arrivalDate }}</div>
          </div>
          <div class="item son-cls">
            <span>实际送达时间：</span>
            <div>{{ objDate.realArrivalDate }}</div>
          </div>
      </div>

      <el-button class="btn" type="primary" size="mini" @click="onSubmit" >到货登记</el-button>

    </div>
  </div>
</template>

<script>
import WarehousingAdmServers from "@/api/service/WarehousingAdmServers";

export default {
  data() {
    return {
      billNumber: '', // 查询的入库订单编号
      objDate: {
        realArrivalDate: '',
        driverPhone: '',
        carNumber: ''
      },
      getData: {
        status: '', // 状态
        vendorName: '', // 供应商
        arrivalDate: ''
      }
    };
  },
  computed: {
      
  },
  methods: {
    iptBlur: function() {
      if (this.billNumber === '') return;
      // const _this = this;

      console.log(this.billNumber)

      WarehousingAdmServers.getByBillNumberOrderBill(this.billNumber)
      .then((res) => {
        this.getData = res;
        console.log(res)
      })
      .catch(err => {
        this.$message.error("查询失败" + err.message)
      });
    },
    onSubmit() {
      const _this = this;
      // const data = Object.assign(this.getData, this.objDate)
      const data = this.objDate;

      const cart = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$)/;
        
      const myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (!myreg.test(this.objDate.driverPhone)) {
        this.$message.error("手机号码输入有误")
        return false;
      }

      if (!cart.test(this.objDate.carNumber)) {
        this.$message.error("车牌号输入有误")
        return false;
      }

      // JSW0001OR141456234781
      WarehousingAdmServers.arriveOrderBill(data)
      .then((res) => {
        this.$message.success("入库单" + _this.billNumber + "到货登记成功")
        _this.objDate = {
          realArrivalDate: '',
          driverPhone: '',
          carNumber: ''
        }
        _this.billNumber = '';
        _this.getData = {}
        _this.iptFocus()
      })
      .catch(err => {
        this.$message.error("查询失败" + err.message)
      })
    },
    getDateTime: function() {
      const data = new Date();
      const year = data.getFullYear();
      const moth = data.getMonth() + 1;
      const dat = data.getDate();
      const hos = data.getHours();
      const mutes = data.getMinutes();
      const secon = data.getSeconds();

      function setZero(num) {
        if (num < 10) {
        num = '0' + num
        }
        return num
      }

      this.objDate.realArrivalDate = year + '-' + setZero(moth) + '-' + setZero(dat) + ' ' + setZero(hos) + ':' + setZero(mutes) + ':' + setZero(secon);
    },
    iptFocus() {
      // setTimeout(() => {
        this.$refs.focusinput.focus()
      // }, 300)
    }
  },
  created() {
    setInterval(() => {
        this.getDateTime()
    }, 1000)
  },
  mounted() {
    this.iptFocus()
  },
  filters: {
      setStatus(status) {
        switch (status) {
          case 'INITIAL':
            return "初始"
          case 'ARRIVED':
            return "已到货登记"
          case 'QUALITY ':
            return "已质检"
          case 'RECEIVING':
            return "进行中"
          case 'FINISHED':
            return "已完成"
          case 'ABORTED':
            return "已取消"
          default:
            return '未知';
        }
      }
  }
//   beforeRouteEnter(to, from, next) {
//     next(vm => {
//       // 通过 `vm` 访问组件实例
//       vm.quertOcntainer(0);
//     })
//   },
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

