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
        return request.get('/sys/dc/query?page=1&pageSize=20')
    },
    
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
     * 更新货位类型
     */
    updateWmsBintype(opt) {
        return request.put('/wms/wmsBintype/update', opt)
    },
    /**
     * 删除货位类型
     */
    deleteWmsBintype(id, version) {
        return request.delete(`/wms/wmsBintype/delete?id=${id}&version=${version}`)
    },
    /**
     * 货位、货道、货架、货区接口
     */

     /**
      * 新建货区
      */
     createArea(postData) {
        return request.post('/wms/bin/createZone', postData)
     },
     /**
      * 删除货区
      */
    removeArea(id, version) {
        return request.delete('/wms/bin/deleteZone?id=' + id + '&version=' + version)
    },
     /**
      * 查询所有货区
      */
    getAllFreightArea(data) {
        const param = {
            page: 1,
            pageSize: 0,
            ...data
        }
        return request.get('/wms/bin/queryZone', {params: param})
    },
     /**
      * 新建货道
      */
     createLane(postData) {
        return request.post('/wms/bin/createPath', postData)
     },
     /**
      * 删除货道
      */
    removeLane(id, version) {
        return request.delete('/wms/bin/deletePath?id=' + id + '&version=' + version)
    },
     /**
      * 查询所有货道
      */
     getAllFreightLane(data) {
        const param = {
            page: 1,
            pageSize: 0,
            ...data
        }
        return request.get('/wms/bin/queryPath', {params: param})
    },
     /**
      * 新建货架
      */
     createShelf(postData) {
        return request.post('/wms/bin/createShelf', postData)
     },
     /**
      * 删除货架
      */
    removeShelf(id, version) {
        return request.delete('/wms/bin/deleteShelf?id=' + id + '&version=' + version)
    },
     /**
      * 查询所有货架
      */
     getAllFreightShelf(data) {
        const param = {
            page: 1,
            pageSize: 0,
            ...data
        }
        return request.get('/wms/bin/queryShelf', {params: param})
    },
     /**
      * 新建货位
      */
     createSpace(postData) {
        return request.post('/wms/bin/createBin', postData)
     },
     /**
      * 删除货位
      */
    removeSpace(id, version) {
        return request.delete('/wms/bin/deleteBin?id=' + id + '&version=' + version)
    },
     /**
      * 查询所有货位
      */
     getAllFreightSpace(data) {
        const param = {
            page: 1,
            pageSize: 0,
            ...data
        }
        return request.get('/wms/bin/queryBin', {params: param})
    }
}
