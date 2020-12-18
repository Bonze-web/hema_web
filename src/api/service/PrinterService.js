/* 
 *打印机配置相关接口 
 */
import request from '@/utils/request'

export default {

  /**
   * 创建门店打印机配置接口
   */
  create(postData) {
    return request.post('/catering/printer/create', postData);
  },
  /**
   * 根据门店Id查询打印机配置详情
   */
  getDetails(StoreId) {
    var params = {
      StoreId: StoreId
    }
    return request.get('/catering/printer/get', {
      params: params
    });
  },
  /**
   * 更新打印机配置
   */
  update(postData) {
    return request.put('/catering/printer/update', postData);
  }

}
