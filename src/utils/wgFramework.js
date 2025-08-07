import { getUrlkey } from "@/utils/index";

const urlParmas = getUrlkey(decodeURIComponent(window.location.href));
const { isExternal } = urlParmas;
export default class wgFramework {
  constructor() {
    this.frameWindow = isExternal ? window.WGFKAPI : window.top;
  }
  /**
   * 禁用操作：主要场景在弹窗时候需要禁用顶部菜单栏，底部页签，iframe页面控制框架层操作
   * @pramas {Boolean} val : true：禁用，false：解禁
   */
  async setHasPageLeave(fn) {
    if (!this.frameWindow || +isExternal === 1) return;
    this.frameWindow.setHasPageLeave(fn);
  }
  disabled(val = false) {
    if (!this.frameWindow || !this.frameWindow.frameworkDisabled) return;
    this.frameWindow.frameworkDisabled(val);
    window.isDialog = val;
  }
  /**
   * 获取当前菜单的路由信息
   * @return {Object} 当前展示的菜单详情数据
   */
  getActiveTabInfo() {
    if (!this.frameWindow) return;
    return isExternal
      ? this.frameWindow.activeFunction
      : this.frameWindow.getActiveTabInfo();
  }
  /**
   * 跳转到当前工作站其他tab菜单
   * @param {string} path 要跳转的路径 eg. "/bup/sysConfig"
   * @param {Object} params 要带的参数
   */
  navigateToUrl(path, params) {
    if (!this.frameWindow) return;
    this.frameWindow.navigateToUrl(path, params);
  }
  /**
   * 关闭标签页，根据传入的path关闭指定的标签，如果不传则默认关闭当前活动的tab
   * @param {string} path 非必传 要关闭的页签路径 eg. "/bup/sysConfig"
   */
  closeTab(path = "") {
    if (!this.frameWindow) return;
    this.frameWindow.closeTab(path);
  }
  /**
   * 获取当前页面配置的参数
   */
  async getPathParams() {
    if (!this.frameWindow) return;
    return await this.frameWindow.getFunctionItemsByFunCode();
  }
  /**
   * 关闭当前systembox窗口
   */
  closeSystemBox(action) {
    if (!this.frameWindow) return;
    this.frameWindow.closeSystembox(action);
  }
  /**
   * 展示系统错误弹窗
   */
  async showSystemErrorBox(param) {
    if (!this.frameWindow) return;
    this.frameWindow.showSystemErrorBox(param);
  }
  /**
   * print批量打印操作,主要用于循环调用打印
   * @param {Array} businessDataList: xmlAttribute: 模板属性参数集 queryParams: 查询参数集 dataMaps: 数据源参数集
   */
  async batchPrint(businessDataList = []) {
    if (!this.frameWindow) return;
    return await this.frameWindow.cse.handleBatchPrint(businessDataList);
  }
  /**
   * print批量打印操作
   * @param {Array} businessDataList: xmlAttribute: 模板属性参数集 queryParams: 查询参数集 dataMaps: 数据源参数集
   */
  async print(businessDataList = []) {
    if (!this.frameWindow) return;
    return await this.frameWindow.cse.handlePrint(businessDataList);
  }

  /**
   * preview批量预览
   * @param {Array} businessDataList: xmlAttribute: 模板属性参数集 queryParams: 查询参数集 dataMaps: 数据源参数集
   */
  async preview(businessDataList = []) {
    if (!this.frameWindow) return;
    return await this.frameWindow.cse.handlePreview(businessDataList);
  }

  /**
   * 主动发起加载电子电子病历必须的字体文件
   * @returns
   */
  preLoadFontData() {
    if (!this.frameWindow) return;
    this.frameWindow.preLoadFontData();
  }

  /**
   * 刷卡
   */
  async readCard(args) {
    if (!this.frameWindow) return;
    return this.frameWindow.cse.readCardInfo(args);
  }

  /**
   * 调用frameowrk弹窗
   */
  systemIframeDialog(url, options) {
    if (!this.frameWindow) return;
    this.frameWindow.systemDialog(url, options);
  }

  /**
   * print打印PDF
   * @param {object} base64: 需要打印的PDFbase64 数据流
   */
  async printPDF(base64) {
    if (!this.frameWindow) return;
    return this.frameWindow.cse.handlePrintPDF(base64);
  }

  /**
   * 获取电脑本地IP地址
   */
  async getHostIp() {
    if (!this.frameWindow) return;
    return await this.frameWindow.getHostIp();
  }

  /**
   * 判断是否是菜单容器
   */
  getIsMenuContainer() {
    if (!this.frameWindow) return;
    return this.frameWindow.getIsMenuContainer();
  }

  /**
   * 跳转URL
   * @param {string} type url打开方式 eg. "OPEN_TAB" ｜ "WINDOW_TAB" | "CROSS_TAB"
   * @param {string} path 要打开的路径地址 eg. "/bup-ui/sysConfig"
   * @param {object} options 可扩展配置项预留，比如要携带的参数，要跳转的系统标识 eg. { params:{ a: "bbbb"}, sysUri: 'BUP'}
   */
  async openURL(type, path, options) {
    if (!this.frameWindow) return;
    return await this.frameWindow.openURL(type, path, options);
  }

  /**
   *
   * @param {boolean} type 是否全屏
   * @returns
   */
  fullScreen(type) {
    if (!this.frameWindow) return;
    this.frameWindow.fullScreen(type);
  }

  /**
   * 获取当前框架的首选项配置
   */
  getWindowXPreference() {
    if (!this.frameWindow || !this.frameWindow.xPreference) return null;
    // return this.frameWindow.xPreference || null;
    /**
     * 赵宇龙 2023.2.6日修改
     * 修改原因：直接return window.top对象下的对象，会造成造成window.top内存无法回收
     * */
    try {
      return JSON.parse(JSON.stringify(this.frameWindow.xPreference));
    } catch (e) {
      console.error(
        `[getWindowXPreference报错：]${
          e.message
        }；报错类型为：${Object.prototype.toString.call(
          this.frameWindow && this.frameWindow.xPreference
        )}`
      );
      return null;
    }
  }

  /**
   * 读卡器相关的方法
   */
  cardReader(type, args) {
    if (!this.frameWindow) return;
    return this.frameWindow.cse.cardReader(type, args);
  }

  /**
   * 应用服务流程
   */
  appUniversal(type, args) {
    if (!this.frameWindow) return;
    return this.frameWindow.cse.appUniversal(type, args);
  }

  /**
   * 根据pathCode进行跳转
   */
  navigateToPathCode(pathCode, params) {
    if (!this.frameWindow) return;
    this.frameWindow.navigateToPathCode(pathCode, params);
  }

  /**
   * 判断是否存在可以跳转的地址
   */
  navigatorCheck(path, module) {
    if (!this.frameWindow) return;
    return this.frameWindow.navigatorCheck(path, module);
  }

  /**
   * 获取模版打印前的打印配置
   */
  async getXmlmdMouldPrintConfig(code) {
    if (!this.frameWindow) return;
    return await this.frameWindow.getXmlmdMouldPrintConfig(code);
  }

  /**
   * 显示隐藏框架顶层的dialog
   */
  topDialog(active, params) {
    if (!this.frameWindow) return;
    this.frameWindow.topDialog(active, params);
  }
  /**
   * 框架级别的proDialog
   */
  wgProDialog(params) {
    if (!this.frameWindow) return;
    this.frameWindow.proDialog(params);
  }
  /**
   * 验证是否可以自动打印
   */
  async printAutoCheck(params) {
    if (!this.frameWindow) return;
    return await this.frameWindow.cse.printAutoCheck(params);
  }
  /**
   * 设置菜单容器缓存数据
   */
  async setMenuLocalStore(params) {
    if (!this.frameWindow) return;
    // 只在菜单容器中生效
    const isMenuContainer =
      this.frameWindow.location.pathname.includes("menuContainer");
    if (this.frameWindow.location.pathname.includes("menuContainer"))
      this.frameWindow.menuLocalStore = isMenuContainer ? params : null;
  }
  /**
   * 获取当前菜单容器的数据
   */
  getMenuLocalStore() {
    if (!this.frameWindow) return null;
    return this.frameWindow.menuLocalStore;
  }
  /**
   * 顶层message弹窗
   */
  sysMessage(params) {
    if (!this.frameWindow) return;
    this.frameWindow.sysMessage(params);
  }
}
