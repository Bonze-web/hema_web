/**
 * 卖家管理接口
 */

// var qs = require('qs');
import request from '@/utils/request'

export default {
  /**
   * 查询卖家申请列表
   */
  getRegistSeller(data) {
    return request.get('/mbr/seller/getSellerList?page=' + data.page + '&status=' + (data.status ? data.status : '') + '&pageSize=' + data.pageSize + '&applicationTimeBegin=' + (data.applicationTimeBegin ? data.applicationTimeBegin : '') + '&applicationTimeEnd=' + (data.applicationTimeEnd ? data.applicationTimeEnd : '') + '&mobile=' + (data.mobile ? data.mobile : '') + '&name=' + (data.name ? data.name : '') + '&searchCount=true')
  },
  /**
   * 
   * 审核通过卖家请求
   */
  // 
  agreeRegist(sellerId) {
    return request.put('/mbr/seller/pass?sellerId=' + sellerId)
  },
  /**
   * 拒绝审核通过
   */
  notAgree(sellerId, reason) {
    return request.put('/mbr/seller/refuse?sellerId=' + sellerId + '&reason=' + reason)
  },
  /**
   * 获取卖家详情
   */
  getSellerInfo(sellerId) {
    return request.get('/mbr/seller/getDetails?sellerId=' + sellerId)
  }

}
