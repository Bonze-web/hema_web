<template>
  <div class="table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex" :model="form" label-width="80px" label-position="right" >

        <el-form-item label="代码：">
          <el-input type="text" placeholder="请输入代码/名称" v-model="form.codeOrNameLike" class="input-width" ></el-input>
        </el-form-item>
        <!-- 
        <el-form-item label="名称：">
          <el-input type="text" placeholder="请输入名称" v-model="form.name" class="input-width" ></el-input>
        </el-form-item> -->


        <el-form-item>
          <el-button type="primary" size="mini" @click="onSubmit" >立即搜索</el-button>
          <el-button size="mini" @click="clearInput">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div style="height: 20px" />

    <div style="background: #fff">
      <el-row>
        <router-link :to="{ path: '/storageinfo/locationtype/add' }" >
          <el-button style="margin: 18px 10px" type="primary" size="mini" >新建</el-button>
        </router-link>
      </el-row>

      <el-table :data="listData" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
        <el-table-column prop="code" label="代码" style="height: 20px">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/storageinfo/locationtype/edit', query: { status: 'read', id: scope.row.id }, }" >
              <span>{{ scope.row.code }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="length" label="长度(cm)"></el-table-column>
        <el-table-column prop="width" label="宽度(cm)"></el-table-column>
        <el-table-column prop="height" label="高度(cm)"></el-table-column>
        <el-table-column prop="weight" label="承重(kg)"></el-table-column>
        <el-table-column prop="plotRatio" label="容积率(%)"></el-table-column>
        <el-table-column prop="storageNumber" label="存储容器数量"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- :disabled="!scope.row.status" -->
            <el-button size="mini" type="text" @click="deleteWmsBintype(scope.row.id, scope.row.version)">删除</el-button>
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
import StorageService from "@/api/service/StorageService";

export default {
  data() {
    return {
      listData: [], // 列表数据
      form: {
        codeOrNameLike: ""
      },
      page: 1,
      pageSize: 10,
      totalCount: 0
    };
  },
  computed: {},
  methods: {
    onSubmit: function() {
      const _this = this;
      this.page = 1;

      this.$refs.form.validate((result) => {
        if (result) {
          _this.getWmsBintypeQuery();
        }
      });
    },
    deleteWmsBintype: function(id, version) {
      // 删除
      const _this = this;
      this.$confirm('此操作将删除货位，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        StorageService.deleteWmsBintype(id, version)
        .then(res => {
          this.$message.success("删除成功")
          _this.getWmsBintypeQuery()
        })
        .catch(err => {
          this.$message.error("删除失败" + err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })        
      })
    },
    clearInput: function() {
      this.form = {
        code: "",
        name: ""
      };
    },
    getWmsBintypeQuery: function(reset) {
      // 获取货位列表
      this.suppliersData = []

      const _this = this;

      const data = {
        codeOrNameLike: this.form.codeOrNameLike,
        page: this.page,
        pageSize: this.pageSize,
        searchCount: true
      };

      StorageService.getWmsBintypeQuery(data).then((res) => {
        const records = res.records;

        this.totalCount = res.totalCount;
        // const listData = [];

        // records.forEach((item, index) => {
        //   if (item.status === 'OFF') {
        //     item.status = true
        //   } else {
        //     item.status = false
        //   }
        //   listData.push(item)
        // })

        _this.listData = records;
      }).catch(err => {
        this.$message.error("数据请求失败" + err)
      });
    },
    handleCurrentChange: function(e) {
      this.page = Number(e);
      this.getWmsBintypeQuery(true);
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e);
      this.page = 1;
      this.getWmsBintypeQuery(true);
    }
  },
  created() {
    this.getWmsBintypeQuery();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.getWmsBintypeQuery(0);
    })
  },
  filters: {}
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
</style>