import http from "@/api/http";

// 获取拥有某一条医疗行为权限的科室列表
export function getHaveRuleUserOrgPage(params) {
  return http.get("/bup/medicalAction/getHaveRuleUserOrgPage", params);
}

// 获取拥有某一条医疗行为权限的用户列表
export function getHaveRuleUsersPage(params) {
  return http.get("/bup/medicalAction/getHaveRuleUsersPage", params);
}

// 获取拥有某一条医疗行为权限的用户拥有权限的科室分页数据
export function getHaveRuleUserHavePermissionOrgPage(params) {
  return http.get(
    "/bup/medicalAction/getHaveRuleUserHavePermissionOrgPage",
    params
  );
}

// 查询工作站授权科室
export function queryAuthOrgBySys(params) {
  return http.get("/bup/authorize/queryAuthOrgBySys", params);
}
