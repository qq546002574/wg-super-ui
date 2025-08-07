import axios from "axios";
// import externalApp from '@external/index';
import { Message, MessageBox } from "element-ui";
import { isEmpty } from "@/utils/validate";
import { getUrlkey } from "@/utils/index";
import wgFramework from "@/utils/wgFramework";

function getOpt(opt, key) {
  if (opt && opt[key]) {
    return opt[key];
  }
  return {};
}
let isExternal = false;
const getSysInfo = () => {
  let urlParams = getUrlkey(window.location.href);
  isExternal = urlParams.isExternal;

  if (!isExternal) return urlParams;
  return {
    _sys: window.sysInfo && window.sysInfo.systemUri,
    _userId: window.sysInfo && window.sysInfo.userId,
  };
};

let { _token, _sys, _isDev, _userId, _pathCode } = getSysInfo();
class Https {
  constructor(parm) {
    this.baseUrl = parm.baseUrl;
    this.showMessage = parm.showMessage ?? true; // 不弹轻提示消息
    this.messageBox = parm.messageBox ?? false;
    this.http = axios.create({
      timeout: 60000,
    });
    /**
     * 拦截响应数据
     */
    this.http.interceptors.response.use(
      this.interceptResponseSuccess,
      this.interceptResponseFail
    );
  }
  /**
   * 成功响应拦截
   */
  interceptResponseSuccess = (response, rest) => {
    const axiosData = response.data; // 后端返回的数据
    const { code } = axiosData;
    // 不需要弹窗
    if (response.config.noPopup) {
      return response;
    }
    if (code === undefined) {
      // 如果返回的code为undefined可能需要直接返回response
      return response;
    } else if (
      code.indexOf("SYS") !== -1 &&
      axiosData.path !== "/bcs/ump/feedback/save" &&
      axiosData.path !== "/api/bcs/ump/feedback/save" &&
      axiosData.path
    ) {
      const $wgFramework = new wgFramework();
      $wgFramework.showSystemErrorBox(axiosData);
      return response;
    } else {
      // 有 code 代表这是一个后端接口 可以进行进一步的判断
      switch (code) {
        case "xxx":
          // [ 示例 ] 其它和后台约定的 code
          break;
        case "0":
        case "PIX_2001":
        case "BSS-2010":
        case "MSC_1515":
          return response;
        case "BUP-00053":
        case "401":
          // 登录失败，前往重新登录
          MessageBox.alert("登录已过期，请重新登录", "登录过期", {
            confirmButtonText: "确定",
            callback: (action) => {
              window.top.close();
              window.top.open("/");
            },
          });
          break;
        default:
          // 不是正确的 code
          if (
            axiosData.path !== "/bcs/ump/feedback/save" &&
            axiosData.path !== "/api/bcs/ump/feedback/save"
          ) {
            if (this.showMessage) {
              if (this.messageBox) {
                MessageBox.alert("调用出错！", {
                  cancelButtonText: "关闭",
                  showCancelButton: true,
                  showConfirmButton: false,
                  dangerouslyUseHTMLString: true,
                  message: `<div style="color:red;">${axiosData.msg}</div>`,
                  customClass: "width-720",
                  callback: () => {
                    const $wgFramework = new wgFramework();
                    console.log($wgFramework);
                    $wgFramework.disabled(false);
                  },
                });
              } else {
                Message.error(axiosData.msg);
              }
            }
          }
          return response;
          break;
      }
    }
  };
  /*
   * 失败响应拦截
   * */
  interceptResponseFail(error) {
    if (!error) {
      return;
    }
    const errorObj = JSON.parse(JSON.stringify(error));
    const $wgFramework = new wgFramework();
    let errorData;
    const { status, config, message } = errorObj;
    // 不需要弹窗
    if (config.noPopup) {
      return Promise.reject(error);
    }
    if (
      config.url === "/api/bcs/ump/feedback/save" ||
      config.url === "/bcs/ump/feedback/save" ||
      config.url.includes("8848")
    ) {
      return Promise.reject(error);
    }

    if (status) {
      switch (status) {
        case 400:
        case 401:
        case 403:
        case 408:
        case 409:
        case 410:
        case 411:
        case 412:
        case 413:
        case 414:
        case 415:
        case 416:
        case 417:
        case 418:
        case 419:
        case 420:
        case 421:
        case 422:
        case 423:
          errorData = {
            path: config.url,
            msg: "后台微服务无法处理请求参数，联系管理员处理",
            errorMsg:
              "可能的原因为：无效的HTTP请求或者请求参数太大后台微服务无法处理",
          };
          $wgFramework.showSystemErrorBox(errorData);
          break;
        case 404:
          errorData = {
            path: config.url,
            msg: "后台微服务无法处理请求参数，请求的接口不存在. 联系管理员处理",
            errorMsg:
              "可能的原因为：无效的HTTP请求或者请求参数太大后台微服务无法处理",
          };
          $wgFramework.showSystemErrorBox(errorData);
          break;
        case 405:
          errorData = {
            path: config.url,
            msg: "后台微服务无法处理请求参数，请求的HTTP Method不正确. 联系管理员处理",
            errorMsg:
              "可能的原因为：接口的允许的请求方法已改变（如由GET变为POST）",
          };
          $wgFramework.showSystemErrorBox(errorData);
          break;
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
        case 505:
        case 506:
        case 507:
        case 508:
        case 509:
        case 510:
        case 511:
          errorData = {
            path: config.url,
            msg: "访问后台微服务超时，可能服务正在部署,请稍后重试",
          };
          $wgFramework.showSystemErrorBox(errorData);
          break;
        default:
          Message.error("请求发生了错误，请检查请求");
          break;
      }
    } else {
      const errorMsg = {
        msg: "客户端无法访问服务，联系网络管理员处理",
        path: config.url,
        errorMsg: "可能的原因为：网络连接已断开",
      };
      if (config.url !== "http://127.0.0.1:8848") {
        $wgFramework.showSystemErrorBox(errorMsg);
      }
    }
    return Promise.reject(error);
  }
  get(url, ...args) {
    return this.request("get", url, ...args);
  }
  post(url, ...args) {
    return this.request("post", url, ...args);
  }
  delete(url, ...args) {
    return this.request("delete", url, ...args);
  }
  put(url, ...args) {
    return this.request("put", url, ...args);
  }

  requestConfig(type, url, params = {}, opts) {
    // 是否移除所有空值字段 removeEmpty = true 时，移除所有空值字段, 默认只清除undefined的字段
    const removeEmpty = opts?.removeEmpty || false;
    let newParams = this.removeEmptyParam(type, params, removeEmpty);
    let pathCode = null;
    // 如果是第三方登录
    if (isExternal) {
      // 第三方登录 嵌套iframe特殊处理
      if (window.parent && window.parent.sysInfo) {
        _sys = window.parent.sysInfo.systemUri;
        _userId = window.parent.sysInfo.userId;
        pathCode = window.parent.sysInfo.pathCode;
      } else if (window.sysInfo) {
        _sys = window.sysInfo.systemUri;
        _userId = window.sysInfo.userId;
        pathCode = window.sysInfo.pathCode;
      }
    }
    const { token, systemUri, xPreference } = this.getItem(
      _isDev,
      _sys,
      _userId,
      _token
    );
    const $wgFramework = new wgFramework();
    const parentWindowXPreference = encodeURIComponent(
      JSON.stringify($wgFramework.getWindowXPreference())
    );
    const localXPreference = isEmpty(
      encodeURIComponent(JSON.stringify(xPreference))
    )
      ? ""
      : encodeURIComponent(JSON.stringify(xPreference));
    let clientIp = window.top.clientIp;
    let hostMac = window.top.hostMac;
    let requestConfig = {
      url: `${opts?.host || this.baseUrl}${url}`,
      method: type,
      headers: Object.assign(
        {
          "wg-client-ip": clientIp,
          "wg-client-mac": hostMac,
          "Content-Type": "application/json",
          "X-Auth-Token": token,
          systemUri: systemUri,
          "X-Preference":
            parentWindowXPreference === "null"
              ? localXPreference
              : parentWindowXPreference,
          pathCode:
            (window.top &&
              window.top.getActiveTabInfo &&
              window.top.getActiveTabInfo() &&
              window.top.getActiveTabInfo().functionCode) ||
            _pathCode ||
            pathCode ||
            "",
          isExternal,
        },
        getOpt(opts, "header")
      ),
      timeout: opts?.timeout ?? 60 * 1000,
      noPopup: opts?.noPopup ?? false,
    };
    /**get 请求格式设置 */
    if (type === "get") {
      requestConfig.params = this.removeEmptyParam(type, params, true);
    } else {
      requestConfig.data = newParams;
    }
    // 导出格式设置
    if (opts?.isExport) {
      requestConfig.responseType = "blob";
    }
    // console.log('===========> requestConfig', requestConfig);
    return requestConfig;
  }

  exportFile(response) {
    const disposition =
      response.headers["content-disposition"] ||
      response.headers["Content-disposition"]; //获取到带有文件名字的数据
    let name = disposition?.split("filename=")[1]; //获得文件名字

    name = decodeURIComponent(name);
    let url = window.URL.createObjectURL(new Blob([response.data]));
    let aTip = document.createElement("a");
    aTip.href = url;
    document.body.appendChild(aTip);
    aTip.setAttribute("downLoad", name);
    aTip.click();
    aTip.remove();
  }

  request(type, url, params = {}, opts) {
    let config = this.requestConfig(type, url, params, opts);
    return this.http.request(config).then((response) => {
      if (opts?.isExport) {
        this.exportFile(response);
        return false;
      }
      if (response && response.data) {
        const result = response.data;
        return Promise.resolve(result);
      }
      return Promise.reject("请求出错了");
    });
  }

  removeEmptyParam(type, params, removeEmpty = false) {
    if (isEmpty(params) && type === "get") {
      return {};
    } else {
      // 判断是否为对象，数组的情况忽略
      if (Object.prototype.toString.call(params) === "[object Object]") {
        let newParams = {};
        for (let key in params) {
          if (removeEmpty) {
            if (!isEmpty(params[key])) {
              newParams[key] = params[key];
            }
          } else {
            if (typeof params[key] !== "undefined") {
              newParams[key] = params[key];
            }
          }
        }
        return newParams;
      } else {
        return params;
      }
    }
  }
  getItem(isDev, sys, user, token) {
    if (window.localStorage.getItem("systemInfo")) {
      // 不需要token的页面
      let webUrl = window.location.href;
      if (this.whiteListUrl(webUrl)) {
        return {
          token: "",
          systemUri: "",
          xPreference: {},
        };
      }
      // 需要token的页面
      const localSysInfo = JSON.parse(
        window.localStorage.getItem("systemInfo") || {}
      )[`${sys}_${user}`];
      const { token: localStorageToken, xPreference } = localSysInfo || {};
      return {
        token: +isDev === 1 ? token : localStorageToken || "",
        systemUri: sys || "",
        xPreference: xPreference || {},
      };
    }
    return {};
  }
  // token白名单
  whiteListUrl(url) {
    let whiteList = ["hod-ui"];
    let flag = false;
    whiteList.forEach((item) => {
      flag = url.includes(item);
    });
    return flag;
  }
}
export default Https;
