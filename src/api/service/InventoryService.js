import request from '@/utils/request'

/**
 * 单据类型相关接口
 */
export default {
    /**
     * 请求盘点单列表
     */
    getBillList(data) {
        return request.get('/stock-take-bill/listByPage', {params: data})
    },
    /**
     * 新建
     */
    createLossBill(postData) {
        return request.post('/stock-take-bill/add', postData)
    },
    /**
     * 修改
     */
    updateLossBill(postData) {
        return request.put('/stock-take-bill/updateById', postData)
    },
    /**
     * 请求详情
     */
    getLossBillDetail(id) {
        return request.get('/stock-take-bill/getById?id=' + id);
    },
    closeInventory(id) {
        return request.put('/stock-take-bill/closeCheckById?id=' + id);
    },
    startInventory(id) {
        return request.put('/stock-take-bill/startCheckById?id=' + id)
    },
    /**
     * 转为损耗单
     */
    updateOverflowBill(id) {
        return request.put('/stock-take-bill/transferInventoryLossById?id=' + id);
    },
    // 转为移库单
    updatemove(id) {
        return request.put('/stock-take-bill/transferMoveBillById?id=' + id);
    },
    /**
     * 请求溢余单详情
     */
    getOverflowBillDetail(id) {
        return request.get('/wms/incinv/getDetail?id=' + id)
    },
    putBillDetail(postData) {
        return request.put('/stock-take-bill-item-check/updateQuantityById', postData)
    },
    stockDownload() {
        return request.get('/stock-take-bill/download');
    },
    
    /**
     * 搜索报损人
     */
    getDeccer(data) {
        return request.get('', {params: data})
    },
    // 设置一个上传文件的接口
    uploadFileData(postData) {
        return request.post(postData.urlApi, postData.formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}
