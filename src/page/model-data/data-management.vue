/*
* @Author: 元实
* @Date:   2019-11-26
* @Description: '模型数据驱动点管理'
*/
<template>
    <div class="page-container">
        <el-col :lg="6" :md="8" :sm="10" :xs="24">
            <aside class="types-managment">
                <header class="section-header">
                    <el-row type="flex" justify="space-between" class="align-center">
                        <span class="header-title">推送类型</span>

                        <el-button-group class="types-opers">
                            <el-tooltip effect="dark" content="新增推送类型" placement="top">
                                <el-button
                                    type="text"
                                    icon="el-icon-plus"
                                    class="operation-icon"
                                    @click="handleAddPushType"></el-button>
                            </el-tooltip>

                            <el-tooltip effect="dark" content="修改推送类型" placement="top">
                                <el-button
                                    type="text"
                                    icon="el-icon-edit"
                                    class="operation-icon"
                                    @click="handleEditPushType"
                                ></el-button>
                            </el-tooltip>

                            <el-tooltip effect="dark" content="删除推送类型" placement="top">
                                <el-button
                                    type="text"
                                    icon="el-icon-delete"
                                    class="operation-icon"
                                    @click="handleDeletePushType"
                                ></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </el-row>
                </header>

                <nav class="types-navigator">
                    <el-menu class="types-menu" default-active="0" @select="selectPushType">
                        <el-menu-item
                            v-for="(type, idx) in pushTypes"
                            :index="`${idx}`"
                            :key="type.fId"
                            class="menu-item">
                            <span>{{ type.fPushTypeName }}</span>
                            <span>{{ type.num }}</span>
                        </el-menu-item>
                    </el-menu>
                </nav>
            </aside>
        </el-col>

        <el-col :lg="18" :md="16" :sm="14" :xs="24">
            <main class="data-main">
                <header class="section-header">
                    <el-row type="flex"  class="align-center">
                        <span class="header-title" style="color: #333;font-weight: 500;margin-right: 15px">数据管理</span>
                        <span class="header-title" >{{cuttentSelect.fPushTypeName}}</span>
                        <span class="header-title" style="margin-left: 15px">Socket类型: {{cuttentSelect.fPushTypeNo}}</span>
                    </el-row>
                </header>

                <section class="data-form">
                    <el-row>
                       <el-form
                            ref="searchForm"
                            :inline="true"
                            class="demo-form-inline search-form"
                            :model="dataSearchParams">
                            <el-form-item
                                label="参数名称"
                                label-width="100px"
                                prop="fName">
                                <el-input
                                    v-model="dataSearchParams.fName"
                                    autocomplete="off"
                                    placeholder="请输入参数名称"
                                    clearable
                                    class="input-item longer input-father">
                                </el-input>
                            </el-form-item>

                           <el-form-item
                               label="参数编号"
                               label-width="100px"
                               prop="fNo">
                               <el-input
                                   v-model="dataSearchParams.fNo"
                                   autocomplete="off"
                                   placeholder="请输入参数编号"
                                   clearable
                                   class="input-item longer input-father">
                               </el-input>
                           </el-form-item>

                           <el-form-item
                               label="是否推送数据"
                               label-width="100px"
                               prop="fIsPushData">
                               <el-select
                                   v-model="dataSearchParams.fIsPushData"
                                   autocomplete="off"
                                   placeholder="是否推送数据"
                                   clearable
                                   class="input-item longer input-father">
                                   <el-option label="是" :value="true"></el-option>
                                   <el-option label="否" :value="false"></el-option>
                               </el-select>
                           </el-form-item>
                        </el-form>
                    </el-row>

                    <el-row>
                        <el-tooltip effect="dark" content="搜索" placement="top">
                            <el-button
                                type="primary"
                                icon="el-icon-search"
                                class="simple-button mr-20"
                                size="small"
                                @click="handleSearchParams"
                            >搜索</el-button>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="新增数据" placement="top">
                            <el-button
                                type="primary"
                                icon="el-icon-plus"
                                class="simple-button"
                                size="small"
                                @click="handleAddModelParam"
                            >新增数据</el-button>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="删除" placement="top">
                            <el-button
                                type="primary"
                                icon="el-icon-delete"
                                class="simple-button"
                                size="small"
                                @click="handleDeleteModelParams"
                            >删除</el-button>
                        </el-tooltip>
                    </el-row>
                </section>

                <section>
                    <el-table
                        :data="modelParams"
                        class="defaultTabShow"
                        stripe
                        @selection-change="handleParamsSelection">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>

                        <el-table-column
                            prop="fName"
                            label="参数名称">
                        </el-table-column>

                        <el-table-column
                            prop="fNo"
                            label="参数编号">
                        </el-table-column>

                        <el-table-column
                            prop="fParamNo"
                            label="对应设备参数编号">
                        </el-table-column>

                        <el-table-column
                            prop="fIsPushData"
                            label="是否推送数据">
                            <template slot-scope="scope">
                                <span>{{scope.row.fIsPushData ? '是' : '否'}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="value"
                            label="数值">
                            <template slot-scope="scope">
                                <span>{{scope.row.fValue ? scope.row.fValue + scope.row.fUnit : '--'}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop=""
                            label="操作"
                            width="150">
                            <template slot-scope="scope">
                                <el-button type="text" @click="handleEditModelParam(scope.row)">编辑</el-button>
                                <el-button type="text" @click="handleEditModelData(scope.row)">配置</el-button>
                            </template>
                           
                        </el-table-column>
                    </el-table>
                </section>
                 <footer class="main-footer">
                <!-- 分页-->
                <div v-if="paginator.pagesQnty > 0">
                    <el-pagination
                        id="page"
                        @size-change="changePageSize"
                        @current-change="goToPage"
                        :current-page.sync="paginator.currentPage"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="paginator.totalRecordsQnty"
                        :page-count="paginator.pagesQnty"
                        :page-sizes="paginator.pageSizes"
                        :page-size="paginator.pageSize">
                    </el-pagination>
                </div>
                <!-- 分页-->
            </footer>
            </main>

           
        </el-col>

        <TheDialog
            :modal="isPushTypeDialogShown"
            :modalTitle="pushTypeDialogTitle"
            @closeModal="closeDialog('isPushTypeDialogShown', 'pushTypeForm')">
            <div slot="custom-modal-content">
                <el-form
                    :model="pushTypeForm"
                    :rules="pushTypeRules"
                    ref="pushTypeForm"
                    label-width="120px">
                    <el-row>
                        <el-form-item label="推送类型名称" prop="fPushTypeName">
                            <el-input
                                v-model.trim="pushTypeForm.fPushTypeName"
                                placeholder="请填写推送类型名称"
                                class="smaller-input"></el-input>
                        </el-form-item>
                    </el-row>

                    <el-row>
                        <el-form-item label="推送类型编号" prop="fPushTypeNo">
                            <el-input
                                v-model.trim="pushTypeForm.fPushTypeNo"
                                placeholder="请填写推送类型编号"
                                class="smaller-input"></el-input>
                        </el-form-item>
                    </el-row>

                    <el-row  type="flex" justify="center" class="form-buttons margin-top15">
                        <el-button type="primary" @click.stop="submitPushTypeData" size="small">确定</el-button>
                        <el-button @click.stop="resetForm('pushTypeForm')" size="small">重置</el-button>
                    </el-row>
                </el-form>
            </div>
        </TheDialog>

        <TheDialog
            :modal="isModelParamDialogShown"
            :modalTitle="modelParamDialogTitle"
            @closeModal="closeDialog('isModelParamDialogShown', 'modelParamForm')">
            <div slot="custom-modal-content">
                <el-form
                    :model="modelParamForm"
                    :rules="modelParamRules"
                    ref="modelParamForm"
                    label-width="120px">
                    <el-row type="flex" justify="space-between">
                        <el-form-item label="参数名称" prop="fName">
                            <el-input
                                v-model.trim="modelParamForm.fName"
                                placeholder="请填写参数名称"
                                autocomplete="off"
                                clearable
                                class="smaller-input"></el-input>
                        </el-form-item>

                        <el-form-item label="参数编号" prop="fNo">
                            <el-input
                                v-model.trim="modelParamForm.fNo"
                                placeholder="请填写参数编号"
                                autocomplete="off"
                                clearable
                                class="smaller-input"></el-input>
                        </el-form-item>
                    </el-row>

                    <el-row type="flex" justify="space-between">
                        <el-form-item label="对应设备">
                            <el-select
                                v-model="selectedDeviceId"
                                autocomplete="off"
                                placeholder="请选择对应设备"
                                clearable
                                filterable
                                class="input-item longer"
                                @change="selectDevice">
                                <el-option
                                    v-for="device in devices"
                                    :label="device.fDeviceName"
                                    :value="device.fId"
                                    :key="device.fId"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="对应设备参数" prop="fParamNo">
                            <el-select
                                v-model="modelParamForm.fParamNo"
                                autocomplete="off"
                                :placeholder="selectedDeviceId ? '选择对应设备参数': '请先选择设备'"
                                :disabled="selectedDeviceId ? false : true"
                                filterable
                                clearable
                                class="input-item longer">
                                <el-option
                                    v-for="point in collectedPoints"
                                    :label="point.fParamNum"
                                    :value="point.fParamNum"
                                    :key="point.fId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="推送类型" prop="fPushTypeId">
                            <el-select
                                v-model="modelParamForm.fPushTypeId"
                                autocomplete="off"
                                placeholder="请选择推送类型"
                                filterable
                                clearable
                                class="input-item longer">
                                <el-option
                                    v-for="type in pushTypes"
                                    :label="type.fPushTypeName"
                                    :value="type.fId"
                                    :key="type.fId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>

                    <el-row>
                        <el-form-item label="是否推送数据" prop="fIsPushData">
                            <el-switch
                                v-model="modelParamForm.fIsPushData"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="是"
                                inactive-text="否">
                            </el-switch>
                        </el-form-item>
                    </el-row>

                    <el-row  type="flex" justify="center" class="form-buttons margin-top15">
                        <el-button type="primary" @click.stop="submitModelParamsData" size="small">确定</el-button>
                        <el-button @click.stop="resetForm('modelParamForm')" size="small">重置</el-button>
                    </el-row>
                </el-form>
            </div>
        </TheDialog>
        <TheDialog
            :modal="isModelConfigShow"
            :modalTitle="modelParamDialogTitle"
            @closeModal="closeAnotherDialog('isModelConfigShow')">
            <div slot="custom-modal-content">
                <el-form>
                    <el-row type="flex" justify="space-between">
                        <el-form-item label="推送类型">
                            <el-select
                                v-model="selectedTypeId"
                                autocomplete="off"
                                placeholder="请选择推送类型"
                                clearable
                                filterable
                                class="input-item longer"
                                @change="selectTypeId">
                                <el-option
                                    v-for="type in pushTypes"
                                    :label="type.fPushTypeName"
                                    :value="type.fId"
                                    :key="type.fId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数据信息">
                            <el-select
                                v-model="selectedParamsId"
                                autocomplete="off"
                                placeholder="请选择数据信息"
                                clearable
                                filterable
                                class="input-item longer"
                                @change="selectParamsId">
                                <el-option
                                    v-for="item in fParamArray"
                                    :label="item.fName"
                                    :value="item.fId"
                                    :key="item.fId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button style="margin-top: 25px;" type="primary" @click.stop="insertParamsModal" size="small">添加</el-button>
                        </el-form-item>
                    </el-row>
                    <section>
                        <el-table
                            :data="currentObj"
                            class="defaultTab"
                            >
                            <el-table-column
                                prop="fName"
                                label="数据驱动参数名称">
                            </el-table-column>

                            <el-table-column
                                prop="fNo"
                                label="参数编号">
                            </el-table-column>

                            <el-table-column
                                prop="fParamNo"
                                label="对应设备参数编号">
                            </el-table-column>

                            <el-table-column
                                prop="fPushTypeName"
                                label="所属推送类型名称">
                            </el-table-column>

                            <el-table-column
                                prop="fIsPushData"
                                label="是否推送数据">
                                <template slot-scope="scope">
                                    <span>{{scope.row.fIsPushData ? '是' : '否'}}</span>
                                </template>
                            </el-table-column>
                           
                            <el-table-column
                                prop=""
                                label="操作"
                                width="150">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="handleDelectModelParam(scope.row)">删除</el-button>
                                </template>
                            
                            </el-table-column>
                        </el-table>
                        
                    </section>
                </el-form>
                
            </div>
        </TheDialog>

    </div>
</template>

<script>
    import { PushTypesService, ModelDataService } from '@/api/model-data'; //模型数据驱动api
    import TheDialog from "@/components/TheDialog"; // 侧滑组件

    export default {
        components: {
            TheDialog
        },

        data() {
            return {
                isModelConfigShow: false,  //模型数据配置页面
                pushTypes: [], //模型推送类型
                isPushTypeDialogShown: false, //是否展示新增/修改推送类型弹框
                pushTypeDialogTitle: '', //推送类型弹框的抬头
                isPushTypeEditMode: false, //是否修改推送类型
                selectedPushTypeIdx: 0, //
                pushTypeForm: {
                    fId: '', //推送类型id
                    fPushTypeName: '', //推送类型名称
                    fPushTypeNo: '', //推送类型编号
                },
                pushTypeRules: {
                    fPushTypeName: [
                        { required: true, message: '请输入推送类型名称', trigger: 'blur' }
                    ],

                    fPushTypeNo: [
                        { required: true, message: '请输入推送类型编号', trigger: 'blur' }
                    ]
                },

                dataSearchParams: { //数据搜索参数
                    fName: '', //数据驱动参数名称
                    fIsPushData: null, //是否推送数据
                    fNo: '', //参数编号
                    fPushTypeId: '' //推送类型id
                },

                modelParams: [], //模型数据驱动信息
                isModelParamDialogShown: false, //是否展示新增/修改数据驱动参数
                isModelParamEditMode: false, //是否修改数据参数
                modelParamDialogTitle: '', //模型数据弹框的抬头
                devices: [], //设备
                selectedDeviceId: '', //设备id
                collectedPoints: [], //采集点
                modelParamForm: {   //模型数据驱动参数表单
                    fId: '', //参数fId
                    fIsPushData: true, //是否推送数据
                    fName: '', //数据驱动参数名称
                    fNo: '', //参数编号
                    fParamNo: '', //对应设备参数编号
                    fPushTypeId: '' //所属推送类型id
                },
                modelParamRules: {
                    fName: [
                        { required: true, message: '请输入参数名称', trigger: 'blur' }
                    ],

                    fNo: [
                        { required: true, message: '请输入参数编号', trigger: 'blur' }
                    ],

                    fParamNo: [
                        { required: true, message: '请选择对应设备参数编号', trigger: 'change' }
                    ],

                    fPushTypeId: [
                        { required: true, message: '请选择推送类型', trigger: 'change' }
                    ],

                    fIsPushData: [
                        { required: true, message: '请选择是否推送数据', trigger: 'change' }
                    ],
                },
                selectedParams: [], //选购的模型数据驱动参数

                paginator: {
                    currentPage: 1,  //当前页
                    pageSize: 10, //一页显示多少条
                    pageSizes: [10, 20, 40], //一页显示多少条
                    pagesQnty: 0, //页数
                    totalRecordsQnty: 0  //一共多少条数据
                },



                selectedTypeId: "",  //模型数据的推送类型
                checkType: true,   //是否选择类型
                fParamArray: [],    //类型下的数据
                selectedParamsId: "",   //模型数据管理信息
                fModelDataDriven: "",  //关联id
                currentObj: [],

                cuttentSelect: {},   //当前选中的类型
            };
        },

        async mounted() {
            await this.getPushTypes();
            this.selectPushType(0);
        },

        methods: {
             /**
             * 截断文字
             * @param {string} name --- 文字
             * @param {number} maxlength --- 文字长度
             */
            truncate(name, maxlength = 3) {
                if (name.length > maxlength) {
                    return name.substr(0, 3) + '...';
                } else {
                    return name;
                }
            },
            //关闭按钮
            closeAnotherDialog(){
                this.isModelConfigShow = false;
                this.selectedTypeId = "";
                this.selectedParamsId = "";
            },
            /**
             * 查询全部推送推送类型信息
             */
            async getPushTypes() {
                const res = await PushTypesService.getPushTypes();

                if (res.success) {
                    this.pushTypes = res.obj;
                } else {
                    this.$message.error(res.msg);
                }
            },

            /**
             * 选择推送类型
             * @param {number} pushTypeIdx --- 推送类型索引
             */
            selectPushType(pushTypeIdx) {
                
                 this.selectedPushTypeIdx = pushTypeIdx;
                 this.dataSearchParams.fPushTypeId = this.pushTypes[pushTypeIdx].fId;
                 this.cuttentSelect = this.pushTypes[pushTypeIdx];
                 
                 //this.clearSearchForm();
                 this.getModelParams();
            },

            /**
             * 查询模型数据驱动信息
             */
            async getModelParams() {
                const params = this.setSearchModelParams();
                const res = await ModelDataService.getModelParams(params);

                if (res.success) {
                    this.modelParams = res.obj.items;
                    this.paginator.pagesQnty = res.obj.pageCount;
                    this.paginator.totalRecordsQnty = res.obj.itemTotal;
                } else {
                    this.$message.error(res.msg);
                }
            },

            /**
             * 设置查询模型数据驱动信息的参数
             */
            setSearchModelParams() {
                return {
                    ...this.dataSearchParams,
                    currentPage: this.paginator.currentPage,
                    pageSize: this.paginator.pageSize
                };
            },

            /**
             * 新增推送类型
             */
            handleAddPushType() {
                 this.isPushTypeEditMode = false;
                 this.pushTypeDialogTitle = '新增推送类型';
                 this.clearPushTypeForm();
                 this.showPushTypeDialog();
            },

            /**
             * 清理推送类型参数
             */
            clearPushTypeForm() {
                this.pushTypeForm.fPushTypeName = '';
                this.pushTypeForm.fPushTypeNo = '';
            },

            /**
             * 展示新增/修改推送类型弹框
             */
            showPushTypeDialog() {
                this.isPushTypeDialogShown = true;
            },

            /**
             * 侧滑弹层关闭
             * @param {string} controlDialogVar  --- 控制表单的变量名
             * @param {string} dialogFormRef   ---  表单ref名称
             */
            closeDialog(controlDialogVar, dialogFormRef) {
                this[controlDialogVar] = false;
                if (this.$refs[dialogFormRef]) {
                    this.$refs[dialogFormRef].resetFields();
                }
            },

            /**
             * 修改推送类型
             */
            handleEditPushType() {
                this.isPushTypeEditMode = true;
                this.pushTypeDialogTitle = '修改推送类型';
                this.setPushTypeFormForEdit();
                this.showPushTypeDialog();
            },

            /**
             * 设置推送类型表单
             */
            setPushTypeFormForEdit() {
                const selectedType = this.pushTypes[this.selectedPushTypeIdx];

                this.pushTypeForm.fId = selectedType.fId;
                this.pushTypeForm.fPushTypeName = selectedType.fPushTypeName;
                this.pushTypeForm.fPushTypeNo = selectedType.fPushTypeNo;
            },

            /**
             * 删除推送类型
             */
            handleDeletePushType() {
                this.$confirm('确定删除？', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(async () => {
                    const fId = this.pushTypes[this.selectedPushTypeIdx].fId;
                    const res = await PushTypesService.deletePushType(fId);

                    if (res.success) {
                        await this.getPushTypes();
                        this.selectPushType(0);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },

            /**
             * 提交推送类型数据
             */
            submitPushTypeData() {
                this.$refs.pushTypeForm.validate(async valid => {
                    if (valid) {
                        let res = null;

                        if (!this.isPushTypeEditMode) {
                            res = await PushTypesService.insertPushType(this.pushTypeForm);
                        } else {
                            res = await PushTypesService.updatePushType(this.pushTypeForm);
                        }

                        if (res.success) {
                            this.$message.success('成功！');
                            this.closeDialog('isPushTypeDialogShown', 'pushTypeForm');
                            this.getPushTypes();
                        } else {
                            this.$message.error(res.msg);
                        }
                    }
                });
            },

            /**
             * 清理表单
             * @param {string} formName --- 表单名称
             */
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            /**
             * 新增模型数据驱动参数
             */
            handleAddModelParam() {
                this.isModelParamDialogShown = true;
                this.modelParamDialogTitle = '新增模型数据驱动参数';
                this.isModelParamEditMode = false;
                this.clearModelParamForm();
                this.modelParamForm.fPushTypeId = this.cuttentSelect.fId;
                this.getDevices();
            },

            /**
             * 清理参数表单
             */
            clearModelParamForm() {
                let params = this.modelParamForm;

                params.fId = '';
                params.fName = '';
                params.fNo = '';
                params.fParamNo = '';
                params.fPushTypeId = '';
                params.fIsPushData = true;
                this.selectedDeviceId = '';
            },

            /**
             * 查询设备
             */
            async getDevices() {
                const res = await ModelDataService.getDevices();

                if (res.success) {
                    this.devices = res.obj;
                } else {
                    this.$message.error(res.msg);
                }
            },

            /**
             * 选择设备
             * @param {string} deviceId --- 设备id
             */
            selectDevice(deviceId) {
                this.getCollectedPoints(deviceId);
            },

            /**
             * 获取采集点
             * @param {string} deviceId --- 设备id
             */
            async getCollectedPoints(deviceId) {
                const res = await ModelDataService.getCollectedPoints(deviceId);

                if (res.success) {
                    this.collectedPoints = res.obj;
                } else {
                    this.$message.error(res.msg);
                }
            },

            /**
             * 提交推送类型数据
             */
            submitModelParamsData() {
                this.$refs.modelParamForm.validate(async valid => {
                    if (valid) {
                        let res = null;
                        if (!this.isModelParamEditMode) {
                            res = await ModelDataService.insertModelParam(this.modelParamForm);
                        } else {
                            res = await ModelDataService.updateModelParam(this.modelParamForm);
                        }

                        if (res.success) {
                            this.$message.success('成功！');
                            this.closeDialog('isModelParamDialogShown', 'modelParamForm');
                            this.getModelParams();
                            this.getPushTypes();
                        } else {
                            this.$message.error(res.msg);
                        }
                    }
                });
            },

            /**
             * 编辑模型数据驱动参数
             * @param {Object} modelParam --- 模型数据驱动参数
             */
            async handleEditModelParam(modelParam) {
                await this.getDevices();
                this.setModelParamForEdit(modelParam);
                this.modelParamDialogTitle = '修改模型数据驱动参数';
                this.isModelParamEditMode = true;
                this.isModelParamDialogShown = true;
            },
            /**
             * 编辑模型数据驱动参数
             * @param {Object} modelParam --- 模型数据驱动参数
             */
            handleEditModelData(modelParam){
                this.isModelConfigShow = true;
                this.selectedTypeId = "";
                this.selectedParamsId ="";
                this.fModelDataDriven = modelParam.fId;
                this.modelParamDialogTitle = "模型数据关联"

                this.selectByModelDataId(this.fModelDataDriven);
                
            },
            /**
             * 设置模型数据驱动参数表单
             * @param {Object} modelParam --- 模型数据驱动参数
             */
            async setModelParamForEdit(modelParam) {
                let params = this.modelParamForm;
                let deviceParam = await ModelDataService.getDeviceByParamNo({
                    currentPage: 1,
                    pageSize: 10,
                    fParamNum: modelParam.fParamNo
                });

                params.fId = modelParam.fId;
                params.fName = modelParam.fName;
                params.fNo = modelParam.fNo;
                params.fParamNo = modelParam.fParamNo;
                params.fPushTypeId = modelParam.fPushTypeId;
                params.fIsPushData = modelParam.fIsPushData;
                if (deviceParam.obj.items[0]) {
                    this.selectedDeviceId = deviceParam.obj.items[0].fDeviceId;
                }
            },

            /**
             * 勾选模型数据驱动参数
             * @param {Array} params --- 勾选的参数
             */
            handleParamsSelection(params) {
                this.selectedParams = params.map(param => param.fId);
            },

            /**
             * 删除模型数据驱动参数
             */
            handleDeleteModelParams() {
                this.$confirm('确定删除？', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(async () => {
                    const res = await ModelDataService.deleteModelParams({ fIds: this.selectedParams } );

                    if (res.success) {
                        this.$message.success('成功！');
                        this.getPushTypes();
                        this.goToPage(1);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },

            /**
             * 跳到选择的页
             * @param {number} pageNum   -- 页数。 要是不传这个参数，刷新当前页
             */
            goToPage(pageNum) {
                if (pageNum) {
                    this.paginator.currentPage = pageNum;
                }
                this.getModelParams();
            },

            /**
             * 搜索模型数据驱动参数
             */
            handleSearchParams() {
                this.goToPage(1);
            },

            /**
             * 改一页的大小的时候，重新获取数据
             * @param {number} size --- 一页显示多少条数据
             */
            changePageSize(size) {
                this.paginator.pageSize = size;
                this.getModelParams();
            },


            /**
             * 
             * 选择推送类型
             */
            selectTypeId(deviceId){
                this.selectedTypeId = deviceId;
                this.selectedParamsId = ""
                this.getModelParamsByType(deviceId);
            },

            /**
             * 根据推送类型选择参数
             */
            async getModelParamsByType(deviceId){
                if(deviceId != ""){
                    const res = await ModelDataService.getModelParamsByType(deviceId);
                    if(res.success){
                        this.checkType = true;
                        if(res.obj.length > 0){
                            this.fParamArray = res.obj
                        }
                    }else{
                        
                        this.fParamArray =  [];
                    }
                }else{
                    this.checkType = false;
                    this.fParamArray =  [];
                }
            },
            selectParamsId(selectParams){
                this.selectedParamsId = selectParams
            },
            //新增
            async insertParamsModal(){
                if(this.selectedTypeId != "" &&this.selectedParamsId !=""){
                    let params = {
                        "fModelDataDriven": this.fModelDataDriven,
                        "fRelevancePushDataId": this.selectedParamsId
                    }
                    const res = await ModelDataService.insertParamsModal(params);
                    if(res.success){
                        this.$message.success(res.msg);
                        this.selectedTypeId = "";
                        this.selectedParamsId ="";
                        this.selectByModelDataId(this.fModelDataDriven);
                    }else{
                        this.$message.error(res.msg);
                        this.selectedTypeId = "";
                        this.selectedParamsId ="";
                        this.selectByModelDataId(this.fModelDataDriven);
                    }
                }else{
                    this.$message.error('请检查参数');
                }
            },
            //根据模型数据id查询关联推送数据信息
            async selectByModelDataId(fModelDataIdId) {
                const res = await ModelDataService.selectByModelDataId(fModelDataIdId);
                if(res.success&&res.obj.length > 0){
                    this.currentObj = res.obj
                }else{
                    this.currentObj = [];
                }
            },
            async handleDelectModelParam(fModelDataIdId){
                const res = await ModelDataService.deleteParamsModal(fModelDataIdId.fId);
                if(res.success){
                    this.$message.success(res.msg);
                    this.selectByModelDataId(this.fModelDataDriven);
                }else{
                    this.$message.error(res.msg);
                    this.selectByModelDataId(this.fModelDataDriven);
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    * {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    $header-color: #545454;
    $nav-color: #606266;
    $border-color-light: #f1f1f1;
    $menu-hovered: #F5F7FA;
    $menu-selected: #4477D2;

    $header-fz: 16px;
    $icon-fz-normal: 16px;
    $icon-fz-small: 14px;
    $icon-fz-big: 19px;

    .align-center {
        align-items: center;
    }

    .form-inline {
        .el-form-item {
            display: inline-block;
        }
    }

    .mr-20 {
        margin-left: 20px;
    }

    .page-container {
        width: 100%;
        height: 100%;
        background: #fff;
        box-shadow: 0px 0px 9px 2px rgba(54, 58, 65, 0.1);
        border-radius: 8px;

        .types-managment {
            height: calc(100vh - 90px);
            padding: 20px;
            border-right: solid 1px $border-color-light;

            .types-navigator {
                padding-top: 20px;
            }

            .types-menu {
                border-right: none;

                .el-menu-item {
                    height: 45px;
                    line-height: 45px;
                    color: $nav-color;

                    &:hover {
                        background-color: $menu-hovered;
                    }

                    &.is-active {
                        color: #ffffff;
                        background-color: $menu-selected;
                    }
                }

                .menu-item {
                    display: flex;
                    justify-content: space-between;
                }
            }
        }

        .section-header {
            height: 40px;
            padding-bottom: 10px;
            line-height: 25px;
            border-bottom: solid 1px $border-color-light;

            .header-title {
                font-size: $header-fz;
                color: $header-color;
            }
        }

        .operation-icon {
            &:not(:first-child) {
                margin-left: 10px;
            }

            padding: 5px 0;
            font-size: $icon-fz-normal;
            color: $header-color;
        }

        .data-main {
            height: 90vh;
            padding: 20px;
        }

        .input-item {
            &.longer {
                width: 230px;
            }
        }

        .data-form {
            align-content: center;
            padding: 20px 0;
        }

        .smaller-input {
            width: 230px;
        }

        .main-footer {
            // height: 10vh;
            display: flex;
            justify-content: flex-end;
            padding: 0 20px;
            margin-top: 10px;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss">
    // * {
    //     -webkit-box-sizing: border-box;
    //     -moz-box-sizing: border-box;
    //     box-sizing: border-box;
    // }
    .defaultTabShow{
        height: calc(100vh - 370px) !important;
    }
    .el-table__body-wrapper{
        position: relative !important;
        overflow-y: auto !important;
        height: calc(100vh - 400px) !important;
    }
</style>
