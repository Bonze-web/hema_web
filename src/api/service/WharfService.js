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
  getSuppliersList(postData) {
    const param = {
      ...postData
    }
    // return request.post('/wms/dock/query', param)
    return request.post('/wms/dock/query', param)
    // return request.get('/product/productSupplier/query', {param: data})
  },
  /**
   * 获取详情
   */
  getSuppliersDetail(id) {
    console.log(id);
    // return request.get('/wms/dock/getDetail?id=' + id)
    // return request.get('/wms/dock/getDetail?id=' + id)
    return request.get('/wms/dock/getDetail?id=' + id)
  },
  /**
   * 创建新的码头的按钮
   */
  createSuppliers(postData) {
    // return request.post('/wms/dock/create', param)
    return request.post('/wms/dock/create', postData)
  },
  /**
   * 启用状态
   */
  openSuppliers(id, version, status) {
    console.log(id, version, status);
    // return request.put('/wms/dock/updateStatus?id=' + id + '&version=' + version + '&status=' + true);
    return request.put('/wms/dock/updateStatus?id=' + id + '&version=' + version + '&status=' + status)
  },
  /**
   * 禁用状态
   */
  closeSuppliers(status, id, version) {
    // return request.put('/wms/dock/updateStatus?id=' + id + '&version=' + version + '&status=' + false);
    return request.put('/wms/dock/updateStatus?id=' + id + '&version=' + version + '&status=' + status)
  },
  /**
   * 编辑的接口
   */
  updateSupplier(postData) {
    // return request.post('/wms/dock/update', param)
    return request.post('/wms/dock/update', postData)
  },
  /**
   * 去调取物流中心的接口,让用户来选物流中心
   */
  getdcdata() {
    var postData = {
      page: 0,
      pageSize: 0
    }
    return request.get('/sys/dc/query', postData);
  }
}

