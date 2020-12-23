/* 
 *基本资料相关接口 
*/
import request from '@/utils/request'

export default {
  /**
  * @param {int} pageSize
  * @param {int} page
  */
  // 一开始我就要请求的接口
  // 分页的接口请求
  getSuppliersList(data) {
    // return request.post('/wms/dock/query', {param: data});
    return request.post('/wms/pickarea/query', {param: data})
  },
  /**
   * 获取详情
   */
  getSuppliersDetail(id) {
    return request.get('/wms/pickarea/getDetail?id=' + id)
  },
  /**
   * 创建
   */
  createSuppliers(postData) {
    return request.post('/wms/pickarea/create', postData)
  },
 
  /**
   * 编辑的接口
   */
  updateSupplier(postData) {
    return request.post('/wms/pickarea/update', postData)
  },

   /**
   * 启用状态
   */
  openSuppliers(id, version) {
    return request.put('/wms/dock/updateStatus?id=' + id + '&version=' + version);
  },
  /**
   * 禁用状态
   */
  closeSuppliers(id, version) {
    return request.put('/wms/dock/updateStatus?id=' + id + '&version=' + version);
  }
}

