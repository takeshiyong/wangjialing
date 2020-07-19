/*
* @Author: 武志勇
* @Date:   2019-07-23
* @Description: '采集点数据模拟'
* @Modified: 
*/
<template>
    <div class="users-page">
        <div class="container">
            <div class="search">
                <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                    <el-form-item label="搜索">
                        <el-input  placeholder="请填写搜索内容(名称/编号)" clearable v-model="content" class="input-father"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"  @click="searchAccount"><i class="el-icon-search" style="marginRight: 5px"></i>搜索</el-button>
                        <el-button type="primary"  @click="insertAccount"><i class="el-icon-plus" style="marginRight: 5px" ></i>新建</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tab">
                <el-table :data="dataArray" stripe class="defaultTab accountTab" highlight-current-row>
                    <!-- <el-table-column type="index" label="序号" width="60" :index="indexMethod"></el-table-column> -->
                    <el-table-column prop="fCreateTime" label="创建时间" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fParamName" label="设备参数名称" min-width="100" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fParamNum" label="参数编号" min-width="100" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fValue" label="默认值" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fDataType" show-overflow-tooltip width="80" label="数据类型"> </el-table-column>
                    <el-table-column prop="fLowerLimit" label="参数下限预警值" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fUpperLimit" label="参数上限预警值" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fIsAlarm" label="是否监控报警" min-width="100" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{scope.row.fIsAlarm ? '开启': '关闭'}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteSimulationData(scope.row)">&nbsp;删除</el-button>
                            <el-button type="text" @click="editSimulationData(scope.row)">&nbsp;编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="block defaultPage" v-if="condition.sum > 0">
                 <el-pagination
                        id="page"
                        @size-change="changePageSize"
                        @current-change="handleCurrentChnage"
                        :current-page.sync="condition.currentPage"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="condition.sum"
                        :page-sizes="condition.pageSizes"
                        :page-size="condition.pageSize">
                    </el-pagination>
            </div>
        </div>
        <TheDialog :modal='accountModal' :modalTitle="modalTitle" @closeModal="closeModal">
            <div slot="custom-modal-content" >
                <div>
                    <div style="display: flex;flex-direction: row;justify-content:space-between">
                        <div class="set-line">
                            <span class="set-line-text">设备</span>
                            <el-cascader
                                placeholder="选择设备"
                                :options="options"
                                clearable
                                @change='change'
                                ></el-cascader>
                        </div>
                        <div class="set-line">
                            <span class="set-line-text">参数</span>
                            <el-select v-model="fDeviceParamId" clearable placeholder="请选择参数" @change='changeInfo'>
                                <el-option
                                v-for="item in currentInfo"
                                :key="item.fId"
                                :label="item.fParamNum"
                                
                                :value="item.fId">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="set-line" style="width: 272px;margin-top:15px">
                        <span class="set-line-text">值</span> 
                        <el-input   style="margin-left: 15px;width: 230px;margin-right: 5px" type="number" size="small" v-model="fValue" placeholder="请输入参数" :maxlength="64"></el-input>
                        <span  class="set-line-text">{{currentDeviceInfo.fDataType}}</span>
                    </div>
                </div>
                
                <div style="position:relative;left: 650px;top: 20px;">
                    <el-button type="primary" @click="insertSimulationData" size="small">确定</el-button>
                </div>
            </div>
        </TheDialog>
        <TheDialog :modal='anotherModal' :modalTitle="anotherTitle" @closeModal="closeAnotherModal">
            <div slot="custom-modal-content" >
                <div>
                    <div class="set-line" style="width: 255px;margin-top:10px">
                        <span class="set-line-text">值</span> 
                        <el-input  style="margin-left: 15px;width: 230px;margin-right: 5px" type="number" size="small" v-model="changeCurrentData.fValue" placeholder="请输入参数" :maxlength="64"></el-input>
                        <span  class="set-line-text">{{changeCurrentData.fDataType}}</span>
                    </div>
                </div>
                
                <div style="position:relative;left: 650px;top: 20px;">
                    <el-button type="primary" @click="querySimulationData" size="small">确定</el-button>
                </div>
            </div>
        </TheDialog>
    </div>
</template>

<script>
    import { SimulationData } from '@/api/device-alarm.js' // api
    import { deviceTypeService,deviceInfoService } from "@/api/collect-info"; // 采集点、设备相关接口
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    import { mapGetters } from 'vuex';
    export default {
        data() {
            return {
                
                // 分页条件
                condition:{
                    currentPage: 1, // 当前页
                    fCount: '', // 用户姓名
                    pageSize: 10, // 每页显示条数
                    pageSizes: [10,20,30,40], // 显示条数大小
                    sum: 0, // 总条数
                },
                
                dataArray: [],
             
                // 侧滑弹层
                accountModal: false,
                modalTitle: '',   // 弹层标题

                options: [],
                fDeviceParamId: "",
                fDeviceId: "",
                currentInfo: [],
                currentDeviceInfo: {},
                fDeviceParamId: "",
                fValue: null,
                content: "",
                anotherModal: false,
                anotherTitle: "",
                changeCurrentData: {
                    fDataType: '', //类型
                    fValue: null,  //值
                    fId: ""
                }, //修改的值

            }
        },
        components: {
            TheDialog,
        },
        computed: {
            
        },
        mounted: function(){
            this.getDeviceType();
            this.selectByPage(1);
        },
        methods: {
            change(value){
                if(value.length == 0){
                    this.fDeviceId =" ";
                    this.currentDeviceInfo = {}
                    this.fDeviceParamId = "";
                }else{
                    this.fDeviceId = value[1];
                    this.fDeviceParamId = "";
                    this.getInfo(this.fDeviceId);
                }
            },
            //获取当前的设备信息
            changeInfo(value){
                if(value == ""){
                    this.fDeviceParamId = "";
                    this.currentDeviceInfo = {}
                }else{
                    this.fDeviceParamId = value;
                    this.currentDeviceInfo = this.currentInfo.filter((item) => {return item.fId == value})[0];
                }
            },
            //新增模拟数据点位信息
            insertAccount(){
                this.modalTitle = "新增模拟数据";
                this.accountModal = true;
            },
            /**
             * 获取所有设备类型数据
             */
            async getDeviceType() {
                const res = await deviceTypeService.selectByTree(encodeURIComponent(' '));
                if (res.success) {
                    for(let first of res.obj){
                        let children = [];
                        first.tDeviceInfoList.map(item => { children.push( {value: item.fId, label: item.fDeviceName}) })
                        this.options.push({
                                label: first.fTypeName,
                                value: first.fTypeName,
                                children: children
                        })  
                    }
                } else {
                    this.$message.warning(res.msg);
                }
            },
            //获取设备信息
            async getInfo(id) {
                const res = await deviceInfoService.getInfo(id);
                if (res.success) {
                    this.currentInfo = res.obj
                } else {
                    this.currentInfo = [];
                    this.currentDeviceInfo = {};
                    this.fDeviceParamId = "";
                }
            },
            async insertSimulationData(){
                if(this.fDeviceId == ""){
                    this.$message.warning("请选择设备");
                    return;
                }
                if(this.fDeviceParamId == ""){
                    this.$message.warning("请选择设备参数");
                    return;
                }
                if(this.fValue == null){
                    this.$message.warning("请填写值");
                    return;
                }
                if((this.fValue*1)<0){
                    this.$message.warning("填写的值需要大于0");
                    return;
                }
                
                if(this.currentDeviceInfo.fDataType == "INTEGER"){
                    let flag = String(this.fValue).indexOf(".");
                    if(flag > 0){
                        this.$message.warning("请检查填写值,不能为小数");
                        return
                    }
                }
                if(this.currentDeviceInfo.fDataType == "BOOLEAN"){
                    let flag = String(this.fValue).indexOf(".");
                    
                    if(flag > 0){
                        this.$message.warning("请检查填写值,不能为小数");
                        return
                    }
                    if((this.fValue*1) !== 1 && (this.fValue*1) !== 0 ){
                        this.$message.warning("请检查填写值,只能为1或0");
                        return
                    }
                }
                let params = {
                    fDeviceParamId:this.fDeviceParamId,
                    fValue: this.fValue
                }
                const res = await SimulationData.insertSimulationData(params);
                if (res.success) {
                        this.$message.success('成功！');
                        this.selectByPage(1);
                        this.accountModal = false;
                        this.currentDeviceInfo = {}
                        this.fDeviceParamId = "";
                        this.currentDeviceInfo = {}
                        this.fDeviceId = "";
                        this.fDeviceParamId = "";
                        this.fValue = null
                    } else {
                        this.$message.error(res.msg);
                }
            },
            //关闭侧滑
            closeModal(){
                this.accountModal = false;
                this.fDeviceId = "";
                this.fDeviceParamId == "";
                this.fValue == null
            },
            //分页查询模拟数据点位信息
            async selectByPage(type) {
                if(type === 1){
                    this.condition = {
                        ...this.condition,
                        currentPage: 1
                    }
                }else{
                    this.condition = {
                        ...this.condition
                    }
                }
                
                const res = await SimulationData.selectByPage(this.condition);
                if(res.success){
                    if(res.obj&&res.obj != null&&res.obj.itemTotal >0){
                        this.dataArray = res.obj.items;
                        this.condition.sum = res.obj.itemTotal
                    }else{
                        this.dataArray = [];
                        this.condition.sum = 0
                    }
                }else{
                    this.dataArray = [];
                    this.condition.sum = 0
                }
            },
            async deleteSimulationData(item){
                this.$confirm('确定删除？', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(async () => {
                    const res = await SimulationData.deleteSimulationData(item.fId);
                    if (res.success) {
                        this.$message.success('成功！');
                        this.selectByPage(1)
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            searchAccount(){
                
                this.condition = {
                    ...this.condition,
                    fCount: this.content
                }
                this.selectByPage(1);
            },
            handleCurrentChnage(num){
                this.condition = {
                    ...this.condition,
                    currentPage: num
                }
                this.selectByPage();
            },
            changePageSize(num){
                this.condition = {
                    ...this.condition,
                    pageSize: num
                }
                this.selectByPage();
            },
            editSimulationData(data){
                console.log(data);
                this.anotherTitle = "修改值";
                this.anotherModal = true;
                this.changeCurrentData.fDataType = data.fDataType;
                this.changeCurrentData.fValue = data.fValue;
                this.changeCurrentData.fId = data.fId
            },
            //关闭修改值
            closeAnotherModal(){
                this.anotherTitle = "";
                this.anotherModal = false;
            },
            //确认修改
            async querySimulationData(){
                if((this.changeCurrentData.fValue*1)<0){
                    this.$message.warning("填写的值需要大于0");
                    return;
                }
                
                if(this.changeCurrentData.fDataType == "INTEGER"){
                    let flag = String(this.changeCurrentData.fValue).indexOf(".");
                    if(flag > 0){
                        this.$message.warning("请检查填写值,不能为小数");
                        return
                    }
                }
                if(this.changeCurrentData.fDataType == "BOOLEAN"){
                    let flag = String(this.changeCurrentData.fValue).indexOf(".");
                    
                    if(flag > 0){
                        this.$message.warning("请检查填写值,不能为小数");
                        return
                    }
                    if((this.changeCurrentData.fValue*1) !== 1 && (this.changeCurrentData.fValue*1) !== 0 ){
                        this.$message.warning("请检查填写值,只能为1或0");
                        return
                    }
                }
                let params = {
                    fValue: this.changeCurrentData.fValue,
                    fId: this.changeCurrentData.fId
                }
                const res = await deviceInfoService.changeValue(params);
                if(res.success){
                    this.$message.success('成功！');
                    this.selectByPage(1)
                    this.changeCurrentData = {
                        fDataType: '', //类型
                        fValue: null,  //值
                        fId: ""
                    }
                     this.fDeviceId = "";
                    this.fDeviceParamId == "";
                    this.fValue == null
                    this.closeAnotherModal();
                }else{
                    this.$message.warning(res.msg);
                }
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
    .set-line {
       display: flex;
       flex-direction: row;
       justify-content:space-between;
       .set-line-text{
           line-height: 30px;
           margin-right: 10px
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