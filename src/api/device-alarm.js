/*
* @Author: 武志勇
* @Date:   2019-11-26 
* @Description:   api封装： 设备报警信息管理 模拟数据管理
*/
import req from '@/utils/request';


// 2.设备报警信息管理
export const DeviceAlarm = {
    // 删除报警信息
    deleteAlarm:(params)=>req.post('/deviceAlarm/delete',params),
    // 处理报警信息
    disposeAlarm:(params)=>req.post('/deviceAlarm/disposeAlarm',params),
    // 一键消警
    dispostAllAlarm:(params)=>req.post('/deviceAlarm/dispostAllAlarm',params),
    // 分页查询报警信息
    selectByPage:(params)=>req.post('/deviceAlarm/selectByPage',params),
}


// 2.模拟数据管理
export const SimulationData = {
    // 删除模拟数据管理
    deleteSimulationData:(fId)=>req.post(`/simulationData/delete/${fId}`),
    // 新增模拟数据点位信息
    insertSimulationData:(params)=>req.post('/simulationData/insert',params),
    // 分页查询模拟数据点位信息
    selectByPage:(params)=>req.post('/simulationData/selectByPage',params),
}




