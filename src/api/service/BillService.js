import request from '@/utils/request'

/**
 * 单据类型相关接口
 */
export default {
    /**
     * 请求列表
     */
    getBillList(data) {
        return request.get('', {params: data})
    },
    /**
     * 搜索报损人
     */
    getDeccer(data) {
        return request.get('', {params: data})
    }
}
