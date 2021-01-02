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
  passUpdateInfoBill(ids) {
    return request.get('/stock/updateInfoBill/pass', { params: ids })
  },
  /**
   * 审核作废
   */
  noPassUpdateInfoBill(opt) {
    return request.get('/stock/updateInfoBill/noPass', { params: opt })
  },
  /**
   * 查询供应商
   */
  productSupplierQuery(opt) {
    return request.get('/product/productSupplier/query', { params: opt })
  }

  /**
  * 
  * 
  * 库存信息调整单接口结束
  * 
  * 
  */
}
