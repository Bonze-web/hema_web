<template>
    <div class="table-index">
      <div class="select-head">
            <el-form ref="form" style="display:flex;flex-wrap:wrap" :model="form" label-width="80px" label-position="right">
                <el-form-item label="单号">
                    <el-input type='text' clearable placeholder="请输入类别编号/名称" v-model="form.billNumber" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="移库员">
                    <el-autocomplete
                      class="inline-input"
                      v-model="form.decerNameLikes"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入移库员"
                      :trigger-on-focus="false"
                      @select="handleSelect"
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="移库类型">
                    <el-select v-model="form.moveType" placeholder="请选择移库类型">
                      <el-option v-for="item in billList" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="onSelect">立即搜索</el-button>
                    <el-button size="mini"  @click="clearInput">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="height:20px" />
        <div style="background:#fff;">
          <div class="btn">
            <el-row>
              <!-- <router-link :to="{ path: '/wrhmanagement/movebill/add', query:{ status: 'create'} }"> -->
                  <el-button type="primary" @click="createNew" size="mini" v-if="hasPermission(PermIds.WMS_INCINVBILL_CREATE)">新建</el-button>
              <!-- </router-link> -->
            </el-row>
            <el-row style="margin-left:12px">
              <el-button type="primary" size="mini" @click="table = true">管理移库类型</el-button>
            </el-row>
          </div>
          <el-table
                :data="lossBill"
                style="width: 100%;text-align:center"
                :row-style="{height: '16px',padding: '-4px'}"
                :default-sort = "{prop: 'billNumber'}"
            >
                <el-table-column sortable prop="billNumber" label="单号">
                    <template slot-scope="scope">
                        <router-link style="color:#409EFF" :to="{ path: '/wrhmanagement/movebill/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.billNumber }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="moveType" label="移库类型"></el-table-column>
                <!-- <el-table-column prop="wrhCode" label="仓库">
                  <template slot-scope="scope">
                    {{ '[' + scope.row.wrhCode + ']' + scope.row.wrhName }}
                  </template>
                </el-table-column> -->
                <el-table-column prop="moverName" label="报告员">
                  <template slot-scope="scope">
                    {{ scope.row.moverName }}
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="status" label="状态">
                  <template slot-scope="scope">
                    {{ scope.row.status | billStatus }}
                  </template>
                </el-table-column>
                <el-table-column prop="srcBillNumber" label="来源单号"></el-table-column>
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




  <!-- 管理移库类型抽屉 -->
        <el-drawer
            :visible.sync="table"
            direction="rtl"
            :with-header="false"
            size="50%"
          >
            <div class="loss-type-box"><bill-type billTitle="移库类型" :billList="billList" lossType="MOVESTOCK" @getAlllossType="getAlllossType" @goBack="goBack"></bill-type></div>
          </el-drawer>
    </div>
</template>

<script>
import MemberService from '@/api/service/MemberService'
import billType from '../../../components/billType.vue';
import BillTypeService from '@/api/service/BillTypeService'
import BillService from "@/api/service/BillService";
import PermIds from "@/api/permissionIds";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
      return {
        restaurants: [], // 用户列表
        PermIds: PermIds,
        table: false,
        billList: [],
        form: {
          searchCount: true,
          moveType: '',
          billNumber: '', // 单据号
          moverId: '' // 报告员ID
        },
        lossBill: [],
        page: 1,
        pageSize: 10,
        totalCount: 0
      }
    },
  components: {
    billType
  },
  computed: {
    ...mapGetters(["hasPermission"])
  },
  methods: {
    ...mapActions(["addMove", "clearMove"]),
    goBack: function() {
      this.table = false
    },
    createNew: function() {
      this.clearMove()
      this.$router.push({path: '/wrhmanagement/movebill/add', query: {status: 'create'}})
    },
    handleCurrentChange: function(e) {
      this.page = Number(e)
      this.getMovebillList()
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e)
      this.page = 1
      this.getMovebillList()
    },
    querySearch: function(queryString, cb) {
          // 搜索报损人
          const restaurants = this.restaurants;
          const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
          // 调用 callback 返回建议列表的数据
          cb(results);
      },
      handleSelect: function(e) {
        console.log(e)
        this.form.moverId = e.id
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
    onSelect: function() {
      this.getMovebillList()
    },
    clearInput: function() {
      this.form = {
          searchCount: true,
          moveType: '',
          billNumber: '', // 单据号
          moverId: '' // 报告员ID
        }
      this.getMovebillList()
    },
    getAlllossType: function() {
      const data = {
        type: 'MOVESTOCK'
      }
      BillTypeService.getQueryType(data)
      .then((res) => {
        this.billList = res
      })
      .catch((err) => {
        this.$message.error('获取移库类别失败' + err.message)
      })
    },
    getMovebillList: function() {
      const _this = this
      _this.form = {
        page: _this.page,
        pageSize: _this.pageSize,
        searchCount: true,
        moveType: _this.form.moveType ? _this.form.moveType : null,
        billNumber: _this.form.billNumber ? _this.form.billNumber : null, // 单据号
        moverId: _this.form.moverId ? _this.form.moverId : null // 报告员ID
      }
      BillService.getMovebillList(_this.form)
      .then((res) => {
        _this.lossBill = res.records
        _this.totalCount = res.totalCount
      })
      .catch((err) => {
        _this.$message.error('获取单据列表失败' + err.message)
      })
    },
    getUsers: function() {
        MemberService.query(1, 0)
        .then((res) => {
          res.records.forEach((item) => {
            const obj = {
              value: item.username,
              id: item.id
            }
            this.restaurants.push(obj)
          })
        }).catch((err) => {
          this.$message.error('获取用户列表失败' + err.message)
        })
      }
  },
  created() {
    this.getAlllossType()
    this.getMovebillList()
    this.getUsers()
  },
  beforeRouteEnter(to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.getMovebillList();
        vm.getAlllossType()
      })
    },
  filters: {
    billStatus(status) {
        switch (status) {
          case "INITIAL":
            return "初始状态"
          case "RUNNING":
            return "移库中"
          case "FINISHED":
            return "已完成"
          default:
            return "未知"
        }
      }
  }
};
</script>

<style lang="scss" scoped>
.loss-type-box{
    padding: 16px;
}
.btn{
  display:flex;
  padding:18px 10px
}
/deep/ .el-table .cell{
  // line-height: 16px;
  padding: 6px;
}
</style>
<style lang="scss">
.table-index{
@import "src/styles/mixin.scss";
@include elTable;
}
</style>