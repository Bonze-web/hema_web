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
    // return request.post('/wms/storagearea/query', param)
    // return request.get('/wms/storagearea/query', param)
    return request.get('/wms/userpickarea/query', {params: postData})
  },
  /**
   * 获取详情
   */
  getSuppliersDetail(id) {
    // return request.get('/wms/storagearea/getDetail?id=' + id)
    // return request.get('/wms/storagearea/getDetail?id=' + id)
    return request.get('/wms/userpickarea/getDetail?id=' + id)
  },
  getPickareaQuery() {
    const postData = {
        page: 1,
        pageSize: 0
    }
    return request.get('/wms/pickarea/query', {params: postData})
  },
  /**
   * 创建
   */
  createSuppliers(postData) {
    // return request.post('/wms/storagearea/create', param)
    return request.post('/wms/userpickarea/create', postData)
  },
  /**
   * 编辑的接口
   */
  updateSupplier(postData) {
    // return request.post('/wms/storagearea/update', param)
    return request.post('/wms/userpickarea/update', postData)
  },
  userQuery() {
    const postData = {
        page: 1,
        pageSize: 0
    }
    return request.get('/sys/user/query', {params: postData})
  }
}
