<template>
    <div>
        <router-link :to="{ path: '/basicinfo/suppliers/edit', query:{ status: 'create'} }">
            <!-- <span v-if="child.meta&&child.meta.title" :title="child.meta.title">{{child.meta.title}}</span> -->
            <el-button style="float:right;margin:18px 10px" type="primary">新增供应商</el-button>
        </router-link>
        
        <div class="select-head">
            <el-form ref="form" style="display:flex" :model="form" label-width="60px" label-position="right">
                <el-form-item label="供应商">
                    <el-input type='text' placeholder="请输入供应商编号/名称" v-model="form.name" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择状态">
                    <el-option label="全部" value="ALL"></el-option>
                    <el-option label="启用" value="OPEN"></el-option>
                    <el-option label="停用" value="COLOSED"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">立即搜索</el-button>
                    <el-button  @click="clearInput">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="height:20px" />
        <div>
            <el-table
                :data="suppliersData"
                style="width: 100%;text-align:center"
                @selection-change="allSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column fixed prop="code" label="代码">
                    <template slot-scope="scope">
                        <router-link :to="{ path: '/basicinfo/suppliers/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.code }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称" width="50"></el-table-column>
                <el-table-column prop="anotherName" label="简称"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column prop="sourceType" label="来源方式" ></el-table-column>
                <el-table-column
                fixed="right"
                label="状态"
                width="200">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
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
import SellerService from "@/api/service/SellerService";
// import { mapGetters } from "vuex";

export default {
  data() {
      return {
        suppliersId: '',
        sellerInfo: false,
        mbrInfo: {}, // 卖家详情
        reason: '', // 拒绝理由
        sellerId: '', // 卖家Id
        dialogFormVisible: false, // 填写拒绝理由
        page: 1,
        pageSize: 10,
        totalCount: 0,
        form: {
          name: '',
          status: ''
        },
        suppliersData: [],
        multipleSelection: [] // 选择的列表
      }
    },
  computed: {
  },
  methods: {
      onSubmit: function() {
        this.page = 1
        this.$refs.form.validate(result => {
        if (result) {
          this.getRegistList(true)
        }
      })
      },
      getSellerInfo: function(sellerId) {
        this.sellerInfo = true
        SellerService.getSellerInfo(sellerId)
        .then((res) => {
          this.mbrInfo = res
        })
      },
      clearInput: function() {
        this.form = {
          mobile: '',
          name: '',
          registStatus: '',
          registTime: ''
        }
      },
      notAgreeClick: function(sellerId) {
        if (this.reason === '') {
          this.$message.error('请输入拒绝理由')
          return
        }
        SellerService.notAgree(this.sellerId, this.reason)
        .then((res) => {
          this.$message.success('审核成功')
          this.getRegistList(true)
          this.dialogFormVisible = false
          this.reason = ''
        })
        .catch((err) => {
          this.$message.error('审核失败' + err)
        })
      },
      notAgree: function(sellerId) {
        if (this.dialogFormVisible) {
          this.reason = ''
        }
        this.dialogFormVisible = true
        this.sellerId = sellerId
      },
      getRegistList: function(reset) {
        const _this = this
        const data = {
          page: this.page,
          pageSize: this.pageSize,
          searchCount: true
        }
        const startTime = new Date(this.form.registTime[0])
        const endTime = new Date(this.form.registTime[1])
        if (reset) {
          data.name = this.form.name
          data.mobile = this.form.mobile
          data.status = this.form.registStatus
          data.applicationTimeBegin = startTime.getFullYear() + '-' + (startTime.getMonth() + 1) + '-' + startTime.getDate() + ' ' + '00:00:00'
          data.applicationTimeEnd = endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate() + ' ' + '00:00:00'
        }
        SellerService.getRegistSeller(data)
        .then((res) => {
          _this.registData = []
          console.log(res)
          this.totalCount = res.totalCount
          for (const item in res.records) {
            const obj = {
              name: res.records[item].name,
              mobile: res.records[item].mobile,
              cityAndDistrict: res.records[item].city + res.records[item].district,
              status: res.records[item].status,
              registTime: res.records[item].applicationTime,
              mbrName: res.records[item].nickName,
              headUrl: res.records[item].avatar,
              reviewTime: res.records[item].reviewTime,
              sellerId: res.records[item].id
            }
            if (res.records[item].status !== 'UNDER_REVIEW') {
              obj.canAction = true
            } else {
              obj.canAction = false
            }
            _this.registData.push(obj)
          }
        })
      },
      handleCurrentChange: function(e) {
        this.page = Number(e)
        this.getRegistList(true)
      },
      handleSizeChange: function(e) {
        this.pageSize = Number(e)
        this.page = 1
        this.getRegistList(true)
      },
      passRegist: function(sellerId) {
        SellerService.agreeRegist(sellerId)
        .then((res) => {
          this.$message.success('审核成功')
          this.getRegistList()
        })
        .catch((err) => {
          this.$message.error('审核失败' + err)
        })
      },
      addSuppliers: function() {
          
      },
      allSelectionChange(val) {
          console.log(val)
        this.multipleSelection = val;
      }
  },
  created() {
    this.getRegistList()
  },
  filters: {
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.box-title{
  width: 100px;
  text-align: right;
}
.input-width{
    width: 200px;
}
.select-head{
    background: #fff;
    padding: 15px 0 8px 0;
    border-radius: 12px;
    border: 1px #eee solid;
}
.info-box{
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  margin: 10px;
}
/deep/ .el-table td, .el-table th.is-leaf {
  text-align: center;
}
/deep/ .el-table th, .el-table tr  {
  text-align: center !important;
}
/deep/ .el-dialog{
  width: 600px;
}
</style>
