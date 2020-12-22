<template>
    <div class="table-index">
        
        <div class="select-head">
            <el-form ref="form" style="display:flex" :model="form" label-width="80px" label-position="right">
                <el-form-item label="容器类型">
                    <el-input type='text' placeholder="请输入代码/名称" v-model="form.nameOrCode" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择状态">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="启用" value="ON"></el-option>
                    <el-option label="停用" value="OFF"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" size="mini">立即搜索</el-button>
                    <el-button  @click="clearInput" size="mini">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="height:20px" />
        <div style="background:#fff">
          <el-row>
            <router-link :to="{ path: '/basicinfo/containertype/edit', query:{ status: 'create'} }">
            <!-- <span v-if="child.meta&&child.meta.title" :title="child.meta.title">{{child.meta.title}}</span> -->
            <el-button style="margin:18px 10px" type="primary" size="mini">新建</el-button>
        </router-link>
          </el-row>
            <el-table
                :data="dcData"
                style="width: 100%;text-align:center"
            >
                <!-- <el-table-column
                    type="selection"
                    width="55">
                </el-table-column> -->
                <el-table-column prop="code" label="代码">
                    <template slot-scope="scope">
                        <router-link style="color:#409EFF" :to="{ path: '/basicinfo/containertype/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.code }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="barcodeprefix" label="条码前缀"></el-table-column>
                <el-table-column prop="inLWH" label="内长/宽/高(cm)"></el-table-column>
                <el-table-column prop="outLWH" label="外长/宽/高(cm)"></el-table-column>
                <el-table-column prop="weight" label="自重"></el-table-column>
                <el-table-column prop="bearingweight" label="承重"></el-table-column>
                <el-table-column prop="plotratio" label="容积率"></el-table-column>
                <el-table-column prop="status" label="状态" >
                  <template slot-scope="scope">
                    {{ scope.row.status | dcStatus }}
                  </template>
                </el-table-column>
                <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button :disabled="scope.row.status" size="mini" type="text" @click="statusChange(scope.row.status, scope.row.id, scope.row.version)">启用</el-button>
                  <el-button :disabled="!scope.row.status" size="mini" type="text" @click="statusChange(scope.row.status, scope.row.id, scope.row.version)">禁用</el-button>
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
// import { mapGetters } from "vuex";

export default {
  data() {
      return {
        suppliersId: '',
        page: 1,
        pageSize: 10,
        totalCount: 0,
        form: {
          nameOrCode: '',
          status: ''
        },
        dcData: [],
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
          this.getContainerTypeList()
        }
      })
      },
      statusChange: function(status, id, version) {
        // 修改供应商状态
        console.log(status)
        const _this = this
        this.$confirm('此操作将改变容器类型状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = [{
            id,
            version
          }]
          if (status) {
          BasicService.closeContainerType(data)
          .then((res) => {
            _this.$message.success("禁用成功")
            _this.getContainerTypeList()
          })
          .catch((err) => {
            _this.$message.error("禁用失败" + err.message)
            _this.getContainerTypeList()
          })
        } else {
          BasicService.openContainerType(data)
          .then((res) => {
            _this.$message.success("启用成功")
            _this.getContainerTypeList()
          })
          .catch((err) => {
            _this.$message.error("启用失败" + err.message)
            _this.getContainerTypeList()
          })
        }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })         
        });
      },
      clearInput: function() {
        this.form = {
          nameOrCode: '',
          status: ''
        }
      },
      getContainerTypeList: function(reset) {
        // 获取配送中心列表
        const _this = this
        const data = {
          page: this.page,
          pageSize: this.pageSize,
          searchCount: true,
          nameOrCodeEquals: this.form.nameOrCode,
          statusEquals: this.form.status
        }
        BasicService.getContainerTypeList(data)
        .then((res) => {
          _this.dcData = []
          console.log(res)
          this.totalCount = res.totalCount
          for (const item in res.records) {
            // 处理供应商数据
            const obj = {
              id: res.records[item].id,
              code: res.records[item].code,
              name: res.records[item].name,
              barcodeprefix: res.records[item].barcodeprefix,
              inLWH: res.records[item].inlength + '/' + res.records[item].inwidth + '/' + res.records[item].inheight,
              outLWH: res.records[item].outlength + '/' + res.records[item].outwidth + '/' + res.records[item].outheight,
              weight: res.records[item].weight,
              bearingweight: res.records[item].bearingweight,
              plotratio: res.records[item].plotratio,
              status: res.records[item].status,
              version: res.records[item].version
            }
            if (obj.status === "ON") {
              obj.status = true
            } else {
              obj.status = false
            }
            _this.dcData.push(obj)
          }
        })
        .catch((err) => {
          this.$message.error('获取容器类别列表失败' + err.message)
        })
      },
      handleCurrentChange: function(e) {
        this.page = Number(e)
        this.getContainerTypeList(true)
      },
      handleSizeChange: function(e) {
        this.pageSize = Number(e)
        this.page = 1
        this.getContainerTypeList(true)
      },
      allSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      }
  },
  created() {
    this.getContainerTypeList()
  },
  filters: {
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
