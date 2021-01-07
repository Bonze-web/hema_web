<template>
  <div class="table-index _table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="90px" label-position="right" >

        <el-form-item label="区块代码：">
          <el-input type="text" maxlength="32" placeholder="请输入区块代码" v-model="form.codeLikes" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="中心仓：">
          <el-input type="text"  maxlength="32" placeholder="请输入中心仓" v-model="form.centerCodeOrNameLikes" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="网格仓：">
          <el-input type="text"  maxlength="32" placeholder="请输入网格仓" v-model="form.frontCodeOrNameLikes" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="来源：">
          <!-- 全部; 手工新建MANUAL、接口导入API、文件导入EXCEL -->
          <el-select v-model="form.sourceWayEquals" placeholder="请选择来源">
            <el-option label="全部" value=""></el-option>
            <el-option value="MANUAL" label="手工新建"></el-option>
            <el-option value="API" label="接口导入"></el-option>
            <el-option value="EXCEL" label="文件导入"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="onSubmit" >立即搜索</el-button>
          <el-button size="mini" @click="clearInput">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div style="height: 20px" />

    <div style="background: #fff;">
      <!-- <el-row>
        <router-link :to="{ path: '/basicinfo/container/add' }" >
          <el-button style="margin: 18px 10px" type="primary" size="mini" v-if="hasPermission(PermIds.WMS_CONTAINER_CREATE)">新建</el-button>
        </router-link>

        <el-button style="margin: 18px 10px" size="mini" @click="printingBtn" >打印</el-button>
      </el-row> -->


      <el-table :data="listData" @selection-change="handleSelectionChange"  style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
        <!-- <el-table-column prop="barcode" label="区块代码" style="height: 20px">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/basicinfo/container/edit', query:{ id: scope.row.id} }" >
              <span>{{ scope.row.barcode }}</span>
            </router-link>
          </template>
        </el-table-column> -->

        <el-table-column prop="scope" label="区块代码">
          <template slot-scope="scope">
            {{ scope.row.code !== ' ' ? scope.row.code : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="中心仓代码">
          <template slot-scope="scope">
            {{ scope.row.centerDcCode !== ' ' ? scope.row.centerDcCode : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="中心仓名称">
          <template slot-scope="scope">
            {{ scope.row.centerDcName !== ' ' ? scope.row.centerDcName : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="所属网格仓">
          <template slot-scope="scope">
            {{ scope.row.frontDcName !== ' ' ? scope.row.frontDcName : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="来源">
          <template slot-scope="scope">
            {{ scope.row.sourceWay | setSourceWay }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="备注">
          <template slot-scope="scope">
            {{ scope.row.remark !== ' ' ? scope.row.remark : "&lt;空&gt;" }}
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
import request from '@/utils/request'
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      PermIds: PermIds,
      listData: [], // 列表数据
      containerType: [], // 容器类型
      form: {
        codeLikes: '', // 区块代码
        centerCodeOrNameLikes: '', // 中心仓
        frontCodeOrNameLikes: '', // 网格仓
        sourceWayEquals: '' // 来源
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
    clearInput: function() {
      this.form = {
        codeLikes: '', // 区块代码
        centerCodeOrNameLikes: '', // 中心仓
        frontCodeOrNameLikes: '', // 网格仓
        sourceWayEquals: '' // 来源
      };

      this.quertOcntainer();
    },
    quertOcntainer: function() {
      const data = {
        page: this.page,
        pageSize: this.pageSize,
        searchCount: true,
        codeLikes: this.form.codeLikes, // 区块代码
        centerCodeOrNameLikes: this.form.centerCodeOrNameLikes, // 中心仓
        frontCodeOrNameLikes: this.form.frontCodeOrNameLikes, // 网格仓
        sourceWayEquals: this.form.sourceWayEquals ? this.form.sourceWayEquals : null // 来源
      };

      request.get('/wms/block/query', { params: data })
      .then((res) => {
        console.log(res)
        const records = res.records;

        this.totalCount = res.totalCount;

        this.listData = records;
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
    printingBtn() {
      this.$message.error("打印功能还未开通")
    }
  },
  created() {
    this.quertOcntainer();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.quertOcntainer(0);
    })
  },
  filters: {
    setSourceWay(type) {
      // 来源:手工新建MANUAL、接口导入API、文件导入EXCEL
      switch (type) {
        case 'MANUAL':
          return "手工新建"
        case 'API':
          return "接口导入"
        case 'EXCEL':
          return "文件导入"
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
