/*
* @Author: 元实
* @Date:   2019-11-27
* @Description:   api封装： 模型数据分类管理、模型数据管理、模型数据与设备采集点关联配置
*/
import req from '@/utils/request';

//1. 推送类型管理
export const PushTypesService = {
    // 查询全部推送数据类型信息
    getPushTypes: () => req.get('/pushType/selectAll'),

    // 新增推送数据类型
    insertPushType: params => req.post('/pushType/add', params),

    // 修改推送数据类型
    updatePushType: params => req.post('/pushType/update', params),

    // 删除推送数据类型
    deletePushType: fId => req.post(`/pushType/delete/${fId}`),
};

export const ModelDataService = {
    // 分页查询模型数据驱动信息
    getModelParams: params => req.post('/modelDataDriven/selectByPage', params),

    // 分页查询模型数据驱动信息
    getCollectedPoints: fId => req.get(`/deviceParam/selectByDeviceId/${fId}`),

    // 全查设备信息
    getDevices: () => req.get('/deviceInfo/selectAll'),

    // 新增参数
    insertModelParam: params => req.post('/modelDataDriven/insert', params),

    // 修改参数
    updateModelParam: params => req.post('/modelDataDriven/update', params),

    // 按设备参数编号查询设备
    getDeviceByParamNo: params => req.post('/deviceParam/selectByPage', params),

    // 删除模型数据驱动信息
    deleteModelParams: params => req.post('/modelDataDriven/delete', params),

    //根据推送数据类型查询推送数据信息
    getModelParamsByType: fPushTypeId => req.get(`/modelDataDriven/selectByPushTypeId/${fPushTypeId}`),

    //新增关联推送数据关系
    insertParamsModal: params => req.post('/relevancePushData/insert', params),
    //删除关联推送数据关系
    deleteParamsModal: fId => req.post(`/relevancePushData/delete/${fId}`),
    //根据模型数据id查询关联推送数据信息
    selectByModelDataId: fModelDataIdId => req.get(`/relevancePushData/selectByModelDataId/${fModelDataIdId}`),

};

export const ModelAlarmService = {
    // 删除报警信息
    deleteAlarm:(params)=>req.post('/deviceAlarm/delete',params),

    // 处理报警信息
    disposeAlarm:(params)=>req.post('/deviceAlarm/disposeAlarm',params),

    // 一键消警
    dispostAllAlarm:(params)=>req.post('/deviceAlarm/dispostAllAlarm',params),

    // 分页查询报警信息
    getModelAlarms:(params)=>req.post('/deviceAlarm/selectModelDataAlarmByPage',params),
};
