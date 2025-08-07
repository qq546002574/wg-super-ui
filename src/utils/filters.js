/**
 * 时间格式转换过滤器
 * @param {String} val 日期字符串 如：2020-03-04T16:00:00
 * @param {String} joint 日期之间连接符号
 * @param {Number} substr 截取位数 默认19位： 2020-03-04T16:00:00 → 2020-03-04 16:00:00
 * @example {{ date | formatDate('-', 16)}} 2020-03-04T16:00:00 → 2020-03-04 16:00
 */
exports.formatDate = (val, joint = '-', substr = 19) => {
  if (!val) return val;
  let time = new Date(val).getTime(); // 格式化为日期对象 转为时间戳
  let date = new Date(time + 8 * 3600 * 1000); // 格林威治时间，差八个小时。
  try {
    date = date.toJSON().substr(0, substr).replace('T', ' ').replace(/-/g, joint);
  } catch (e) {
    console.error(e);
    return val;
  }
  return date;
};

/**
 * 金额格式化
 * @param {Number} value 带格式化的值
 * @returns {string} 结果 1,234.56
 */
exports.formatAmount = (value) => {
  return (value || 0).toLocaleString('zh', { style: 'decimal' });
};

/**
 *
 * @param {*} value 金额
 * @param {*} decimals 分
 * @returns
 */
const digitsRE = /(\d{3})(?=\d)/g;
exports.fmoney = (value, decimals = 2) => {
  value = parseFloat(value);
  if (!value && value !== 0) return '';
  const stringified = Math.abs(value).toFixed(decimals);
  const $int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  const i = $int.length % 3;
  const head = i > 0 ? $int.slice(0, i) + ($int.length > 3 ? '' : '') : '';
  const $float = decimals ? stringified.slice(-1 - decimals) : '';
  const sign = value < 0 ? '-' : '';
  return `￥${sign}${head}${$int.slice(i).replace(digitsRE, '$1')}${$float}元`;
};

exports.fmoneyNochinese = (value, decimals = 2) => {
  value = parseFloat(value);
  if (!value && value !== 0) return '';
  const stringified = Math.abs(value).toFixed(decimals);
  const $int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  const i = $int.length % 3;
  const head = i > 0 ? $int.slice(0, i) + ($int.length > 3 ? '' : '') : '';
  const $float = decimals ? stringified.slice(-1 - decimals) : '';
  const sign = value < 0 ? '-' : '';
  return `${sign}${head}${$int.slice(i).replace(digitsRE, '$1')}${$float}`;
};

/**
 * 金额按千分位添加逗号
 */
exports.formatMoney = (val, util='', digit=2) => {
  const dotZero = (0.0).toFixed(digit).replace(/0\./g, '');
  if (!val || isNaN(val)) return `${digit > 0 ? `0.${dotZero}` : 0}${util}`;
  const rep = /[\.]/;
  const str = String(
    rep.test(val)
      ? digit > 0
        ? Number(val).toFixed(digit)
        : parseInt(val, 10)
      : digit > 0
      ? `${String(val)}.${dotZero}`
      : val,
  );
  return `${addTHSComma(str)}${util}`; 
};

/**
 * 插入千分位逗号
 */
const addTHSComma = (value )=>{
  const isGreater = Number(value) >= 1000 || Number(value) <= 1000;
  return isGreater ? `${value.replace(/(?<=^\-?(\d)+)(?=(\d{3})+\b)/g, ',')}` : `${value}`;
}


/**
 * 向上取整操作，主要用于金钱里面分值的格式化去除，向前进1
 * @param {*} val
 * @return {Number} 小数点后1位，遇9进1取整
 */
exports.formatCent = (val) => {
  const num = Number(val);
  const strNum = String(num);
  const isFloat = strNum.indexOf('.') === -1;
  if(isFloat) return Number(val);
  const dotIndex = strNum.indexOf('.');
  const twoCountNum = strNum.substring(0, dotIndex + 3);
  const beforeDotNum = twoCountNum.substring(0, dotIndex);
  const dotFirstNum = twoCountNum.substring(dotIndex + 1, dotIndex + 2);
  const dotLastNum = twoCountNum.substring(dotIndex + 2, dotIndex + 3);
  if(Number(dotFirstNum) === 9) return Number(beforeDotNum) + 1;
  if(Number(dotFirstNum) < 9 && Number(dotLastNum) > 0) {
    const newDotFirstNum = Number(dotFirstNum) + 1;
    const newStrNum = `${beforeDotNum}.${String(newDotFirstNum)}`
    return Number(newStrNum);
  }
  if(Number(dotFirstNum) < 9 && Number(dotLastNum) === 0) {
    return Number(twoCountNum.substring(0, dotIndex + 2));
  }
  return Number(val);
};

/**
 * 单价格式化，正整数及2位小数默认千分位加逗号补齐/保留小数字2位，超出2位小数，默认千分位加逗号全量保留小数点后数字
 * @param {*} val
 * @return {string} 
 */
exports.formatPrice = (val) => {
  const num = Number(val);
  const strNum = String(num);
  const isInteger = strNum.indexOf('.') === -1;
  if(isInteger) {
    return this.formatMoney(val);
  } else {
    const dotIndex = strNum.indexOf('.');
    const isMoreLength = strNum.length - dotIndex <= 2;
    return isMoreLength ? this.formatMoney(val, '', 2) : addTHSComma(strNum)
  }
}

/**
 * 价格格式化，正整数及2位小数默认千分位加逗号补齐/保留小数字2位，超出2位小数，默认千分位加逗号全量保留小数点后数字
 * 可配置小数位数
 * 当小数位全是0时，只保留两位
 * @param {*} val
 * @return {string} 
 */
exports.priceFormatting = (val, digit = 2) => {
  if (window.top.digit) {
    digit = window.top.digit;
  }
 
  return this.formatMoney(val,'',digit)
};

/**
 * 四舍五入计算
 * @param {Number} number
 * @param {Number} precision
 * @returns {number}
 */
function round(number, precision) {
  precision = precision || 0;
  return Math.round(+number + 'e' + precision) / Math.pow(10, precision);
}

/**
 * 增强型四舍五入，支持自定义保留位
 * @param {Number} value 值
 * @param {Number} precision  保留位
 * @returns {number}
 */
exports.formatRound = (value, precision) => {
  return round(value, precision);
};

/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
 exports.formatCurrency = (num) => {
  undefined;
  if (Number.isNaN(num) || num === undefined || num === null) num = '0';
  num = num.toString().replace(/[^\d\.-]/g, '');
  var sign = num == (num = Math.abs(num));
  num = Math.floor(num * 100 + 0.50000000001);
  var cents = num % 100;
  cents = cents < 10 ? '0' + cents : cents; //小于2位数就补齐
  num = Math.floor(num / 100).toString();
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
  }
  return (sign ? '' : '-') + num + '.' + cents;
};
exports.convertCurrency=(money)=> {
  //汉字的数字
  let cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
  //基本单位
  let cnIntRadice = new Array('', '拾', '佰', '仟');
  //对应整数部分扩展单位
  let cnIntUnits = new Array('', '万', '亿', '兆');
  //对应小数部分单位
  let cnDecUnits = new Array('角', '分', '毫', '厘');
  //整数金额时后面跟的字符
  let cnInteger = '整';
  //整型完以后的单位
  let cnIntLast = '元';
  //最大处理的数字
  let maxNum = 999999999999999.9999;
  //金额整数部分
  let integerNum;
  //金额小数部分
  let decimalNum;
  //输出的中文金额字符串
  let chineseStr = '';
  //分离金额后用的数组，预定义
  let parts;
  // 传入的参数为空情况
  if(money == '') {
    return '';
  }
  money = parseFloat(money)
  if(money >= maxNum){
    return ''
  }
  // 传入的参数为0情况
  if(money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr
  }
  // 转为字符串
  money = money.toString();
  // indexOf 检测某字符在字符串中首次出现的位置 返回索引值（从0 开始） -1 代表无
  if(money.indexOf('.') == -1){
    integerNum = money;
    decimalNum = ''
  }else{
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0,4);
  }
  //转换整数部分
  if(parseInt(integerNum,10) > 0){
    let zeroCount  = 0;
    let IntLen = integerNum.length
    for(let i = 0; i < IntLen; i++){
      let n = integerNum.substr(i,1);
      let p = IntLen - i - 1;
      let q = p / 4;
      let m = p % 4;
      if( n == '0'){
        zeroCount ++ ;
      }else{
        if(zeroCount > 0){
          chineseStr += cnNums[0]
        }
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if(m == 0 && zeroCount < 4){
        chineseStr += cnIntUnits[q];
      }
    }
    // 最后+ 元
    chineseStr += cnIntLast;
  }
  // 转换小数部分
  if(decimalNum != ''){
    let decLen = decimalNum.length;
    for(let i = 0; i <decLen; i++){
      let n = decimalNum.substr(i,1);
      if(n != '0'){
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if(chineseStr == ''){
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  }else if(decimalNum == ''){
    chineseStr += cnInteger;
  }

  return chineseStr
}
