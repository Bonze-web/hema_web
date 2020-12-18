/* 
 *批处理相关接口 
 */
import request from '@/utils/request'

export default {

  /**
   * 取得批处理执行的详细日志，如果当前任务仍在执行中， 将抛出异常
   * @param 批处理任务的执行id
   */
  getExecutionLogUrl(executionId) {
    var params = {
      executionId: executionId
    }
    return request.get('/job/batch/getExecutionLogUrl', {
      params: params
    });
  },
  /**
   * 查询简单的批处理执行
   */
  getExecutionStatus(executionId) {
    var params = {
      executionId: executionId
    }
    return request.get('/job/batch/getExecutionStatus', {
      params: params
    });
  },
  /**
   * 分页查询批处理执行
   */
  queryExecutions(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    }
    return request.get('/job/batch/queryExecutions', {
      params: params
    });
  },
  /**
   * 查询同步门店商品的门店集合
   * @param batchIdEquals 批处理ID
   * @param storeNameLikes 门店名称类似于
   */
  querySyncStoreProductDestStores(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    }
    return request.get('/job/batch/querySyncStoreProductDestStores', {
      params: params
    });
  },
  /**
   * 查询同步门店商品的来源商品
   * @param batchIdEquals 批处理ID
   * @param productNameLikes 商品名称类似于
   */
  querySyncStoreProductSourceProduct(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    }
    return request.get('/job/batch/querySyncStoreProductSourceProduct', {
      params: params
    });
  }
}
