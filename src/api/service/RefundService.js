/**
 * 退款单对外接口
 */

import request from '@/utils/request'

export default {

  /**
   * 退款
   */
  createRefund(postData) {
    return request.post('/mbr/refund/refund', postData);
  },

  /**
   * 获取退款单
   */
  get(refundId) {
    var params = {
      refundId: refundId
    }
    return request.get('/mbr/refund/get', {
      params: params
    });
  },

  /**
   * 分页查询退款单
   */
  query(params) {
    return request.get('/mbr/refund/query', {
      params: params
    });
  }
}
