<template>
  <div class="wg-code-select-wrap">
    <wg-el-select
      ref="codeSelectRef"
      v-bind="$attrs"
      v-on="$listeners"
      v-loading="loading"
      :filter-method="dataFilter"
      @visible-change="reflsh"
      @change="change"
    >
      <wg-el-option
        v-for="item in sortList"
        :key="item.itemValue"
        :label="item.itemName"
        :value="item.itemValue"
        :disabled="item.disabled"
      ></wg-el-option>
    </wg-el-select>
  </div>
</template>
<script>
import { getApiCode } from "@/utils";
import { isEmpty } from "@/utils/validate";
export default {
  name: "wgCodeSelect",
  props: {
    // 自定义排序函数 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    // 外部回调函数接收（firstEl:第一个用于比较的元素,secondEl:第二个用于比较的元素）两个参数
    sort: Function,
    // 自定义数据处理
    filter: Function,
    data: {
      type: Array,
      default: () => [],
    },
    autoLoad: {
      type: Boolean, // 是否初始化的时候自动加载数据，默认会加载
      default: true,
    },
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
    filterIds: Array,
  },
  data() {
    return {
      loading: false,
      initData: [],
      dataSource: [],
      dataSourceTmp: [], //用来缓存DataSource的筛选值
      standardCode: "", //码表编码
      filterCodes: [], // 码表过滤
    };
  },
  computed: {
    sortList() {
      if (typeof this.sort === "function")
        return this.dataSource.sort(this.sort);
      return this.dataSource;
    },
  },
  watch: {
    config: {
      /**
       * <wg-code-select :config="{ code: 'xxxx' }"></wg-code-select>
       * 不建议这么绑定，会出现一直触发watch事件的bug
       * 推荐绑定定义在data里对象属性  <wg-code-select :config="config"></wg-code-select>
       * 添加暴力比对方式
       * @param newVal
       * @param oldVal
       */
      handler: function (newVal, oldVal) {
        if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return;
        this.standardCode = newVal?.code || "";
        this.initConfig();
      },
      immediate: true,
    },
    filterIds: {
      handler(v) {
        if (v) {
          if (v.length === 0) return;
          this.filterCodes = v;
          this.filterData();
        }
      },
      immediate: true,
    },
    data: {
      handler(v) {
        if (v) {
          this.initData = v;
          this.filterData();
        }
      },
      immediate: true,
    },
  },
  methods: {
    focus() {
      this.$refs.codeSelectRef.focus();
      this.$refs.codeSelectRef.visible = true;
    },
    /**初始化 */
    initConfig() {
      if (this.data.length > 1) {
        this.initData = this.data;
        this.filterData();
        return;
      } // 外部传入数据，不需要进行远程数据的拉取
      if (this.autoLoad) this.reqDatas();
    },
    reqDatasFormCache(standardCode) {
      let self = this;
      if (isEmpty(window.codeTimer)) window.codeTimer = {};
      const codeTimer = setInterval(() => {
        const index = window.codeData.findIndex((c) => c.code === standardCode);
        if (index > -1) {
          self.loading = false;
          clearInterval(codeTimer);
          self.initData = window.codeData[index].data;
          this.filterData();
        }
      }, 200);
    },
    // 获取下拉项
    async reqDatas() {
      this.loading = true;
      if (isEmpty(window.codeSelectArr)) window.codeSelectArr = [];
      if (isEmpty(window.codeData)) window.codeData = [];
      const t = window.codeSelectArr.findIndex((c) => c === this.standardCode);
      if (t > -1) {
        this.reqDatasFormCache(this.standardCode);
        return;
      }
      window.codeSelectArr.push(this.standardCode);
      const rsp = await getApiCode(this.standardCode);
      this.loading = false;
      this.initData = rsp?.data || [];
      window.codeData.push({
        code: this.standardCode,
        data: rsp?.data || [],
      });
      this.filterData();
    },
    filterData() {
      let data = this.initData;
      // 过滤下拉选项
      if (this.filterCodes.length > 0) {
        data = this.initData.filter((item) =>
          this.filterCodes.includes(item.itemValue)
        );
      }
      /* 过滤码表出现全选 ALL的情况 */
      if (typeof this.filter === "function") {
        this.dataSource = this.filter(data);
      } else {
        this.dataSource = data;
      }
      this.dataSourceTmp = [...this.dataSource];
    },
    dataFilter(val, data) {
      if (val) {
        val = val.toUpperCase();
        //进一步筛选，判断拼音码、五笔、……
        this.dataSource = this.dataSourceTmp.filter((item) => {
          const tval = ["label", "spellCode", "pyCode", "wbCode"];
          for (let i = 0; i < tval.length; i++) {
            const index = tval[i];
            if (item[index] && !!~item[index].toUpperCase().indexOf(val)) {
              return true;
            }
          }

          //如果五笔码、拼音码等都没有命中，这里要判断中文value
          if (!!~item.itemName.indexOf(val)) return true;
        });
      } else {
        //val为空时，还原数组
        this.dataSource = [...this.dataSourceTmp];
      }
    },
    /**
     * 抛出选择的下拉项完整对象数据
     * @param value
     */
    change(value) {
      let selectData;
      if (this.$attrs.multiple === "" || this.$attrs.multiple) {
        // 多选
        // const index = this.dataSource.findIndex((item) => item.itemValue === value);
        selectData = this.dataSource.filter(
          (item) => value.findIndex((c) => c === item.itemValue) > -1
        );
      } else {
        // 单选
        const index = this.dataSource.findIndex(
          (item) => item.itemValue === value
        );
        selectData = index > -1 ? this.dataSource[index] : {};
      }
      this.$emit("selectData", selectData);
    },

    reflsh(v) {
      if (!v) this.dataSource = this.dataSourceTmp.slice(); //选中内容，要还原筛选项目
    },
  },
};
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
