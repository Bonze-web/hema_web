<template>
  <div class="templateMsg-index">
    <div class="top-box">订阅消息管理</div>
    <div class="content">
      <div class="custom-box" v-if="false">
        <div class="title">
          <span>自定义模板消息</span>
          <el-button size="small" type="primary" icon="el-icon-plus" v-if="hasPermission(PermIds.SYS_NOTIFY_CREATE)" @click="handleAdd()">新增自定义模板消息</el-button>
        </div>
        <el-table :data="pageData.records" style="width: 100%">
          <el-table-column label="推送方式" width="120">系统默认推送</el-table-column>
          <el-table-column prop="prompt" label="温馨提示" width="418"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span>{{scope.row.status | filtStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="管理" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleEdit(scope.row,'read')">查看</el-button>
              <el-button type="text" size="small" v-if="scope.row.status === 'CREATED' && hasPermission(PermIds.SYS_NOTIFY_UPDATE)" @click="handleEdit(scope.row,'edit')">编辑</el-button>
              <el-button type="text" size="small" v-if="scope.row.status === 'CREATED' && hasPermission(PermIds.SYS_NOTIFY_SUBMIT)" @click="handleSubmit(scope.row)">提交</el-button>
              <!-- <el-button type="text" size="small"  v-if="scope.row.status === 'CREATED'" @click="handelDelete(scope.row)">删除</el-button> -->
              <!-- <el-button type="text" size="small" @click="handelDelete(scope.row)">推送消息</el-button> -->
              <el-button type="text" size="small" v-if="scope.row.status === 'SUBMIT' && hasPermission(PermIds.SYS_NOTIFY_ABORT)" @click="handelAbort(scope.row)">作废</el-button>
              <!-- <el-button type="text" size="small" v-if="scope.row.status === 'SUBMIT'" @click="handelDelete(scope.row)">查看发送记录</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <page-bar :page-data="pageData" @onreload="handleQuery"></page-bar>
      </div>
      <div class="system-box">
        <div class="sync-button">
          <el-button size="small" type="primary" v-if="hasPermission(PermIds.SYS_WX_TEMPLATE_SYNC)" @click="handelSync()">同步消息模板</el-button>
        </div>
        <div class="title">
          <span>系统订阅消息</span>
        </div>
        <div>
          <div class="sys-msg-item" v-for="(item,index) in sysMsgs" :key="item.id">
            <span>{{item.messageTitle}}</span>
            <el-switch v-model="item.enable" @change="handleSysMsgStatus(item,index)" v-if="hasPermission(PermIds.SYS_NOTIFY_SYS_EDIT)"></el-switch>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pageBar from "@/components/pagebar.vue";
import CustomtplmsgService from "@/api/service/CustomtplmsgService";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      PermIds: PermIds,
      pageData: {
        page: 1,
        pageSize: 20,
        recordCount: 0,
        records: []
      },
      sysMsgs: []
    };
  },
  computed: {
    ...mapGetters(["hasPermission", "workingOrg"])
  },
  methods: {
    handelSync() {
      CustomtplmsgService.templateSync()
      .then(res => {
        this.$message.success("同步模板消息成功")
      })
      .catch(err => {
        this.$message.error(err.message)
      })
    },
    /* 启用或禁用微信系统模板消息 */
    handleSysMsgStatus(val, index) {
      if (val.enable) {
        // 启用系统模板消息
        CustomtplmsgService.online(val.id)
          .then(res => {
            this.$message.success(val.messageTitle + "已启用");
          })
          .catch(err => {
            this.sysMsgs[index].enable = !val.enable;
            this.$message.error(err.message);
          });
      } else {
        // 禁用系统模板消息
        CustomtplmsgService.offline(val.id)
          .then(res => {
            this.$message.success(val.messageTitle + "已关闭");
          })
          .catch(err => {
            this.sysMsgs[index].enable = !val.enable;
            this.$message.error(err.message);
          });
      }
    },
    handleAdd() {
      this.$router.push({
        name: "TemplateMsgAdd"
      });
    },
    /* 查看模板消息详情 */
    handleEdit(val, status) {
      this.$router.push({
        name: "TemplateMsgAdd",
        query: {
          templateMsgInfo: JSON.stringify(val),
          pageStatus: status
        }
      });
    },
    /* 提交自定义模板消息 */
    handleSubmit(val) {
      CustomtplmsgService.submit(val.id)
        .then(res => {
          this.$message.success("操作成功！");
          this.handleQuery()
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    /* 删除自定义模板消息 */
    handelDelete(val) {
      CustomtplmsgService.abort(val.id)
        .then(res => {
          this.$message.success("操作成功！");
          this.handleQuery();
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    /* 作废自定义模板消息 */
    handelAbort(val) {
      CustomtplmsgService.abort(val.id)
        .then(res => {
          this.$message.success("操作成功！");
          this.handleQuery();
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    /* 查询自定义模板消息 */
    handleQuery(page, pageSize) {
      if (!page) {
        page = this.pageData.page;
      }
      if (!pageSize) {
        pageSize = this.pageData.pageSize;
      }
      CustomtplmsgService.query(page, pageSize)
        .then(res => {
          if (res) {
            this.pageData = res;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    /* 查询微信系统模板消息 */
    getAll() {
      CustomtplmsgService.getAll()
        .then(res => {
          if (res) {
            this.sysMsgs = [];
            res.forEach(ele => {
              this.sysMsgs.push({
                ...ele,
                messageTitle: this.handleSysMsgTitle(ele.wxaTemplateType),
                enable: !ele.disabled
              });
            });
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    /* 处理系统模板消息标题 */
    handleSysMsgTitle(type) {
      var title = "";
      if (type === "SEND_BOX_SUCCESS") {
        title = "样品送检成功通知";
      } else if (type === "TEST_NOTIFY") {
        title = "检查报告提醒";
      } else if (type === "ORDER_NOTIFY") {
        title = "订单进度提醒";
      }
      return title;
    }
  },
  mounted() {
    // this.handleQuery();
    this.getAll();
  },
  filters: {
    filtStatus: function(val) {
      if (val === "CREATED") {
        val = "已保存";
      } else if (val === "SUBMIT") {
        val = "已提交";
      } else if (val === "ABORT") {
        val = "已作废";
      }
      return val;
    }
  },
  components: {
    pageBar
  }
};
</script>
<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.templateMsg-index {
  @include common;
  .content {
    display: flex;
    justify-content: space-between;
    .custom-box {
      width: 80%;
      border: 1px solid #dfdfdf;
      border-radius: 6px;
      margin-right: 22px;
    }
    @media only screen and (max-width: 1368px) {
      .custom-box {
        width: 64%;
      }
    }
    @media only screen and (max-width: 1280px) {
      .custom-box {
        width: 60%;
      }
    }
    .system-box {
      min-width: 332px;
      width: 100%;
      height: 768px;
      overflow-y: auto;
      border: 1px solid #dfdfdf;
      border-radius: 6px;
    }
    .custom-box,
    .system-box {
      position: relative;
      padding: 14px 22px;
      background: #ffffff;
      .sync-button {
        position: absolute;
        right: 22px;
      }
      .title {
        font-size: 14px;
        line-height: 32px;
        height: 32px;
        color: #333333;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
      }
      .sys-msg-item {
        // width: 285px;
        height: 57px;
        padding: 15px 0;
        font-size: 14px;
        font-family: Adobe Heiti Std R;
        font-weight: normal;
        color: #666666;
        line-height: 26px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0px 1px 0px 0px rgba(235, 235, 235, 1);
        > span {
          width: 230px;
        }
      }
    }
  }
}
</style>

