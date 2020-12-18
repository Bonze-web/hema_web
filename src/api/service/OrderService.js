/**
 * 订单相关接口 
 */
import request from '@/utils/request'

export default {

  /**
   * 分页查询订单
   * @param page 当前页码
   * @param pageSize 每页记录数
   * @param searchCount 是否查询总记录数
   * @param status 订单状态等于null所有
   * @param mobile 手机号等于
   */
  query(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    };
    return request.get('/mbr/order/query', {
      params: params
    });
  },
  /**
   * 根据订单标识查询具体订单详情
   */
  getDetailsById(orderId) {
    var params = {
      orderId: orderId
    }
    return request.get('/mbr/order/getDetailsById', {
      params: params
    })
  }
}
