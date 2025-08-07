const yaopin = 'YAO_PIN';
const yaopinkc = 'YAO_PIN_INVENTORY';
const changjia = 'CHANG_JIA';
const jijiaxm = 'JI_JIA_XM';
const cailiaoxm = 'CAI_LIAO_XM';
const cailiaoxmNew = 'CAI_LIAO_XM_NEW';
const jijiayucailiaoxm = 'JI_JIA_CAI_LIAO_XM'
const zlxm = 'Z_L_XM'; // 诊疗项目
const xyzd = 'XIYI_ZD'; // 西医诊断
const xyzd2 = 'XIYI_ZD2'; // 西医诊断（中毒）
const xyzd3 = 'XIYI_ZD3'; // 西医诊断（病理）
const zyzd = 'ZYI_ZD'; // 中医诊断
const yxmc = 'YXMC'; // 医学名词
const zzjg = 'ZZJG'; // 科室、病区
const personTable = 'PERSON_TABLE'; // 人员
const personTable2 = 'PERSON_TABLE2'; // 人员 code 为userName
const supplierName = 'GYSN'; // 供应商--采购退库
const surgerydic = 'SUR_DIC'; // 手术字典
const zhzd = 'ZH_ZD'; // 症候诊断
const ghc = 'GAO_HAO_CAI'; // 高耗材
const gcry = 'G_C_PERSON'; // 管床护士
const gces = 'G_C_DOCTOR'; // 住院医生
const drugBatchNum = 'PCH'; // 批次号
const examAppend = 'EXAM_APPEND' // 检查附加项目维护
const bq = 'BQ'; // 病区
const zldz = 'ZLDZ'; // 诊疗项目对照
const policy = 'POLICY' // 政策标识
const cailiao = 'CAI_LIAO' // 材料-基础配置管理-特殊流向配置
const jiabiao = 'JIA_BIAO' // 价表-基础配置管理-特殊流向配置
const ybxmxx = 'YBXMXX'// 医保项目信息
import { formatMoney } from '@/utils/filters';

const gcCommonOption = {
  callBackParams: {
    name: 'peopleName',
    code: 'userName',
  },
  searchField: 'dynamicParam',
  searchParams: {
    currentPage: 1,
    pageSize: 10,
  },
  apiConfig: {
    url: '/bup/authorize/getHaveContextUserPageByOrg',
    method: 'post',
  },
};

export default {
  [zzjg]: {
    popWidth: 300,
    callBackParams: {
      name: 'orgName',
      code: 'orgCode',
    },
    searchField: 'queryParam',
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryParam: '',
    },
    apiConfig: {
      method: 'get',
      url: '/bcs/api/organization/getPageOrg',
    },
    tableColum: [
      { field: 'orgCode', title: '编码' },
      { field: 'orgName', title: '名称', width: '240' },
    ],
  },
  [personTable]: {
    popWidth: 390,
    callBackParams: {
      name: 'peopleName',
      code: 'peopleIdentifier',
    },
    searchField: 'dynamicParam',
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      dynamicParam: '',
    },
    apiConfig: {
      method: 'post',
      url: '/bup/user/getPageUsers',
    },
    tableColum: [
      { field: 'peopleName', title: '姓名', width: '100' },
      { field: 'peopleIdentifier', title: '工号', width: '80' },
      { field: 'workDeptName', title: '科室' },
    ],
  },
  [personTable2]: {
    popWidth: 390,
    callBackParams: {
      name: 'peopleName',
      code: 'userName',
    },
    searchField: 'dynamicParam',
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      dynamicParam: '',
    },
    apiConfig: {
      method: 'post',
      url: '/bup/user/getPageUsers',
    },
    tableColum: [
      { field: 'peopleName', title: '姓名', width: '100' },
      { field: 'userName', title: '编号', width: '80' },
      { field: 'workDeptName', title: '科室' },
    ],
  },
  [drugBatchNum]: {
    popWidth: 630,
    callBackParams: {
      name: 'drugBatchNum',
      code: 'drugBatch',
    },
    searchField: 'queryStr',
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryStr: '',
    },
    apiConfig: {
      method: 'post',
      url: '/msc/stockTableDetail/findAllBatchList',
    },
    tableColum: [
      {
        field: 'drugBatchNum',
        title: '批次',
        width: 140,
      },
      {
        field: 'drugBatch',
        title: '药品批号',
        width: 120,
      },
      {
        field: 'drugVaildity',
        title: '效期',
        width: 110,
      },
      {
        field: 'drugSpec',
        title: '包装',
        width: 140,
      },
      {
        field: 'stockNumStr',
        title: '库存数量',
        width: 110,
      },
    ],
  },
  [yaopinkc]: {
    callBackParams: {
      code: 'drugFactCode',
      name: 'drugName',
    },
    searchField: 'queryStr',
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryStr: '',
    },
    apiConfig: {
      method: 'get',
      url: '/msc/inventoryTemp/findDrugInfoInPhamForInventoryPage',
    },
    tableColum: [
      {
        field: 'drugFactCode',
        property: 'drugFactCode',
        label: '药品编码',
        title: '药品编码',
        width: 82,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'drugName',
        title: '名称',
        property: 'drugName',
        label: '名称',
      },
      {
        field: 'drugSpec',
        title: '规格',
        width: 130,
        property: 'drugSpec',
        label: '规格',
      },
      {
        field: 'pharmacyFactoryName',
        title: '厂家/产地',
        property: 'pharmacyFactoryName',
        width: 140,
        label: '厂家/产地',
      },
      {
        field: 'retailPrice',
        title: '批发价',
        align: 'right',
        width: 80,
        property: 'retailPrice',
        label: '批发价',
        formatter: ({ cellValue }) => {
          if (cellValue) {
            return formatMoney(cellValue);
          }
        },
      },
      {
        field: 'tradePrice',
        title: '零售价',
        align: 'right',
        width: 80,
        property: 'tradePrice',
        formatter: ({ cellValue }) => {
          if (cellValue) {
            return formatMoney(cellValue);
          }
        },
        label: '零售价',
      },
    ],
  },
  [yaopin]: {
    callBackParams: {
      code: 'drugFactCode',
      name: 'drugName',
    },
    searchField: 'queryStr',
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryStr: '',
    },
    apiConfig: {
      method: 'get',
      url: '/msc/drugBaseInfo/findBaseInfoByParams',
    },
    tableColum: [
      {
        field: 'drugFactCode',
        property: 'drugFactCode',
        label: '药品编码',
        title: '药品编码',
        width: 82,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'drugName',
        title: '名称',
        property: 'drugName',
        label: '名称',
        slots: {
          default: 'yaopingDrugName',
        },
      },
      {
        field: 'drugSpec',
        title: '规格',
        width: 130,
        property: 'drugSpec',
        label: '规格',
      },
      {
        field: 'stockNum',
        title: '可用库存数',
        width: 100,
        property: 'stockNum',
        label: '可用库存数',
        align: 'right',
      },
      {
        field: 'pharmacyFactoryName',
        title: '厂家/产地',
        property: 'pharmacyFactoryName',
        width: 140,
        label: '厂家/产地',
      },
      {
        field: 'retailPrice',
        title: '批发价',
        align: 'right',
        width: 80,
        property: 'retailPrice',
        label: '批发价',
        formatter: ({ cellValue }) => {
          if (cellValue) {
            return formatMoney(cellValue);
          }
        },
      },
      {
        field: 'tradePrice',
        title: '零售价',
        align: 'right',
        width: 80,
        property: 'tradePrice',
        formatter: ({ cellValue }) => {
          if (cellValue) {
            return formatMoney(cellValue);
          }
        },
        label: '零售价',
      },
    ],
  },
  [changjia]: {
    callBackParams: {
      code: 'serialNo',
      name: 'factoryName',
    },
    searchField: 'queryStr',
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryStr: '',
    },
    apiConfig: {
      method: 'get',
      url: '/msc/drugFactoryInfo/pageList',
    },
    tableColum: [
      {
        field: 'serialNo',
        property: 'serialNo',
        label: '厂家编码',
        title: '厂家编码',
        align: 'left', // 默认left，金额right
      },
      {
        field: 'factoryName',
        title: '厂家名称',
        property: 'factoryName',
        width: 250,
        label: '厂家名称',
      },
    ],
  },
  [jijiaxm]: {
    callBackParams: {
      code: 'itemCode',
      name: 'itemName',
    },
    searchField: 'queryParam',
    searchParams: {
      clinicId: '',
      currentPage: 1,
      pageSize: 10,
      queryParam: '',
    },
    apiConfig: {
      method: 'get',
      url: '/bcs/clinicItem/getPricesByClinicCondition',
    },
    tableColum: [
      {
        field: 'itemName',
        property: 'itemName',
        label: '项目名称',
        title: '项目名称',
        align: 'left', // 默认left，金额right
      },
      {
        field: 'priceMoney',
        title: '单价',
        property: 'priceMoney',
        label: '单价',
        width: 90,
        align: 'right', // 默认left，金额right
        formatter: ({ cellValue }) => {
          if (cellValue) {
            return formatMoney(cellValue);
          }
        },
      },
      {
        field: 'itemUnitStr',
        title: '单位',
        property: 'itemUnitStr',
        width: 80,
        label: '单位',
      },
      {
        field: 'itemCode',
        property: 'itemCode',
        label: '项目编码',
        title: '项目编码',
        width: 120,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'itemConnotation',
        title: '项目内涵',
        width: 140,
      },
      {
        field: 'itemDesc',
        title: '说明',
        width: 160,
      },
    ],
  },
  [cailiaoxmNew]: {
    callBackParams: {
      code: 'materialCode',
      name: 'materialName',
    },
    searchField: 'queryParam',
    searchParams: {
      clinicId: '',
      currentPage: 1,
      pageSize: 10,
      queryParam: '',
    },
    apiConfig: {
      method: 'get',
      url: '/bcs/clinicComboMaterial/getMaterialAndInventoryInfoPageByClass',
    },
    tableColum: [
      {
        field: 'materialCode',
        property: 'materialCode',
        label: '项目编码',
        title: '项目编码',
        width: 95,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'materialName',
        property: 'materialName',
        label: '项目编码',
        title: '项目名称',
        width: 260,
        align: 'left', // 默认left，金额right
      },
			{
				field: 'isHighValueStr',
				property: 'isHighValueStr',
				label: '是否高值',
				title: '是否高值',
				width: 82,
				align: 'left', // 默认left，金额right
			},
      {
        field: 'sellPrice',
        title: '单价',
        property: 'sellPrice',
        label: '单价',
        width: 80,
        align: 'right', // 默认left，金额right
        formatter: ({ cellValue }) => {
          if (cellValue) {
            return formatMoney(cellValue);
          }
        },
      },
      {
        field: 'specificationValue',
        property: 'specificationValue',
        label: '规格',
        title: '规格',
        width: 120,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'modelValue',
        property: 'modelValue',
        label: '型号',
        title: '型号',
        width: 70,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'measureName',
        title: '单位',
        width: 55,
        property: 'measureName',
        label: '单位',
        formatter: ({ cellValue, row }) => {
          return cellValue || row.measureUnit;
        },
      },
      // {
      //   field: 'hlsInventoryId',
      //   title: '库存id',
      //   property: 'hlsInventoryId',
      //   label: '库存id',
      //   width: 75,
      // },
      {
        field: 'inventoryNum',
        title: '库存数量',
        property: 'inventoryNum',
        label: '库存数量',
        width: 85,
        align: 'right', // 默认left，金额right
      },
      {
        field: 'effectiveDate',
        title: '失效日期',
        property: 'effectiveDate',
        label: '失效日期',
        width: 140,
      },
      {
        field: 'barCode',
        title: '院内条码',
        property: 'barCode',
        label: '院内条码',
        width: 120,
      },
      {
        field: 'batchCode',
        title: '生产批号',
        property: 'batchCode',
        label: '生产批号',
        width: 120,
      },

      {
        field: 'placeOrigin',
        title: '产地',
        width: 140,
        property: 'placeOrigin',
        label: '产地',
      },
    ],
  },
  [cailiaoxm]: {
    callBackParams: {
      code: 'materialCode',
      name: 'materialName',
    },
    searchField: 'queryParam',
    searchParams: {
      clinicId: '',
      currentPage: 1,
      pageSize: 10,
      queryParam: '',
    },
    apiConfig: {
      method: 'get',
      url: '/bcs/clinicComboMaterial/getMaterialAndInventoryInfoPageByClass',
    },
    tableColum: [
      {
        field: 'materialName',
        property: 'materialName',
        label: '项目名称',
        title: '项目名称',
        width: 260,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'specificationValue',
        property: 'specificationValue',
        label: '规格',
        title: '规格',
        width: 120,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'modelValue',
        property: 'modelValue',
        label: '型号',
        title: '型号',
        width: 120,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'sellPrice',
        title: '单价',
        property: 'sellPrice',
        label: '单价',
        width: 80,
        align: 'right', // 默认left，金额right
        formatter: ({ cellValue }) => {
          if (cellValue) {
            return formatMoney(cellValue);
          }
        },
      },
      {
        field: 'measureName',
        title: '单位',
        width: 55,
        property: 'measureName',
        label: '单位',
        formatter: ({ cellValue, row }) => {
          return cellValue || row.measureUnit;
        },
      },


			{
				field: 'isHighValueStr',
				property: 'isHighValueStr',
				label: '是否高值',
				title: '是否高值',
				width: 82,
				align: 'left', // 默认left，金额right
			},
      // {
      //   field: 'hlsInventoryId',
      //   title: '库存id',
      //   property: 'hlsInventoryId',
      //   label: '库存id',
      //   width: 75,
      // },
      {
        field: 'inventoryNum',
        title: '库存数量',
        property: 'inventoryNum',
        label: '库存数量',
        width: 85,
        align: 'right', // 默认left，金额right
      },
      {
        field: 'effectiveDate',
        title: '失效日期',
        property: 'effectiveDate',
        label: '失效日期',
        width: 120,
      },
      {
        field: 'barCode',
        title: '院内条码',
        property: 'barCode',
        label: '院内条码',
        width: 120,
      },
      {
        field: 'batchCode',
        title: '生产批号',
        property: 'batchCode',
        label: '生产批号',
        width: 120,
      },
      {
        field: 'placeOrigin',
        title: '产地',
        width: 140,
        property: 'placeOrigin',
        label: '产地',
      },
      {
        field: 'materialCode',
        property: 'materialCode',
        label: '项目编码',
        title: '项目编码',
        width: 95,
        align: 'left', // 默认left，金额right
      },
    ],
  },
  [jijiayucailiaoxm]: {
    callBackParams: {
      code: 'itemCode',
      name: 'itemName',
    },
    searchField: 'queryParam',
    searchParams: {
      clinicId: '',
      currentPage: 1,
      pageSize: 10,
      queryParam: '',
    },
    apiConfig: {
      method: 'get',
      url: '/bcs/clinicComboMaterial/getMaterialAndPriceInfoPage',
    },
    tableColum: [

      {
        field: 'itemName',
        property: 'itemName',
        label: '项目名称',
        title: '项目名称',
        width: 260,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'specificationValue',
        property: 'specificationValue',
        label: '规格',
        title: '规格',
        width: 120,
        align: 'left', // 默认left，金额right
      },

      {
        field: 'modelValue',
        property: 'modelValue',
        label: '型号',
        title: '型号',
        width: 120,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'priceMoney',
        title: '单价',
        property: 'priceMoney',
        label: '单价',
        width: 80,
        align: 'right', // 默认left，金额right
        formatter: ({ cellValue }) => {
          if (cellValue) {
            return formatMoney(cellValue);
          }
        },
      },

      {
        field: 'itemUnitStr',
        title: '单位',
        property: 'itemUnitStr',
        width: 80,
        label: '单位',
      },
      {
				field: 'isHighValueStr',
				property: 'isHighValueStr',
				label: '是否高值',
				title: '是否高值',
				width: 82,
				align: 'left', // 默认left，金额right
			},
      {
        field: 'inventoryNum',
        title: '库存数量',
        property: 'inventoryNum',
        label: '库存数量',
        width: 85,
        align: 'right', // 默认left，金额right
      },
      {
        field: 'effectiveDate',
        title: '失效日期',
        property: 'effectiveDate',
        label: '失效日期',
        width: 140,
      },
      {
        field: 'barCode',
        title: '院内条码',
        property: 'barCode',
        label: '院内条码',
        width: 120,
      },
      {
        field: 'batchCode',
        title: '生产批号',
        property: 'batchCode',
        label: '生产批号',
        width: 120,
      },
      {
        field: 'placeOrigin',
        title: '产地',
        width: 140,
        property: 'placeOrigin',
        label: '产地',
      },
      {
        field: 'itemCode',
        property: 'itemCode',
        label: '项目编码',
        title: '项目编码',
        width: 140,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'itemTypeStr',
        property: 'itemTypeStr',
        label: '项目类型',
        title: '项目类型',
        width: 100,
        align: 'left'
      },
    ],
  },
  [zlxm]: {
    callBackParams: {
      code: 'clinicId',
      name: 'itemName',
    },
    searchField: 'searchName',
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      searchName: '',
      isEnable: 1,
    },
    apiConfig: {
      method: 'get',
      url: '/bcs/clinicItem/pageList',
    },
    tableColum: [
      {
        field: 'itemCode',
        property: 'itemCode',
        label: '项目编码',
        title: '项目编码',
        width: 160,
      },
      {
        field: 'itemName',
        property: 'itemName',
        label: '项目名称',
        title: '项目名称',
        // width: 160,
        align: 'left', // 默认left，金额right
      },
			{
			  field: 'priceMoney',
			  property: 'priceMoney',
			  label: '价格',
			  title: '价格',
			  width: 120,
			  align: 'right', // 默认left，金额right
			},
      {
        field: 'itemClassStr',
        property: 'itemClassStr',
        label: '项目分类',
        title: '项目分类',
        width: 160,
        align: 'left', // 默认left，金额right
      },
    ],
  },
  [surgerydic]: {
    popWidth: 300,
    callBackParams: {
      name: 'operationName',
      code: 'operationCode',
    },
    searchField: 'queryParam',
    searchParams: {
      queryParam: '',
      currentPage: 1,
      pageSize: 10,
      isEnable: 1,
    },
    apiConfig: {
      method: 'get',
      url: '/bcs/operationDict/pageList',
    },
    tableColum: [
      {
        property: 'operationCode',
        field: 'operationCode',
        title: '编码',
        label: '编码',
      },
      {
        property: 'operationName',
        field: 'operationName',
        title: '名称',
        label: '名称',
      },
      {
        property: 'operationGradeCodeCh',
        field: 'operationGradeCodeCh',
        title: '级别',
        label: '级别',
      },
      {
        property: 'icdVersionCh',
        field: 'icdVersionCh',
        title: '版本',
        label: '版本',
      },
    ],
  },
  [xyzd]: {
    popWidth: 300,
    callBackParams: {
      name: 'diagnosisName',
      code: 'diagnosisCode',
    },
    searchField: 'queryParam',
    searchParams: {
      queryParam: '',
      currentPage: 1,
      pageSize: 10,
      isEnable: 1,
    },
    apiConfig: {
      method: 'post',
      url: '/bcs/diagnosisDict/pageList',
    },
    tableColum: [
      {
        property: 'diagnosisCode',
        field: 'diagnosisCode',
        title: '诊断编码',
        label: '诊断编码',
      },
      {
        property: 'diagnosisName',
        field: 'diagnosisName',
        title: '诊断名称',
        label: '诊断名称',
      },
    ],
  },
  [xyzd2]: {
    popWidth: 300,
    callBackParams: {
      name: 'diagnosisName',
      code: 'diagnosisCode',
    },
    searchField: 'queryParam',
    searchParams: {
      queryParam: '',
      currentPage: 1,
      pageSize: 10,
      isEnable: 1,
      diagnosisType: '9',
    },
    apiConfig: {
      method: 'post',
      url: '/bcs/diagnosisDict/pageList',
    },
    tableColum: [
      {
        property: 'diagnosisCode',
        field: 'diagnosisCode',
        title: '诊断编码',
        label: '诊断编码',
      },
      {
        property: 'diagnosisName',
        field: 'diagnosisName',
        title: '诊断名称',
        label: '诊断名称',
      },
    ],
  },
  [xyzd3]: {
    popWidth: 300,
    callBackParams: {
      name: 'diagnosisName',
      code: 'diagnosisCode',
    },
    searchField: 'queryParam',
    searchParams: {
      queryParam: '',
      currentPage: 1,
      pageSize: 10,
      isEnable: 1,
      diagnosisType: '10',
    },
    apiConfig: {
      method: 'post',
      url: '/bcs/diagnosisDict/pageList',
    },
    tableColum: [
      {
        property: 'diagnosisCode',
        field: 'diagnosisCode',
        title: '诊断编码',
        label: '诊断编码',
      },
      {
        property: 'diagnosisName',
        field: 'diagnosisName',
        title: '诊断名称',
        label: '诊断名称',
      },
    ],
  },
  [ghc]: {
    popWidth: 600,
    callBackParams: {
      name: 'materialName',
      code: 'materialCode',
      backCodes: 'barCode,materialCode',
    },
    searchField: 'queryParam',
    searchParams: {
      materialName: '',
      currentPage: 1,
      pageSize: 10,
    },
    apiConfig: {
      method: 'get',
      url: '/bcs/material/queryInventoryByPage',
    },
    tableColum: [
      {
        field: 'materialCode',
        property: 'materialCode',
        label: '材料编码',
        title: '材料编码',
        width: 110,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'materialName',
        property: 'materialName',
        label: '材料名称',
        title: '材料名称',
        width: 140,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'specificationValue',
        property: 'specificationValue',
        label: '规格',
        title: '规格',
        width: 110,

        align: 'left', // 默认left，金额right
      },
      {
        field: 'modelValue',
        property: 'modelValue',
        label: '型号',
        title: '型号',
        width: 110,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'barCode',
        property: 'barCode',
        label: '条码信息',
        title: '条码信息',
        width: 120,

        align: 'left', // 默认left，金额right
      },
      {
        field: 'measureName',
        title: '单位',
        width: 90,
        property: 'measureName',
        label: '单位',
      },
      {
        field: 'inventoryPrice',
        title: '单价',
        property: 'inventoryPrice',
        label: '单价',
        width: 90,
        align: 'right', // 默认left，金额right
        formatter: ({ cellValue }) => {
          if (cellValue) {
            return formatMoney(cellValue);
          }
        },
      },
      {
        field: 'effectiveDate',
        title: '有效期',
        width: 120,
        property: 'effectiveDate',
        label: '有效期',
      },
      {
        field: 'batchCode',
        title: '批号',
        width: 90,
        property: 'batchCode',
        label: '批号',
      },
      {
        field: 'manufacturersName',
        title: '厂家',
        width: 160,
        property: 'manufacturersName',
        label: '厂家',
      },
    ],
  },
  [zyzd]: {
    popWidth: 300,
    callBackParams: {
      name: 'tcmDiagnosisName',
      code: 'tcmDiagnosisCode',
    },
    searchField: 'searchName',
    searchParams: {
      searchName: '',
      currentPage: 1,
      pageSize: 10,
      isEnable: 1,
    },
    apiConfig: {
      method: 'get',
      url: '/bcs/tcmDiagnosisDict/pageList',
    },
    tableColum: [
      {
        property: 'tcmDiagnosisCode',
        field: 'tcmDiagnosisCode',
        title: '诊断编码',
        label: '诊断编码',
      },
      {
        property: 'tcmDiagnosisName',
        field: 'tcmDiagnosisName',
        title: '诊断名称',
        label: '诊断名称',
      },
    ],
  },
  [yxmc]: {
    popWidth: 300,
    callBackParams: {
      name: 'medicalName',
      code: 'medicalCode',
    },
    searchField: 'medicalParam',
    searchParams: {
      medicalParam: '',
      currentPage: 1,
      pageSize: 10,
      isEnableFlag: '1',
      medicalType: '0',
    },
    apiConfig: {
      method: 'post',
      url: '/bcs/medicalInfo/encodeMedicalInfoPage',
    },
    tableColum: [
      {
        property: 'medicalName',
        field: 'medicalName',
        title: '医学名词',
        label: '医学名词',
      },
      {
        property: 'icdName',
        field: 'icdName',
        title: '对应ICD名词',
        label: '对应ICD名词',
      },
    ],
  },
  [zhzd]: {
    popWidth: 300,
    callBackParams: {
      name: 'tcmSyndromeTypeName',
      code: 'tcmSyndromeTypeCode',
    },
    searchField: 'pyCode',
    searchParams: {
      pyCode: '',
      currentPage: 1,
      pageSize: 10,
      isEnable: 1,
    },
    apiConfig: {
      url: '/bcs/ebdTcmSyndromeDict/pageList',
      method: 'post',
    },
    tableColum: [
      {
        property: 'tcmSyndromeTypeCode',
        field: 'tcmSyndromeTypeCode',
        title: '症候编码',
        label: '症候编码',
      },
      {
        property: 'tcmSyndromeTypeName',
        field: 'tcmSyndromeTypeName',
        title: '症候名称',
        label: '症候名称',
      },
    ],
  },
  [gcry]: {
    ...gcCommonOption,
    tableColum: [
      {
        property: 'peopleName',
        field: 'peopleName',
        title: '姓名',
        label: '姓名',
      },
      {
        property: 'peopleIdentifier',
        field: 'peopleIdentifier',
        title: '工号',
        label: '工号',
      },
      {
        property: 'assignedPatientsCount',
        field: 'assignedPatientsCount',
        title: '已分配患者数',
        label: '已分配患者数',
      },
    ],
  },
  [gces]: {
    ...gcCommonOption,
    tableColum: [
      {
        property: 'peopleName',
        field: 'peopleName',
        title: '姓名',
        label: '姓名',
      },
      {
        property: 'peopleIdentifier',
        field: 'peopleIdentifier',
        title: '工号',
        label: '工号',
      },
    ],
  },
  [examAppend]: {
    callBackParams: {
      name: 'clinicIdName',
      code: 'clinicId',
    },
    searchField: 'queryParam',
    searchParams: {
      // currentPage: 1,
      // pageSize: 10
    },
    noPage: true,
    apiConfig: {
      url: '/cpoe/applyAppend/queryApplyAppend',
      method: 'get',
    },
    tableColum: [
      {
        property: 'clinicIdName',
        field: 'clinicIdName',
        title: '诊疗项目',
        label: '诊疗项目',
        width: 120,
      },
      {
        property: 'num',
        field: 'num',
        title: '数量',
        label: '数量',
      },
      {
        property: 'execOrgName',
        field: 'execOrgName',
        title: '执行科室',
        label: '执行科室',
      },
      {
        property: 'repeatRuleStr',
        field: 'repeatRuleStr',
        title: '合单去重规则',
        label: '合单去重规则',
        width: 120,
      },
    ],
  },
  [bq]: {
    popWidth: 200,
    callBackParams: {
      name: 'orgName',
      code: 'orgName',
    },
    searchField: 'queryParam',
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryParam: '',
    },
    apiConfig: {
      method: 'get',
      url: '/bcs/api/organization/getPageOrg',
    },
    tableColum: [
      { property: 'orgCode', field: 'orgCode', title: '编码', label: '编码' },
      { property: 'orgName', field: 'orgName', title: '名称', label: '名称', width: '150' },
      { property: 'clicDetailTypeStr', field: 'clicDetailTypeStr', title: '分类', label: '分类' },
      { property: 'areaName', field: 'areaName', title: '院区', label: '院区' },
    ],
  },
  [zldz]: {
    popWidth: 700,
    callBackParams: {
      name: 'itemName',
      code: 'itemCode',
    },
    searchField: 'searchName',
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      searchName: '',
    },
    apiConfig: {
      method: 'get',
      url: '/bcs/clinicItem/pageList',
    },
    tableColum: [
      {
        property: 'itemCode',
        field: 'itemCode',
        title: '编码',
        label: '编码',
        showOverflowTooltip: true,
        width: 120,
      },
      {
        property: 'itemName',
        field: 'itemName',
        title: '名称',
        label: '名称',
        showOverflowTooltip: true,
        width: 120,
      },
      {
        property: 'itemClassStr',
        field: 'itemClassStr',
        title: '项目分类',
        label: '项目分类',
        showOverflowTooltip: false,
        width: 85,
      },
      {
        property: 'itemUnitStr',
        field: 'itemUnitStr',
        title: '单位',
        label: '单位',
        showOverflowTooltip: false,
        width: 70,
      },
      {
        property: 'propertyClassStr',
        field: 'propertyClassStr',
        title: '细分类别',
        label: '细分类别',
        showOverflowTooltip: false,
        width: 85,
      },
      {
        property: 'priceStdCode',
        field: 'priceStdCode',
        title: '物价码',
        label: '物价码',
        showOverflowTooltip: false,
        width: 80,
      },
      {
        property: 'provinceStdCode',
        field: 'provinceStdCode',
        title: '省平台对照',
        label: '省平台对照',
        showOverflowTooltip: false,
        width: 100,
      },
      { property: 'descn', field: 'descn', title: '备注', label: '备注', showOverflowTooltip: true, width: 80 },
      {
        property: 'isEnable',
        field: 'isEnable',
        title: '状态',
        label: '状态',
        width: 80,
        align: 'center',
        render: ({ row }) => {
          console.log(row, '22222');
          return <wg-icon name={+row.isEnable === 1 ? 'icon-a-Group90' : 'icon-a-Group89'} class="icon_tit" />;
        },
      },
    ],
  },
  [policy]: {
    popWidth: 340,
    callBackParams: {
      name: 'diseaseSettleName',
      code: 'diseasePolicyCode',
    },
    searchField: 'keyWord',
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      keyWord: '',
    },
    apiConfig: {
      method: 'get',
      url: '/mis/dictionary/getPolicy',
    },
    tableColum: [
      { property: 'diseasePolicyCode', field: 'diseasePolicyCode', title: '政策标识编码', label: '政策标识编码' },
      { property: 'diseaseSettleName', field: 'diseaseSettleName', title: '政策标识名称', label: '政策标识名称' },
    ],
  },
  [cailiao]: {
    callBackParams: {
      code: 'materialCode',
      name: 'materialName',
    },
    searchField: 'queryParam',
    searchParams: {
      clinicId: '',
      currentPage: 1,
      pageSize: 10,
      queryParam: '',
    },
    apiConfig: {
      method: 'get',
      url: '/bcs/material/queryMaterialInfoPage',
    },
    tableColum: [
      {
        field: 'materialCode',
        property: 'materialCode',
        label: '项目编码',
        title: '项目编码',
        width: 140,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'materialName',
        property: 'materialName',
        label: '项目编码',
        title: '项目名称',
        width: 160,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'specificationValue',
        property: 'specificationValue',
        label: '规格',
        title: '规格',
        width: 110,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'modelValue',
        property: 'modelValue',
        label: '型号',
        title: '型号',
        width: 70,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'measureName',
        title: '单位',
        width: 90,
        property: 'measureName',
        label: '单位',
        formatter: ({ cellValue, row }) => {
          return cellValue || row.measureUnit;
        },
      },
      {
        field: 'sellPrice',
        title: '单价',
        property: 'sellPrice',
        label: '单价',
        width: 90,
        align: 'right', // 默认left，金额right
        formatter: ({ cellValue }) => {
          if (cellValue) {
            return formatMoney(cellValue);
          }
        },
      },
      {
        field: 'inventoryNum',
        title: '库存数量',
        property: 'inventoryNum',
        label: '库存数量',
        width: 85,
        align: 'right', // 默认left，金额right
      },
      {
        field: 'placeOrigin',
        title: '产地',
        width: 140,
        property: 'placeOrigin',
        label: '产地',
      },
    ],
  },
  [jiabiao]: {
    callBackParams: {
      code: 'itemCode',
      name: 'itemName',
    },
    searchField: 'queryParam',
    searchParams: {
      clinicId: '',
      currentPage: 1,
      pageSize: 10,
      queryParam: '',
    },
    apiConfig: {
      method: 'get',
      url: '/bcs/clinicPrice/priceListpage',
    },
    tableColum: [
      {
        field: 'itemCode',
        property: 'itemCode',
        label: '价表编码',
        title: '价表编码',
        width: 140,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'itemName',
        property: 'itemName',
        label: '价表名称',
        title: '价表名称',
        width: 160,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'priceMoney',
        title: '价格',
        property: 'priceMoney',
        label: '价格',
        width: 90,
        align: 'right', // 默认left，金额right
        formatter: ({ cellValue }) => {
          if (cellValue) {
            return formatMoney(cellValue);
          }
        },
      },
    ],
  },
  [ybxmxx]: {
    callBackParams: {
      code: 'hilistCode',
      name: 'hilistName',
    },
    searchField: 'hilistName',
    searchParams: {
      dasCode: '',
      currentPage: 1,
      pageSize: 10,
      itemCode: '',
      hilistCode: '',
      itemName: '',
      hilistName: '',
    },
    apiConfig: {
      method: 'get',
      url: '/mis/insureItemMatch/pageListInsureItem',
    },
    tableColum: [
      {
        field: 'listTypeStr',
        property: 'listTypeStr',
        label: '项目类型',
        title: '项目类型',
        width: 90,
      },
      {
        field: 'hilistCode',
        property: 'hilistCode',
        label: '项目编码',
        title: '项目编码',
        width: 250,
        align: 'left', // 默认left，金额right
      },
      {
        field: 'hilistName',
        property: 'hilistName',
        title: '项目名称',
        label: '项目名称',
        width: 180,
      },
      {
        field: 'spec',
        property: 'spec',
        title: '规格',
        label: '规格',
        width: 90,
      },
      {
        field: 'itemUnitStr',
        property: 'itemUnitStr',
        title: '单位',
        label: '单位',
        width: 60,
      },
      {
        field: 'referencePrice',
        property: 'referencePrice',
        title: '参考单价',
        label: '参考单价',
        align: 'right',
        width: 80,
      },
    ],
  },
  [supplierName]: {
    popWidth: 300,
    callBackParams: {
      name: 'supplierName',
      code: 'supplierSerialNo',
    },
    searchField: 'searchName',
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      searchName: ''
    },
    apiConfig: {
      method: 'get',
      url: '/msc/drugSupplierCatalog/pageList',
    },
    tableColum: [
      { property: 'supplierSerialNo', label: '供货商编码', field: 'supplierSerialNo', title: '供货商编码',width: 100  },
      { property: 'supplierName', label: '供货商名称', field: 'supplierName', title: '供货商名称' },
    ],
  },
};
