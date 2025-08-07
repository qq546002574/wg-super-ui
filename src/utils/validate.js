import XEUtils from "xe-utils";
export const getDaterange = (day, time = true) => {
  const today = XEUtils.toDateString(new Date(), "yyyy-MM-dd");
  const end = `${today}${time ? " 23:59:59" : ""}`;
  const t = XEUtils.getWhatDay(today, -day);
  const start =
    XEUtils.toDateString(t, "yyyy-MM-dd") + (time ? " 00:00:00" : "");
  return [start, end];
};

export function isEmpty(key) {
  if (key === undefined || key === "" || key === null) {
    return true;
  }
  if (typeof key === "string") {
    key = key.replace(/(^\s*)|(\s*$)/g, "");
    if (
      key == "" ||
      key == null ||
      key == "null" ||
      key == undefined ||
      key == "undefined"
    ) {
      return true;
    } else {
      return false;
    }
  } else if (typeof key === "undefined") {
    return true;
  } else if (typeof key == "object") {
    for (let i in key) {
      return false;
    }
    return true;
  } else if (typeof key == "boolean") {
    return false;
  }
}

export const treeToArray = (nodes, childName = "children") => {
  let r = [];
  if (Array.isArray(nodes)) {
    for (let i = 0, l = nodes.length; i < l; i++) {
      r.push(nodes[i]); // 取每项数据放入一个新数组
      if (Array.isArray(nodes[i][childName]) && nodes[i][childName].length > 0)
        // 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
        r = r.concat(treeToArray(nodes[i][childName]));
    }
  }
  return r;
};

// 判断是整数或者小数
export const isNumber = (value) => {
  const reg = /^-?(([1-9]{1}\d*)|(0{1}))(\.\d+)?$/;
  return reg.test(value);
};

// 检查是否添加了重复高值材料
export function checkHighRepeat(list) {
  if (!list || list.length === 0) return false;
  const ar = list.filter((d) => d.isHighValue && +d.isHighValue === 1);
  if (ar.length === 0) return false;
  if (ar.some((item) => !item.barcodeCode)) {
    // 存在高值材料没有barcode情况，校验通过
    return false;
  }
  const set = new Set(ar.map((d) => d.barcodeCode));
  return set.size !== ar.length;
}
