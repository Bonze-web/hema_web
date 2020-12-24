<template>
  <div class="table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="90px" label-position="right" >

        <el-form-item label="条码：">
          <el-input type="text" placeholder="请输入条码" v-model="form.barCodeLikes" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="状态：">
          <el-select v-model="form.useStatusEquals" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option value="idle" label="空闲"></el-option>
            <el-option value="locked" label="已锁定"></el-option>
            <el-option value="receiving" label="收货中"></el-option>
            <el-option value="rtnwrhreceiving" label="好退退仓收货中"></el-option>
            <el-option value="rtnvendorreceiving" label="返厂退仓收货中"></el-option>
            <el-option value="moving" label="平移中"></el-option>
            <el-option value="allocating" label="分播中"></el-option>
            <el-option value="putawaying" label="上架中"></el-option>
            <el-option value="rtnputawaying" label="退仓上架中"></el-option>
            <el-option value="mergering" label="拆并中"></el-option>
            <el-option value="shifting" label="移库中"></el-option>
            <el-option value="aborted" label="已作废"></el-option>
            <el-option value="stacontainermovelocked" label="移库锁定"></el-option>
            <el-option value="useing" label="已使用"></el-option>
            <el-option value="pickuping" label="拣货中"></el-option>
            <el-option value="handovering" label="交接中"></el-option>
            <el-option value="shiping" label="装车中"></el-option>
            <el-option value="shiped" label="已装车"></el-option>
            <el-option value="instore" label="在门店"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="当前位置：">
          <el-input type="text" placeholder="请输入当前位置：" v-model="form.positionCodeOrNameEquals" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="父容器：">
          <el-input type="text" placeholder="请输入父容器：" v-model="form.parentBarcodeLikes" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="容器类型：">
          <el-select v-model="form.containerTypeCodeEquals" placeholder="请选择容器类型：">
            <el-option v-for="(item, index) in containerType" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="使用对象：">
          <el-input type="text" placeholder="请输入使用对象：" v-model="form.useNameOrCodeLikes" class="input-width" ></el-input>
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
        <router-link :to="{ path: '/basicinfo/container/add' }" >
          <el-button style="margin: 18px 10px" type="primary" size="mini" >新建</el-button>
        </router-link>

        <el-button style="margin: 18px 10px" size="mini" >打印</el-button>
      </el-row>


      <el-table :data="listData" @selection-change="handleSelectionChange"  style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >

        <!-- <el-table-column  type="selection"  style="height: 20px"></el-table-column> -->

        <el-table-column prop="code" label="条码" style="height: 20px">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/basicinfo/container/edit' }" >
              <span>{{ scope.row.code }}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="code" label="容器类型" style="height: 20px">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/basicinfo/container-type' }" >
              <span>{{ scope.row.code }}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="当前位置"></el-table-column>
        <el-table-column prop="length" label="目标位置"></el-table-column>
        <el-table-column prop="width" label="使用对象"></el-table-column>
        <el-table-column prop="height" label="状态"></el-table-column>

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
import BasicService from "@/api/service/BasicService";

export default {
  data() {
    return {
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
  computed: {},
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
    deleteWmsBintype: function(id, version) {
      // 删除
      // const _this = this;
      this.$confirm('此操作将删除货位，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // BasicService.deleteWmsBintype(id, version)
        // .then(res => {
        //   this.$message.success("删除成功")
        //   _this.quertOcntainer()
        // })
        // .catch(err => {
        //   this.$message.error("删除失败" + err.message)
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })        
      })
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

      console.log(this.form.useStatusEquals.toUpperCase())

      const data = {
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
    }
  },
  created() {
    this.quertOcntainer();
    this.getContainerType() // 获容器类型
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.quertOcntainer(0);
    })
  },
  filters: {}
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";

.table-index .el-table .cell{
  padding: 7px 0;
}
</style>
<style lang="scss">
.table-index {
  @import "src/styles/mixin.scss";
  @include elTable;
}
</style>