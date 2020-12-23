<template>
  <div class="create-template-message">
    <page-title :pageTitle="pageTitle" @handleSave="handleSave" :hasSave="pageStatus !== 'read'"></page-title>
    <div class="content">
      <div class="content-top">基本信息</div>
      <div class="content-main">
        <el-form ref="createForm" label-position="right" :model="createForm" :rules="createFormRule" label-width="180px">
          <!-- <el-form-item label="推送方式：">
            <el-radio-group :disabled="pageStatus === 'read'">
              <el-radio :label="true">系统默认推送</el-radio>
              <el-radio :label="false">手动推送</el-radio>
            </el-radio-group>
          </el-form-item>-->
          <el-form-item label="推送条件：">
            <el-radio-group :disabled="pageStatus === 'read'" v-model="createForm.sendMsgCondition" @change="handleSendMsgCondition">
              <el-radio label="1">
                <el-select :disabled="pageStatus === 'read'" v-model="createForm.condition.daysOfNoOrder" placeholder="7" class="width70" @focus="handleDaysOfNoOrderFocus">
                  <el-option v-for="item in days" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>&nbsp;&nbsp;天内未下单
              </el-radio>
              <el-radio label="2">
                <el-select :disabled="pageStatus === 'read'" v-model="createForm.condition.daysOfOrder" placeholder="7" class="width70" @focus="handleDaysOfOrderFocus">
                  <el-option v-for="item in days" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>&nbsp;&nbsp;天内下过单
                <span style="font-size:12px;color:#999;margin-left: 10px;">微信小程序只允许7天内推送有限条数的模板消息</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="活动名称：" prop="activityName">
            <el-input :disabled="pageStatus === 'read'" type="text" v-model="createForm.activityName" class="width360" placeholder="请输入活动名称"></el-input>
          </el-form-item>
          <el-form-item label="活动时间：" prop="activityTime">
            <el-date-picker :disabled="pageStatus === 'read'" size="small" v-model="createForm.activityTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" range-separator="至" start-placeholder="活动开始日期" end-placeholder="活动结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item prop="activityContent" label="活动内容：">
            <el-input :disabled="pageStatus === 'read'" v-model="createForm.activityContent" class="width360" placeholder="请输入活动内容"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import PageTitle from "@/components/pageTitle.vue";
import CustomtplmsgService from "@/api/service/CustomtplmsgService";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  data() {
    const validatProductId = (rule, value, callback) => {
      if (this.createForm.linkType === "PRODUCT" && value === "") {
        callback(new Error("请选择跳转商品"));
      } else {
        callback();
      }
    };
    const validatAppReturnType = (rule, value, callback) => {
      if (this.createForm.linkType === "APP" && value === "") {
        callback(new Error("请选择APP跳转模块"));
      } else {
        callback();
      }
    };
    return {
      PermIds: PermIds,
      prj: "", // 当前项目
      uploadHeaders: {
        "access-token": getToken()
      },
      pageTitle: "新建自定义模板消息",
      isEdit: false, // 是否是编辑状态
      status: "",
      pageStatus: "create", // 当前页面默认为创建状态
      createForm: {
        id: "", // 活动id，只有编辑查看状态下才有
        sendMsgCondition: "1", // 服务通知发送条件 1 N天内未下单,2 N天内下过单
        condition: {
          // 服务通知发送条件
          daysOfNoOrder: "", // N天内未下单
          daysOfOrder: "" // N天内下过单
        },
        linkType: "", // 跳转到类型 url网页 、商品 app app模块
        page: "", // 跳转的小程序页面，包括参数一并传入
        activityName: "", // 活动名称
        activityContent: "", // 活动内容
        activityTime: [], // 活动时间
        link: "", // 跳转URL类型link地址:当图片跳转类型为URL类型时，此字段必传
        appReturnType: "", // APP跳转模块
        productId: "", // 跳转PRODUCT类型商品ID
        productName: "", // 跳转PRODUCT类型商品名称
        grabActivityId: "", // 秒杀活动id
        grabProductId: "", // 秒杀商品id
        grabProductName: "", // 秒杀商品名称
        teamActivityId: "", // 拼团活动id
        teamProductId: "", // 拼团商品id
        teamProductName: "", // 拼团商品名称
        couponActivityId: "", // 关联券活动id
        couponActivityName: "", // 券活动名称
        giftcardActivityId: "", // 礼品卡id
        giftcardName: "", // 礼品卡名称
        helpActivityId: "", // 助力活动id
        helpActivityName: "", // 助力活动名称
        productMenuId: "", // 商品分类id
        productMenuName: "", // 商品分类名称
        packagingId: "", // 打包一口价活动id
        packagingActivityName: "" // 打包一口价活动名称
      },
      createFormRule: {
        productId: [{ validator: validatProductId, trigger: "change" }],
        activityName: [
          { required: true, message: "请填写活动名称", trigger: "blur" }
        ],
        activityContent: [
          { required: true, message: "请填写活动内容", trigger: "blur" }
        ],
        activityTime: [
          { required: true, message: "请输入活动时间", trigger: "blur" }
        ],
        appReturnType: [{ validator: validatAppReturnType, trigger: "change" }]
      },
      selectGoodsVisible: false, // 控制商品选择框弹出隐藏
      selectGiftcardVisible: false, // 控制礼品卡选择框弹出隐藏
      selectCouponVisible: false, // 控制优惠券选择框弹出隐藏
      selectCouponLoading: false,
      addGoodsLoading: false,
      selectAdsVisible: false, // 控制选择广告页弹出隐藏
      days: [
        {
          label: 1,
          value: 1
        },
        {
          label: 2,
          value: 2
        },
        {
          label: 3,
          value: 3
        },
        {
          label: 4,
          value: 4
        },
        {
          label: 5,
          value: 5
        },
        {
          label: 6,
          value: 6
        },
        {
          label: 7,
          value: 7
        }
      ],
      selectedCoupon: [], // 选择的券
      queryType: "normal", // 选择商品的类型，普通商品normal,秒杀商品grab,拼团商品team
      helpActivityDialogVisible: false, // 助力活动列表弹框
      helpActivitySearchValue: "", // 助力活动搜索关键字
      helpActivityAll: [], // 查询的所有助力活动
      includeChild: true,
      categoryList: [],
      productMenuId: [],
      packagingActivityDialogVisible: false
    };
  },
  computed: {
    ...mapGetters(["hasPermission", "workingOrg"])
  },
  methods: {
    handleDaysOfNoOrderFocus() {
      this.createForm.sendMsgCondition = "1";
      this.createForm.condition.daysOfOrder = "";
    },
    handleDaysOfOrderFocus() {
      this.createForm.sendMsgCondition = "2";
      this.createForm.condition.daysOfNoOrder = "";
    },
    handleSendMsgCondition() {
      this.createForm.condition.daysOfOrder = "";
      this.createForm.condition.daysOfNoOrder = "";
    },

    /* 选择商品按钮点击后的结果处理 */
    handleSelectResult(val) {
      // val中包含商品id和商品名称，将结果保存到对应的参数中
      if (this.createForm.linkType === "PRODUCT") {
        // 如果是处理普通商品
        this.createForm.business = val.business;
        this.createForm.productId = val.productId;
        this.createForm.productName = val.productName;
      } else if (this.createForm.linkType === "GRADPRODUCT") {
        // 如果是处理秒杀商品
        this.createForm.grabActivityId = val.activityId;
        this.createForm.productId = val.productId;
        this.createForm.grabProductName = val.productName;
      } else if (this.createForm.linkType === "TEAMPRODUCT") {
        // 如果是处理拼团商品
        this.createForm.teamActivityId = val.activityId;
        this.createForm.teamProductName = val.productName;
      }
    },
    /* 礼品卡选择结果处理 */
    giftcardSelectResult(val) {
      this.createForm.giftcardActivityId = val.id;
      this.createForm.giftcardName = val.name;
    },
    /* 优惠券选择结果处理 */
    couponSelectResult(val) {
      this.createForm.couponActivityId = val.id;
      this.createForm.couponActivityName = val.name;
    },
    /* 选择商品 */
    handleSelect(val) {
      // val中包含商品id和商品名称，将结果保存到对应的参数中
      if (this.createForm.linkType === "PRODUCT") {
        // 如果是处理普通商品
        // this.createForm.business = val.business;
        this.createForm.productId = val.productId;
        this.createForm.productName = val.productName;
      } else if (this.createForm.linkType === "GRADPRODUCT") {
        // 如果是处理秒杀商品
        this.createForm.grabActivityId = val.activityId;
        this.createForm.grabProductId = val.productId;
        this.createForm.grabProductName = val.productName;
      } else if (this.createForm.linkType === "TEAMPRODUCT") {
        // 如果是处理拼团商品
        this.createForm.teamActivityId = val.activityId;
        this.createForm.teamProductName = val.productName;
      }
    },
    /* 处理请求数据 */
    handlePostData() {
      var tempData = {
        condition: {},
        linkType: this.createForm.linkType,
        activityName: this.createForm.activityName,
        activityContent: this.createForm.activityContent,
        startTime: this.createForm.activityTime[0],
        endTime: this.createForm.activityTime[1],
        page: ""
      };
      if (this.createForm.sendMsgCondition === "1") {
        tempData.condition.daysOfNoOrder = this.createForm.condition
          .daysOfNoOrder
          ? this.createForm.condition.daysOfNoOrder
          : 7;
      } else {
        tempData.condition.daysOfOrder = this.createForm.condition.daysOfOrder
          ? this.createForm.condition.daysOfOrder
          : 7;
      }
      var page = "";
      // 处理小程序需要跳转的页面路径 PRODUCT,GRADPRODUCT, TEAMPRODUCT, COUPONACTIVITYDETAILS, GIFTCARDACTIVITYDETAILS, APP
      if (this.createForm.linkType === "PRODUCT") {
        // 如果当前图片的关联是普通商品，跳转到商品详情
        // eslint-disable-next-line
        page =
          "/pages/mallModule/goods/goodsDetail/goodsDetail?productId=" +
          this.createForm.productId +
          "&type=normal";
      } else if (this.createForm.linkType === "GRADPRODUCT") {
        // 如果当前图片的关联是秒杀商品，跳转到商品详情，传递活动id，商品id和类型
        // eslint-disable-next-line
        page =
          "/pages/mallModule/goods/goodsDetail/goodsDetail?productId=" +
          this.createForm.grabProductId +
          "&activityId=" +
          this.createForm.gradActivityId +
          "&type=secondkill";
      } else if (this.createForm.linkType === "TEAMPRODUCT") {
        // 如果当前图片的关联是拼团商品，跳转到商品详情,传递拼团活动id
        // eslint-disable-next-line
        page =
          "/pages/mallModule/goods/goodsDetail/goodsDetail?productId=" +
          this.createForm.teamActivityId +
          "&type=group";
      } else if (this.createForm.linkType === "COUPONACTIVITYDETAILS") {
        // 如果当前图片的关联是优惠券详情，跳转到对应的优惠券详情,传递优惠券id
        // eslint-disable-next-line
        page =
          "/pages/mallModule/coupon/couponDetails/couponDetails?couponActivityId=" +
          this.createForm.couponActivityId +
          "&type=assign&isExternal=false";
      } else if (this.createForm.linkType === "GIFTCARDACTIVITYDETAILS") {
        // 如果当前图片的关联是优惠券详情，跳转到对应的优惠券详情,传递优惠券id
        // eslint-disable-next-line
        page =
          "/pages/memberModule/giftCard/giftCardBuy/giftCardBuy?giftCardActivityId=" +
          this.createForm.giftcardActivityId;
      } else if (this.createForm.linkType === "APP") {
        // 如果当前图片的关联是APP模块，根据对应的模块，跳转到对应的模块
        if (this.createForm.appReturnType === "MIAOSHA") {
          // 跳转到秒杀列表
          page = "/pages/mallModule/activity/seckill/seckill";
        } else if (this.createForm.appReturnType === "TEAM_BUYING") {
          // 跳转到拼团列表
          page = "/pages/mallModule/fightGroup/fightGroup/fightGroup";
        } else if (this.createForm.appReturnType === "MEAL") {
          // 如果是餐饮模块，不进行跳转，小程序没有专门的餐饮模块
        } else if (this.createForm.appReturnType === "RECEIVECOUPON") {
          // 跳转到领券中心
          page = "/pages/mallModule/coupon/couponCenter/couponCenter";
        } else if (this.createForm.appReturnType === "SCOREMALL") {
          // 跳转到积分商城
          page = "/pages/mallModule/score/scoreMall/scoreMall";
        } else if (this.createForm.appReturnType === "RECHARGE") {
          // 跳转到充值中心
          page = "/pages/mallModule/myCard/recharge/recharge";
        } else if (this.createForm.appReturnType === "ADVANCE_SELL_PRODUCT") {
          // 跳转到预售商品
          page = "/pages/mallModule/activity/advanceSell/advanceSell";
        } else if (this.createForm.appReturnType === "INVITE_MEMBER") {
          // 跳转到邀请好友
          page = "/pages/mallModule/invite/invite";
        } else if (this.createForm.appReturnType === "MEMBER_CARD") {
          // 跳转到会员卡
          page = "/pages/mallModule/myCard/memberCard/memberCard";
        } else if (this.createForm.appReturnType === "MY_COUPON") {
          // 跳转到我的优惠券
          page = "/pages/mallModule/coupon/myCoupon/myCoupon";
        } else if (this.createForm.appReturnType === "NEWMBR") {
          // 新用户专享
          page = "/pages/mallModule/activity/newmbrActivity/newmbrActivity";
        } else if (this.createForm.appReturnType === "HELP_COUPON") {
          // 跳转到助力送券
          page =
            "/pages/mallModule/activity/assistanceCoupon/assistanceCoupon?helpActivityId=" +
            this.createForm.helpActivityId;
        } else if (this.createForm.appReturnType === "PACKAGING") {
          // 跳转到打包一口价
          page =
            "/pages/mallModule/goods/packaging/packaging?packagingId=" +
            this.createForm.packagingId;
        } else if (this.createForm.appReturnType === "CREDIT_CARD") {
          // 跳转到信用卡开卡
          page = "/pages/mallModule/creditCard/creditCard";
        } else if (this.createForm.appReturnType === "BARGAIN") {
          // 跳转到信用卡开卡
          page = "/pages/mallModule/bargain/bargainList/bargainList";
        } else if (this.createForm.appReturnType === "PENNY") {
          // 跳转到购物抽奖
          page = "/pages/mallModule/activity/penny/pennyList/pennyList";
        } else if (this.createForm.appReturnType === "MINI_APP_HOME") {
          // 跳转到信用卡开卡
          page = "/pages/mallModule/index/index/index";
        } else if (this.createForm.appReturnType === "PRODUCT_MENU") {
          // 跳转商品分类页面
          var opts = "";
          if (this.createForm.productMenuId) {
            opts = "?categoryId=" + this.createForm.productMenuId;
          }
          page =
            "/pages/mallModule/tabbar/category/category-list/category-list" +
            opts;
        } else if (this.createForm.appReturnType === "NEW_GOODS") {
          // 跳转到新品专区
          page = "/pages/mallModule/goods/newGoods/newGoods";
        } else if (this.createForm.appReturnType === "RECHARGE_DRAW") {
          // 跳转到充值抽奖
          page = "/pages/mallModule/activity/lottery/lotteryIndex/lotteryIndex";
        } else if (this.createForm.appReturnType === "SOLITAIRE") {
          // 跳转到接龙活动
          page = "/pages/mall/solitaire/solitaireList/solitaireList";
        }
      }
      tempData.page = page;
      return tempData;
    },
    /* 根据小程序页面路径返回跳转的模块 */
    handlePages(pages) {
      var type = "";
      switch (pages) {
        case "/pages/mallModule/activity/seckill/seckill": // 秒杀列表
          type = "MIAOSHA";
          break;
        case "/pages/mallModule/fightGroup/fightGroup/fightGroup": // 拼团列表
          type = "TEAM_BUYING";
          break;
        case "/pages/mallModule/coupon/couponCenter/couponCenter": // 领券中心
          type = "RECEIVECOUPON";
          break;
        case "/pages/mallModule/score/scoreMall/scoreMall": // 积分商品
          type = "SCOREMALL";
          break;
        case "/pages/mallModule/myCard/recharge/recharge": // 充值中心
          type = "RECHARGE";
          break;
        case "/pages/mallModule/activity/advanceSell/advanceSell": // 预售列表
          type = "ADVANCE_SELL_PRODUCT";
          break;
        case "/pages/mallModule/invite/invite": // 邀请好友
          type = "INVITE_MEMBER";
          break;
        case "/pages/mallModule/myCard/memberCard/memberCard": // 会员卡页面
          type = "MEMBER_CARD";
          break;
        case "/pages/mallModule/coupon/myCoupon/myCoupon": // 我的优惠券
          type = "MY_COUPON";
          break;
        case "/pages/mallModule/activity/assistanceCoupon/assistanceCoupon": // 助力送券
          type = "HELP_COUPON";
          break;
        case "/pages/mallModule/creditCard/creditCard": // 信用卡开卡
          type = "CREDIT_CARD";
          break;
        case "/pages/mallModule/tabbar/category/category-list/category-list": // 商品目录
          type = "PRODUCT_MENU";
          break;
        case "/pages/mallModule/activity/newmbrActivity/newmbrActivity": // 新会员专享
          type = "NEWMBR";
          break;
        case "/pages/mallModule/bargain/bargainList/bargainList": // 砍价模块
          type = "BARGAIN";
          break;
        case "/pages/mallModule/activity/penny/pennyList/pennyList": // 购物抽奖
          type = "PENNY";
          break;
        case "/pages/mallModule/index/index/index": // 小程序首页
          type = "MINI_APP_HOME";
          break;
        case "/pages/mallModule/goods/newGoods/newGoods": // 新品专区
          type = "NEW_GOODS";
          break;
        case "/pages/mallModule/activity/lottery/lotteryIndex/lotteryIndex": // 充值抽奖
          type = "RECHARGE_DRAW";
          break;
        case "/pages/mall/solitaire/solitaireList/solitaireList": // 接龙活动
          type = "SOLITAIRE";
          break;
        default:
          type = "";
          break;
      }
      return type;
    },
    /* 保存操作 */
    handleSave() {
      this.$refs["createForm"].validate(valid => {
        if (valid) {
          var postData = this.handlePostData();
          if (this.isEdit) {
            postData.id = this.createForm.id;
            CustomtplmsgService.update(postData)
              .then(res => {
                this.$router.back(-1);
                this.$message.success("更新成功");
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          } else {
            CustomtplmsgService.create(postData)
              .then(res => {
                this.$router.back(-1);
                this.$message.success("保存成功");
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          }
        } else {
          return false;
        }
      });
    },
    /* 处理小程序路径参数 */
    urlSearch(pages) {
      var query = {};
      var name, value;
      var num = pages.indexOf("?");
      const page = num > 0 ? pages.substring(0, num) : pages;
      pages = pages.substr(num + 1); // 取得所有参数   stringvar.substr(start [, length ]
      var arr = pages.split("&"); // 各个参数放到数组里
      for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
          name = arr[i].substring(0, num);
          value = arr[i].substr(num + 1);
          query[name] = value;
        }
      }
      return {
        pages: page,
        query: query
      };
    },
    /* 查询详情 */
    getDetails(templateMsgInfo) {
      this.status = templateMsgInfo.status;
      this.createForm.id = templateMsgInfo.id;
      this.createForm.linkType = templateMsgInfo.linkType;
      if (templateMsgInfo.condition.daysOfNoOrder) {
        this.createForm.sendMsgCondition = "1";
        this.createForm.condition.daysOfNoOrder =
          templateMsgInfo.condition.daysOfNoOrder;
      } else if (templateMsgInfo.condition.daysOfOrder) {
        this.createForm.sendMsgCondition = "2";
        this.createForm.condition.daysOfOrder =
          templateMsgInfo.condition.daysOfOrder;
      }
      this.createForm.activityContent = templateMsgInfo.activityContent;
      this.createForm.activityName = templateMsgInfo.activityName;
      this.createForm.activityTime = [
        templateMsgInfo.startTime,
        templateMsgInfo.endTime
      ];
      this.createForm.page = templateMsgInfo.page;
      const options = this.urlSearch(templateMsgInfo.page);
      if (templateMsgInfo.linkType === "APP") {
        this.createForm.appReturnType = this.handlePages(options.pages);
      }
      console.log(options);
      // 跳转类目id
      this.createForm.productMenuId = options.query.categoryId
        ? options.query.categoryId
        : null;
      if (options.query.categoryId) {
        this.productMenuId.push(options.query.categoryId);
      }
    },
    // 获取SAAS租户信息
    getSaasTenant() {
      if (process.env.PRJ === "SAAS") {
        var tenant = localStorage.getItem("_tenant_");
        if (tenant) {
          this.uploadHeaders["tenant"] = tenant;
        }
      } else {
        this.uploadHeaders["tenant"] = "hema";
      }
    }
  },
  created() {
    this.prj = process.env.PRJ;
    this.getSaasTenant()
  },
  mounted() {
    this.pageStatus = this.$route.query.pageStatus;
    if (this.pageStatus === "edit" || this.pageStatus === "read") {
      var templateMsgInfo = this.$route.query.templateMsgInfo
        ? JSON.parse(this.$route.query.templateMsgInfo)
        : null;
      if (templateMsgInfo) {
        this.isEdit = true;
        this.pageTitle =
          this.pageStatus === "edit"
            ? "编辑自定义模板消息"
            : "查看自定义模板消息";
        this.getDetails(templateMsgInfo);
      }
    } else {
      this.isEdit = false;
      this.pageTitle = "新建自定义模板消息";
    }
    this.queryMenu();
  },
  filters: {
    filtFunction: function(val) {
      let res = "";
      if (val === "CASH") {
        res = "现金券";
      } else if (val === "DISCOUNT") {
        res = "折扣券";
      } else if (val === "GIFT") {
        res = "礼品券";
      } else if (val === "FREESHIP") {
        res = "免邮券";
      } else if (val === "PACKAGE") {
        res = "券包";
      } else if (val === "PRODUCT") {
        res = "商品券";
      }
      return res;
    }
  },
  components: {
    PageTitle
  }
};
</script>
<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.create-template-message {
  @include common;
  .content {
    &-top {
      margin-left: 60px;
      line-height: 30px;
    }
    &-main {
      margin-left: 150px;
      min-width: 600px;
    }
    .checked-coupon {
      color: #409eff;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
.width360 {
  width: 360px;
}
.width70 {
  width: 70px;
}
</style>
<style lang="scss">
.create-template-message {
  .el-radio {
    margin-bottom: 10px;
    display: block;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>
