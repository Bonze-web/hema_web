/* 
 *入库管理
 */
import request from '@/utils/request'

export default {
    /**
     *
     */
    putwayBillQuery(data) {
        return request.get('/wms/putwayBill/query', {params: data})
    },
    putwayBillQueryItems(data) {
        return request.get('/wms/putwayBill/queryItems', {params: data})
    }
}
