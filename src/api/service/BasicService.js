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
  // getSuppliersList(data) {
  //   return request.get('/product/productSupplier/query?page=' + data.page + '&pageSize=' + data.pageSize + '&searchCount=true' + '&codeOrNameEquals=' + (data.codeOrNameEquals ? data.codeOrNameEquals : '') + '&statusEquals=' + (data.status ? data.status : ''))
  // },
  getSuppliersList(data) {
    return request.get('/product/productSupplier/query', {params: data})
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
  // getCateGoryQuery(data) {
  //   return request.get('/product/productCategory/query?page=' + data.page + '&pageSize=' + data.pageSize + '&searchCount=true' + '&codeOrNameLike=' + (data.codeOrNameLike ? data.codeOrNameLike : '') + '&parentIdEquals=' + (data.parentIdEquals ? data.parentIdEquals : '') + '&statusEquals=' + (data.statusEquals ? data.statusEquals : '') + '&levelEquals=' + (data.levelEquals ? data.levelEquals : '') + '&lowerLevelEquals=' + (data.lowerLevelEquals ? data.lowerLevelEquals : ''))
  // },
  getCateGoryQuery(data) {
    return request.get('/product/productCategory/query', {params: data})
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
  },
  /**
   * 容器类型接口
   */

  /**
   * 获取容器类型列表
   */
  getContainerTypeList(data) {
    return request.get('/wms/containerType/query', {params: data})
  },
  /**
   * 启用容器类型
   */
  openContainerType(data) {
    const param = {
      data
    }
    return request.post('/wms/containerType/batchOn', param)
  },
  /**
   * 禁用容器类型
   */
  closeContainerType(data) {
    const param = {
      data
    }
    return request.post('/wms/containerType/batchOff', param)
  },
  /**
   * 获取容器类型详情
   */
  getContainerTypeDetail(id) {
    return request.get('/wms/containerType/getDetail?id=' + id)
  },
  /**
   * 新建容器类型
   */
  createContainerType(postData) {
    const param = {
      ...postData
    }
    return request.post('/wms/containerType/create', param)
  },
  /**
   * 更新容器类型
   */
  updateContainerType(postData) {
    const param = {
      ...postData
    }
    return request.post('/wms/containerType/update', param)
  },

  /**
   * 
   * 
   * 
   * 容器接口开始
   * 
   * 
   * 
   * 
   */

  /**
   * 容器列表查询
   */
  quertOcntainer(data) {
    return request.get('/wms/ocntainer/query', {params: data})
  },

   /**
   * 新建容器
   */
  batchCreateOcntainer(data) {
    return request.post('/wms/ocntainer/batchCreate', data)
  },

   /**
   * 查看容器详情
   */
  ocntainerOcntainer(id) {
    return request.get('/wms/ocntainer/getDetail?id=' + id)
  },
   /**
   * 
   * 
   * 
   * 容器接口结束
   * 
   * 
   * 
   * 
   */

  /**
   * 仓库资料接口 
   */
  /**
   * 获取所有仓库资料
   */
  getWrhQuery(data) {
    return request.get('/sys/dc/query', {params: data})
  },
  /**
   * 仓库启用
   */
  openDc(id, version) {
    return request.get('/sys/dc/on?id=' + id + '&version=' + version)
  },
  /**
   * 仓库禁用
   */
  closeDc(id, version) {
    return request.get('/sys/dc/off?id=' + id + '&version=' + version)
  },
  /**
   * 新建仓库
   */
  creatDc(postData) {
    const param = {
      ...postData
    }
    return request.post('/sys/dc/create', param)
  },
  /**
   * 查询仓库详情
   */
  getDcDetail(id) {
    return request.get('/sys/dc/getById?id=' + id)
  },
  /**
   * 更新配送中心详情
   */
  updateDc(postData) {
    const param = {
      ...postData
    }
    return request.post('/sys/dc/update', param)
  }
}

