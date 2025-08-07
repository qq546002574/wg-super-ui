<script>
import { getCascadeCode } from '@/utils';
import { isEmpty } from '@/utils/validate';
export default {
  name: 'wgAreaCascaderCheck',
  props: {
    simple: Boolean,
    // 显示几级
    cascaderLayer: String,
    defaultDisabled: {
      type: Array,
      default: ()=>{
        return [false, false, false, false, false];
      },
    },
    disabled: {
      type: Boolean,
      default: false,
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
  model: {
    event: 'updateData',
    prop: 'defaultValue',
  },
  data() {
    return {
      loading: false,
      valueList: ['', '', '', '', ''], //省、市、区、街道、社区对应的itemValue
      itemNameList: ['', '', '', '', ''], //省、市、区、街道、社区对应的中文名
      cascaderFlag: false,
      dataSource: [],
      areaType: 0,
      initChangeFlag: false, // 当切换过下拉之后不在去请求reqDatas方法
      // 键盘事件相关属性
      dataRow: '', // 当前已选择行
      hoverIndex: 0, // 当前选择行的index
    };
  },
  computed: {
  },
  watch: {
    defaultValue: {
      handler(val) {
        if (!val[0]) {
					this.clear();//切换的时候，如果default-value为空，清空组件选项。
					return;
				}
        this.reqDatas();
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    // await this.reqDatas();
  },
  mounted() {
    this.$nextTick(()=>{
      document.addEventListener('mousedown', this.closeCascader);
    })
  },
  methods: {
    closeCascader() {
      this.cascaderFlag = false;
    },
    deBonce(fn, timeout) {
      clearTimeout(this.deBonce.timeID);
      this.deBonce.timeID = setTimeout(fn, timeout);
    },
    // 获取下拉项
    async reqDatas() {
      // if (this.initChangeFlag) return;
      let isReturn = true;
      this.defaultValue.forEach((item, i) => {
        if(!isEmpty(this.defaultValue[i]) && this.defaultValue[i] != this.valueList[i]){
          isReturn = false;
        }
      });
      if(isReturn) return;
      this.loading = true;
      let params = '';
      if (this.defaultValue[0]) { // 有初始值的时候
        params = {itemValueList: (this.defaultValue).toString()};
      }
      const { data } = await getCascadeCode(params);
      this.loading = false;
      if (this.defaultValue[0]) { // 有初始值的情况对应的省市区等数据
        this.valueList = this.defaultValue;
        data.forEach((item, index)=>{
          this.itemNameList.splice(index, 1, item.itemName);
        })
      }
    },
    clear(){
      const t = ['', '', '', '', ''];
      this.valueList = t.slice();
      this.itemNameList = t.slice();
      this.dataSource = [];
    },
    // 清除input
    handlerClear(type) {
      this.clearList(type);
      // 聚焦下一级自动弹出下一级的下拉框
      this.autoFocusFun(type);
    },
    clearList(type) {
      for (let index = type; index < 5; index++) {
        this.valueList.splice(index, 1, '');
        this.itemNameList.splice(index, 1, '');
      }
    },
    // 自动聚焦当前或是下一级
    autoFocusFun(type) {
      if (((this.simple && type < 3) || !this.simple) && ((this.cascaderLayer && type < this.cascaderLayer) || !this.cascaderLayer) && this.hasAutoFoucs) {
        this.$nextTick(()=>{
          this.$refs[`refs${type}`].focus();
        })
      }
      // hasAutoFoucs 为false，抛出去让使用者自己去处理聚焦和聚焦后的事件
      if (!this.hasAutoFoucs) {
        const map = {
          areaCascaderType: type, // 当前操作
          refsName: `refs${type}`, // 下一级的refsName
          allData: this.dataSource, // 省市区当前选项数据
          valueList: this.valueList, // 当前选中的省市区值
        }
        this.$emit('dataChange', map)
      }
    },
    // 模糊搜索
    async dataFilter(name, type) {
      this.deBonce(async() => {
        const map ={
          queryParam: name,
          itemValue: type !== 0 ? this.valueList[type-1] : '',
        };
        const { data } = await getCascadeCode(map);
        this.dataSource = data;
      }, 500);
    },
    // 触发模糊搜索
    input(value, name, type) {
      this.valueList.splice(type, 1, value);
      this.itemNameList.splice(type, 1, name);
      this.dataFilter(name, type);
    },
    // 有初始值的时候，点击请求相应的数据
    async focus(event, type) {
      // 唤起键盘事件
      this.areaType = type;
      this.cascaderFlag = true;
      // 键盘事件重置
      this.$nextTick(()=>{
        this.hoverIndex = 0;
        this.dataRow = '';
        this.$refs.cascaderLayer.scrollTop = 0;
      })
      let selectData = [];
      if (type === 0) { // 获取省份下拉数据
        const { data } = await getCascadeCode();
        selectData = data;
      } else { // 获取其他下拉数据
        // 渲染当前下拉数据
        if (this.valueList[type-1]) {
          const { data } = await getCascadeCode({itemValue: this.valueList[type-1]});
          selectData = data;
        }
      }
      this.dataSource = selectData;
    },
    async change(value, name) {
      this.initChangeFlag = true;
      if (this.areaType > 4 || !value || (this.simple && this.areaType > 2) || (this.cascaderLayer && this.areaType > this.cascaderLayer-1)) return;
      // 赋值前先清空子联动的值
      this.clearList(this.areaType);
      // 回显相应的下拉值和code
      this.valueList.splice(this.areaType, 1, value);
      this.itemNameList.splice(this.areaType, 1, name);
      this.areaType ++;
      // 最后一级面板收起来
      if (this.areaType > 4 || (this.simple && this.areaType > 2)  || (this.cascaderLayer && this.areaType > this.cascaderLayer-1)) {
        this.cascaderFlag = false;
      } else {
        // 聚焦下一级自动弹出下一级的下拉框
        this.autoFocusFun(this.areaType);
      }
      // 获取当前下拉的选中数据
      const tmp = this.dataSource.filter((item) => item.itemValue === value);
      this.$emit('selectData', this.valueList, tmp);
      this.$emit('updateData', this.valueList, tmp);

    },
    renderCascader(){
      const { cascaderFlag, dataSource, change, hoverIndex } = this;
      return (
        cascaderFlag && <div class="cascader" ref="cascaderLayer">
            { dataSource.length !==0
              ? <ul>
                {
                  dataSource.map((item, index) => {
                    return <li class={{'isHover': index == hoverIndex}} onclick={() => {
                      change(item.itemValue, item.itemName);
                    }}>{item.itemName}</li>;
                  })
                }
              </ul> : <wg-empty />
            }
          </div>
      )
    },
    stopPropagation(event) {
      event.stopPropagation();
    },
    // 上键
    keyUp(data) {
      if (this.hoverIndex == 0) {
        //当选中的index等于0时，说明到顶了，再按上键就要返回到表格的底部，并计算距离表格顶部的距离
        this.hoverIndex = data.length - 1;
        this.dataRow = data[this.hoverIndex]; // 当前已选择行
        let height = 34;
        this.$refs.cascaderLayer.scrollTop = height * (data.length - 5);
      } else {
        let height = 34;
        this.hoverIndex = this.hoverIndex - 1;
        this.dataRow = data[this.hoverIndex];
        if (this.hoverIndex > data.length - 6) {
          this.$refs.cascaderLayer.scrollTop = ((data.length - 1)*height);
        } else {
          let height = 34;
          this.$refs.cascaderLayer.scrollTop -= height;
        }
      }
    },
    // 下键
    keyDown(data) {
      this.dataRow = data[this.hoverIndex + 1]; // 当前已选择行
      this.hoverIndex = this.hoverIndex + 1;
      // 已经是最后一行, 回到第一行
      if (this.hoverIndex === data.length) {
        this.hoverIndex = 0;
        this.dataRow = data[this.hoverIndex];
        let height = 34;
        this.$refs.cascaderLayer.scrollTop = height * this.hoverIndex;
      } else {
        if(this.hoverIndex <= 5) {
          this.$refs.cascaderLayer.scrollTop = 0;
        } else {
          let height = 34;
          this.$refs.cascaderLayer.scrollTop = this.hoverIndex * height * 0.9;
        }
      }
    },
    // 键盘事件
    tabkey(event, type) {
      event.preventDefault();
      // 表格为空，不执行下方
      if (this.dataSource.length == 0) {
        return;
      }
      if (event.keyCode === 40) {
        // 向下
        this.keyDown(this.dataSource);
      } else if (event.keyCode == 38) {
        // 向上
        this.keyUp(this.dataSource);
      } else if (event.keyCode == 13) {
        // 回车勾选
        if (this.dataRow === '') {
          this.dataRow = this.dataSource[0];
        }
        this.change(this.dataRow.itemValue, this.dataRow.itemName);
      }
    }
  },
  render() {
    const { simple, renderCascader, cascaderLayer, defaultDisabled, disabled } = this;
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
      name: this.itemNameList,
      placeholder: '省/直辖市',
      loading: this.loading,
      input: this.input,
      focus: this.focus,
      clear: this.handlerClear,
      tabkey: this.tabkey,
    };

    const list = [
      {
        ...json,
        disabled: defaultDisabled[0] || disabled || false,
      },
      {
        ...json,
        placeholder: '市',
        disabled: defaultDisabled[1] || disabled || false,
      },
      {
        ...json,
        placeholder: '区/县',
        disabled: defaultDisabled[2] || disabled || false,
      },
      {
        ...json,
        placeholder: '乡镇/街道',
        disabled: defaultDisabled[3] || disabled || false,
      },
      {
        ...json,
        placeholder: '村委会/社区',
        disabled: defaultDisabled[4] || false,
      },
    ];
    if (!isEmpty(cascaderLayer)) {
      list.splice(cascaderLayer, 5 - cascaderLayer);
    }
    if (simple) {
      //简单模式下，只显示省市区
      list.splice(3, 2);
    }
    return (
      <div class="wg-cascader" onmousedown={(event)=>this.stopPropagation(event)}>
        {list.map((c, i) => {
          return (
            <wg-el-input
              ref={`refs${i}`}
              {...{ props }}
              {...{ on }}
              disabled={c.disabled}
              placeholder={c.placeholder}
              value={c.name[i]}
              nativeOnKeyup={(v) => {
                c.tabkey(v, i);
              }}
              onfocus={(v) => {
                c.focus(v, i);
              }}
              oninput={(v) => {
                c.input(c.value[i], v, i);
              }}
              onclear={() => {
                c.clear(i);
              }}
            >
              <wg-icon name="icon-zuojiantou1" slot="suffix" class="selectIcon"></wg-icon>
            </wg-el-input>
          );
        })}
        {
          renderCascader()
        }
        {this.$slots.input}
      </div>
    );
  },
};
</script>

<style lang="less" scoped>
@import './main.less';
</style>
