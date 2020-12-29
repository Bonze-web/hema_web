<template>
    <div>
        <div class="head">
            <div class="head-title">
                <div style="margin:8px">{{ '[' + dataList.barcode  +']' + dataList.containerTypeName  }}</div>
                <!-- <template> -->
                  <div style="margin:11px 0 5px 0; font-size: 12px; color: #999">{{ state }}</div>
                <!-- </template> -->
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <el-button type="primary"  @click="printingBtn">打印</el-button>
            </div>
        </div>
        <div style="height:20px" />


        <!-- 编辑 -->
        <!-- <div class="info-content" v-if="status === 'create' || status === 'edit'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="货位类型" name="category">
                          <div class="info-title">基本信息</div>
                            <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">
                                <el-row :gutter="20">
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="代码" prop="code">
                                            <el-input v-model="form.code"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="名称" prop="name">
                                            <el-input v-model="form.name"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                      <el-form-item label="存储盘数" prop="storageNumber">
                                          <el-input v-model="form.storageNumber"></el-input>
                                      </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="备注" prop="remark">
                                    <textarea v-model="form.remark"></textarea>
                                </el-form-item>

                             <div class="info-title">规格信息</div>

                                <el-row :gutter="20">
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="长度(cm)" prop="length">
                                            <el-input v-model="form.length"></el-input>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="宽度(cm)" prop="widht">
                                            <el-input v-model="form.widht"></el-input>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="6" class="info-box">
                                      <el-form-item label="高度(cm)" prop="height">
                                          <el-input v-model="form.height"></el-input>
                                      </el-form-item>
                                    </el-col>

                                    <el-col :span="6" class="info-box">
                                      <el-form-item label="承重(kg)" prop="weight">
                                          <el-input v-model="form.weight"></el-input>
                                      </el-form-item>
                                    </el-col>

                                    <el-col :span="6" class="info-box">
                                      <el-form-item label="容积率(%)" prop="plotRatio">
                                          <el-input v-model="form.plotRatio"></el-input>
                                      </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div> -->


        <!-- 展示 -->
        <div class="info-content table-index _table-index">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="容器详情" name="category">
                            <div class="info-title">基本信息</div>
                            <el-col :span="6" class="info-box">
                                <div>条码:</div>
                                <div>{{ dataList.barcode }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>容器类型:</div>
                                <!-- <router-link style="color: #409eff" :to="{ path: '/basicinfo/container/edit' }" > -->
                                  {{ '[' + dataList.useStatus + ']' + dataList.containerTypeName }}
                                <!-- </router-link> -->
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>所属对象:</div>
                                <div>{{ dataList.storageNumber }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>父容器:</div>
                                <div>{{ dataList.parentId ? dataList.parentId : "&lt;空&gt;" }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>当前位置:</div>
                                <div>{{ dataList.positionCode }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>目标位置:</div>
                                <div>{{ dataList.toPositionCode ? dataList.toPositionCode : "&lt;空&gt;" }}</div>
                            </el-col>
                            <br>

                            <el-col>
                                <div  class="info-title title">子容器</div>
                            </el-col>

                            <div style="height:20px" />

                            <el-table :data="dataList.sonList" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >

                            <el-table-column prop="a" label="条码" style="height: 20px">
                              <template slot-scope="scope">
                                <span>条码{{ scope.row.barcode }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="b" label="容器类型" style="height: 20px">
                              <template slot-scope="scope">
                                <span>容器类型{{ scope.row.containerTypeName }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="c" label="状态">
                              <template slot-scope="scope">
                                {{ scope.row.status | dcStatus }}
                              </template>
                            </el-table-column>

                          </el-table>


                        </el-tab-pane>

                        <el-tab-pane label="操作日志" name="active">
                          <el-table :data="dataList.sonList" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
                            操作日志

                            <!-- <el-table-column prop="a" label="操作时间" style="height: 20px">
                              <template slot-scope="scope">
                                  <span>条码{{ scope.row.a }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="b" label="操作类型" style="height: 20px">
                              <template slot-scope="scope">
                                  <span>容器类型{{ scope.row.b }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="c" label="事件">
                              <template slot-scope="scope">
                                {{ scope.row.c }}
                              </template>
                            </el-table-column>

                            <el-table-column prop="d" label="修改">
                              <template slot-scope="scope">
                                {{ scope.row.d }}
                              </template>
                            </el-table-column> -->

                          </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import BasicService from "@/api/service/BasicService";

export default {
  data() {
      return {
        state: '', // 状态
        tabActiveName: 'category', // tab栏名称
        active: 'ccc',
        status: '', // 页面状态
        id: '', // 货位类别ID
        dataList: {} // 详情数据
      }
    },
    computed: {
    },
    methods: {
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      getQueryStatus: function() {
        this.id = this.$route.query.id;
        this.ocntainerOcntainer(this.id) // 获取详情
      },
      ocntainerOcntainer: function(id) {
        BasicService.ocntainerOcntainer(id)
        .then((res) => {
          let state = '';

          if (res.status === 'ON') {
            state = '已使用'
          } else if (res.status === 'OFF') {
            state = '未使用'
          } else {
            state = '未知'
          }

          this.dataList = res;

          console.log(this.dataList.sonList)

          this.state = state
        })
        .catch((err) => {
          this.$message.error("获取详情失败" + err.message)
        })
      },
      printingBtn() {
        this.$message.error("打印功能还未开通")
      }
    },
    created() {
      this.getQueryStatus()
    },
    filters: {
      dcStatus(status) {
        switch (status) {
          case 'ON':
            return "已使用"
          case 'OFF':
            return "未使用"
          default:
            return '未知';
        }
      }
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
}

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