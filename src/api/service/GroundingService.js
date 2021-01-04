/* 
 *入库管理
 */
import request from '@/utils/request'

export default {
    /**
     *
     */
    putwayBillQuery(data) {
        console.log(data);
        return request.get('/wms/putawayBill/query', {params: data})
    },
    putwayBillQueryItems(data) {
        return request.get('/wms/putawayBill/queryItems', {params: data})
    }
}
