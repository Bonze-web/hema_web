/** 
 * 自定义打印模板
 */
import request from '@/utils/request'

export default {
	/**
	 * 删除打印模板
	 */
	delete(templateId) {
		return request.delete('/order/printer/template/remove?id=' + templateId);
	},
	/**
	 * 新增打印模板
	 */
	create(postData) {
		return request.post('/order/printer/template/create', postData);
	},
	/**
	 * 编辑公告信息滚动
	 * @param id 公告信息滚动ID
	 */
	update(postData) {
		return request.put('/order/printer/template/update', postData);
	},

	/**
	 * 查询打印模板
	 */
	getAll() {
		return request.get('/order/printer/template/getAll');
	},

	/**
	 * 根据ID查询打印模板
	 */
	getById(templateId) {
		var params = {
			id: templateId.id
		}
		return request.get('/order/printer/template/getById', params);
	},

	/**
	 * 根据打印机类型和模板类型联合查询打印模板
	 */
	getByType(type) {
		// var params = {
		// 	printerType: type.printerType,
		// 	type: type.templateType
		// }
		return request.get(`/order/printer/template/getByType?type=${type.templateType}&printerType=${type.printerType}`);
	}
}
