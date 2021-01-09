<template>
    <div class="table-index">
        <div class="select-head">
            <el-form ref="form" style="display:flex" :model="form" label-width="80px" label-position="right">
                <el-form-item label="网格仓">
                    <el-input type='text' clearable placeholder="请输入网格仓代码/名称" v-model="form.nameOrCodeLike" class="input-width"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" size="mini">立即搜索</el-button>
                    <el-button  @click="clearInput" size="mini">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="height:20px" />
        <div style="height:20px;background:#fff" />
        <div style="background:#fff">
            <el-table
                :data="reseauData"
                style="width: 100%;text-align:center"
            >
                <el-table-column prop="code" label="代码">
                    <template slot-scope="scope">
                        <router-link style="color:#409EFF" :to="{ path: '/basicinfo/reseau/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.code }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="shortName" label="简称"></el-table-column>
                <el-table-column prop="type" label="推荐集货位" >
                  <template slot-scope="scope">
                    {{ scope.row.type}}
                  </template>
                </el-table-column>
                <el-table-column
                label="操作">
                 <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="setCollectors(scope.row)">设置集货位</el-button>
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
        <el-dialog title="推荐集货位" :visible.sync="editStore">
          <el-form :model="editStoreObj" >
            <el-form-item label="推荐集货位" :label-width="formLabelWidth">
                <el-select
                    v-model="collectBinId"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    :loading="loading">
                     <el-option v-for="(ele, idx) in userAll" :key="idx" :label="ele.code" :value="ele.id"></el-option>
                </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.stop="editStore = false">取 消</el-button>
            <el-button type="primary" @click.stop="submitEditStoreChange">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
// import ReseauService from "@/api/service/ReseauService.js";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  data() {
      return {
        collectBinId: '',
        suppliersId: '',
        page: 1,
        pageSize: 10,
        totalCount: 0,
        form: {
          nameOrCodeLike: ''
        },
        PermIds: PermIds,
        reseauData: [],
        multipleSelection: [], // 选择的列表
        editStore: false,
        editStoreObj: {},
        formLabelWidth: '120px',
        xxx: '',
        loading: false,
        userAll: [],
        idRecode: {}
      }
    },
  computed: {
    ...mapGetters(["hasPermission"])
  },
  methods: {
      onSubmit: function() {
        this.page = 1
        this.$refs.form.validate(result => {
          if (result) {
            this.getDcList()
          }
        })
      },
      clearInput: function() {
        this.form = {
          nameOrCode: ''
        }
        this.getDcList()
      },
      getDcList: function(reset) {
        this.form.page = this.page;
        this.form.pageSize = this.pageSize;
        // 获取物流中心列表
        // ReseauService.frontQuery(this.form)      
        // .then((res) => {
        //   this.reseauData = res.records;
        //   this.totalCount = res.totalCount;
        //   console.log(res);
        // })
        // .catch((err) => {
        //   this.$message.error("获取网格仓列表失败" + err.message)
        // })
      },
      handleCurrentChange: function(e) {
        this.page = Number(e)
        this.getDcList(true)
      },
      handleSizeChange: function(e) {
        this.pageSize = Number(e)
        this.page = 1
        this.getDcList(true)
      },
      setCollectors(item) {
        this.editStore = true;
        this.idRecode = item;
      },
      submitEditStoreChange() {
        this.editStore = false;
        // const filterEle = this.userAll.find((ele) => {
        //   return ele.id === this.collectBinId
        // });
        // const postData = {
        //   collectBinCode: filterEle.code,
        //   collectBinId: filterEle.id,
        //   id: this.idRecode.id
        // }
        // ReseauService.setCollectBin(postData)      
        // .then((res) => {
        //   console.log(res);
        // })
        // .catch((err) => {
        //   this.$message.error("设置集货位失败" + err.message)
        // })
        // console.log(filterEle);
      },
      remoteMethod(query) {
          console.log(query);
          if (query !== '') {
            this.loading = true;
            // ReseauService.binQueryBin(query)
            // .then((res) => {
            //   this.loading = false;
            //   // res.records.forEach((ele, idx) => {
            //   //     this.editData.forEach((item, index) => {
            //   //         if (ele.id === item.userId) {
            //   //             ele.disabled = true;
            //   //         }
            //   //     })
            //   // })
            //   console.log(res.records);
            //   this.userAll = res.records;
            // })
            // .catch((err) => {
            //   if (err) this.$message.error("获取所有用户失败" + err.message);
            // });
            // setTimeout(() => {
              
            //   this.options = this.list.filter(item => {
            //     return item.label.toLowerCase()
            //       .indexOf(query.toLowerCase()) > -1;
            //   });
            // }, 200);
          } else {
            this.userAll = [];
          }
      }
  },
  created() {
    this.getDcList();
  },
  beforeRouteEnter(to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.getDcList();
      })
    },
  filters: {
    dcType(type) {
      switch (type) {
        case "CENTER":
          return "中心仓"
        case "FRONT":
          return "网格仓"
        default:
          return '未知';
      }
    },
    dcStatus(status) {
      switch (status) {
        case true:
          return "启用"
        case false:
          return "禁用"
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
.table-index{
@import "src/styles/mixin.scss";
@include elTable;
}
</style>
