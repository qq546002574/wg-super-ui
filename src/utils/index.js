import http from "../api/http";
import { formatDate, fmoney, formatMoney, formatCurrency } from "./filters";

/**
 * 获取url params
 * @param string
 */
export function getUrlkey(url) {
  let params = {};
  let urls = url.split("?");
  if (urls[1]) {
    let arr = urls[1].split("&");
    for (var i = 0, l = arr.length; i < l; i++) {
      var a = arr[i].split("=");
      params[a[0]] = a[1];
    }
    return params;
  } else {
    return {};
  }
}

/**
 * 获取省市区数据
 * @param
 */
export function getCascadeCode(params) {
  return new Promise((resolve) => {
    http
      .get("/bcs/codeTableItem/getCascadeCodeTableItems", params)
      .then((res) => {
        resolve({
          data: res.data,
        });
      });
  });
}

/**
 * 获取码表
 * @param
 */
export function getApiCode(standardCode) {
  return new Promise((resolve) => {
    http
      .get("/bcs/codeTableItem/getcodeTableItemInfoList", {
        standardCode,
      })
      .then((res) => {
        resolve({
          data: res.data,
        });
      });
  });
}

/**
 * 查询日期公共组件配置
 * @param {String} pathCode 菜单编码
 */
export const getMenuDateRange = (params) =>
  http.get("/bcs/param/getMenuDateRange", params);

//药品基本信息查询接口 去除api
export const findDrugBaseInfoByPage = (params) =>
  http.get("/msc/drugBaseInfo/findBaseInfoByParams", params);

// 获取频次字典 去除api
export function getFrequencyDict() {
  return http.get("/cpoe/frequencyDict/getListEnabledFrequencyDict");
}

/**
 * 获取drugCheckTableConfig数据
 * @param
 */
export function getDrugCheckTableConfig(params) {
  return new Promise((resolve) => {
    http.get("/bcs/customTable/getConfig", params).then((res) => {
      resolve({
        data: res.data,
      });
    });
  });
}

/**
 * 获取drugCheckTable 拖拽触发保存数据
 * @param
 */
export function saveDrugCheckTableData(params) {
  return new Promise((resolve) => {
    http.post("/bcs/customTable/save", params).then((res) => {
      resolve({
        data: res.data,
      });
    });
  });
}

// 床位字典及状态分页接口
export function bedAndRecordList(params) {
  return http.post("/pix/bedDict/bedAndRecordList", params);
}

// 获取年龄
export function getBirth(params) {
  return http.get("/bcs/time/getAgeString", params);
}

export function getClinicItemPageList(params) {
  return http.post("/bcs/clinicItem/pageList", params);
}

/**
 * 获取价表数据
 * @param {String} pathCode 菜单编码
 */
export const getpriceList = (params) =>
  http.get("/bcs/clinicPrice/priceList", params);

export default {
  formatMoney,
  formatCurrency,
  fmoney,
  formatDate,
};

/**
 * 获取医生列表
 * @param {*} standardCode
 * @returns
 */
export function getPageUsers(params) {
  return http.post("/bup/user/getPageUsers", params);
  // return new Promise((resolve) => {
  //   http.post('/bup/user/getPageUsers', params).then(res => {
  //     resolve({
  //       data: res.data,
  //     })
  //   })
  // })
}

//科室名称查询带分页
export const getPageOrg = (params) =>
  http.get("/bcs/api/organization/getPageOrg", params);

//医疗机构名称查询
export const getPageMedInst = (params) =>
  http.get("/bcs/bcsMedInst/pageList", params);

//院区名称查询
export const getPageHospitalArea = (params) =>
  http.get("/bcs/hospitalArea/pageList", params);

//以所在院区查询所有往来院区编码
export const queryRoadAreaCodeByAreaCode = (params) =>
  http.get("/msc/orgFlow/queryRoadAreaCodeByAreaCode", params);

//以所在院区查询所有往来科室编码
export const queryRoadOrgCodeByAreaCode = (params) =>
  http.get("/msc/orgFlow/queryRoadOrgCodeByAreaCode", params);
// export default {
// 	getUrlkey,
// 	getCascadeCode,
// }
