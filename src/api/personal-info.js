/*
* @Author: 王侃
* @Date:   2019-07-22 15:14:48
* @Description:   api封装： 1.login页面 2.home页面 3.系统设置各个页面
*/
import req from '@/utils/request';

// 1.login页面
export const LoginService = {
    login:(params)=>req.post('/user/login',params),
}

// 2.home页面
export const HomeService = {
    // 获取菜单
    getMenu:(param)=>req.get('/menu/get/current/' + param),
    // 修改密码
    updatePassword:(params)=>req.post('/user/updatepassword',params),
    // 登出
    signOut:(param)=>req.get('/user/signout'),
}

// 3.部门组织
export const StartegyService = {
    // 获取部门类型
    getDepType:(param)=>req.get('/depType/selectAll'),
    // 新增
    insertDepType:(params)=>req.post('/depType/insert',params),
    // 修改
    updateDepType:(params)=>req.post('/depType/update',params),
    // 删除
    deleteDepType:(params)=>req.post('/depType/delete/'+params),
    // 排序
    updateSort:(params)=>req.post('/depType/updateSort',params),
    // 获取部门组织树
    getDeps:()=>req.get('/departement/selectall'),
    // 新增部门组织
    insertDep:(params)=>req.post('/departement/insert',params),
    // 修改部门组织
    updateDep:(params)=>req.post('/departement/update',params),
    // 删除部门组织
    deleteDep:(param)=>req.post('/departement/delete/' + param),
    // 获取部门组织下成员(分页)
    getDepUsers:(params)=>req.post('/employee/selectbypage',params),
    // 获取部门组织下成员（全部）
    getAllDepUsers:(params)=>req.get('/employee/selectbydepid/' + params),
    // 新增部门组织成员
    insertUser:(params)=>req.post('/employee/insert', params),
    // 修改部门组织成员
    updateUser:(params)=>req.post('/employee/update', params),
    // 删除部门组织成员
    deleteUser:(params)=>req.post('/employee/delete/' + params),
    // 获取全部成员
    getAllUser:()=>req.get('/employee/selectall'),
    // 通过部门id获取一系列父级id集合
    getParentIds:(params)=>req.get('/departement/selectparentidlist/' + params),
    // 批量删除人员
    deleteBatchUser:(params)=>req.post('/employee/deletebatch', params),
    // 根据人员id查询人员信息
    selectbyfid:(param)=>req.get("/employee/selectbyfid/"+param),
}

// 4.用户账号
export const UsersService = {
    // 获取用户账号列表
    getUserAccount:(params)=>req.post('/user/selectbypage', params),
    // 新增用户账号
    insertUserInfo:(params)=>req.post('/user/insert', params),
    // 修改用户账号
    updateUserInfo:(params)=>req.post('/user/update', params),
    // 删除用户账号
    deleteAccount:(params)=>req.post('/user/delete/'+ params),
    // 重置密码
    resetPwd:(params)=>req.post('/user/reset/'+ params),
}
// 5.角色权限
export const RoleService = {
    // 获取角色列表（树结构）
    getRole:(param)=>req.get('/role/get/tree'),
    // 获取角色列表（非树结构）
    getAllRole:(param)=>req.get('/role/get/all'),
    // 获取权限菜单列表（树结构）
    getLimitsMenus:(param)=>req.get('/menu/get/current/1'),
    // 通过角色Id获取角色权限
    getRoleMenus:(param)=>req.get('/menu/get/froleid/' + param),
    // 设置权限
    setLimits:(params)=>req.post('/menu/save',params),
    // 获取全部菜单（不是树结构）
    getAllMenu:(param)=>req.get('/menu/get/all'),
    // 新增角色
    insertRoleForm:(params)=>req.post('/role/add',params),
    // 修改角色
    updateRoleForm:(params)=>req.post('/role/update',params),
    // 删除角色
    deleteRoleForm:(param)=>req.get('/role/delete/' + param),
    //加载用户可分配角色信息
    getUserRoles:()=>req.get('/role/selectroles'),
}


