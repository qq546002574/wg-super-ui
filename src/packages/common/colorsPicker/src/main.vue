<template lang="html">
  <div>
    <div class="m-colorPicker" ref="colorPicker" v-clickoutside="hide" v-on:click="event => { event.stopPropagation() }">
      <div class="colorBtn"
        :style="`background-color: ${displayedColor}`"
        @click="openPanel"
      ></div>
      <div class="divbox" v-if="showPicker" ref="colorDiv" :style="{left: `${divleft}px`}">
        <div class="ht">
          <div class="selectcorol">请选择试管颜色</div>
          <div class="gbicon">
            <wg-icon name="icon-guanbi1" @click="hide"></wg-icon>
          </div>
        </div>
        <div class="box">
          <div class="hd">
            <div class="changeColor" @click="showFn(true)">
              <div :class="circleColor('one')"></div>
              <div :class="swatchesColor('one')">色板选择</div>
            </div>
            <div class="changeColor" @click="showFn(false)">
              <div :class="circleColor('two')"></div>
              <div :class="swatchesColor('two')">自由选择</div>
            </div>
          </div>
          <div v-show="showoneOrtwo">
            <ul class="tColor">
              <li
                v-for="(coloritem, index) of tColor"
                :key="index"
                :style="{ backgroundColor: coloritem }"
                @click="updataValue(coloritem)"
              ></li>
            </ul>
          </div>
          <div v-if="!showoneOrtwo">
            <picker-dropdown
              style="display:block;"
              ref="dropdown"
              v-model="showPicker"
              :color="color">
            </picker-dropdown>
          </div>
          <div class="alphaClass">
            <alpha-slider ref="alpha" :color="color" class="alphaSliderClass"></alpha-slider>
            <div>{{color.get('alpha')}}%</div>
          </div>
          <div class="dataButton">
            <div>
              <div class="firstClass">
                <div class="colorBox" :style="{'background':displayedColor}"></div>
                <wg-el-input
                  style="width:78px"
                  v-model="valueObject.value"
                  @keyup.native.enter="handleConfirm('hex')"
                  @blur="handleConfirm('hex')"
                  :validate-event="false"
                  size="mini">
                </wg-el-input>
              </div>
              <div class="divcolorbox">HEX</div>
            </div>
            <div v-for="(item,index) in rgbList" :key="`rgb${index}`">
              <wg-el-input
                style="width:49px"
                v-model="valueObject[item.name]"
                @keyup.native.enter="handleConfirm('rgba')"
                @blur="handleConfirm('rgba')"
                :validate-event="false"
                size="mini">
              </wg-el-input>
              <div class="divcolorbox">{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Color from './color';
  import PickerDropdown from './components/picker-dropdown.vue';
  import AlphaSlider from './components/alpha-slider.vue';
  import Clickoutside from '@/element/utils/clickoutside';

  export default {
  name: 'wgColorsPicker',

  directives: {
    Clickoutside
  },
  components: {
    PickerDropdown,
    AlphaSlider,
  },
  props: {
    // 当前颜色值
    value: {
      type: String,
      required: true
    },
    // 默认颜色
    defaultColor: {
      type: String,
      default: '#000000'
    },
  },
  data () {
    const color = new Color({});
    return {
      showoneOrtwo: true,
      // 色块颜色
      tColor: [ '#000000', '#555555', '#898989', '#BBBBBB', '#D8D8D8', '#E7E7E7', '#F1F1F1', '#FFFFFF',
      '#FFCACA', '#ECC9FF', '#FADAAA', '#BDDDFF', '#B8EBF4', '#A8EDD5', '#B7FAAC', '#FFD7F1',
      '#E97171', '#AD4DE1', '#E7A363', '#9097FF', '#67CDE3', '#61CA9B', '#7AD249', '#DD5CBD', 
      '#AA2D2D', '#792BA4', '#BF7339', '#5268EE', '#24AEB9', '#18B284', '#67AF2B', '#AE3E94',
      '#7A1A1A', '#590971', '#824108', '#3D46A0', '#16606F', '#157B5D', '#44881D', '#78216C'],
      color,
      showPicker: false,
      showAlpha: true,
      rgbList:[
        {name:'R'},
        {name:'G'},
        {name:'B'},
      ],
      valueObject: {
        value: '',
        R: '',
        G: '',
        B: '',
      },
      divleft: 0,
    }
  },
  computed: {
    displayedColor() {
      if (!this.value) {
        return 'transparent';
      }
      return this.displayedRgb(this.color, this.showAlpha);
    },
    circleColor() {
      return function(type){
        if(type==='one'){
          return this.showoneOrtwo? 'button':'buttonDisabled'
        }else {
          return this.showoneOrtwo? 'buttonDisabled':'button'
        }
      };
    },
    swatchesColor() {
      return function(type){
        if(type==='one'){
          return this.showoneOrtwo? 'swatches':'swatchesDisabled'
        }else {
          return this.showoneOrtwo? 'swatchesDisabled':'swatches'
        }
      };
    }
  },
  watch: {
    value(val) {
      if (val && val !== this.color.value) {
        this.color.fromString(val);
      } 
    },
    color: {
      deep: true,
      handler() {
        const value = this.color.value;
        this.$emit('input', value);
        this.$emit('change', this.color);
      }
    },
  },
  mounted() {
    const value = this.value;
    if (value) {
      this.color.fromString(value);
    }else {
      this.color.fromString(this.defaultColor);
    }
    const { r, g, b } = this.color.toRgb();
    this.color.set('R',r)
    this.color.set('G',g)
    this.color.set('B',b)
  },
  methods: {
    handleConfirm(type) {
      if(type==='hex'){
        this.color.fromString(this.valueObject.value);
      }else {
        this.color.fromString(`rgba(${ this.valueObject.R }, ${ this.valueObject.G  }, ${ this.valueObject.B  }, ${ this.color.get('alpha') / 100 })`);
      }
    },
    // 展示色板或自由选择
    showFn(flag){
      this.showoneOrtwo = flag
    },
    openPanel () {
      this.showPicker = !this.showPicker
      this.divleft = 0
      if(this.showPicker) {
        this.$nextTick(()=> {
          const rect = this.$refs.colorDiv.getBoundingClientRect();
          const flag = rect.width + rect.left > window.innerWidth
          if(flag) {
            this.divleft = -(rect.width + rect.left - window.innerWidth +10)
          }
        })
      }
    },
    // 更新组件的值 value
    updataValue (val) {
      this.color.fromString(val);
    },
    hide() {
      this.showPicker = false;
    },
    displayedRgb(color, showAlpha) {
      if (!(color instanceof Color)) {
        throw Error('color should be instance of Color Class');
      }

      const { r, g, b } = color.toRgb();
      this.$set(this.valueObject,'value',color.value)
      this.$set(this.valueObject,'R',r)
      this.$set(this.valueObject,'G',g)
      this.$set(this.valueObject,'B',b)
      return showAlpha
        ? `rgba(${ r }, ${ g }, ${ b }, ${ color.get('alpha') / 100 })`
        : `rgb(${ r }, ${ g }, ${ b })`;
    }
  },
}
</script>
<style lang="less" scoped>
.m-colorPicker{
    position: relative; 
    text-align: left; 
    font-size: 14px; 
    display: inline-block;
    outline: none;
    ul,li,ol{ 
      list-style: none; 
      margin: 0; 
      padding: 0; 
    }
    .colorBtn{ 
      // width: 15px; 
      // height: 15px; 
      width: 42px;
      height: 24px;
      border: 1px solid rgba(239,240,241,1);
      border-radius: 2px;
    }
    .colorBtn.disabled{ 
      cursor: no-drop; 
    }
    .divbox {
      width: 308px;
      height: 360px;
      box-sizing: border-box;
      position: absolute; 
      background: #fff; 
      border: 1px solid #ddd; 
      // visibility: hidden; 
      border-radius: 2px; 
      // opacity: 0; 
      transition: all .3s ease;
      box-sizing: content-box;
      background: #FFFFFF;
      box-shadow: 0px -3px 4px 0px rgba(158,162,168,0.13);
      box-shadow: 0px 8px 16px -5px rgba(0,0,0,0.08);
      box-shadow: 0px 4px 10px 2px rgba(0,0,0,0.04);
      box-shadow: 0px 2px 6px 5px rgba(0,0,0,0);
      z-index: 10; 
      .ht{
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #F6F8FA;
        padding:8px 16px;
        .selectcorol{
          font-family: PingFangSC-Semibold;
          font-size: 14px;
          color: #202122;
          letter-spacing: 0;
          font-weight: 600;
        }
        .gbicon{
          cursor: pointer;
          color:  #B8BBBC;
        }
      }
      .box{
        width: 100%; 
        margin-top: 2px; 
        padding: 8px 16px; 
        .hd{
          display: flex;
          align-items: center;
          margin-bottom:16px;
          .changeColor{
            display: flex;
            align-items: center;
            margin-right:20px;
            cursor: pointer;
            .swatches{
              width: 56px;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #22ACE3;
              letter-spacing: 0;
              font-weight: 400;
            }
            .swatchesDisabled{
              width: 56px;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #505356;
              letter-spacing: 0;
              font-weight: 400;
            }
            .button{
              width: 24px;
              height: 24px;
              background: #22ACE3;
              border: 1px solid rgba(239,240,241,1);
              border-radius: 12px;
            }
            .buttonDisabled{
              width: 24px;
              height: 24px;
              background-image: linear-gradient(180deg, #FFFFFF 0%, #838383 100%);
              border: 1px solid rgba(239,240,241,1);
              border-radius: 12px;
            }
          }
        }
        .tColor{
          margin-bottom:3px;
          li{ 
            width: 24px; 
            height: 24px; 
            display: inline-block;
            margin: 0 12px 10px 0; 
            transition: all .3s ease; 
            border: 1px solid rgba(239,240,241,1);
            border-radius: 2px;
            box-sizing: border-box;
          }
          li:nth-child(8n){
            margin: 0 0px 10px 0; 
          }
          li:hover{ 
            box-shadow: 0 0 5px rgba(0,0,0,.4); 
            transform: scale(1.3); 
          }
        }
      }
    }
    .divbox.open{ 
      visibility: visible; 
      opacity: 1;
      z-index: 1; 
    }
    
    .dataButton {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width:100%;
      margin-top:12px;
      .firstClass{
        width:105px;
        background: #FFFFFF;
        border: 1px solid rgba(191,195,197,1);
        border-radius: 2px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .colorBox{
          width: 24px;
          height: 24px;
          // background: #7AD249;
          border: 1px solid rgba(239,240,241,1);
          border-radius: 2px;
        }
        /deep/ .el-input__inner{
          border:none !important;
        }
      }
      .divcolorbox{
        text-align: center;
        height: 17px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #505356;
        letter-spacing: 0;
        font-weight: 400;
        margin-top:6px;
      }
    }
    .alphaClass{
      display:flex;
      justify-content: space-between;
      align-items: center;
      height: 14px;
      .alphaSliderClass{
        width:85%;
      }
    }
  }

</style>