/*
* @Author: 屈云峰
* @Date:   2019-11-25
* @Description:   api封装： 设备管理相关， 采集点， 采集点规则配置
*/
import req from '@/utils/request';

// 设备分类
export const deviceTypeService = {
    // 设备全查
    view: () => req.get('/deviceType/selectAll'),
    // 设备分类修改
    update: (param) => req.post(`/deviceType/update`, param),
    // 设备分类删除
    delete: (fId) => req.post(`/deviceType/delete/${fId}`),
    // 设备分类新增
    insert: (param) => req.post(`/deviceType/insert`, param),
    // 树结构设备分类设备信息查询
    selectByTree: (param) => req.get(`/deviceType/selectTreeByName?fName=${param}`)
}

// 设备信息
export const deviceInfoService = {
    // 新增设备信息
    insert: (param) => req.post(`/deviceInfo/insert`, param),
    // 修改设备信息
    update: (param) => req.post(`/deviceInfo/update`, param),
    // 删除设备信息
    delete: (param) => req.post(`/deviceInfo/delete/${param}`),
    // 根据设备id查询设备参数信息
    getInfo: (fDeviceId) => req.get(`/deviceParam/selectByDeviceId/${fDeviceId}`),
    //修改模拟点位值
    changeValue: (param) => req.post(`/simulationData/update`,param)
}

// 采集点
export const collectPointService = {
    // 新增采集点
    insert: (param) => req.post(`/deviceParam/insert`, param), 
    // 修改采集点
    update: (param) => req.post(`/deviceParam/update`, param),
    // 删除采集点
    delete: (fId) => req.post(`/deviceParam/delete/${fId}`),
    // 分页查询采集点
    viewByPage: (param) => req.post(`/deviceParam/selectByPage`, param),
}

// 采集点配置
export const collectConfigService = {
    // 查询全部配置
    viewList: () => req.get(`/collectConfiguration/selectAll`),
    // 修改采集参数配置
    updateConfig: (param) => req.post(`/collectConfiguration/update`, param),
}