<script>
import { getCascadeCode } from '@/utils';
import { isEmpty } from '@/utils/validate';
export default {
  name: 'wgAreaCascader',
  props: {
    simple: Boolean,
    hasDisabled: {
      type: Boolean,
      default: true,
    },
    defaultValue: {
      type: Array,
      default: ()=>{
        return ['', '', '', '', ''];
      },
    },
    hasAutoFoucs: { // 是否自动聚焦和回车默认选中第一个
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      loading: false,
      valueList: ['', '', '', '', ''], //省、市、区、街道、社区对应的itemValue
      listDataArr: [[],[],[],[],[]], // 省、市、区、街道、社区合集
      initChangeFlag: false, // 当切换过下拉之后不在去请求reqDatas方法
    };
  },
  computed: {
    provinceList() {
      return this.listDataArr[0];
    },
    cityList() {
      return this.listDataArr[1];
    },
    areaList() {
      return this.listDataArr[2];
    },
    streetList() {
      return this.listDataArr[3];
    },
    communityList() {
      return this.listDataArr[4];
    },
  },
  watch: {
    defaultValue: {
      handler(val) {
        if (!val[0]) {
					this.clear();//切换的时候，如果default-value为空，清空组件选项。
					// return;
				}
        this.initChangeFlag = false;
        this.reqDatas();
      },
      immediate: true,
    },
  },
  async created() {
    // await this.reqDatas();
  },
  methods: {
    deBonce(fn, timeout) {
      clearTimeout(this.deBonce.timeID);
      this.deBonce.timeID = setTimeout(fn, timeout);
    },
    // 模糊搜索
    async dataFilter(value, type) {
      this.deBonce(async() => {
        const map ={
          queryParam: value,
          itemValue: type !== 0 ? this.valueList[type-1] : '',
        };
        const { data } = await getCascadeCode(map);
        const listData = data;
        if (listData.length !== 0) {
          this.listDataArr.splice(type, 1, listData);
        }
      }, 500);
    },
    // 获取下拉项
    async reqDatas() {
      if (this.initChangeFlag) return;
      this.loading = true;
      let params = '';
      if (this.defaultValue[0]) { // 有初始值的时候
        params = {itemValueList: (this.defaultValue).toString()};
      }
      const {data} = await getCascadeCode(params);
      this.loading = false;
      if (this.defaultValue[0]) { // 有初始值的情况对应的省市区等数据
        data.forEach((item, index)=>{
          this.listDataArr.splice(index, 1, [item]);
        })
        this.valueList = this.defaultValue;
      } else { // 省
        this.listDataArr.splice(0, 1, data);
      }
    },
    clear(){
      const t = ['', '', '', '', ''];
      this.valueList = t.slice();
      this.listDataArr = [[],[],[],[],[]];
    },
    // 有初始值的时候，点击请求相应的数据
    async focus(event, type) {
      let selectData = [];
      if (type === 0) { // 获取省份下拉数据
        const { data } = await getCascadeCode();
        selectData = data;
      } else {
        // 获取上一级的itemValue
        const list = this.listDataArr[type-1];
        const index = list.findIndex(item=>item.itemValue === this.valueList[type-1]);
        // 渲染当前下拉数据
        const { data } = await getCascadeCode({itemValue: list[index].itemValue});
        selectData = data;
      }
      this.listDataArr.splice(type, 1, selectData);
      // 默认悬浮第一个选项，回车的时候根据hoverIndex选中
      if (this.hasAutoFoucs) {
        this.$nextTick(()=>{
          this.$refs[`refs${type}`].hoverIndex = 0;
        })
      }
    },
    autoFocusFun(type) {
      // 聚焦下一级自动弹出下一级的下拉框
      if (((this.simple && type !== 2) || !this.simple) && this.hasAutoFoucs) {
        this.$nextTick(()=>{
          this.$refs[`refs${type + 1}`].focus();
        })
      }
      // hasAutoFoucs 为false，抛出去让使用者自己去处理聚焦和聚焦后的事件
      if (!this.hasAutoFoucs) {
        const map = {
          areaCascaderType: type, // 当前操作
          refsName: `refs${type + 1}`, // 下一级的refsName
          allData: this.listDataArr, // 省市区所有的选项数据
          valueList: this.valueList, // 当前选中的省市区值
        }
        this.$emit('dataChange', map)
      }
    },
    /**
     * 抛出选择的下拉项完整对象数据
     * @param value
     */
    async change(value, type) {
      this.initChangeFlag = true;
      //赋值前先清空子联动的值
      for (let index = type; index < 5; index++) {
        this.valueList.splice(index, 1, '');
        if (index !==4) {
          this.listDataArr.splice(index+1, 1, []);
        }
      }
      // 获取下一级的数据,若是社区或者重置就不再请求
      let listData = [];
      if (type !== 4 && value) {
        const { data } = await getCascadeCode({itemValue: value});
        listData = data;
      }
      // 回显相应的下拉和下一级的数据
      this.valueList.splice(type, 1, value);
      if (type !==4) {
        this.listDataArr.splice(type + 1, 1, listData);
        // 聚焦下一级自动弹出下一级的下拉框
        this.autoFocusFun(type);
      }
      // 获取当前下拉的选中数据
      const tmp = this.listDataArr[type].filter((item) => item.itemValue === value);
      this.$emit('selectData', this.valueList, tmp);
    },
  },
  render() {
    const { hasDisabled, simple } = this;
    const props = {
      ...this.$attrs,
      ...this.$props,
      remote: true,
    };
    const on = {
      ...this.$listeners,
    };
    const json = {
      value: this.valueList,
      placeholder: '省/直辖市',
      loading: this.loading,
      change: this.change,
      focus: this.focus,
      dataFilter: this.dataFilter,
      dataSource: this.provinceList,
    };

    const list = [
      {
        ...json,
      },
      {
        ...json,
        disabled: hasDisabled ? ((!isEmpty(this.valueList[0]) ||this.cityList.length > 0) ? false : true) : false,
        placeholder: '市',
        dataSource: this.cityList,
      },
      {
        ...json,
        disabled: hasDisabled ? ((!isEmpty(this.valueList[1]) || this.areaList.length > 0) ? false : true) : false,
        placeholder: '区/县',
        dataSource: this.areaList,
      },
      {
        ...json,
        disabled: hasDisabled ? ((!isEmpty(this.valueList[2]) ||this.streetList.length > 0) ? false : true) : false,
        placeholder: '乡镇/街道',
        dataSource: this.streetList,
      },
      {
        ...json,
        disabled: hasDisabled ? ((!isEmpty(this.valueList[3]) ||this.communityList.length > 0) ? false : true) : false,
        placeholder: '村委会/社区',
        dataSource: this.communityList,
      },
    ];
    if (simple) {
      //简单模式下，只显示省市区
      list.splice(3, 2);
    }

    const jsx = (t) => {
      return t.map((item) => {
        <wg-el-option key={item.itemValue} label={item.itemName} value={item.itemValue} />;
      });
    };
    return (
      <div class="wg-cascader">
        {list.map((c, i) => {
          return (
            <wg-el-select
              ref={`refs${i}`}
              {...{ props }}
              {...{ on }}
              disabled={c.disabled}
              placeholder={c.placeholder}
              loading={c.loading}
              value={c.value[i]}
              remote-method={(v) => {
                c.dataFilter(v, i);
              }}
              onchange={(v) => {
                c.change(v, i);
              }}
              onfocus={(v) => {
                c.focus(v, i);
              }}
            >
              {c.dataSource.map((item) => {
                return <wg-el-option key={item.itemValue} label={item.itemName} value={item.itemValue} />;
              })}
            </wg-el-select>
          );
        })}
        {this.$slots.input}
      </div>
    );
  },
};
</script>

<style lang="less" scoped>
@import './main.less';
</style>
