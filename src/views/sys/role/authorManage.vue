<template>
  <div class="author-manage">
    <div class="top-box">
      <span>权限管理</span>
      <span class="role-info">{{orgName}}-{{roleName}}</span>
      <el-button size="small" type="primary" @click="handleSave">保存</el-button>
      <el-button size="small" type="text" @click="handleCancel">取消</el-button>
    </div>
    <!-- 权限列表区 -->
    <div class="author-main">
      <div class="check-all">
        <el-checkbox :indeterminate="indeterminate" v-model="checkAll" @change="handleCheckAll(checkAll)">全选</el-checkbox>
      </div>
      <div class="author-item" v-for="item in authorList" :key="item.id">
        <el-checkbox :indeterminate="item.indeterminate" v-model="item.checked" @change="handleLevelOneClick(item)">{{item.name}}</el-checkbox>
        <div class="level2" v-for="it in item.children" :key="it.id">
          <el-checkbox :indeterminate="it.indeterminate" v-model="it.checked" @change="handleLevelTwoClick(it, item)">{{it.name}}</el-checkbox>
          <div class="level3">
            <el-checkbox v-for="i in it.children" :key="i.id" v-model="i.checked" @change="handleLevelThreeClick(it, item)">{{i.name}}</el-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import OrgService from "@/api/service/OrgService";
import RoleService from "@/api/service/RoleService";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      checkAll: false, // 全选
      hasAuthorList: [], // 已有的权限列表
      authorList: [], // 所有的权限列表
      checkedAuthor: [], // 选中的权限
      indeterminate: false, // 选择框中间态
      roleName: "", // 当前编辑角色的名称
      orgName: "" // 当前编辑角色的组织
    };
  },
  computed: {
    ...mapGetters(["workingOrg"])
  },
  methods: {
    /* 查询所有与权限列表 */
    queryMenuAuthor(orgId) {
      var self = this;
      OrgService.getOrgMenuTree(orgId)
        .then(res => {
          // console.log(res);
          res.forEach((item, index) => {
            this.authorList.push({
              id: item.id,
              name: item.name,
              orgId: item.orgId,
              parentId: item.parentId,
              permissions: item.permissions,
              children: [],
              indeterminate: false,
              checked: false
            });
            if (item.children && item.children.length > 0) {
              item.children.forEach((it, ind) => {
                this.authorList[index].children.push({
                  id: it.id,
                  name: it.name,
                  orgId: it.orgId,
                  parentId: it.parentId,
                  permissions: it.permissions,
                  children: [],
                  indeterminate: false,
                  checked: false
                });
                if (it.children && it.children.length > 0) {
                  it.children.forEach((i, num) => {
                    this.authorList[index].children[ind].children.push({
                      id: i.id,
                      name: i.name,
                      orgId: i.orgId,
                      parentId: i.parentId,
                      permissions: i.permissions,
                      checked: false
                    });
                  });
                }
              });
            }
          });
          function checkEquals(self, val) {
            let isEquals = false;
            for (let i = 0; i < self.hasAuthorList.length; i++) {
              if (val.id === self.hasAuthorList[i].id) {
                isEquals = true;
                break;
              }
            }
            return isEquals;
          }
          function checkIndeterminate(isAllChecked, iParent) {
            if (isAllChecked > 0 && isAllChecked < iParent.children.length) {
              iParent.indeterminate = true;
            } else {
              iParent.indeterminate = false;
            }
          }
          // 页面权限出现后，匹配当前角色拥有的权限
          var isAllChecked1 = 0;
          this.authorList.forEach(item => {
            if (checkEquals(self, item)) {
              item.checked = true;
              isAllChecked1++;
            }
            var isAllChecked2 = 0;
            item.children.forEach(it => {
              if (checkEquals(self, it)) {
                it.checked = true;
                isAllChecked2++;
              }
              var isAllChecked3 = 0;
              it.children.forEach(i => {
                if (checkEquals(self, i)) {
                  i.checked = true;
                  isAllChecked3++;
                }
              });
              checkIndeterminate(isAllChecked3, it);
            });
            checkIndeterminate(isAllChecked2, item);
          });
          if (isAllChecked1 > 0 && isAllChecked1 < this.authorList.length) {
            this.indeterminate = true;
          } else {
            this.indeterminate = false;
          }
          // 判断所有权限是否选中，如果全部选中，全选选中，否则全选不选中
          if (isAllChecked1 === 0) {
            this.checkAll = false;
          } else if (isAllChecked1 === this.authorList.length) {
            this.checkAll = true;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error(err.message);
        });
    },
    /* 检查是否全部选中 */
    checkIsCheckedAll(it) {
      let isAll = true;
      let checkedNum = 0;
      if (it.children) {
        it.children.forEach(ele => {
          if (!ele.checked) {
            isAll = false;
          } else {
            checkedNum++;
          }
        });
        if (checkedNum > 0 && checkedNum < it.children.length) {
          it.indeterminate = true;
        } else {
          it.indeterminate = false;
        }
      } else {
        it.forEach(ele => {
          if (!ele.checked) {
            isAll = false;
          } else {
            checkedNum++;
          }
        });
        if (checkedNum > 0 && checkedNum < it.length) {
          this.indeterminate = true;
        } else {
          this.indeterminate = false;
        }
      }
      return isAll;
    },
    /* 全选 */
    handleCheckAll(val) {
      if (val) {
        this.authorList.forEach(item => {
          item.checked = true;
          this.handleLevelOneClick(item);
        });
      } else {
        this.authorList.forEach(item => {
          item.checked = false;
          this.handleLevelOneClick(item);
        });
      }
    },
    /* 一级权限点击事件 */
    handleLevelOneClick(item) {
      if (item.checked) {
        item.children.forEach(ele => {
          ele.checked = true;
          this.handleLevelTwoClick(ele, item);
        });
      } else {
        item.children.forEach(ele => {
          ele.checked = false;
          this.handleLevelTwoClick(ele, item);
        });
      }
      this.checkAll = this.checkIsCheckedAll(this.authorList);
    },
    /* 二级权限点击事件 */
    handleLevelTwoClick(it, item) {
      if (it.checked) {
        it.children.forEach(ele => {
          ele.checked = true;
        });
      } else {
        it.children.forEach(ele => {
          ele.checked = false;
        });
      }
      this.handleLevelThreeClick(item);
    },
    /* 三级权限点击事件 */
    handleLevelThreeClick(it, item) {
      const isAll = this.checkIsCheckedAll(it);
      if (isAll) {
        it.checked = true;
      } else {
        it.checked = false;
      }
      if (item) {
        this.handleLevelThreeClick(item);
      }
    },
    /* 检查选中项，将选中项的id加入数组中 */
    handleChecked(val) {
      val.children.forEach(ele => {
        if (ele.checked) {
          this.checkedAuthor.push(ele.id);
        }
      });
    },
    /* 保存操作 */
    handleSave() {
      /* 检查选中项，将选中项的id加入数组中 */
      this.checkedAuthor = [];
      this.authorList.forEach(item => {
        if (item.checked) {
          this.checkedAuthor.push(item.id);
        }
        item.children.forEach(it => {
          if (it.checked) {
            this.checkedAuthor.push(it.id);
          }
          it.children.forEach(i => {
            if (i.checked) {
              this.checkedAuthor.push(i.id);
            }
          });
        });
      });
      var postData = {
        roleId: this.$route.query.roleId,
        permissionIds: this.checkedAuthor
      };
      RoleService.updatePermission(postData)
        .then(res => {
          console.log(res);
          this.$message({
            message: "权限设置成功",
            type: "success"
          });
          this.$router.push({
            name: "RoleList"
          });
        })
        .catch(err => {
          console.log(err);
          this.$message.error(err.message);
        });
    },
    /* 取消操作 */
    handleCancel() {
      this.$router.push({
        name: "RoleList"
      });
    }
  },
  mounted() {
    this.roleName = this.$route.query.roleName;
    this.orgName = this.$route.query.orgName;
    // 查询权限列表，获取当前角色拥有的权限
    RoleService.getPermission(this.$route.query.roleId)
      .then(res => {
        if (res && res.length > 0) {
          this.hasAuthorList = res;
        } else {
          this.hasAuthorList = [];
        }
        this.queryMenuAuthor(this.workingOrg.id);
      })
      .catch(err => {
        console.log(err);
        this.$message.error(err.message);
      });
  }
};
</script>
<style lang="scss" scoped>
.author-manage {
  // background-color: #ebeff3;
  min-width: 800px;
  > div {
    margin-bottom: 15px;
    border-radius: 8px;
    background-color: #ffffff;
    padding: 15px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .top-box {
    span {
      font-size: 20px;
      line-height: 32px;
    }
    .role-info {
      margin-left: 20px;
      font-size: 15px;
    }
    .el-button {
      float: right;
      margin-left: 10px;
    }
  }
}
// 权限列表主要区域
.author-main {
  > div {
    padding: 0px 15px;
    border-bottom: 1px solid #dddddd;
  }
  .check-all {
    height: 35px;
    margin-bottom: 10px;
  }
  .author-item {
    line-height: 35px;
    overflow: hidden;
    margin-bottom: 10px;
    &:last-of-type {
      border-bottom: 0px;
    }
    .el-checkbox__label {
      font-size: 22px;
      color: red;
    }
    .level2 {
      margin-left: 40px;
      overflow: hidden;
      .level3 {
        margin-left: 40px;
        .el-checkbox {
          float: left;
          // width: 100px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.author-manage {
  .check-all {
    .el-checkbox__label {
      font-size: 20px;
    }
  }
  .author-item {
    .el-checkbox__label {
      font-size: 20px;
    }
    .level2 {
      .el-checkbox__label {
        font-size: 16px;
      }
      .level3 {
        .el-checkbox__label {
          font-size: 14px;
        }
      }
    }
  }
}
</style>



