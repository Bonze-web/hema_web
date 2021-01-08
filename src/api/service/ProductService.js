/** 
 * 商品相关接口 
 */
var qs = require('qs');
import request from '@/utils/request'

export default {
  /**
   * 分页查询商品
   * 
   * @param {int} page 
   * @param {int} pageSize 
   * @param {*} opts 
   */
  query(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    };
    return request.get('/product/product/query', {
      params: params,
      paramsSerializer: function(params) {
        // 用来解决axios默认将数组参数序列化成a[]=1&a[]=2...，导致后台无法识别参数
        return qs.stringify(params, {
          arrayFormat: 'repeat'
        })
      }
    });
  },
  /**
   * 查询商品详情
   */
  getById(id) {
    return request.get('/product/product/getById?id=' + id);
  },

  /**
   * 启用
   */
  on(id) {
    return request.get('/product/product/on?id=' + id);
  },

  /**
   * 禁用
   */
  off(id) {
    return request.get('/product/product/off?id=' + id);
  },
  /**
   * 批量启用
   */
  batchOn(postData) {
    return request.post('/product/product/batchOn', postData);
  },

  /**
   * 批量禁用
   */
  batchOff(postData) {
    return request.post('/product/product/batchOff', postData);
  },

  /**
   * 创建商品
   */
  create(postData) {
    return request.post('/product/product/create', postData);
  },
  /**
   * 更新商品
   */
  update(postData) {
    return request.post('/product/product/update', postData);
  },
  /**
   * 创建商品业务员明细
   */
  createBusiness(postData) {
    return request.post('/product/business/create', postData);
  },
  /**
   * 删除
   */
  deleteBusiness(id) {
    return request.get('/product/business/delete?id=' + id);
  },
  /**
   * 分页查询商品业务列表
   * 
   * @param {int} page 
   * @param {int} pageSize 
   * @param {*} opts 
   */
  queryBusiness(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    };
    return request.get('/product/business/query', {
      params: params,
      paramsSerializer: function(params) {
        // 用来解决axios默认将数组参数序列化成a[]=1&a[]=2...，导致后台无法识别参数
        return qs.stringify(params, {
          arrayFormat: 'repeat'
        })
      }
    });
  },

  /**
   * 更新商品业务明细
   */
  updateBusiness(postData) {
    return request.post('/product/business/update', postData);
  },
  /**
   * 创建商品供应商明细
   */
  createVendor(postData) {
    return request.post('/product/vendor/create', postData);
  },
  /**
   * 删除
   */
  deleteVendor(id) {
    return request.get('/product/vendor/delete?id=' + id);
  },
  /**
   * 分页查询商品供应商关系列表
   * 
   * @param {int} page 
   * @param {int} pageSize 
   * @param {*} opts 
   */
  queryVendor(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    };
    return request.get('/product/vendor/query', {
      params: params,
      paramsSerializer: function(params) {
        // 用来解决axios默认将数组参数序列化成a[]=1&a[]=2...，导致后台无法识别参数
        return qs.stringify(params, {
          arrayFormat: 'repeat'
        })
      }
    });
  },
  /**
   * 设置为收货默认
   */
  setReceiveDefault(id) {
    var params = {
      id: id
    }
    return request.get('/product/vendor/setReceiveDefault', {
      params: params
    });
  },
  /**
   * 设置为退货默认
   */
  setReturnDefault(id) {
    var params = {
      id: id
    }
    return request.get('/product/vendor/setReturnDefault', {
      params: params
    });
  },
  /**
   * 设置为供应商默认
   */
  setSupplier(id) {
    var params = {
      id: id
    }
    return request.get('/product/vendor/setDefault', {
      params: params
    });
  },
  /**
   * 更新商品供应商明细
   */
  updateVendor(postData) {
    return request.post('/product/vendor/update', postData);
  },

  /**
   * 创建商品条码明细
   */
  createBarcode(postData) {
    return request.post('/product/barcode/create', postData);
  },
  /**
   * 删除
   */
  deleteBarcode(id) {
    return request.get('/product/barcode/delete?id=' + id);
  },
  /**
   * 分页查询商品条码列表
   * 
   * @param {int} page 
   * @param {int} pageSize 
   * @param {*} opts 
   */
  queryBarcode(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    };
    return request.get('/product/barcode/query', {
      params: params,
      paramsSerializer: function(params) {
        // 用来解决axios默认将数组参数序列化成a[]=1&a[]=2...，导致后台无法识别参数
        return qs.stringify(params, {
          arrayFormat: 'repeat'
        })
      }
    });
  },

  /**
   * 更新商品条码明细
   */
  updateBarcode(postData) {
    return request.post('/product/barcode/update', postData);
  },

  /**
   * 取消默认
   */
  cancelDefaultProductQpc(id) {
    var params = {
      id: id
    }
    return request.get('/product/qpc/cancelDefault', {
      params: params
    });
  },
  /**
   * 创建商品规格明细
   */
  createProuctQpc(postData) {
    return request.post('/product/qpc/create', postData);
  },
  /**
   * 删除
   */
  deleteProductQpc(id) {
    return request.get('/product/qpc/delete?id=' + id);
  },
  /**
   * 分页查询商品规格列表
   * 
   * @param {int} page 
   * @param {int} pageSize 
   * @param {*} opts 
   */
  queryProductQpc(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    };
    return request.get('/product/qpc/query', {
      params: params,
      paramsSerializer: function(params) {
        // 用来解决axios默认将数组参数序列化成a[]=1&a[]=2...，导致后台无法识别参数
        return qs.stringify(params, {
          arrayFormat: 'repeat'
        })
      }
    });
  },

  /**
   * 设置为默认
   */
  setDefaultProductQpc(id) {
    return request.get('/product/qpc/setDefault?id=' + id);
  },

  /**
   * 更新商品规格明细
   */
  updateProductQpc(postData) {
    return request.post('/product/qpc/update', postData);
  },

  /**
   * 创建物流中心商品规格明细
   */
  createDcProuctQpc(postData) {
    return request.post('/product/dc/qpc/create', postData);
  },
  /**
   * 删除
   */
  deleteDcProductQpc(id) {
    return request.get('/product/dc/qpc/delete?id=' + id);
  },
  /**
   * 分页查询物流中心商品规格列表
   * 
   * @param {int} page 
   * @param {int} pageSize 
   * @param {*} opts 
   */
  queryDcProductQpc(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    };
    return request.get('/product/dc/qpc/query', {
      params: params,
      paramsSerializer: function(params) {
        // 用来解决axios默认将数组参数序列化成a[]=1&a[]=2...，导致后台无法识别参数
        return qs.stringify(params, {
          arrayFormat: 'repeat'
        })
      }
    });
  },
  /**
   * 更新物流中心商品规格明细
   */
  updateDcProductQpc(postData) {
    return request.post('/product/dc/qpc/update', postData);
  },
  /**
   * 查找商品库存
   */
  getAllStock(data) {
    return request.get('/stock/query', {params: data})
  }
}
