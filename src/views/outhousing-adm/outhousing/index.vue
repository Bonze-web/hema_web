<template>
    <div class="table-index _table-index">        
        <div class="select-head">
            <el-form ref="form" style="display:flex;flex-wrap:wrap;" :model="form" label-width="130px" label-position="right">
                <el-form-item label="仓区作业单">
                    <!-- 输入仓区作业单的id,方便后面的查找,查找和一开始获取数据的接口是同一个 -->
                    <el-input type='text' placeholder="请输入代码/名称" v-model="form.billNumber" class="input-width"></el-input>
                    <!-- <el-input type='text' placeholder="请输入名称" v-model="form.name" class="input-width"></el-input> -->
                </el-form-item>
                <el-form-item label="所属区域编码">
                    <el-input type='text' placeholder="请输入所属区域编码" v-model="form.blockCode" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="所属网格仓">
                    <el-input type='text' placeholder="请输入所属网格仓" v-model="form.frontDcInfo" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="门店信息">
                    <el-input type='text' placeholder="请输入门店信息" v-model="form.storeInfo" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="仓区信息">
                    <el-input type='text' placeholder="请输入仓区信息" v-model="form.wrhInfo" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="外部单号(物流号)">
                    <el-input type='text' placeholder="请输入外部单号" v-model="form.sourceBillId" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="外部单号(子物流号)">
                    <el-input type='text' placeholder="请输入外部单号" v-model="form.sourceSubBillId" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="是否测试单">
                    <el-select v-model="form.isTest" placeholder="请选择状态">
                      <el-option label="是" :value="true"></el-option>
                      <el-option label="否" :value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择状态">
                      <el-option label="初始" value="INITIAL"></el-option>
                      <el-option label="进行中" value="RUNNING"></el-option>
                      <el-option label="已完成" value="FINISHED"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="onSubmit">立即搜索</el-button>
                    <el-button size="mini"  @click="clearInput">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        
        <div style="height:20px" />

        <div style="background:#fff">
            <el-table
                :data="suppliersData"
                style="width: 100%"
            >
                <el-table-column prop="billNumber" label="作业单号">
                    <template slot-scope="scope">
                        <router-link style="color:#409EFF" :to="{ path: '/outhousing-adm/outhousing/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.billNumber }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="sourceBillId" label="外部单号(物流)">
                    <template slot-scope="scope">
                       <span>{{ scope.row.sourceBillId }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sourceSubBillId" label="外部单号(子物流)">
                    <template slot-scope="scope">
                       <span>{{ scope.row.sourceSubBillId }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="blockCode" label="所属区块编码">
                   <template slot-scope="scope">
                        {{ scope.row.blockCode }}
                    </template>
                </el-table-column>
                <el-table-column prop="frontDcCode" label="所属网格仓">
                    <template slot-scope="scope">
                        {{ '[' + scope.row.frontDcCode + ']' + scope.row.frontDcName }}
                    </template>
                </el-table-column>
                <el-table-column prop="frontDcCode" label="门店">
                    <template slot-scope="scope">
                        {{ '[' + scope.row.storeCode + ']' + scope.row.storeName }}
                    </template>
                </el-table-column>
                <el-table-column prop="isTest" label="是否测试单">
                    <template slot-scope="scope">
                        {{ scope.row.isTest | isTestType }}
                    </template>
                </el-table-column>
                <el-table-column prop="wrhCode" label="仓区">
                    <template slot-scope="scope">
                        {{ '[' + scope.row.wrhCode + ']' + scope.row.wrhName }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" >
                  <template slot-scope="scope">
                    {{ scope.row.status | suppliersStatus }}
                  </template>
                </el-table-column>
                <el-table-column prop="distDate" label="配送日期" >
                  <template slot-scope="scope">
                    {{ scope.row.distDate }}
                  </template>
                </el-table-column>
            </el-table>
            <!-- 下面这个是翻页 -->
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
// 引入公共模块
import OuthousingService from "@/api/service/OuthousingService";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  data() {
      return {
        PermIds: PermIds,
        suppliersId: '',
        page: 1,
        pageSize: 10,
        totalCount: 0,
        form: {
          billNumber: '',
          blockCode: '',
          status: '',
          distDateEnd: '',
          distDateStart: '',
          frontDcInfo: '',
          isTest: '',
          searchCount: true,
          sourceSubBillId: '',
          storeInfo: '',
          wrhInfo: ''
        },
        suppliersData: [],
        multipleSelection: [] // 选择的列表
      }
  },
  computed: {
       ...mapGetters(["hasPermission", "workingOrg"])
  },
  methods: {
    // 搜索功能
      onSubmit: function() {
        this.page = 1;
        this.$refs.form.validate(result => {
          if (result) {
            this.getSuppliersList()
          }
        })
      },
      clearInput: function() {
        this.form = {
          billNumber: '',
          blockCode: '',
          status: '',
          distDateEnd: '',
          distDateStart: '',
          frontDcInfo: '',
          isTest: '',
          searchCount: true,
          sourceSubBillId: '',
          storeInfo: '',
          wrhInfo: ''
        };
        this.getSuppliersList();
      },
      // 向后台请求数据,这里是查询功能和一开始就调取数据列表
      getSuppliersList: function() {
       // 请求仓区作业单的数据
        const _this = this;    
        // 将当前组件的实例记录起来，这些都是我在data中自己写的数据
        this.form.page = this.page;
        this.form.pageSize = this.pageSize;
        // 获取数据,然后将自己组件中的数据发送到后台
        OuthousingService.getSuppliersList(this.form)
        .then((res) => {
          // 初始化自己定义的数据
          this.suppliersData = res.records;
          _this.totalCount = res.totalCount;
        })
        .catch((err) => {
          this.$message.error("获取详情失败" + err.message)
        })
      },
      // 这里是修改当前值的地方
      handleCurrentChange: function(e) {
        this.page = Number(e)
        this.getSuppliersList()
      },
      handleSizeChange: function(e) {
        this.pageSize = Number(e)
        this.page = 1
        this.getSuppliersList()
      }
  },
  created() {
    this.getSuppliersList();
  },
  filters: {
    isTestType(type) {
      switch (type) {
        case true:
          return "是"
        case false:
          return "否"
      }
    },
    sourceType(type) {
      switch (type) {
        case "HAND":
          return "手动创建"
        case "IMPORT":
          return "文件导入"
        default:
          return '未知';
      }
    },
    suppliersStatus(status) {
      switch (status) {
        case "INITIAL":
          return "初始"
        case "RUNNING":
          return "进行中"
        case "FINISHED":
          return '已完成';
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // vm.getSuppliersList();
    })
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
</style>

<style lang="scss">
.table-index{
@import "src/styles/mixin.scss";
@include elTable;
}

._table-index .el-table .cell{
  padding:  7px 0 !important;
}
</style>