const agreemen = "AGREEMEN"; // 协议
const bedTable = "BED_TABLE"; // 床位号
const yaopinkc = "YAO_PIN_INVENTORY"; // 药品库存
const yaopin = "YAO_PIN"; // 药品
const yaopinStockNum = "YAO_PIN_STOCKNUM"; // 药品-有可用库存库存字段
const yaopinAdd = "YAO_PIN_ADD"; // 药品-含量累计
const yaopinQuotient = "YAO_PIN_QUOTIENT"; // 药品-有可用库存库存字段
const personTable = "PERSON_TABLE"; // 人员
const personTable2 = "PERSON_TABLE2"; // 人员 userName为code
const personTable4 = "PERSON_TABLE4"; // 人员 userName为code
const personTable5 = "PERSON_TABLE5"; // 毒麻 代理人专用
const personTableRadio = "PERSON_TABLE_RADIO"; // 人员 有全院、本科室

const changjia = "CHANG_JIA"; // 厂家
const jijiaxm = "JI_JIA_XM"; // 计价项目
const cailiaoxm = "CAI_LIAO_XM"; // 材料项目
const zlxm = "Z_L_XM"; // 诊疗项目
const zzjg = "ZZJG"; // 组织机构 科室、病区
const zzjg_noPage = "ZZJGNOPAGE"; // 组织机构 科室、病区- 不分页
const supplier = "GYS"; // 供应商
const priceTable = "PRICE"; // 价表
const operation = "OPERATION"; // 手术
const xyzd = "XIYI_ZD"; // 西医诊断
const zyzd = "ZYI_ZD"; // 中医诊断
const zhzd = "ZH_ZD"; // 症候诊断
const dtp = "D_T_P"; // 治疗流向查询-诊疗项目
const supplierName = "GYSN"; // 供应商--采购退库
const queryStrCode = "WLDW"; // 往来单位
const drugBatchNum = "PCH"; // 批次号
const dept = "DEPARTMENT"; // 科室 (药品调入)
const area = "HOSPITAL_AREA"; // 院区
const kslb = "KSLB"; // 科室列表（药品流向 根据clicDetailTypes查询）
const deptReceiver = "DEPARTMENT_RECEIVER"; // 科室接收人
const insureDisease = "INSURE_DISEASE"; // 医保端疾病数据
const optUser = "OPT_USER"; // 操作用户
const optFeedbackUser = "OPT_FEEDBACK_USER"; // 问题收集操作用户
const bedTypeCode = "BEB_TYPE_CODE"; // 床位类型
const personTable3 = "PERSON_TABLE3"; // 人员 userName为code
const policy = "POLICY"; // 政策标识
const yzxmdz = "YZXMDZ"; // 医嘱附加项目-项目对照
const lyks = "LYKS"; // 领药科室
const zzjgPost = "ZZJG_POST"; // 组织机构 科室、病区 post请求
const patient = "PATIENT";
const zzjgRelation = "ZZJG_RELATION";
const rjsh = "RJSX";
const personOrg = "PERSON_ORG"; // 会诊医生查询
const personOrg2 = "PERSON_ORG2"; // 会诊医生查询
const personSpecial = "PERSON_SPECIAL"; //专科医生查询

export default {
  [optFeedbackUser]: {
    popWidth: 630,
    callBackName: {
      label: "peopleName",
      value: "userName",
    },
    searchField: "searchKey",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      searchKey: "",
    },
    apiConfig: {
      method: "post",
      url: "/bup/user/getUserInfoList",
    },
    tableColum: [
      {
        property: "peopleName",
        label: "姓名",
        width: 140,
      },
      {
        property: "peopleIdentifier",
        label: "工号",
        width: 120,
      },
      {
        property: "workDeptName",
        label: "科室",
        width: 110,
      },
    ],
  },
  [optUser]: {
    popWidth: 630,
    callBackName: {
      label: "peopleName",
      value: "peopleIdentifier",
    },
    searchField: "searchKey",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      searchKey: "",
    },
    apiConfig: {
      method: "post",
      url: "/bup/user/getUserInfoList",
    },
    tableColum: [
      {
        property: "peopleName",
        label: "姓名",
        width: 140,
      },
      {
        property: "peopleIdentifier",
        label: "工号",
        width: 120,
      },
      {
        property: "workDeptName",
        label: "科室",
        width: 110,
      },
    ],
  },
  [drugBatchNum]: {
    popWidth: 630,
    callBackName: {
      label: "drugBatchNum",
      value: "drugBatch",
    },
    searchField: "queryStr",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryStr: "",
    },
    apiConfig: {
      method: "post",
      url: "/msc/stockTableDetail/findAllBatchList",
    },
    tableColum: [
      {
        property: "drugBatchNum",
        label: "批次",
        width: 140,
      },
      {
        property: "drugBatch",
        label: "药品批号",
        width: 120,
      },
      {
        property: "drugVaildity",
        label: "效期",
        width: 110,
      },
      {
        property: "drugSpec",
        label: "包装",
        width: 140,
      },
      {
        property: "stockNumStr",
        label: "库存数量",
        width: 110,
      },
    ],
  },
  [agreemen]: {
    popWidth: 400,
    callBackName: {
      label: "unitName",
      value: "licenseCredentialsNo",
    },
    searchField: "unitName",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      bedName: "",
    },
    apiConfig: {
      method: "get",
      url: "/bss/agreementUnit/findAgreementUnits",
    },
    noPage: true,
    tableColum: [
      {
        property: "unitName",
        label: "单位名称",
      },
      {
        property: "contractNo",
        label: "协议合同号",
      },
    ],
  },
  [bedTable]: {
    popWidth: 400,
    callBackName: {
      label: "bedName",
      value: "bedCode",
    },
    searchField: "bedName",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      bedName: "",
    },
    apiConfig: {
      method: "post",
      url: "/pix/bedDict/bedAndRecordList",
    },
    tableColum: [
      {
        property: "bedCode",
        label: "床位编码",
      },
      {
        property: "bedName",
        label: "床位名称",
      },
      {
        property: "sexFlagName",
        label: "性别限制",
      },
    ],
  },
  [yaopin]: {
    popWidth: 770,
    callBackName: {
      label: "drugName",
      value: "drugFactCode",
    },
    searchField: "queryStr",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryStr: "",
    },
    apiConfig: {
      method: "get",
      url: "/msc/drugBaseInfo/findBaseInfoByParams",
    },
    tableColum: [
      { property: "drugFactCode", label: "药品编码", width: "90" },
      { property: "drugName", label: "名称", width: "170" },
      { property: "drugSpec", label: "规格", width: "150" },
      { property: "pharmacyFactoryName", label: "厂家／产地" },
      { property: "tradePrice", label: "批发价", width: "78", money: true },
      { property: "retailPrice", label: "零售价", width: "78", money: true },
    ],
  },
  [yaopinkc]: {
    popWidth: 770,
    callBackName: {
      label: "drugName",
      value: "drugFactCode",
    },
    searchField: "queryStr",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryStr: "",
    },
    apiConfig: {
      method: "get",
      url: "/msc/inventoryTemp/findDrugInfoInPhamForInventoryPage",
    },
    tableColum: [
      { property: "drugFactCode", label: "药品编码", width: "90" },
      { property: "drugName", label: "名称", width: "170" },
      { property: "drugSpec", label: "规格", width: "150" },
      { property: "pharmacyFactoryName", label: "厂家／产地" },
      { property: "tradePrice", label: "批发价", width: "78", money: true },
      { property: "retailPrice", label: "零售价", width: "78", money: true },
    ],
  },
  [yaopinStockNum]: {
    popWidth: 840,
    callBackName: {
      label: "drugName",
      value: "drugFactCode",
    },
    searchField: "queryStr",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryStr: "",
    },
    apiConfig: {
      method: "get",
      url: "/msc/drugBaseInfo/findBaseInfoByParams",
    },
    tableColum: [
      { property: "drugFactCode", label: "药品编码", width: "90" },
      { property: "drugName", label: "名称", width: "170" },
      { property: "drugSpec", label: "规格", width: "120" },
      { property: "pharmacyFactoryName", label: "厂家／产地", width: "150" },
      { property: "tradePrice", label: "批发价", width: "88", money: true },
      { property: "retailPrice", label: "零售价", width: "88", money: true },
      { property: "stockNumStr", label: "可用库存", width: "90" },
    ],
  },
  [yaopinQuotient]: {
    popWidth: 830,
    callBackName: {
      label: "drugName",
      value: "drugFactCode",
    },
    searchField: "queryStr",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryStr: "",
    },
    apiConfig: {
      method: "get",
      url: "/msc/drugBaseInfo/findBaseInfoByParams",
    },
    tableColum: [
      { property: "drugFactCode", label: "药品编码", width: "85" },
      { property: "drugName", label: "名称", width: "150" },
      { property: "drugSpec", label: "规格", width: "100" },
      { property: "pharmacyFactoryName", label: "厂家／产地", width: "130" },
      { property: "tradePrice", label: "批发价", width: "80", money: true },
      { property: "retailPrice", label: "零售价", width: "80", money: true },
      { property: "stockNumStr", label: "可用库存", width: "90" },
      { property: "quotientStr", label: "总库存", width: "85" },
    ],
  },
  [yaopinAdd]: {
    popWidth: 840,
    callBackName: {
      label: "drugName",
      value: "drugFactCode",
    },
    searchField: "queryStr",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryStr: "",
      contValue: "55",
    },
    apiConfig: {
      method: "get",
      url: "/msc/drugCustBusi/findContentDrugParams",
    },
    tableColum: [
      { property: "drugFactCode", label: "药品编码", width: "90" },
      { property: "drugName", label: "名称", width: "170" },
      { property: "drugSpec", label: "规格", width: "120" },
      { property: "pharmacyFactoryName", label: "厂家／产地", width: "150" },
      { property: "tradePrice", label: "批发价", width: "88", money: true },
      { property: "retailPrice", label: "零售价", width: "88", money: true },
      { property: "stockNumStr", label: "可用库存", width: "90" },
    ],
  },
  [personTable]: {
    popWidth: 460,
    callBackName: {
      label: "peopleName",
      value: "peopleIdentifier",
      isUseValue: true,
    },
    searchField: "dynamicParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      dynamicParam: "",
    },
    apiConfig: {
      method: "post",
      url: "/bup/user/getPageUsers",
    },
    tableColum: [
      { property: "peopleName", label: "姓名", width: "100" },
      { property: "peopleIdentifier", label: "工号", width: "80" },
      { property: "workDeptName", label: "科室" },
      { property: "workProfessionalStr", label: "职称" },
    ],
  },
  [personTableRadio]: {
    popWidth: 460,
    callBackName: {
      label: "peopleName",
      value: "peopleIdentifier",
      isUseValue: true,
    },
    searchField: "dynamicParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      dynamicParam: "",
    },
    apiConfig: {
      method: "post",
      url: "/bup/user/getPageUsers",
    },
    tableColum: [
      { property: "peopleName", label: "姓名", width: "100" },
      { property: "peopleIdentifier", label: "工号", width: "80" },
      { property: "workDeptName", label: "科室" },
      { property: "workProfessionalStr", label: "职称" },
    ],
  },
  [personTable2]: {
    popWidth: 390,
    callBackName: {
      label: "peopleName",
      value: "userName",
      isUseValue: true,
    },
    searchField: "dynamicParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      dynamicParam: "",
    },
    apiConfig: {
      method: "post",
      url: "/bup/user/getPageUsers",
    },
    tableColum: [
      { property: "peopleName", label: "姓名", width: "100" },
      { property: "userName", label: "编码", width: "80" },
      { property: "workDeptName", label: "科室" },
    ],
  },
  [personTable4]: {
    popWidth: 390,
    callBackName: {
      label: "peopleName",
      value: "userName",
      isUseValue: true,
    },
    searchField: "dynamicParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      // dynamicParam: '',
    },
    apiConfig: {
      method: "post",
      url: "/sde/sdeOperation/queryOperatorList",
    },
    tableColum: [
      { property: "peopleName", label: "姓名", width: "100" },
      { property: "userName", label: "编码", width: "80" },
      { property: "workDeptName", label: "科室" },
    ],
  },
  [changjia]: {
    popWidth: 390,
    callBackName: {
      label: "factoryName",
      value: "serialNo",
    },
    searchField: "queryStr",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryStr: "",
    },
    apiConfig: {
      method: "get",
      url: "/msc/drugFactoryInfo/pageList",
    },
    tableColum: [
      { property: "serialNo", label: "厂家编码" },
      { property: "factoryName", label: "厂家名称", width: 250 },
    ],
  },
  [jijiaxm]: {
    popWidth: 550,
    callBackName: {
      label: "itemName",
      value: "itemCode",
    },
    searchField: "queryStr",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryStr: "",
    },
    apiConfig: {
      method: "get",
      url: "/bcs/clinicItem/getPricesByClinicCondition",
    },
    tableColum: [
      { property: "itemCode", label: "项目编码", width: 140 },
      { property: "itemName", label: "项目名称" },
      { property: "itemUnitStr", label: "单位", width: 110 },
      { property: "priceMoney", label: "单价", width: 140, money: true },
    ],
  },
  [cailiaoxm]: {
    popWidth: 770,
    callBackName: {
      label: "materialName",
      value: "materialCode",
    },
    searchField: "queryParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryParam: "",
    },
    apiConfig: {
      method: "get",
      url: "/bcs/clinicComboMaterial/getMaterialInfoPageByClass",
    },
    tableColum: [
      { property: "materialCode", label: "项目编码", width: 140 },
      { property: "materialName", label: "项目名称", width: 160 },
      { property: "modelValue", label: "型号" },
      { property: "measureUnit", label: "单位", width: 90 },
      { property: "sellPrice", label: "单价", width: 90, money: true },
      { property: "placeOrigin", label: "厂家" },
    ],
  },
  [zlxm]: {
    popWidth: 500,
    callBackName: {
      label: "itemName",
      value: "clinicId",
    },
    searchField: "searchName",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      searchName: "",
    },
    apiConfig: {
      method: "get",
      url: "/bcs/clinicItem/pageList",
    },
    tableColum: [
      { property: "clinicId", label: "诊疗项目ID", width: 160 },
      { property: "itemName", label: "诊疗项目名称" },
      { property: "priceMoney", label: "价格", width: 120, money: true },
      { property: "itemClassStr", label: "诊疗项目分类", width: 160 },
    ],
  },
  [zzjgPost]: {
    popWidth: 500,
    callBackName: {
      label: "orgName",
      value: "orgCode",
    },
    searchField: "queryParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryParam: "",
    },
    apiConfig: {
      method: "post",
      url: "/bcs/api/organization/getPageOrgByPost",
    },
    tableColum: [
      { property: "orgCode", label: "编码" },
      { property: "orgName", label: "名称", width: "150" },
      { property: "clicDetailTypeStr", label: "分类" }, //其实就是细分累呗
      { property: "areaName", label: "院区" },
    ],
  },
  [zzjg]: {
    popWidth: 500,
    callBackName: {
      label: "orgName",
      value: "orgCode",
    },
    searchField: "queryParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryParam: "",
    },
    apiConfig: {
      method: "get",
      url: "/bcs/api/organization/getPageOrg",
    },
    tableColum: [
      { property: "orgCode", label: "编码" },
      { property: "orgName", label: "名称", width: "150" },
      { property: "clicDetailTypeStr", label: "分类" }, //其实就是细分累呗
      { property: "areaName", label: "院区" },
    ],
  },
  [zzjgRelation]: {
    popWidth: 500,
    callBackName: {
      label: "name",
      value: "code",
    },
    searchField: "queryParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryParam: "",
    },
    apiConfig: {
      method: "get",
      url: "/bcs/api/organization/getRelationShipByCode",
    },
    tableColum: [
      { property: "code", label: "编码" },
      { property: "name", label: "名称", width: "150" },
      { property: "clicDetailTypeStr", label: "分类" }, //其实就是细分累呗
    ],
  },
  [zzjg_noPage]: {
    popWidth: 500,
    callBackName: {
      label: "orgName",
      value: "orgCode",
    },
    searchField: "queryParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryParam: "",
    },
    apiConfig: {
      method: "get",
      url: "/bcs/api/organization/getOrgList",
    },
    tableColum: [
      { property: "orgCode", label: "编码" },
      { property: "orgName", label: "名称", width: "150" },
      { property: "clicDetailTypeStr", label: "分类" }, //其实就是细分累呗
      { property: "areaName", label: "院区" },
    ],
  },
  [kslb]: {
    // 科室列表
    popWidth: 500,
    callBackName: {
      label: "orgName",
      value: "orgCode",
    },
    searchField: "queryParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryParam: "",
    },
    apiConfig: {
      method: "get",
      url: "/bcs/api/organization/getOrgList",
    },
    tableColum: [
      { property: "orgCode", label: "编码" },
      { property: "orgName", label: "名称", width: "150" },
      { property: "clicDetailTypeStr", label: "分类" }, //其实就是细分累呗
      { property: "areaName", label: "院区" },
    ],
  },
  [supplier]: {
    popWidth: 500,
    callBackName: {
      label: "supplierName",
      value: "supplierSerialNo",
    },
    searchField: "searchName",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      searchName: "",
    },
    apiConfig: {
      method: "get",
      url: "/msc/drugSupplierCatalog/pageList",
    },
    tableColum: [{ property: "supplierName", label: "供货商名称" }],
  },
  [priceTable]: {
    popWidth: 500,
    callBackName: {
      label: "itemName",
      value: "itemCode",
    },
    searchField: "queryParam",
    searchParams: {
      pyCode: "",
    },
    apiConfig: {
      method: "get",
      url: "/bcs/clinicPrice/priceListpage",
    },
    tableColum: [
      { property: "itemCode", label: "价表编码" },
      { property: "itemName", label: "价表名称" },
      { property: "priceMoney", label: "价格", money: true },
    ],
  },
  [operation]: {
    popWidth: 800,
    callBackName: {
      label: "operationName",
      value: "operationCode",
    },
    searchField: "queryParam",
    searchParams: {
      queryParam: "",
    },
    apiConfig: {
      method: "get",
      url: "/bcs/operationDict/pageList",
    },
    tableColum: [
      { property: "operationCode", label: "编码", width: 110 },
      { property: "operationName", label: "名称" },
      { property: "operationGradeCodeCh", label: "级别", width: 100 },
      { property: "operationTypeCh", label: "类型", width: 100 },
      { property: "miniFlagCh", label: "是否微创", width: 90 },
      { property: "icdVersionCh", label: "版本", width: 110 },
    ],
  },
  [dtp]: {
    popWidth: 380,
    callBackName: {
      label: "itemName",
      value: "itemCode",
    },
    searchField: "queryParam",
    searchParams: {
      queryParam: "",
      currentPage: 1,
      pageSize: 10,
    },
    apiConfig: {
      method: "get",
      url: "/cpoe/treatFlow/queryAllCli",
    },
    tableColum: [
      { property: "itemCode", label: "项目编码", width: 150 },
      { property: "itemName", label: "项目名称", width: 180 },
    ],
  },
  [xyzd]: {
    popWidth: 500,
    callBackName: {
      label: "diagnosisName",
      value: "diagnosisCode",
    },
    searchField: "queryParam",
    searchParams: {
      queryParam: "",
      isEnable: 1,
    },
    apiConfig: {
      method: "post",
      url: "/bcs/diagnosisDict/pageList",
    },
    tableColum: [
      { property: "diagnosisName", label: "诊断名称" },
      { property: "diagnosisCode", label: "诊断编码" },
    ],
  },
  [zyzd]: {
    popWidth: 500,
    callBackName: {
      label: "tcmDiagnosisName",
      value: "tcmDiagnosisCode",
    },
    searchField: "searchName",
    searchParams: {
      searchName: "",
      isEnable: 1,
    },
    apiConfig: {
      method: "get",
      url: "/bcs/tcmDiagnosisDict/pageList",
    },
    tableColum: [
      { property: "tcmDiagnosisName", label: "诊断名称" },
      { property: "tcmDiagnosisCode", label: "诊断编码" },
    ],
  },
  [zhzd]: {
    popWidth: 400,
    callBackParams: {
      name: "tcmSyndromeTypeName",
      code: "tcmSyndromeTypeCode",
    },
    searchField: "pyCode",
    searchParams: {
      pyCode: "",
      currentPage: 1,
      pageSize: 10,
      isEnable: 1,
    },
    apiConfig: {
      url: "/bcs/ebdTcmSyndromeDict/pageList",
      method: "post",
    },
    tableColum: [
      {
        property: "tcmSyndromeTypeCode",
        field: "tcmSyndromeTypeCode",
        title: "症候编码",
        label: "症候编码",
      },
      {
        property: "tcmSyndromeTypeName",
        field: "tcmSyndromeTypeName",
        title: "症候名称",
        label: "症候名称",
      },
    ],
  },
  [supplierName]: {
    popWidth: 500,
    callBackName: {
      label: "supplierName",
      value: "supplierSerialNo",
    },
    searchField: "searchName",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      searchName: "",
    },
    apiConfig: {
      method: "get",
      url: "/msc/drugSupplierCatalog/pageList",
    },
    tableColum: [
      { property: "supplierSerialNo", label: "供货商编码" },
      { property: "supplierName", label: "供货商名称" },
    ],
  },
  [queryStrCode]: {
    popWidth: 500,
    callBackName: {
      label: "name",
      value: "code",
    },
    searchField: "queryStr",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryStr: "",
    },
    apiConfig: {
      method: "post",
      url: "/msc/orgFlow/listOtherOrgFlow",
    },
    tableColum: [
      { property: "code", label: "编码" },
      { property: "name", label: "名称" },
      { property: "sourceDesc", label: "类型" },
    ],
  },
  [dept]: {
    popWidth: 340,
    callBackName: {
      label: "roadOrgCodeStr",
      value: "roadOrgCode",
    },
    searchField: "queryParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryParam: "",
    },
    apiConfig: {
      method: "get",
      url: "/msc/orgFlow/queryRoadOrgCodeByAreaCode",
    },
    tableColum: [
      { property: "roadOrgCode", label: "编码" },
      { property: "roadOrgCodeStr", label: "科室" },
    ],
  },
  [area]: {
    popWidth: 340,
    callBackName: {
      label: "roadAreaCodeStr",
      value: "roadAreaCode",
    },
    // searchField: 'queryParam',
    searchParams: {
      // currentPage: 1,
      // pageSize: 10,
      // queryParam: '',
    },
    apiConfig: {
      method: "get",
      url: "/msc/orgFlow/queryRoadAreaCodeByAreaCode",
    },
    tableColum: [
      { property: "roadAreaCode", label: "编码" },
      { property: "roadAreaCodeStr", label: "院区" },
    ],
  },
  [deptReceiver]: {
    popWidth: 360,
    callBackName: {
      label: "peopleName",
      value: "peopleIdentifier",
    },
    searchField: "dynamicParam",
    searchParams: {
      status: "A", //用户状态(BCS0010) A激活 L锁定 D作废 前端填写A
      workDept: "", //人事科室(当前人员所处的科室)
      workPost: "2", //查询工作岗位，例如1：管理，2：医师，3：护理：4：工程技术，5，药师 =前端填写2
      currentPage: 1,
      pageSize: 10,
      // queryParam: '',
    },
    apiConfig: {
      method: "post",
      url: "/sde/sdeQcRecord/findDocListByOrg",
    },
    tableColum: [
      { property: "peopleName", label: "姓名" },
      { property: "peopleIdentifier", label: "工号", width: 120 },
      { property: "workDeptName", label: "科室" },
    ],
  },
  [insureDisease]: {
    popWidth: 400,
    callBackName: {
      label: "diagName",
      value: "diagCode",
    },
    searchField: "keyWord",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
    },
    apiConfig: {
      method: "get",
      url: "/mis/diseaseMatch/pageListInsureDisease",
    },
    tableColum: [
      { property: "diagName", label: "诊断名称" },
      { property: "diagCode", label: "诊断编码", width: 150 },
    ],
  },
  [bedTypeCode]: {
    popWidth: 400,
    callBackName: {
      label: "bedTypeName",
      value: "bedTypeCode",
    },
    searchField: "param",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      type: "0",
      param: "",
      isEnable: "",
    },
    apiConfig: {
      method: "post",
      url: "/pix/bedTypeDict/pageList",
    },
    tableColum: [
      { property: "bedTypeName", label: "床位类型", width: 170 },
      { property: "priceTotal", label: "总费用" },
      { property: "priceDetail", label: "费用明细", width: 360 },
    ],
  },
  [personTable3]: {
    popWidth: 390,
    callBackName: {
      label: "peopleName",
      value: "userName",
      isUseValue: true,
    },
    searchField: "dynamicParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      dynamicParam: "",
    },
    apiConfig: {
      method: "post",
      url: "/bup/user/getPageUsers",
    },
    tableColum: [
      { property: "peopleName", label: "姓名", width: "100" },
      { property: "peopleIdentifier", label: "工号", width: "80" },
      { property: "workDeptName", label: "科室" },
    ],
  },
  [personTable5]: {
    popWidth: 390,
    callBackName: {
      label: "peopleName",
      value: "userName",
      isUseValue: true,
    },
    searchField: "dynamicParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      dynamicParam: "",
    },
    apiConfig: {
      method: "post",
      url: "/bup/user/getPageUsers",
    },
    tableColum: [
      { property: "peopleName", label: "姓名", width: "100" },
      { property: "peopleIdentifier", label: "工号", width: "80" },
      { property: "workDeptName", label: "科室" },
    ],
  },
  [policy]: {
    popWidth: 340,
    callBackName: {
      name: "diseaseSettleName",
      code: "diseasePolicyCode",
    },
    searchField: "keyWord",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      keyWord: "",
    },
    apiConfig: {
      method: "get",
      url: "/mis/dictionary/getPolicy",
    },
    tableColum: [
      { property: "diseasePolicyCode", label: "政策标识编码" },
      { property: "diseaseSettleName", label: "政策标识名称" },
    ],
  },
  [yzxmdz]: {
    callBackParams: {
      code: "clinicId",
      name: "itemName",
    },
    searchField: "queryParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryParam: "",
      materialCode: "",
    },
    apiConfig: {
      method: "get",
      url: "/bcs/clinicComboMaterial/getClinicsByMaterialCode",
    },
    tableColum: [
      {
        field: "itemName",
        property: "itemName",
        label: "诊疗项目名称",
        title: "诊疗项目名称",
        width: 320,
      },
      {
        field: "itemCode",
        property: "itemCode",
        label: "诊疗项目编码",
        title: "诊疗项目编码",
        width: 140,
      },
      {
        field: "itemClassStr",
        property: "itemClassStr",
        label: "诊疗项目分类",
        title: "诊疗项目分类",
        width: 120,
      },
      {
        field: "propertyClassStr",
        property: "propertyClassStr",
        label: "细分类别",
        title: "细分类别",
        width: 90,
      },
      {
        field: "itemUnitStr",
        property: "itemUnitStr",
        label: "单位",
        title: "单位",
        width: 90,
      },
    ],
  },
  [lyks]: {
    popWidth: 300,
    callBackName: {
      value: "roadOrgCode",
      label: "roadOrgCodeStr",
    },
    searchField: "queryParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      queryParam: "",
    },
    apiConfig: {
      method: "get",
      url: "/msc/orgFlow/queryRoadOrgCodeByAreaCode",
    },
    tableColum: [
      {
        field: "roadOrgCodeStr",
        property: "roadOrgCodeStr",
        title: "科室名称",
        label: "科室名称",
        width: 100,
      },
    ],
  },
  [patient]: {
    popWidth: 630,
    callBackName: {
      label: "patientName",
      value: "patientId",
    },
    searchField: "inputStr",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      inputStr: "",
    },
    apiConfig: {
      method: "get",
      url: "/pix/patientVisit/findPageForMsc",
    },
    tableColum: [
      {
        property: "patientId",
        label: "患者id",
        width: 120,
      },
      {
        property: "patientName",
        label: "姓名",
        width: 100,
      },
      {
        property: "visitId",
        label: "就诊次数",
        width: 90,
      },
      {
        property: "outpDate",
        label: "就诊日期",
        title: "就诊日期",
        width: 110,
      },
    ],
  },
  [rjsh]: {
    popWidth: 300,
    callBackName: {
      value: "dictCode",
      label: "dictName",
    },
    searchField: "inputStr",
    searchParams: {},
    apiConfig: {
      method: "get",
      url: "/pix/inpOperationDict/findAllByParams",
    },
    tableColum: [
      {
        field: "dictCode",
        property: "dictCode",
        title: "手术编码",
        label: "手术编码",
        width: 100,
      },
      {
        field: "dictName",
        property: "dictName",
        title: "手术名称",
        label: "手术名称",
        width: 100,
      },
    ],
  },
  [personOrg]: {
    popWidth: 390,
    callBackName: {
      name: "peopleName",
      code: "userName",
    },
    searchField: "dynamicParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      dynamicParam: "",
    },
    apiConfig: {
      method: "post",
      url: "/bup/authorize/getHaveContextUserPageByOrg",
    },
    tableColum: [
      { property: "peopleName", label: "姓名", width: "100" },
      { property: "userName", label: "编号", width: "80" },
      { property: "workDeptName", label: "科室" },
    ],
  },
  [personOrg2]: {
    popWidth: 390,
    callBackName: {
      name: "peopleName",
      code: "userName",
    },
    searchField: "dynamicParam",
    searchParams: {
      currentPage: 1,
      pageSize: 10,
      dynamicParam: "",
    },
    apiConfig: {
      method: "get",
      url: "/bup/medicalAction/getHaveRuleAndOrgContextUsersPage",
    },
    tableColum: [
      { property: "peopleName", label: "姓名", width: "100" },
      { property: "userName", label: "编号", width: "80" },
      { property: "workDeptName", label: "科室" },
    ],
  },
  [personSpecial]: {
    popWidth: 460,
    callBackName: {
      label: "doctorName",
      value: "doctorCode",
      isUseValue: true,
    },
    searchField: "queryString",
    searchParams: {
      currentPage: 1,
      pageSize: 100,
      queryString: "",
    },
    noPage: true,
    apiConfig: {
      method: "get",
      url: "/pix/employeeConsultingRoom/findPageForDoctorSelect",
    },
    tableColum: [
      { property: "doctorName", label: "姓名", width: "100" },
      { property: "doctorCode", label: "工号", width: "80" },
      { property: "resideDeptCodeStr", label: "门诊科室" },
      { property: "specialClinicName", label: "门诊专科" },
    ],
  },
};
