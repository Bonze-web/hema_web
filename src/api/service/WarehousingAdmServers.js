/* 
 *入库管理
 */
import request from '@/utils/request'

export default {
    /**
     * 到货登记
     */
    arriveoRderBill(postData) {
        return request.put('/wms/orderBill/arrive', postData)
    },
    /**
     * id查询订单详情
     */
    getByIdOrderBill(id) {
        return request.get('/wms/orderBill/getById?id=' + id)
    },
    /**
     * 编号查询订单详情
     */
    getByBillNumberOrderBill(billNumber) {
        return request.get('/wms/orderBill/getByBillNumber?billNumber=' + billNumber)
    },
    /**
     * 到货登记完成
     */
    arriveOrderBill(data) {
        return request.put('/wms/orderBill/arrive', data)
    },
    /**
     * 分页查询订单接口
     */
    queryOrderBill(postData) {
        return request.post('/wms/orderBill/query', postData)
    }
}
