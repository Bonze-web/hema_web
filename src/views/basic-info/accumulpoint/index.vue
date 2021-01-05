<template>
    <div class="table-index">        
        <div class="select-head">
            <el-form ref="form" style="display:flex; flex-wrap:wrap;" :model="form" label-width="110px" label-position="right">
                <el-form-item label="团点">
                    <el-input type='text' placeholder="请输入代码/名称" v-model="form.codeOrNameEquals" class="input-width"></el-input>
                </el-form-item>

                <el-form-item label="联系人">
                    <el-input type='text' placeholder="请输入手机号/姓名" v-model="form.contactorNameOrMobileLikes" class="input-width"></el-input>
                </el-form-item>

                <el-form-item label="地址">
                    <el-input type='text' placeholder="请输入地址" v-model="form.addressLikes" class="input-width"></el-input>
                </el-form-item>

                <el-form-item label="网格仓">
                    <el-input type='text' placeholder="请输入网格仓" v-model="form.frontCodeOrNameLikes" class="input-width"></el-input>
                </el-form-item>

                <el-form-item label="来源">
                  <el-select v-model="form.sourceWayEquals" placeholder="请选择来源">
                    <el-option label="手工新建" value="MANUAL"></el-option>
                    <el-option label="接口导入" value="API"></el-option>
                    <el-option label="文件导入" value="EXCEL"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
                    <el-button size="mini"  @click="clearInput">重置</el-button>
                </el-form-item>

            </el-form>
        </div>
        <div style="height:20px;background:#fff"/>
        <div style="background:#fff">
          <!-- <el-row>
            <router-link :to="{ path: '/storageinfo/personnelbind/add', query:{ status: 'create'} }">
              <el-button style="margin:18px 10px" type="primary" size="mini" v-if="hasPermission(PermIds.WMS_USER_PICKAREA_CREATE) && workingOrg.type === 'DC'">新建</el-button>
            </router-link>
          </el-row> -->
            <el-table
                :data="suppliersData"
                style="width: 100%;text-align:center"
            >
                <!-- <el-table-column
                    type="selection"
                    width="55">
                </el-table-column> -->
                <el-table-column prop="code" label="团点">
                    <template slot-scope="scope">
                        <span>{{ '[' + scope.row.code + ']' + scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="地址">
                    <template slot-scope="scope">
                        {{ scope.row.address }}
                    </template>
                </el-table-column>
                <el-table-column label="所属区块编码">
                    <template slot-scope="scope">
                        {{ scope.row.blockCode }}
                    </template>
                </el-table-column>
                <el-table-column label="所属中心仓">
                    <template slot-scope="scope">
                        {{ '[' + scope.row.centerDcCode + ']' + scope.row.centerDcName }}
                    </template>
                </el-table-column>
                <el-table-column label="联系人电话">
                    <template slot-scope="scope">
                        {{ scope.row.contactPhone }}
                    </template>
                </el-table-column>
                <el-table-column label="联系人姓名">
                    <template slot-scope="scope">
                        {{ scope.row.contactor }}
                    </template>
                </el-table-column>
                <el-table-column label="所属网格仓">
                    <template slot-scope="scope">
                        {{ '[' + scope.row.frontDcCode + ']' + scope.row.frontDcName }}
                    </template>
                </el-table-column>
                <el-table-column label="纬度">
                    <template slot-scope="scope">
                        {{ scope.row.lat }}
                    </template>
                </el-table-column>
                <el-table-column label="经度">
                    <template slot-scope="scope">
                        {{ scope.row.lng }}
                    </template>
                </el-table-column>
                <el-table-column label="来源">
                    <template slot-scope="scope">
                        {{ scope.row.sourceWay | sourceType }}
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{ scope.row.status | purposeChange }}
                    </template>
                </el-table-column>
                <el-table-column label="邮编">
                    <template slot-scope="scope">
                        {{ scope.row.zipCode }}
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        {{ scope.row.remark }}
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
import AccumulpointService from "@/api/service/AccumulpointService";
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
          codeOrNameEquals: '',
          contactorNameOrMobileLikes: '',
          frontCodeOrNameLikes: '',
          sourceWayEquals: '',
          addressLikes: '',
          searchCount: true
        },
        suppliersData: []
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
          codeOrNameEquals: '',
          contactorNameOrMobileLikes: '',
          frontCodeOrNameLikes: '',
          sourceWayEquals: '',
          addressLikes: '',
          searchCount: true
        };
        this.getSuppliersList();
      },
      // 向后台请求数据,这里是查询功能和一开始就调取数据列表
      getSuppliersList: function(reset) {
        // 请求码头的数据
        const _this = this;    
        // 将当前组件的实例记录起来，这些都是我在data中自己写的数据
        this.form.page = this.page;
        this.form.pageSize = this.pageSize;
        // 获取数据,然后将自己组件中的数据发送到后台
        AccumulpointService.getStoreQuery(this.form)
        .then((res) => {
          // 初始化自己定义的数据
          _this.suppliersData = res.records;
          _this.totalCount = res.totalCount;
        })
        .catch((err) => {
          if (err) _this.$message.error("获取信息失败" + err.message)
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
    sourceType(type) {
      switch (type) {
        case "MANUAL":
          return "手工新建"
        case "API":
          return "接口导入"
        case "EXCEL":
          return "文件导入"
      }
    },
    suppliersStatus(status) {
      switch (status) {
        case true:
          return "启用"
        case false:
          return "禁用"
        default:
          return '未知';
      }
    },
    purposeChange(status) {
      switch (status) {
        case 'ON':
          return "启用"
        case 'OFF':
          return "禁用";
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getSuppliersList();
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
