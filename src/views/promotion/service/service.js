/**
 * 促销服务接口
 */
var qs = require('qs');
import request from '@/utils/request'

export default {

  /**
   * 查询促销单
   * 
   * @param {int} page 
   * @param {int} pageSize 
   * @param {*} opts 
   */
  queryBill(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    };
    return request.get('/promotion/query', {
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
   * 查询促销单
   * 
   * @param {int} id 促销单标识 
   */
  getBillById(id) {
    var params = {
      id: id
    };
    return request.get('/promotion/getBillById', {
      params: params
    });
  },

  /**
   * 保存促销单 
   * 
   * @param {*} bill 促销单
   * @param {boolean} submit 是否同时提交促销单 
   */
  saveBill(bill, submit = false) {
    return request({
      method: 'post',
      url: '/promotion/saveBill',
      params: {
        doSubmit: submit
      },
      data: bill
    });
  },

  /**
   * 作废促销单 
   * 
   * @param {*} id 促销单标识
   */
  abolishBill(id) {
    return request.put('/promotion/abolish?id=' + id);
  },

  /**
   * 提交促销单 
   * 
   * @param {*} id 促销单标识
   */
  submitBill(id) {
    return request.put('/promotion/submit?id=' + id);
  },

  /**
   * 删除促销单 
   * 
   * @param {*} id 促销单标识
   */
  removeBillById(id) {
    return request.delete('/promotion/removeById?id=' + id);
  },

  /**
   * 复制促销单 
   * 
   * @param {*} id 促销单标识
   */
  copy(id) {
    return request.post('/promotion/copy?id=' + id, {});
  },

  /**
   * 根据父组织ID取得下级组织列表
   * @param {*} pid 父组织的ID，可空
   */
  getStores(pid) {
    request.hideLoadingOnce();
    return request.get('/promotion/getStores', {
      params: {
        pid: pid || ''
      }
    });
  },

  /**
   * 查询商品
   * 
   * @param {int} page 
   * @param {int} pageSize 
   * @param {*} opts 
   */
  queryGoods(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    };
    request.hideLoadingOnce();
    return request.get('/promotion/queryGoods', {
      params: params
    });
  },

  /**
   * 查询券活动
   * 
   * @param {*} page 
   * @param {*} pageSize 
   * @param {*} opts 
   */
  queryCouponActivity(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    };
    request.hideLoadingOnce();
    return request.get('/promotion/queryCouponActivity', {
      params: params
    });
  },

  /**
   * 查询外部券活动
   * 
   * @param {*} page 
   * @param {*} pageSize 
   * @param {*} opts 
   */
  queryExcouponActivity(page, pageSize) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true
    }
    request.hideLoadingOnce();
    return request.get('/promotion/queryExcouponActivity', {
      params: params
    });
  },

  /**
   * 查询商品分类
   * 
   * @param {*} page 
   * @param {*} pageSize 
   * @param {*} opts 
   */
  queryCategory(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    };
    request.hideLoadingOnce();
    return request.get('/promotion/queryCategory', {
      params: params
    });
  },

  /**
   * 查询商品分类树
   */
  getCategoryTree() {
    request.hideLoadingOnce();
    return request.get('/promotion/getCategoryTree');
  },

  /**
   * 取会员等级列表
   */
  getMemberGrades() {
    request.hideLoadingOnce();
    return request.get('/promotion/getMemberGrades');
  }

}
