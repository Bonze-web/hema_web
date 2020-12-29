import request from '@/utils/request'

/**
 * 单据类型相关接口
 */
export default {
    /**
     * 请求损耗单列表
     */
    getBillList(data) {
        return request.get('/wms/decinvbill/query', {params: data})
    },
    /**
     * 新建损耗单
     */
    createLossBill(postData) {
        return request.post('/wms/decinvbill/create', postData)
    },
    /**
     * 修改损耗单
     */
    updateLossBill(postData) {
        return request.post('/wms/decinvbill/update', postData)
    },
    /**
     * 请求损耗单详情
     */
    getLossBillDetail(id) {
        return request.get('/wms/decinvbill/getDetail?id=' + id)
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
        return request.post('/wms/incinv/getDetail?id=' + id)
    },
    /**
     * 搜索报损人
     */
    getDeccer(data) {
        return request.get('', {params: data})
    }
}
