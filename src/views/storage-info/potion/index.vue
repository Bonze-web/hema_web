<template>
  <div class="table-index">
    <div class="select-head">
      <el-form
        ref="form"
        style="display: flex"
        :model="form"
        label-width="80px"
        label-position="right"
      >
        <el-form-item label="仓库">
          <el-input
            type="text"
            placeholder="请输入仓库编号/名称"
            v-model="form.nameOrCode"
            class="input-width"
          ></el-input>
        </el-form-item>

        <!-- <el-form-item label="上级类别">
          <el-input
            type="text"
            placeholder="请输入上级仓库编号/名称"
            v-model="form.parentEquals"
            class="input-width"
          ></el-input>
        </el-form-item> -->

        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="enabled"></el-option>
            <el-option label="禁用" value="disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="onSubmit"
            >立即搜索</el-button
          >
          <el-button size="mini" @click="clearInput">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div style="height: 20px" />

    <div style="background: #fff">
      <el-row>
        <router-link :to="{ path: '/storageinfo/potion/edit', query:{ status: 'create'} }" >
          <el-button style="margin: 18px 10px" type="primary" size="mini"
            >新建</el-button
          >
        </router-link>
      </el-row>

      <el-table
        :data="listData"
        style="width: 100%; text-align: center"
        :row-style="{ height: '16px', padding: '-4px' }"
      >
        <el-table-column fixed prop="code" label="代码" style="height: 20px">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/storageinfo/potion/edit', query: { status: 'read', id: scope.row.id }, }" >
              <span>{{ scope.row.code }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <!-- <el-table-column prop="anotherName" label="上级类别">
          <template slot-scope="scope">
            {{ scope.row.parentName ? scope.row.parentName : "&lt;空&gt;" }}
          </template>
        </el-table-column> -->
        
        <el-table-column prop="level" label="配送中心">
          <template slot-scope="scope">
            {{ scope.row.dcId }}
            <!-- {{ scope.row.dcId | categoryLevel }} -->
          </template>
        </el-table-column>

        <el-table-column prop="anotherName" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | categoryStatus }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.status"
              size="mini"
              type="text"
              @click="
                statusChange(scope.row.status, scope.row.id, scope.row.version)
              "
              >启用</el-button
            >
            <el-button
              :disabled="!scope.row.status"
              size="mini"
              type="text"
              @click="
                statusChange(scope.row.status, scope.row.id, scope.row.version)
              "
              >禁用</el-button
            >
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
      suppliersId: "",
      page: 1,
      pageSize: 10,
      totalCount: 0,
      form: {
        nameOrCode: "",
        status: ""
      },
      listData: [], // 列表数据
      multipleSelection: [] // 选择的列表
    };
  },
  computed: {},
  methods: {
    onSubmit: function() {
      this.page = 1;

      this.$refs.form.validate((result) => {
        if (result) {
          this.getCateGoryQuery();
        }
      });
    },
    statusChange: function(status, id, version) {
      // 修改仓库状态
      const _this = this;
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (status) {
          // 禁用
          StorageService.closeWarehouse(id, version)
          .then((res) => {
            _this.$message.success("禁止用成功")
            _this.warehouseInit();
          })
          .catch((err) => {
            _this.$message.error("禁用失败" + err)
            _this.warehouseInit();
          })
        } else {
          // 启用
          StorageService.openWarehouse(id, version)
          .then((res) => {
            _this.$message.success("启用成功")
            _this.warehouseInit();
          })
          .catch((err) => {
            _this.$message.error("启用失败" + err)
            _this.warehouseInit();
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })        
      })
    },
    clearInput: function() {
      this.form = {
        nameOrCode: "",
        status: ""
      };
    },
    warehouseInit: function(reset) {
      // 获取仓库列表
      this.suppliersData = []

      // 获取供应商列表
      const _this = this;
      const data = {
        page: this.page,
        pageSize: this.pageSize,
        searchCount: true,
        codeOrNameLike: this.form.nameOrCode,
        statusEquals: this.form.status || null
      };

      StorageService.warehouseInit(data).then((res) => {
        const records = res.records;
        const listData = [];
        console.log(res)
        this.totalCount = res.totalCount;

        records.forEach((item, index) => {
          if (item.status === 'OFF') {
            item.status = true
          } else {
            item.status = false
          }
          listData.push(item)
        })

        _this.listData = listData;
        console.log(_this.listData)
      });
    },
    handleCurrentChange: function(e) {
      this.page = Number(e);
      this.getRegistList(true);
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e);
      this.page = 1;
      this.getRegistList(true);
    },
    allSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    }
  },
  created() {
    this.warehouseInit();
  },
  filters: {
    categoryLevel(level) {
      switch (level) {
        case "one":
          return "一级";
        case "two":
          return "二级";
        case "three":
          return "三级";
        case "four":
          return "四级";
        default:
          return "未知";
      }
    },
    categoryStatus(status) {
      switch (status) {
        case true:
          return "禁用";
        case false:
          return "启用";
        default:
          return "未知";
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
</style>