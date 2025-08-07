// 邮箱
export const isEmail = (s) => {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s);
};
//手机
export const isMobile = (s) => {
  return /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(s);
};
//电话
export const isPhone = (s) => {
  return /^0\d{2,3}-?\d{7,8}$/.test(s);
};
//url
export const isURL = (s) => {
  return /^http[s]?:\/\/.*/.test(s);
};
//boolean
export const isBoolean = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Boolean';
};
// 函数
export const isFunction = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Function';
};
//null
export const isNull = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Null';
};
//undifind
export const isUndefined = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Undefined';
};
//obj
export const isObj = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Object';
};
// array
export const isArray = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Array';
};
//date
export const isDate = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Date';
};
//正则
export const isRegExp = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'RegExp';
};
export const isError = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Error';
};
export const isSymbol = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Symbol';
};
export const isPromise = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Promise';
};
export const isSet = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Set';
};
// 微信浏览器
export const isWeiXin = () => {
  return ua.match(/microMessenger/i) == 'micromessenger';
};
// qq浏览器
export const isQQBrowser = () => {
  return !!ua.match(/mqqbrowser|qzone|qqbrowser|qbwebviewtype/i);
};
//移动端
export const isDeviceMobile = () => {
  return /android|webos|iphone|ipod|balckberry/i.test(ua);
};
//爬虫
export const isSpider = () => {
  return /adsbot|googlebot|bingbot|msnbot|yandexbot|baidubot|robot|careerbot|seznambot|bot|baiduspider|jikespider|symantecspider|scannerlwebcrawler|crawler|360spider|sosospider|sogou web sprider|sogou orion spider/.test(
    ua,
  );
};
// ios
export const isIos = () => {
  var u = navigator.userAgent;
  if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
    //安卓手机
    return false;
  } else if (u.indexOf('iPhone') > -1) {
    //苹果手机
    return true;
  } else if (u.indexOf('iPad') > -1) {
    //iPad
    return false;
  } else if (u.indexOf('Windows Phone') > -1) {
    //winphone手机
    return false;
  } else {
    return false;
  }
};
//pc
export const isPC = () => {
  var userAgentInfo = navigator.userAgent;
  var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
};

//去掉html标签
export const removeHtmltag = (str) => {
  return str.replace(/<[^>]+>/g, '');
};

//获取url参数
export const getQueryString = (name) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const search = window.location.search.split('?')[1] || '';
  const r = search.match(reg) || [];
  return r[2];
};

// 动态引入script
export const injectScript = (src) => {
  const s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = src;
  const t = document.getElementsByTagName('script')[0];
  t.parentNode.insertBefore(s, t);
};
// 根据url下载
export const download = (url) => {
  var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  var isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
  if (isChrome || isSafari) {
    var link = document.createElement('a');
    link.href = url;
    if (link.download !== undefined) {
      var fileName = url.substring(url.lastIndexOf('/') + 1, url.length);
      link.download = fileName;
    }
    if (document.createEvent) {
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }
  if (url.indexOf('?') === -1) {
    url += '?download';
  }
  window.open(url, '_self');
  return true;
};
//包含某个class
export const hasClass = (el, className) => {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
};
//添加class
export const addClass = (el, className) => {
  if (hasClass(el, className)) {
    return;
  }
  let newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
};
//删除
export const removeClass = (el, className) => {
  if (!hasClass(el, className)) {
    return;
  }
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
  el.className = el.className.replace(reg, ' ');
};

// 滚动的坐标
export const getScrollPosition = (el = window) => ({
  x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
  y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop,
});

// 滚动到顶部
export const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};

// el是否在视口范围内
export const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};
// 洗牌算法随机
export const shuffle = (arr) => {
  var result = [],
    random;
  while (arr.length > 0) {
    random = Math.floor(Math.random() * arr.length);
    result.push(arr[random]);
    arr.splice(random, 1);
  }
  return result;
};

//劫持粘贴板
export const copyTextToClipboard = (value) => {
  var textArea = document.createElement('textarea');
  textArea.style.background = 'transparent';
  textArea.value = value;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    var successful = document.execCommand('copy');
  } catch (err) {
    console.log('Oops, unable to copy');
  }
  document.body.removeChild(textArea);
};

// 判断类型集合
export const checkStr = (str, type) => {
  switch (type) {
    case 'phone': //手机号码
      return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(str);
    case 'tel': //座机
      return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
    case 'card': //身份证
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
    case 'pwd': //密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
      return /^[a-zA-Z]\w{5,17}$/.test(str);
    case 'postal': //邮政编码
      return /[1-9]\d{5}(?!\d)/.test(str);
    case 'QQ': //QQ号
      return /^[1-9][0-9]{4,9}$/.test(str);
    case 'email': //邮箱
      return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
    case 'money': //金额(小数点2位)
      return /^\d*(?:\.\d{0,2})?$/.test(str);
    case 'URL': //网址
      return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str);
    case 'IP': //IP
      return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str);
    case 'date': //日期时间
      return (
        /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(str) ||
        /^(\d{4})\-(\d{2})\-(\d{2})$/.test(str)
      );
    case 'number': //数字
      return /^[0-9]$/.test(str);
    case 'english': //英文
      return /^[a-zA-Z]+$/.test(str);
    case 'chinese': //中文
      return /^[\\u4E00-\\u9FA5]+$/.test(str);
    case 'lower': //小写
      return /^[a-z]+$/.test(str);
    case 'upper': //大写
      return /^[A-Z]+$/.test(str);
    case 'HTML': //HTML标记
      return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str);
    default:
      return true;
  }
};
// 台湾居民来往大陆通行证
export const isTWCard = (card) => {
  // 规则： 新版8位或18位数字， 旧版10位数字 + 英文字母
  // 样本： 12345678 或 1234567890B
  var reg = /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/;
  if (reg.test(card) === false) {
    console.log('台湾居民来往大陆通行证号码不合规');
    return false;
  } else {
    return true;
  }
};
// 港澳居民来往内地通行证
export const isHKCard = (card) => {
  // 规则： H/M + 10位或6位数字
  // 样本： H1234567890
  var reg = /^([A-Z]\d{6,10}(\(\w{1}\))?)$/;
  if (reg.test(card) === false) {
    console.log('港澳居民来往内地通行证号码不合规');
    return false;
  } else {
    return true;
  }
};
// 护照
export const isPassPortCard = (card) => {
  // 规则： 14/15开头 + 7位数字, G + 8位数字, P + 7位数字, S/D + 7或8位数字,等
  // 样本： 141234567, G12345678, P1234567
  var reg = /^([a-zA-z]|[0-9]){5,17}$/;
  if (reg.test(card) === false) {
    console.log('护照号码不合规');
    return false;
  } else {
    return true;
  }
};
// 军官证
export const isOfficerCard = (card) => {
  // 规则： 军/兵/士/文/职/广/（其他中文） + "字第" + 4到8位字母或数字 + "号"
  // 样本： 军字第2001988号, 士字第P011816X号
  var reg = /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/;
  if (reg.test(card) === false) {
    console.log('军官证号不合规');
    return false;
  } else {
    return true;
  }
};
// 户口本
export const isAccountCard = (card) => {
  // 规则： 15位数字, 18位数字, 17位数字 + X
  // 样本： 441421999707223115
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (reg.test(card) === false) {
    console.log('户口本号码不合规');
    return false;
  } else {
    return true;
  }
};
//校验邮政编码
export const checkPostal = (postalCode) => {
  var reg = /^[0-9]{6}$/;
  if (reg.test(postalCode) === false) {
    return false;
  } else {
    return true;
  }
};
//驾照
export const isDriversLicense = (card) => {
  var reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x|X)$/;
  if (reg.test(card) === false) {
    console.log('驾照号码不合规');
    return false;
  } else {
    return true;
  }
};
//身份证校验
export const isCardID = (sId) => {
  if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(sId)) {
    console.log('你输入的身份证长度或格式错误');
    return false;
  }
  //身份证城市
  var aCity = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外',
  };
  if (!aCity[parseInt(sId.substr(0, 2))]) {
    console.log('你的身份证地区非法');
    return false;
  }

  // 出生日期验证
  var sBirthday = (sId.substr(6, 4) + '-' + Number(sId.substr(10, 2)) + '-' + Number(sId.substr(12, 2))).replace(
      /-/g,
      '/',
    ),
    d = new Date(sBirthday);
  if (sBirthday != d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()) {
    console.log('身份证上的出生日期非法');
    return false;
  }

  // 身份证号码校验
  var sum = 0,
    weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
    codes = '10X98765432';
  for (var i = 0; i < sId.length - 1; i++) {
    sum += sId[i] * weights[i];
  }
  var last = codes[sum % 11]; //计算出来的最后一位身份证号码
  if (sId[sId.length - 1] != last) {
    console.log('你输入的身份证号非法');
    return false;
  }

  return true;
};

//将阿拉伯数字翻译成中文的大写数字

export const numberToChinese = (num) => {
  var AA = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
  var BB = new Array('', '十', '百', '仟', '萬', '億', '点', '');
  var a = ('' + num).replace(/(^0*)/g, '').split('.'),
    k = 0,
    re = '';
  for (var i = a[0].length - 1; i >= 0; i--) {
    switch (k) {
      case 0:
        re = BB[7] + re;
        break;
      case 4:
        if (!new RegExp('0{4}//d{' + (a[0].length - i - 1) + '}$').test(a[0])) re = BB[4] + re;
        break;
      case 8:
        re = BB[5] + re;
        BB[7] = BB[5];
        k = 0;
        break;
    }
    if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
    if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
    k++;
  }

  if (a.length > 1) {
    // 加上小数部分(如果有小数部分)
    re += BB[6];
    for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
  }
  if (re == '一十') re = '十';
  if (re.match(/^一/) && re.length == 3) re = re.replace('一', '');
  return re;
};

//将数字转化为大学金额
export const changeToChinese = (Num) => {
  //判断如果传递进来的不是字符的话转换为字符
  if (typeof Num == 'number') {
    Num = new String(Num);
  }
  Num = Num.replace(/,/g, ''); //替换tomoney()中的“,”
  Num = Num.replace(/ /g, ''); //替换tomoney()中的空格
  Num = Num.replace(/￥/g, ''); //替换掉可能出现的￥字符
  if (isNaN(Num)) {
    //验证输入的字符是否为数字
    //alert("请检查小写金额是否正确");
    return '';
  }
  //字符处理完毕后开始转换，采用前后两部分分别转换
  var part = String(Num).split('.');
  var newchar = '';
  //小数点前进行转化
  for (var i = part[0].length - 1; i >= 0; i--) {
    if (part[0].length > 10) {
      return '';
      //若数量超过拾亿单位，提示
    }
    var tmpnewchar = '';
    var perchar = part[0].charAt(i);
    switch (perchar) {
      case '0':
        tmpnewchar = '零' + tmpnewchar;
        break;
      case '1':
        tmpnewchar = '壹' + tmpnewchar;
        break;
      case '2':
        tmpnewchar = '贰' + tmpnewchar;
        break;
      case '3':
        tmpnewchar = '叁' + tmpnewchar;
        break;
      case '4':
        tmpnewchar = '肆' + tmpnewchar;
        break;
      case '5':
        tmpnewchar = '伍' + tmpnewchar;
        break;
      case '6':
        tmpnewchar = '陆' + tmpnewchar;
        break;
      case '7':
        tmpnewchar = '柒' + tmpnewchar;
        break;
      case '8':
        tmpnewchar = '捌' + tmpnewchar;
        break;
      case '9':
        tmpnewchar = '玖' + tmpnewchar;
        break;
    }
    switch (part[0].length - i - 1) {
      case 0:
        tmpnewchar = tmpnewchar + '元';
        break;
      case 1:
        if (perchar != 0) tmpnewchar = tmpnewchar + '拾';
        break;
      case 2:
        if (perchar != 0) tmpnewchar = tmpnewchar + '佰';
        break;
      case 3:
        if (perchar != 0) tmpnewchar = tmpnewchar + '仟';
        break;
      case 4:
        tmpnewchar = tmpnewchar + '万';
        break;
      case 5:
        if (perchar != 0) tmpnewchar = tmpnewchar + '拾';
        break;
      case 6:
        if (perchar != 0) tmpnewchar = tmpnewchar + '佰';
        break;
      case 7:
        if (perchar != 0) tmpnewchar = tmpnewchar + '仟';
        break;
      case 8:
        tmpnewchar = tmpnewchar + '亿';
        break;
      case 9:
        tmpnewchar = tmpnewchar + '拾';
        break;
    }
    var newchar = tmpnewchar + newchar;
  }
  //小数点之后进行转化
  if (Num.indexOf('.') != -1) {
    if (part[1].length > 2) {
      // alert("小数点之后只能保留两位,系统将自动截断");
      part[1] = part[1].substr(0, 2);
    }
    for (i = 0; i < part[1].length; i++) {
      tmpnewchar = '';
      perchar = part[1].charAt(i);
      switch (perchar) {
        case '0':
          tmpnewchar = '零' + tmpnewchar;
          break;
        case '1':
          tmpnewchar = '壹' + tmpnewchar;
          break;
        case '2':
          tmpnewchar = '贰' + tmpnewchar;
          break;
        case '3':
          tmpnewchar = '叁' + tmpnewchar;
          break;
        case '4':
          tmpnewchar = '肆' + tmpnewchar;
          break;
        case '5':
          tmpnewchar = '伍' + tmpnewchar;
          break;
        case '6':
          tmpnewchar = '陆' + tmpnewchar;
          break;
        case '7':
          tmpnewchar = '柒' + tmpnewchar;
          break;
        case '8':
          tmpnewchar = '捌' + tmpnewchar;
          break;
        case '9':
          tmpnewchar = '玖' + tmpnewchar;
          break;
      }
      if (i == 0) tmpnewchar = tmpnewchar + '角';
      if (i == 1) tmpnewchar = tmpnewchar + '分';
      newchar = newchar + tmpnewchar;
    }
  }
  //替换所有无用汉字
  while (newchar.search('零零') != -1) newchar = newchar.replace('零零', '零');
  newchar = newchar.replace('零亿', '亿');
  newchar = newchar.replace('亿万', '亿');
  newchar = newchar.replace('零万', '万');
  newchar = newchar.replace('零元', '元');
  newchar = newchar.replace('零角', '');
  newchar = newchar.replace('零分', '');
  if (newchar.charAt(newchar.length - 1) == '元') {
    newchar = newchar + '整';
  }
  return newchar;
};

// 求并集
export const union = (a, b) => {
  var newArr = a.concat(b);
  return this.unique(newArr);
};
//求交集
export const intersect = (a, b) => {
  var _this = this;
  a = this.unique(a);
  return this.map(a, function (o) {
    return _this.contains(b, o) ? o : null;
  });
};

//最大
export const max = (arr) => {
  return Math.max.apply(null, arr);
};
//最小值
export const min = (arr) => {
  return Math.min.apply(null, arr);
};
//求和
export const sum = (arr) => {
  return arr.reduce((pre, cur) => {
    return pre + cur;
  });
};
// 求平均
export const average = (arr) => {
  return this.sum(arr) / arr.length;
};

//去空格
export const trim = (str, type) => {
  type = type || 1;
  switch (type) {
    case 1:
      return str.replace(/\s+/g, '');
    case 2:
      return str.replace(/(^\s*)|(\s*$)/g, '');
    case 3:
      return str.replace(/(^\s*)/g, '');
    case 4:
      return str.replace(/(\s*$)/g, '');
    default:
      return str;
  }
};

//字符转换，type: 1:首字母大写 2：首字母小写 3：大小写转换 4：全部大写 5：全部小写
export const changeCase = (str, type) => {
  type = type || 4;
  switch (type) {
    case 1:
      return str.replace(/\b\w+\b/g, function (word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
      });
    case 2:
      return str.replace(/\b\w+\b/g, function (word) {
        return word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase();
      });
    case 3:
      return str
        .split('')
        .map(function (word) {
          if (/[a-z]/.test(word)) {
            return word.toUpperCase();
          } else {
            return word.toLowerCase();
          }
        })
        .join('');
    case 4:
      return str.toUpperCase();
    case 5:
      return str.toLowerCase();
    default:
      return str;
  }
};

//检测密码强度
export const checkPwd = (str) => {
  var Lv = 0;
  if (str.length < 6) {
    return Lv;
  }
  if (/[0-9]/.test(str)) {
    Lv++;
  }
  if (/[a-z]/.test(str)) {
    Lv++;
  }
  if (/[A-Z]/.test(str)) {
    Lv++;
  }
  if (/[\.|-|_]/.test(str)) {
    Lv++;
  }
  return Lv;
};

//对象键值是否相等
export const isObjectEqual = (a, b) => {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  if (aProps.length !== bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
};

//16进制颜色转RGBRGBA字符串
export const colorToRGB = (val, opa) => {
  var pattern = /^(#?)[a-fA-F0-9]{6}$/; //16进制颜色值校验规则
  var isOpa = typeof opa == 'number'; //判断是否有设置不透明度

  if (!pattern.test(val)) {
    //如果值不符合规则返回空字符
    return '';
  }

  var v = val.replace(/#/, ''); //如果有#号先去除#号
  var rgbArr = [];
  var rgbStr = '';

  for (var i = 0; i < 3; i++) {
    var item = v.substring(i * 2, i * 2 + 2);
    var num = parseInt(item, 16);
    rgbArr.push(num);
  }

  rgbStr = rgbArr.join();
  rgbStr = 'rgb' + (isOpa ? 'a' : '') + '(' + rgbStr + (isOpa ? ',' + opa : '') + ')';
  return rgbStr;
};

//追加url参数
export const appendQuery = (url, key, value) => {
  var options = key;
  if (typeof options == 'string') {
    options = {};
    options[key] = value;
  }
  options = $.param(options);
  if (url.includes('?')) {
    url += '&' + options;
  } else {
    url += '?' + options;
  }
  return url;
};

// 金额正则表达式，用于控制输入,小数点后两位
export const amountPattern = /(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?/;
// 金额正则表达式，用于控制输入,小数点后一位
export const amountJiao = /(([1-9]{1}\d*)|(0{1}))(\.\d{0,1})?/;

export default {
  checkStr,
  amountPattern,
	amountJiao
};
