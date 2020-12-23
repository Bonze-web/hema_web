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
    return request.get('/product/productSupplier/query', {param: data})
  },
  /**
   * 获取详情
   */
  getSuppliersDetail(id) {
    return request.get('/wms/dock/getDetail?id=' + id)
  },
  /**
   * 创建新的码头的按钮
   */
  createSuppliers(postData) {
    const param = {
      ...postData
    }
    return request.post('/wms/dock/create', param)
  },
  /**
   * 启用状态
   */
  openSuppliers(id, version) {
    return request.put('/wms/dock/updateStatus?id=' + id + '&version=' + version + '&status=' + true);
  },
  /**
   * 禁用状态
   */
  closeSuppliers(id, version) {
    return request.put('/wms/dock/updateStatus?id=' + id + '&version=' + version + '&status=' + false);
  },
  /**
   * 编辑的接口
   */
  updateSupplier(postData) {
    const param = {
        ...postData
    }
    return request.post('/wms/dock/update', param)
  }
}

