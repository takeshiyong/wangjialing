import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {   path: '/home',
            component: resolve => require(['../page/home.vue'], resolve),
            children: [
                { // 用户账号
                    path: '/users',
                    component: resolve => require(['../page/personal-info/users.vue'], resolve),
                    meta: { title: '3f7e3843a41a11e8b12d708bcda4b2f0' }
                },
                { // 角色权限
                    path: '/rolelimits',
                    component: resolve => require(['../page/personal-info/role.vue'], resolve),
                    meta: { title: '3b92363fa41a11e8b12d708bcda4b2f0' }
                },
                { // 设备采集点管理
                    path: '/collectPointManage',
                    component: resolve => require(['../page/data-collection/collect-point.vue'], resolve),
                    meta: { title: 'f14d9c580f5111ea80d6000c29a7e9ed'}
                },
                { // 报警信息管理
                    path: '/alarmManage',
                    component: resolve => require(['../page/alarm/alarmManage.vue'], resolve),
                    meta: { title: '64baba530f5e11ea80d6000c29a7e9ed'}
                },
                { // 设备数据驱动信息管理
                    path: '/modelDataManagement',
                    component: resolve => require(['../page/model-data/data-management.vue'], resolve),
                    meta: { title: 'c30ac552125f11ea80d6000c29a7e9ed'}
                },
                { // 模型数据报警管理
                    path: '/modelDataAlarms',
                    component: resolve => require(['../page/model-data/alarm-managment.vue'], resolve),
                    meta: { title: 'de4718d614a411ea80d6000c29a7e9ed'}
                },
                { // 采集点数据模拟
                    path: '/collectionPointDataSimulation',
                    component: resolve => require(['../page/simulation/data-simulation.vue'], resolve),
                    meta: { title: 'c2cbd159253611ea9375000c29a7e9ed'}
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../page/login.vue'], resolve)
        },
    ]
})
