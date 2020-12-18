/* 
 *门店管理相关接口 
 */
import request from '@/utils/request'

export default {

  /**
   * 查询门店列表，分页
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
    return request.get('/mall/store/query', {
      params: params
    });
  },
  /**
   * 根据门店Id查询门店详情
   */
  getById(id) {
    const params = {
      id: id
    }
    return request.get('/mall/store/getById', {
      params: params
    })
  },
  /**
   * 新增门店
   */
  create(postData) {
    return request.post('/mall/store/create', postData);
  },
  /**
   * 根据门店id查询门店详情
   * @param id
   */
  getStoreInfo(id) {
    var params = {
      id: id
    }
    return request.get('/mall/store/getById', {
      params: params
    })
  },
  /**
   * 查询门店各状态总数
   */
  queryCount() {
    return request.get('/mall/store/queryCount');
  },
  /**
   * 更新门店信息
   */
  updateStore(postData) {
    return request.put('/mall/store/update', postData);
  },
  /**
   * 批量更改门店的状态
   */
  updateStoreStatus(postData) {
    return request.post('/mall/store/updateStatusByIds', postData);
  },

  /**
   * 查询所有的下载地址
   */
  getDownloadLinks() {
    return request.get('/mall/store/getDownloadLinks');
  },
  /**
   * 通过上传excel获取门店信息列表
   */
  parseStoresByExcel(postData) {
    return request.post('/mall/store/parseStoresByExcel', postData);
  },
  /**
   * 配送范围-查询门店列表
   * @param storeNameLike 门店名称类似于
   * @param shipmentType 配送方式
   */
  storeConfig(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    }
    return request.get('/mall/store/distribution/config/query', {
      params: params
    })
  },
  /**
   * 新增门店配送费配置
   */
  addStoreConfig(params) {
    return request.post('/mall/store/distribution/config/create', params)
  },
  /**
   * 修改门店配送费配置
   */
  changeStoreConfig(params) {
    return request.put('/mall/store/distribution/config/update', params)
  },

  /**
   * 导出门店
   */
  exportStore(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    };
    return request.get('/mall/store/export', {
      params: params
    });
  },

  /**
   * 导入用户
   */
  importStore() {
    return request.get('/mall/store/import');
  },
  /**
   * 根据门店Id查询具体的配送方配送方式的配送费
   */
  getByStoreId(storeId) {
    var params = {
      storeId: storeId
    }
    return request.get('/mall/store/distribution/config/getByStoreId', {
      params: params
    })
  }
}
