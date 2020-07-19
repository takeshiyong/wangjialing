/*
* @Author: 武志勇
* @Date:   2019-11-25
* @Description: '报警信息管理'
*/
<template>
    <div class="page">
        <div class="page_container  ">
            <el-form :inline="true" :model="pageParam" class="demo-form-inline">
                <el-form-item label="处理状态" >
                    <el-select filterable @change="handleChange"  :value="pageParam.fState? (pageParam.fState==1?'未处理' : '已处理'): '请选择处理状态'" placeholder="请选择处理状态" clearable style="width: 200px;">
                        <el-option label="未处理" value="1"></el-option>
                        <el-option label="已处理" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序方式">
                    <el-select filterable v-model="pageParam.fSortType" placeholder="请选择排序方式" clearable style="width: 200px;">
                        <el-option label="报警时间" value="1"></el-option>
                        <el-option label="报警次数" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="正序/逆序">
                    <el-select filterable v-model="pageParam.fOrderType" placeholder="请选择正序/逆序" clearable style="width: 200px;">
                        <el-option label="正序" value="true"></el-option>
                        <el-option label="逆序" value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报警时间">
                    <el-date-picker :editable="false"
                        v-model="pageParam.time"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit(true)">查询</el-button>
                    <el-button type="danger" :disabled="tabList.length <= 0" @click="oneClearAlarm()">一键消警</el-button>
                </el-form-item>
            </el-form>
            <div class="tab_container">
                <el-table ref="table" :data="tabList" stripe class="defaultTab"  :max-height="docHeight-350">
                    <el-table-column type="index" width="50" label="序号">
                        <template slot-scope="scope">
                            <span>{{ scope.$index + 1 + (pageParam.tempCurrent - 1) * pageParam.tempPageSize }}</span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column prop="fDeviceTypeName" label="设备类型" min-width="80" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ scope.row.fDeviceTypeName ? scope.row.fDeviceTypeName : '--' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fDeviceName" label="报警设备" min-width="130" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ scope.row.fDeviceName || '--' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fAlarmNo" label="报警点编号" min-width="170" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fAlarmName" label="报警点名称" min-width="130" :show-overflow-tooltip="true"></el-table-column>
                    
                    <el-table-column prop="fAlarmLowerLimit" label="报警下限" min-width="100" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ scope.row.fAlarmLowerLimit==null?'--':scope.row.fAlarmLowerLimit }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fAlarmValue" label="报警值" min-width="100" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ scope.row.fAlarmValue==null?'--':scope.row.fAlarmValue }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fAlarmCeiling" label="报警上限" min-width="100" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ scope.row.fAlarmCeiling==null?'--':scope.row.fAlarmCeiling }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fUnit" label="单位" min-width="80" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ scope.row.fUnit||'--' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fCount" label="报警内容" min-width="130" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ scope.row.fCount||'--' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fAlarmTime" label="报警时间" min-width="170" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                        <span>{{ scope.row.fAlarmTime||'--' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fEndTime" label="处理完成时间" min-width="170" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                        <span>{{ scope.row.fEndTime||'--' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fAlarmNum" label="持续报警次数" min-width="130" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                        <span>{{ scope.row.fAlarmNum == null ? '--' : scope.row.fAlarmNum }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fState" label="处理状态" min-width="100" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span 
                            class="fStateSpan" 
                            :style="{backgroundColor: scope.row.fState === 1 ? '#fc5055' :  '#dbe0eb' }">
                            {{ scope.row.fState === 1 ? '未处理' :  '已处理'}}
                            </span> 
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        fixed="right"
                        width="140">
                        <template slot-scope="scope">
                            <div style="display: flex;justifyContent: flex-start">
                                <el-button v-if="scope.row.fState == 1" @click="handleClick(scope.row)" type="text" size="small">消警</el-button>
                                <el-button v-if="scope.row.fState == 1" @click="deleteAlarm(scope.row)" type="text" size="small">删除</el-button>
                                <el-button v-if="scope.row.fState != 1" @click="detailsDelAlarmFun(scope.row)" type="text" size="small">消警详情</el-button>
                                <el-button @click="showDetail(scope.row)" type="text" size="small">详情</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-if="pageParam.sum > 0" class="block defaultPage">
                <el-pagination id="page"  
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" 
                    :current-page="pageParam.currentPage" 
                    layout="total, sizes, prev, pager, next, jumper" 
                    :total="pageParam.sum" 
                    :page-size="pageParam.pageSize" 
                    :page-sizes="pageParam.pageSizes">
                </el-pagination>
            </div>
            <el-dialog
                title="消警"
                :visible.sync="dialogVisible"
                width="30%"
                append-to-body
                >
                <el-input 
                    type="textarea"
                    :rows="4"
                    placeholder="请输入处理意见"
                    resize="none"
                    v-model.trim="fCount"
                />
                
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="elimination">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 消警详情 -->
            <el-dialog
                title="消警详情"
                :visible.sync="dialogDelAlarmVisible"
                width="30%"
                :before-close="handleDelAlarmClose">
                <span>
                    内容：
                    <span v-if="detailsDelAlarm">{{detailsDelAlarm}}</span>
                    <span v-else style="color:#ccc;">暂无意见</span>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.stop="handleDelAlarmClose">取 消</el-button>
                </span>
            </el-dialog>
            <TheDialog :modal='showCurrentRow' :modalTitle="modalTitle" @closeModal="showCurrentRow=false">
                <div class="box" slot="custom-modal-content">
                    <div class="center-box">
                        <div class="view-details-rows">
                            <div class="view-details-row-item">
                                <span class="field-fname">报警点编号</span>
                                <span class="field-content">{{currentRow.fAlarmNo?currentRow.fAlarmNo: '--'}}</span>
                            </div>
                            <div class="view-details-row-item">
                                <span class="field-fname">报警点名称</span>
                                <span class="field-content">{{currentRow.fAlarmName?currentRow.fAlarmName: '--'}}</span>
                            </div>
                        </div>
                        <div class="view-details-rows">
                            <div class="view-details-row-item">
                                <span class="field-fname">设备类型</span>
                                <span class="field-content">{{currentRow.fDeviceTypeName?currentRow.fDeviceTypeName: '--'}}</span>
                            </div>
                            <div class="view-details-row-item">
                                <span class="field-fname">报警设备</span>
                                <span class="field-content">{{currentRow.fDeviceName?currentRow.fDeviceName: '--'}}</span>
                            </div>
                        </div>
                        <div class="view-details-rows">
                            <div class="view-details-row-item">
                                <span class="field-fname">报警值</span>
                                <span class="field-content">{{currentRow.fAlarmValue?currentRow.fAlarmValue: '--'}}</span>
                            </div>
                            <div class="view-details-row-item">
                                <span class="field-fname">单位</span>
                                <span class="field-content">{{currentRow.fUnit?currentRow.fUnit: '--'}}</span>
                            </div>
                        </div>
                        <div class="view-details-rows">
                            <div class="view-details-row-item">
                                <span class="field-fname">报警上限</span>
                                <span class="field-content">{{currentRow.fAlarmCeiling?currentRow.fAlarmCeiling: '--'}}</span>
                            </div>
                            <div class="view-details-row-item">
                                <span class="field-fname">报警下限</span>
                                <span class="field-content">{{currentRow.fAlarmLowerLimit?currentRow.fAlarmLowerLimit: '--'}}</span>
                            </div>
                        </div>
                        <div class="view-details-rows">
                            <div class="view-details-row-item">
                                <span class="field-fname">报警内容</span>
                                <span class="field-content">{{currentRow.fCount?currentRow.fCount: '--'}}</span>
                            </div>
                            <div class="view-details-row-item">
                                <span class="field-fname">持续报警次数</span>
                                <span class="field-content">{{currentRow.fAlarmNum?currentRow.fAlarmNum: '--'}}</span>
                            </div>
                        </div>
                        <div class="view-details-rows">
                            <div class="view-details-row-item">
                                <span class="field-fname">报警时间</span>
                                <span class="field-content">{{currentRow.fAlarmTime?currentRow.fAlarmTime: '--'}}</span>
                            </div>
                            <div class="view-details-row-item">
                                <span class="field-fname">处理完成时间</span>
                                <span class="field-content">{{currentRow.fEndTime?currentRow.fEndTime: '--'}}</span>
                            </div>
                            
                        </div>
                        <div v-if="currentRow.fState == 2" class="view-details-rows">
                            <div class="view-details-row-item">
                                <span class="field-fname" style="width: 20%">处理意见</span>
                                <div class="field-content" style="width: 80%">{{currentRow.fProcessingOpinion?currentRow.fProcessingOpinion: '--'}}</div>
                            </div>
                        </div>
                        <div class="view-details-rows">
                            <div class="view-details-row-item">
                                <span class="field-fname">处理状态</span>
                                <div class="field-content" style="border-bottom: 0">{{currentRow.fState == 1?'未处理':"已处理"}}</div>
                            </div>
                            <div class="view-details-row-item">
                            </div>
                        </div>
                        
                    </div>
                </div>
            </TheDialog>
        </div>
    </div>
</template>
<script>
import moment from 'moment';
import { DeviceAlarm } from '@/api/device-alarm';
import TheDialog from "@/components/TheDialog" // 侧滑组件
import { mapGetters } from 'vuex';
    export default {
        data() {
            return {
                fState: {
                  1: '未处理',
                  2: '已处理',
                },
                tabList: [
                ],
                pageParam: {
                    currentPage: 1,
                    sum: 0,
                    fState: 1,
                    pageSizes: [10,20,30,40],
                    pageSize: 10,
                    time: [],
                    tempCurrent: 1,
                    tempPageSize: 10
                },
                realPageParam: {
                    currentPage: 1,
                    sum: 0,
                    fState: 1,
                    pageSizes: [10,20,30,40],
                    pageSize: 10,
                    time: [],
                    fNum: '',
                    tempCurrent: 1,
                    tempPageSize: 10
                },
                fCount: '',
                fId: '',
                dialogVisible: false,
                dialogDelAlarmVisible: false,
                detailsDelAlarm: "",
                currentRow: {},
                showCurrentRow: false,
                modalTitle: "详情"
            }
        },
        components: {
            TheDialog
        },
        computed: {
            ...mapGetters(['docHeight'])
        },
        mounted() {
            this.searchList();
        },
        methods: {
            // 删除报警管理信息
            deleteAlarm(row) {
                this.$confirm(`您将删除这报警信息, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let params = {
                        fAlarmIds:[row.fId]
                    }
                    const res = await DeviceAlarm.deleteAlarm(params);
                    if (res.success) {
                        this.$message.success('删除成功！');
                        this.pageParam.currentPage = 1;
                        this.realPageParam.currentPage = 1;
                        this.searchList();
                    } else {
                        this.$message.warning(res.msg);
                    }
                }).catch(() => {
                     
                });
            },
            // 获取
            // 一键消警
            oneClearAlarm() {
                this.$confirm('是否消除所有警情?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.oneClearAlarmAjax()
                    }).catch(() => {
                                 
                    });
            },
            // 一键消警接口
            async oneClearAlarmAjax() {
                    const res = await DeviceAlarm.dispostAllAlarm();
                    if (res.success) {
                        this.pageParam.currentPage = 1;
                        this.searchList();
                        this.$message({
                            type: 'success',
                            message: res.msg
                        });
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.msg
                        });
                    }
            },
            /**
                 * 消警详情
             */
            detailsDelAlarmFun(row) {
                    this.detailsDelAlarm = row.fProcessingOpinion;
                    this.dialogDelAlarmVisible = true;
            },
            handleDelAlarmClose() {
                    this.detailsDelAlarm = "";
                    this.dialogDelAlarmVisible = false;
            },
            async elimination() {
                    // if (this.fCount.length === 0) {
                    //     this.$message.warning('处理意见不能为空');
                    //     return;
                    // }
                    const res = await DeviceAlarm.disposeAlarm({
                        fCount: this.fCount,
                        fDeviceAlarmId: this.fId
                    });
                    if (res.success) {
                        this.dialogVisible = false;
                        this.searchList();
                    } else {
                        this.$message.warning(res.msg);
                    }
            },  
            handleClick(row) {
                this.fId = row.fId;
                this.fCount = '';
                this.dialogVisible = true;
            },
            handleData(row) {
                this.$emit('showGIS', row);
            },
            // 搜索报警信息
            async searchList() {
                let param = {
                    ...this.realPageParam,
                    fStartTime: this.realPageParam.time && this.realPageParam.time.length > 0 ? moment(this.realPageParam.time[0]).format('YYYY-MM-DD HH:mm:ss'): '',
                    fEndTime: this.realPageParam.time && this.realPageParam.time.length > 0 ? moment(this.realPageParam.time[1]).format('YYYY-MM-DD HH:mm:ss'): '',
                }
                const res = await DeviceAlarm.selectByPage(param);
                if (res.success) {
                    this.pageParam.sum = res.obj.itemTotal;
                    this.realPageParam.sum = res.obj.itemTotal;
                    this.tabList = res.obj.items;
                    this.pageParam.tempCurrent = this.pageParam.currentPage;
                    this.pageParam.tempPageSize = this.pageParam.pageSize;
                    this.realPageParam.tempCurrent = this.pageParam.currentPage;
                    this.realPageParam.tempPageSize = this.pageParam.pageSize;
                } else {
                    this.$message.warning(res.msg);
                }
            },
            // 搜索报警数据
            onSubmit(flag) {
                if(flag){
                    this.pageParam.currentPage = 1;
                    this.realPageParam = {
                        ...this.pageParam
                    };
                }
                this.searchList();
            },
            handleSizeChange(pageSize) {
                this.pageParam.currentPage = 1;
                this.pageParam.pageSize = pageSize;
                
                this.realPageParam.currentPage = 1;
                this.realPageParam.pageSize = pageSize;
                this.searchList();
            },
            // 翻页触发
            handleCurrentChange(page) {
                this.pageParam.currentPage = page;
                this.realPageParam.currentPage = page;
                
                this.searchList();
            },
            //展示详情信息
            showDetail(row){
                this.currentRow = row;
                this.showCurrentRow = true;
            },
            //改变
            handleChange(event){
                this.pageParam.fState = event;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .page {
        padding: 0px 10px;
        .page_container {
            background: rgba(255,255,255,1);
            height: calc(100vh - 200px);
            border-radius: 4px;
            padding: 20px 15px;
            hr {
                border: none;
                height: 1px;
                background: #e2e3e5;
            }
            .tab_container {
                margin-top: 16px;
            }

        }
        .pagination-div {
            width: 100%;
            text-align: center;
            margin-top: 20px;
        }
    }
    .fStateSpan{
        padding: 3px 7px;
        color: #fff;
        border-radius: 3px;
    }
    .box{
        width: 100%;
        height: 100%;
        .center-box{
            width: 100%;
            border: 1px solid #ebeef5;
            background: #fff;
            border-radius: 5px;
            .view-details-rows{
                height: 35px;
                box-sizing: border-box;
                width: 100%;
                display: flex;
                flex-direction: row;
                margin-bottom: 1px;
                .view-details-row-item{
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    .field-fname{
                        display: inline-block;
                        width: 40%;
                        height: 100%;
                        background: #dfe6ec;
                        line-height: 35px;
                        text-align: center;
                    }
                    .field-content{
                        display: inline-block;
                        width: 60%;
                        height: 100%;
                        line-height: 35px;
                        text-align: center;
                        box-sizing: border-box;
                        border-bottom: 1px solid #ebeef5;
                    }
                }
            }
        }
    }
</style>

