<template>
  <div class="wg-select-wrap">
    <wg-el-select
      v-bind="$attrs"
      filterable
      :filter-method="dataFilter"
      v-on="$listeners"
      :loading="loading"
      @focus="reqDatas"
      @change="change"
    >
      <template v-if="isValueWithName">
        <wg-el-option
          v-for="item in sortList"
          :key="item.value"
          :label="item.label"
          :value="item.value + '|' + item.label"
        ></wg-el-option>
      </template>
      <template v-else>
        <wg-el-option
          v-for="item in sortList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></wg-el-option>
      </template>
    </wg-el-select>
  </div>
</template>
<script>
import ajax from "@/api/http";

export default {
  inheritAttrs: false,
  name: "wgCodeSelect",
  props: {
    // 自定义排序函数 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    // 外部回调函数接收（firstEl:第一个用于比较的元素,secondEl:第二个用于比较的元素）两个参数
    sort: Function,
    config: {
      type: Object,
      required: true,
      default: () => {
        return {
          url: "/bcs/codeTableItem/getcodeTableItemInfoList",
          code: "",
        };
      },
    },
    isValueWithName: {
      type: Boolean,
      default: false,
    },
    /**
     * 缓存数据，不传默认不缓存，传入一个空数组会将下拉列表数据缓存到父组件生命周期存活时的内存中。
     * 使用示例：<wg-select :cache-list.sync="dropsList"></wg-select>
     */
    cacheList: {
      type: Array,
      default: () => [],
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loading: false,
      optionList: [],
      optionListCopy: [],
      optionConfig: {
        url: "",
        method: "get",
        code: "",
        type: "String",
        propDefault: {
          label: "itemName",
          value: "itemValue",
        },
        fixedData: {},
      },
      // 初次请求完成标记状态
      initFlag: false,
    };
  },
  computed: {
    sortList() {
      if (typeof this.sort === "function")
        return this.optionList.sort(this.sort);
      return this.optionList;
    },
  },
  watch: {
    config: {
      /**
       * <wg-select :config="{ code: 'xxxx' }"></wg-select>
       * 不建议这么绑定，会出现一直触发watch事件的bug
       * 推荐绑定定义在data里对象属性  <wg-select :config="config"></wg-select>
       * 添加暴力比对方式
       * @param newVal
       * @param oldVal
       */
      handler: function (newVal, oldVal) {
        if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return;
        // console.log(newVal, oldVal);
        this.initConfig(newVal);
      },
      immediate: true,
    },
  },
  methods: {
    /**初始化 */
    initConfig(newVal) {
      this.optionConfig.code = newVal?.code || "";
      this.optionConfig.method = newVal?.method || "get";
      this.optionConfig.type = newVal?.type || "String";
      this.optionConfig.url =
        newVal?.url || "/bcs/codeTableItem/getcodeTableItemInfoList";

      if (newVal.fixedData) {
        this.optionConfig.fixedData = newVal.fixedData;
      }
      if (newVal.propDefault) {
        this.optionConfig.propDefault = newVal.propDefault;
      }
      this.reqDatas();
    },
    // 获取下拉项
    reqDatas() {
      if (this.optionList.length > 0) {
        return;
      }
      // 如果有缓存数据传入，则直接使用缓存的数据
      if (this.cacheList.length) {
        this.optionList = [...this.cacheList];
        return;
      }
      this.getcodeTableItemInfoListReq();
    },
    // 请求码表
    async getcodeTableItemInfoListReq() {
      this.loading = true;
      let params = {
        standardCode: this.optionConfig.code,
      };
      for (let key in this.optionConfig.fixedData) {
        if (Object.keys(this.optionConfig.fixedData).includes(key)) {
          params[key] = this.optionConfig.fixedData[key];
        }
      }
      let res = await ajax[this.optionConfig.method](
        this.optionConfig.url,
        params
      );
      this.loading = false;
      let { code, data } = res;
      if (+code === 0) {
        let tempOptionList = [];
        data?.forEach((item) => {
          Object.keys(this.optionConfig.propDefault)?.forEach((key) => {
            let itemVal = item[this.optionConfig.propDefault[key]] || "";
            if (
              key == "value" &&
              !Number.isNaN(Number(itemVal)) &&
              (this.optionConfig.type === "Number" ||
                this.optionConfig.type === "number")
            ) {
              item[key] = Number(itemVal);
            } else {
              item[key] = itemVal;
            }
          });
          tempOptionList.push(item);
        });

        this.optionList = tempOptionList;
        // 缓存数据处理
        this.setCacheList(tempOptionList);
        this.optionListCopy = JSON.parse(JSON.stringify(tempOptionList));
        //
        //
        // 初始化完成事件
        if (this.initFlag) return;
        this.initFlag = true;
        this.$emit("init", this.optionList);
      }
    },
    dataFilter(val, data) {
      this.value = val;

      if (val) {
        //val存在
        this.optionList = this.optionListCopy.filter((item) => {
          if (
            item.label &&
            !!~item.label.toUpperCase().indexOf(val.toUpperCase())
          ) {
            return true;
          } else if (
            item.spellCode &&
            !!~item.spellCode.toUpperCase().indexOf(val.toUpperCase())
          ) {
            return true;
          } else if (
            item.pyCode &&
            !!~item.pyCode.toUpperCase().indexOf(val.toUpperCase())
          ) {
            return true;
          } else if (
            item.wbCode &&
            !!~item.wbCode.toUpperCase().indexOf(val.toUpperCase())
          ) {
            return true;
          }
        });
      } else {
        //val为空时，还原数组
        this.optionList = this.optionListCopy;
      }
    },
    /**
     * 抛出选择的下拉项完整对象数据
     * @param value
     */
    change(value) {
      const valueKey = this.optionConfig.propDefault.value;
      const index = this.optionList.findIndex(
        (item) => item?.[valueKey] === value
      );
      if (index >= 0) {
        this.$emit("selectData", this.optionList[index]);
      } else {
        this.$emit("selectData", {});
      }
      this.dispatch("ElFormItem", "el.form.change", [value]);
      this.dispatch("ElFormItem", "el.form.blur", [value]);
    },
    /**
     * 缓存 / 清除缓存数据 不传默认清除
     * @param data
     */
    setCacheList(data = []) {
      this.$emit("update:cacheList", [...data]);
    },
    // 被form表单包裹时，用来触发form的校验方法
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
  },
};
</script>

<style lang="less" scoped>
.wg-select-wrap {
  .el-select {
    width: 100%;
  }
}
</style>
