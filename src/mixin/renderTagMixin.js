import { isEmpty, getDaterange } from "@/utils/validate";
// import vxeTableCom from "@/packages/business/blendPage/src/components/vxeTableCom";
const pickerOptions = {
  shortcuts: [
    {
      text: '最近一周',
      onClick: (picker) => {
        const t = getDaterange(7);
        picker.$emit('pick', t);
      },
    },
    {
      text: '最近一个月',
      onClick: (picker) => {
        const t = getDaterange(30);
        picker.$emit('pick', t);
      },
    },
    {
      text: '最近三个月',
      onClick: (picker) => {
        const t = getDaterange(90);
        picker.$emit('pick', t);
      },
    },
  ],
  disabledDate: (time) => {
    // const t = 24 * 3600 * 1000 + Date.now();
    const t = `${XEUtils.toDateString(Date.now(), 'yyyy-MM-dd')} 23:59:59`;
    return time.getTime() > new Date(t).getTime();
  },
}
export default {
  props:{
    searchs:{ //searchBar要展示的搜索内容
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      value: this.getValue(),
      customParams: this.getCustomParams(),
      customOptionData: this.getCustomOptionData(),
    }
  },
  created() {
    const t = this.searchs.filter(c=>!isEmpty(c.defaultValue));
    t.forEach(c=>{
      if(typeof(c.defaultValue) === 'function') {
        this.value[c.prop] = c.defaultValue();
      }else{
        this.value[c.prop] = c.defaultValue;
      }
    })
  },
  // watch:{
  //   searchs: {
  //     handler: function (newVal, oldVal) {
  //       console.log('=======xxxxxxxxfffffffff=======>' , newVal);
  //     }
  //   },
  // },
  methods: {
    getFields(){
      return {
        value: this.value,
        customParams: this.customParams,
        customOptionData: this.customOptionData,
      }
    },
    setFields(map){
      Object.keys(map).map( key =>{
        this.value[key] = map[key];
      })
    },
    renderTag({ item , callback = ()=>{}}) {
      const k = {
        on: {
          ...item.on,
          change: (e) => {
            this.inputKeydown({key: 'Enter'}, item.keyupEntry, callback);
            if(item.on?.change) item.on?.change(e);
          },
        },
        props: {...item},
        attrs: {...item},
        scopedSlots: {...item.slots},
      };
      let modelValue = {
        name: this.value[item.showProp],
        code: this.value[item.prop],
      };
      const set = (o) => {
        this.value[item.prop] = o.code;
        this.value[item.showProp] = o.name;
      };
      switch (item.tag){
        case 'empty':{
          return (<div class="flex" style="height:28px"/>)
        }
        case 'empty_longer':{
          return (<div class="flex" style="height:28px"/>)
        }
        case 'divider': {
          return (<el-divider></el-divider>)
        }
        case 'text':{
          return (<span {...k}>{item.value}</span>)
        }
        case 'hp-title':{
          return (<div class="flex ac hp-title-text" {...k}><div class={item.value && 'mr8'}>{item.value}</div><div class="hp-title-render flex-1"/></div>)
        }
        case 'hp-inputNumber': {
          const validate = () => {
            item.min = item.min ? item.min : 0;
            item.max = item.max ? item.max : 9999999;
            if (this.value[item.prop] < item.min) {
              this.value[item.prop] = item.min;
            } else if (this.value[item.prop] > item.max) {
              this.value[item.prop] = item.max;
            }
          };
          return (
              <wg-el-input ref={item.prop} placeholder='请输入' type="number" fixed={item.suffix ? (item.suffix === '元' ? 2 : 0) : 2} clearable={true} onBlur={validate} v-model={this.value[item.prop]} {...k} >
                <template slot="suffix"><span>{item.suffix ? item.suffix : '元'}</span></template>
              </wg-el-input>
          );
        }
        case 'hp-time-input':{
          // const validate = () => {
          //   // item.min = item.min ? item.min : 0;
          //   // item.max = item.max ? item.max : 9999999;

          //   // if (this.value[item.prop] < item.min) {
          //   //   this.value[item.prop] = item.min;
          //   // } else if (this.value[item.prop] > item.max) {
          //   //   this.value[item.prop] = item.max;
          //   // }
          // };
          const renderInput = (item, itemKey, validate = ()=>{}) =>{
            // const suffixStr = itemKey === item.prop1 ? '天' : itemKey === item.prop2 ? '时' : '分';
            // console.log('============> suffixStr', itemKey === item.prop1);
            return itemKey ? (
                <wg-el-input class="mr8" ref={itemKey} max={60} placeholder='请输入' type="number" fixed="0" onBlur={validate} clearable={true} v-model={this.value[itemKey]} {...k} >
                  {itemKey && <template slot="suffix"><span>{itemKey === item.prop1 ? '天' : itemKey === item.prop2 ? '时' : '分'}</span></template>}
                </wg-el-input>
            ) : (
                <wg-el-input class="mr8" style={{display:'none'}} ref={itemKey} placeholder='请输入' type="number" fixed="0" clearable={true}  {...k} >
                  {itemKey && <template slot="suffix"><span>{itemKey === item.prop1 ? '天' : itemKey === item.prop2 ? '时' : '分'}</span></template>}
                </wg-el-input>
            )
          }
          return (
              <div class="flex ac">
                {renderInput(item, null)}
                {renderInput(item, item.prop1, ()=>{
                  if (this.value[item.prop1] < 0) {
                    this.value[item.prop1] = 0;
                  } else if (this.value[item.prop1] > 9999) {
                    this.value[item.prop1] = 9999;
                  }
                })}
                {renderInput(item, item.prop2, ()=>{
                  if (this.value[item.prop2] < 0) {
                    this.value[item.prop2] = 0;
                  } else if (this.value[item.prop2] > 24) {
                    this.value[item.prop2] = 24;
                  }
                })}
                {renderInput(item, item.prop3, ()=>{
                  if (this.value[item.prop3] < 0) {
                    this.value[item.prop3] = 0;
                  } else if (this.value[item.prop3] > 60) {
                    this.value[item.prop3] = 60;
                  }
                })}
              </div>
          )
        }
        case 'button':{
          return (<wg-button {...k}>{item.value}</wg-button>)
        }
        case 'wg-area-cascader-check':{
          return (
              <wg-area-cascader-check
                  ref={item.prop}
                  v-model={this.value[item.prop]}
                  onSelectData={(v)=>{
                    // isEmpty(item.propKey) ? this.value[item.prop]=v : this.value[item.prop]=v[item.propKey]
                    this.inputKeydown({key: 'Enter'}, item.keyupEntry, callback)
                  }}
                  {...k}
              />
          )
        }
        case 'codeSelect':
        case 'wg-code-select':
          return (
              <wg-code-select
                  ref={item.prop}
                  v-model={this.value[item.prop]}
                  config={{ code: item.code }}
                  {...k}
              ></wg-code-select>
          );
        case 'wg-switch':
          return (
              <wg-switch
                  ref={item.prop}
                  v-model={this.value[item.prop]}
                  active-color={item.activeColor}
                  active-value={item.activeValue}
                  inactive-value={item.inactiveValue}
              ></wg-switch>
          );
        case 'wg-enable-select':
          return (
              <wg-enable-select
                  ref={item.prop}
                  style="width:100%"
                  v-model={this.value[item.prop]}
                  {...k}
              ></wg-enable-select>
          );
        case 'wg-org-tree-input': // 组织机构下拉树
          return (
              <wg-org-tree-input
                  ref={item.prop}
                  v-model={this.value[item.prop]}
                  {...k}
                  workDeptName={this.value[item.valueKey]}
              />
          );
        case 'wg-spell-input':// 拼音码和五笔码组件，需要和拼音码、五笔码输入框联动 pyCode.sync , wbCode.sync
          let self = this;
          return (
              <wg-spell-input
                  ref={item.prop}
                  v-model={this.value[item.prop]}
                  {...k}
                  pyCode={this.value[item.pyCode]}
                  wbCode={this.value[item.wbCode]}
                  on={{
                    ['update:pyCode']:this.updateValueFormKey.bind(this,item.pyCode),
                    ['update:wbCode']:this.updateValueFormKey.bind(this,item.wbCode),
                  }}

              />
          );
        case 'search':
          return <wg-el-input ref={item.prop}  v-model={this.value[item.prop]} onClear={callback} {...k} suffixIcon="el-icon-search" clearable={true} nativeOnkeydown={(e) => this.inputKeydown(e, true, callback)} />;
        case 'textarea':
          return  <wg-el-input ref={item.prop}  v-model={this.value[item.prop]} {...k} type="textarea" clearable={true} nativeOnkeydown={(e) => this.inputKeydown(e, item.keyupEntry, callback)} />
        case 'slot':
          return item.render();
        case 'radio':
        case 'wg-radio':
        case 'radioGroup':
        case 'wg-radio-group':
        case 'el-radio-group':
        case 'el-radio':
          const radioOptions = item?.options || [];
          return (
              <el-radio-group v-model={this.value[item.prop]}
                              {...k}  >
                {
                  radioOptions.map( c =>{ return (<el-radio props={{ ...c, label:c.itemValue }}>{c.itemLabel}</el-radio>) })
                }
              </el-radio-group>
          );
        case 'checkbox':
        case 'wg-checkbox':
        case 'el-checkbox':
          return (
              <el-checkbox v-model={this.value[item.prop]} props={{ ...item, label:item.itemValue }} {...k}>
                {item.itemLabel}
              </el-checkbox>
          );
        case 'checkboxGroup':
        case 'wg-checkbox-group':
        case 'el-checkbox-group':
          const checkOptions = item?.options || [];
          return (
              <el-checkbox-group v-model={this.value[item.prop]} {...k}>
                {
                  checkOptions.map( c =>{ return (<el-checkbox props={{ ...c, label:c.itemValue }}>{c.itemLabel}</el-checkbox>) })
                }
              </el-checkbox-group>
          );
        case 'wg-input-table':
          return (
              <wgInputTableExpand
                  attrs={item}
                  props={item}
                  dataType={item.dataType}
                  value={modelValue}
                  onInput={(o) => set(o)}
                  {...k}
              ></wgInputTableExpand>
          );
        case 'wg-pull-down':
          return (
              <wg-pull-down
                  dataType={item.dataType}
                  v-model={this.value[item.prop]}
                  style="width:100%"
                  {...{
                    on: {
                      select: (e) => this.inputKeydown({key: 'Enter'}, item.keyupEntry, callback),
                      ...item.on
                    },
                    props: {...item},
                    attrs: {...item},
                  }}
              ></wg-pull-down>
          );
        case 'wg-pop-down':
          return (
              <wg-pop-down
                  tag={item.dataType}
                  v-model={this.value[item.prop]}
                  style="width:100%"
                  placeholder={item.placeholder? item.placeholder : '请选择'}
                  {...{
                    on: {
                      selectItem: (v) => {
                        // console.log(v);
                        this.$nextTick(()=>{
                          this.inputKeydown({key: 'Enter'}, item.keyupEntry, callback)
                        });
                      },
                      ...item.on
                    },
                    props: {...item, tag: item.dataType},
                    attrs: {...item},
                  }}
              ></wg-pop-down>
          );
        case 'wg-read-card':
          return (
              <wg-read-card
                  ref={item.prop}
                  v-model={this.value[item.prop]}
                  {
                    ...{
                      on: {
                        getData: () => {
                          this.inputKeydown({key: 'Enter'}, true, callback)
                        },
                        clear: () => {
                          this.inputKeydown({key: 'Enter'}, true, callback)
                        },
                        ...k.on
                      },
                      props: {...item, tag: item.dataType},
                      attrs: {...item},
                    }
                  }
              ></wg-read-card>
          );
        case 'el-select-tree':
          return (
              <selectTreeExpand
                  attrs={item}
                  props={item}
                  ref={item.prop}
                  dataType={item.dataType}
                  value={modelValue}
                  onInput={(o) => set(o)}
              ></selectTreeExpand>
          )
        case 'wg-time-picker':
        case 'timePicker':
          return (
              <wg-time-picker ref={item.prop} style="width:100%" v-model={this.value[item.prop]} value-format="yyyy-MM-dd HH:mm:ss" {...k}/>
          )
        case 'date':
        case 'datePicker':
        case 'el-date-picker':
        case 'wg-date-picker':
          const { type } = item;
          return (
              <wg-date-picker ref={item.prop} style="width:100%" v-model={this.value[item.prop]} value-format='yyyy-MM-dd' pickerOptions={type === 'daterange' ? pickerOptions : {}} {...k}/>
          )
        case 'inputNumber':
        case 'el-input-number':
        case 'wg-el-input-number': {
          const validate = () => {
            if (this.value[item.prop] < item.min) {
              this.value[item.prop] = item.min;
            } else if (this.value[item.prop] > item.max) {
              this.value[item.prop] = item.max;
            }
          };
          return (
              <wg-el-input ref={item.prop} type="number" onBlur={validate} v-model={this.value[item.prop]} {...k} >
                {item.slots?.append && <div slot="append"></div>}
                {item.slots?.prepend && <div slot="prepend"></div>}
                {item.slots?.suffix && <div slot="suffix"></div>}
                {item.slots?.prefix && <div slot="prefix"></div>}
              </wg-el-input>
          );
        }
        case 'select':
        case 'el-select':
        case 'wg-el-select': {
          return (
              <wg-el-select
                  ref={item.prop}
                  style="width:100%"
                  v-model={this.value[item.prop]}
                  {...k}
              >
                {item.options.map(c => {

                  return (
                      <wg-el-option attrs={c} props={c}>
                        {item.optionsRender&&item.optionsRender(c)}
                      </wg-el-option>
                  )
                })}
              </wg-el-select>
          );
        }
        case 'wg-menu-select':{
            return (
                <wg-el-select
                    ref={item.prop}
                    style="width:100%"
                    v-model={this.value[item.prop]}
                    {...k}
                    onChange={this.changeMenuSelect.bind(this, item)}
                >
                  {item.options.map(c => {

                    return (
                        <wg-el-option attrs={c} props={c}></wg-el-option>
                    )
                  })}
                </wg-el-select>
            );
          }
        case 'doctor':
        case 'person':
        case 'personSelect':
        case 'wg-person-select':{
            return (
                <wg-person-select ref={item.prop} onSelectItem={(v)=>{
                  isEmpty(item.propKey) ? this.value[item.prop]=v : this.value[item.prop]=v[item.propKey]
                  this.inputKeydown({key: 'Enter'}, item.keyupEntry, callback)
                }}
                                  defaultCode={this.value[item.prop]}
                                  {...k}
                />
            )
          }
        case 'yljg':
        case 'yq':
        case 'zzjg':
          item.mode = item.tag;
        case 'orgSelect':
        case 'wg-org-select':{
            return item.select ? (
                <wg-org-select ref={item.prop} v-model={this.value[item.prop]}
                               style="width:100%"
                               {...k}
                               onSelectItem={(e) => this.inputKeydown({key: 'Enter'}, item.keyupEntry, callback)}
                />
            ) : (
                <wg-org-select ref={item.prop} onSelectItem={(v)=>{
                  isEmpty(item.propKey) ? this.value[item.prop]=v : this.value[item.prop]=v[item.propKey];
                  this.inputKeydown({key: 'Enter'}, item.keyupEntry, callback)
                }}
                               style="width:100%"
                               defaultCode={this.value[item.prop]}
                               {...k}
                />
            )
          }
        case 'wg-upload-img': {
            return this.value[item.prop] ? (
                <div>
                  <img style={item.previewStyle} src={this.value[item.prop]}></img>
                  <wg-upload-file accept=".jpeg,.png,.jpg" {...k} onSuccess={(value) => {this.uploadImg(item, value);}}></wg-upload-file>
                </div>
            ) : (
                <div>
                  <div style={item.previewStyle + 'margin: 0 0 10px;display:flex;justify-content:center;align-items:center;color:#e2e1e1;'} >图片预览</div>
                  <wg-upload-file accept=".jpeg,.png,.jpg" {...k} onSuccess={(value) => {this.uploadImg(item, value);}}></wg-upload-file>
                </div>
            ) ;
          }
        case 'medicalAuth': {
            return this.rendermMdicalAuth(item, k);
          }
        case 'customSelect':{
            const bool = item.multiple;

            const options = this.customOptionData[item.prop].length === 0 ? item?.options || [] : this.customOptionData[item.prop];
            return (
                <wg-el-select ref={item.prop} onfocus={this.localSelectOption.bind(this,item)} style="width:100%" v-model={this.value[item.prop]} {...k}>
                  {options.map(c => {
                    return (
                        <wg-el-option attrs={c} props={c}></wg-el-option>
                    )
                  })}
                </wg-el-select>
            )
          }
        case 'vxeTable': {
            return (
                <vxeTableCom
                    ref="vxeTableCom"
                    {...k}
                    onchange={this.handlerVxeTableChange.bind(this, item.prop)}
                />
            )
          }
        case 'wg-specialist': {
            return (
                <wg-specialist
                    ref={item.prop}
                    v-model={this.value[item.prop]}
                    {...k}
                ></wg-specialist>
            )
          }
        case 'wg-doctor-select': {
            return (
                <wg-doctor-select {...k} v-model={this.value[item.prop]}></wg-doctor-select>
            )
          }
        case 'input':
        case 'wg-input':
        case 'wg-el-input':
          // keyupEntry
          return <wg-el-input ref={item.prop} v-model={this.value[item.prop]} {...k} nativeOnkeydown={(e) => this.inputKeydown(e, item.keyupEntry, callback)} >
            {item.slots?.append && <div slot="append"></div>}
            {item.slots?.prepend && <div slot="prepend"></div>}
            {item.slots?.suffix && <div slot="suffix"></div>}
            {item.slots?.prefix && <div slot="prefix"></div>}
          </wg-el-input>;
        default:{
            return <wg-el-input ref={item.prop} v-model={this.value[item.prop]} {...k}></wg-el-input>;
          }
        }
        },
        // vxeTable 数据发生变化
        handlerVxeTableChange(propName, value) {
          this.value[propName] = value;
        },
        rendermMdicalAuth(item, k) {
          const { params, prop } = item;
          const myEval = null;
          return (
              <wg-input-table-check
                  collapseTags={item.collapseTags}
                  isFixHeight={item.isFixHeight}
                  height={"350px"}
                  placeholder="请选择"
                  config={{
                    ...item.config,
                    tableData: this.customOptionData[item.prop]?.records || this.customOptionData[item.prop],
                    pageConfig: {
                      isPage: item.isPage,
                      total: this.customOptionData[item.prop]?.total || 0,
                      currentPage: this.customOptionData[item.prop]?.current || 1,
                      pageSize: this.customOptionData[item.prop]?.size || item?.pageSize,
                    },
                  }}
                  v-model={this.value[prop]}
                  oninputSearch={this.inputSearch.bind(this, item)}
              />
          )
        },
        async inputSearch(item, searchParams){
          const { currentPage, pageSize, type, value } = searchParams;
          const { params, prop, requestParams, request } = item;

          if (type !== 'entry'){
            return;
          }

          const myP = this.getParams(requestParams, {
            ...params,
            'queryParam':value,
          });
          const rsp = await request({
            ...myP,
            currentPage,
            pageSize,
          });
          if(rsp.isSuccess){
            this.customOptionData[prop] = {
              ...rsp.data,
            };
          }
        },
        async localSelectOption(item){
          const { params, prop, requestParams, optionModel } = item;
          if(this.customOptionData[prop].length > 0) return; // 已经加载出来数据不需要再获取
          const myP = this.getParams(requestParams, params);
          const rsp = await item.request(myP);
          if(rsp.isSuccess){
            this.customOptionData[item.prop] = rsp.data.map((c) => { return {label:c[optionModel.label], value:c[optionModel.value]}});
          }
        },
        getParams(linkParams, params){
          let json = {}
          Object.keys(linkParams).forEach((key) => {
            json[key] = params[linkParams[key]];
          })
          return json;
        },
        async mdicalAuthClick(item) {
          const { params, prop, requestParams, isPage, request } = item;

          if(this.customOptionData[prop].length > 0) return; // 已经加载出来数据不需要再获取
          const myP = this.getParams(requestParams, params);
          if(isPage){
            myP.currentPage = 1;
            myP.pageSize = 20;
          }
          const rsp = await request(myP);
          if(rsp.isSuccess){
            this.customOptionData[prop] = {
              ...rsp.data,
            };
          }
        },
        changeMenuSelect(item, value){
          const t = item.options.filter((c) => c.value === value);
          const json = {};
          json[item.menuKey] =  t[0].url;
          this.value = Object.assign({},this.value, json);
        },
        uploadImg(item, value) {
          const json = {};
          json[item.prop] = value.fullPath;
          json[item.iconKey] = value.relativePath;
          this.value = Object.assign({},this.value, json);
        },
        updateValueFormKey(key, v) {
          const json = {};
          json[key] = v;
          this.value = Object.assign({},this.value, json)
        },
        searchClear(item, callback) {
          callback();
        },
        inputKeydown(e, keyupEntry , callback){
          if( keyupEntry && e.key === 'Enter') callback();
        },
        getValue(){
          let json = {};
          this.searchs.forEach(c=>{
            if(c.prop){
              if(c.tag === 'el-checkbox-group' || c.tag === 'medicalAuth' || c.tag === 'vxeTable'){
                json[c.prop] = [];
              } else if(c.tag === 'wg-pop-down'){
                json[c.prop] = [{label:'',value:''}];
              } else {
                json[c.prop] = '';
              }
            }
            let bool = true;
            let index = 1;
            let key = 'prop';
            while (bool){
              key = `prop${index++}`;
              if(isEmpty(c[key])){
                bool = false;
              }else{
                json[c[key]] = '';
              }
            }
          });
          return json;
        },
        getCustomOptionData(){
          let json = {};
          const t = this.searchs.filter((c) => !isEmpty(c.request));
          t.forEach((c) => {
            json[c.prop] = [];
          })
          return json;
        },
        getCustomParams(){
          let json = {};
          const t = this.searchs.filter((c) => !isEmpty(c.params));
          t.forEach((c) => {
            json[c.prop] = c.params;
          })
          return json;
        }
        },
        };
