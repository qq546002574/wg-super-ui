<script>
import { getApiCode } from '@/utils/index';
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
      default: ['', '', '', '', ''],
    },
  },
  data() {
    return {
      loading: false,
      dataSource: [],
      dataSourceTmp: [], //用来缓存DataSource的筛选值
      // provinceCode:'',//省
      codeList: ['', '', '', '', ''],
      valueList: ['', '', '', '', ''], //省、市、区、街道、社区
    };
  },
  computed: {
    sortList() {
      if (typeof this.sort === 'function') return this.dataSource.sort(this.sort);
      return this.dataSource;
    },
    provinceList() {
      return this.dataSource.filter((c) => +c.parentId === 0);
    },
    cityList() {
      return this.dataSource.filter((c) => +c.parentId === this.codeList[0]);
    },
    areaList() {
      return this.dataSource.filter((c) => +c.parentId === this.codeList[1]);
    },
    streetList() {
      return this.dataSource.filter((c) => +c.parentId === this.codeList[2]);
    },
    communityList() {
      return this.dataSource.filter((c) => +c.parentId === this.codeList[3]);
    },
  },
  watch: {
    defaultValue(val) {
      if (Array.isArray(val)) {
        this.valueList = val;
        //如果props传过来的值是合规的数组，才开始做初始化值的操作
        for (let i = this.valueList.length; i < 5; i++) {
          this.valueList[i] = '';
        }
        // this.valueList = t.slice();
        let tV = [];
        this.valueList.forEach((c) => {
          let t = this.dataSource.filter((v) => v.itemValue === c);
          let val = t[0]?.itemId || '';
          tV.push(val);
        });
        this.codeList = tV.slice();
      }
    },
  },
  created() {
    this.reqDatas();
  },
  methods: {
    // 获取下拉项
    async reqDatas() {
      this.loading = true;
      const rsp = await getApiCode('GB2260-2007');
      this.loading = false;
      this.dataSource = rsp?.data || [];
      this.dataSourceTmp = [...this.dataSource];
      // console.log("初始化:",this.initValue);
      if (Array.isArray(this.defaultValue)) {
        this.valueList = this.defaultValue;
        //如果props传过来的值是合规的数组，才开始做初始化值的操作
        for (let i = this.valueList.length; i < 5; i++) {
          this.valueList[i] = '';
        }
        // this.valueList = t.slice();
        let tV = [];
        this.valueList.forEach((c) => {
          let t = this.dataSource.filter((v) => v.itemValue === c);
          let val = t[0]?.itemId || '';
          tV.push(val);
        });
        this.codeList = tV.slice();
      }
    },
    clear(){
      const t = ['', '', '', '', ''];
      this.codeList = t.slice();
      this.valueList = t.slice();
    },
    dataFilter(val, type) {
      if (val) {
        //val存在
        const { dataSourceTmp } = this;
        val = val.toUpperCase();
        //对搜索的源数据进行筛选，如果为0的情况，则取市，否则取codeList列表中的级联数据
        let t =
          type > 0
            ? dataSourceTmp.filter((c) => +c.parentId === this.codeList[type - 1])
            : dataSourceTmp.filter((c) => +c.parentId === 0);

        //进一步筛选，判断拼音码、五笔、……
        t = t.filter((item) => {
          const tval = ['label', 'spellCode', 'pyCode', 'wbCode'];
          for (let i = 0; i < tval.length; i++) {
            const index = tval[i];
            if (item[index] && !!~item[index].toUpperCase().indexOf(val)) {
              return true;
            }
          }

          //如果五笔码、拼音码等都没有命中，这里要判断中文value
          if (!!~item.itemName.indexOf(val)) return true;
        });
        console.log("================:",t);
        if(t.length > 0){
          this.dataSource = t.slice();
        }else{
          // this.dataSource = this.dataSourceTmp.slice();
        }
        
      } else {
        //val为空时，还原数组
        this.dataSource = this.dataSourceTmp.slice();
      }
    },
    /**
     * 抛出选择的下拉项完整对象数据
     * @param value
     */
    change(value, type) {
      const index = this.dataSource.findIndex((item) => item.itemValue === value);
      const t = this.dataSource[index];

      for (let index = type; index < 4; index++) {
        //赋值前先清空子联动的值
        this.codeList.splice(index, 1, '');
        this.valueList.splice(index, 1, '');
      }

      this.codeList.splice(type, 1, t.itemId);
      this.valueList.splice(type, 1, value);


      this.dataSource = this.dataSourceTmp.slice();
      
      const tmp = this.valueList.map((c)=>{
        const index = this.dataSource.findIndex((item) => item.itemValue === c);
        return this.dataSource[index];
      });



      this.$emit('selectData', this.valueList, tmp);

      

      // if (index >= 0) {
      //   this.$emit('selectData', t);
      // } else {
      //   this.$emit('selectData', {});
      // }
      // this.dispatch('ElFormItem', 'el.form.change', [value]);
      // this.dispatch('ElFormItem', 'el.form.blur', [value]);
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
    reflsh(v) {
      if (!v) this.dataSource = this.dataSourceTmp.slice(); //选中内容，要还原筛选项目
    },
  },
  render() {
    const { hasDisabled, simple } = this;
    const props = {
      ...this.$attrs,
      ...this.$props,
    };
    const on = {
      ...this.$listeners,
    };
    const json = {
      value: this.valueList,
      placeholder: '省/直辖市',
      loading: this.loading,
      dataFilter: this.dataFilter,
      change: this.change,
      dataSource: this.provinceList,
    };

    const list = [
      {
        ...json,
      },
      {
        ...json,
        disabled: hasDisabled ? (this.cityList.length > 0 ? false : true) : false,
        placeholder: '市',
        dataSource: this.cityList,
      },
      {
        ...json,
        disabled: hasDisabled ? (this.areaList.length > 0 ? false : true) : false,
        placeholder: '区/县',
        dataSource: this.areaList,
      },
      {
        ...json,
        disabled: hasDisabled ? (this.streetList.length > 0 ? false : true) : false,
        placeholder: '乡镇/街道',
        dataSource: this.streetList,
      },
      {
        ...json,
        disabled: hasDisabled ? (this.communityList.length > 0 ? false : true) : false,
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
              {...{ props }}
              {...{ on }}
              disabled={c.disabled}
              placeholder={c.placeholder}
              loading={c.loading}
              value={c.value[i]}
              onvisible-change={this.reflsh}
              filter-method={(v) => {
                c.dataFilter(v, i);
              }}
              onchange={(v) => {
                c.change(v, i);
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
