import request from '@/utils/request'

/**
 * 单据类型相关接口
 */
export default {
    /**
     * 请求盘点单列表
     */
    getBillList(data) {
        return request.get('/stock/stock-take-bill', {params: data})
    },
    /**
     * 新建
     */
    createLossBill(postData) {
        return request.post('/stock/stock-take-bill', postData)
    },
    /**
     * 修改
     */
    updateLossBill(postData) {
        return request.put('/stock/stock-take-bill', postData)
    },
    /**
     * 请求详情
     */
    getLossBillDetail(id) {
        return request.get('/stock/stock-take-bill/' + id)
    },
    closeInventory(id) {
        return request.put('/stock/stock-take-bill/' + id + '/close')
    },
    startInventory(id) {
        return request.put('/stock/stock-take-bill/' + id + '/start')
    },
    /**
     * 请求溢余单列表
     */
    getOverflowBillList(data) {
        return request.get('/wms/incinv/query', {params: data})
    },
    /**
     * 新建溢余单
     */
    createOverflowBill(postData) {
        return request.post('/wms/incinv/create', postData)
    },
    /**
     * 修改溢余单
     */
    updateOverflowBill(postData) {
        return request.post('/wms/incinv/update', postData)
    },
    /**
     * 请求溢余单详情
     */
    getOverflowBillDetail(id) {
        return request.get('/wms/incinv/getDetail?id=' + id)
    },
    /**
     * 搜索报损人
     */
    getDeccer(data) {
        return request.get('', {params: data})
    }
}
