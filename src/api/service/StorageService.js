/* 
 *仓储资料
 */
import request from '@/utils/request'

export default {
    /**
     * 分页查询
     */
    warehouseInit(postData) {
        const param = {
            ...postData
        }
        return request.post('/wms/warehouse/query', param)
    },
    /**
     * 创建仓位
     */
    createWarehouse(postData) {
        const param = {
            ...postData
        }
        return request.post('/wms/warehouse/create', param)
    },
    /**
     * 仓位详情
     */
    warehouseDetails(id) {
        return request.get('/wms/warehouse/getDetail?id=' + id)
    },
    /**
     * 禁用仓位状态
     */
    closeWarehouse(id, version) {
        console.log(id, version)
        return request.put('/wms/warehouse/close?id=' + id + '&version=' + version)
    },
    /**
     * 启用仓位状态
     */
    openWarehouse(id, version) {
        console.log(id, version)
        return request.put('/wms/warehouse/open?id=' + id + '&version=' + version)
    },
     /**
     * 更新仓位
     */
    updateWarehouse(postData) {
        const param = {
            ...postData
        }
        return request.post('/wms/warehouse/update', param)
    },
    /**
     * 获取物流中心
     */
    getDcQuery() {
        return request.get('/sys/dc/query?page=1&pageSize=0')
    },
    /**
     * 
     * 
     * 
     * 
     * 
     *  货位类型接口
     * 
     * 
     * 
     * 
     * 
     */
    getWmsBintypeQuery(opt) {
        return request.get(`/wms/wmsBintype/query`, {params: opt})
    },
    /**
     * 新建货位类型
     */
    openWmsBintype(opt) {
        return request.post('/wms/wmsBintype/create', opt)
    },
    /**
     * 查询详情
     */
    getWmsBintypeDetails(id) {
        return request.get(`/wms/wmsBintype/getById?id=${id}`)
    },
    /**
     * 更新货位
     */
    updateWmsBintype(opt) {
        return request.put('/wms/wmsBintype/update', opt)
    },
    /**
     * 删除货位
     */
    deleteWmsBintype(id, version) {
        return request.delete(`/wms/wmsBintype/delete?id=${id}&version=${version}`)
    }
    
}
