/* 
 *基本资料相关接口 
*/
import request from '@/utils/request'

export default {
  /**
  * @param {int} pageSize
  * @param {int} page
  */
  requestNewProjectsList(postData) {
    return request.post('/wms/pickOrder/create', postData)
  },
  searchData(postData) {
    return request.post('/wms/pickOrder/query', postData)
  },
  createSuppliers(postData) {
    return request.post('/wms/pickarea/create', postData)
  },
  getAllPickOrder(postData) {
    return request.post('/wms/pickOrder/getAllPickOrder', postData)
  },
  getAllGrpByPickId(pickOrderId) {
    return request.get('/wms/pickOrder/getAllGrpByPickId?pickOrderId=' + pickOrderId);
  },
  getAllStoreByGrpId(id) {
    return request.get('/wms/pickOrder/getAllStoreByGrpId?grpId=' + id);
  },
  getById(id) {
    return request.get('/wms/pickOrder/getById?id=' + id);
  },
  getGrpById(id) {
    return request.get('/wms/pickOrder/getGrpById?id=' + id);
  },
  getItemById(id) {
    return request.get('/wms/pickOrder/getItemById?id=' + id);
  },
  deleteGroupItem(itemData) {
    return request.delete('/wms/pickOrder/deleteGrp?id=' + itemData.id + "&version=" + itemData.version);
  },
  deleteSchemeItem(itemData) {
    return request.delete('/wms/pickOrder/delete?id=' + itemData.id + "&version=" + itemData.version);
  },
  deleteItem(id, version) {
    return request.delete('/wms/pickOrder/deleteItem?id=' + id + "&version=" + version);
  },
  // 修改调序
  postAdjustOrder(postData) {
    return request.post('/wms/pickOrder/adjustOrder', postData)
  },
  createGrp(postData) {
    return request.post('/wms/pickOrder/createGrp', postData)
  },
  updateScheme(postData) {
    return request.post('/wms/pickOrder/update', postData)
  },
  updateGrpScheme(postData) {
    return request.post('/wms/pickOrder/updateGrp', postData)
  },
  queryItem(postData) {
    return request.get('/wms/store/query', {params: postData});
  },
  addGrpItems(postData) {
    return request.post('/wms/pickOrder/addGrpItems', postData)
  },
  adjustOrder(postData) {
    return request.post('/wms/pickOrder/adjustOrder', postData)
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
    return request.post('/wms/storagearea/update', postData)
  },
  getFrontByDcId(postData) {
    return request.get('/sys/dc/getFrontByDcId', { params: postData });
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

