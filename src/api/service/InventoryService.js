import request from '@/utils/request'

/**
 * 单据类型相关接口
 */
export default {
    /**
     * 请求盘点单列表
     */
    getBillList(data) {
        return request.get('/stock-take-bill', {params: data})
    },
    /**
     * 新建
     */
    createLossBill(postData) {
        return request.post('/stock-take-bill', postData)
    },
    /**
     * 修改
     */
    updateLossBill(postData) {
        return request.put('/stock-take-bill' + postData.id, postData)
    },
    /**
     * 请求详情
     */
    getLossBillDetail(id) {
        return request.get('/stock-take-bill/' + id)
    },
    closeInventory(id) {
        return request.put('/stock-take-bill/' + id + '/close')
    },
    startInventory(id) {
        return request.put('/stock-take-bill/' + id + '/start')
    },
    /**
     * 转为损耗单
     */
    updateOverflowBill(id) {
        return request.put('/stock-take-bill/' + id + '/transfer-inventory-loss')
    },
    // 转为移库单
    updatemove(id) {
        return request.put('/stock-take-bill/' + id + '/transfer-move-bill')
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
