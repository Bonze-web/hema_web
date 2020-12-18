/**
 * 报表对外接口
 */
var qs = require('qs');
import request from '@/utils/request'

export default {

  /**
   * 按条件分页查询商品排行榜报表
   */
  queryProductList(page, pageSize, opts) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    }
    return request.get('/rpt/product/queryProductList', {
      params: params
    });
  },

  /**
   * 根据门店id查询门店营业额销售报表
   * @param storeId 门店id
   */
  storeSalesReport(storeId) {
    var params = {
      storeId: storeId
    }
    return request.get('/rpt/storeSales/getByStoreId', {
      params: params
    })
  },

  /**
   * 根据门店id查询门店营业额销售报表
   */
  memberLowReport(storeId) {
    var params = {
      storeId: storeId
    }
    return request.get('/rpt/memberFlow/getByStoreId', {
      params: params
    })
  },
  /**
   * 查询报表定义
   * @param idEquals 报表id等于
   * @param nameLikes 名称类似于
   * @param stateIn ONLINE, OFFLINE
   */
  query(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    }
    return request.get('/rpt/custom/definition/query', {
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
   * 新增报表
   */
  create(postData) {
    return request.post('/rpt/custom/definition/create', postData);
  },
  /**
   * 根据id查询报表
   * @param id 报表标识
   */
  getById(id) {
    var params = {
      id: id
    }
    return request.get('/rpt/custom/definition/getById', {
      params: params
    });
  },

  /**
   * 启用报表
   * @param id 报表标识
   */
  online(id) {
    return request.put('/rpt/custom/definition/online?id=' + id);
  },

  /**
   * 禁用报表
   * @param id 报表标识
   */
  offline(id) {
    return request.put('/rpt/custom/definition/offline?id=' + id);
  },
  /**
   * 修改报表
   */
  update(postData) {
    return request.put('/rpt/custom/definition/update', postData);
  },
  /**
   * 查询报表
   * @param reportId 报表定义的id
   * @param type 导出方式 EXCEL, PDF
   * @param params 	报表参数
   */
  exportRpt(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    }
    return request.post('/rpt/custom/engine/export', {
      params: params
    });
  },
  /**
   * 查询报表
   * @param idEquals 报表id等于
   * @param nameLikes 名称类似于
   * @param stateIn ONLINE, OFFLINE
   */
  queryRpt(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    }
    return request.post('/rpt/custom/engine/query', {
      params: params
    });
  }
}
