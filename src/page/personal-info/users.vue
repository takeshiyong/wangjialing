/*
* @Author: 王侃
* @Date:   2019-07-23
* @Description: '用户账号'
* @Modified: 
* 1. 2019-11-25 屈云峰 删除部门相关数据
*/
<template>
    <div class="users-page">
        <div class="container">
            <div class="search">
                <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                    <el-form-item label="姓名">
                        <el-input  placeholder="请填写姓名" clearable v-model="condition.fUserName" class="input-father"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"  @click="searchAccount(true)"><i class="el-icon-search" style="marginRight: 5px"></i>搜索</el-button>
                        <el-button type="primary"  @click="insertAccount"><i class="el-icon-plus" style="marginRight: 5px" ></i>新建</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tab">
                <el-table :data="accounts" stripe class="defaultTab accountTab" highlight-current-row>
                    <el-table-column type="index" label="序号" width="60" :index="indexMethod"></el-table-column>
                    <el-table-column prop="fUserName" label="使用人" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fAccount" label="账号" min-width="100" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="roles" label="角色" min-width="140" :show-overflow-tooltip="true">
                        <template slot-scope="content">
                            <span v-for="(item, index) in content.row.roles" :key="item.fId">
                                <span>{{item.fRoleName}}</span>
                                <span v-if="index+1 != content.row.roles.length">、</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fLastLoginTime" label="上次登陆时间" min-width="120" :show-overflow-tooltip="true">
                        <template slot-scope="content">
                            <span>{{content.row.fLastLoginTime == null ? '--':content.row.fLastLoginTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" @click="resetAccount(scope.row)">&nbsp;重置</el-button>
                            <el-button type="text" @click="updateAccount(scope.row)">&nbsp;编辑</el-button>
                            <el-button type="text" @click="deleteAccount(scope.row)">&nbsp;删除</el-button>
                            <el-button type="text" @click="details(scope.row)">&nbsp;详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="block defaultPage" v-if="condition.sum > 0">
                <el-pagination id="page"  @size-change="handleSizeChange" @current-change="getAccounts" :current-page="condition.currentPage" layout="total, sizes, prev, pager, next, jumper" :total="condition.sum" :page-sizes="condition.pageSizes" :page-size="condition.pageSize">
                </el-pagination>
            </div>
        </div>
        <TheDialog :modal='accountModal' :modalTitle="modalTitle" @closeModal="closeModal('userAccountForm',accountModal)">
            <div slot="custom-modal-content">
                <el-form :model="userAccountForm" :rules="accountFormRules" ref="userAccountForm" label-width="90px" v-if="modalTitle == '新建账号' || modalTitle == '编辑账号'">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="账　　号" prop="fAccount">
                                <el-input size="small" placeholder="请填写所要创建的账号" :maxlength="60"  v-model="userAccountForm.fAccount" :disabled ="modalTitle != '新建账号'" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="密　　码" prop="fPassword">
                                <el-input size="small" type="password" placeholder="请设置密码" :maxlength="60" v-model="userAccountForm.fPassword" :disabled ="modalTitle != '新建账号'" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="姓　　名" prop="fUserName">
                                <el-input size="small" placeholder="请填写姓名" :maxlength="60" v-model="userAccountForm.fUserName" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="角　　色" prop="roles">
                                <el-checkbox-group v-model="userAccountForm.roles">
                                    <el-checkbox v-for="role in roles" :key="role.fId" :label="role.fId" :disabled = "role.fIsDisabled">{{role.fRoleName}}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('userAccountForm')" size="small">{{modalTitle == '新建账号'? '立即创建':'保存'}}
                        </el-button>
                        <el-button @click="resetForm('userAccountForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
                <div v-if="modalTitle == '账号详情'">
                    <span style="color:#1B548D;font-size:18px;font-weight:700;padding-left:8px;">
                        {{accountDeTails.fUserName}} - {{accountDeTails.fLoginName}}
                    </span>
                    <hr style="margin-top: 10px;margin-bottom:8px;">
                    <span style="padding-left:8px;">账号信息</span>
                    <el-card :body-style="{ padding: '0px' }"  class="view-details-card" style="margin-top:10px;">
                        <el-row class="view-details-row">
                            
                            <el-col :span="4" class="field-name">
                                账　　号
                            </el-col>
                            <el-col :span="8" class="field-context">{{accountDeTails.fAccount}}</el-col>
                            <el-col :span="4" class="field-name">
                                姓名
                            </el-col>
                            <el-col :span="8" class="field-context">{{accountDeTails.fUserName}}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4" class="field-name">
                                角　　色
                            </el-col>
                            <el-col :span="20" class="field-context">
                                <span v-if="accountDeTails.roles != null && accountDeTails.roles != undefined && accountDeTails.roles.length > 0" v-for="(item, index) in accountDeTails.roles" :key="item.fId">
                                    <span>{{item.fRoleName}}</span>
                                    <span v-if="index+1 != accountDeTails.roles.length">、</span>
                                </span>
                                <span v-if="accountDeTails.roles == null || accountDeTails.roles == undefined || accountDeTails.roles.length == 0">--</span></el-col>
                        </el-row>
                    </el-card>
                    <hr style="margin-top: 10px;margin-bottom:8px;">
                    <span style="padding-left:8px;">其他信息</span>
                    <el-card :body-style="{ padding: '0px' }"  class="view-details-card" style="margin-top:10px;">
                        <el-row class="view-details-row">
                            <el-col :span="4" class="field-name">
                                上次登录时间
                            </el-col>
                            <el-col :span="8" class="field-context">{{accountDeTails.fLastLoginTime == null || accountDeTails.fLastLoginTime == ''? '--':accountDeTails.fLastLoginTime}}</el-col>
                            <el-col :span="4" class="field-name">
                                上次登录IP
                            </el-col>
                            <el-col :span="8" class="field-context">{{accountDeTails.fLastLoginIp == null || accountDeTails.fLastLoginIp == ''? '--':accountDeTails.fLastLoginIp}}</el-col>
                        </el-row>
                    </el-card>
                </div>
            </div>
        </TheDialog>
    </div>
</template>

<script>
    import { StartegyService, RoleService, UsersService } from '@/api/personal-info' // api
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    import { mapGetters } from 'vuex';
    export default {
        data() {
            var Roles = (rule, value, callback) => {
                if (value === ''||value.length == 0) {
                    callback(new Error('请选择权限'));
                } else {
                    callback();
                }
            };
            var FLoginName = (rule, value, callback) => {
                if (value === null || value.toString().replace(new RegExp(' ','gm'),'') === '') {
                    callback(new Error('账号不能为空'));
                } else {
                    callback();
                }
            };
            var FPassword = (rule, value, callback) => {
                if (value === null || value.toString().replace(new RegExp(' ','gm'),'') === '') {
                    callback(new Error('密码不能为空'));
                } else {
                    callback();
                }
            };
            return {
                calPageSize: 1,
                calPageCurrent: 1,
                // 分页条件
                condition:{
                    currentPage: 1, // 当前页
                    fUserName: '', // 用户姓名
                    pageSize: 10, // 每页显示条数
                    pageSizes: [10,20,30,40], // 显示条数大小
                    sum: 0, // 总条数
                },
                realCondition:{
                    currentPage: 1, // 当前页
                    fUserName: '', // 角色id
                    pageSize: 10, // 每页显示条数
                    pageSizes: [10,20,30,40], // 显示条数大小
                    sum: 0, // 总条数
                },
                stairDeps: [], // 树结构部门遍历成一级
                deps: [], // 部门集合
                depProps: {
                    chidren: 'children',
                    label: 'fName',
                    value: 'fId'
                },
                users: [], // 用户集合
                dutyUsers: [], // 使用人集合
                roles: [], // 角色集合
                accounts: [], // 账号列表

                // 侧滑弹层
                accountModal: false,  // 侧滑弹层显示与否状态
                modalTitle: '',   // 弹层标题
                accountInfor: {
                    fEmployeeId: '', // 人员id
                    fId: '',
                    fIsEnable: true, // 状态
                    fLoginName: '', // 账号
                    fPassword: '', // 密码
                    roles: [], // 角色6
                    depIds: [],
                },
                userAccountForm:{

                },
                accountFormRules: {
                    fUserName: [
                        { required: true, message: '请填写姓名', trigger: 'change' }
                    ],
                    fAccount: [
                        { required: true, validator: FLoginName, trigger: 'blur' }
                    ],
                    fPassword: [
                        { required: true, validator: FPassword, trigger: 'blur' }
                    ],
                    roles: [
                        { required: true, validator: Roles, trigger: 'change' }
                    ]
                },
                // 账号详情
                accountDeTails: {

                },
            }
        },
        components: {
            TheDialog,
        },
        computed: {
            ...mapGetters(["docHeight"])
        },
        mounted: function(){
            // 初始化
            this.init();
        },
        methods: {

            // ======1.页面初始化
            // 1.1初始化
            init(){
                // 获取人员（搜索）
                // this.initUsers();
                // 获取角色集合（搜索）
                this.initRoles();
                // 获取账号列表
                this.getAccounts(1);
            },
            // 1.3获取角色集合
            async initRoles(){
                let res = await RoleService.getAllRole();
                if ( res.success ) {
                    if (res.obj != null && res.obj !=undefined && res.obj.length >0) {
                        this.roles = res.obj;
                    } else {
                        this.roles = [];
                    }
                } else {
                    this.roles = [];
                }
            },
            // 1.4获取账号列表
            async getAccounts(val, flag){
                this.condition.currentPage = val;
                this.realCondition.currentPage = val;
                if(flag){
                    this.realCondition = {
                        ...this.condition
                    };
                }
                let res = await UsersService.getUserAccount(this.realCondition);
                if (res.success) {
                    if (res.obj != null){
                        this.condition.sum = res.obj.itemTotal;
                        this.realCondition.sum = res.obj.itemTotal;
                        if (res.obj.items != null && res.obj.items != undefined && res.obj.items.length >0) {
                            this.accounts = res.obj.items;
                            this.calPageSize = res.obj.pageSize;
                            this.calPageCurrent = res.obj.pageCurrent;
                            // this.$message.success(res.msg);
                        } else {
                            this.accounts = [];
                        }
                    } else {
                        this.$message.warning(res.msg);
                        this.accounts = [];
                    }
                } else {
                    this.$message.warning(res.msg);
                    this.accounts = [];
                }

            },
            // 1.5获取人员
            async initUsers(){
                let res = await StartegyService.getAllUser();
                if ( res.success ) {
                    if (res.obj != null && res.obj !=undefined && res.obj.length >0) {
                        this.users = res.obj;
                    } else {
                        this.users = [];
                    }
                } else {
                    this.users = [];
                }
            },
            // 1.6列表序号
            indexMethod(index){
                return index + this.calPageSize*(this.calPageCurrent-1)+1;
            },
            // ======2.页面操作
            // 2.1搜索
            searchAccount(flag){
                this.getAccounts(1, flag);
            },
            // 2.2新建
            insertAccount(){
                // 初始化弹层
                this.modalTitle = '新建账号';
                this.accountModal = true;
                // 清空form表单
               
                this.userAccountForm = {
                    fId: '',
                    fUserName: '',
                    fAccount: '',
                    fPassword: '',
                    roles: []
                };
            },
            // 2.3编辑
            async updateAccount(row){
                    let cloneRow = {};
                    cloneRow = this._.clone(row);
                    var list = [];
                    for (var i = 0,num = row.roles.length; i < num; i++) {
                        var role = row.roles[i];
                        list.push(role.fId);
                    }
                    cloneRow.roles = list;
                    this.userAccountForm = {
                        ...cloneRow,
                        fPassword: 12312312312321, // 写的假密码 修改时不会传入后台
                    };
                    // 初始化
                    this.modalTitle = "编辑账号";
                    this.accountModal = true;
            },
            // 2.4删除
            deleteAccount(row){
                if (row.fId == '' || row.fId == null || row.fId == undefined) {
                    return;
                };
                this.$confirm(`此操作将删除当前账号，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await UsersService.deleteAccount(row.fId);
                        if (res.success) {
                            this.$message.success(res.msg);
                            this.init();
                        } else{
                            this.$message.warning(res.msg);
                        };
                }).catch(() => {

                });
            },
            // 2.5重置
            async resetAccount(row){
                let res = await UsersService.resetPwd(row.fId);
                if (res.success) {
                    this.$message.success(`${res.msg}, 密码为000000`);
                } else {
                    this.$message.warning(res.msg);
                }

            },
            // 2.7改变分页大小
            handleSizeChange(num){
                this.condition.pageSize = num;
                this.realCondition.pageSize = num;
                this.getAccounts(1);
            },
            // 2.8详情
            details(row){
                this.accountDeTails = row;
                this.accountModal = true;
                this.modalTitle = '账号详情';
            },
            // ======3.弹层
            // 3.1立即创建
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.modalTitle == "新建账号") {
                            this.InsertAccount();
                        }
                        if (this.modalTitle == "编辑账号") {
                            this.UpdateAccount();
                        }
                    } else {
                        this.$message.warning('必填项输入为空或错误！');
                        return false;
                    }
                })
            },
            // 3.2重置
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            // 3.3新增请求
            async InsertAccount(){
                let res = await UsersService.insertUserInfo(this.userAccountForm);
                if (res.success){
                    this.$message.success(res.msg);
                    this.closeModal('userAccountForm',this.accountModal);
                    this.init();
                } else {
                    this.$message.warning(res.msg)
                }
            },
            // 3.4编辑请求
            async UpdateAccount(){
                console.log(this.userAccountForm,'this.userAccountForm');
                let res = await UsersService.updateUserInfo(this.userAccountForm);
                if (res.success){
                    this.$message.success(res.msg);
                    this.getAccounts(this.condition.currentPage);
                    this.closeModal('userAccountForm',this.accountModal);
                } else {
                    this.$message.warning(res.msg)
                }
            },
            // 4.侧滑弹层
            // 4.1关闭
            closeModal(form, modalStatus){
                this.accountModal = false;
                if (this.modalTitle != '账号详情') {
                    this.$refs[form].resetFields();
                }
                this.modalTitle = "";
            }
        },
        watch: {

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .users-page {
        width: 100%;
        height: 100%;
        background: #fff;
        box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1);
        border-radius:8px;
        .container {
            padding:15px;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss">
    .users-page {
        .container {
            .tab {
                .el-table__body-wrapper {
                    max-height: calc(100vh - 260px)!important;
                    overflow-y: auto!important;
                }
            }
        }
        .account-swith {
            .el-switch__label * {
                font-size: 14px!important;
            }
        }
        .role-checkBox {
            .el-checkbox+.el-checkbox {
                margin-left: 10px!important;
            }
            .el-checkbox {
                font-size: 14px!important;
                color: #333!important;
                .el-checkbox__label {
                    font-size: 14px!important;
                    padding-left: 5px!important;
                }
            }
        }
    }
</style>