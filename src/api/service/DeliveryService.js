/* 
 *出库管理
 */
import request from '@/utils/request'

export default {
    /**
     * 拣货流程开始
     */
    pickBill(data) {
        // 查看列表
        return request.get('/wms/pick-bill', {params: data})
    },
    detailsPick(id) {
        // 查看列表
        return request.get('/wms/pick-bill/getById?id=' + id)
    },
    /**
     * 拣货流程结束
     */

     /**
     * 分播单开始 ======
     */

    sowingPickBillQuery(data) {
        // 分播单查看列表
        return request.get('/wms/sowingPickBill/query', {params: data})
    },
    sowingPickBillDetails(id) {
        // 分播单查看列表
        return request.get('/wms/sowingPickBill/getById?id=' + id)
    }

     /**
     * 分播单结束
     */
}
