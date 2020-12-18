/**
 * 权限常量 
 */
export default {
  /** ******************************* 系统组件 *******************************************/
  SYS: "sys",

  /**
   * 系统组件-菜单管理
   */
  SYS_MENU: "sys:menu",
  SYS_MENU_VIEW: "sys:menu:view",
  SYS_MENU_CREATE: "sys:menu:create",
  SYS_MENU_UPDATE: "sys:menu:update",
  SYS_MENU_REMOVE: "sys:menu:remove",

  /**
   * 系统组件-角色
   */
  SYS_ROLE: "sys:role",
  SYS_ROLE_VIEW: "sys:role:view",
  SYS_ROLE_CREATE: "sys:role:create",
  SYS_ROLE_UPDATE: "sys:role:update",
  SYS_ROLE_REMOVE: "sys:role:remove",
  SYS_ROLE_EDIT_PERMISSION: "sys:role:edit_permission",

  /**
   * 系统组件-组织
   */
  SYS_ORG: "sys:org",
  SYS_ORG_VIEW: "sys:org:view",
  SYS_ORG_CREATE: "sys:org:create",
  SYS_ORG_UPDATE: "sys:org:update",
  SYS_ORG_UPDATE_UPPER: "sys:org:updateUpper",
  SYS_ORG_DISABLE: "sys:org:disable",
  SYS_ORG_ENABLE: "sys:org:enable",
  SYS_ORG_EDIT_ROLE: "sys:org:edit_role",

  /**
   * 系统组件-用户
   */
  SYS_USER: "sys:user",
  SYS_USER_VIEW: "sys:user:view",
  SYS_USER_CREATE: "sys:user:create",
  SYS_USER_UPDATE: "sys:user:update",
  SYS_USER_UPDATE_ORG: "sys:user:update_org",
  SYS_USER_DISABLE: "sys:user:disable",
  SYS_USER_ENABLE: "sys:user:enable",
  SYS_USER_RESET_PWD: "sys:user:reset_pwd",
  SYS_USER_EDIT_ROLE: "sys:user:edit_role",
  SYS_USER_EXPORT: "sys:user:export",

  /**
   * 系统组件-监控管理
   */
  SYS_MONITOR: "sys:monitor",
  /**
   * 系统组件-监控管理-缓存管理
   */
  SYS_MONITOR_CACHE: "sys:monitor:cache",

  /**
   * 系统组件-监控管理-SQL管理
   */
  SYS_MONITOR_DRUID: "sys:monitor:druid",

  /**
   * 系统组件-上传文件
   */
  // SYS_DFS_UPLOAD : "sys:dfs:upload",

  /**
   * 系统组件-自定义服务通知模块
   */
  SYS_NOTIFY: "sys:notify",
  SYS_NOTIFY_CREATE: "sys:notify:create",
  SYS_NOTIFY_UPDATE: "sys:notify:update",
  SYS_NOTIFY_SUBMIT: "sys:notify:submit",
  SYS_NOTIFY_ABORT: "sys:notify:abort",
  SYS_NOTIFY_VIEW: "sys:notify:view",
  SYS_NOTIFY_SYS_EDIT: "sys:notify:sys:edit",
  /**
   * 微信订阅消息模块
   */
  SYS_WX_TEMPLATE: "sys:wx_template",
  SYS_WX_TEMPLATE_SYNC: "sys:wx_template:sync",
  /**
   * 系统组件-系统配置项
   */
  SYS_OPTIONS_UPDATE: "sys:options:update",
  SYS_OPTIONS_VIEW: "sys:options:view",

  /** ******************************* 商城组件 *******************************************/
  MALL: "mall",

  /**
   * 商城组件-商品
   */
  MALL_PRODUCT: "mall:product",
  MALL_PRODUCT_VIEW: "mall:product:view",
  MALL_PRODUCT_CREATE: "mall:product:create",
  MALL_PRODUCT_UPDATE: "mall:product:update",
  MALL_PRODUCT_REMOVE: "mall:product:remove",
  MALL_PRODUCT_RECOVER: "mall:product:recover",
  MALL_PRODUCT_CREATEINDEX: "mall:product:createIndex",

  /**
   * 商城组件-订单
   */
  MALL_ORDER: "mall:order",
  MALL_ORDER_VIEW: "mall:order:view",
  MALL_ORDER_CREATE: "mall:order:create",
  MALL_ORDER_PAY: "mall:order:pay",
  MALL_ORDER_CANCEL: "mall:order:cancel",
  MALL_ORDER_CONFIRM_RECEIVE: "mall:order:confirm_receive",
  MALL_ORDER_PUSH_TO_3RD: "mall:order:push_to_3rd",
  MALL_ORDER_MERCHANT_DISTRIBUTION: "mall:order:merchant_distribution",
  MALL_ORDER_PRINT_DELIVERY_BILL: "mall:order:print_delivery_bill",

  /**
   * 商城组件-订单备注
   */
  MALL_ORDER_REMARK: "mall:order_remark",
  MALL_ORDER_REMARK_VIEW: "mall:order_remark:view",

  /**
   * 商城组件-门店
   */
  MALL_STORE: "mall:store",
  MALL_STORE_VIEW: "mall:store:view",
  MALL_STORE_CREATE: "mall:store:create",
  MALL_STORE_UPDATE: "mall:store:update",

  /**
   * 商城组件-订单配送
   */
  MALL_DELIVERY: "mall:delivery",
  MALL_DELIVERY_GET_RIDE: "mall:delivery:get_ride",
  MALL_DELIVERY_PUSH_RECORD: "mall:delivery:push_record",
  MALL_DELIVERY_PUSH: "mall:delivery:push",

  /**
   * 商城组件-退款单
   */
  MALL_REFUND: "mall:refund",
  MALL_REFUND_VIEW: "mall:refund:view",
  MALL_REFUND_CREATE: "mall:refund:create",
  MALL_REFUND_APPROVE: "mall:refund:approve",

  /** ******************************* 促销组件 *******************************************/
  PROMOTION: "promotion",

  /**
   * 促销组件-促销单
   */
  PROMOTION_BILL: "promotion:bill",
  PROMOTION_BILL_VIEW: "promotion:bill:view",
  PROMOTION_BILL_CREATE: "promotion:bill:create",
  PROMOTION_BILL_UPDATE: "promotion:bill:update",
  PROMOTION_BILL_REMOVE: "promotion:bill:remove",
  PROMOTION_BILL_SUBMIT: "promotion:bill:submit",
  PROMOTION_BILL_ABOLISH: "promotion:bill:abolish",

  /** ******************************* 会员组件 *******************************************/
  MBR: "mbr",

  /**
   * 卖家
   */
  MBR_SELLER: "mbr:seller",
  MBR_SELLER_VIEW: "mbr:seller:view",

  /**
   * 卖家退款
   */
  MBR_SELLER_WITHDRAW_ACCOUNT: "mbr:seller_withdraw:account",
  MBR_SELLER_WITHDRAW_ACCOUNT_VIEW: "mbr:seller_withdraw_account:view",
  MBR_SELLER_WITHDRAW_FLOW_VIEW: "mbr:seller_withdraw_flow:view",
  MBR_SELLER_QUERY: "mbr:seller:query",
  MBR_SELLER_CREATE: "mbr:seller:create",
  MBR_SELLER_WITHDRAW_FLOW_QUERY_INTO_ACCOUNT_AMOUNT: "mbr:seller_withdraw_flow:query_into_account_amount",
  MBR_SELLER_WITHDRAW_FLOW_QUERY_CAN_WITHDRAW_AMOUNT: "mbr:seller_withdraw_flow:query_can_withdraw_amount",
  MBR_SELLER_UPDATE: "mbr:seller:update",

  /** ******************************** 报表组件 *******************************************/
  REPORT: "report",
  /**
   * 报表组件-动态报表
   */
  REPORT_DYNAMIC: "report:dynamic",
  REPORT_DYNAMIC_DESIGNER: "report:dynamic:designer",

  /** ******************************* 微信小程序组件 *******************************************/

  /**
   * 微信小程序组件-微信小程序账户管理
   */
  WXA_ACCOUNT: "wxa:account",
  WXA_ACCOUNT_CREATE: "wxa:account:create",
  WXA_ACCOUNT_UPDATE: "wxa:account:update",
  WXA_ACCOUNT_VIEW: "wxa:account:view",
  WXA_ACCOUNT_DELETE: "wxa:account:delete",

  /**
   * 系统组件-APP版本管理
   */
  SYS_APP: "sys:app",
  SYS_APP_VIEW: "sys:app:view",
  SYS_APP_CREATE: "sys:app:create",
  SYS_APP_UPDATE: "sys:app:update",
  SYS_APP_REMOVE: "sys:app:remove"
}
