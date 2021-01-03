/* 
 * 容器拆并单相关接口  &&  库存信息调整单接口
 */
import request from '@/utils/request'

export default {
  /**
  * 
  * 
  * 容器拆并单相关接口开始
  * 
  * 
  */

  /**
  * 分页查询商品拆并单接口
  */
  queryContainerMergerBill(opt) {
    return request.get('/wms/containerMergerBill/query', { params: opt });
  },
  /**
  * 容器拆并单详情
  */
  getByIdContainerMergerBill(id) {
    return request.get('/wms/containerMergerBill/getById?id=' + id);
  },
  /**
  * 
  * 
  * 容器拆并单相关接口结束
  * 
  * 
  */

  /**
  * 
  * 
  * 库存信息调整单接口开始
  * 
  * 
  */

  /**
  * 分页查询库存信息修改申请单
  */
  stockUpdateInfoBillQuery(opt) {
    return request.get('/stock/updateInfoBill/query', { params: opt });
  },
  /**
   * 查找商品库存
   */
  getAllStock(data) {
    return request.get('/stock/query', {params: data})
  },
  /**
   * 创建库存信息修改申请单
   */
  createUpdateInfoBill(opt) {
    return request.post('/stock/updateInfoBill/create', {details: opt})
  },
  /**
   * 审核通过
   */
  passUpdateInfoBill(arr) {
    let list = '';
    arr.forEach(item => {
      list += `ids=${item}&`
    });
    return request.get('/stock/updateInfoBill/pass?' + list)
  },
  /**
   * 审核作废
   */
  noPassUpdateInfoBill(arr, text) {
    let list = '';
    arr.forEach(item => {
      list += `ids=${item}&`
    });
    return request.get('/stock/updateInfoBill/noPass?' + list + '&reason=' + text)
  },
  /**
   * 查询供应商
   */
  productSupplierQuery(opt) {
    return request.get('/product/productSupplier/query', { params: opt })
  },
  /**
   * 查询库存信息修改申请单详情
   */
  billUpdateInfoBill(id) {
    return request.get('/stock/updateInfoBill/getById?id=' + id)
  },

  /**
  * 库存信息调整单接口结束
  */

  /**
  * 锁定解锁单开始
  */
  stockLocjBill(opt) {
    // 锁定解锁单分页查询
    return request.get('/stock/lock-bill', { params: opt })
  },
  deleteStockLocjBill(id) {
    // 锁定解锁单  删除接口
    return request.delete('/stock/lock-bill/' + id)
  },
  detailsStockLocjBill(id) {
    // 锁定解锁单 详情接口
    return request.get('/stock/lock-bill/' + id)
  },
  newStockLocjBill(opt) {
    // 锁定解锁单 新增接口
    return request.put('/stock/lock-bill', { params: opt })
  },
  nauditStockLocjBill(opt) {
    // 锁定解锁单 审核接口
    return request.post('/stock/lock-bill/audit', opt)
  }
  /**
  * 锁定解锁单结束
  */
}
