<template>
  <div class="orgtree-select">
    <div class="org-template-box">
      <el-button type="text" @click="downloadTemplate">下载门店导入模板</el-button>
      <el-upload ref="uploadBtn" class="upload-demo" multiple :show-file-list="true" :action="actionUrl" :headers="uploadHeaders" :before-upload="beforeExcelUpload" :on-success="handleUploadSuccess">
        <el-button type="text">导入门店</el-button>
      </el-upload>
    </div>
    <div class="org-search-box search-box">
      <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchValue" @keyup.enter.native="handleOrgsSearch"></el-input>
      <el-button v-if="!showSelected" size="small" type="text" @click="showSelected = true">查看已选</el-button>
      <el-button v-if="showSelected" size="small" type="text" @click="showSelected = false">取消查看</el-button>
    </div>
    <div class="org-selected-box" v-show="showSelected">
      <el-scrollbar style="height:100%;">
        <div class="selected-item" v-for="(item,index) in selectedOrgs" :key="index">
          <span>{{item.name}}</span>
          <i class="el-icon-close" @click="handleDeleteSelectedItem(item)"></i>
        </div>
        <p v-if="selectedOrgs.length === 0">暂无已选择门店~</p>
      </el-scrollbar>
    </div>
    <div class="org-check-box">
      <div class="org-father">
        <el-scrollbar style="height:100%;">
          <div class="org-item">
            <el-checkbox @change="handleCheckAll" :indeterminate="isIndeterminate" v-model="checkAll">全选</el-checkbox>
          </div>
          <div :class="{'org-item': true, 'active': item.active}" v-for="(item, index) in companyData" :key="index">
            <el-checkbox v-model="item.checked" :indeterminate="item.isIndeterminate" @change="handleItemChange(item, index)"></el-checkbox>
            <span :class="{'org-name':true, 'active': item.checked}" @click="handleCheckItem(item, index)">{{item.name}}({{item.count}})</span>
          </div>
          <div class="line"></div>
        </el-scrollbar>
      </div>
      <div class="org-son">
        <el-scrollbar style="height:100%">
          <div class="son-item" v-for="(item, index) in sonStoreData" :key="index" @change="handleSonStoreCheck(item)">
            <el-checkbox v-model="item.checked">{{item.name}}</el-checkbox>
          </div>
          <div class="loadmore" v-if="clickCompanyInfo.hasMore">
            <el-button size="small" type="text" @click="clickLoadMore">点击加载更多</el-button>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import OrgService from "@/api/service/OrgService";
import StoreService from "@/api/service/StoreService";
import OptionsService from "@/api/service/OptionsService";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchValue: "", // 搜索关键
      companyData: [], // 分公司
      sonStoreData: [], // 子门店
      checkAll: false,
      clickCompanyInfo: {
        orgId: "", // 点击的分公司id
        page: 1, // 查询的页数
        index: "", // 点击的分公司索引
        hasMore: false // 是否还有更多的子公司数据
      },
      isIndeterminate: false,
      showSelected: false, // 是否显示已经选择的门店
      selectedOrgs: [], // 选中的门店
      uploadHeaders: {
        "access-token": getToken()
      }
    };
  },
  computed: {
    ...mapGetters(["workingOrg"]),
    actionUrl() {
      return process.env.BASE_API + "/mall/store/parseStoresByExcel";
    }
  },
  props: ["storeData", "choosedStore", "refreshData", "updateData", "queryInactive"], // storeData:所有的分公司门店数据 choosedStore:编辑状态下已经选择的门店 refreshData:
  methods: {
    /* 从查看选中框中删除点击的门店,同时遍历所有的门店，将对应的门店置为未选中 */
    handleDeleteSelectedItem(val) {
      this.selectedOrgs.forEach((item, index) => {
        if (item.id === val.id) {
          this.selectedOrgs.splice(index, 1);
        }
      });
      // 遍历所有的门店，查找对应的删除门店，将选中状态置为false
      this.companyData.forEach(item => {
        item.sonStores.forEach(ele => {
          if (ele.id === val.id) {
            ele.checked = false;
            return;
          }
        });
      });
    },
    /* 关键字搜索查询 */
    handleOrgsSearch() {
      if (this.searchValue) {
        var reg = new RegExp(this.searchValue);
        var tempArr = [];
        // 选出所有拼配关键字的门店
        this.companyData.forEach(item => {
          item.sonStores.forEach(ele => {
            if (reg.test(ele.name)) {
              tempArr.push(ele);
            }
          });
        });
        this.sonStoreData = tempArr;
      } else {
        // 如果搜索内容为空，置空子门店数组
        this.sonStoreData = [];
      }
    },
    // 查询分公司极其门店数量
    queryCompanyCount() {
      this.companyData = [];
      var includeDisabledOrgs = false;
      var orgTypeEquals = "COMPANY";
      var upperOrgId = this.workingOrg.id;
      OrgService.queryCount(includeDisabledOrgs, orgTypeEquals, upperOrgId)
        .then(res => {
          // console.log(res);
          res.forEach(item => {
            // 如果是总部，直接填入分公司
            if (this.workingOrg.type === "GROUP") {
              this.companyData.push({
                ...item,
                sonStores: [],
                active: false,
                checked: false,
                isIndeterminate: false
              });
            } else if (this.workingOrg.type === "COMPANY") {
              // 如果是分公司，只有与当前用户所属组织一致才插入数据
              if (item.id === this.workingOrg.id) {
                this.companyData.push({
                  ...item,
                  sonStores: [],
                  active: false,
                  checked: false,
                  isIndeterminate: false
                });
              }
            }
          });
          this.$emit("update:storeData", this.companyData); // 更新父组件数据
        })
        .then(res => {
          this.companyData.forEach((item, index) => {
            this.queryOrg(1, 0, item.id, index);
          });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 查询子门店
    queryOrg(page, pageSize, upperOrgId, index) {
      page = !page ? 1 : page;
      pageSize = !pageSize ? 0 : pageSize;
      var opts = {
        upperOrgIdEquals: upperOrgId,
        // includeLowerOrg: true,
        // orgTypesIn: "STORE",
        statusEquals: this.queryInactive === true ? "OPEN,INACTIVE" : "OPEN"
      };
      StoreService.query(page, pageSize, opts)
        .then(res => {
          // console.log(res);
          this.clickCompanyInfo.page = res.page;
          if (res.pageCount === res.page) {
            this.clickCompanyInfo.hasMore = false;
          } else if (res.page < res.pageCount) {
            this.clickCompanyInfo.hasMore = true;
          }
          if (res.records && res.records.length > 0) {
            this.companyData[index].count = res.records.length; // 因为查询的是开业的门店，所以修改分公司的显示的门店数
            res.records.forEach((item, num) => {
              this.companyData[index].sonStores.push({
                ...item,
                checked: false
              });
              if (this.choosedStore && this.choosedStore.length > 0) {
                // 遍历所有的id，如果相等，将对应的门店置为选中
                for (let ind = 0; ind < this.choosedStore.length; ind++) {
                  if (this.choosedStore[ind].storeId === item.id) {
                    this.companyData[index].sonStores[num].checked = true;
                    let isHas = false;
                    for (let j = 0; j < this.selectedOrgs.length; j++) {
                      const it = this.selectedOrgs[j];
                      if (it.id === item.id) {
                        isHas = true;
                      }
                    }
                    if (!isHas) {
                      // 将选中的这项门店推入已选门店数组中
                      this.selectedOrgs.push(
                        this.companyData[index].sonStores[num]
                      );
                    }
                    break;
                  }
                }
              }
            });
            // this.sonStoreData = this.companyData[index].sonStores;

            // 如果所有的子门店都被选中，所属分公司被置为选中状态，有选中非全选，置为中间态
            let isItemCheckedAll = true;
            this.companyData[index].sonStores.forEach(item => {
              if (item.checked) {
                this.companyData[index].isIndeterminate = true;
              } else if (!item.checked) {
                isItemCheckedAll = false;
              }
            });
            if (isItemCheckedAll) {
              this.companyData[index].isIndeterminate = false;
              this.companyData[index].checked = true;
            }
            this.checkIsIndeterminate();
            this.$emit("update:storeData", this.companyData); // 更新父组件数据
          } else {
            this.sonStoreData = [];
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 校验中间态
    checkIsIndeterminate() {
      let checkedNum = 0;
      this.companyData.forEach(item => {
        if (item.checked) {
          checkedNum++;
        }
      });
      // 如果全部选中，全选选中，否则全选不选中
      if (checkedNum === this.companyData.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
      // 控制全选中间状态
      this.isIndeterminate =
        checkedNum > 0 && checkedNum < this.companyData.length;
    },
    // 分公司checkbox点击事件，全选或取消全选分公司
    handleItemChange(val, index) {
      if (val.checked) {
        this.companyData[index].sonStores.forEach(item => {
          item.checked = true;
          let isHas = false;
          this.selectedOrgs.forEach(ele => {
            if (ele.id === item.id) {
              isHas = true;
            }
          });
          if (!isHas) {
            this.selectedOrgs.push(item);
          }
        });
      } else {
        this.companyData[index].sonStores.forEach(item => {
          item.checked = false;
          this.selectedOrgs.forEach((ele, index) => {
            if (ele.id === item.id) {
              this.selectedOrgs.splice(index, 1);
            }
          });
        });
      }
      if (val.active) {
        this.sonStoreData = this.companyData[index].sonStores;
      }
      this.checkIsIndeterminate();
      // 分公司中间态置为false
      val.isIndeterminate = false;

      this.clickCompanyInfo.orgId = val.id; // 当前点击的分公司名称
      this.clickCompanyInfo.index = index; // 当前点击的分公司索引

      // this.$emit("update:storeData", this.companyData); // 更新父组件数据
      this.$emit("update:choosedStore", this.selectedOrgs); // 更新父组件数据
    },
    // 分公司名称点击事件，控制子公司的显示和隐藏
    handleCheckItem(val, index) {
      // 分公司中间态置为false
      // val.isIndeterminate = false;
      // 检查分公司中间态
      this.checkIsIndeterminate();

      this.companyData.forEach(item => {
        if (item.id !== val.id) {
          item.active = false;
        }
      });
      if (val.active) {
        val.active = false;
        this.sonStoreData = [];
      } else {
        // 激活当前点击项，判断该项子门店有没有数据，如果没有数据，调用接口查询数据
        val.active = true;
        this.sonStoreData = this.companyData[index].sonStores;
      }

      this.clickCompanyInfo.orgId = val.id; // 当前点击的分公司名称
      this.clickCompanyInfo.index = index; // 当前点击的分公司索引

      // this.$emit("update:storeData", this.companyData); // 更新父组件数据
      this.$emit("update:choosedStore", this.selectedOrgs); // 更新父组件数据
    },
    handleCheckAll(val) {
      if (val) {
        // 将所有的选项置为选中
        this.companyData.forEach((item, index) => {
          item.checked = true;
          item.sonStores.forEach(ele => {
            ele.checked = true;
            // 将所有的门店加入查看数组中
            this.selectedOrgs.push(ele);
          });
        });
      } else {
        this.companyData.forEach(item => {
          item.checked = false;
          item.sonStores.forEach(ele => {
            ele.checked = false;
          });
        });
        // 将查看数组中所有的门店清除
        this.selectedOrgs = [];
      }
      this.isIndeterminate = false;
      // this.$emit("update:storeData", this.companyData); // 更新父组件数据
      this.$emit("update:choosedStore", this.selectedOrgs); // 更新父组件数据
    },
    /* 子门店点击 */
    handleSonStoreCheck(val) {
      if (this.searchValue) {
        // 如果关键字有值，说明是查询出来的列表
        this.companyData.forEach(item => {
          item.sonStores.forEach(ele => {
            if (ele.id === val.id) {
              ele.checked = val.checked;
            }
          });
        });
      } else {
        // 如果关键字为空，说明是正常点击分公司查询的子门店
        this.companyData[
          this.clickCompanyInfo.index
        ].sonStores = this.sonStoreData; // 将现在显示的子公司数据同步到storeData的子公司数据参数中
        let checkedNum = 0;
        this.sonStoreData.forEach(item => {
          if (item.checked) {
            checkedNum++;
          }
        });
        this.companyData[this.clickCompanyInfo.index].isIndeterminate =
          checkedNum > 0 && checkedNum < this.sonStoreData.length;
        console.log(this.sonStoreData.length, checkedNum);
        if (checkedNum > 0 && checkedNum === this.sonStoreData.length) {
          this.companyData[this.clickCompanyInfo.index].checked = true;
        } else {
          this.companyData[this.clickCompanyInfo.index].checked = false;
        }
      }
      this.$emit("update:storeData", this.companyData); // 更新父组件数据

      // 如果选中，加入已选中查看数组中，如果取消选中，从已选中数组中删除
      if (val.checked) {
        this.selectedOrgs.push(val);
      } else {
        this.selectedOrgs.forEach((item, index) => {
          if (item.id === val.id) {
            this.selectedOrgs.splice(index, 1);
          }
        });
      }
      this.$emit("update:choosedStore", this.selectedOrgs); // 更新父组件数据
    },
    clickLoadMore() {
      let page = this.clickCompanyInfo.page;
      page++;
      this.queryOrg(
        page,
        0,
        this.clickCompanyInfo.orgId,
        this.clickCompanyInfo.index
      );
    },
    // 获取SAAS租户信息
    getSaasTenant() {
      if (process.env.PRJ === "SAAS") {
        var tenant = localStorage.getItem("_tenant_");
        if (tenant) {
          this.uploadHeaders["tenant"] = tenant;
        }
      }
    },
    /* 导入会员模板前的校验，文件大小不能大于1M */
    beforeExcelUpload(file) {
      const isLt = file.size / 1024 / 1024 < 1;
      if (!isLt) {
        this.$message.error("上传大小不能超过 1M!");
      }
      return isLt;
    },
    /* 导入门店模板成功事件 */
    handleUploadSuccess(response, file, fileList) {
      console.log(response);
      if (response.data) {
        const stores = response.data;
        this.companyData.forEach((item, index) => {
          // 检查分公司是否有选中项
          stores.forEach(it => {
            // 如果当前分公司的id与选中项有匹配，将当前分公司状态置为选中
            if (item.id === it.id) {
              this.companyData[index].checked = true;
            } else {
              item.sonStores.forEach(ele => {
                if (ele.id === it.id) {
                  ele.checked = true;
                  return;
                }
              });
            }
          });
        });

        // 将已选择的分公司中的门店推入已选择的门店列表
        this.companyData.forEach((item, index) => {
          if (item.checked) {
            item.sonStores.forEach(ele => {
              ele.checked = true;
              // 将所有的门店加入查看数组中
              if (this.selectedOrgs.length > 0) {
                let isHas = false;
                this.selectedOrgs.forEach(it => {
                  if (ele.id === it.id) {
                    isHas = true;
                  }
                });
                if (!isHas) {
                  this.selectedOrgs.push(ele);
                }
              } else {
                this.selectedOrgs.push(ele);
              }
            });
          } else {
            let checkedNum = 0;
            item.sonStores.forEach(ele => {
              if (ele.checked) {
                checkedNum++;
                if (this.selectedOrgs.length > 0) {
                  let isHas = false;
                  this.selectedOrgs.forEach(it => {
                    if (ele.id === it.id) {
                      isHas = true;
                    }
                  });
                  if (!isHas) {
                    this.selectedOrgs.push(ele);
                  }
                } else {
                  this.selectedOrgs.push(ele);
                }
              }
            });
            // 如果全部选中，全选选中，否则全选不选中
            if (checkedNum === item.sonStores.length) {
              item.checked = true;
            } else {
              item.checked = false;
              if (checkedNum > 0) {
                item.isIndeterminate = true;
              }
            }
          }
        });
        stores.forEach(item => {
          if (this.selectedOrgs.length > 0) {
            let isHas = false;
            this.selectedOrgs.forEach(ele => {
              if (item.id === ele.id) {
                isHas = true;
              }
            });
            if (!isHas) {
              this.selectedOrgs.push(item);
            }
          } else {
            this.selectedOrgs.push(item);
          }
        });
        this.companyData.forEach((item, index) => {
          // 检查分公司是否有选中项
          this.selectedOrgs.forEach(it => {
            // 如果当前分公司的id与选中项有匹配，将当前分公司状态置为选中
            if (item.id === it.id) {
              this.companyData[index].checked = true;
            }
          });
        });
        this.checkIsIndeterminate();
        // this.$emit("update:storeData", this.companyData); // 更新父组件数据
        this.$emit("update:choosedStore", this.selectedOrgs); // 更新父组件数据
        this.$message.success("文件上传成功！");
      } else {
        this.$message.error(response.message);
      }
    },
    /* 下载会员模板 */
    downloadTemplate() {
      OptionsService.queryByKeys("importStoreTemplateUrl")
        .then(res => {
          if (res && res.length > 0 && res[0].value != null && res[0].value !== "") {
            window.location.href = res[0].value;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    handleChoosedStoreData: function() {
      if (this.companyData.length > 0) {
        this.selectedOrgs = [];
        this.companyData.forEach((ele, index) => {
          ele.sonStores.forEach((item, num) => {
            if (this.choosedStore && this.choosedStore.length > 0) {
              // 遍历所有的id，如果相等，将对应的门店置为选中
              for (let ind = 0; ind < this.choosedStore.length; ind++) {
                if (this.choosedStore[ind].id === item.id) {
                  this.companyData[index].sonStores[num].checked = true;
                  let isHas = false;
                  for (let j = 0; j < this.selectedOrgs.length; j++) {
                    const it = this.selectedOrgs[j];
                    if (it.id === item.id) {
                      isHas = true;
                    }
                  }
                  if (!isHas) {
                    // 将选中的这项门店推入已选门店数组中
                    this.selectedOrgs.push(
                      this.companyData[index].sonStores[num]
                    );
                  }
                  break;
                } else {
                  this.companyData[index].sonStores[num].checked = false;
                }
              }
            } else {
              // 取消选中
              this.companyData[index].sonStores[num].checked = false;
            }
          });

          // 如果所有的子门店都被选中，所属分公司被置为选中状态，有选中非全选，置为中间态
          let isItemCheckedAll = true;
          this.companyData[index].isIndeterminate = false;
          this.companyData[index].sonStores.forEach(item => {
            if (item.checked) {
              this.companyData[index].isIndeterminate = true;
            } else if (!item.checked) {
              isItemCheckedAll = false;
            }
          });
          if (isItemCheckedAll) {
            this.companyData[index].isIndeterminate = false;
            this.companyData[index].checked = true;
          } else {
            this.companyData[index].checked = false;
          }
        });
        this.checkIsIndeterminate();
      }
    }
  },
  watch: {
    // 监听是否更新数据，如果字段为true，重新请求新数据
    refreshData: function(val) {
      console.log(this.choosedStore);
      console.log(val);
      if (val) {
        this.queryCompanyCount();
        this.sonStoreData = [];
        this.isIndeterminate = false;
        this.clickCompanyInfo.hasMore = false;
        if (this.choosedStore.length === 0) {
          this.selectedOrgs = this.choosedStore;
        }
      }
    },
    updateData: function(val) {
      if (val) {
        this.handleChoosedStoreData();
      }
    }
  },
  mounted() {
    this.queryCompanyCount();
    if (this.choosedStore.length === 0) {
      this.selectedOrgs = this.choosedStore;
    }
  },
  created() {
    this.getSaasTenant();
  }
};
</script>
<style lang="scss" scoped>
.orgtree-select {
  position: relative;
  .org-template-box {
    padding-bottom: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    .el-button {
      margin-right: 20px;
    }
  }
  .org-search-box {
    .el-input {
      width: 350px;
    }
  }
  .org-selected-box {
    position: absolute;
    width: 450px;
    height: 280px;
    padding-bottom: 10px;
    border: 1px solid #dedede;
    background: #fff;
    text-align: center;
    z-index: 999;
    .selected-item {
      width: auto;
      height: 32px;
      max-width: 400px;
      line-height: 32px;
      font-size: 12px;
      margin: 10px 0px 0px 10px;
      border: 1px solid #dedede;
      border-radius: 4px;
      text-align: left;
      float: left;
      span {
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        float: left;
        margin-left: 5px;
      }
      i {
        font-size: 20px;
        display: block;
        float: right;
        margin-top: 5px;
        cursor: pointer;
      }
    }
  }
  .org-check-box {
    width: 450px;
    height: 280px;
    overflow: hidden;
    .org-item {
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      border-bottom: 1px solid #e9ebf2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .org-name {
        margin-left: 10px;
        cursor: pointer;
      }
      .org-name.active {
        color: #409eff;
      }
    }
    .son-item {
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      box-sizing: border-box;
      padding-left: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .org-item.active {
      background: #fff;
      border-right: 1px solid #fff;
      position: relative;
      z-index: 99;
    }
    .org-father {
      width: 150px;
      height: 100%;
      float: left;
      position: relative;
      .line {
        position: absolute;
        right: 0px;
        top: 0px;
        width: 0px;
        height: 100%;
        border-right: 1px solid #e9ebf2;
      }
    }
    .org-son {
      width: 300px;
      height: 100%;
      float: left;
      position: relative;
    }
    .loadmore {
      text-align: center;
    }
  }
}
</style>
<style lang="scss">
.org-check-box,
.org-selected-box {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
.el-upload-list {
  margin-bottom: 10px;
}
</style>
