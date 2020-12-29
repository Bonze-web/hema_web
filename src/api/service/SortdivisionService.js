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
    return request.get('/wms/pickarea/query', {params: postData})
  },
  /**
   * 获取详情
   */
  getSuppliersDetail(id) {
    // return request.get('/wms/storagearea/getDetail?id=' + id)
    // return request.get('/wms/storagearea/getDetail?id=' + id)
    return request.get('/wms/pickarea/getDetail?id=' + id)
  },
  /**
   * 创建新的码头的按钮
   */
  createSuppliers(postData) {
    // return request.post('/wms/storagearea/create', param)
    return request.post('/wms/pickarea/create', postData)
  },
  /**
   * 启用状态
   */
  openSuppliers(id, version, status) {
    console.log(id, version, status);
    // return request.put('/wms/storagearea/updateStatus?id=' + id + '&version=' + version + '&status=' + true);
    return request.put('/wms/storagearea/updateStatus?id=' + id + '&version=' + version + '&status=' + status)
  },
  /**
   * 禁用状态
   */
  closeSuppliers(status, id, version) {
    // return request.put('/wms/storagearea/updateStatus?id=' + id + '&version=' + version + '&status=' + false);
    return request.put('/wms/storagearea/updateStatus?id=' + id + '&version=' + version + '&status=' + status)
  },
  /**
   * 编辑的接口
   */
  updateSupplier(postData) {
    // return request.post('/wms/storagearea/update', param)
    return request.post('/wms/pickarea/update', postData)
  },
  /**
   * 去调取物流中心的接口,让用户来选物流中心
   */
  deleteData(id, version) {
    return request.put('/wms/pickarea/delete?id=' + id + '&version=' + version);
  },
  // 获取存储分区的内容
  storedContentService(postData) {
    console.log(postData);
    // var postData = {
    //   page: 0,
    //   pageSize: 0
    // }
    return request.get('/wms/storagearea/query', {params: postData});
  }
}

