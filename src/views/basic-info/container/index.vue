<template>
  <div class="table-index _table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="90px" label-position="right" >

        <el-form-item label="条码：">
          <el-input type="text" placeholder="请输入条码" v-model="form.barCodeLikes" class="input-width" ></el-input>
        </el-form-item>

        <!-- 全部; IDLE 空闲; LOCKED 已锁定; USING 已使用;ABORTED 已作废;  -->
        <el-form-item label="状态：">
          <el-select v-model="form.useStatusEquals" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option value="IDLE" label="空闲"></el-option>
            <el-option value="LOCKED" label="已锁定"></el-option>
            <el-option value="USING" label="已使用"></el-option>
            <el-option value="ABORTED" label="已作废"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="当前位置：">
          <el-input type="text" placeholder="请输入当前位置" v-model="form.positionCodeOrNameEquals" class="input-width" ></el-input>
        </el-form-item>

        <!-- <el-form-item label="父容器：">
          <el-input type="text" placeholder="请输入父容器" v-model="form.parentBarcodeLikes" class="input-width" ></el-input>
        </el-form-item> -->

        <el-form-item label="容器类型：">
          <el-select v-model="form.containerTypeCodeEquals" placeholder="请选择容器类型">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in containerType" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="使用对象：">
          <el-input type="text" placeholder="请输入使用对象" v-model="form.useNameOrCodeLikes" class="input-width" ></el-input>
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
          <el-button style="margin: 18px 10px" type="primary" size="mini" v-if="hasPermission(PermIds.WMS_CONTAINER_CREATE)">新建</el-button>
        </router-link>

        <el-button style="margin: 18px 10px" size="mini" @click="printingBtn" >打印</el-button>
      </el-row>


      <el-table :data="listData" @selection-change="handleSelectionChange"  style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
        <el-table-column prop="barcode" label="条码" style="height: 20px">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/basicinfo/container/edit', query:{ id: scope.row.id} }" >
              <span>{{ scope.row.barcode }}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="useStatus" label="容器类型" style="height: 20px">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/basicinfo/containertype/edit', query:{ status: 'read', id: scope.row.containerTypeId} }">
              <span>{{ '[' + scope.row.containerTypeCode + ']' + scope.row.containerTypeName }}</span>
            </router-link>
          </template>
        </el-table-column>
  
        <el-table-column prop="scope" label="当前位置">
          <template slot-scope="scope">
            {{ scope.row.positionCode !== ' ' ? scope.row.positionCode : "&lt;空&gt;" }}
          </template>
        </el-table-column>
        <el-table-column prop="scope" label="目标位置">
          <template slot-scope="scope">
            {{ scope.row.toPositionCode !== ' ' ? scope.row.toPositionCode : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="使用对象">
          <template slot-scope="scope">
            {{ scope.row.useId !== '0' ? scope.row.useId : "&lt;空&gt;" }}
          </template>
        </el-table-column>
        
        <el-table-column prop="useStatus" label="状态">
          <template slot-scope="scope">
            {{ scope.row.useStatus | dcStatus }}
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
import BasicService from "@/api/service/BasicService";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      PermIds: PermIds,
      listData: [], // 列表数据
      containerType: [], // 容器类型
      form: {
        barCodeLikes: '', // 条码
        useStatusEquals: '', // 状态
        positionCodeOrNameEquals: '', // 当前位置
        // parentBarcodeLikes: '', // 父容器
        containerTypeCodeEquals: '', // 容器类型code值
        useNameOrCodeLikes: '' // 使用对象名称或者代码的值
      },
      page: 1,
      pageSize: 10,
      totalCount: 0
    };
  },
  computed: {
    ...mapGetters(["hasPermission"])
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
    // deleteWmsBintype: function(id, version) {
    //   // 删除
    //   // const _this = this;
    //   this.$confirm('此操作将删除货位，是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     // BasicService.deleteWmsBintype(id, version)
    //     // .then(res => {
    //     //   this.$message.success("删除成功")
    //     //   _this.quertOcntainer()
    //     // })
    //     // .catch(err => {
    //     //   this.$message.error("删除失败" + err.message)
    //     // })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消'
    //     })        
    //   })
    // },
    clearInput: function() {
      this.form = {
        barCodeLikes: '',
        useStatusEquals: '',
        positionCodeOrNameEquals: '',
        // parentBarcodeLikes: '',
        containerTypeCodeEquals: '',
        useNameOrCodeLikes: ''
      };

      this.quertOcntainer();
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
        // parentBarcodeLikes: this.form.parentBarcodeLikes,
        containerTypeCodeEquals: this.form.containerTypeCodeEquals,
        useNameOrCodeLikes: this.form.useNameOrCodeLikes,
        searchCount: true
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
  filters: {
    dcStatus(useStatus) {
      // 全部; IDLE 空闲; LOCKED 已锁定; USING 已使用;ABORTED 已作废; 
      // const useStatu = useStatus.toLowerCase();
      console.log(useStatus)

      switch (useStatus) {
        case 'IDLE':
          return "空闲"
        case 'LOCKED':
          return "已锁定"
        case 'USING':
          return "已使用"
        case 'ABORTED':
          return "已作废"
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
