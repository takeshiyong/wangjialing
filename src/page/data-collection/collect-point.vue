/*
* @Author: 屈云峰
* @Date:   2019-11-25
* @Description: '设备采集点管理'
*/
<template>
  <div class="role-page">
    <!-- 页面内容 -->
    <div class="container">
      <el-row>
        <el-col :lg="6" :md="8" :sm="10" :xs="24">
          <div class="left-sidebar">
            <div class="header">
              <span>设备</span>
              <el-tooltip v-if="chooseData.fId" effect="dark" content="删除" placement="top">
                <el-button
                  @click="deleteDevice"
                  type="text"
                  icon="el-icon-delete"
                  class="opear-btn delete-btn"
                ></el-button>
              </el-tooltip>
              <el-tooltip v-if="chooseData.fId" effect="dark" content="修改" placement="top">
                <el-button
                  @click="openDeviceUpdate"
                  type="text"
                  icon="el-icon-edit"
                  class="opear-btn update-btn"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="新增设备信息" placement="top">
                <el-button
                  type="text"
                  icon="redoublefont redouble-tianjiaxinxi"
                  @click="openDeviceType('info-insert')"
                  class="opear-btn delete-btn"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="新增设备分类" placement="top">
                <el-button
                  type="text"
                  icon="redoublefont redouble-tianjiabumen"
                  @click="openDeviceType('type-insert')"
                  class="opear-btn delete-btn type-insert"
                  style="font-size:18px;"
                ></el-button>
              </el-tooltip>
            </div>
            <div class="line"></div>
            <div class="main collect-point">
              <div style="display: flex">
                <el-input v-model.trim="searchName" style="font-size: 15px;" placeholder="请输入设备名称" clearable/>
                <el-button style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="seachDeviceTree"></el-button>
              </div>
              <div style="max-height: 680px;overflow-y:auto;margin-top: 10px;">
                <el-tree 
                  ref="device"
                  :props="defaultTree"
                  :data="deviceTree"
                  :highlight-current="true"
                  @node-click="clickDeviceTree"
                  node-key="fId"
                  :default-expanded-keys="expandKeys"
                  :default-checked-keys="checkedKeys"
                  :accordion="true"
                >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{data.fDeviceTypeId ? data.fDeviceName : data.fTypeName}}</span>
                  <span >{{!data.fDeviceTypeId ? data.tDeviceInfoList.length : data.fNum}}</span>
                </span>
                </el-tree>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :lg="18" :md="16" :sm="14" :xs="24">
          <div class="right-list">
            <div class="header" style="justify-content:space-between;display: flex;">
              <span>{{`${chooseDevice.fDeviceName||''}`}}采集点</span>
              <div>
                <el-tooltip  v-if="chooseDevice.fId" content="新增采集点" placement="top">
                  <i class="el-icon-plus" @click="openPointModalAction" style="cursor: pointer;margin-right:10px;"></i>
                </el-tooltip>
                <el-tooltip  content="采集点参数配置" placement="top">
                  <i class="redoublefont redouble-caijidian" @click="openPointParamConfigModel" style="cursor: pointer"></i>
                </el-tooltip>
              </div>
            </div>
            <div class="line"></div>
            <div class="main">
              <span v-if="!chooseDevice.fId" style="width: 100%;textAlign: center;display:inline-block;color: #A5A5A5">请选择设备</span>
              <el-form v-else :inline="true" :model="pointerPage" class="demo-form-inline search-form collect-pointer">
                <el-form-item label="参数名称">
                  <el-input v-model.trim="pointerPage.fParamName" clearable placeholder="请填写参数名称" class="input-item longer input-father"></el-input>
                </el-form-item>
                <el-form-item label="参数编号">
                  <el-input v-model.trim="pointerPage.fParamNum" clearable placeholder="请填写参数编号" class="input-item longer input-father"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="searchCollect">查询</el-button>
                </el-form-item>
              </el-form>
              <el-table
                v-if="chooseDevice.fId"
                :data="pointerList"
                stripe
                class="defaultTab accountTab" 
              >
                <el-table-column
                  prop="fParamName"
                  label="参数名称">
                </el-table-column>
                <el-table-column
                  prop="fParamNum"
                  label="参数编号"
                  show-overflow-tooltip
                 >
                </el-table-column>
                 <el-table-column
                  prop="fLowerLimit"
                  label="下限预警值"
                  show-overflow-tooltip
                  width="100">
                   <template slot-scope="scope">
                      <span>{{scope.row.fIsAlarm ? scope.row.fLowerLimit: ''}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="value"
                  show-overflow-tooltip
                  width="90"
                  label="数值">
                  <template slot-scope="scope">
                      <span>{{scope.row.fValue ? scope.row.fValue : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fUnit"
                  show-overflow-tooltip
                  width="60"
                  label="单位">
                  <template slot-scope="scope">
                      <span>{{scope.row.fUnit ? scope.row.fUnit: '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fUpperLimit"
                  label="上限预警值"
                  show-overflow-tooltip
                  width="100">
                  <template slot-scope="scope">
                      <span>{{scope.row.fIsAlarm ? scope.row.fUpperLimit: ''}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fDataType"
                  show-overflow-tooltip
                  width="80"
                  label="数据类型">
                </el-table-column>
                <el-table-column
                  prop="fIsAlarm"
                  show-overflow-tooltip
                  width="80"
                  label="监控报警">
                  <template slot-scope="scope">
                      <span>{{scope.row.fIsAlarm ? '开启': '关闭'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fIsUsable"
                  show-overflow-tooltip
                  width="80"
                  label="是否可用">
                  <template slot-scope="scope">
                      <span>{{scope.row.fIsUsable ? '可用': '禁用'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fCollectTime"
                  show-overflow-tooltip
                  width="150"
                  label="采集时间">
                  <template slot-scope="scope">
                      <span>{{scope.row.fCollectTime||'--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fRemarks"
                  show-overflow-tooltip
                  width="150"
                  label="备注">
                  <template slot-scope="scope">
                      <span>{{scope.row.fRemarks||'--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="操作"
                  width="120">
                  <template slot-scope="scope"> 
                    <el-button type="text" @click="openPointerUpdate(scope.row)">编辑</el-button>
                    <el-button type="text" @click="openPointerDelete(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row type="flex" justify="end" v-if="pointerPage.total && chooseDevice.fId" style="marginTop: 10px;">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page="pointerPage.currentPage"
                  :page-size="pointerPage.pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="pointerPage.total">
                </el-pagination>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 弹层 -->
    <!-- 1.侧滑弹层 -->
    <TheDialog
      :modal="baseModel"
      :modalTitle="baseTitle"
      @closeModal="closeModal('roleForm','baseModel')"
    >
      <div slot="custom-modal-content">
        <el-form :model="roleForm" :rules="roleFormRules" ref="roleForm" label-width="80px">
          <el-row>
            <el-col v-if="updateType == 'info-insert'" :span="12">
              <el-form-item label="设备分类" prop="fTypeId">
                <el-select v-model="roleForm.fTypeId" size="small" placeholder="请选择设备分类">
                  <el-option v-for="item in deviceTypeList" :key="item.fId" :value="item.fId" :label="item.fTypeName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="formLabel" prop="fName">
                <el-input v-model.trim="roleForm.fName" size="small" :placeholder="`请填写${formLabel}`" style="width: 250px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="submitForm('roleForm')" size="small">确定</el-button>
            <el-button @click="resetForm('roleForm')" size="small">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </TheDialog>
    <!-- 1.采集点增删改 -->
    <TheDialog
      :modal="openPointModal"
      :modalTitle="pointModalTitle"
      @closeModal="closeModal('pointerForm','openPointModal')"
      >
      <div slot="custom-modal-content">
        <el-form :model="pointDto" :rules="pointerFormRules" ref="pointerForm" label-width="120px">
          <el-row style="border-bottom: 1px solid #c9c9c9">
            <el-col :span="12">
              <el-form-item label="参数名称" prop="fParamName">
                 <el-input v-model.trim="pointDto.fParamName" size="small" :placeholder="`请填写参数名称`" style="width: 230px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参数编号" prop="fParamNum">
                <el-input v-model.trim="pointDto.fParamNum" size="small" :placeholder="`请填写参数编号`" style="width: 230px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据类型" prop="fDataType">
                <el-select v-model="pointDto.fDataType" size="small" placeholder="请选择数据类型" style="width: 230px;">
                  <el-option :value="'DOUBLE'" :label="'DOUBLE'"></el-option>
                  <el-option :value="'BOOLEAN'" :label="'BOOLEAN'"></el-option>
                  <el-option :value="'INTEGER'" :label="'INTEGER'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参数单位" prop="fUnit">
                <el-input v-model.trim="pointDto.fUnit" size="small" :placeholder="`请填写参数单位`" style="width: 230px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="marginTop: 20px;">
            <el-col :span="12">
              <el-form-item label="监控报警" prop="fIsAlarm">
                <el-select v-model="pointDto.fIsAlarm" size="small" placeholder="请选择" style="width: 230px;" @change="changeAlarm">
                  <el-option :value="true" :label="'开启'"></el-option>
                  <el-option :value="false" :label="'关闭'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否可用" prop="fIsUsable">
                <el-select v-model="pointDto.fIsUsable" size="small" placeholder="请选择" style="width: 230px;">
                  <el-option :value="true" :label="'可用'"></el-option>
                  <el-option :value="false" :label="'禁用'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参数上限预警值" prop="fUpperLimit" v-if="pointDto.fIsAlarm">
                <el-input v-model.trim="pointDto.fUpperLimit" size="small" :placeholder="`请填写参数上限预警值`" style="width: 230px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参数下限预警值" prop="fLowerLimit" v-if="pointDto.fIsAlarm">
                <el-input v-model.trim="pointDto.fLowerLimit" size="small" :placeholder="`请填写参数下限预警值`" style="width: 230px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
               <el-form-item label="备注" prop="fRemarks" >
                <el-input v-model.trim="pointDto.fRemarks" size="small" resize="none" type="textarea" style="width: 595px;" :rows="2" :placeholder="`请填写备注`" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="submitPointerForm('pointerForm')" size="small">确定</el-button>
            <el-button @click="resetForm('pointerForm')" size="small">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </TheDialog>
    <!-- 1.采集点配置弹窗 -->
    <TheDialog
      :modal="pointerParamModel"
      :modalTitle="'采集点参数配置'"
      @closeModal="closeModal('pointerForm','pointerParamModel')"
      >
      <div slot="custom-modal-content">
        <el-table
          :data="collectParamList"
          stripe
        >
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="fName"
            label="名称">
              <template slot-scope="scope">
                  <span v-if="!scope.row.editStatus">
                    {{scope.row.fName||'--'}}
                  </span>
                  <el-input v-else v-model.trim="scope.row.fName" class="table_input"/>
              </template>
          </el-table-column>
          <el-table-column
            prop="fNo"
            label="编号">
              <template slot-scope="scope">
                  <span v-if="!scope.row.editStatus">
                    {{scope.row.fNo||'--'}}
                  </span>
                  <el-input v-else v-model.trim="scope.row.fNo" class="table_input"/>
              </template>
          </el-table-column>
           <el-table-column
            prop="fValue"
            label="值">
              <template slot-scope="scope">
                  <span v-if="!scope.row.editStatus">
                    {{scope.row.fValue||'--'}}
                  </span>
                  <el-input v-else v-model.trim="scope.row.fValue" class="table_input"/>
              </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            width="100">
            <template slot-scope="scope"> 
              <el-button type="text" v-if="!scope.row.editStatus" @click.stop="openCollectEditStatus(scope.$index, scope.row)">编辑</el-button>
              <template v-else>
                <el-button type="text" @click="saveCollectStatus(scope.$index, scope.row)">保存</el-button>
                <el-button type="text" @click="cancelCollectEdit(scope.$index, scope.row)">取消</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </TheDialog>
  </div>
</template>

<script>
import { 
  deviceTypeService,
  deviceInfoService,
  collectPointService,
  collectConfigService
} from "@/api/collect-info"; // 采集点、设备相关接口
import TheDialog from "@/components/TheDialog"; // 侧滑组件
import TheLevelTable from "@/components/TheLevelTable"; // 树结构表格组件
import moment from 'moment';
export default {
  data() {
    return {
      moment, // 时间格式转换插件
      baseModel: false, // 基础弹框控制
      baseTitle: "", // 弹窗标题
      formLabel: "", // 表单label名称
      roleForm: {
        // 基础弹框的数据表单
        fName: "",
        fTypeId: ""
      },
      chooseData: {}, // 树结构点击的对象
      updateType: "type-insert", // 数结构新增修改状态：type-insert 类型新增 type-update 类型修改 info-insert 设备信息添加 info-update 设备信息修改
      roleFormRules: {
        fName: [{ required: true, message: "必填项", trigger: "blur" }]
			},
      deviceTypeList: [], // 设备类型列表
      deviceTree: [], // 设备信息树结构
      defaultTree: {label: 'fTypeName', children: 'tDeviceInfoList'},
      expandKeys: [], // 树结构展开的fId
      checkedKeys: [],//选中
      chooseDevice:  {}, // 选中的设备
      searchName: '', // 树结构查询条件

      openPointModal: false, // 控制采集点新增修改弹窗
      pointModalTitle: '',
      pointDto: { // 采集点数据对象
        fParamName: "", // 设备参数名称
        fParamNum: "", // 参数编号
        fUnit: "", // 单位
        fDataType: "", // 数据类型:DOUBLE,BOOLEAN,INTEGER
        fDeviceId: "", // 设备id
        fId: "",
        fIsAlarm: true, // 是否监控报警
        fIsUsable: true, // 是否可用
        fLowerLimit: "", // 参数下限预警值
        fUpperLimit: "", // 参数上限预警值
        fRemarks: '' //备注
      },
      pointerFormRules: { // 采集点表单校验对象
        fParamName: [{ required: true, message: "必填项", trigger: "blur" }],
        fParamNum: [{ required: true, message: "必填项", trigger: "blur" }],
        fDataType: [{ required: true, message: "必填项", trigger: "blur" }],
        fIsAlarm: [{ required: true, message: "必填项", trigger: "blur" }],
        fIsUsable: [{ required: true, message: "必填项", trigger: "blur" }],
        fLowerLimit: [{ required: true, message: "必填项", trigger: "blur" }],
        fUpperLimit: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      pointerPage: {
        fParamName: '', // 参数名称条件
        fParamNum: '', // 参数编号条件
        currentPage: 1,
        total: 0,
        pageSize: 15,
      },
      pointerList: [], // 设备采集点表格数据
      pointerParamModel: false, // 采集点参数配置侧滑控制
      collectParamList: [], // 采集点配置参数数据
      collectParamTempData: {}, // 临时缓存修改对象
    };
  },
  components: {
    TheDialog,
    TheLevelTable
  },
  mounted() {
    this.init();
  },
  methods: {
    /**
     * 初始化页面
     */
    init() {
      this.getDeviceType();
      this.getTypeInfoTree(true);
    },
    /**
     * 修改报警是否开启
     */
    changeAlarm(val) {
      console.log(val);
      if (val) {
        this.pointerFormRules = { // 采集点表单校验对象
          fParamName: [{ required: true, message: "必填项", trigger: "blur" }],
          fParamNum: [{ required: true, message: "必填项", trigger: "blur" }],
          fDataType: [{ required: true, message: "必填项", trigger: "blur" }],
          fIsAlarm: [{ required: true, message: "必填项", trigger: "blur" }],
          fIsUsable: [{ required: true, message: "必填项", trigger: "blur" }],
          fLowerLimit: [{ required: true, message: "必填项", trigger: "blur" }],
          fUpperLimit: [{ required: true, message: "必填项", trigger: "blur" }],
        };
      } else {
        this.pointerFormRules = { // 采集点表单校验对象
          fParamName: [{ required: true, message: "必填项", trigger: "blur" }],
          fParamNum: [{ required: true, message: "必填项", trigger: "blur" }],
          fDataType: [{ required: true, message: "必填项", trigger: "blur" }],
          fIsAlarm: [{ required: true, message: "必填项", trigger: "blur" }],
          fIsUsable: [{ required: true, message: "必填项", trigger: "blur" }],
        };
      }
    },
    /**
     * 树结构查询
     */
    seachDeviceTree() {
      this.getTypeInfoTree(true);
      this.expandKeys = []; // 树结构展开的fId
      this.chooseDevice = {}; // 选中的设备
    },
    /**
     * 通过条件查询 设备下采集点
     */
    searchCollect() {
      this.pointerPage.currentPage = 1;
      this.viewPointerByPage();
    },
    /**
     * 保存采集点配置参数
     * @param {String} index -- 对应list中的下标
     * @param {Object} row -- 表格中对应一行数据
     */
    async saveCollectStatus(index, row) {
      const res = await collectConfigService.updateConfig(row);
      if (res.success) {
        this.$message.success(res.msg);
        this.collectParamList[index] = {
          ...row,
          editStatus: false,
        };
        this.collectParamList = [...this.collectParamList];
        delete this.collectParamTempData[row.fId];
      } else {
        this.$message.warning(res.msg);
      }
    },
    /**
     * 打开编辑状态
     * @param {String} index -- 对应list中的下标
     * @param {Object} row -- 对应list中的对象
     */
    openCollectEditStatus(index, row) {
      this.collectParamTempData[row.fId] = row;
      this.collectParamList[index].editStatus = true;
    },
    /**
     * 取消参数配置编辑状态
     * @param {String} index -- 对应list中的下标
     * @param {Object} row -- 对应list中的对象
     */
    cancelCollectEdit(index, row) {
      // 取消恢复原数据
      this.collectParamList[index] = {
        ...this.collectParamTempData[row.fId],
        editStatus: false,
      };
      this.collectParamList = [...this.collectParamList]
      delete this.collectParamTempData[row.fId];
    },
    /*
     * 打开采集点参数配置弹窗
     */
    openPointParamConfigModel() {
      this.pointerParamModel = true;
      this.getCollectConfigList();
    },
    /**
     * 获取采集配置信息
     */
    async getCollectConfigList() {
      const res = await collectConfigService.viewList();
      if (res.success) {
        this.collectParamList = res.obj.map(data=>{
          return {
            ...data,
            // 判断编辑状态
            editStatus: !!this.collectParamTempData[data.fId]
          }
        });

      } else {
        this.$message.warning(res.msg);
      }
    },
    /**
     * 翻页采集点列表
     * @param {String} page -- 翻页的当前页
     */
    handleCurrentChange(page) {
      this.pointerPage.currentPage = page;
      this.viewPointerByPage();
    },
    /**
     * 打开采集点增改弹窗
     */
    openPointModalAction() {
      this.openPointModal = true;
      this.pointModalTitle = '新增采集点';
      this.pointDto = { // 采集点数据对象
        fParamName: "", // 设备参数名称
        fParamNum: "", // 参数编号
        fUnit: "", // 单位
        fDataType: "", // 数据类型:DOUBLE,BOOLEAN,INTEGER
        fDeviceId: "", // 设备id
        fId: "",
        fIsAlarm: true, // 是否监控报警
        fIsUsable: true, // 是否可用
        fLowerLimit: "", // 参数下限预警值
        fUpperLimit: "", // 参数上限预警值
        fRemarks: ""  // 参数上限预警值
      };
    },
    /**
     * 获取设备分类信息（树结构）
     * @param isFirst {Boolean} -- 是否页面初始化加载
     */
    async getTypeInfoTree(isFirst) {
      const res = await deviceTypeService.selectByTree(encodeURIComponent(this.searchName||' '));
      console.log('获取设备分类信息', res);
      if (res.success) {
        this.deviceTree = res.obj;
        if(isFirst){
          this.expandKeys = [this.deviceTree[0].tDeviceInfoList[0].fId];
          this.checkedKeys = [this.deviceTree[0].tDeviceInfoList[0].fId];
        } 
        !isFirst && this.resetTreeStatus();
      } else {
        this.$message.warning(res.msg);
      }
    },
    /**
     * 删除设备分类或设备信息
     */
    deleteDevice() {
      if (this.chooseData.fDeviceTypeId) {
        this.expandKeys = [this.chooseData.fDeviceTypeId];
      } else {
        this.expandKeys = [this.chooseData.fId];
      }
      this.$confirm(`此操作将删除当前数据，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(async () => {
          let res = null;
          // 判断是不是删除设备信息
          if (this.chooseData.fDeviceTypeId) {
            res = await deviceInfoService.delete(this.chooseData.fId);
          } else {
            res = await deviceTypeService.delete(this.chooseData.fId);
          }
          if (res.success) {
              this.$message.success(res.msg);
              this.getTypeInfoTree();
              this.chooseData = {};
              this.chooseDevice = {};
          } else{
              this.$message.warning(res.msg);
          };
      }).catch(() => {

      });
    },
    /**
     * 树结构数据重新渲染之后恢复树结构的选中状态和展开状态
     */
    resetTreeStatus() {
      if (this.chooseData.fId) {
        this.$nextTick(()=>{
          this.$refs.device.setCurrentKey(this.chooseData.fId);
        })
        if (this.chooseData.fDeviceTypeId) {
          this.expandKeys = [this.chooseData.fDeviceTypeId];
        } else {
          this.expandKeys = [this.chooseData.fId];
        }
      }
    },
    /**
     * 删除采集点
     */
    openPointerDelete(row) {
      console.log('row', row);
      this.$confirm(`此操作将删除当前采集点，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(async () => {
          let res = await collectPointService.delete(row.fId);
          if (res.success) {
              this.$message.success(res.msg);
              this.viewPointerByPage(true);
              this.getTypeInfoTree();
          } else{
              this.$message.warning(res.msg);
          };
      }).catch(() => {

      });
    },
    /**
     * 打开采集点编辑页面
     * @param {Object} row -- 列表数据中的一组数据
     */
    openPointerUpdate(row) {
      this.openPointModal = true;
      this.pointModalTitle = '编辑采集点';
      this.pointDto = { // 采集点数据对象
        ...row
      };
    },
    /**
     * 修改设备分类,或设备信心相关数据
     */
    openDeviceUpdate() {
     this.roleForm = {
        ...this.chooseData,
        fTypeId: this.chooseData.fDeviceTypeId,
        fName: this.chooseData.fDeviceTypeId ? this.chooseData.fDeviceName : this.chooseData.fTypeName
      };
      this.baseModel = true;
      this.roleFormRules = {
          fName: [{ required: true, message: "必填项", trigger: "blur" }]
      };
      // 通过分类id判断是设备分类修改 还是设备信息修改
      if (this.chooseData.fDeviceTypeId) {
        this.baseTitle = '修改设备信息';
        this.updateType = 'info-update';
        this.formLabel = '设备名称';
      } else {
        this.baseTitle = '修改设备分类';
        this.updateType = 'type-update';
        this.formLabel = '分类名称';
      }
    },
    /**
     * 点击树结构节点
     * @param data {Object} -- 点击的树结构数据对象
     */
    clickDeviceTree(data) {
      this.chooseData = data;
      if (data.fDeviceTypeId) {
        this.chooseDevice = data;
        this.viewPointerByPage(true);
      }
      
    },
    /**
     * 侧滑弹层关闭
     * @param form {String} -- 表单ref名称
     * @param modalStatus {String} -- 控制表单的变量名
     */
    closeModal(form, modalStatus){
        this[modalStatus] = false;
        if (this.$refs[form])
        this.$refs[form].resetFields();
    },
    
    /**
     * 获取所有设备类型数据
     */
    async getDeviceType() {
      const res = await deviceTypeService.view();
      console.log("获取所有设备类型数据", res);
      if (res.success) {
				this.deviceTypeList = res.obj;
      } else {
        this.$message.warning(res.msg);
      }
    },
    /**
     * 打开基础弹窗
     * @param type {String} 判断是信息添加还是类型添加
     */
    openDeviceType(type) {
      this.updateType = type;
      this.baseModel = true;
      this.roleForm = { // 重置表单为空
          fName: '',
          fTypeId: ''
      }
      if (type == "type-insert") {
        this.baseTitle = "新增设备分类";
        this.formLabel = "分类名称";
        this.roleFormRules = {
          fName: [{ required: true, message: "必填项", trigger: "blur" }]
        };
      } else {
        this.getTypeInfoTree();
        this.getDeviceType();
        this.baseTitle = "新增设备信息";
        this.formLabel = "设备名称";
        if(this.chooseData.fId || this.chooseData.fDeviceTypeId){
          let currentDeviceTypeId = this.chooseData.fDeviceTypeId ? this.chooseData.fDeviceTypeId: this.chooseData.fId
          this.roleForm = {
            ...this.roleForm,
            fTypeId: currentDeviceTypeId
          }
        }
        this.roleFormRules = {
          fTypeId: [{ required: true, message: "必填项", trigger: "blur" }],
          fName: [{ required: true, message: "必填项", trigger: "blur" }]
        };
      }
    },
    /**
     * 采集点弹窗的增改逻辑
     */
    submitPointerForm() {
      this.$refs.pointerForm.validate(valid => {
        if (valid) {
          if (this.pointDto.fId) {
            // 编辑数据
            this.updatePointerData();
          } else {
            // 新增采集点数据
            this.insertPointerData();
          }
        } else {
          this.$message.warning("必填项输入为空或错误！");
          return false;
        }
      });
    },
    /**
     * 修改采集点数据
     */
    async updatePointerData() {
      const res = await collectPointService.update({
        ...this.pointDto,
      });
      if (res.success) {
        this.$message.success(res.msg);
        this.viewPointerByPage();
        this.closeModal('pointerForm','openPointModal');
      } else {
        this.$message.warning(res.msg);
      }
    },
    /**
     * 新增采集点数据
     */
    async insertPointerData() {
      const res = await collectPointService.insert({
        ...this.pointDto,
        fDeviceId: this.chooseDevice.fId
      });
      if (res.success) {
        this.$message.success(res.msg);
        this.viewPointerByPage(true);
        this.getTypeInfoTree();
        this.closeModal('pointerForm','openPointModal');
      } else {
        this.$message.warning(res.msg);
      }
    },
    /**
     * 通过设备id获取采集点数据翻页
     */
    async viewPointerByPage(flag) {
      if (flag) {
        this.pointerPage.currentPage = 1;
      }
      const res = await collectPointService.viewByPage({
        currentPage: this.pointerPage.currentPage,
        pageSize: this.pointerPage.pageSize,
        fDeviceInfoId: this.chooseDevice.fId,
        fParamName: this.pointerPage.fParamName,
        fParamNum: this.pointerPage.fParamNum
      });
      if (res.success) {
        this.pointerList = res.obj.items;
        this.pointerPage.total = res.obj.itemTotal;
      } else {
        this.$message.warning(res.msg);
      }
    },
    /**
     * 提交表单，需要判断提交的表单是什么
     * @param formName {String} 表单名称
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (this.updateType) {
						case "type-insert": // 添加类型
							this.insertDeviceType();
              break;
						case "type-update":	// 修改类型
							this.updateDeviceType();
              break;	
						case "info-insert":	// 添加设备信息
							this.insertDeviceInfo();
              break;
						case "info-update":	// 修改设备信息
							this.updateDeviceInfo();
              break;
            default: 
							return;
          }
        } else {
          this.$message.warning("必填项输入为空或错误！");
          return false;
        }
      });
		},
		/**
		 * 添加设备类型走接口
		 */
		async insertDeviceType() {
			const res = await deviceTypeService.insert({
				fTypeName: this.roleForm.fName
			});
			if (res.success) {
				this.$message.success(res.msg);
        this.getDeviceType();
        this.getTypeInfoTree();
        this.closeModal('roleForm','baseModel');
			} else {
				this.$message.warning(res.msg);
			}
		},
		/**
		 * 修改设备类型走接口
		 */
		async updateDeviceType() {
			const res = await deviceTypeService.update({
				fId: this.roleForm.fId,
				fTypeName: this.roleForm.fName
			});
			if (res.success) {
        this.$message.success(res.msg);
        this.getTypeInfoTree();
        this.closeModal('roleForm','baseModel');
			} else {
				this.$message.warning(res.msg);
			}
		},
		/**
		 * 添加设备信息走接口
		 */
		async insertDeviceInfo() {
			const res = await deviceInfoService.insert({
				fDeviceName: this.roleForm.fName,
				fDeviceTypeId: this.roleForm.fTypeId
			});
			if (res.success) {
        this.$message.success(res.msg);
        this.getTypeInfoTree();
        this.closeModal('roleForm','baseModel');
			} else {
				this.$message.warning(res.msg);
			}
		},
		/**
		 * 修改设备信息走接口
		 */
		async updateDeviceInfo() {
			const res = await deviceInfoService.update({
				fId: this.roleForm.fId,
				fDeviceName: this.roleForm.fName,
				fDeviceTypeId: this.roleForm.fTypeId
			});
			if (res.success) {
        this.$message.success(res.msg);
        this.getTypeInfoTree();
        this.closeModal('roleForm','baseModel');
			} else {
				this.$message.warning(res.msg);
			}
		},
    /**
     * 重置表单
     * @param formName {String} 表单名称
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.input-item {
            &.longer {
                width: 230px;
            }
        }
        
.role-page {
  // 角色权限
  width: 100%;
  height: 100%;
  background: #fff;
  box-shadow: 0px 0px 9px 2px rgba(54, 58, 65, 0.1);
  border-radius: 8px;
  .container {
    // 页面容器
    .left-sidebar {
      // 左侧
      height: calc(100vh - 90px);
      border-right: 1px solid #f1f1f1;
      .header {
        // 头部
        padding: 20px;
        color: rgba(84, 84, 84, 1);
        line-height: 25px;
        font-size: 16px;
        .opear-btn {
          // 操作按钮
          float: right;
          color: #545454;
          font-size: 17px;
        }
        .insert-btn {
          // 新建按钮
          margin-top: -4px;
        }
        .update-btn {
          // 修改按钮
          margin-top: -4px;
        }
        .delete-btn {
          // 删除按钮
          margin-top: -4px;
          margin-left: 10px;
        }
      }
      .line {
        // 标题下划线
        margin: 0px 20px;
        margin-top: -6px;
        height: 1px;
        border-bottom: 1px solid rgba(226, 227, 229, 1);
      }
      .main {
				// 内容
				
        margin-top: 20px;
				height: calc(100vh - 171px);
				margin-right: 20px;
				margin-left: 20px;
        overflow-y: auto;
        .point {
          font-size: 24px;
          color: #ccc;
        }
      }
    }
    .right-list {
      // 右侧
      height: calc(100vh - 90px);

      .header {
        // 头部
        padding: 20px;
        color: rgba(84, 84, 84, 1);
        line-height: 25px;
        font-size: 16px;
        .opear-btn {
          // 操作按钮
          color: #545454;
          font-size: 17px;
          float: left;
        }
        .save-btn {
          // 保存按钮
          margin-right: 10px;
          margin-top: -4px;
        }
      }
      .line {
        // 标题下划线
        margin: 0px 20px;
        margin-top: -6px;
        height: 1px;
        border-bottom: 1px solid rgba(226, 227, 229, 1);
      }
      .main {
        // 内容
        height: calc(100vh - 191px);
        overflow-y: auto;
        padding: 20px;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
.collect-pointer {
          .el-form-item__label {
            padding: 0 10px!important;
          }
        }
.table_input {
  input {
    padding: 0 5px;
    font-size: 12px;
  }
}
.collect-point {
	.el-tree-node__expand-icon {
		font-size: 18px;
	}
	.el-tree-node__content {
		padding: 10px 0 10px 0;
		.el-tree-node__label,.custom-tree-node {
			font-size: 16px;
		}
	}
	.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
		background-color: #4477D2;
		.el-tree-node__label,.custom-tree-node {
			color: #fff;
			font-size: 16px;
		}
	}
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  } 
.type-insert {
  i {
    font-size: 19px;
  }
}
.role-tree {
  // 角色列表样式
  border-right: none !important;
  .el-submenu__title {
    padding-left: 20px !important;
    height: 42px !important;
    line-height: 42px !important;
  }
  .el-menu-item {
    padding-left: 60px !important;
    height: 42px !important;
    line-height: 42px !important;
  }
  .el-submenu__icon-arrow,
  .el-icon-arrow-down {
    display: none !important;
  }
  .el-submenu__title:hover {
    background-color: #f5f7fa !important;
  }
  .el-menu-item:focus,
  .el-menu-item:hover {
    background-color: #f5f7fa !important;
  }
  .el-menu-item.is-active {
    background-color: rgba(241, 241, 241, 1) !important;
    color: rgb(120, 120, 120) !important;
  }

  .el-submenu {
    .menu-plus {
      display: inline-block;
      width: 24px;
      margin-left: 4px;
      margin-right: 10px;
      font-size: 24px;
      color: #c0c4cc;
      cursor: pointer;
      -webkit-transform: rotate(0);
      transform: rotate(0);
      -webkit-transition: -webkit-transform 0.3s ease-in-out;
      transition: -webkit-transform 0.3s ease-in-out;
      transition: transform 0.3s ease-in-out;
      transition: transform 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;
      transition: transform 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;

      &:before {
        content: "+";
        padding-left: 4px;
      }
    }

    &.is-opened {
      .menu-plus {
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
      }
    }
  }
}
.limitsTree {
  // 权限列表样式
  border: none;
  background: transparent;
  .el-tree-node__content {
    height: 36px;
  }
}
</style>
