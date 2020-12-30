<template>
  <div class="table-index _table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="180px" label-position="right" >

        <el-form-item label="质检单单号：">
          <el-input type="text" placeholder="请输入质检单单号" v-model="form.billNumberEquals" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="入库订单：">
          <el-input type="text" placeholder="请输入入库订单" v-model="form.orderbillIdNumber" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="质检状态：">
          <el-select v-model="form.status" placeholder="请选择质检状态" class="input-width" >
            <el-option value="" label="全部"></el-option>
            <el-option value="PENDING_QUALITY_INSPECTION" label="待质检"></el-option>
            <el-option value="FINISHED" label="已完成"></el-option>
            <el-option value="NFINISHED" label="未完成"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="质检日期：">
          <el-date-picker class="input-width picker-time" v-model="qualityTime" type="datetimerange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="onSubmit" >立即搜索</el-button>
          <el-button size="mini" @click="clearInput">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div style="height: 20px" />

    <div style="background: #fff;">
      <el-row>
        <!-- <router-link :to="{ path: '/basicinfo/container/add' }" >
          <el-button style="margin: 18px 10px" type="primary" size="mini" >新建</el-button>
        </router-link>

        <el-button style="margin: 18px 10px" size="mini" @click="printingBtn" >打印</el-button> -->

        <!-- <router-link  :to="{ path: '/warehousing-adm/quality/edit', query:{ id: '20202020' } }" >
          <el-button style="margin: 18px 10px" type="primary" size="mini" >测试跳往详情页面</el-button>
        </router-link> -->
      </el-row>


      <el-table :data="listData" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <!-- <el-table-column type="index" label="序号"></el-table-column> -->

        <el-table-column prop="scope" label="入库单号" style="height: 20px">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/warehousing-adm/quality/edit', query:{ id: scope.row.id } }" >
              <span>{{ scope.row.orderbillIdNumber }}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="创建人">
          <template slot-scope="scope">
            {{ scope.row.creatorName }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="收货类型" style="height: 20px">
          <template slot-scope="scope">{{ scope.row.type | setType }}</template>
        </el-table-column>

        <el-table-column prop="scope" label="质检单号">
          <template slot-scope="scope">
            {{ scope.row.orderNumber }}
          </template>
        </el-table-column>

        <el-table-column prop="actualInspectionNum" label="实检数量"></el-table-column>

        <el-table-column prop="unqualifiedNum" label="不合格数量"></el-table-column>

        <el-table-column prop="scope" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | setStatus }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="最后更新时间">
          <template slot-scope="scope">
            {{ scope.row.updateTime ? scope.row.updateTime : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="最后更新人">
          <template slot-scope="scope">
            {{ scope.row.updatorName }}
          </template>
        </el-table-column>

      </el-table>

      <el-pagination
          style="float:right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
      </el-pagination>

      
    </div>
  </div>
</template>

<script>
import WarehousingAdmServers from "@/api/service/WarehousingAdmServers";
// qualityInspection  列表get（opt）函数

export default {
  data() {
    return {
      listData: [], // 列表数据
      form: {
        billNumberEquals: '', // 质检单号
        orderbillIdNumber: '', // 入库单号
        status: '' // 质检状态
      },
      qualityTime: '', // 质检日期
      page: 1,
      pageSize: 10,
      totalCount: 0
    };
  },
  computed: {},
  methods: {
    onSubmit: function() {
      const _this = this;
      this.page = 1;

      this.$refs.form.validate((result) => {
        if (result) {
          _this.qualityInspection();
        }
      });
    },
    clearInput: function() {
      this.form = {
        billNumberEquals: '', // 质检单号
        orderbillIdNumber: '', // 入库单号
        status: '' // 质检状态
      };

      this.qualityTime = ''; // 质检日期
    },
    // putFinish(billNumber, version) {
    //   // 确认收货
    //   const _this = this;
    //   this.$confirm('是否确认收货?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     const obj = {
    //       billNumber,
    //       version
    //     }
    //     WarehousingAdmServers.finishOrderBill(obj)
    //     .then(res => {
    //       this.$message.success("收货成功")
    //       _this.qualityInspection()
    //     })
    //     .catch(err => {
    //       this.$message.error("收货失败" + err.message)
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消'
    //     })        
    //   })
    // },
    qualityInspection: function() {
      const _this = this;

      const data = {
        page: this.page,
        pageSize: this.pageSize
        // billNumberEquals: this.form.billNumberEquals, // 质检单号
        // orderbillIdNumber: this.form.orderbillIdNumber, // 入库单号
        // status: this.form.status, // 质检状态
        // orderTimeStart: this.qualityTime[0], // 质检开始时间
        // orderTimeEnd: this.qualityTime[1], // 质检结束时间
        // searchCount: true
      };

      WarehousingAdmServers.qualityInspection(data).then((res) => {
        console.log(res)
        const records = res.records;
        this.totalCount = res.totalCount;
        _this.listData = records;
      }).catch(err => {
        this.$message.error("数据请求失败" + err.message)
      });
    },
    handleCurrentChange: function(e) {
      this.page = Number(e);
      this.qualityInspection();
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e);
      this.page = 1;
      this.qualityInspection();
    },
    printingBtn() {
      // this.$message.error("打印功能还未开通")
    }
  },
  created() {
    this.qualityInspection();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.qualityInspection(0);
    })
  },
  filters: {
    setStatus(status) {
    // 质检单状态，PENDING_QUALITY_INSPECTION:待质检，FINISHED:已完成，UNFINISHED:未完成
      switch (status) {
        case 'PENDING_QUALITY_INSPECTION':
          return "待质检"
        case 'FINISHED':
          return "已完成"
        case 'UNFINISHED':
          return "未完成"
        default:
          return '未知';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.input-width{
    width: 200px;

    // &.picker-time{
    //     width: 580px;
    // }
}
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
