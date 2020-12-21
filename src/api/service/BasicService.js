/* 
 *基本资料相关接口 
*/
import request from '@/utils/request'

export default {
  /**
  * @param {int} pageSize
  * @param {int} page
  */

  /**
  * 基本资料中供应商相关接口
  */

  /**
  * 分页查询供应商列表
  */
  getSuppliersList(data) {
    return request.get('/product/productSupplier/query?page=' + data.page + '&pageSize=' + data.pageSize + '&searchCount=true' + '&codeOrNameEquals=' + (data.codeOrNameEquals ? data.codeOrNameEquals : '') + '&statusEquals=' + (data.status ? data.status : ''))
  },
  /**
   * 获取供应商详情
   */
  getSuppliersDetail(id) {
    return request.get('/product/productSupplier/getDetail?id=' + id)
  },
  /**
   * 创建新的供货商
   */
  createSuppliers(postData) {
    const param = {
      ...postData
    }
    return request.post('/product/productSupplier/create', param)
  },
  /**
   * 启用供应商
   */
  openSuppliers(id, version) {
    return request.put('/product/productSupplier/open?id=' + id + '&version=' + version)
  },
  /**
   * 禁用用供应商
   */
  closeSuppliers(id, version) {
    return request.put('/product/productSupplier/close?id=' + id + '&version=' + version)
  },
  /**
   * 删除供应商
   */
  removeSupplier(id) {
    return request.put('/product/productSupplier/delete?id=' + id)
  },
  /**
   * 更新接口
   */
  updateSupplier(postData) {
    const param = {
        ...postData
    }
    return request.post('/product/productSupplier/update', param)
  },

  /**
  * 基本资料中商品类别相关接口
  */
  /**
   * 创建商品类别
   */
  createCategory(postData) {
    const param = {
      ...postData
    }
    return request.post('/product/productCategory/create', param)
  },
  /**
   * 分页查询类别
   */
  getCateGoryQuery(data) {
    return request.get('/product/productCategory/query?page=' + data.page + '&pageSize=' + data.pageSize + '&searchCount=true' + '&codeOrNameLike=' + (data.codeOrNameLike ? data.codeOrNameLike : '') + '&parentIdEquals=' + (data.parentIdEquals ? data.parentIdEquals : '') + '&statusEquals=' + (data.statusEquals ? data.statusEquals : '') + '&levelEquals=' + (data.levelEquals ? data.levelEquals : '') + '&lowerLevelEquals=' + (data.lowerLevelEquals ? data.lowerLevelEquals : ''))
  },
  /**
   * 查询类别详情
   */
  getCategoryDatail(id) {
    return request.get('/product/productCategory/getById?id=' + id)
  },
  /**
   * 启用商品类别
   */
  openCategory(id, version) {
    return request.put('/product/productCategory/enable?id=' + id + '&version=' + version)
  },
  /**
   * 禁用商品类别
   */
  closeCategory(id, version) {
    return request.put('/product/productCategory/disable?id=' + id + '&version=' + version)
  },
  /**
   * 更新商品类别
   */
  updateCategory(data) {
    const param = {
      ...data
    }
    return request.put('/product/productCategory/update', param)
  }
}

