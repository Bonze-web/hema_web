/* 
 *入库管理
 */
import request from '@/utils/request'

export default {
    /**
     * id查询订单详情
     */
    getByIdOrderBill(id) {
        return request.get('/wms/orderBill/getById?id=' + id)
    },
    /**
     * 编号查询订单详情
     */
    getBySrcBillNumberOrderBill(srcBillNumber) {
        return request.get('/wms/orderBill/getBySrcBillNumber?srcBillNumber=' + srcBillNumber)
    },
    /**
     * 入库订单接收完成
     */
    finishOrderBill(postData) {
        return request.put('/wms/orderBill/finish', postData)
    },
     /**
     * 到货登记完成
     */
    arriveOrderBill(data) {
        return request.put('/wms/orderBill/arrive', data)
    },
    /**
     * 测试新建接口
     */
    createTestOrderBill(postData) {
        return request.post('/wms/orderBill/createTest' + postData)
    },
    /**
     * 分页查询订单接口
     */
    queryOrderBill(postData) {
        return request.post('/wms/orderBill/query', postData)
    },
    /**
     * 
     * 
     * 
     * 
     * 收货装箱单开始
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     */

     /**
     * 收货装箱单查询
     */

    packingQuery(postData) {
        return request.get('/wms/receiveBill/query', { params: postData })
    },

    /**
     * 收货装箱单详情
     */

    packingReceiveBill(id) {
        return request.get('/wms/receiveBill/getById?id=' + id)
    },
     /**
     * 
     * 
     * 
     * 
     * 收货装箱单结束
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     */

    /**
     * 
     * 
     * 
     * 
     * 质检单开始
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     */

     /**
     * 质检单查询
     */

    qualityInspection(postData) {
        return request.get('/wms/quality-inspection-order', { params: postData })
    },

    /**
     * 质检单详情
     */

    detailsqualityInspection(id) {
        return request.get('/wms/quality-inspection-order/getById?id=' + id)
    },
     /**
     * 
     * 
     * 
     * 
     * 质检单结束
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     */

     /**
     * 供应商退货开始
     */
    vendorReturnBillQuery(postData) {
        // 供应商退货列表 查询
        return request.get('/wms/vendorReturnBill/query', { params: postData })
    },
    vendorReturnBillDetails(id) {
        // 供应商退货 详情
        return request.get('/wms/vendorReturnBill/getById?id=' + id)
    },
    vendorReturnBillAudit(postData) {
        // 供应商退货 审核
        return request.put('/wms/vendorReturnBill/audit', postData)
    },
    vendorReturnBillFinish(id, version) {
        // 供应商退货 完成
        return request.put('/wms/vendorReturnBill/finish?id=' + id + "&version=" + version)
    }

     /**
     * 供应商退货结束
     */
}
