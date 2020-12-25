<template>
    <div>
        <div class="head" v-if="status === 'create' || status === 'edit'">
            <div style="margin-top:8px" v-if="status === 'create'">新建损耗单</div>
            <div style="margin-top:8px" v-else>编辑</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createDc">保存</el-button>
                <el-button type="primary" v-if="status === 'create'">保存并审核</el-button>
            </div>
        </div>
        <div style="height:20px" />
        <div class="info-content" v-if="status === 'create' || status === 'edit'">
            <div>
                <template>
                    
                            <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">
                                <div class="info-title">基本信息</div>
                                <el-row :gutter="20">
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="损耗类型" prop="type">
                                          <el-select v-model="form.type" placeholder="请选择损耗类型" @change="getDcCenter">
                                            <el-option v-for="item in billTypeList" :key="item.id" :label="item.name" :value="item.type"></el-option>
                                          </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="仓库" prop="type">
                                          <el-select v-model="form.wrhId" placeholder="请选择仓库">
                                            <el-option v-for="item in wrhList" :key="item.id" :label="'[' + item.code + ']' + item.name" :value="item.id"></el-option>
                                          </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="报损人" prop="code">
                                            <el-autocomplete
                                                class="inline-input"
                                                v-model="decerId"
                                                :fetch-suggestions="querySearch"
                                                placeholder="请输入内容"
                                                :trigger-on-focus="false"
                                                @select="handleSelect"
                                            ></el-autocomplete>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="备注">
                                    <textarea maxlength="200" v-model="form.remark"></textarea>
                                </el-form-item>
                                <div class="info-title">
                                    <div>
                                        商品
                                    <router-link style="color:#409EFF" :to="{ path: '/wrhmanagement/lossbill/batchAdd' }">
                                        <el-button size="mini" type="text" :disabled="!form.wrhId">批量添加</el-button>
                                    </router-link>
                                    </div>
                                    <div class="list-count">
                                        <div>总数:0,</div>
                                        <div>总品相数:0,</div>
                                        <div>总金额:0</div>
                                    </div>
                                </div>
                                    <el-table
                                        :data="lossBill"
                                        :row-style="{height: '16px',padding: '-4px'}"
                                        :default-sort = "{prop: 'billNumber'}"
                                    >
                                        <el-table-column fixed prop="billNumber" label="操作">
                                            <template slot-scope="scope">
                                                <router-link style="color:#409EFF" :to="{ path: '/wrhmanagement/lossbill/edit', query:{ status: 'read', id: scope.row.id} }">
                                                    <span>{{ scope.row.billNumber }}</span>
                                                </router-link>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="32" prop="billNumber" label="行"></el-table-column>
                                        <el-table-column width="100" prop="billNumber" label="商品"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="货位"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="货位用途"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="容器"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="供应商"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="批号"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="生产日期"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="到效日期"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="规格/计量单位"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="单价"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="批次"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="可用库存数量"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="损耗件数"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="损耗数量"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="损耗金额"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="备注"></el-table-column>
                                    </el-table>
                            </el-form>      
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import BillService from "@/api/service/BillService";
import BillTypeService from "@/api/service/BillTypeService"
import StorageService from "@/api/service/StorageService"
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  data() {
      return {
        wrhList: [], // 仓库列表
        deccerList: [], // 报损人列表
        PermIds: PermIds,
        dcList: [], // 中心仓列表
        status: '', // 页面状态
        form: {
          id: '',
          code: '',
          billType: '', // 损耗单据类型
          wrhId: '',
          decerId: '', // 报损员
          remark: '',
          version: ''
        },
        productList: [], // 报损商品列表
        createRules: {
        },
        billTypeList: [] // 损耗类型
      }
    },
    computed: {
      ...mapGetters(["hasPermission"])
    },
    methods: {
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      querySearch: function(queryString, cb) {
          // 搜索报损人
        BillService.getDeccer()
        .then((res) => {
          this.deccerList = res.records
        })
        .catch((err) => {
          this.$message.error('搜索报损人失败' + err.message)
        })
      },
      getQueryStatus: function() {
        this.status = this.$route.query.status
        if (this.status === 'read') {
          this.id = this.$route.query.id
        }
      },
      getAllBillType: function() {
          // 加载单据类型
        const data = {
            type: 'DECINV'
        }
        BillTypeService.getQueryType(data)
        .then((res) => {
            this.billTypeList = res.records
        })
        .catch((err) => {
            this.$message.error('获取损耗类别失败' + err.message)
        })
      },
      getWrhList: function() {
        const postData = {
          page: 1,
          pageSize: 0
        }
        StorageService.warehouseInit(postData)
        .then((res) => {
          this.wrhList = res.records
        })
        .catch((err) => {
          this.$message.error('加载仓库失败' + err.message)
        })
      }
    },
    created() {
      this.getAllBillType()
      this.getQueryStatus()
      this.getWrhList()
    },
    filters: {
    }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.head{
    background: #fff;
    padding: 15px 12px;
    border-radius: 12px;
    border: 1px #eee solid;
    display: flex;
    justify-content: space-between;
}
.head-title{
    display: flex;
    justify-content: left;
}
.info-content{
    background: #fff;
    border-radius: 12px;
    padding: 15px 12px;
}
.info-box{
    margin: 4px 0;
    font-size: 12px;
    display: flex;
    justify-content: left;
}
.info-title{
    margin: 12px 0;
    display: flex;
    justify-content: space-between;
}
.list-count{
    display: flex;
}
</style>
