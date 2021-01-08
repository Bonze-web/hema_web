/* 
 *基本资料相关接口 
 */
import request from '@/utils/request'

export default {
  /**
   * @param {int} pageSize
   * @param {int} page
   */
  getSuppliersList(postData) {
    // return request.post('/wms/storagearea/query', param)
    // return request.get('/wms/storagearea/query', param)
    console.log(postData);
    return request.get('/wms/operate-bill/listByPage', {
      params: postData
    })
  },
  /**
   * 获取详情
   */
  getSuppliersDetail(id) {
    // return request.get('/wms/storagearea/getDetail?id=' + id)
    // return request.get('/wms/storagearea/getDetail?id=' + id)
    return request.get('/wms/operate-bill/getById?id=' + id)
  }
}
